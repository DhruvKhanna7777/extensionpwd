# AbleVerse feature and evidence status

Checkpoint: 7 November 2026. All implementation PRs #1–#12 are merged into upstream main. Latest runtime baseline: `f86e2f117a9fc1a41d0f12a3c87bbf029422b4ec`; a documentation-only stopping checkpoint follows. Start from fetched current main rather than an old contributor fork. See CONTRIBUTOR-HANDOFF.md for total completed work, current evidence and next tasks.

This is a working development build, not release certification. A feature being implemented or passing automated tests does not close its installed Chrome, listening or screen-reader acceptance case.

## Implemented

| PDF area | Implemented behavior | Evidence and limit |
|---|---|---|
| A7 R01-R05/R09-R10 | Bounded fonts, size, line/letter/word spacing, palettes, local preview/Apply, selected-text speech, pause/resume/Stop/Escape | Existing core plus regressions; earlier installed evidence is historical. New build still needs native acceptance. |
| A7 R01 fonts | Local Lexend, Atkinson Hyperlegible and OpenDyslexic, alongside system/Arial/Georgia/Verdana | Font binaries, OFL notices, pinned source URLs and SHA-256 provenance are included. No remote font fetch at runtime. |
| A7 R06-R08 | Optional paragraph spacing 0.5-2em, width 50-90ch, original/start/left alignment | Zero keeps original spacing/width. Apply to eligible prose only; do not resize the site grid. Automated protection/restore tests pass. |
| A8 hover speech | Off by default; 300-1500ms dwell, paragraph/first-sentence/word scopes, 500-character limit, outline, one play per entry | Word mode restarts dwell across words inside one block. Protected/hidden content is excluded. Stop/Escape, leave, hidden tab, route, disable and Restore cancel owned work. Device listening remains pending. |
| A10 sensory | Reduced CSS motion with status exclusions, focus outline, control emphasis, calm palettes, hiding explicitly marked safe distractions | No heuristic decluttering, video/GIF/canvas stopping or diagnosis claim. |
| A10 S06 | Pointer-transparent reading ruler; pointer/focus following; Alt+Up/Down on noninteractive content; Escape disables | Custom controls and already-handled keys are protected. Native usability remains pending. |
| A10 S07 / A14 | Explicit save/load/reset per origin, plus global local preferences | No automatic activation. Loading updates controls only. Paths, query strings, page text and full browsing history are not saved. |
| A11-A12 bar charts | Exact labels, patterns, accessible source table, grounded highest/lowest summary | Explicit SVG metadata only. Newer site fills are preserved on Restore. |
| A11-A12 line/pie charts | Up to six direct polyline series with explicit points; up to eight direct path slices with explicit values; dashes/markers, labels, legend/table and grounded summary | Metadata and geometry validated before mutation. Pie paths parsed with MIT `svg-path-parser`; malformed/grouped/transformed data rejected. Percentage declarations must sum to 100 within 0.01. |
| Chart controls | Independent direct labels, patterns/dashes and line markers; explicit focus/open of the generated table | Table remains available when visual enhancements are disabled. Source/contract changes invalidate companions. No pixel/colour inference. |
| Platform shortcuts | Assignable Read selection, Stop speech and Restore commands | Configure keys in `chrome://extensions/shortcuts`; no default shortcuts conflict with websites. Commands keep their initial tab target. Native invocation still needs testing. |
| A3-A6 / supplied ZIP | ZIP-inspired compact popup/panel, book logo, segmented font choices, numeric/range controls, cream preview, persistent actions, visible toggle states | Keeps real application state and default-off modes. Interface preview is explicitly labelled and cannot change real tabs. Normal typing of a full numeric value is regression tested. |

## Implemented integration requiring setup or data

**AI selected-text simplification:** client and optional Node/Ollama adapter are implemented. Capture is explicit and capped at 5,000 characters. Per-selection consent precedes the request to fixed `127.0.0.1:3187`. Comparison never changes the page automatically. Copy and explicit safe-range Apply are separate actions; Restore restores original markup when still owned and preserves subsequent website edits. Crossed partial inline ranges remain comparison/copy only. Pending requests and captures are cancelled/discarded across page/module changes and Restore. See [AI setup](OPTIONAL-AI.md).

