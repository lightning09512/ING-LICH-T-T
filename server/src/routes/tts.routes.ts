import { Router, Request, Response } from 'express';
import { MAX_TTS_TEXT_LENGTH, synthesizeSpeech } from '../services/tts.js';

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

export function createTtsRouter(): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

    if (!text || text.length > MAX_TTS_TEXT_LENGTH) {
      return res.status(400).json({ success: false, message: 'Text must be between 1 and 800 characters.' });
    }

    if (isRateLimited(req.ip ?? req.socket.remoteAddress ?? 'unknown', Date.now())) {
      return res.status(429).json({ success: false, message: 'Too many speech requests. Try again shortly.' });
    }

    try {
      const audio = await synthesizeSpeech(text);
      res.set('Content-Type', 'audio/mpeg').set('Cache-Control', 'private, max-age=86400').send(audio);
    } catch (error) {
      console.error('[TTS] Neural speech synthesis failed:', error instanceof Error ? error.message : 'unknown error');
      res.status(502).json({ success: false, message: 'Speech service is temporarily unavailable.' });
    }
  });

  return router;
}
