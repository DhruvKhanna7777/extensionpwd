export const defaults = {
  reading: false,
  fontFamily: "system-ui",
  fontScale: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  wordSpacing: 0,
  paragraphSpacing: 0,
  readingWidth: 0,
  textAlign: "original",
  ruler: false,
  hoverSpeech: false,
  hoverDelay: 700,
  hoverScope: "paragraph",
  motion: false,
  distractions: false,
  focus: false,
  emphasis: false,
  calm: "default",
  chroma: false,
  chartLabels: true,
  chartPatterns: true,
  chartMarkers: true,
  rate: 1,
  volume: 1,
  voiceURI: "",
};
export type Settings = typeof defaults;
export function validateSettings(raw: unknown): Settings {
  const s = { ...defaults };
  if (!raw || typeof raw !== "object") return s;
  const r = raw as Record<string, unknown>;
  if (typeof r.voiceURI === "string" && r.voiceURI.length <= 256)
    s.voiceURI = r.voiceURI;
  for (const k of [
    "reading",
    "motion",
    "focus",
    "emphasis",
    "chroma",
    "distractions",
    "ruler",
    "hoverSpeech",
    "chartLabels",
    "chartPatterns",
    "chartMarkers",
  ] as const)
    if (typeof r[k] === "boolean") s[k] = r[k];
  const ranges = {
    fontScale: [90, 180],
    lineHeight: [1.35, 2.2],
    letterSpacing: [0, 0.12],
    wordSpacing: [0, 0.25],
    rate: [0.7, 1.5],
    volume: [0, 1],
    hoverDelay: [300, 1500],
  };
  for (const k of Object.keys(ranges) as (keyof typeof ranges)[]) {
    const v = r[k];
    if (typeof v === "number" && Number.isFinite(v))
      s[k] = Math.min(ranges[k][1], Math.max(ranges[k][0], v));
  }
  for (const [key, min, max] of [
    ["readingWidth", 50, 90],
    ["paragraphSpacing", 0.5, 2],
  ] as const) {
    const v = r[key];
    if (typeof v === "number" && Number.isFinite(v))
      s[key] = v === 0 ? 0 : Math.min(max, Math.max(min, v));
  }
  if (["original", "start", "left"].includes(String(r.textAlign)))
    s.textAlign = String(r.textAlign);
  if (["word", "sentence", "paragraph"].includes(String(r.hoverScope)))
    s.hoverScope = String(r.hoverScope);
  if (
    [
      "system-ui",
      "Arial",
      "Georgia",
      "Verdana",
      "Lexend",
      "Atkinson Hyperlegible",
      "OpenDyslexic",
    ].includes(String(r.fontFamily))
  )
    s.fontFamily = String(r.fontFamily);
  if (["default", "warm", "dark", "contrast"].includes(String(r.calm)))
    s.calm = String(r.calm);
  return s;
}
