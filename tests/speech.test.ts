// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
let handler: (m: unknown, s: unknown, r: (v: any) => void) => void;
let utterances: any[] = [];
let cancellations = 0;
let paused = false;
let voices: any[] = [];
const ask = (type: string, settings = {}) => {
  let response: any;
  handler({ type, settings }, {}, (r) => (response = r));
  return response;
};
beforeEach(async () => {
  vi.resetModules();
  delete (globalThis as any).__ableverse;
  utterances = [];
  cancellations = 0;
  paused = false;
  voices = [
    {
      voiceURI: "test:local",
      name: "Local English",
      lang: "en-IN",
      localService: true,
      default: true,
    },
  ];
  document.body.innerHTML = "<main><p>Speak this text.</p></main>";
  const range = document.createRange();
  range.selectNodeContents(document.querySelector("p")!);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  vi.stubGlobal("chrome", {
    runtime: {
      onMessage: { addListener: (f: typeof handler) => (handler = f) },
    },
  });
  const synth = {
    getVoices: () => voices,
    speak: (u: any) => utterances.push(u),
    cancel: () => {
      cancellations++;
    },
    pause: () => {
      paused = true;
    },
    resume: () => {
      paused = false;
    },
    get paused() {
      return paused;
    },
  };
  vi.stubGlobal("speechSynthesis", synth);
  Object.defineProperty(window, "speechSynthesis", {
    value: synth,
    configurable: true,
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
    },
  );
  await import("../src/content");
});
afterEach(() => {
  ask("RESTORE");
  vi.unstubAllGlobals();
});
it("does not let the end of an old cancelled utterance disable Stop on the next one", () => {
  ask("READ");
  ask("READ");
  utterances[0].onend();
  ask("STOP");
  expect(cancellations).toBe(2);
});
it("exposes available voices and respects a chosen voice and volume", () => {
  expect(ask("LIST_VOICES").voices).toEqual([
    {
      voiceURI: "test:local",
      name: "Local English",
      lang: "en-IN",
      localService: true,
    },
  ]);
  expect(ask("READ", { voiceURI: "test:local", volume: 0.4 }).ok).toBe(true);
  expect(utterances[0].voice).toBe(voices[0]);
  expect(utterances[0].volume).toBe(0.4);
});
it("refuses unavailable saved voices with a useful error", () => {
  const result = ask("READ", { voiceURI: "missing" });
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/voice.*unavailable/i);
  expect(utterances).toHaveLength(0);
});
it("pauses and resumes only active extension speech", () => {
  ask("READ");
  ask("PAUSE");
  expect(paused).toBe(true);
  ask("PAUSE");
  expect(paused).toBe(false);
  ask("STOP");
  ask("PAUSE");
  expect(paused).toBe(false);
});
it("reports asynchronous voice errors rather than leaving a reading claim active", () => {
  ask("READ");
  utterances[0].onerror({ error: "network" });
  expect(ask("GET_STATE").speech).toEqual({
    state: "error",
    error:
      "Speech failed: network. Try another voice or check device speech settings.",
  });
});
