export type SignEntry = {
  id: string;
  headword: string;
  sense: string;
  language: "ASL";
  clipPath: string;
  sourceName: string;
  sourceUrl: string;
  licence: string;
  attribution: string;
  reviewStatus: "approved";
  reviewedBy: string;
  updatedAt: string;
};
// Only source-reviewed entries with redistribution rights belong here. No preview clips.
const catalog: unknown = [];
export function validateSignEntries(raw: unknown): SignEntry[] {
  if (!Array.isArray(raw) || raw.length > 5000) return [];
  const ids = new Set<string>();
  return raw.filter((value): value is SignEntry => {
    if (!value || typeof value !== "object") return false;
    const e = value as Record<string, unknown>;
    for (const key of [
      "id",
      "headword",
      "sense",
      "clipPath",
      "sourceName",
      "sourceUrl",
      "licence",
      "attribution",
      "reviewedBy",
      "updatedAt",
    ])
      if (
        typeof e[key] !== "string" ||
        !(e[key] as string).trim() ||
        (e[key] as string).length > 1000
      )
        return false;
    if (
      e.language !== "ASL" ||
      e.reviewStatus !== "approved" ||
      !/^signs\/[a-zA-Z0-9_-]+\.(mp4|webm)$/.test(String(e.clipPath)) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(String(e.updatedAt))
    )
      return false;
    if (!["CC0-1.0", "CC-BY-4.0", "CC-BY-SA-4.0"].includes(String(e.licence)))
      return false;
    try {
      const source = new URL(String(e.sourceUrl));
      if (source.protocol !== "https:" || source.username || source.password)
        return false;
    } catch {
      return false;
    }
    if (ids.has(String(e.id))) return false;
    ids.add(String(e.id));
    return true;
  });
}
export const approvedSigns = validateSignEntries(catalog);
export function lookupSigns(
  word: string,
  entries: readonly SignEntry[] = approvedSigns,
) {
  const normalize = (text: string) =>
    text
      .normalize("NFKC")
      .toLocaleLowerCase("en-US")
      .trim()
      .replace(/\s+/gu, " ");
  const query = normalize(word);
  if (!query || query.length > 64 || query.split(" ").length > 4) return [];
  return entries.filter((entry) => normalize(entry.headword) === query);
}
