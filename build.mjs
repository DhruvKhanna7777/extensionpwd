import { build } from "esbuild";
import {
  mkdir,
  copyFile,
  writeFile,
  readFile,
  readdir,
} from "node:fs/promises";
import sharp from "sharp";
import { createHash } from "node:crypto";

const fontSources = JSON.parse(
  await readFile("assets/fonts/provenance.json", "utf8"),
);
for (const { file, sha256 } of fontSources) {
  const bytes = await readFile(`assets/fonts/${file}`);
  if (createHash("sha256").update(bytes).digest("hex") !== sha256)
    throw new Error(
      `Bundled font source does not match pinned provenance: ${file}`,
    );
}
await mkdir("dist", { recursive: true });
await mkdir("dist/icons", { recursive: true });
await mkdir("dist/fonts", { recursive: true });
await mkdir("dist/notices", { recursive: true });
await copyFile(
  "assets/notices/svg-path-parser-LICENSE.txt",
  "dist/notices/svg-path-parser-LICENSE.txt",
);
for (const filename of await readdir("assets/fonts"))
  await copyFile(`assets/fonts/${filename}`, `dist/fonts/${filename}`);
await Promise.all(
  [16, 32, 48, 128].map((size) =>
    sharp("assets/icon.svg")
      .resize(size, size)
      .png()
      .toFile(`dist/icons/icon-${size}.png`),
  ),
);
await build({
  entryPoints: ["src/ui.tsx"],
  bundle: true,
  format: "esm",
  outdir: "dist",
  target: "chrome114",
  minify: true,
  jsx: "automatic",
  external: ["/assets/fonts/*"],
});
await writeFile(
  "dist/ui.css",
  (await readFile("dist/ui.css", "utf8")).replaceAll(
    "/assets/fonts/",
    "fonts/",
  ),
);
await build({
  entryPoints: ["src/content.ts"],
  bundle: true,
  format: "iife",
  outfile: "dist/content.js",
  target: "chrome114",
  minify: true,
});
await build({
  entryPoints: ["src/background.ts"],
  bundle: true,
  format: "esm",
  outfile: "dist/background.js",
  target: "chrome114",
  minify: true,
});
await copyFile("manifest.json", "dist/manifest.json");
for (const name of ["popup", "sidepanel"])
  await writeFile(
    `dist/${name}.html`,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AbleVerse AI</title><link rel="stylesheet" href="ui.css"></head><body><div id="root"></div><script type="module" src="ui.js"></script></body></html>`,
  );
console.log("Load unpacked: dist/");
