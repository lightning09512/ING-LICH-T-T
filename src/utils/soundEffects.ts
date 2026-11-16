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
