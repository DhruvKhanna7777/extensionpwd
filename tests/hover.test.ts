// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HoverReader } from "../src/hover";
import { defaults } from "../src/settings";
let reader: HoverReader;
let play: ReturnType<typeof vi.fn<(text: string) => void>>;
let stop: ReturnType<typeof vi.fn<() => void>>;
beforeEach(() => {
  vi.useFakeTimers();
  document.head.innerHTML = "";
  document.body.innerHTML =
    '<main><p id="a">First sentence. Second sentence.</p><p id="b">Another paragraph.</p><p id="private"><input value="secret">Private form label</p><p role="button" id="button">Do not read</p><p id="linked">Text <a href="/">Link</a></p></main>';
  play = vi.fn();
  stop = vi.fn();
  reader = new HoverReader(document, play, stop, vi.fn());
});
afterEach(() => {
  reader.destroy();
  vi.useRealTimers();
});
const over = (id: string) =>
  document
    .querySelector(id)!
    .dispatchEvent(new MouseEvent("pointerover", { bubbles: true }));
it("is off by default and rapid targets never enqueue speech", () => {
  over("#a");
  vi.advanceTimersByTime(2000);
  expect(play).not.toHaveBeenCalled();
  reader.configure({ ...defaults, hoverSpeech: true });
  over("#a");
  vi.advanceTimersByTime(400);
  over("#b");
  vi.advanceTimersByTime(699);
  expect(play).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(play).toHaveBeenCalledExactlyOnceWith("Another paragraph.");
  expect(
    document.querySelector("#a")?.hasAttribute("data-ableverse-hover"),
  ).toBe(false);
});
it("speaks once per entry, cancels on leave and allows intentional re-entry", () => {
  reader.configure({ ...defaults, hoverSpeech: true, hoverScope: "sentence" });
  over("#a");
  vi.advanceTimersByTime(700);
  expect(play).toHaveBeenCalledExactlyOnceWith("First sentence.");
  over("#a");
  vi.advanceTimersByTime(2000);
  expect(play).toHaveBeenCalledTimes(1);
  document
    .querySelector("#a")!
    .dispatchEvent(new MouseEvent("pointerout", { bubbles: true }));
  expect(stop).toHaveBeenCalledTimes(1);
  over("#a");
  vi.advanceTimersByTime(700);
  expect(play).toHaveBeenCalledTimes(2);
});
it("excludes controls and any block containing private or interactive descendants", () => {
  reader.configure({ ...defaults, hoverSpeech: true });
  for (const id of ["#private", "#button", "#linked"]) {
    over(id);
    vi.advanceTimersByTime(1500);
  }
  expect(play).not.toHaveBeenCalled();
});
it("Escape cancels pending work and destroy removes highlights and listeners", () => {
  const original = document.body.innerHTML;
  reader.configure({ ...defaults, hoverSpeech: true });
  over("#a");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  vi.advanceTimersByTime(1500);
  expect(play).not.toHaveBeenCalled();
  over("#a");
  vi.advanceTimersByTime(1500);
  expect(play).not.toHaveBeenCalled();
  reader.destroy();
  expect(document.body.innerHTML).toBe(original);
  over("#b");
  vi.advanceTimersByTime(1500);
  expect(play).not.toHaveBeenCalled();
});
it("checks eligibility again after dwell so a new editable child is never spoken", () => {
  reader.configure({ ...defaults, hoverSpeech: true });
  over("#a");
  document.querySelector("#a")!.setAttribute("contenteditable", "true");
  vi.advanceTimersByTime(700);
  expect(play).not.toHaveBeenCalled();
});
it("never speaks CSS-hidden descendants or a block inside a hidden ancestor", () => {
  reader.configure({ ...defaults, hoverSpeech: true });
  document.querySelector("#a")!.innerHTML =
    'Visible <span style="display:none">PRIVATE HIDDEN TEXT</span>';
  over("#a");
  vi.advanceTimersByTime(700);
  expect(play).not.toHaveBeenCalled();
  document.querySelector("main")!.style.display = "none";
  over("#b");
  vi.advanceTimersByTime(700);
  expect(play).not.toHaveBeenCalled();
});
