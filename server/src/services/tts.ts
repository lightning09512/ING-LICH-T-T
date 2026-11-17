import { EdgeTTS } from 'node-edge-tts';

export const MAX_TTS_TEXT_LENGTH = 800;

const CACHE_LIMIT = 100;
const audioCache = new Map<string, Buffer>();

export async function* streamSpeech(text: string): AsyncGenerator<Buffer> {
  const cachedAudio = audioCache.get(text);
  if (cachedAudio) {
    audioCache.delete(text);
    audioCache.set(text, cachedAudio);
    yield cachedAudio;
    return;
  }

  const tts = new EdgeTTS({
    voice: 'en-US-JennyNeural',
    lang: 'en-US',
    outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
    rate: '+15%',
    timeout: 10_000,
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
  audioCache.set(text, audio);
}

export async function synthesizeSpeech(text: string): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of streamSpeech(text)) chunks.push(chunk);
  return Buffer.concat(chunks);
}
