import { expect, it } from "vitest";
import { validateSignEntries, lookupSigns, approvedSigns } from "../src/signs";
const entry = {
  id: "example",
  headword: "book",
  sense: "printed reading material",
  language: "ASL",
  clipPath: "signs/book.webm",
  sourceName: "Test-only source",
  sourceUrl: "https://example.org/book",
  licence: "CC-BY-4.0",
  attribution: "Test attribution",
  reviewStatus: "approved",
  reviewedBy: "Test reviewer",
  updatedAt: "2026-11-07",
};
it("only accepts approved, attributed, licensed local sign clips and never invents misses", () => {
  const entries = validateSignEntries([
    entry,
    { ...entry, id: "bad", reviewStatus: "pending" },
    { ...entry, id: "remote", clipPath: "https://example.org/video.mp4" },
    { ...entry, id: "escape", clipPath: "signs/../private.mp4" },
    { ...entry, id: "unlicensed", licence: "" },
  ]);
  expect(entries).toHaveLength(1);
  expect(lookupSigns(" BOOK ", entries)).toEqual([entry]);
  expect(lookupSigns("unknown", entries)).toEqual([]);
  expect(approvedSigns).toHaveLength(0);
});
it("returns multiple approved senses without pretending to resolve meaning", () => {
  const entries = validateSignEntries([
    entry,
    { ...entry, id: "verb", sense: "reserve or arrange" },
  ]);
  expect(lookupSigns("book", entries).map((e) => e.sense)).toEqual([
    "printed reading material",
    "reserve or arrange",
  ]);
});
