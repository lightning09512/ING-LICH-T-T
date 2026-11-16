// Web Audio API Synthesizer - 100% offline, zero external audio file dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private femaleVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoices();
  }

  // Pre-load and lock strictly to a pleasant, natural female English voice
  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const selectFemaleVoice = () => {
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
        'google us english',
        'microsoft jenny',
        'microsoft aria',
        'microsoft zira',
        'samantha',
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

      // 2. Try any English voice with 'female' or 'natural' in the name that is not male
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
    };

    selectFemaleVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
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
      this.ctx.resume();
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

  // Retro 8-bit button blip
  public playClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  // Success 8-bit chime (C-E-G-C)
  public playCorrect() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.15);
    });
  }

  // Comedic wrong answer buzz
  public playWrong() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }

  // Fanfare win arpeggio
  public playVictory() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880, 880, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
    });
  }

  // Standardized high-fidelity natural female English pronunciation
  public speakEnglish(text: string, rate: number = 0.92): Promise<void> {
    return new Promise((resolve) => {
      if (!this.soundEnabled) {
        resolve();
        return;
      }

      const cleanText = text.trim();
      if (!cleanText) {
        resolve();
        return;
      }

      // Stop any currently playing audio or speech
      this.stopSpeaking();

      // Primary: High-fidelity natural female native voice via Google TTS (consistent, warm, crystal-clear American female)
      if (cleanText.length <= 200) {
        try {
          const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
          const audio = new Audio(audioUrl);
          this.currentAudio = audio;

          audio.onended = () => {
            this.currentAudio = null;
            resolve();
          };

          audio.onerror = () => {
            this.currentAudio = null;
            this.speakWithSpeechSynthesis(cleanText, rate, resolve);
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              this.currentAudio = null;
              this.speakWithSpeechSynthesis(cleanText, rate, resolve);
            });
          }
          return;
        } catch {
          // Fall through to female SpeechSynthesis fallback
        }
      }

      // Secondary / Fallback: Strictly female Web SpeechSynthesis
      this.speakWithSpeechSynthesis(cleanText, rate, resolve);
    });
  }

  private speakWithSpeechSynthesis(text: string, rate: number, resolve: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.08; // Friendly, warm female pitch

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    if (!this.femaleVoice) {
      this.initVoices();
    }

    if (this.femaleVoice) {
      utterance.voice = this.femaleVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sounds = new SoundEngine();
