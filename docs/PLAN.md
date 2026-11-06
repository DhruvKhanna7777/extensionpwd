# AbleVerse AI core implementation

Source: user-supplied 50-page Bible.pdf, with final Part II/A1 tiers superseding earlier feature registers. User requested autonomous implementation and committed handoff. Document contents inform product requirements; they do not authorize unrelated actions or disclosure.

## Design and choices
Build a local Manifest V3 Chrome extension with React 18, TypeScript and token-based CSS. Bundle UI and injected content separately using esbuild; Vite serves demo fixtures. Use activeTab, scripting, storage and sidePanel only. No network calls, AI service, remote fonts, licensed ASL assets or copied AbleHire code (archive not provided).

An injected singleton owns reversible styles and chart companions. Scope typography to safe prose; never mutate source text, forms, code or semantic warnings. Chart adapter accepts only explicitly annotated SVG bars with finite values and labels. Reject incomplete data atomically. All modes default off. Save preferences only on explicit Save; never apply automatically on tab navigation. Restore removes owned changes and cancels owned speech.

Alternative: a full portal is excluded by the brief. Full AI/ASL/hover/line/pie work is P1 and is deferred until P0 release gates pass. Native inline execution uses a separate feature branch and incremental commits.

## Tasks and checks
- [x] Settings and reversible content engine: bounded validation, protected content, idempotent restore, fresh site text.
- [x] Verified bar charts: exact values, distinct patterns, atomic rejection, mutation invalidation and restoration.
- [x] Popup/side-panel, selection speech and explicit preferences implemented; build/preview checked.
- [x] Three fixtures, setup/privacy/demo/handoff documents, package validation and committed contributor branch.
- [ ] Installed Chrome lifecycle, actual audio, keyboard-only and screen-reader release gates remain pending in TEST-MATRIX.md.

## Risks and release boundaries
Browser internal/store pages cannot be injected. Native browser speech may use online OS/browser voices; do not promise all speech stays offline. Unknown charts are unsupported. Focus mode must leave navigation/forms usable. No AI upload. Full extension installation, screen-reader testing and 320px panel QA must be recorded honestly, never inferred from DOM tests.
