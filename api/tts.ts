import { MAX_TTS_TEXT_LENGTH, synthesizeSpeech } from '../server/src/services/tts.js';

const MAX_REQUESTS_PER_MINUTE = 30;
const requestCounts = new Map<string, { count: number; windowStartedAt: number }>();

function isRateLimited(ip: string, now: number): boolean {
  if (requestCounts.size > 1_000) {
    for (const [knownIp, entry] of requestCounts) {
      if (now - entry.windowStartedAt >= 60_000) requestCounts.delete(knownIp);
    }
  }

  const current = requestCounts.get(ip);
  if (!current || now - current.windowStartedAt >= 60_000) {
    requestCounts.set(ip, { count: 1, windowStartedAt: now });
    return false;
  }

  if (current.count >= MAX_REQUESTS_PER_MINUTE) return true;
  current.count += 1;
  return false;
}

function jsonResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ success: false, message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return jsonResponse(405, 'Method not allowed.');

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(400, 'Request body must be valid JSON.');
    }

    const text = typeof body === 'object' && body !== null && 'text' in body && typeof body.text === 'string'
      ? body.text.trim()
      : '';

    if (!text || text.length > MAX_TTS_TEXT_LENGTH) {
      return jsonResponse(400, `Text must be between 1 and ${MAX_TTS_TEXT_LENGTH} characters.`);
    }

    const forwardedFor = request.headers.get('x-forwarded-for') ?? 'unknown';
    const ip = forwardedFor.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip, Date.now())) {
      return jsonResponse(429, 'Too many speech requests. Try again shortly.');
    }

    try {
      const audio = await synthesizeSpeech(text);
      const audioBytes = new Uint8Array(audio.length);
      audioBytes.set(audio);

      return new Response(audioBytes.buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'private, max-age=86400',
        },
      });
    } catch (error) {
      console.error('[TTS] Neural speech synthesis failed:', error instanceof Error ? error.message : 'unknown error');
      return jsonResponse(502, 'Speech service is temporarily unavailable.');
    }
  },
};
