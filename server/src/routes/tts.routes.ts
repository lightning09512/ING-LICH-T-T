import { Router, Request, Response } from 'express';
import { EdgeTTS } from 'node-edge-tts';

const MAX_TEXT_LENGTH = 800;
const MAX_REQUESTS_PER_MINUTE = 30;
const CACHE_LIMIT = 100;
const audioCache = new Map<string, Buffer>();
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

export function createTtsRouter(): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

    if (!text || text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ success: false, message: 'Text must be between 1 and 800 characters.' });
    }

    const cachedAudio = audioCache.get(text);
    if (cachedAudio) {
      audioCache.delete(text);
      audioCache.set(text, cachedAudio);
      res.set('Content-Type', 'audio/mpeg').set('Cache-Control', 'private, max-age=86400').send(cachedAudio);
      return;
    }

    if (isRateLimited(req.ip ?? req.socket.remoteAddress ?? 'unknown', Date.now())) {
      return res.status(429).json({ success: false, message: 'Too many speech requests. Try again shortly.' });
    }

    try {
      const tts = new EdgeTTS({
        voice: 'en-US-JennyNeural',
        lang: 'en-US',
        outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
        rate: '-5%',
        timeout: 15_000,
      });
      const chunks: Buffer[] = [];

      for await (const chunk of tts.streamAudio(text)) {
        if (Buffer.isBuffer(chunk)) chunks.push(chunk);
      }

      if (chunks.length === 0) {
        return res.status(502).json({ success: false, message: 'Speech service returned no audio.' });
      }

      const audio = Buffer.concat(chunks);
      if (audioCache.size >= CACHE_LIMIT) {
        const oldestKey = audioCache.keys().next().value;
        if (oldestKey) audioCache.delete(oldestKey);
      }
      audioCache.set(text, audio);

      res.set('Content-Type', 'audio/mpeg').set('Cache-Control', 'private, max-age=86400').send(audio);
    } catch (error) {
      console.error('[TTS] Neural speech synthesis failed:', error instanceof Error ? error.message : 'unknown error');
      res.status(502).json({ success: false, message: 'Speech service is temporarily unavailable.' });
    }
  });

  return router;
}
