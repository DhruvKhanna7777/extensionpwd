import { readFile, writeFile, mkdir, realpath } from "node:fs/promises";
import { resolve, relative, dirname, isAbsolute } from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { zipSync, unzipSync } from "fflate";

export async function packageExtension(source, output) {
  const root = await realpath(resolve(source));
  const manifest = JSON.parse(
    await readFile(resolve(root, "manifest.json"), "utf8"),
  );
  if (manifest.manifest_version !== 3)
    throw new Error("Package requires a Manifest V3 build.");
  const paths = new Set([
    "manifest.json",
    "ui.js",
    "ui.css",
    "content.js",
    manifest.action?.default_popup,
    manifest.background?.service_worker,
    manifest.side_panel?.default_path,
    ...Object.values(manifest.icons || {}),
    ...Object.values(manifest.action?.default_icon || {}),
    ...(manifest.web_accessible_resources || []).flatMap(
      (entry) => entry.resources || [],
    ),
  ]);
  const entries = {};
  for (const path of [...paths].sort()) {
    if (
      typeof path !== "string" ||
      !path ||
      isAbsolute(path) ||
      path.includes("\\") ||
      path
        .split("/")
        .some((segment) => segment === ".." || segment === "." || !segment)
    )
      throw new Error(
        "Manifest path must remain relative and inside the build directory.",
      );
    const target = await realpath(resolve(root, path));
    const contained = relative(root, target);
    if (contained.startsWith("..") || isAbsolute(contained))
      throw new Error("Manifest path must stay inside the build directory.");
    entries[path] = new Uint8Array(await readFile(target));
  }
  const data = zipSync(
    Object.fromEntries(
      Object.entries(entries).map(([path, bytes]) => [
        path,
        [bytes, { level: 9, mtime: new Date(2020, 0, 1) }],
      ]),
    ),
  );
  const verified = unzipSync(data);
  for (const [path, bytes] of Object.entries(entries))
    if (Buffer.compare(Buffer.from(bytes), Buffer.from(verified[path])) !== 0)
      throw new Error(`ZIP verification failed for ${path}`);
  await mkdir(dirname(resolve(output)), { recursive: true });
  await writeFile(output, data);
  return {
    path: resolve(output),
    files: Object.keys(entries),
    sha256: createHash("sha256").update(data).digest("hex"),
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const manifest = JSON.parse(await readFile("dist/manifest.json", "utf8"));
  if (!/^\d+(\.\d+){1,3}$/.test(manifest.version))
    throw new Error("Invalid extension version for packaging.");
  const result = await packageExtension(
    "dist",
    `artifacts/ableverse-ai-${manifest.version}.zip`,
  );
  console.log(
    `Verified ${result.files.length} files: ${result.path}\nSHA-256: ${result.sha256}`,
  );
}
