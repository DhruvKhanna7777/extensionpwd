import { validateSettings } from "./settings";
type LocalStorage = {
  get(key: string): Promise<Record<string, unknown>>;
  set(values: Record<string, unknown>): Promise<void>;
  remove(key: string): Promise<void>;
};
export function siteProfileKey(raw: string) {
  const url = new URL(raw);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.hostname === "chromewebstore.google.com" ||
    (url.hostname === "chrome.google.com" &&
      url.pathname.startsWith("/webstore"))
  )
    throw new Error("Site profiles require a regular http(s) website.");
  return `ableverse:site:${url.origin}`;
}
export async function saveSiteProfile(
  storage: LocalStorage,
  url: string,
  raw: unknown,
) {
  await storage.set({ [siteProfileKey(url)]: validateSettings(raw) });
}
export async function loadSiteProfile(storage: LocalStorage, url: string) {
  const key = siteProfileKey(url);
  const data = await storage.get(key);
  const value = data[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? validateSettings(value)
    : null;
}
export async function resetSiteProfile(storage: LocalStorage, url: string) {
  await storage.remove(siteProfileKey(url));
}
