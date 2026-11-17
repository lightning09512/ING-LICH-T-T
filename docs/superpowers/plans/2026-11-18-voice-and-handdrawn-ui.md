# Zero-Delay Voice & Hand-Drawn Cute UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify all English speech across the web app onto an instant, zero-delay streaming + persistent-cached `en-US-JennyNeural` voice engine, and replace "AI slop" UI clutter (OS emoji spam, pulsing stacked badges, overused sparkles) with cohesive hand-drawn SVG doodles and 4 custom 2D stationery-style mascot illustrations.

**Architecture:** On the audio side, `/api/tts` streams MP3 chunks immediately on cache miss (up to 1500 chars) while `SoundEngine` adds a 2-tier cache (RAM `blobUrlCache` + browser `CacheStorage`), abbreviation-safe sentence chunking for long paragraphs, synchronous user-gesture playback even during in-flight prefetches, and a concurrency-bounded background prefetch queue wired into Vocab, Ranked, and Speaking screens. On the UI side, a zero-dependency `DoodleIcons.tsx` hand-drawn SVG component set + 4 custom 2D ink-and-pastel PNG stickers (`public/doodles/`) replace generic emojis and noisy multi-badge patterns across all screens while keeping `/app-icon.png` intact.

**Tech Stack:** TypeScript 5.8, React 18, Tailwind CSS 3.4, Vite 6, Express / Vercel Serverless Functions, `node-edge-tts` (`en-US-JennyNeural`), Node `tsx --test` runner.

**Spec:** `docs/superpowers/specs/2026-11-18-voice-and-handdrawn-ui-design.md`

## Global Constraints

- Voice persona locked to `en-US-JennyNeural` (natural American female); single words play at `0.96x`, sentences/paragraphs play at `0.85x`–`0.88x`.
- Maximum TTS text length per request: `1500` characters across client, Express server, and Vercel serverless endpoint.
- Never overwrite, rename, or remove `/app-icon.png` (personal avatar photo) or modify `LolMatchFoundModal.tsx` (dedicated Hextech theme) or replace original ETS test MP3 files in `ToeicExamScreen.tsx`.
- Hand-drawn illustrations must use 2D ink outline + soft flat/watercolor pastel fills on `#FFFDF5` / white sticker border (zero 3D render gloss, zero neon cyberpunk gradients).
- At most one accent badge (`WashiTapeBadge` or subtle pill) per card; remove `animate-pulse` from static marketing/NEW badges.

## Review Focus

- Abbreviations & decimals in long text (`"Mr. Lee arrived at 9 a.m. Sales grew 3.5%."`) must not split mid-sentence into awkward micro-pauses (covered in Task 2 tests).
- Rapid card switching or clicking Stop mid-paragraph must immediately halt subsequent queued sentence segments via `speechRequestId` (covered in Task 2 tests).
- Missing `window.caches` (e.g. `http://192.168.x.x` mobile LAN testing or private mode `QuotaExceededError`) must silently fall back to RAM `blobUrlCache` + direct stream without throwing (covered in Task 2 tests).
- Clicking Play while a background prefetch for the same text is still `inFlight` must invoke `audio.play()` synchronously in the click call stack so mobile Safari/Chrome autoplay never blocks (covered in Task 2 tests).
- Personal avatar `/app-icon.png` must remain rendered on `TitleScreen` and `Navbar`, and zero raw `new SpeechSynthesisUtterance` calls may remain outside `src/utils/soundEffects.ts` (covered in Task 3 & Task 6 verification tests).

---

### Task 1: Streaming & 1500-Char TTS Backend (`api/tts.ts` & `server/`)

**Files:**
- Modify: `api/tts.ts`
- Modify: `server/src/services/tts.ts`
- Modify: `server/src/routes/tts.routes.ts`
- Test: `scripts/verify_tts_stream.test.ts`

**Interfaces:**
- Produces:
  - `MAX_TTS_TEXT_LENGTH = 1500` in `server/src/services/tts.ts` and `1500` limit in `api/tts.ts`
  - `GET /api/tts?text=<encoded>&rate=<optional>` streaming `audio/mpeg` chunks immediately on cache miss and returning full cached `Buffer` on cache hit.

