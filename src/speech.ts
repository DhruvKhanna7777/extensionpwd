import { validateSettings } from "./settings";
export type SpeechState = {
  state: "idle" | "speaking" | "paused" | "error";
  error?: string;
};
export class SpeechPlayer {
  private utterance?: SpeechSynthesisUtterance;
  private generation = 0;
  private status: SpeechState = { state: "idle" };
  constructor(
    private doc: Document,
    private changed: () => void = () => {},
  ) {}
  private visibility = () => {
    if (this.doc.hidden) this.stop();
  };
  private escape = (event: KeyboardEvent) => {
    if (event.key === "Escape") this.stop();
  };
  private detach() {
    this.doc.removeEventListener("visibilitychange", this.visibility);
    this.doc.removeEventListener("keydown", this.escape);
  }
  getState() {
    return { ...this.status };
  }
  listVoices() {
    return "speechSynthesis" in window ? speechSynthesis.getVoices() : [];
  }
  stop() {
    const owned = !!this.utterance;
    const wasActive = this.status.state !== "idle";
    this.generation++;
    this.utterance = undefined;
    this.detach();
    this.status = { state: "idle" };
    if (owned) speechSynthesis.cancel();
    if (wasActive) this.changed();
  }
  play(text: string, raw: unknown) {
    this.stop();
    const settings = validateSettings(raw);
    const voices = this.listVoices();
    if (!voices.length)
      throw new Error(
        "No browser speech voice is ready. Check your device speech settings, then retry.",
      );
    const voice = settings.voiceURI
      ? voices.find((v) => v.voiceURI === settings.voiceURI)
      : undefined;
    if (settings.voiceURI && !voice)
      throw new Error(
        "Saved voice is unavailable. Choose Browser default or refresh the voice list.",
      );
    const token = ++this.generation;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate;
    utterance.volume = settings.volume;
    if (voice) utterance.voice = voice;
    const finish = (error?: string) => {
      if (token !== this.generation) return;
      this.utterance = undefined;
      this.detach();
      this.status = error
        ? {
            state: "error",
            error: `Speech failed: ${error}. Try another voice or check device speech settings.`,
          }
        : { state: "idle" };
      this.changed();
    };
    utterance.onend = () => finish();
    utterance.onerror = (event) => finish(event.error);
    this.utterance = utterance;
    this.status = { state: "speaking" };
    this.doc.addEventListener("visibilitychange", this.visibility);
    this.doc.addEventListener("keydown", this.escape);
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      finish("unavailable");
      throw error;
    }
    this.changed();
  }
  pause() {
    if (!this.utterance) return;
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      this.status = { state: "speaking" };
    } else {
      speechSynthesis.pause();
      this.status = { state: "paused" };
    }
    this.changed();
  }
}
