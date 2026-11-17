import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/tts';
import { MAX_TTS_TEXT_LENGTH } from '../server/src/services/tts';

test('MAX_TTS_TEXT_LENGTH is raised to 1500', () => {
  assert.equal(MAX_TTS_TEXT_LENGTH, 1500);
});

test('api/tts rejects empty text and text > 1500 chars with 400', async () => {
  const emptyRes = await handler(new Request('http://localhost/api/tts?text='));
  assert.equal(emptyRes.status, 400);

  const huge = 'a'.repeat(1501);
  const hugeRes = await handler(new Request(`http://localhost/api/tts?text=${huge}`));
  assert.equal(hugeRes.status, 400);
});

test('api/tts accepts >800 char text and streams MP3 chunks via res.write on cache miss', async () => {
  const paragraph = ('Welcome to our annual conference in Tokyo. ').repeat(20).trim();
  assert.ok(paragraph.length > 800 && paragraph.length <= 1500);

  const writeChunks: number[] = [];
  let statusCode = 200;
  let ended = false;
  const headers: Record<string, string> = {};
  const mockRes = {
    headersSent: false,
    status(code: number) { statusCode = code; return this; },
    setHeader(k: string, v: string) { headers[k.toLowerCase()] = v; },
    write(chunk: Buffer) {
      this.headersSent = true;
      writeChunks.push(chunk.length);
      return true;
    },
    send(buf: Buffer) {
      this.headersSent = true;
      writeChunks.push(buf.length);
      ended = true;
      return this;
    },
    json(obj: unknown) { return obj; },
    end() { ended = true; return this; },
  };

  await handler({ method: 'GET', query: { text: paragraph } }, mockRes);
  assert.equal(statusCode, 200);
  assert.equal(headers['content-type'], 'audio/mpeg');
  assert.equal(ended, true);
  assert.ok(writeChunks.length >= 2, `Expected multiple streamed chunks via res.write, got ${writeChunks.length}`);
  assert.ok(writeChunks.reduce((a, b) => a + b, 0) > 2000);
});
