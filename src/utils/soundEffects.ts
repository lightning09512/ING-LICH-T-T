// Web Audio API sound effects and high-fidelity Natural Human American Female pronunciation engine.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private activeSpeechResolve: (() => void) | null = null;
  private audioCache = new Map<string, HTMLAudioElement>();
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private networkTimeoutId: any = null;

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
    if (!cleanText || cleanText.length > 200) return;

    const cacheKey = cleanText.toLowerCase();
    if (this.audioCache.has(cacheKey)) return;

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      
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

      this.stopSpeaking();
      this.activeSpeechResolve = resolve;

      const cacheKey = cleanText.toLowerCase();

      // 1. Instant Play from In-Memory Cache (0ms)
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
          this.fallbackSpeech(cleanText);
        };

        cached.play().catch(() => {
          this.fallbackSpeech(cleanText);
        });
        return;
      }

      // 2. Play Microsoft Jenny Neural voice from /api/tts (Ultra-natural female human AI)
      let hasFallenBack = false;
      const triggerFallback = () => {
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
        this.fallbackSpeech(cleanText);
      };

      // 1000ms safety timeout: if server is slow, seamlessly fall back to dictionary human voice or female Web Speech
      this.networkTimeoutId = setTimeout(() => {
        triggerFallback();
      }, 1000);

      try {
        const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
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
          triggerFallback();
        };

        audio.src = audioUrl;
        audio.load();
        audio.play().catch(() => {
          triggerFallback();
        });
      } catch {
        triggerFallback();
      }
    });
  }

  // Seamless Fallback: First try real human studio MP3 for single words, then natural female Web Speech
  private fallbackSpeech(cleanText: string) {
    const isSingleWord = !cleanText.includes(' ') && /^[a-zA-Z]+$/.test(cleanText);

    if (isSingleWord) {
      // Try human studio recording from dictionaryapi
      const humanAudioUrl = `https://api.dictionaryapi.dev/media/pronunciations/en/${cleanText.toLowerCase()}-us.mp3`;
      const humanAudio = new Audio(humanAudioUrl);
      humanAudio.volume = 0.95;
      this.currentAudio = humanAudio;

      humanAudio.onended = () => {
        if (this.currentAudio === humanAudio) this.currentAudio = null;
        this.finishSpeech();
      };

      humanAudio.onerror = () => {
        if (this.currentAudio === humanAudio) this.currentAudio = null;
        this.speakWithFemaleSpeechSynthesis(cleanText);
      };

      humanAudio.play().catch(() => {
        this.speakWithFemaleSpeechSynthesis(cleanText);
      });
    } else {
      this.speakWithFemaleSpeechSynthesis(cleanText);
    }
  }

  // Strictly Female Web Speech Synthesis (0ms latency, warm friendly pitch, strictly NO robotic male voice)
  private speakWithFemaleSpeechSynthesis(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.finishSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.90;  // Gentle, clear, natural pace
      utterance.pitch = 1.06; // Friendly, warm, natural female pitch
      utterance.volume = 1.0;

      if (!this.femaleVoice) {
        this.initFemaleVoices();
      }

      if (this.femaleVoice) {
        utterance.voice = this.femaleVoice;
      }

      utterance.onend = () => {
        this.finishSpeech();
      };

      utterance.onerror = () => {
        this.finishSpeech();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SoundEngine] Female SpeechSynthesis error:', err);
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
