import { MAX_TTS_TEXT_LENGTH, streamSpeech } from '../server/src/services/tts.js';

const MAX_REQUESTS_PER_MINUTE = 120;
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
    let text = '';
    if (request.method === 'GET') {
      text = new URL(request.url).searchParams.get('text')?.trim() ?? '';
    } else if (request.method === 'POST') {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return jsonResponse(400, 'Request body must be valid JSON.');
      }
      text = typeof body === 'object' && body !== null && 'text' in body && typeof body.text === 'string'
        ? body.text.trim()
        : '';
    } else {
      return jsonResponse(405, 'Method not allowed.');
    }

    if (!text || text.length > MAX_TTS_TEXT_LENGTH) {
      return jsonResponse(400, `Text must be between 1 and ${MAX_TTS_TEXT_LENGTH} characters.`);
    }

    const forwardedFor = request.headers.get('x-forwarded-for') ?? 'unknown';
    const ip = forwardedFor.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip, Date.now())) {
      return jsonResponse(429, 'Too many speech requests. Try again shortly.');
    }

    let iterator: AsyncGenerator<Buffer> | null = null;
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        iterator = streamSpeech(text);
        try {
          for await (const chunk of iterator) {
            const audioBytes = new Uint8Array(chunk.length);
            audioBytes.set(chunk);
            controller.enqueue(audioBytes);
          }
          controller.close();
        } catch (error) {
          console.error('[TTS] Neural speech synthesis failed:', error instanceof Error ? error.message : 'unknown error');
          controller.error(error);
        }
      },
      async cancel() {
        await iterator?.return(undefined);
      },
    });

    return new Response(body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=86400',
      },
    });
  },
};
