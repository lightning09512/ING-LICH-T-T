import { EdgeTTS } from 'node-edge-tts';

export const config = {
  maxDuration: 30,
};

const MAX_TTS_LENGTH = 1500;
const CACHE_LIMIT = 300;
const audioCache = new Map<string, Buffer>();

function storeInCache(cacheKey: string, audio: Buffer) {
  if (audioCache.has(cacheKey)) {
    audioCache.delete(cacheKey);
  } else if (audioCache.size >= CACHE_LIMIT) {
    const oldestKey = audioCache.keys().next().value;
    if (oldestKey) audioCache.delete(oldestKey);
  }
  audioCache.set(cacheKey, audio);
}

export async function* streamSpeechChunks(text: string, rate: string = '+0%'): AsyncGenerator<Buffer> {
  const cacheKey = `${text}__${rate}`;
  const cached = audioCache.get(cacheKey);
  if (cached) {
    storeInCache(cacheKey, cached);
    yield cached;
    return;
  }

  // Use Microsoft Edge's warm, natural American female voice (JennyNeural)
  const tts = new EdgeTTS({
    voice: 'en-US-JennyNeural',
    lang: 'en-US',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    rate,
    timeout: 10_000,
  });

  const chunks: Buffer[] = [];
  for await (const chunk of tts.streamAudio(text)) {
    if (Buffer.isBuffer(chunk) && chunk.length > 0) {
      chunks.push(chunk);
      yield chunk;
    }
  }

  if (chunks.length === 0) {
    throw new Error('No audio generated');
  }

  storeInCache(cacheKey, Buffer.concat(chunks));
}

export default async function handler(req: any, res?: any) {
  // 1. Node.js serverless handler (Standard Vercel Function)
  if (res && typeof res.status === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const text = (req.query?.text || req.body?.text || '').trim();
    if (!text || text.length > MAX_TTS_LENGTH) {
      return res.status(400).json({ error: `Text required (max ${MAX_TTS_LENGTH} chars)` });
    }

    const rate = (req.query?.rate as string) || '+0%';
    const cacheKey = `${text}__${rate}`;
    const cached = audioCache.get(cacheKey);

    if (cached) {
      storeInCache(cacheKey, cached);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      return res.send(cached);
    }

    try {
      const iterator = streamSpeechChunks(text, rate)[Symbol.asyncIterator]();
      const first = await iterator.next();
      if (first.done || !first.value) {
        throw new Error('No audio generated');
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      if (typeof res.write === 'function') {
        res.write(first.value);
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          if (next.value) res.write(next.value);
        }
        return res.end();
      } else {
        const rest: Buffer[] = [first.value];
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          if (next.value) rest.push(next.value);
        }
        return res.send(Buffer.concat(rest));
      }
    } catch (e: any) {
      console.error('[TTS Error]', e);
      if (!res.headersSent) {
        return res.status(500).json({ error: e.message || 'TTS Error' });
      }
      return res.end();
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

  if (!text || text.length > MAX_TTS_LENGTH) {
    return new Response(JSON.stringify({ error: `Text required (max ${MAX_TTS_LENGTH} chars)` }), { status: 400 });
  }

  const rate = rateParam || '+0%';
  const cacheKey = `${text}__${rate}`;
  const cached = audioCache.get(cacheKey);
  const responseHeaders = {
    'Content-Type': 'audio/mpeg',
    'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
  };

  if (cached) {
    storeInCache(cacheKey, cached);
    return new Response(cached, { headers: responseHeaders });
  }

  try {
    const iterator = streamSpeechChunks(text, rate)[Symbol.asyncIterator]();
    const first = await iterator.next();
    if (first.done || !first.value) {
      throw new Error('No audio generated');
    }

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(new Uint8Array(first.value));
        try {
          while (true) {
            const next = await iterator.next();
            if (next.done) break;
            if (next.value) controller.enqueue(new Uint8Array(next.value));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, { headers: responseHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'TTS Error' }), { status: 500 });
  }
}
