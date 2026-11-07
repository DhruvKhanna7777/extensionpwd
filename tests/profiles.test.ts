import { expect, it, vi } from "vitest";
import {
  loadSiteProfile,
  saveSiteProfile,
  resetSiteProfile,
  siteProfileKey,
} from "../src/profiles";
import { defaults } from "../src/settings";
it("scopes explicit profiles to origin without storing paths, queries or credentials", async () => {
  const values: Record<string, unknown> = {};
  const storage = {
    get: vi.fn(async (key: string) => ({ [key]: values[key] })),
    set: vi.fn(async (patch: object) => {
      Object.assign(values, patch);
    }),
    remove: vi.fn(async (key: string) => {
      delete values[key];
    }),
  };
  await saveSiteProfile(storage, "https://example.com/private?secret=test", {
    ...defaults,
    fontScale: 140,
  });
  expect(Object.keys(values)).toEqual(["ableverse:site:https://example.com"]);
  expect(await loadSiteProfile(storage, "https://example.com/other")).toEqual({
    ...defaults,
    fontScale: 140,
  });
  expect(
    await loadSiteProfile(storage, "https://other.example.com/"),
  ).toBeNull();
  expect(await loadSiteProfile(storage, "http://example.com/")).toBeNull();
  await resetSiteProfile(storage, "https://example.com/");
  expect(await loadSiteProfile(storage, "https://example.com/")).toBeNull();
  expect(() => siteProfileKey("https://user:password@example.com/")).toThrow();
});
it("rejects unsupported sites and strips untrusted fields from persisted profiles", async () => {
  for (const url of [
    "chrome://settings",
    "file:///private",
    "https://chromewebstore.google.com/detail/test",
  ])
    expect(() => siteProfileKey(url)).toThrow();
  const storage = {
    get: vi.fn(async () => ({})),
    set: vi.fn(async () => {}),
    remove: vi.fn(async () => {}),
  };
  await saveSiteProfile(storage, "https://example.com", {
    fontScale: 999,
    privateText: "never save",
  });
  expect(storage.set).toHaveBeenCalledWith({
    "ableverse:site:https://example.com": { ...defaults, fontScale: 180 },
  });
});
