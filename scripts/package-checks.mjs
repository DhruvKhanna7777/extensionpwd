import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { packageExtension } from "./package.mjs";

async function fixture(run) {
  const dir = await mkdtemp(join(tmpdir(), "ableverse-package-"));
  const source = join(dir, "dist");
  await mkdir(source);
  const manifest = {
    manifest_version: 3,
    name: "AbleVerse test",
    version: "0.1.0",
    action: { default_popup: "popup.html" },
    background: { service_worker: "background.js" },
    side_panel: { default_path: "sidepanel.html" },
  };
  for (const file of [
    "popup.html",
    "sidepanel.html",
    "ui.js",
    "ui.css",
    "content.js",
    "background.js",
  ])
    await writeFile(join(source, file), "fixture");
  await writeFile(join(source, "manifest.json"), JSON.stringify(manifest));
  try {
    await run({ dir, source, manifest });
  } finally {
    assert.ok(
      dir.startsWith(join(tmpdir(), "ableverse-package-")),
      "cleanup stays within its generated test directory",
    );
    await rm(dir, { recursive: true, force: true });
  }
}
test("packages exact files and omits secret/unrelated build leftovers", async () =>
  fixture(async ({ dir, source }) => {
    await writeFile(join(source, ".env"), "should never be packaged");
    await writeFile(join(source, "unrelated.txt"), "not shipped");
    const result = await packageExtension(source, join(dir, "extension.zip"));
    assert.ok(result, "package must be created");
    const zip = unzipSync(await readFile(join(dir, "extension.zip")));
    assert.deepEqual(Object.keys(zip).sort(), [
      "background.js",
      "content.js",
      "manifest.json",
      "popup.html",
      "sidepanel.html",
      "ui.css",
      "ui.js",
    ]);
    assert.equal(strFromU8(zip["content.js"]), "fixture");
  }));
test("rejects a missing manifest entrypoint", async () =>
  fixture(async ({ dir, source, manifest }) => {
    manifest.action.default_popup = "missing.html";
    await writeFile(join(source, "manifest.json"), JSON.stringify(manifest));
    await assert.rejects(
      packageExtension(source, join(dir, "extension.zip")),
      /missing|ENOENT/i,
    );
  }));
test("rejects manifest paths escaping the source directory", async () =>
  fixture(async ({ dir, source, manifest }) => {
    await writeFile(join(dir, "private.html"), "not public");
    manifest.action.default_popup = "../private.html";
    await writeFile(join(source, "manifest.json"), JSON.stringify(manifest));
    await assert.rejects(
      packageExtension(source, join(dir, "extension.zip")),
      /path|inside|relative/i,
    );
  }));
