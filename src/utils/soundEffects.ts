// Web Audio API effects and online speech playback.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private speechController: AbortController | null = null;
  private activeSpeechResolve: (() => void) | null = null;
  private preloadedAudio = new Map<string, HTMLAudioElement>();

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

  public prefetchEnglish(text: string) {
    const cleanText = text.trim();
    if (!this.soundEnabled || !cleanText || cleanText.length > 800 || this.preloadedAudio.has(cleanText)) return;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = `/api/tts?text=${encodeURIComponent(cleanText)}`;
    audio.addEventListener('error', () => {
      if (this.preloadedAudio.get(cleanText) === audio) this.preloadedAudio.delete(cleanText);
    }, { once: true });
    audio.load();
    this.preloadedAudio.set(cleanText, audio);

    if (this.preloadedAudio.size > 4) {
      const oldestEntry = this.preloadedAudio.entries().next().value as [string, HTMLAudioElement] | undefined;
      if (oldestEntry) {
        oldestEntry[1].pause();
        oldestEntry[1].removeAttribute('src');
        oldestEntry[1].load();
        this.preloadedAudio.delete(oldestEntry[0]);
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

  // Neural US English voice, with Google TTS as a fallback if the API is unavailable.
  public speakEnglish(text: string): Promise<void> {
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

      this.stopSpeaking();
      const controller = new AbortController();
      this.speechController = controller;
      this.activeSpeechResolve = resolve;
      void this.speakWithNeuralTts(cleanText, controller, resolve);
    });
  }

  private speakWithNeuralTts(text: string, controller: AbortController, resolve: () => void) {
    if (controller.signal.aborted) {
      this.finishSpeech(controller, resolve);
      return;
    }

    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}`;
    const preparedAudio = this.preloadedAudio.get(text);
    this.preloadedAudio.delete(text);
    this.playAudio(audioUrl, controller, resolve, true, text, preparedAudio);
  }

  private speakWithGoogleTts(text: string, controller: AbortController, resolve: () => void) {
    if (text.length > 200 || controller.signal.aborted) {
      this.finishSpeech(controller, resolve);
      return;
    }

    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${encodeURIComponent(text)}`;
    this.playAudio(audioUrl, controller, resolve, false, text);
  }

  private playAudio(
    audioUrl: string,
    controller: AbortController,
    resolve: () => void,
    fallbackToGoogle: boolean,
    text: string,
    preparedAudio?: HTMLAudioElement,
  ) {
    const audio = preparedAudio ?? new Audio(audioUrl);
    audio.volume = 0.85;
    if (preparedAudio) audio.currentTime = 0;
    this.currentAudio = audio;

    const finish = (played: boolean) => {
      if (this.currentAudio !== audio) return;

      this.currentAudio = null;

      if (!played && fallbackToGoogle && !controller.signal.aborted) {
        this.speakWithGoogleTts(text, controller, resolve);
        return;
      }

      this.finishSpeech(controller, resolve);
    };

    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    audio.play().catch(() => finish(false));
  }

  public stopSpeaking() {
    const controller = this.speechController;
    this.speechController = null;
    controller?.abort();

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    const resolve = this.activeSpeechResolve;
    this.activeSpeechResolve = null;
    resolve?.();
  }

  private finishSpeech(controller: AbortController, resolve: () => void) {
    if (this.speechController === controller) this.speechController = null;
    if (this.activeSpeechResolve === resolve) this.activeSpeechResolve = null;
    resolve();
  }
}

export const sounds = new SoundEngine();
