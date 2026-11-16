// Web Audio API sound effects and high-performance, zero-latency English pronunciation engine.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private activeSpeechResolve: (() => void) | null = null;
  private audioCache = new Map<string, HTMLAudioElement>();
  private cachedVoice: SpeechSynthesisVoice | null = null;
  private networkTimeoutId: any = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const selectBestVoice = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        // Priority 1: High-fidelity Natural / Neural American English voices
        const priorityVoice = voices.find(v => 
          (v.lang === 'en-US' || v.lang === 'en_US') && (
            v.name.includes('Natural') || 
            v.name.includes('Neural') || 
            v.name.includes('Google') || 
            v.name.includes('Jenny') || 
            v.name.includes('Samantha') || 
            v.name.includes('Aria') ||
            v.name.includes('Ava')
          )
        ) 
        // Priority 2: Standard US English voice
        || voices.find(v => v.lang === 'en-US' || v.lang === 'en_US')
        // Priority 3: Any English voice (en-GB, en-AU, etc.)
        || voices.find(v => v.lang.startsWith('en'));

        if (priorityVoice) {
          this.cachedVoice = priorityVoice;
        }
      } catch {
        // Ignore voice selection errors
      }
    };

    selectBestVoice();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = selectBestVoice;
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

  // Pre-caches the authentic native pronunciation audio in memory for instant playback on click
  public prefetchEnglish(text: string) {
    if (!this.soundEnabled || !text || typeof window === 'undefined') return;

    const cleanText = this.cleanSpeechText(text);
    if (!cleanText || cleanText.length > 200) return;

    const cacheKey = cleanText.toLowerCase();
    if (this.audioCache.has(cacheKey)) return;

    const wordCount = cleanText.split(/\s+/).length;
    // Only prefetch single words or very short phrases (up to 4 words)
    if (wordCount <= 4) {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&type=2`;
        
        audio.addEventListener('canplaythrough', () => {
          this.audioCache.set(cacheKey, audio);
        }, { once: true });

        audio.addEventListener('error', () => {
          if (this.audioCache.get(cacheKey) === audio) {
            this.audioCache.delete(cacheKey);
          }
        }, { once: true });

        audio.load();

        // Keep cache bounded to 60 items
        if (this.audioCache.size > 60) {
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
  }

  // Gentle soft button tap (soothing bubble pop, non-intrusive)
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Subtle downward bubble pop: 520Hz -> 340Hz
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext failure handling
    }
  }

  // Soothing warm chime (gentle marimba / glass bell C5-E5-G5)
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
        const duration = 0.16;

        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.045, startTime + 0.02);
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

  // Gentle soft reminder (warm soft 2-tone tap, never harsh or loud)
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
        const duration = 0.14;

        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, startTime + duration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.02);
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

  // Gentle music-box victory arpeggio
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
        const duration = 0.22;

        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.04, startTime + 0.02);
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
   * Ultra-fast English Speech Synthesis with Zero-Lag Multi-Tier Fallback:
   * 1. Check in-memory audio cache -> Instant play (0ms).
   * 2. For single words & short phrases: Try high-quality native US studio pronunciation with strict 650ms timeout.
   * 3. Instant fallback to Native Web Speech API (window.speechSynthesis) -> 0ms latency, 100% offline, guaranteed to speak.
   * 4. For long sentences: Directly use Native Web Speech API for natural intonation and zero network latency.
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

      this.stopSpeaking();
      this.activeSpeechResolve = resolve;

      const wordCount = cleanText.split(/\s+/).length;

      // Single word or short phrase (<= 4 words)
      if (wordCount <= 4) {
        const cacheKey = cleanText.toLowerCase();

        // 1. Instant Play from In-Memory Cache
        const cached = this.audioCache.get(cacheKey);
        if (cached && cached.readyState >= 2) {
          cached.currentTime = 0;
          cached.volume = 0.95;
          this.currentAudio = cached;

          cached.onended = () => {
            if (this.currentAudio === cached) this.currentAudio = null;
            this.finishSpeech();
          };
          cached.onerror = () => {
            if (this.currentAudio === cached) this.currentAudio = null;
            this.speakWithSpeechSynthesis(cleanText);
          };

          cached.play().catch(() => {
            this.speakWithSpeechSynthesis(cleanText);
          });
          return;
        }

        // 2. Fetch authentic US Native Studio human recording with strict 650ms timeout
        let hasFallenBack = false;
        const fallbackToSpeechSynthesis = () => {
          if (hasFallenBack) return;
          hasFallenBack = true;
          if (this.networkTimeoutId) {
            clearTimeout(this.networkTimeoutId);
            this.networkTimeoutId = null;
          }
          if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
          }
          this.speakWithSpeechSynthesis(cleanText);
        };

        // Strict 650ms timer: if network is lagging or offline, fall back instantly to Web Speech API
        this.networkTimeoutId = setTimeout(() => {
          fallbackToSpeechSynthesis();
        }, 650);

        try {
          const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanText)}&type=2`;
          const audio = new Audio();
          audio.preload = 'auto';
          audio.volume = 0.95;
          this.currentAudio = audio;

          audio.oncanplaythrough = () => {
            if (hasFallenBack) return;
            if (this.networkTimeoutId) {
              clearTimeout(this.networkTimeoutId);
              this.networkTimeoutId = null;
            }
            this.audioCache.set(cacheKey, audio);
          };

          audio.onended = () => {
            if (this.networkTimeoutId) {
              clearTimeout(this.networkTimeoutId);
              this.networkTimeoutId = null;
            }
            if (this.currentAudio === audio) this.currentAudio = null;
            this.finishSpeech();
          };

          audio.onerror = () => {
            fallbackToSpeechSynthesis();
          };

          audio.src = audioUrl;
          audio.load();
          audio.play().catch(() => {
            fallbackToSpeechSynthesis();
          });
        } catch {
          fallbackToSpeechSynthesis();
        }
      } else {
        // For full sentences / examples: Native Web Speech API is instantaneous, natural, and requires no network
        this.speakWithSpeechSynthesis(cleanText);
      }
    });
  }

  // Built-in OS/Browser Speech Synthesis: 0ms latency, zero bandwidth, 100% reliable
  private speakWithSpeechSynthesis(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.finishSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      // Workaround for Chrome/Android where speech can get stuck in paused state
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92; // Slightly articulated rate, ideal for TOEIC learners
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (this.cachedVoice) {
        utterance.voice = this.cachedVoice;
      } else {
        const voices = window.speechSynthesis.getVoices();
        const best = voices.find(v => (v.lang === 'en-US' || v.lang === 'en_US') && (
          v.name.includes('Natural') || 
          v.name.includes('Neural') || 
          v.name.includes('Google') || 
          v.name.includes('Jenny') || 
          v.name.includes('Samantha') || 
          v.name.includes('Aria')
        )) || voices.find(v => v.lang.startsWith('en'));

        if (best) {
          this.cachedVoice = best;
          utterance.voice = best;
        }
      }

      utterance.onend = () => {
        this.finishSpeech();
      };

      utterance.onerror = () => {
        this.finishSpeech();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SoundEngine] SpeechSynthesis error:', err);
      this.finishSpeech();
    }
  }

  public stopSpeaking() {
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