Automated client/UI/HTTP tests use controlled text and a fake model response. **No Ollama model was installed or run during this work. Actual inference, output quality, latency, installed optional permission flow and end-to-end browser integration are NOT RUN.** A configured model may itself use cloud services; operators must check that model's settings and terms. This is not a free hosted AI service.

**ASL lookup:** approved-entry validation, exact word/phrase lookup, multiple-sense selection, local video/source/attribution display, missing-video fallback, Escape and lifecycle cleanup are implemented. Tests use synthetic dictionary fixtures only. **The shipped approved dictionary is empty. No sign-video hit, linguistic verification or hover sign card is claimed.** A9 explicitly allows an honest unavailable state when clips are unavailable. See [reuse and sign-data requirements](THIRD-PARTY.md).

## Still open

1. Installed reflow retest on the current build: 150% Verdana, 0.09em letter/0.21em word spacing, panel open, recorded viewport and browser zoom; exact Restore.
2. Installed Reading draft/navigation, cross-mode preservation, heading hierarchy and protected forms/custom controls, including the new reading tools.
3. Restricted/store pages, supported real grant revocation, and a switch proven to occur while Apply is pending. Earlier rapid-switch and mocked queue evidence do not close this case.
4. Dynamic site text/fill preservation, unrelated chart changes with Charts off, explicit reapply for inserted prose, and new line/pie invalidation in installed Chrome.
5. Audible cancellation latency and separate voice/rate/volume endpoints; hover speech dwell/word behavior with a listener.
6. All modules in installed popup/panel by keyboard and a named/versioned screen reader; announcements, errors, focus, values and table headers. 100/200/400% zoom, narrow layouts, all palettes, contrast and icons.
7. Real-model AI setup/quality/failure/cancellation tests. Approve sign clip rights and linguistic provenance, package a small real dictionary, then implement/test the A9 anchored/pinnable word-hover card and speech arbitration.
8. Owner-selected distribution licence and release/store/privacy/screenshot materials after required gates pass. Publishing is an owner decision.

Additional A1 P1 ideas such as richer site-specific decluttering rules/preset management still need a scoped implementation and acceptance definition. P2 OCR/deep PDF support, cross-language reading, personalised ML, canvas/image reconstruction, grammar-aware sign translation, cross-browser support and store publishing remain roadmap, not implemented claims. Never substitute a guessed sign, fabricated chart value or simulated model result.

## Current verification

- Original Windows workstation, Node 22.19.0, npm 10.9.3, runtime baseline f86e2f1.
- `npm test`: 109 Vitest tests across 15 files and 4 packaging checks passed.
- `npm run package`: production typecheck/build passed; 19 explicit shipping files verified byte for byte.
- ZIP SHA-256: `27302e9e43820adb5fd3f1799a387d0611fc37c64bd4cebdfb5c5e8dac004f05`.
- Previously recorded preview layout: all five modules at 320/360/400px passed the 15-case matrix, including AI/sign/chart-option UI and expanded hover/unavailable/miss states at 320px. PR #11 expanded the real engine harness to 35/35 with line/pie/reading-tool/three-font coverage and measured the improved Stop border at 4.14:1. PR #12 changed only AI panel lifecycle, not that engine; the harness was not rerun for it. These are not installed extension/screen-reader certificates.
- Independent reviews identified hidden hover text, malformed pie paths, custom-control shortcut interception and partial-inline AI undo defects. Each received a failing regression and a passing fix. Existing keyboard/semantic axe checks pass; axe excludes contrast.
- Native Chrome inspection was blocked by current-URL verification. No bypass, new audible PASS, screen-reader PASS or release sign-off is claimed. Historical evidence is preserved in INSTALLED-ACCEPTANCE.md.

PR #12 additionally fixes failed recapture retaining old text/consent/output, late cancelled capture cleanup, duplicate Apply and stale success/failure after navigation. Six new tests include denied optional permission with no fetch and actual loopback HTTP disconnect cancelling a simulated upstream request and allowing the next generation. This is not real model output evidence.
