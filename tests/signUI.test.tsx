// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SignLookup } from "../src/SignLookup";
import { validateSignEntries } from "../src/signs";
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
it("exposes an honest unavailable state with no video or external request when no clips are approved", () => {
  render(<SignLookup pageEpoch={0} />);
  expect(screen.getByText(/No approved, licensed sign clips/)).toBeTruthy();
  fireEvent.change(
    screen.getByRole("textbox", { name: "Word or short phrase" }),
    { target: { value: "book" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Look up sign" }));
  expect(screen.getByText(/No verified clip for/)).toBeTruthy();
  expect(document.querySelector("video")).toBeNull();
});
it("requires an explicit sense choice, uses a local clip, and removes stale video when input changes", () => {
  const entries = validateSignEntries([
    {
      id: "book",
      headword: "book",
      sense: "reading material",
      language: "ASL",
      clipPath: "signs/book.webm",
      sourceName: "Test source",
      sourceUrl: "https://example.org",
      licence: "CC-BY-4.0",
      attribution: "Test attribution",
      reviewStatus: "approved",
      reviewedBy: "Test reviewer",
      updatedAt: "2026-11-07",
    },
  ]);
  render(<SignLookup pageEpoch={0} entries={entries} />);
  const input = screen.getByRole("textbox", { name: "Word or short phrase" });
  fireEvent.change(input, { target: { value: "book" } });
  fireEvent.click(screen.getByRole("button", { name: "Look up sign" }));
  expect(document.querySelector("video")).toBeNull();
  fireEvent.click(
    screen.getByRole("button", { name: "book — reading material" }),
  );
  expect(document.querySelector("video")?.getAttribute("src")).toBe(
    "/assets/signs/book.webm",
  );
  expect(document.querySelector("video")?.autoplay).toBe(false);
  fireEvent.change(input, { target: { value: "new word" } });
  expect(document.querySelector("video")).toBeNull();
});
