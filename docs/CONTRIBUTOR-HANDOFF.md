# Complete contributor handoff — 7 November 2026

## Checkpoint and source

- Upstream: https://github.com/DhruvKhanna7777/extensionpwd
- Start from current upstream **main**. All feature/fix PRs through #12 are merged. Runtime baseline: **f86e2f117a9fc1a41d0f12a3c87bbf029422b4ec**. This subsequent documentation checkpoint does not change runtime behavior. Inspect latest remote refs/PRs/status when resuming.
- User explicitly requested STOP at a saved checkpoint and a complete baton pass. Feature work is stopped. Resume when asked; do not interpret historical GO instructions as current authorization to run indefinitely.
- Version 0.1.0 development build; not a public release certification. No distribution licence has been chosen.

## Product and reference decisions

AbleVerse AI is a user-controlled Chrome accessibility extension, not a portal or medical product. The owner supplied Bible.pdf, a Stitch design ZIP and `ableverse_production_frontend_codebase.md` from Krish. Final Part II/A1 of the PDF governs priorities. The UI references contain useful design/tokens/assets and sample state; their production/AAA labels do not prove working behavior. Original private documents are excluded from Git. FRONTEND-REFERENCE.md records the latest adaptation decisions. No AbleHire archive was supplied; the implementation is fresh.

## Total implemented work

| Area | Actual implementation | Boundary |
|---|---|---|
| Chrome shell | Manifest V3 popup and full panel; Overview, Reading, Sensory, Charts, Settings; current-tab control, queues, revision guards, explanations and Restore | Required activeTab/scripting/storage/sidePanel; Chrome 116+; no automatic activation |
| Reading | Bounded font/size/line/letter/word spacing; h1–h6 hierarchy; paragraph spacing, width, alignment and palettes; presets, numeric typing, local draft preview/explicit Apply/discard; persistent Restore | Eligible prose only; preserve protected controls and newer site edits; enlarged words wrap |
| Fonts/design | Bundled Lexend, Atkinson Hyperlegible and OpenDyslexic with notices and pinned provenance; design-inspired real-state UI, reduced-motion styles; clearer control borders | No runtime remote fonts; build verifies six font/notice hashes; specific Stop border improved 2.11:1 to 4.14:1, not global AAA certification |
| Speech/ruler | Explicit selected-text voice/rate/volume/pause/resume/Stop/Escape; opt-in bounded dwell hover paragraph/first-sentence/word speech; pointer-transparent ruler with focus/keyboard behavior | Hidden/protected content excluded; lifecycle/callback ownership guards; real listening acceptance still incomplete |
| Sensory | Reduce CSS motion with essential status exclusions; article outline, control emphasis, calm palettes, safe marked distraction hiding | No heuristic hiding or blanket video/GIF/canvas stopping |
| Preferences/commands | Explicit global and per-origin save/load/reset; assignable Read selection/Stop/Restore commands tied to initial tab | Load updates controls only; no automatic page/site activation |
| Charts | Explicit metadata SVG bars/direct polyline series/direct pie paths; exact accessible tables, labels, patterns/dashes/markers, grounded summaries and table focus; invalidation and owned Restore | Narrow documented contracts; malformed/grouped/transformed/unknown/canvas inputs fail safely; no pixel/colour inference |
| Optional AI | Explicit safe selection capture, per-selection consent, fixed loopback client/Node-Ollama adapter; comparison/copy, cancellation, safe-range explicit Apply and guarded undo | Real model absent/unverified; no key/model/hosted service bundled; optional permission only on explicit connection; no automatic uploads |
| AI lifecycle fixes | Failed recapture clears old text/consent/output; late cancelled capture discarded; Apply once-only; stale completion/errors suppressed after page changes | After dispatch, page Apply is not falsely offered as cancellable; use Restore for owned output |
| Sign lookup | Validated catalog schema, exact word/phrase/sense lookup, local video/source/licence UI, keyboard/fallback/lifecycle handling | **Approved catalog EMPTY**; no actual playable dictionary, sign-hover card, guessed signs or sentence translation |
| Test/build tools | 109 automated tests, 4 packaging checks, 35-check real-browser engine harness, controlled article/form/bar/advanced fixtures; typecheck/esbuild and exact ZIP allowlist/byte checks | Evidence types remain separate from installed/audio/model/screen-reader acceptance |

## Integrated contributor history

