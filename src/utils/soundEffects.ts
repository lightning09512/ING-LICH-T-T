// Web Audio API sound effects and high-fidelity Natural Human American Female pronunciation engine.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private activeSpeechResolve: (() => void) | null = null;
  private speechRequestId = 0;
  private blobUrlCache = new Map<string, string>();
  private inFlightFetches = new Map<string, Promise<string | null>>();
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private watchdogTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private maxCacheSize = 150;

  constructor() {
    this.initFemaleVoices();
    if (typeof window !== 'undefined') {
      setTimeout(() => this.prefetchEnglish('welcome'), 1000);
    }
  }

  // Pre-load and strictly lock to a pleasant, natural American female voice
  private initFemaleVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const selectFemaleVoice = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        const MALE_NAMES = [
          'david', 'mark', 'george', 'guy', 'stefan', 'richard', 'christopher', 
          'paul', 'tom', 'alex', 'fred', 'daniel', 'james', 'brian', 'charles', 
          'male', 'man', 'boy'
        ];

        const isMale = (name: string) => {
          const lower = name.toLowerCase();
          return MALE_NAMES.some(m => lower.includes(m));
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
          'female'
        ];

        // 1. Try to find standard high-quality natural female voices
        let chosen = voices.find(v => {
          if (!v.lang.startsWith('en')) return false;
          if (isMale(v.name)) return false;
          const lower = v.name.toLowerCase();
          return PREFERRED_FEMALE.some(f => lower.includes(f));
        });

        // 2. Try any English voice with 'female' or 'natural' in the name that is strictly not male
        if (!chosen) {
          chosen = voices.find(v => {
            if (!v.lang.startsWith('en')) return false;
            if (isMale(v.name)) return false;
            const lower = v.name.toLowerCase();
            return lower.includes('female') || lower.includes('natural');
          });
        }

        // 3. Fallback to any English voice that is strictly NOT in the male list
        if (!chosen) {
          chosen = voices.find(v => v.lang.startsWith('en') && !isMale(v.name));
        }

        if (chosen) {
          this.femaleVoice = chosen;
        }
      } catch {
        // Voice selection error handling
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
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  // Pre-caches the pleasant female native voice in memory as Blob URL for instant 0ms playback
  public prefetchEnglish(text: string): void {
    if (!this.soundEnabled || !text || typeof window === 'undefined') return;

    const cleanText = this.cleanSpeechText(text);
    if (!cleanText || cleanText.length > 500) return;

    const cacheKey = cleanText.toLowerCase();
    if (this.blobUrlCache.has(cacheKey) || this.inFlightFetches.has(cacheKey)) return;

    const fetchPromise = fetch(`/api/tts?text=${encodeURIComponent(cleanText)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`TTS HTTP error: ${res.status}`);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        if (this.blobUrlCache.size >= this.maxCacheSize) {
          const oldestKey = this.blobUrlCache.keys().next().value;
          if (oldestKey) {
            const oldUrl = this.blobUrlCache.get(oldestKey);
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            this.blobUrlCache.delete(oldestKey);
          }
        }

        this.blobUrlCache.set(cacheKey, blobUrl);
        this.inFlightFetches.delete(cacheKey);
        return blobUrl;
      })
      .catch(() => {
        this.inFlightFetches.delete(cacheKey);
        return null;
      });

    this.inFlightFetches.set(cacheKey, fetchPromise);
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
      // Crisp bubble pop: 540Hz -> 320Hz
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext failure handling
    }
  }

  // Rewarding warm chime (vibrant marimba / glass bell C5-E5-G5)
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
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
    } catch {
      // AudioContext failure handling
    }
  }

  // Clear 2-tone reminder tap (D4 -> B3)
  public playWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [293.66, 246.94]; // D4 -> B3
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
    } catch {
      // AudioContext failure handling
    }
  }

  // Celebratory victory arpeggio
  public playVictory() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
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
    } catch {
      // AudioContext failure handling
    }
  }

  public playLevelUp() {
    this.playVictory();
  }

  private lolMatchFoundAudio: HTMLAudioElement | null = null;
  private lolAcceptAudio: HTMLAudioElement | null = null;
  private lolDeclineAudio: HTMLAudioElement | null = null;

  // ==========================================
  // LEAGUE OF LEGENDS (HEXTECH) SOUND EFFECTS - OFFICIAL MP3s
  // ==========================================

  /**
   * 1. Âm thanh Tìm thấy trận (Match Found) - Chuẩn LMHT
   */
  public playLolMatchFound() {
    if (!this.soundEnabled) return;
    this.stopLolAudio();
    try {
      this.lolMatchFoundAudio = new Audio('/sounds/lol_match_found.mp3');
      this.lolMatchFoundAudio.volume = 0.95;
      this.lolMatchFoundAudio.play().catch(e => console.warn('LoL match found audio error:', e));
    } catch (e) {
      console.warn('LoL match found error:', e);
    }
  }

  /**
   * 2. Âm thanh Chấp nhận trận (Match Accept) - Chuẩn LMHT
   */
  public playLolAccept() {
    if (!this.soundEnabled) return;
    this.stopLolAudio();
    try {
      this.lolAcceptAudio = new Audio('/sounds/lol_match_accept.mp3');
      this.lolAcceptAudio.volume = 1.0;
      this.lolAcceptAudio.play().catch(e => console.warn('LoL accept audio error:', e));
    } catch (e) {
      console.warn('LoL accept error:', e);
    }
  }

  /**
   * 3. Âm thanh Từ chối / Hủy trận (Match Decline) - Chuẩn LMHT
   */
  public playLolDecline() {
    if (!this.soundEnabled) return;
    this.stopLolAudio();
    try {
      this.lolDeclineAudio = new Audio('/sounds/lol_match_decline.mp3');
      this.lolDeclineAudio.volume = 1.0;
      this.lolDeclineAudio.play().catch(e => console.warn('LoL decline audio error:', e));
    } catch (e) {
      console.warn('LoL decline error:', e);
    }
  }

  /**
   * Dừng âm thanh nền Match Found khi bấm Chấp nhận hoặc Hủy
   */
  public stopLolAudio() {
    if (this.lolMatchFoundAudio) {
      try {
        this.lolMatchFoundAudio.pause();
        this.lolMatchFoundAudio.currentTime = 0;
      } catch {}
      this.lolMatchFoundAudio = null;
    }
  }

  private cleanSpeechText(text: string): string {
    return text
      .replace(/\/[^\/]+\//g, '')               // Strip IPA phonetic transcription like /əˈkɑː.mə.deɪt/
      .replace(/\([^)]*\)/g, '')                 // Strip (v), (n), (adj) annotations
      .replace(/\[[^\]]*\]/g, '')                // Strip [v], [n]
      .replace(/•.*$/g, '')                      // Strip bullet comments
      .replace(/^["'“”‘«»]+|["'“”’»«]+$/g, '')   // Strip enclosing quotes
      .replace(/_{2,}/g, 'blank')                // Replace blanks like ___ with "blank"
      .replace(/[\r\n\t]+/g, ' ')                // Normalize linebreaks
      .replace(/\s+/g, ' ')                      // Collapse spaces
      .trim();
  }

  /**
   * High-fidelity, natural American FEMALE pronunciation:
   * 1. Primary: Microsoft Jenny Neural EdgeTTS (/api/tts)
   * 2. Instant Play from in-memory Blob URL cache (0ms delay for 1st, 2nd, 100th replay)
   * 3. Synchronous .play() call stack ensures 100% compliance with mobile/browser autoplay policies
   * 4. Unified consistent pacing:
   *    - Words: 0.96x (crisp, natural, clear articulation)
   *    - Example sentences: 0.85x (relaxed, learner-friendly, comfortable pace)
   * 5. Resilient fallback: Female Web SpeechSynthesis if network is unavailable
   */
  public speakEnglish(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.soundEnabled || !text || typeof window === 'undefined') {
        resolve();
        return;
      }

      const cleanText = this.cleanSpeechText(text);
      if (!cleanText) {
        resolve();
        return;
      }

      const requestId = ++this.speechRequestId;
      this.stopSpeaking();
      this.activeSpeechResolve = resolve;

      const isSentence = cleanText.includes(' ') || cleanText.length > 25;
      const playbackRate = isSentence ? 0.85 : 0.96;
      const cacheKey = cleanText.toLowerCase();

      // 1. Instant Play from in-memory Blob URL (0ms latency, 100% reliable repeated clicks)
      const cachedBlobUrl = this.blobUrlCache.get(cacheKey);
      if (cachedBlobUrl) {
        this.playAudioSource(cachedBlobUrl, playbackRate, requestId, cleanText, isSentence, false);
        return;
      }

      // 2. If prefetch is in-flight, wait briefly for it
      const inFlight = this.inFlightFetches.get(cacheKey);
      if (inFlight) {
        let hasTimedOut = false;
        const inFlightTimeout = setTimeout(() => {
          if (!hasTimedOut && requestId === this.speechRequestId) {
            hasTimedOut = true;
            const directUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
            this.playAudioSource(directUrl, playbackRate, requestId, cleanText, isSentence, true);
          }
        }, 800);

        inFlight.then((blobUrl) => {
          clearTimeout(inFlightTimeout);
          if (hasTimedOut || requestId !== this.speechRequestId) return;
          if (blobUrl) {
            this.playAudioSource(blobUrl, playbackRate, requestId, cleanText, isSentence, false);
          } else {
            const directUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
            this.playAudioSource(directUrl, playbackRate, requestId, cleanText, isSentence, true);
          }
        });
        return;
      }

      // 3. Not in cache: Play directly via streaming Audio element in the user gesture stack
      const directUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      this.playAudioSource(directUrl, playbackRate, requestId, cleanText, isSentence, true);

      // Proactively prefetch and cache as Blob for instant replay on 2nd and subsequent clicks
      this.prefetchEnglish(cleanText);
    });
  }

  private playAudioSource(
    src: string,
    playbackRate: number,
    requestId: number,
    cleanText: string,
    isSentence: boolean,
    isDirectStream: boolean
  ) {
    let hasEndedOrFailed = false;

    const cleanup = () => {
      if (this.watchdogTimeoutId) {
        clearTimeout(this.watchdogTimeoutId);
        this.watchdogTimeoutId = null;
      }
    };

    const triggerFallbackOnce = () => {
      if (hasEndedOrFailed || requestId !== this.speechRequestId) return;
      hasEndedOrFailed = true;
      cleanup();
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch {}
        this.currentAudio = null;
      }
      this.fallbackSpeech(cleanText, requestId, isSentence);
    };

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 1.0;
      audio.playbackRate = playbackRate;
      this.currentAudio = audio;

      // Watchdog for direct streaming: if no sound starts within 2200ms, fallback to browser synthesis
      if (isDirectStream) {
        this.watchdogTimeoutId = setTimeout(triggerFallbackOnce, 2200);
      }

      audio.addEventListener('playing', () => {
        cleanup();
      }, { once: true });

      audio.addEventListener('ended', () => {
        if (hasEndedOrFailed || requestId !== this.speechRequestId) return;
        hasEndedOrFailed = true;
        cleanup();
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
        this.finishSpeech();
      }, { once: true });

      audio.addEventListener('error', () => {
        triggerFallbackOnce();
      }, { once: true });

      audio.src = src;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          triggerFallbackOnce();
        });
      }
    } catch {
      triggerFallbackOnce();
    }
  }

  // Fallback to browser's natural female voice if server is unreachable
  private fallbackSpeech(cleanText: string, requestId: number, isSentence: boolean) {
    if (requestId !== this.speechRequestId) return;
    this.speakWithFemaleSpeechSynthesis(cleanText, requestId, isSentence);
  }

  private speakWithFemaleSpeechSynthesis(text: string, requestId: number, isSentence: boolean) {
    if (requestId !== this.speechRequestId) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.finishSpeech();
      return;
    }

    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }

      setTimeout(() => {
        if (requestId !== this.speechRequestId) return;

        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        // Sentences: 0.85; Words: 0.95 (unified with EdgeTTS speeds)
        utterance.rate = isSentence ? 0.85 : 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        if (!this.femaleVoice) this.initFemaleVoices();
        if (this.femaleVoice) utterance.voice = this.femaleVoice;

        utterance.onend = () => {
          if (requestId === this.speechRequestId) this.finishSpeech();
        };
        utterance.onerror = () => {
          if (requestId === this.speechRequestId) this.finishSpeech();
        };

        window.speechSynthesis.speak(utterance);

        // Chromium queue watchdog
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }, 50);
      }, 40);
    } catch {
      this.finishSpeech();
    }
  }

  public stopSpeaking() {
    ++this.speechRequestId;

    if (this.watchdogTimeoutId) {
      clearTimeout(this.watchdogTimeoutId);
      this.watchdogTimeoutId = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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
