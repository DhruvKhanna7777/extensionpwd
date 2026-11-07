export const bundledFonts = {
  Lexend: "Lexend.ttf",
  "Atkinson Hyperlegible": "AtkinsonHyperlegible-Regular.ttf",
  OpenDyslexic: "OpenDyslexic-Regular.woff2",
};
export function pageFontFace(family: string) {
  const filename = bundledFonts[family as keyof typeof bundledFonts];
  if (!filename) return "";
  const base =
    globalThis.chrome?.runtime?.getURL?.("fonts/") || "/assets/fonts/";
  return `@font-face{font-family:"${family}";src:url("${base}${filename}");font-style:normal;font-weight:${family === "Lexend" ? "100 900" : "400"};font-display:swap;}`;
}