- PRs #1–#4: initial core, navigation/chart/cleanup safeguards, installed smoke evidence and user-confirmed paragraph/pause-resume.
- PR #5, Arihant2007: typography draft preview, Reading colours, persistent Restore, custom-control/form protection and h4–h6.
- PR #7, jinishajain: reversible long-word reflow and further native/listening evidence with limitations.
- PR #8, KrishChadha001: reproducible package/blocker/remaining-case documentation.
- PR #9, KrishChadha001: expanded reading/ruler/hover/profiles/charts/fonts/UI/commands/optional AI/sign infrastructure.
- PR #6 and #10–#12: handoff pack, Windows font provenance preservation/AI disclosure, 35-check browser harness/dynamic fixture/contrast, and AI capture/Apply lifecycle fixes.

Preserve contributor authorship. No duplicate merges or competing rewrite of already-integrated work is needed.

## Verification actually available

Latest runtime was checked on original Windows workstation, Node **22.19.0**, npm **10.9.3**. `npm test` passed **109 Vitest tests across 15 files + 4 Node package checks**. `npm run package` passed production TypeScript/build and verified **19 shipping files**. Last dependency audit during PR #9 integration found zero vulnerabilities; no dependencies changed afterward. Do not describe that audit as a new live check without rerunning it.

ZIP: `artifacts/ableverse-ai-0.1.0.zip`. SHA-256:

```text
27302e9e43820adb5fd3f1799a387d0611fc37c64bd4cebdfb5c5e8dac004f05
```

All six source and shipped font/notice hashes matched pinned provenance after PR #10. Packaging verifies exact bytes and rejects missing/escaping paths and unrelated leftovers. Generated dist/artifacts are ignored by Git; build your own after cloning.

The in-app browser harness passed **35/35** on PR #11, covering protected content, typography hierarchy/reflow, motion, charts, repeated Apply/exact Restore/site-edit preservation, width/spacing/alignment, ruler/Escape and all three actual local font loads. PR #12 changed only AI panel behavior, not that page engine. The four advanced fixture mutation controls were separately exercised. Prior contributor UI-preview evidence covers 15 module/width combinations at 320/360/400px; complete zoom/state/contrast acceptance is still open.

AI operation regressions were observed failing before fixes. Actual loopback HTTP cancellation testing used a **fake upstream model**, proving disconnect propagation and next-request recovery, not real inference quality. Permission/device/model boundaries are faked where documented.

Historical installed Chrome results include installation, popup/panel/activeTab, Reading, chart/table/Restore/reopening, form edit/submit preservation and selected speech control states. Listener reports include paragraph/pause-resume, particular voice/rate/volume runs and navigation cancellation. Read INSTALLED-ACCEPTANCE.md for exact commits/conditions/timing limits. Do not transfer these passes wholesale to current code.

## Setup for the next contributor

Use Node 22.12+ and desktop Chrome 116+:

```sh
git clone https://github.com/DhruvKhanna7777/extensionpwd.git
cd extensionpwd
git switch main
git pull --ff-only
git switch -c acceptance/next-checks
npm ci
npm test
npm run package
npm run demo -- --port 5173 --strictPort
```

On an existing checkout inspect/preserve local changes before switching/pulling. Load/reload generated dist from chrome://extensions in an authorized testing profile; refresh fixtures and click toolbar icon to grant current-tab access. Vite `/` is a sample-only interface. `/demo/validation.html` is an engine harness, not an installed extension. `/demo/advanced.html` provides controlled line/pie metadata/contract/prose/history mutation buttons. DEMO.md gives exact steps.

Optional AI setup is separate: OPTIONAL-AI.md describes the local adapter, actual extension ID, Ollama/model selection and consent flow. No Ollama executable was found on PATH and no service was reachable at 127.0.0.1:11434 at the last workstation check. No model was downloaded or service enabled. Settle model licence/data/cost/download choices with the owner before installation or use; mock output is not a substitute.

## Remaining work, ordered

