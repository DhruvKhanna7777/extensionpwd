# AbleVerse AI

A user-controlled Chrome accessibility extension: clearer reading, sensory comfort and colour-independent understanding of **supported, annotated SVG bar, line and pie charts**. This is an accessibility layer, not a job portal or medical product.

Taking over the project? Start with the [handoff pack](docs/START-HERE.md), [step-by-step workflow](docs/WORKFLOW.md), and [copyable task prompts](docs/PROMPTS.md). The [master continuation prompt](docs/CONTINUATION-PROMPT.md) gives a coding assistant the full context.

## Current checkpoint

Version 0.1.0 is a development build, **not release-certified**. Start with [the current contributor handoff](docs/CONTRIBUTOR-HANDOFF.md), [feature/evidence status](docs/FEATURE-STATUS.md) and [copy-paste continuation prompt](docs/CONTINUATION-PROMPT.md). Main after PR #8 is `6d30201`; the implementation branch contains newer runtime work. Check the implementation PR before starting from main.

Current verification: **103 Vitest tests, 4 packaging checks, production typecheck/build and a 19-file verified ZIP passed**. The real browser engine passed 20/20 and all five preview modules fit at 320/360/400px. These do not certify installed Chrome, audible speech, real AI inference or screen-reader acceptance.

- Safe Reading typography, local preview/Apply/discard, width/paragraph spacing/alignment and locally bundled licensed fonts.
- Selected-text and opt-in hover speech, reading ruler, sensory controls and protected content.
- Explicit global/per-origin profiles; no automatic site activation.
- Annotated SVG bars, lines and pies with exact tables, independent labels/patterns/markers, grounded summaries and safe invalidation/Restore.
- Assignable Chrome Read/Stop/Restore commands.
- ZIP-inspired popup/panel with real state, persistent actions and interactive sample-only preview.
- Optional consent-based local AI adapter/client with comparison, copy, explicit safe-range Apply and guarded undo. **A real configured model is still required and was not tested here.** See [setup](docs/OPTIONAL-AI.md).
- Sign dictionary validation/keyboard lookup/video UI; **approved catalog is empty**, so no playable dictionary or sign-hover card is claimed. See [rights/data requirements](docs/THIRD-PARTY.md).

All active modes default off. No account, analytics, remote code or automatic page upload. Required permissions remain activeTab/scripting/storage/sidePanel; optional loopback host access is requested only for the local AI connection. P0 native release gates remain open. No distribution licence has been selected.

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

`npm test` runs 109 Vitest tests and 4 packaging checks. `/demo/validation.html` provides 35 real-browser page-engine checks; it does not impersonate an installed extension or prove actual voice playback. `/demo/advanced.html` provides controlled line/pie charts and visible source/contract/prose/history mutations for installed acceptance. See [demo steps](DEMO.md).

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

No server, database, secret key or `.env` is needed for the local core. Optional AI uses a separately configured local adapter/model; see docs/OPTIONAL-AI.md. Production output is generated locally and ignored by Git. Dependencies are locked.

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

Extended line/pie metadata and validation limits: [chart contracts](docs/CHART-CONTRACTS.md). Font/parser sources and notices: [third-party materials](docs/THIRD-PARTY.md).