- [ ] **Step 1: Write the failing backend TTS streaming & length test in `scripts/verify_tts_stream.test.ts`**

```ts
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

test('api/tts accepts 900-char paragraph (> old 800 limit) and streams audio/mpeg', async () => {
  const paragraph = ('The conference schedule has been updated for all international delegates. ').repeat(13).trim();
  assert.ok(paragraph.length > 800 && paragraph.length <= 1500);

  const chunksReceived: number[] = [];
  let statusCode = 200;
  const headers: Record<string, string> = {};
  const mockRes = {
    status(code: number) { statusCode = code; return this; },
    setHeader(k: string, v: string) { headers[k.toLowerCase()] = v; },
    write(chunk: Buffer) { chunksReceived.push(chunk.length); return true; },
    send(buf: Buffer) { chunksReceived.push(buf.length); return this; },
    json(obj: unknown) { return obj; },
    end() { return this; },
  };

  await handler({ method: 'GET', query: { text: 'Welcome aboard.' } }, mockRes);
  assert.equal(statusCode, 200);
  assert.equal(headers['content-type'], 'audio/mpeg');
  assert.ok(chunksReceived.reduce((a, b) => a + b, 0) > 1000);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test scripts/verify_tts_stream.test.ts`
Expected: FAIL (`MAX_TTS_TEXT_LENGTH` is `800`, not `1500`).

- [ ] **Step 3: Update `server/src/services/tts.ts`, `server/src/routes/tts.routes.ts`, and `api/tts.ts`**

- In `server/src/services/tts.ts`: set `export const MAX_TTS_TEXT_LENGTH = 1500;` and raise `CACHE_LIMIT = 250`.
- In `server/src/routes/tts.routes.ts`: update error message to `'Text must be between 1 and 1500 characters.'`.
- In `api/tts.ts`:
  - Raise length check from `800` to `1500` in both Node `(req, res)` and Web `Request` handlers.
  - Export `streamSpeechChunks(text: string, rate?: string): AsyncGenerator<Buffer>` backed by `audioCache` (300 items): if cached, yield single `Buffer`; otherwise stream chunks from `EdgeTTS({ voice: 'en-US-JennyNeural', lang: 'en-US', outputFormat: 'audio-24khz-48kbitrate-mono-mp3', rate, timeout: 10_000 })`, yielding each `Buffer` chunk immediately and caching `Buffer.concat(chunks)` once complete.
  - In Node `(req, res)` handler: if cached, `res.send(cached)`; otherwise set headers (`Content-Type: audio/mpeg`, `Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable`), `res.write(chunk)` per yielded chunk, and `res.end()`.
  - In Fetch `Request` handler: stream via `new ReadableStream({ async start(controller) { ... } })`.

- [ ] **Step 4: Run test and server build to verify they pass**

Run: `npx tsx --test scripts/verify_tts_stream.test.ts; npm run server:build`
Expected: PASS (all 3 tests pass, `tsc -p server/tsconfig.json` exits 0).

- [ ] **Step 5: Commit**

```powershell
git add api/tts.ts server/src/services/tts.ts server/src/routes/tts.routes.ts scripts/verify_tts_stream.test.ts
git commit -m "perf(tts): stream EdgeTTS chunks immediately and raise limit to 1500 chars"
```

---

### Task 2: Zero-Delay Speech Engine, Persistent Cache & Smart Sentence Chunking (`src/utils/speechText.ts` & `src/utils/soundEffects.ts`)

**Files:**
- Create: `src/utils/speechText.ts`
- Modify: `src/utils/soundEffects.ts`
- Test: `scripts/verify_speech_engine.test.ts`

**Interfaces:**
- Produces:
  - `cleanSpeechText(raw: string): string` in `src/utils/speechText.ts`
  - `splitSpeechSegments(cleanText: string, maxLen?: number): string[]` in `src/utils/speechText.ts`
  - `isSentenceText(cleanText: string): boolean` in `src/utils/speechText.ts`
  - `sounds.enqueuePrefetch(texts: (string | undefined | null)[]): void` in `src/utils/soundEffects.ts`
  - `sounds.prefetchEnglish(text: string): void` in `src/utils/soundEffects.ts`
  - `sounds.speakEnglish(text: string, options?: { rate?: number }): Promise<void>` in `src/utils/soundEffects.ts`
  - `sounds.stopSpeaking(): void` in `src/utils/soundEffects.ts`

