// @vitest-environment jsdom
import { beforeEach, expect, it } from "vitest";
import { SelectionSession } from "../src/selectionSession";
let session: SelectionSession;
beforeEach(() => {
  document.body.innerHTML =
    '<main><p id="p">A <em>complicated</em> sentence.</p><p id="other">Another paragraph.</p><input value="private"></main>';
  session = new SelectionSession(document);
  const range = document.createRange();
  range.selectNodeContents(document.querySelector("#p")!);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
});
it("captures only an explicit selection and restores the exact original inline markup", () => {
  const before = document.body.innerHTML;
  const capture = session.capture();
  expect(capture.text).toBe("A complicated sentence.");
  expect(capture.canApply).toBe(true);
  session.apply(capture.token, "A simple sentence.");
  expect(document.querySelector("#p")?.textContent).toBe("A simple sentence.");
  session.restore();
  expect(document.body.innerHTML).toBe(before);
});
it("rejects stale source text and navigation instead of replacing a different page", () => {
  let capture = session.capture();
  document.querySelector("#p")!.textContent = "New site text";
  expect(() => session.apply(capture.token, "Suggestion")).toThrow(/changed/);
  const range = document.createRange();
  range.selectNodeContents(document.querySelector("#other")!);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  capture = session.capture();
  history.pushState({}, "", "/different-selection-page");
  expect(() => session.apply(capture.token, "Suggestion")).toThrow(/changed/);
});
it("preserves newer website edits to an applied suggestion during Restore", () => {
  const capture = session.capture();
  session.apply(capture.token, "Simpler text");
  document.querySelector("[data-ableverse-ai]")!.textContent = "New site text";
  session.restore();
  expect(document.querySelector("#p")?.textContent).toBe("New site text");
  expect(document.querySelector("[data-ableverse-owned]")).toBeNull();
});
it("rejects controls and CSS-hidden source text and never captures the whole page implicitly", () => {
  getSelection()!.removeAllRanges();
  expect(() => session.capture()).toThrow(/Select/);
  document.querySelector("#p")!.innerHTML =
    'Public <span style="display:none">PRIVATE</span>';
  let range = document.createRange();
  range.selectNodeContents(document.querySelector("#p")!);
  getSelection()!.addRange(range);
  expect(() => session.capture()).toThrow(/protected|hidden/);
  document.querySelector("#p")!.innerHTML =
    '<span role="textbox">Private draft</span>';
  range = document.createRange();
  range.selectNodeContents(document.querySelector("#p")!);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  expect(() => session.capture()).toThrow(/protected|hidden/);
});
it("rechecks visibility at Apply time after the site changes presentation", () => {
  const capture = session.capture();
  document.querySelector<HTMLElement>("#p")!.style.display = "none";
  expect(() => session.apply(capture.token, "Suggestion")).toThrow(
    /changed|hidden/,
  );
});
it("keeps partially crossed inline elements available for copy only without splitting their structure", () => {
  const em = document.querySelector("em")!;
  const before = document.body.innerHTML;
  const range = document.createRange();
  range.setStart(em.firstChild!, 3);
  range.setEnd(em.nextSibling!, 4);
  getSelection()!.removeAllRanges();
  getSelection()!.addRange(range);
  const capture = session.capture();
  expect(capture.canApply).toBe(false);
  expect(() => session.apply(capture.token, "Suggestion")).toThrow(
    /safe|supports/,
  );
  session.restore();
  expect(document.body.innerHTML).toBe(before);
  expect(document.querySelector("em")).toBe(em);
});
