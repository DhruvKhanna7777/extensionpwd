# Next contributor: finish P0 acceptance

## Latest implemented contribution

The follow-up adds local preview-before-apply typography, a Reading colour selector, persistent Restore, clearer control borders, custom-widget/form protection and h4-h6 scaling. Current validation: 48 Vitest + 3 package checks, production package, 19/19 real-browser engine checks and 15/15 narrow preview layouts passed. Earlier 44/17 counts below describe the starting point.

PR #5 is already reviewed and merged into main at f257cda. The integrating reviewer reran 48 Vitest + 3 package checks, build/package and audit successfully; tested PR and merged main matched. Start with START-HERE.md, WORKFLOW.md and PROMPTS.md. Rebuild/reload dist in Chrome and verify preview Apply/discard (including tab changes and Restore), custom controls/form prose left intact and heading hierarchy. Then continue the ordered native gates below. The implementation contributor's workstation had no connected Chrome profile; no new native/audio/screen-reader PASS is claimed for PR #5. P1 starts only after P0 acceptance.

## Verified starting point — 2026-11-07

PR #2 merged at `59409be`, PR #3 at `417d183`, and PR #4 at
`ecf757653b25fb97ca62ffc7327c4695b8b30f1f`. The previous implementation and
user-confirmed audio evidence are already on main. This handoff resumes that
checkpoint; it does not certify a release or implement P1 features.

Fresh checkout verification on Windows with Node 24.21.0 / npm 11.19.0:
`npm ci` succeeded (0 vulnerabilities reported), `npm test` passed 44 Vitest
tests and 3 package checks, and `npm run package` typechecked, built and
verified an 11-file ZIP. No installed Chrome, listening or screen-reader
checks were performed in this follow-up. Historical native results belong
to the original workstation; do not assume its profile or extension exists
on a different machine.

Read AGENTS.md and the linked evidence before changing behavior. Use a focused
branch, preserve other contributors' work, and keep the private blueprint out
of Git. Rebuild, load/reload `dist` in the authorized testing profile, then run
`npm run demo`. Use controlled demo content only.

## Remaining work, in order

Record each case separately as PASS, FAIL or BLOCKED, with commit, OS/Chrome
version, voice name, steps, expected/actual result and tester. Keep audible
observations separate from UI status. A blocked case remains an open gate.

1. **Listen to speech.** On `/demo/article.html`, select prose and start Read
   selection. Try available device/browser voices and low/default/high allowed
   rate and volume settings. Record the exact combinations tried. Check audible
   pause/resume, Stop and page-focused Escape during a long paragraph. Record
   cancellation delay and any speech continuing after the UI says stopped.
   One confirmed voice does not establish all voices or offline operation.
2. **Switch and navigate.** Start a fresh speech run for each case: switch tabs,
   navigate away, and change a same-document route (including history-only
   navigation). Speech should stop on tab hide; pagehide/route changes should
   also clear owned adaptations. History-only detection polls every 500ms while
   active; record observed delay rather than assuming instant cancellation.
   Return and reopen the panel: no unsolicited speech or automatic reapplication.
3. **Check blocked pages and tab ownership.** Open a browser-internal page and
   confirm unavailable actions explain the limitation. Separately exercise a
   real denied/revoked grant if the testing environment supports it; otherwise
   mark that case BLOCKED. Queue an action then switch tabs and confirm it never
   modifies the newly selected tab. Record actual native behavior, not the unit
   tests' mocked permission results.
4. **Change a supported chart while enhanced.** On `/demo/charts.html`, change a
   source bar value, then separately remove/change `data-av-chart`. Use controlled
   fixture edits or DevTools and record the exact edit. Stale verified tables
   and labels must disappear. Apply explicitly again only with a valid contract;
   check exact values. With Charts off and Reading on, unrelated chart edits must
   leave Reading active. Edit site text/fill after Apply and confirm Restore
   preserves those newer edits. Newly inserted prose requires another Apply.
5. **Use keyboard and screen reader.** Record the screen reader/version. Walk all
   five modules, popup and side panel without a mouse. Check focus visibility,
   tab order, names, control values, status/error announcements, chart table
   headers, disabled controls, speech states, and Restore. Test zoom at 100%,
   200% and 400%, narrow panel widths, all palettes and error states for clipped
   controls and readable contrast. Existing preview/axe results are limited
   evidence, not a substitute for this walkthrough.
6. **Prepare release after the gates pass.** Inspect toolbar/extension icons in
   Chrome and capture the browser version. Ask the repository owner to choose a
   distribution licence; do not invent one. Prepare store description, privacy
   disclosures (including browser/OS voice services), screenshots and packaging
   evidence only for supported behavior. Keep unresolved defects visible.

Do not repeat completed chart/form smoke checks unless a build or behavior
change requires it. See INSTALLED-ACCEPTANCE.md for their exact scope. When a
case fails, file a reproducible defect, fix it on a focused branch, add a useful
regression, rerun relevant checks and retest the affected native case.

## Save the result

Update TEST-MATRIX.md, INSTALLED-ACCEPTANCE.md and HANDOFF.md with actual
evidence and remaining gates, then open a focused PR. Do not mark the product
release-certified while a gate remains open. AI simplification, licensed ASL
lookup, hover speech, site profiles and line/pie charts remain deferred P1.
