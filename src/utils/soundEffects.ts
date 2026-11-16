// Web Audio API Synthesizer - 100% offline, zero external audio file dependencies

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private englishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.initVoices();
  }

  // Prefer high-quality English voices exposed by the browser/operating system.
  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const selectFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const rankVoice = (voice: SpeechSynthesisVoice) => {
        if (!voice.lang.toLowerCase().startsWith('en')) return -1;

        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        let score = lang === 'en-us' ? 20 : 0;

        // These are typically cloud-backed neural voices and sound less synthetic.
        if (/natural|neural|online/.test(name)) score += 100;
        if (/jenny|aria|ava|samantha|zira|victoria|karen|moira|tessa|fiona/.test(name)) score += 30;
        if (/google us english/.test(name)) score += 25;
        if (/desktop|compact/.test(name)) score -= 20;

        return score;
      };

      this.englishVoice = voices
        .map(voice => ({ voice, score: rankVoice(voice) }))
        .filter(candidate => candidate.score >= 0)
        .sort((a, b) => b.score - a.score)[0]?.voice ?? null;
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

  // Use the best natural voice available in the browser, then fall back to Google TTS.
  public speakEnglish(text: string, rate: number = 0.95): Promise<void> {
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

      this.speakWithSpeechSynthesis(cleanText, rate, (spoken, cancelled) => {
        if (spoken) {
          resolve();
          return;
        }

        if (cancelled) {
          resolve();
          return;
        }

        this.speakWithGoogleTts(cleanText, resolve);
      });
    });
  }

  private speakWithGoogleTts(text: string, resolve: () => void) {
    if (text.length > 200) {
      resolve();
      return;
    }

    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${encodeURIComponent(text)}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      const finish = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve();
      };

      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    } catch {
      resolve();
    }
  }

  private speakWithSpeechSynthesis(
    text: string,
    rate: number,
    resolve: (spoken: boolean, cancelled?: boolean) => void,
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onend = () => resolve(true);
    utterance.onerror = (event) => {
      const cancelled = event.error === 'canceled' || event.error === 'interrupted';
      resolve(false, cancelled);
    };

    if (!this.englishVoice) {
      this.initVoices();
    }

    if (this.englishVoice) {
      utterance.voice = this.englishVoice;
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
