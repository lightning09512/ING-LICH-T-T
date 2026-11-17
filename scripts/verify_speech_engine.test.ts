import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanSpeechText, splitSpeechSegments, isSentenceText } from '../src/utils/speechText';
import { sounds } from '../src/utils/soundEffects';

test('cleanSpeechText strips IPA, POS tags, bullets, enclosing quotes, and replaces blanks while keeping real parenthetical clauses', () => {
  assert.equal(cleanSpeechText('accommodate /əˈkɑː.mə.deɪt/ (v) • chứa đựng'), 'accommodate');
  assert.equal(cleanSpeechText('"The manager ___ the contract."'), 'The manager blank the contract.');
  assert.equal(
    cleanSpeechText('Please call the front desk (extension 402) before noon.'),
    'Please call the front desk (extension 402) before noon.'
  );
});

test('splitSpeechSegments preserves abbreviations and decimals without mid-sentence splits', () => {
  const text = 'Mr. Kim arrived at 9:30 a.m. Sales grew 3.5% in the U.S. market.';
  const segs = splitSpeechSegments(text, 80);
  assert.equal(segs.length, 1);
  assert.equal(segs[0], text);

  // Even when total length exceeds maxLen, abbreviations inside sentence 1 are never broken
  const longWithAbbr = 'Mr. Kim met Dr. Smith in the U.S. office. Sales grew 3.5% across every regional branch this quarter.';
  const segs2 = splitSpeechSegments(longWithAbbr, 55);
  assert.deepEqual(segs2, [
    'Mr. Kim met Dr. Smith in the U.S. office.',
    'Sales grew 3.5% across every regional branch this quarter.',
  ]);
});

test('splitSpeechSegments splits long multi-sentence paragraphs cleanly at sentence boundaries', () => {
  const s1 = 'First, I believe remote work increases employee productivity significantly.';
  const s2 = 'For example, commuters save almost two hours every single day on crowded buses.';
  const s3 = 'Therefore, companies should adopt a hybrid schedule for office staff.';
  const segs = splitSpeechSegments(`${s1} ${s2} ${s3}`, 110);
  assert.deepEqual(segs, [s1, s2, s3]);
});

test('isSentenceText distinguishes single words from phrases/sentences', () => {
  assert.equal(isSentenceText('accommodate'), false);
  assert.equal(isSentenceText('take advantage of'), true);
});

test('sounds.enqueuePrefetch exists and safely handles missing window/caches in Node, and synchronous play occurs even during inFlight', async () => {
  assert.equal(typeof sounds.enqueuePrefetch, 'function');

  // Simulate browser environment without window.caches (e.g. HTTP LAN IP on mobile)
  let playCalledSynchronously = false;
  let startedAudioSrc = '';
  const fakeAudios: any[] = [];

  class FakeAudio {
    preload = '';
    volume = 1;
    playbackRate = 1;
    currentTime = 0;
    src = '';
    private listeners: Record<string, (() => void)[]> = {};
    constructor() {
      fakeAudios.push(this);
    }
    addEventListener(evt: string, cb: () => void) {
      (this.listeners[evt] ||= []).push(cb);
    }
    emit(evt: string) {
      for (const cb of this.listeners[evt] || []) cb();
    }
    pause() {}
    play() {
      playCalledSynchronously = true;
      startedAudioSrc = this.src;
      return Promise.resolve();
    }
  }

  const prevWindow = (globalThis as any).window;
  const prevAudio = (globalThis as any).Audio;
  const prevFetch = globalThis.fetch;

  try {
    (globalThis as any).window = {}; // no caches, no speechSynthesis
    (globalThis as any).Audio = FakeAudio;
    // Never-resolving fetch simulating a slow inFlight background prefetch
    globalThis.fetch = (() => new Promise(() => {})) as any;

    sounds.enqueuePrefetch(['First sentence here. Second sentence follows right after that with enough length to split cleanly across two segments when spoken aloud by the learner engine in test mode.']);

    // Now user immediately taps Play while prefetch is still inFlight!
    playCalledSynchronously = false;
    const speakPromise = sounds.speakEnglish(
      'First sentence here. Second sentence follows right after that with enough length to split cleanly across two segments when spoken aloud by the learner engine in test mode.'
    );

    // Must have called audio.play() SYNCHRONOUSLY inside the user click stack!
    assert.equal(playCalledSynchronously, true, 'audio.play() must be called synchronously even when inFlight');
    assert.ok(startedAudioSrc.includes('/api/tts?text='), 'Should stream directUrl synchronously on cache miss');

    // Now user taps Stop mid-sentence: must resolve immediately and NOT play segment 2!
    const audioCountBeforeStop = fakeAudios.length;
    sounds.stopSpeaking();
    await speakPromise;
    // Even if segment 1 emits ended later, segment 2 must NOT start
    fakeAudios[fakeAudios.length - 1]?.emit('ended');
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(fakeAudios.length, audioCountBeforeStop, 'Cancelled multi-segment speech must not start segment 2');

    // Also verify normal completion resolves speakEnglish when audio emits 'ended'
    let naturalResolved = false;
    const p2 = sounds.speakEnglish('welcome').then(() => { naturalResolved = true; });
    fakeAudios[fakeAudios.length - 1]?.emit('playing');
    fakeAudios[fakeAudios.length - 1]?.emit('ended');
    await p2;
    assert.equal(naturalResolved, true, 'speakEnglish must resolve naturally on audio ended');
  } finally {
    (globalThis as any).window = prevWindow;
    (globalThis as any).Audio = prevAudio;
    globalThis.fetch = prevFetch;
  }
});