- [ ] **Step 1: Write the failing unit & edge-case tests in `scripts/verify_speech_engine.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanSpeechText, splitSpeechSegments, isSentenceText } from '../src/utils/speechText';

test('cleanSpeechText strips IPA, POS tags, bullets, enclosing quotes, and replaces blanks', () => {
  assert.equal(cleanSpeechText('accommodate /əˈkɑː.mə.deɪt/ (v) • chứa đựng'), 'accommodate');
  assert.equal(cleanSpeechText('"The manager ___ the contract."'), 'The manager blank the contract.');
});

test('splitSpeechSegments preserves abbreviations and decimals without mid-sentence splits', () => {
  const text = 'Mr. Kim arrived at 9:30 a.m. Sales grew 3.5% in the U.S. market.';
  const segs = splitSpeechSegments(text, 80);
  assert.equal(segs.length, 1);
  assert.equal(segs[0], text);
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test scripts/verify_speech_engine.test.ts`
Expected: FAIL (`Cannot find module '../src/utils/speechText'`).

- [ ] **Step 3: Implement `src/utils/speechText.ts` and upgrade `src/utils/soundEffects.ts`**

- In `src/utils/speechText.ts`:
  - `cleanSpeechText(raw)`: strips `/.../` IPA, `(...)` and `[...]` POS tags when short (`<= 15` chars inside parens so real parenthetical clauses in sentences aren't eaten, e.g. `/\((?:n|v|adj|adv|prep|conj|pron|phr|n\/v)\.?[^)]*\)/gi`), strips `•.*$`, enclosing quotes, replaces `_{2,}` with `'blank'`, normalizes whitespace, trims to `1500` chars max.
  - `splitSpeechSegments(cleanText, maxLen = 280)`: if `cleanText.length <= maxLen`, returns `[cleanText]`. Otherwise masks common abbreviations (`Mr.`, `Mrs.`, `Ms.`, `Dr.`, `Prof.`, `Jr.`, `Sr.`, `vs.`, `etc.`, `e.g.`, `i.e.`, `U.S.`, `U.K.`, `a.m.`, `p.m.`, `No.`, `St.`, `Co.`, `Inc.`, `Ltd.`) and decimals (`\d+\.\d+`), splits on `(?<=[.!?])\s+`, and packs sentences into chunks `<= maxLen` (with first chunk capped at `180` chars so sentence 1 synthesizes and plays ultra-fast!).
- In `src/utils/soundEffects.ts`:
  - Add persistent `CacheStorage` helper (`CACHE_NAME = 'ing-lich-tet-tts-v2'`): `readFromPersistentCache(cacheKey)` and `writeToPersistentCache(cacheKey, blob)` wrapped in `try/catch` checking `typeof caches !== 'undefined'` so insecure LAN HTTP or `QuotaExceededError` silently no-ops.
  - Raise `maxCacheSize = 250` and max text length to `1500`.
  - Add `enqueuePrefetch(texts: (string | undefined | null)[])`: splits each text via `splitSpeechSegments`, pushes uncached segments into a FIFO queue (deduplicated, max queue 60), drained by at most `2` concurrent workers checking `CacheStorage` first before `fetch('/api/tts?...')`.
  - Fix the `inFlight` gesture bug in `speakEnglish(text, options?)`:
    - Split `cleanText` into `segments = splitSpeechSegments(cleanText)`.
    - Enqueue prefetch immediately for `segments.slice(1)` so segments 2..N download while segment 1 plays!
    - For segment 1: if in `blobUrlCache`, play `blobUrl` synchronously right inside the click call stack (`0ms`!). If NOT in `blobUrlCache` (even if `inFlight`!), play `directUrl = /api/tts?text=...` **synchronously** inside the click call stack so mobile Safari/iOS keeps transient user activation, while also triggering background cache population!
    - For segments `2..N`: play sequentially in an async loop guarded by `requestId === this.speechRequestId` (checking `blobUrlCache` -> `readFromPersistentCache` -> `inFlight` -> `directUrl`). If `stopSpeaking()` is called at any point, `++this.speechRequestId` immediately aborts the loop and resolves cleanly.
    - Support optional `options?.rate` override; default word rate `0.96`, sentence rate `0.86`.

- [ ] **Step 4: Add lifecycle & failure-mode tests in `scripts/verify_speech_engine.test.ts` and run**

Append tests to `scripts/verify_speech_engine.test.ts` verifying:
1. `cleanSpeechText` keeps normal parenthetical phrases in long sentences like `'Please call the front desk (extension 402) before noon.'` intact while stripping `(adj)` / `(v)`.
2. `SoundEngine.stopSpeaking()` increments `speechRequestId` and resolves an active `speakEnglish` promise immediately when mocked in Node.

Run: `npx tsx --test scripts/verify_speech_engine.test.ts; npm run client:build`
Expected: PASS (all tests pass, `client:build` exits 0).

- [ ] **Step 5: Commit**

```powershell
git add src/utils/speechText.ts src/utils/soundEffects.ts scripts/verify_speech_engine.test.ts
git commit -m "feat(audio): add 2-tier persistent TTS cache, prefetch queue, and fast sentence chunking"
```

---

### Task 3: Wire Unified Voice & Prefetch Across All Screens (`ToeicSpeaking*`, `RankedExamScreen`, `VocabGameMap`, `LearnVocabScreen`)

**Files:**
- Modify: `src/components/ToeicSpeakingExamScreen.tsx`
- Modify: `src/components/ToeicSpeakingRevisionScreen.tsx`
- Modify: `src/components/RankedExamScreen.tsx`
- Modify: `src/components/VocabGameMap.tsx`
- Modify: `src/components/LearnVocabScreen.tsx`
- Test: `scripts/verify_voice_wiring.test.ts`

**Interfaces:**
- Consumes: `sounds.speakEnglish`, `sounds.stopSpeaking`, `sounds.enqueuePrefetch`, `sounds.prefetchEnglish` from Task 2.

- [ ] **Step 1: Write the failing codebase wiring test in `scripts/verify_voice_wiring.test.ts`**

```ts
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
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx --test scripts/verify_voice_wiring.test.ts`
Expected: FAIL (`ToeicSpeakingExamScreen.tsx` and `ToeicSpeakingRevisionScreen.tsx` still use `SpeechSynthesisUtterance`).

- [ ] **Step 3: Wire `sounds.speakEnglish`, `sounds.stopSpeaking`, `enqueuePrefetch`, and `onPointerEnter` prewarm**

- **`src/components/ToeicSpeakingExamScreen.tsx`**:
  - Replace `playNativeSpeech(text)` & `stopNativeSpeech()` with `sounds.speakEnglish(text).finally(() => setIsSpeakingNative(false))` and `sounds.stopSpeaking()`. Also call `sounds.stopSpeaking()` on unmount and question change.
  - Add `useEffect` on `[currentIdx, testQuestions]` calling `sounds.enqueuePrefetch([currentQuestion?.targetScript, currentQuestion?.promptText, currentQuestion?.modelAnswer, nextQuestion?.targetScript, nextQuestion?.promptText])`.
  - Add `onPointerEnter` prewarm on native model audio buttons.
- **`src/components/ToeicSpeakingRevisionScreen.tsx`**:
  - Replace `handleSpeakText` raw `speechSynthesis` with toggleable `sounds.speakEnglish(text)` / `sounds.stopSpeaking()` updating `isSpeakingExample`, plus cleanup on unit change/unmount.
  - Add `useEffect` on `[currentUnit]` calling `sounds.enqueuePrefetch` on English example strings in `currentUnit`.
- **`src/components/RankedExamScreen.tsx`**:
  - Add `useEffect` on `[phase, currentIndex, questions]` when `phase === 'EXAM'` calling `sounds.enqueuePrefetch([questions[currentIndex]?.audioScript, questions[currentIndex + 1]?.audioScript, questions[currentIndex + 2]?.audioScript])`.
  - Add `onPointerEnter={() => currentQ?.audioScript && sounds.prefetchEnglish(currentQ.audioScript)}` on the audio play button.
- **`src/components/VocabGameMap.tsx` & `src/components/LearnVocabScreen.tsx`**:
  - Upgrade flashcard `useEffect` to call `sounds.enqueuePrefetch` for the current card + next 4 cards (both `word` and `exampleEn`), and add `onPointerEnter={() => sounds.prefetchEnglish(w.word)}` on word-list speaker buttons.

- [ ] **Step 4: Run test and client build to verify they pass**

Run: `npx tsx --test scripts/verify_voice_wiring.test.ts; npm run client:build`
Expected: PASS (0 raw `SpeechSynthesisUtterance` in `src/components`, `client:build` exits 0).

- [ ] **Step 5: Commit**

```powershell
git add src/components/ToeicSpeakingExamScreen.tsx src/components/ToeicSpeakingRevisionScreen.tsx src/components/RankedExamScreen.tsx src/components/VocabGameMap.tsx src/components/LearnVocabScreen.tsx scripts/verify_voice_wiring.test.ts
git commit -m "feat(audio): unify all screens on zero-delay Jenny TTS with proactive prefetching"
```

---

### Task 4: Hand-Drawn SVG Doodle Library & 4 Cozy Mascot Stickers (`src/components/DoodleIcons.tsx`, `public/doodles/`, `src/index.css`)

**Files:**
- Create: `src/components/DoodleIcons.tsx`
- Create: `public/doodles/mascot-study.png`
- Create: `public/doodles/mascot-streak.png`
- Create: `public/doodles/mascot-hearts.png`
- Create: `public/doodles/mascot-victory.png`
- Modify: `src/index.css`
- Modify: `src/components/FloatingTrollfaces.tsx`

**Interfaces:**
- Produces in `src/components/DoodleIcons.tsx`:
  - Icon components accepting `{ className?: string; size?: number }`:
    `DoodleStar`, `DoodleFire`, `DoodleHeart`, `DoodleBrokenHeart`, `DoodleBoba`, `DoodleBook`, `DoodlePencil`, `DoodleMic`, `DoodleTarget`, `DoodleTrophy`, `DoodleBulb`, `DoodlePin`, `DoodleCheck`, `DoodleSpark`
  - Decorative components:
    `DoodleUnderline` (`{ className?: string; color?: string }`)
    `WashiTapeBadge` (`{ children: React.ReactNode; tone?: 'pink' | 'yellow' | 'mint' | 'sky' | 'lavender' | 'peach'; rotate?: 'left' | 'right' | 'none'; className?: string }`)
    `MascotSticker` (`{ src: '/doodles/mascot-study.png' | '/doodles/mascot-streak.png' | '/doodles/mascot-hearts.png' | '/doodles/mascot-victory.png'; alt: string; className?: string }`) — renders `<img>` with explicit dimensions, `loading="eager"`, and graceful `onError` hide fallback.

- [ ] **Step 1: Generate the 4 cozy 2D hand-drawn mascot stickers via `image-generator` subagent**

Invoke `image-generator` to create and save in `public/doodles/`:
1. `public/doodles/mascot-study.png`: 2D hand-drawn ink outline and soft pastel watercolor stationery sticker on solid warm cream `#FFFDF5` background: a chubby cute white cat wearing a soft sage-green knitted bucket hat, happily reading an English notebook next to a brown-sugar boba milk tea cup, minimal cozy Korean/Japanese journal doodle style, flat hand-colored, zero 3D gloss, no text.
2. `public/doodles/mascot-streak.png`: Same 2D hand-drawn ink & pastel stationery doodle style on solid `#FFFDF5` background: an adorable round smiling little campfire flame character wearing tiny round glasses reading a mini vocabulary flashcard, warm orange and butter-yellow pastel fill, no text.
3. `public/doodles/mascot-hearts.png`: Same 2D hand-drawn ink & pastel stationery doodle style on solid `#FFFDF5` background: a cute smiling brown-sugar boba pearl milk tea cup hugging a plump pink hand-drawn heart with tiny hand-sketched stars around, no text.
4. `public/doodles/mascot-victory.png`: Same 2D hand-drawn ink & pastel stationery doodle style on solid `#FFFDF5` background: a chubby cute white cat in a sage-green bucket hat proudly holding up a small hand-drawn golden trophy cup with hand-sketched confetti doodles, no text.

- [ ] **Step 2: Create `src/components/DoodleIcons.tsx`**

Implement organic hand-sketched SVG paths (`stroke="#18181B"`, `strokeWidth="2.2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, with slightly offset warm pastel fills like `#FFE566`, `#FF94B9`, `#6EE7B7`, `#67E8F9`, `#FDBA74`) plus `DoodleUnderline`, `WashiTapeBadge` (matte stationery tape look with subtle serrated/translucent tape edges, no neon or `animate-pulse`), and `MascotSticker`.

- [ ] **Step 3: Add subtle notebook paper dot-grid in `src/index.css` and soften `FloatingTrollfaces.tsx`**

- In `src/index.css`: add subtle warm stationery dot pattern on `body` (`background-image: radial-gradient(#d6d0c4 1px, transparent 1px); background-size: 22px 22px; background-color: #FFFDF5;`).
- In `src/components/FloatingTrollfaces.tsx`: reduce particle count slightly (`Math.min(14, Math.max(8, ...))`) and soften opacity (`0.06 + Math.random() * 0.08`) so background stays playful without competing visually with hand-drawn doodles.

- [ ] **Step 4: Verify sticker files exist and TypeScript compiles**

Run: `npm run client:build`
Expected: `public/doodles/mascot-study.png`, `mascot-streak.png`, `mascot-hearts.png`, `mascot-victory.png` all exist and `client:build` exits 0.

- [ ] **Step 5: Commit**

```powershell
git add public/doodles src/components/DoodleIcons.tsx src/index.css src/components/FloatingTrollfaces.tsx
git commit -m "feat(ui): add hand-drawn DoodleIcons library, 4 cozy mascot stickers, and notebook paper texture"
```

---

### Task 5: Hand-Drawn Cute Makeover on Home, Menu & Modals (`TitleScreen`, `MenuScreen`, `StreakModal`, `HeartsModal`, `AccountModal`)

**Files:**
- Modify: `src/components/TitleScreen.tsx`
- Modify: `src/components/MenuScreen.tsx`
- Modify: `src/components/StreakModal.tsx`
- Modify: `src/components/HeartsModal.tsx`
- Modify: `src/components/AccountModal.tsx`

**Interfaces:**
- Consumes: `DoodleIcons.tsx` & `/doodles/mascot-*.png` from Task 4.
- Preserves: `/app-icon.png` in `TitleScreen.tsx` and `Navbar.tsx`.

- [ ] **Step 1: Update `TitleScreen.tsx`**

- Keep `/app-icon.png` avatar next to `{nickname}` intact!
- Replace `✨ {nickname} ✨` with `{nickname}` accented by `<DoodleStar />` and `<DoodleUnderline color="#FF94B9" />` underneath.
- Add `<MascotSticker src="/doodles/mascot-study.png" ... />` perched cutely beside/above the title card.
- Replace harsh angled corner badge with `<WashiTapeBadge tone="pink" rotate="right">Edition Bạn Gái 2026</WashiTapeBadge>`.
- Replace `<Sparkles />` on Start button with `<DoodleStar />`, replace `🌐` / `⚠️` emojis with crisp Lucide/Doodle icons (`DoodleBoba` beside the milk-tea joke note!).

- [ ] **Step 2: Update `MenuScreen.tsx`**

- Replace `🎮 Chọn Chế Độ Chơi` with `<WashiTapeBadge tone="lavender" rotate="left">Góc Học Bài Hôm Nay</WashiTapeBadge>` + a cute small `<MascotSticker src="/doodles/mascot-study.png" />` next to the greeting.
- Replace all harsh neon/red/gradient corner badges (`bg-red-600`, `bg-gradient-to-r from-amber-500 to-orange-500`, `bg-[#00838F]`, `bg-[#E65100]`, `bg-purple-700`, `animate-pulse` `MỚI`) with soft stationery `WashiTapeBadge` tones (`yellow`, `peach`, `pink`, `sky`, `mint`, `lavender`).
- Replace OS emojis (`✅`, `📘`, `🚀`, `🔥`, `📋`, `🎙️`, `✍️`) and section `<Sparkles />` with `DoodleCheck`, `DoodleBook`, `DoodleFire`, `DoodlePencil`, `DoodleMic`, `DoodleStar`, and `DoodleTrophy` (for Ranked).

- [ ] **Step 3: Update `StreakModal.tsx`, `HeartsModal.tsx`, and `AccountModal.tsx`**

- **`StreakModal.tsx`**: Feature `<MascotSticker src="/doodles/mascot-streak.png" />` in the header, replace `🔥`, `❄️`, `⏳`, `💖`, `🧋` and `<Sparkles />` with `DoodleFire`, `DoodleHeart`, `DoodleBoba`, and `WashiTapeBadge`.
- **`HeartsModal.tsx`**: Feature `<MascotSticker src="/doodles/mascot-hearts.png" />` in the header, replace `<Heart>` row / `❤️`, `💖`, `⚠️`, `💀`, `😂` with plump hand-drawn `DoodleHeart` / `DoodleBrokenHeart` & `DoodleBoba`, and `<WashiTapeBadge tone="pink">`.
- **`AccountModal.tsx`**: Replace `✅`, `❌`, `🔄`, `🌐` emojis with clean `DoodleCheck` / Lucide icons for a cohesive stationery look.

- [ ] **Step 4: Build to verify zero TypeScript or JSX issues**

Run: `npm run client:build`
Expected: PASS (`client:build` exits 0).

- [ ] **Step 5: Commit**

```powershell
git add src/components/TitleScreen.tsx src/components/MenuScreen.tsx src/components/StreakModal.tsx src/components/HeartsModal.tsx src/components/AccountModal.tsx
git commit -m "style(ui): replace AI-slop badges and emojis on home, menu, and modals with hand-drawn doodles"
```

---

### Task 6: De-AI-Slop & Doodle Polish Across Study & Exam Screens + Final Verification

**Files:**
- Modify: `src/components/VocabGameMap.tsx`
- Modify: `src/components/GrammarScreen.tsx`
- Modify: `src/components/TestSelectScreen.tsx`
- Modify: `src/components/ToeicSwSelectScreen.tsx`
- Modify: `src/components/RankedExamScreen.tsx`
- Modify: `src/components/ReviewSurvivalScreen.tsx`
- Modify: `src/components/ToeicExamScreen.tsx`
- Modify: `src/components/ToeicSpeakingRevisionScreen.tsx`
- Modify: `src/components/ToeicSpeakingExamScreen.tsx`
- Modify: `src/components/ToeicWritingRevisionScreen.tsx`
- Modify: `src/components/ToeicWritingExamScreen.tsx`
- Test: `scripts/verify_ui_antislop.test.ts`

**Interfaces:**
- Consumes: `DoodleIcons.tsx` & `/doodles/mascot-victory.png` from Task 4.

- [ ] **Step 1: Write the UI anti-slop & integrity verification test in `scripts/verify_ui_antislop.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Personal avatar /app-icon.png is preserved in TitleScreen and Navbar', () => {
  const title = fs.readFileSync('src/components/TitleScreen.tsx', 'utf8');
  const nav = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
  assert.ok(title.includes('/app-icon.png'), 'TitleScreen must keep /app-icon.png');
  assert.ok(nav.includes('/app-icon.png'), 'Navbar must keep /app-icon.png');
});

test('All 4 hand-drawn mascot stickers exist in public/doodles and are non-empty', () => {
  for (const name of ['mascot-study.png', 'mascot-streak.png', 'mascot-hearts.png', 'mascot-victory.png']) {
    const p = path.resolve('public/doodles', name);
    assert.ok(fs.existsSync(p), `Missing ${name}`);
    assert.ok(fs.statSync(p).size > 2000, `${name} appears empty`);
  }
});

test('AI-slop emoji density across core screens is dramatically reduced', () => {
  const targets = [
    'TitleScreen.tsx',
    'MenuScreen.tsx',
    'StreakModal.tsx',
    'HeartsModal.tsx',
    'ToeicSwSelectScreen.tsx',
    'TestSelectScreen.tsx',
    'GrammarScreen.tsx',
    'VocabGameMap.tsx',
  ];
  let totalEmojis = 0;
  for (const f of targets) {
    const src = fs.readFileSync(path.resolve('src/components', f), 'utf8');
    const matches = src.match(/\p{Extended_Pictographic}/gu) || [];
    totalEmojis += matches.length;
  }
  // Previously > 90 emojis across these 8 files; target <= 10 (e.g. optional country flag if any, or 0)
  assert.ok(totalEmojis <= 10, `Expected <= 10 emojis across core screens, found ${totalEmojis}`);
});
```

- [ ] **Step 2: Run test to verify it fails before cleanup**

Run: `npx tsx --test scripts/verify_ui_antislop.test.ts`
Expected: FAIL (`totalEmojis` is currently ~89 across those 8 files).

- [ ] **Step 3: Clean up AI-slop badges & replace emojis with `DoodleIcons` across study and exam screens**

- **`GrammarScreen.tsx`**: Remove duplicate high-frequency badges on topic cards (keep a single `<WashiTapeBadge tone="peach">` for exam-focus topics instead of `bg-red-600 TRỌNG ĐIỂM RA THI` + `🔥 Hay ra thi` stacked together); replace the 37 emojis (`🎯`, `⚡`, `🔥`, `🚀`, `💡`, `📌`, `👉`, `⚠️`, `🎉`, `📝`, `💪`, `🔄`) with `DoodleBulb`, `DoodlePin`, `DoodlePencil`, `DoodleStar`, `DoodleFire`, and clean numbered badges.
- **`VocabGameMap.tsx`**: Replace `⭐`, `📘`, `🔥`, `🚀`, `💡`, `🔊`, `👉`, `⚠️`, `⚡`, `🏆` and `🇻🇳`/`🇬🇧` clutter with `DoodleStar`, `DoodleBook`, `DoodleTrophy`, `WashiTapeBadge`, clean `EN`/`VI` mini tags, and `<MascotSticker src="/doodles/mascot-victory.png" />` on quiz victory!
- **`TestSelectScreen.tsx` & `ToeicSwSelectScreen.tsx`**: Replace `📚`, `🔥`, `🏆`, `🌟`, `📘`, `🚀`, `🌀`, `📋`, `🎙️`, `✍️` and `<Sparkles />` pills with `DoodleBook`, `DoodleMic`, `DoodlePencil`, `DoodleTrophy`, and `WashiTapeBadge`.
- **`RankedExamScreen.tsx`, `ReviewSurvivalScreen.tsx`, `ToeicExamScreen.tsx`, `ToeicSpeaking*.tsx`, `ToeicWriting*.tsx`**: Replace remaining UI emojis (`⚔️`, `🎉`, `🏆`, `💔`, `💡`, `📌`, `👸`, `🎙️`, `✍️`, `🎯`) with `DoodleTrophy`, `DoodleBrokenHeart`, `DoodleBulb`, `DoodlePin`, `DoodleMic`, `DoodlePencil`, and `MascotSticker` (`mascot-victory.png`) on completion screens.

- [ ] **Step 4: Run full test suite and full client + server production build**

Run: `npx tsx --test scripts/verify_tts_stream.test.ts scripts/verify_speech_engine.test.ts scripts/verify_voice_wiring.test.ts scripts/verify_ui_antislop.test.ts; npm run build`
Expected: PASS (all test files pass with 0 failures; both `client:build` and `server:build` exit 0).

- [ ] **Step 5: Commit and push**

```powershell
git add -A
git commit -m "style(ui): complete hand-drawn doodle polish and remove AI-slop clutter across all study & exam screens"
```
