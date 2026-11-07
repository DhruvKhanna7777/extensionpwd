// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { defaults } from "../src/settings";
let handler: (m: unknown, s: unknown, r: (value: any) => void) => void;
let spoken: string[] = [];
let cancelled = 0;
beforeEach(async () => {
  vi.resetModules();
  delete (globalThis as any).__ableverse;
  document.body.innerHTML =
    '<main><p id="text">Original readable sentence.</p><input value="private"/><p contenteditable="true">Private draft</p></main>';
  spoken = [];
  cancelled = 0;
  vi.stubGlobal("chrome", {
    runtime: {
      onMessage: {
        addListener: (fn: typeof handler) => {
          handler = fn;
        },
      },
    },
  });
  const synth = {
    getVoices: () => [{ name: "test device voice" }],
    speak: (u: { text: string }) => spoken.push(u.text),
    cancel: () => {
      cancelled++;
    },
    paused: false,
    pause: () => {},
    resume: () => {},
  };
  vi.stubGlobal("speechSynthesis", synth);
  Object.defineProperty(window, "speechSynthesis", {
    value: synth,
    configurable: true,
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      rate = 1;
      constructor(public text: string) {}
    },
  );
  await import("../src/content");
});
afterEach(() => {
  request("RESTORE");
});
function request(type: string, settings = defaults): any {
  let response: any;
  handler({ type, settings }, {}, (r) => (response = r));
  return response;
}
it("reports effective page settings and resets them on Restore", () => {
  request("APPLY", { ...defaults, reading: true, fontScale: 130 });
  expect(request("GET_STATE")?.settings.reading).toBe(true);
  request("RESTORE");
  expect(request("GET_STATE")?.settings).toEqual(defaults);
  expect(document.querySelector("[data-ableverse-prose]")).toBeNull();
});
it("speaks only explicitly selected prose and preserves source content", () => {
  const p = document.querySelector("#text")!;
  const range = document.createRange();
  range.selectNodeContents(p);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  expect(request("READ")).toEqual({ ok: true });
  expect(spoken).toEqual(["Original readable sentence."]);
  expect(p.textContent).toBe("Original readable sentence.");
});
it("refuses a selection spanning editable content", () => {
  const range = document.createRange();
  range.selectNodeContents(document.querySelector("main")!);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  expect(request("READ").ok).toBe(false);
  expect(spoken).toEqual([]);
});
it("refuses empty selection without unsolicited speech", () => {
  getSelection()!.removeAllRanges();
  expect(request("READ").ok).toBe(false);
  expect(spoken).toEqual([]);
});
it("cancels speech on SPA navigation even without applying a mode first", async () => {
  const range = document.createRange();
  range.selectNodeContents(document.querySelector("#text")!);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  request("READ");
  history.pushState({}, "", "/next-article");
  document.querySelector("#text")!.textContent = "A new article";
  await Promise.resolve();
  await Promise.resolve();
  expect(cancelled).toBe(1);
});
it("invalidates verified companions when source chart data change", async () => {
  document.body.innerHTML =
    '<svg data-av-chart="bar" data-av-unit="units"><rect x="0" y="20" width="30" height="40" data-av-label="A" data-av-value="20"/></svg>';
  request("APPLY", { ...defaults, chroma: true });
  expect(document.querySelector("table")).not.toBeNull();
  document
    .querySelector("rect[data-av-value]")!
    .setAttribute("data-av-value", "77");
  await Promise.resolve();
  await Promise.resolve();
  expect(document.querySelector("table")).toBeNull();
  expect(document.querySelector("rect")!.getAttribute("data-av-value")).toBe(
    "77",
  );
});
it("stops speech on history-only navigation without waiting for a DOM mutation", async () => {
  vi.useFakeTimers();
  try {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("#text")!);
    getSelection()!.removeAllRanges();
    getSelection()!.addRange(range);
    request("READ");
    history.pushState({}, "", "/history-only");
    await vi.advanceTimersByTimeAsync(600);
    expect(cancelled).toBe(1);
  } finally {
    request("RESTORE");
    vi.useRealTimers();
  }
});
it("keeps Reading enabled when unrelated chart data change with Chroma off", async () => {
  document.body.innerHTML +=
    '<svg data-av-chart="bar"><rect data-av-value="10"/></svg>';
  request("APPLY", { ...defaults, reading: true });
  document.querySelector("rect")!.setAttribute("data-av-value", "20");
  await Promise.resolve();
  expect(request("GET_STATE").settings.reading).toBe(true);
});