1. **Current installed reflow and Reading:** 150% Verdana, 0.09em letter/0.21em word spacing, panel open, recorded viewport/zoom; no induced horizontal scrolling and exact Restore. Test draft Apply/discard across navigation/modules/tabs, other-mode preservation, headings/protected forms/custom controls, fonts/width/spacing/alignment/ruler/profiles/shortcuts.
2. **Native access/tab ownership:** internal/store pages, actual supported grant revocation, and a tab switch proven to occur while Apply is pending. Keep earlier ordinary/rapid-switch observations separate from deterministic mocked queue checks.
3. **Dynamic pages/charts:** line/pie/bar exact data/visual controls/table focus, metadata/contract/geometry invalidation, Reading retained on unrelated chart edits with Charts off, newer text/fill preservation, explicit Apply for new prose. Use `/demo/advanced.html` instead of inventing uncontrolled page changes.
4. **Actual speech:** identify voices; test rate/volume endpoints separately; hover dwell/word behavior; measure audible Stop/Escape/tab-hide/pagehide/normal/history-only cancellation latency in fresh runs. UI status alone is insufficient.
5. **Accessibility:** all modules/popup/panel keyboard-only and named/versioned screen reader; focus/names/values/status/error announcements/table headers; 100/200/400% zoom, narrow widths, palettes/contrast/states/icons. Specific computed border/engine contrast checks are not full certification.
6. **Real AI:** owner-reviewed model setup; actual inference, meaning/facts/numbers/negation/warning preservation, latency, offline/malformed service, optional permission denial, per-selection consent, cancellation, recapture, safe/stale Apply and Restore/site-edit behavior. Real model output and native optional permission flow remain unverified.
7. **Real ASL:** obtain video redistribution rights plus linguistic/source review; populate/package a small approved local dictionary with notices; test real hits/misses/senses/video errors/keyboard/provenance. Then implement A9's anchored/pinnable word-hover card and arbitration with speech. No approved data is currently supplied.
8. **Release:** owner selects distribution licence; after required gates pass, prepare truthful store/privacy/screenshots/package evidence and seek publishing approval. No public-release sign-off yet.
9. **Later roadmap:** richer site rules/preset management; P2 OCR/deep PDF, multilingual reading, personalised ML, universal canvas/image reconstruction, cross-browser support and grammar-aware sign translation. These are unimplemented, not hidden completed features.

For each case record PASS/FAIL/BLOCKED/NOT RUN, source commit, date/tester, environment/voice/model/screen reader, steps, expected/actual, evidence and limitations. Reproduce defects, add meaningful regressions, fix causes and retest the affected real behavior. Follow NEXT-CONTRIBUTOR.md and WORKFLOW.md. Do not use estimated completion percentages as release criteria.

## Architecture and decisions to preserve

UI: App.tsx/ui.css/NumberField.tsx; current-tab queue/revisions/selection/profiles: usePageController.ts; settings: settings.ts; injection/cleanup: content.ts. Page ownership: engine.ts/ruler.ts; speech/hover: speech.ts/hover.ts; bars/structured charts: charts.ts/structuredCharts.ts. AI: AISelection.tsx/ai.ts/selectionSession.ts and server/ai.mjs. Signs: signs.ts/SignLookup.tsx (empty approved catalog). Commands: background.ts/commands.ts. Fonts/notices: fonts.ts/assets; build/package: build.mjs/scripts/package.mjs.

Defaults off, explicit changes/save/load, never auto-activate. Restore removes owned changes and preserves newer website edits. Ordinary modes do not rewrite source text; AI replacement requires explicit consent/review/Apply to a safe range. Protect essential controls/warnings/editables. No heuristic hiding, invented chart values, client provider keys, automatic uploads, analytics or remote code. Loopback host access is optional and fixed by CSP. Browser/OS voices and chosen models may use online services; do not promise offline processing without checking configuration.

## Workstation and stopping state

Original checkout: C:\Users\ASUS\Documents\Codex\2026-11-07\ar\work\extensionpwd. Outputs: C:\Users\ASUS\Documents\Codex\2026-11-07\ar\outputs. Private references are not in Git. These paths, Chrome profiles and models do not transfer.

Only existing cyan dhruvkhanna1522 Chrome profile is authorized for native testing on the original workstation. Earlier extension ID ddibeighmdafgbbnigmkojdkneemdghe points at dist; verify actual installation/source before relying on it. Native browser URL verification repeatedly blocked control; the latest attempt also lacked a connected Chrome browser surface. Do not bypass safeguards. Another contributor uses their own authorized profile.

Demo server stopped for this checkpoint. Optional adapter/model not started. Existing extension was not uninstalled or its permissions changed. No account password, token, private source document, model binary, generated dist/ZIP or unlicensed clip belongs in Git. Use own GitHub account/fork; no owner's password is needed. Save focused commits/PRs and update this handoff and evidence; verify owner authorization before merge, licence choice or publication. Never force-push main.
