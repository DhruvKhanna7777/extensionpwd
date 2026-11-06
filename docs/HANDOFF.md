# AbleVerse AI handoff

Branch: `feat/ableverse-core`. First implementation from the 50-page product blueprint; final Part II/A1 controls priorities. PDF stays local and is not redistributed to this public repo. Product requirements are summarized in PLAN.md.

## Completed

MV3 build and React popup/five-section panel; typography/presets/preview/reset; selected-text speech; sensory CSS; verified SVG bar labels/patterns/table; reversible owned-change registry; effective per-page state; explicit save/load; three fixtures; docs and locked dependencies.

29 automated tests across settings, engine, charts, speech lifecycle and React UI. TypeScript/bundles pass. Full dependency audit: zero vulnerabilities (Node 22.12+). Initial UI preview visually inspected at 320px; new voice controls still require updated visual QA. See TEST-MATRIX.md for verification scope.

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

1. `npm ci`, `npm test`, `npm run build`. Load `dist` into a designated Chrome test profile. If operating the user's browser, honour cyan `dhruvkhanna1522` profile preference; do not open other profiles.
2. Run DEMO.md with installed extension: activeTab, popup -> sidePanel.open, reopening state, selection retention and voices.
3. Verify real pause/resume, Stop/Escape, tab hide, pagehide and SPA. Speech tests fake the device API, not actual audio.
4. Complete keyboard-only/screen-reader and widths 320/360/400 checks; fix failures before release sign-off.
5. Exercise site DOM updates. New prose needs the next explicit Apply; no automatic reapplication. SPA cleanup observes DOM mutation; a history-only route with no mutation is not detected immediately.
6. Verify generated icon family, choose distribution licence and capture reproducible installation evidence.
7. P1 only after P0 gates: hover speech, per-site settings, line/pie, consent-gated AI and verified licensed ASL dictionary. Never put keys or unlicensed assets in client/repo.

## Decisions/limitations

- Lightweight new code; no AbleHire archive supplied for reuse.
- Focus outlines rather than hiding/dimming unknown regions, keeping forms/warnings usable.
- No AI/ASL backend or fake output. AI name follows blueprint; build labelled LOCAL CORE.
- No source PDF redistribution or credentials copied into files.
- Main remains unchanged; implementation on contributor branch for review.
- Runtime message receiver stays installed as a singleton for explicit future actions; Restore cleans active observer, styles, markers and speech.

Commit/push milestones and keep this file/test matrix current. Do not mark pending checks as passed.
