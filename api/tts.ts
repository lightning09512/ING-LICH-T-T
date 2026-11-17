import { EdgeTTS } from 'node-edge-tts';

export const config = {
  maxDuration: 30,
};

const audioCache = new Map<string, Buffer>();

async function getSpeechAudio(text: string, rate: string = '+0%'): Promise<Buffer> {
  const cacheKey = `${text}__${rate}`;
  const cached = audioCache.get(cacheKey);
  if (cached) return cached;

  // Use Microsoft Edge's most natural, warm, human female voice (JennyNeural)
  const tts = new EdgeTTS({
    voice: 'en-US-JennyNeural',
    lang: 'en-US',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    rate,
    timeout: 8_000,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of tts.streamAudio(text)) {
    if (Buffer.isBuffer(chunk)) chunks.push(chunk);
  }

  if (chunks.length === 0) {
    throw new Error('No audio generated');
  }

  const audio = Buffer.concat(chunks);
  if (audioCache.size > 300) {
    const oldestKey = audioCache.keys().next().value;
    if (oldestKey) audioCache.delete(oldestKey);
  }
  audioCache.set(cacheKey, audio);
  return audio;
}

export default async function handler(req: any, res?: any) {
  // 1. Node.js serverless handler (Standard Vercel Function)
  if (res && typeof res.status === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const text = (req.query?.text || req.body?.text || '').trim();
    if (!text || text.length > 800) {
      return res.status(400).json({ error: 'Text required (max 800 chars)' });
    }

    const isSentence = text.includes(' ') || text.length > 25;
    const rate = (req.query?.rate as string) || (isSentence ? '-14%' : '-4%');

    try {
      const audioBuffer = await getSpeechAudio(text, rate);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      return res.send(audioBuffer);
    } catch (e: any) {
      console.error('[TTS Error]', e);
      return res.status(500).json({ error: e.message || 'TTS Error' });
    }
  }

  // 2. Web standard Request/Response handler (Vercel Edge / Fetch)
  const request = req as Request;
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
    });
  }

  let text = '';
  let rateParam = '';
  if (request.method === 'GET') {
    const url = new URL(request.url);
    text = url.searchParams.get('text')?.trim() ?? '';
    rateParam = url.searchParams.get('rate') ?? '';
  } else if (request.method === 'POST') {
    const body: any = await request.json().catch(() => ({}));
    text = (body.text || '').trim();
    rateParam = body.rate || '';
  }

  if (!text || text.length > 800) {
    return new Response(JSON.stringify({ error: 'Text required' }), { status: 400 });
  }

  const isSentence = text.includes(' ') || text.length > 25;
  const rate = rateParam || (isSentence ? '-14%' : '-4%');

  try {
    const audioBuffer = await getSpeechAudio(text, rate);
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
