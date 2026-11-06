# AbleVerse AI handoff

Branch: `feat/ableverse-core`. First implementation from the 50-page product blueprint; final Part II/A1 controls priorities. PDF stays local and is not redistributed to this public repo. Product requirements are summarized in PLAN.md.

## Completed

MV3 build and React popup/five-section panel; typography/presets/preview/reset; selected-text speech; sensory CSS; verified SVG bar labels/patterns/table; reversible owned-change registry; effective per-page state; explicit save/load; three fixtures; docs and locked dependencies.

19 automated tests across settings, engine, charts and content router. TypeScript/bundles pass. Full dependency audit: zero vulnerabilities after upgrading Vitest to 5.1.0 (Node 22.12+). UI preview visually inspected at 320px; narrow dimensions checked. See TEST-MATRIX.md for verification scope.

Final review fixes: speech-only SPA navigation now cancels playback; transformed/grouped bars fail safely instead of misplacing labels; source-chart mutations invalidate companions and reset applied modes rather than displaying stale verified values. Reopen the controls or apply explicitly after a dynamic chart update.

## Resume and release gates

1. `npm ci`, `npm test`, `npm run build`. Load `dist` into a designated Chrome test profile. If operating the user's browser, honour cyan `dhruvkhanna1522` profile preference; do not open other profiles.
2. Run DEMO.md with installed extension: activeTab, popup -> sidePanel.open, reopening state, selection retention and voices.
3. Verify real pause/resume, Stop/Escape, tab hide, pagehide and SPA. Speech tests fake the device API, not actual audio.
4. Complete keyboard-only/screen-reader and widths 320/360/400 checks; fix failures before release sign-off.
5. Exercise site DOM updates. New prose needs the next explicit Apply; no automatic reapplication. SPA cleanup observes DOM mutation; a history-only route with no mutation is not detected immediately.
6. Add extension icon family, choose distribution licence and capture reproducible installation evidence.
7. P1 only after P0 gates: hover speech, per-site settings, line/pie, consent-gated AI and verified licensed ASL dictionary. Never put keys or unlicensed assets in client/repo.

## Decisions/limitations

- Lightweight new code; no AbleHire archive supplied for reuse.
- Focus outlines rather than hiding/dimming unknown regions, keeping forms/warnings usable.
- No AI/ASL backend or fake output. AI name follows blueprint; build labelled LOCAL CORE.
- No source PDF redistribution or credentials copied into files.
- Main remains unchanged; implementation on contributor branch for review.
- Runtime message receiver stays installed as a singleton for explicit future actions; Restore cleans active observer, styles, markers and speech.

Commit/push milestones and keep this file/test matrix current. Do not mark pending checks as passed.
