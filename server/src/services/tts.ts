import { EdgeTTS } from 'node-edge-tts';

export const MAX_TTS_TEXT_LENGTH = 800;

const CACHE_LIMIT = 100;
const audioCache = new Map<string, Buffer>();

export async function* streamSpeech(text: string, rate?: string): AsyncGenerator<Buffer> {
  const isSentence = text.includes(' ') || text.length > 25;
  const targetRate = rate || (isSentence ? '-14%' : '-4%');
  const cacheKey = `${text}__${targetRate}`;
  const cachedAudio = audioCache.get(cacheKey);
  if (cachedAudio) {
    audioCache.delete(cacheKey);
    audioCache.set(cacheKey, cachedAudio);
    yield cachedAudio;
    return;
  }

  const tts = new EdgeTTS({
    voice: 'en-US-JennyNeural',
    lang: 'en-US',
    outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
    rate: targetRate,
    timeout: 8_000,
  });
  const chunks: Buffer[] = [];

  for await (const chunk of tts.streamAudio(text)) {
    if (Buffer.isBuffer(chunk)) {
      chunks.push(chunk);
      yield chunk;
    }
  }

  if (chunks.length === 0) throw new Error('Speech service returned no audio.');

  const audio = Buffer.concat(chunks);
  if (audioCache.size >= CACHE_LIMIT) {
    const oldestKey = audioCache.keys().next().value;
    if (oldestKey) audioCache.delete(oldestKey);
  }
  audioCache.set(cacheKey, audio);
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of streamSpeech(text)) chunks.push(chunk);
  return Buffer.concat(chunks);
}
