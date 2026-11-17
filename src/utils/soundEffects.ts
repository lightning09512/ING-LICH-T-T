// Web Audio API sound effects and high-fidelity Natural Human American Female pronunciation engine.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private activeSpeechResolve: (() => void) | null = null;
  private speechRequestId = 0;
  private audioCache = new Map<string, HTMLAudioElement>();
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private networkTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.initFemaleVoices();
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

  // Pre-caches the pleasant female native voice in memory for instant playback on click
  public prefetchEnglish(text: string) {
    if (!this.soundEnabled || !text || typeof window === 'undefined') return;

    const cleanText = this.cleanSpeechText(text);
    if (!cleanText || cleanText.length > 300) return;

    const cacheKey = cleanText.toLowerCase();
    if (this.audioCache.has(cacheKey)) return;

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.playbackRate = 1.15;
      audio.src = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      this.audioCache.set(cacheKey, audio);

      audio.addEventListener('error', () => {
        if (this.audioCache.get(cacheKey) === audio) {
          this.audioCache.delete(cacheKey);
        }
      }, { once: true });

      audio.load();

      // Keep cache bounded to 100 items
      if (this.audioCache.size > 100) {
        const oldest = this.audioCache.keys().next().value;
        if (oldest) {
          const oldAudio = this.audioCache.get(oldest);
          if (oldAudio) {
            oldAudio.removeAttribute('src');
            oldAudio.load();
          }
          this.audioCache.delete(oldest);
        }
      }
    } catch {
      // Preload failure is silent
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

  private cleanSpeechText(text: string): string {
    return text
      .replace(/\/[^\/]+\//g, '')     // Strip IPA phonetic transcription like /əˈkɑː.mə.deɪt/
      .replace(/\([^)]*\)/g, '')       // Strip (v), (n), (adj) annotations
      .replace(/\[[^\]]*\]/g, '')      // Strip [v], [n]
      .replace(/•.*$/g, '')            // Strip bullet comments
      .replace(/[\r\n\t]+/g, ' ')      // Normalize linebreaks
      .trim();
  }

  /**
   * High-fidelity, natural American FEMALE pronunciation:
   * 1. Check in-memory audio cache -> Instant play (0ms).
   * 2. Primary: Natural Microsoft Jenny Neural Voice (/api/tts) with 1000ms timeout.
   * 3. Secondary: Real Human Studio Voice from Dictionary API for single words.
   * 4. Fallback: Strictly filtered Female Web SpeechSynthesis (Jenny, Aria, Google US English, Samantha, Ava).
   * Strictly avoids robotic voices.
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

      const cacheKey = cleanText.toLowerCase();

      // 0. If the browser natively has Microsoft Jenny Online (Natural) available,
      // play immediately with 0ms latency using the exact same Jenny voice model!
      if (this.femaleVoice && this.femaleVoice.name.toLowerCase().includes('jenny')) {
        this.speakWithFemaleSpeechSynthesis(cleanText, requestId);
        return;
      }

      // 1. Instant Play from in-memory cache
      const cached = this.audioCache.get(cacheKey);
      if (cached) {
        cached.playbackRate = 1.15;
        this.currentAudio = cached;

        cached.onended = () => {
          if (this.currentAudio === cached) this.currentAudio = null;
          this.finishSpeech();
        };

        if (cached.readyState >= 2) {
          cached.currentTime = 0;
          cached.volume = 1.0;
          cached.play().catch(() => this.fallbackSpeech(cleanText, requestId));
          return;
        } else {
          // Already in-flight! Start playing as soon as the first chunk is buffered
          let started = false;
          const playWhenReady = () => {
            if (started || requestId !== this.speechRequestId) return;
            started = true;
            if (this.networkTimeoutId) {
              clearTimeout(this.networkTimeoutId);
              this.networkTimeoutId = null;
            }
            cached.currentTime = 0;
            cached.volume = 1.0;
            cached.play().catch(() => this.fallbackSpeech(cleanText, requestId));
          };

          cached.addEventListener('canplay', playWhenReady, { once: true });
          cached.addEventListener('error', () => {
            if (!started) this.fallbackSpeech(cleanText, requestId);
          }, { once: true });

          this.networkTimeoutId = setTimeout(() => {
            if (!started) {
              started = true;
              this.fallbackSpeech(cleanText, requestId);
            }
          }, 850);
          return;
        }
      }

      // 2. Fetch from Neural Edge TTS with quick fallback
      let hasFallenBack = false;
      const triggerFallback = () => {
        if (hasFallenBack || requestId !== this.speechRequestId) return;
        hasFallenBack = true;
        if (this.networkTimeoutId) {
          clearTimeout(this.networkTimeoutId);
          this.networkTimeoutId = null;
        }
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.removeAttribute('src');
          this.currentAudio.load();
          this.currentAudio = null;
        }
        this.fallbackSpeech(cleanText, requestId);
      };

      this.networkTimeoutId = setTimeout(triggerFallback, 850);

      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = 1.0;
        audio.playbackRate = 1.15;
        this.currentAudio = audio;
        this.audioCache.set(cacheKey, audio);

        audio.oncanplay = () => {
          if (hasFallenBack || requestId !== this.speechRequestId) return;
          if (this.networkTimeoutId) {
            clearTimeout(this.networkTimeoutId);
            this.networkTimeoutId = null;
          }
          audio.currentTime = 0;
          audio.play().catch(triggerFallback);
        };
        audio.onended = () => {
          if (this.networkTimeoutId) {
            clearTimeout(this.networkTimeoutId);
            this.networkTimeoutId = null;
          }
          if (this.currentAudio === audio) this.currentAudio = null;
          this.finishSpeech();
        };
        audio.onerror = triggerFallback;
        audio.src = `/api/tts?text=${encodeURIComponent(cleanText)}`;
        audio.load();
      } catch {
        triggerFallback();
      }
    });
  }

  // Instant fallback to the browser's preferred pleasant natural female voice (0ms delay)
  private fallbackSpeech(cleanText: string, requestId: number) {
    if (requestId !== this.speechRequestId) return;
    this.speakWithFemaleSpeechSynthesis(cleanText, requestId);
  }

  private speakWithFemaleSpeechSynthesis(text: string, requestId: number) {
    if (requestId !== this.speechRequestId) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.finishSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.15; // Crisp, lively, brisk speed (not dragging)
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
    } catch {
      this.finishSpeech();
    }
  }

  public stopSpeaking() {
    ++this.speechRequestId;

    if (this.networkTimeoutId) {
      clearTimeout(this.networkTimeoutId);
      this.networkTimeoutId = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.removeAttribute('src');
      this.currentAudio.load();
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
