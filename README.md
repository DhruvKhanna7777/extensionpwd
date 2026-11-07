# AbleVerse AI

A user-controlled Chrome accessibility extension: clearer reading, sensory comfort and colour-independent understanding of **supported, annotated SVG bar charts**. This is an accessibility layer, not a job portal or medical product.

## Current checkpoint

Version 0.1.0 is the first local core, **not release-certified**. Installed Chrome lifecycle, actual voice playback and screen-reader acceptance still require manual verification. See [handoff](docs/HANDOFF.md) and [test matrix](docs/TEST-MATRIX.md).

New contributors should read [project instructions](AGENTS.md) and the [complete continuation prompt](docs/CONTINUATION-PROMPT.md). Current checks: 44 core/UI tests, 3 package checks, 17 browser-engine checks and 15 preview layout combinations passed. Later [installed Chrome smoke checks](docs/INSTALLED-ACCEPTANCE.md) cover charts, form preservation and speech control states. Other speech combinations and full native release gates remain open.

Stopped at the user's requested checkpoint on 2026-11-07. User confirmed audible selected text and working pause/resume on this device. Full native release gates remain open; see the final stopping checkpoint in the handoff. No further testing or feature work is running.

- React popup and full side panel: Overview, Reading, Sensory, Charts and Settings.
- Bounded font family, size, line/letter/word spacing; typography preview and reset.
- Selected-prose speech, pause/resume, stop and Escape. Form fields and editable content excluded.
- Reduced CSS motion, focus outline, control emphasis and warm/dark/high-contrast prose colours.
- Opt-in hiding of explicitly marked noninteractive distractions; forms, links, alerts and keyboard targets remain visible.
- Explicit SVG bar adapter: exact data labels, distinct textures and companion table. Unsupported charts untouched.
- Explicit local preference saving and one-click restoration of owned changes.
- No automatic site activation, AI uploads, account, analytics, remote code or sign videos.

The supplied product blueprint's final Part II governs scope. AI simplification, hover speech, per-site profiles, line/pie charts and verified ASL lookup are P1 and **not implemented**. No proprietary AbleHire archive was provided or copied.

## Build and load

Prerequisites: Node.js 22.12+ LTS, npm, Chrome 116+ desktop.

```sh
git clone https://github.com/DhruvKhanna7777/extensionpwd.git
cd extensionpwd
git switch main
npm ci
npm test
npm run build
npm run package
```

1. Open `chrome://extensions` in your chosen testing profile.
2. Enable Developer mode, choose **Load unpacked**, and select generated `dist`.
3. Run `npm run demo`, then visit `http://127.0.0.1:5173/demo/article.html`.
4. Click the AbleVerse toolbar icon to grant current-tab access. Use **Open full panel** for advanced controls.
5. Enable only the controls you want. Finish with **Restore original page**.

After rebuilding, reload the extension and demo tab. Browser-internal/store pages and file URLs are intentionally unsupported. Serve demo pages over localhost.

`npm run package` rebuilds and creates `artifacts/ableverse-ai-0.1.0.zip`. It packages an explicit build-file allowlist, checks manifest paths stay inside dist, verifies ZIP contents byte for byte, and prints a SHA-256 checksum. Unrelated leftovers and `.env` files are excluded. Extract the ZIP before using Load unpacked. Keep the allowlist current when adding legitimate new shipped assets.

`npm test` runs the 44 core/UI tests and 3 packaging checks. `/demo/validation.html` provides 17 real-browser page-engine checks; it does not impersonate an installed extension or prove actual voice playback.

`npm run demo` also serves an interface-only preview at `/`. That preview cannot modify tabs or use extension APIs. See [demo script](DEMO.md).

## Architecture

- `src/ui.tsx`, `src/App.tsx`, `src/ui.css`: shared React popup/side-panel UI.
- `src/usePageController.ts`: current-tab permissions, operation queue, state synchronization and errors.
- `src/speech.ts`: voice selection, volume, speech ownership, cancellation and errors.
- `src/settings.ts`: strict allowlist and bounded settings validation.
- `src/content.ts`: injection singleton, messaging, speech and lifecycle cleanup.
- `src/engine.ts`: reversible prose/sensory changes.
- `src/charts.ts`: annotated SVG bar adapter and safe value-table rendering.
- `manifest.json`, `build.mjs`: MV3 permissions and local bundles.
- `assets/icon.svg`: original vector icon; build emits PNG sizes 16/32/48/128.
- `demo/`: article, form/sensory, SVG and unsupported canvas fixtures.
- `tests/`: jsdom integration and engine regression tests.

No server, database, secret key or `.env` is needed. Production output is generated locally and ignored by Git. Dependencies are locked.

## Supported chart contract

```html
<svg data-av-chart="bar" data-av-unit="units" aria-label="Monthly results">
  <rect x="30" y="80" width="40" height="60" fill="red"
        data-av-label="March" data-av-value="30" />
</svg>
```

Each bar needs explicit category/value metadata and positive width/nonnegative height. Bars must be direct children of the SVG without individual transforms; grouped/transformed bars are unsupported. Values are never inferred from geometry or colour. Malformed data aborts transformation before changes. Source-chart mutations remove stale companions and reset applied modes; apply explicitly again to regenerate. Original axes/text remain. Restore removes companions and restores fills unless the site changed them after application.

## Contributing

Use focused branches and pull requests. Run `npm test` and `npm run build` before committing. Update `docs/HANDOFF.md` with completed work, actual checks, limitations and next steps. Commit and push useful checkpoints. Never commit credentials, `.env`, private page text, or unlicensed media.

No project distribution licence has been chosen yet. Resolve licensing before redistributing. See [privacy](PRIVACY.md).
