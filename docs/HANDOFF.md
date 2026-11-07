# AbleVerse AI handoff

Integration branch: `main` (PR #1 merged at dd90713). First implementation from the 50-page product blueprint; final Part II/A1 controls priorities. PDF stays local and is not redistributed to this public repo. Product requirements are summarized in PLAN.md.

## Completed

MV3 build and React popup/five-section panel; typography/presets/preview/reset; selected-text speech; sensory CSS; verified SVG bar labels/patterns/table; reversible owned-change registry; effective per-page state; explicit save/load; three fixtures; docs and locked dependencies.

37 automated tests across settings, engine, charts, speech lifecycle and React UI. TypeScript/bundles pass. Full dependency audit: zero vulnerabilities (Node 22.12+). Initial UI preview visually inspected at 320px; new voice controls still require updated visual QA. See TEST-MATRIX.md for verification scope.

## Third checkpoint: installed Chrome smoke test

- Successfully loaded `work/extensionpwd/dist` as an unpacked extension into the existing cyan dhruvkhanna1522 profile, with prior explicit user approval. Extension ID: `ddibeighmdafgbbnigmkojdkneemdghe`. Developer mode enabled for local loading. No other extensions changed.
- Verified toolbar popup, activeTab access, popup -> full side panel, Reading application and Restore on the localhost article fixture. Browser-internal context showed disabled actions rather than attempting modification.
- Live smoke test exposed a real font-size bug: relative em overrides flattened headings to parent paragraph size at 100%. Fixed by sampling each eligible element's original computed pixel size before applying owned CSS, then scaling those sizes independently. Added regression for 36px heading / 18px paragraph at 100% and 150%, plus restore.
- Rebuilt, reloaded the installed extension, refreshed the article and verified the corrected heading hierarchy and exact Restore confirmation in Chrome.
- Fixed state-notification feedback replacing the Restore acknowledgement; quiet status refresh no longer resets controls unnecessarily.
- Added keyboard Tab/Space/Enter tests and axe semantic checks for all five modules. Color contrast is excluded from jsdom checks because jsdom has no layout engine; these are not screen-reader certification.
- Browser automation stopped again during the subsequent chart-page navigation because current-URL verification could not be established confidently. No further UI input sent in that turn. Native chart/form/audio checks remain pending; installed extension stays enabled and loaded from the build directory.

## Second checkpoint

- Permission failures roll controls back to effective state; unsupported pages disable actions and explain why.
- Queued changes stay bound to their click-time tab; stale tab-state responses cannot overwrite a newly selected page.
- Split React app/controller/speech modules and formatted source for contributors.
- Speech callbacks use generation tokens so cancelled utterances cannot disable Stop on newer playback. Real asynchronous voice errors are exposed to the panel through page-state notifications.
- Voice list, explicit saved voice selection and bounded volume controls added. Icons generated from owned vector paths during build.
- Minimum Chrome version is now 116 because the full panel uses sidePanel.open (official API availability).
- User explicitly approved loading/testing in cyan dhruvkhanna1522 profile. Attempt used the existing correct Chrome window, opened a testing tab, then the browser controller stopped because current-URL verification failed. No unpacked extension installation occurred. Further browser input stopped for that turn. Approval remains granted for a later supported testing flow.

Final review fixes: speech-only SPA navigation now cancels playback; transformed/grouped bars fail safely instead of misplacing labels; source-chart mutations invalidate companions and reset applied modes rather than displaying stale verified values. Reopen the controls or apply explicitly after a dynamic chart update.

## Resume and release gates

1. `npm ci`, `npm test`, `npm run build`. Extension is already loaded from this checkout's dist; reload it after rebuilding. If operating the user's browser, honour cyan `dhruvkhanna1522` profile preference; do not open other profiles.
2. Continue DEMO.md with the installed extension. Installation, activeTab, popup, full-panel opening, Reading and Restore have passed smoke checks. Remaining: source chart/form fixture, reopening state, selection retention and voices.
3. Verify real pause/resume, Stop/Escape, tab hide, pagehide and SPA. Speech tests fake the device API, not actual audio.
4. Complete keyboard-only/screen-reader and widths 320/360/400 checks; fix failures before release sign-off.
5. Exercise site DOM updates. New prose needs the next explicit Apply; no automatic reapplication. Active sessions also check URL changes every 500ms, including history-only navigation. Restore removes the check; real browser timer throttling still needs verification.
6. Verify generated icon family, choose distribution licence and capture reproducible installation evidence.
7. P1 only after P0 gates: hover speech, per-site settings, line/pie, consent-gated AI and verified licensed ASL dictionary. Never put keys or unlicensed assets in client/repo.

## Decisions/limitations

- Lightweight new code; no AbleHire archive supplied for reuse.
- Focus outlines rather than hiding/dimming unknown regions, keeping forms/warnings usable.
- No AI/ASL backend or fake output. AI name follows blueprint; build labelled LOCAL CORE.
- No source PDF redistribution or credentials copied into files.
- Initial implementation merged into main through PR #1; later changes use focused contributor branches.
- Runtime message receiver stays installed as a singleton for explicit future actions; Restore cleans active observer, styles, markers and speech.

Commit/push milestones and keep this file/test matrix current. Do not mark pending checks as passed.

## Navigation/chart checkpoint

History-only route checks run every 500ms while observing and are removed on Restore. Chart-source invalidation is conditional on Chroma, so Reading survives unrelated chart updates. Patterns override inline CSS fill while preserving/restoring the original style and newer unrelated site edits. Tests: 37 pass; production build and full audit pass. README now builds from main.
