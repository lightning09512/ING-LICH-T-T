// Web Audio API sound effects and Zero-Delay Natural American Female (JennyNeural) pronunciation engine.
import {
  cleanSpeechText,
  isSentenceText,
  splitSpeechSegments,
  MAX_CLIENT_TTS_CHARS,
} from './speechText';

const PERSISTENT_TTS_CACHE = 'ing-lich-tet-tts-v2';

export interface SpeakOptions {
  rate?: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private activeSpeechResolve: (() => void) | null = null;
  private speechRequestId = 0;

  // Tier 1: In-memory Blob URL cache (0ms synchronous playback)
  private blobUrlCache = new Map<string, string>();
  private inFlightFetches = new Map<string, Promise<string | null>>();
  private maxCacheSize = 250;

  // Background prefetch queue (bounded concurrency = 2 so UI/network never stalls)
  private prefetchQueue: string[] = [];
  private queuedKeys = new Set<string>();
  private activePrefetchWorkers = 0;
  private readonly maxPrefetchConcurrency = 2;
  private readonly maxQueueLength = 60;

  private femaleVoice: SpeechSynthesisVoice | null = null;
  private watchdogTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.initFemaleVoices();
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.prefetchEnglish('welcome');
        this.preloadLolSounds();
      }, 300);
    }
  }

  // Pre-load and strictly lock fallback synthesis to a pleasant American female voice
  private initFemaleVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const selectFemaleVoice = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        const MALE_NAMES = [
          'david', 'mark', 'george', 'guy', 'stefan', 'richard', 'christopher',
          'paul', 'tom', 'alex', 'fred', 'daniel', 'james', 'brian', 'charles',
          'male', 'man', 'boy',
        ];

        const isMale = (name: string) => {
          const lower = name.toLowerCase();
          return MALE_NAMES.some((m) => lower.includes(m));
        };

        const PREFERRED_FEMALE = [
          'microsoft jenny',
          'microsoft aria',
          'microsoft michelle',
          'google us english',
          'samantha',
          'ava',
          'victoria',
          'karen',
          'moira',
          'tessa',
          'fiona',
          'female',
        ];

        let chosen = voices.find((v) => {
          if (!v.lang.startsWith('en')) return false;
          if (isMale(v.name)) return false;
          const lower = v.name.toLowerCase();
          return PREFERRED_FEMALE.some((f) => lower.includes(f));
        });

        if (!chosen) {
          chosen = voices.find((v) => {
            if (!v.lang.startsWith('en')) return false;
            if (isMale(v.name)) return false;
            const lower = v.name.toLowerCase();
            return lower.includes('female') || lower.includes('natural');
          });
        }

        if (!chosen) {
          chosen = voices.find((v) => v.lang.startsWith('en') && !isMale(v.name));
        }

        if (chosen) {
          this.femaleVoice = chosen;
        }
      } catch {
        // Ignore voice enumeration errors
      }
    };

    selectFemaleVoice();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = selectFemaleVoice;
    }
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleSound(enabled?: boolean): boolean {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    if (!this.soundEnabled) {
      this.stopSpeaking();
    }
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  private buildTtsUrl(segment: string): string {
    return `/api/tts?text=${encodeURIComponent(segment)}`;
  }

  private storeBlobInRam(cacheKey: string, blob: Blob): string | null {
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return null;
    }
    const existing = this.blobUrlCache.get(cacheKey);
    if (existing) {
      return existing;
    }
    const blobUrl = URL.createObjectURL(blob);
    if (this.blobUrlCache.size >= this.maxCacheSize) {
      const oldestKey = this.blobUrlCache.keys().next().value;
      if (oldestKey) {
        const oldUrl = this.blobUrlCache.get(oldestKey);
        if (oldUrl) {
          try { URL.revokeObjectURL(oldUrl); } catch {}
        }
        this.blobUrlCache.delete(oldestKey);
      }
    }
    this.blobUrlCache.set(cacheKey, blobUrl);
    return blobUrl;
  }

  private async readPersistentBlobUrl(cacheKey: string, url: string): Promise<string | null> {
    const ram = this.blobUrlCache.get(cacheKey);
    if (ram) return ram;
    try {
      const cacheStorage: CacheStorage | undefined =
        typeof caches !== 'undefined'
          ? caches
          : typeof window !== 'undefined'
            ? (window as any).caches
            : undefined;
      if (!cacheStorage || typeof cacheStorage.open !== 'function') return null;

      const cache = await cacheStorage.open(PERSISTENT_TTS_CACHE);
      const match = await cache.match(url);
      if (!match || !match.ok) return null;
      const blob = await match.blob();
      if (!blob || blob.size === 0) return null;
      return this.storeBlobInRam(cacheKey, blob);
    } catch {
      return null;
    }
  }

  private async writePersistentCache(url: string, blob: Blob): Promise<void> {
    try {
      const cacheStorage: CacheStorage | undefined =
        typeof caches !== 'undefined'
          ? caches
          : typeof window !== 'undefined'
            ? (window as any).caches
            : undefined;
      if (!cacheStorage || typeof cacheStorage.open !== 'function') return;

      const cache = await cacheStorage.open(PERSISTENT_TTS_CACHE);
      await cache.put(
        url,
        new Response(blob, {
          headers: { 'Content-Type': 'audio/mpeg' },
        })
      );
    } catch {
      // Gracefully ignore QuotaExceededError or private-mode restrictions
    }
  }

  private fetchAndCacheSegment(segment: string): Promise<string | null> {
    const cacheKey = segment.toLowerCase();
    const ramHit = this.blobUrlCache.get(cacheKey);
    if (ramHit) return Promise.resolve(ramHit);

    const inFlight = this.inFlightFetches.get(cacheKey);
    if (inFlight) return inFlight;

    const url = this.buildTtsUrl(segment);
    const promise = (async (): Promise<string | null> => {
      try {
        const diskHit = await this.readPersistentBlobUrl(cacheKey, url);
        if (diskHit) return diskHit;

        if (typeof fetch !== 'function') return null;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
        const blob = await res.blob();
        if (!blob || blob.size === 0) return null;

        void this.writePersistentCache(url, blob);
        return this.storeBlobInRam(cacheKey, blob);
      } catch {
        return null;
      } finally {
        this.inFlightFetches.delete(cacheKey);
      }
    })();

    this.inFlightFetches.set(cacheKey, promise);
    return promise;
  }

  private drainPrefetchQueue(): void {
    while (
      this.activePrefetchWorkers < this.maxPrefetchConcurrency &&
      this.prefetchQueue.length > 0
    ) {
      const nextSegment = this.prefetchQueue.shift();
      if (!nextSegment) break;
      const key = nextSegment.toLowerCase();
      this.queuedKeys.delete(key);

      if (this.blobUrlCache.has(key) || this.inFlightFetches.has(key)) {
        continue;
      }

      this.activePrefetchWorkers++;
      this.fetchAndCacheSegment(nextSegment).finally(() => {
        this.activePrefetchWorkers--;
        this.drainPrefetchQueue();
      });
    }
  }

  /**
   * Enqueues multiple words, sentences, or paragraphs for low-priority background pre-caching
   * into both RAM Blob URLs and persistent browser CacheStorage.
   */
  public enqueuePrefetch(texts: (string | undefined | null)[]): void {
    if (!this.soundEnabled || typeof window === 'undefined' || !Array.isArray(texts)) return;

    for (const raw of texts) {
      if (!raw) continue;
      const clean = cleanSpeechText(raw);
      if (!clean || clean.length > MAX_CLIENT_TTS_CHARS) continue;

      const segments = splitSpeechSegments(clean);
      for (const seg of segments) {
        const key = seg.toLowerCase();
        if (this.blobUrlCache.has(key) || this.inFlightFetches.has(key) || this.queuedKeys.has(key)) {
          continue;
        }
        if (this.prefetchQueue.length >= this.maxQueueLength) {
          const dropped = this.prefetchQueue.shift();
          if (dropped) this.queuedKeys.delete(dropped.toLowerCase());
        }
        this.prefetchQueue.push(seg);
        this.queuedKeys.add(key);
      }
    }

    this.drainPrefetchQueue();
  }

  // Immediate high-priority prefetch for a single word/sentence (e.g. current card or pointer hover)
  public prefetchEnglish(text: string): void {
    if (!this.soundEnabled || !text || typeof window === 'undefined') return;
    const clean = cleanSpeechText(text);
    if (!clean || clean.length > MAX_CLIENT_TTS_CHARS) return;

    const segments = splitSpeechSegments(clean);
    if (segments.length === 0) return;

    // Kick off segment 1 immediately, queue any remaining segments
    void this.fetchAndCacheSegment(segments[0]);
    if (segments.length > 1) {
      this.enqueuePrefetch(segments.slice(1));
    }
  }

  // Button tap sound (punchy, crisp bubble pop)
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // Rewarding warm chime (vibrant marimba / glass bell C5-E5-G5)
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.07;
        const duration = 0.18;

        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.20, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {}
  }

  // Clear 2-tone reminder tap (D4 -> B3)
  public playWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [293.66, 246.94];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.09;
        const duration = 0.16;

        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, startTime + duration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {}
  }

  // Celebratory victory arpeggio
  public playVictory() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const startTime = ctx.currentTime + idx * 0.08;
        const duration = 0.24;

        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {}
  }

  public playLevelUp() {
    this.playVictory();
  }

  private lolMatchFoundAudio: HTMLAudioElement | null = null;
  private lolAcceptAudio: HTMLAudioElement | null = null;
  private lolDeclineAudio: HTMLAudioElement | null = null;

  public preloadLolSounds() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.lolMatchFoundAudio) {
        this.lolMatchFoundAudio = new Audio('/sounds/lol_match_found.mp3');
        this.lolMatchFoundAudio.preload = 'auto';
        this.lolMatchFoundAudio.load();
      }
      if (!this.lolAcceptAudio) {
        this.lolAcceptAudio = new Audio('/sounds/lol_match_accept.mp3');
        this.lolAcceptAudio.preload = 'auto';
        this.lolAcceptAudio.load();
      }
      if (!this.lolDeclineAudio) {
        this.lolDeclineAudio = new Audio('/sounds/lol_match_decline.mp3');
        this.lolDeclineAudio.preload = 'auto';
        this.lolDeclineAudio.load();
      }
    } catch {}
  }

  public playLolMatchFound() {
    if (!this.soundEnabled) return;
    this.stopLolAudio();
    try {
      if (!this.lolMatchFoundAudio) {
        this.lolMatchFoundAudio = new Audio('/sounds/lol_match_found.mp3');
      }
      this.lolMatchFoundAudio.currentTime = 0;
      this.lolMatchFoundAudio.volume = 0.95;
      const p = this.lolMatchFoundAudio.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {
      console.warn('LoL match found error:', e);
    }
  }

  public playLolAccept() {
    if (!this.soundEnabled) return;
    this.stopLolAudio();
    try {
      if (!this.lolAcceptAudio) {
        this.lolAcceptAudio = new Audio('/sounds/lol_match_accept.mp3');
      }
      this.lolAcceptAudio.currentTime = 0;
      this.lolAcceptAudio.volume = 1.0;
      const p = this.lolAcceptAudio.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {
      console.warn('LoL accept error:', e);
    }
  }

  public playLolDecline() {
    if (!this.soundEnabled) return;
    this.stopLolAudio();
    try {
      if (!this.lolDeclineAudio) {
        this.lolDeclineAudio = new Audio('/sounds/lol_match_decline.mp3');
      }
      this.lolDeclineAudio.currentTime = 0;
      this.lolDeclineAudio.volume = 1.0;
      const p = this.lolDeclineAudio.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {
      console.warn('LoL decline error:', e);
    }
  }

  public stopLolAudio() {
    if (this.lolMatchFoundAudio) {
      try {
        this.lolMatchFoundAudio.pause();
        this.lolMatchFoundAudio.currentTime = 0;
      } catch {}
    }
  }

  /**
   * Zero-Delay Natural American Female (JennyNeural) speech playback:
   * - Stops any previous speech FIRST, then assigns a fresh requestId so ended/fallback callbacks stay valid.
   * - Plays synchronously in the user click stack (0ms from RAM Blob URL, or immediate chunked HTTP stream on miss)
   *   preserving iOS Safari / Android Chrome user-gesture activation even if a prefetch is currently inFlight.
   * - Splits long paragraphs into natural sentence segments so sentence 1 speaks almost immediately
   *   while sentences 2..N download in the background.
   */
  public speakEnglish(text: string, options?: SpeakOptions): Promise<void> {
    return new Promise((resolve) => {
      if (!this.soundEnabled || !text || typeof window === 'undefined') {
        resolve();
        return;
      }

      const cleanText = cleanSpeechText(text);
      if (!cleanText) {
        resolve();
        return;
      }

      const segments = splitSpeechSegments(cleanText);
      if (segments.length === 0) {
        resolve();
        return;
      }

      // Stop any active playback BEFORE allocating this request's ID!
      this.stopSpeaking();
      const requestId = ++this.speechRequestId;
      this.activeSpeechResolve = resolve;

      const isSentence = isSentenceText(cleanText);
      const playbackRate = options?.rate ?? (isSentence ? 0.86 : 0.96);

      // Pre-warm segments 2..N in parallel while segment 1 begins immediately
      if (segments.length > 1) {
        this.enqueuePrefetch(segments.slice(1));
      }

      const firstSegment = segments[0];
      const firstKey = firstSegment.toLowerCase();
      const firstCachedBlob = this.blobUrlCache.get(firstKey);
      const firstSrc = firstCachedBlob || this.buildTtsUrl(firstSegment);
      const firstIsDirect = !firstCachedBlob;

      if (firstIsDirect) {
        // Populate RAM + persistent cache for instant 0ms replay on 2nd click
        void this.fetchAndCacheSegment(firstSegment);
      }

      // Play segment 1 synchronously inside the click gesture call stack!
      const firstPromise = this.playSegmentOnce(
        firstSrc,
        playbackRate,
        requestId,
        firstSegment,
        isSentence,
        firstIsDirect
      );

      if (segments.length === 1) {
        firstPromise.then(() => {
          if (requestId === this.speechRequestId) {
            this.finishSpeech();
          }
        });
        return;
      }

      // Play remaining segments 2..N sequentially unless stopped
      void (async () => {
        await firstPromise;
        for (let i = 1; i < segments.length; i++) {
          if (requestId !== this.speechRequestId) return;
          const seg = segments[i];
          const key = seg.toLowerCase();
          let src = this.blobUrlCache.get(key) ?? null;
          if (!src) {
            src = await this.readPersistentBlobUrl(key, this.buildTtsUrl(seg));
          }
          if (!src && this.inFlightFetches.has(key)) {
            src = await Promise.race([
              this.inFlightFetches.get(key)!,
              new Promise<null>((r) => setTimeout(() => r(null), 600)),
            ]);
          }
          if (requestId !== this.speechRequestId) return;

          const useSrc = src || this.buildTtsUrl(seg);
          const isDirect = !src;
          if (isDirect) void this.fetchAndCacheSegment(seg);

          await this.playSegmentOnce(useSrc, playbackRate, requestId, seg, true, isDirect);
        }
        if (requestId === this.speechRequestId) {
          this.finishSpeech();
        }
      })();
    });
  }

  private playSegmentOnce(
    src: string,
    playbackRate: number,
    requestId: number,
    cleanSegment: string,
    isSentence: boolean,
    isDirectStream: boolean
  ): Promise<void> {
    return new Promise((resolveSegment) => {
      if (requestId !== this.speechRequestId) {
        resolveSegment();
        return;
      }

      let settled = false;
      const cleanupWatchdog = () => {
        if (this.watchdogTimeoutId) {
          clearTimeout(this.watchdogTimeoutId);
          this.watchdogTimeoutId = null;
        }
      };

      const finishSegment = () => {
        if (settled) return;
        settled = true;
        cleanupWatchdog();
        resolveSegment();
      };

      const triggerFallbackOnce = () => {
        if (settled || requestId !== this.speechRequestId) {
          finishSegment();
          return;
        }
        settled = true;
        cleanupWatchdog();
        if (this.currentAudio) {
          try {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
          } catch {}
          this.currentAudio = null;
        }
        this.speakWithFemaleSpeechSynthesis(cleanSegment, requestId, isSentence).then(resolveSegment);
      };

      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = 1.0;
        if ('preservesPitch' in audio) {
          (audio as any).preservesPitch = true;
        }
        audio.playbackRate = playbackRate;
        this.currentAudio = audio;

        if (isDirectStream) {
          this.watchdogTimeoutId = setTimeout(triggerFallbackOnce, 2200);
        }

        audio.addEventListener(
          'playing',
          () => {
            cleanupWatchdog();
            // Re-assert playbackRate once media pipeline starts (Safari resets rate on src assign)
            try { audio.playbackRate = playbackRate; } catch {}
          },
          { once: true }
        );

        audio.addEventListener(
          'ended',
          () => {
            if (this.currentAudio === audio) {
              this.currentAudio = null;
            }
            finishSegment();
          },
          { once: true }
        );

        audio.addEventListener(
          'error',
          () => {
            triggerFallbackOnce();
          },
          { once: true }
        );

        audio.src = src;
        audio.playbackRate = playbackRate;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            triggerFallbackOnce();
          });
        }
      } catch {
        triggerFallbackOnce();
      }
    });
  }

  private speakWithFemaleSpeechSynthesis(
    text: string,
    requestId: number,
    isSentence: boolean
  ): Promise<void> {
    return new Promise((resolveFallback) => {
      if (requestId !== this.speechRequestId) {
        resolveFallback();
        return;
      }
      if (typeof window === 'undefined' || !('speechSynthesis' in window) || !window.speechSynthesis) {
        resolveFallback();
        return;
      }

      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }

        setTimeout(() => {
          if (requestId !== this.speechRequestId) {
            resolveFallback();
            return;
          }

          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'en-US';
          utterance.rate = isSentence ? 0.86 : 0.95;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          if (!this.femaleVoice) this.initFemaleVoices();
          if (this.femaleVoice) utterance.voice = this.femaleVoice;

          utterance.onend = () => resolveFallback();
          utterance.onerror = () => resolveFallback();

          window.speechSynthesis.speak(utterance);

          setTimeout(() => {
            try {
              if (window.speechSynthesis && window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
              }
            } catch {}
          }, 50);
        }, 35);
      } catch {
        resolveFallback();
      }
    });
  }

  public stopSpeaking() {
    ++this.speechRequestId;

    if (this.watchdogTimeoutId) {
      clearTimeout(this.watchdogTimeoutId);
      this.watchdogTimeoutId = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }

    this.finishSpeech();
  }

  private finishSpeech() {
    if (this.activeSpeechResolve) {
      const resolve = this.activeSpeechResolve;
      this.activeSpeechResolve = null;
      resolve();
    }
  }
}

export const sounds = new SoundEngine();
