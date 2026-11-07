// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from "vitest";
import { defaults, validateSettings } from "../src/settings";
import { PageEngine } from "../src/engine";

beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML =
    '<main><article><h1>Title</h1><p id="safe">Readable prose.</p><form><p id="form">Instructions</p></form><p role="button" id="control">Action</p></article></main>';
});

it("bounds optional reading controls and rejects injected CSS", () => {
  const s = validateSettings({
    readingWidth: 1000,
    paragraphSpacing: -10,
    textAlign: "url(evil)",
    ruler: "yes",
    hoverDelay: 10,
    hoverScope: "evil",
  });
  expect(s.readingWidth).toBe(90);
  expect(s.paragraphSpacing).toBe(0.5);
  expect(s.textAlign).toBe("original");
  expect(s.ruler).toBe(false);
  expect(s.hoverDelay).toBe(300);
  expect(s.hoverScope).toBe("paragraph");
  expect(
    validateSettings({ readingWidth: 0, paragraphSpacing: 0 }).readingWidth,
  ).toBe(0);
});

it("limits only eligible prose without resizing the site grid and restores exactly", () => {
  const before = document.body.innerHTML;
  const engine = new PageEngine(document);
  engine.apply({
    ...defaults,
    reading: true,
    readingWidth: 60,
    paragraphSpacing: 1.5,
    textAlign: "start",
  });
  const p = document.querySelector("#safe")!;
  expect(getComputedStyle(p).maxInlineSize).toBe("60ch");
  expect(getComputedStyle(p).marginBlockEnd).toBe("1.5em");
  expect(getComputedStyle(p).textAlign).toBe("start");
  expect(
    document.querySelector("article")?.hasAttribute("data-ableverse-prose"),
  ).toBe(false);
  expect(
    document.querySelector("#form")?.hasAttribute("data-ableverse-prose"),
  ).toBe(false);
  expect(
    document.querySelector("#control")?.hasAttribute("data-ableverse-prose"),
  ).toBe(false);
  engine.restore();
  expect(document.body.innerHTML).toBe(before);
});

it("provides a pointer-transparent ruler with keyboard movement, Escape and listener cleanup", () => {
  const disabled = vi.fn();
  const engine = new PageEngine(document, disabled);
  engine.apply({ ...defaults, ruler: true });
  const ruler = document.querySelector<HTMLElement>("[data-ableverse-ruler]")!;
  expect(ruler).not.toBeNull();
  expect(ruler.style.pointerEvents).toBe("none");
  document.dispatchEvent(new MouseEvent("pointermove", { clientY: 150 }));
  expect(ruler.style.top).toBe("126px");
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "ArrowDown", altKey: true }),
  );
  expect(ruler.style.top).toBe("150px");
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  expect(document.querySelector("[data-ableverse-ruler]")).toBeNull();
  expect(disabled).toHaveBeenCalledTimes(1);
  document.dispatchEvent(new MouseEvent("pointermove", { clientY: 400 }));
  expect(ruler.style.top).toBe("150px");
  engine.restore();
});
