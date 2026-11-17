import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('No component in src/components uses raw SpeechSynthesisUtterance or window.speechSynthesis directly', () => {
  const dir = path.resolve('src/components');
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.tsx')) continue;
    const src = fs.readFileSync(path.join(dir, file), 'utf8');
    assert.equal(
      src.includes('SpeechSynthesisUtterance'),
      false,
      `${file} still uses raw SpeechSynthesisUtterance instead of sounds.speakEnglish`
    );
    assert.equal(
      src.includes('window.speechSynthesis'),
      false,
      `${file} still uses raw window.speechSynthesis instead of sounds.speakEnglish / sounds.stopSpeaking`
    );
  }
});

test('Speaking, Ranked, and Vocab screens all invoke sounds.enqueuePrefetch for proactive zero-delay audio', () => {
  const required = [
    'ToeicSpeakingExamScreen.tsx',
    'ToeicSpeakingRevisionScreen.tsx',
    'RankedExamScreen.tsx',
    'VocabGameMap.tsx',
    'LearnVocabScreen.tsx',
  ];
  for (const file of required) {
    const src = fs.readFileSync(path.resolve('src/components', file), 'utf8');
    assert.ok(
      src.includes('enqueuePrefetch'),
      `${file} must call sounds.enqueuePrefetch to pre-warm TTS segments`
    );
  }
});
