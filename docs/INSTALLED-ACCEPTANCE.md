# Installed Chrome acceptance — 2026-11-07

## Current implementation checkpoint — 7 November 2026

Upstream PR #8 is merged at `6d30201`. New runtime work is on `feat/reading-tools-and-chart-adapters` in `KrishChadha001/extensionpwd`, tested runtime `84035f8e78df1b5ad15c30865e759565583ee863`; documentation follows it. See [the current handoff](CONTRIBUTOR-HANDOFF.md), [feature status](FEATURE-STATUS.md) and [continuation prompt](CONTINUATION-PROMPT.md). Older checkpoints below are historical.

103 Vitest + 4 packaging checks PASS; production typecheck/build and 19-file package PASS. SHA-256 `39b3c70e9ab384ab43bc929dd00973cb30db8ce43ed61ab16633946f7d801e8f`. Current engine harness 20/20 PASS; final five-module/320-360-400px preview fit matrix 15/15 PASS, plus expanded hover/AI-unavailable/sign-miss states at 320px without horizontal overflow. Preview is not installed evidence.

Reading width/spacing/alignment/fonts/ruler, hover speech, profiles, line/pie adapters, chart options/summaries and keyboard actions are implemented and regression tested. Optional local AI client/adapter and guarded text replacement are implemented with fake-model tests; no real model was run. ASL loader/UI is implemented but approved clips are absent; no playable sign dictionary or hover card is claimed. Native Chrome remains BLOCKED by current-URL verification; new listening/screen-reader/zoom/contrast/permissions acceptance remains NOT RUN. Do not promote historical passes to this build.

The latest user request authorizes committing this implementation and contributor documentation and opening a PR, not merging or publishing. Main must not be force-pushed. First next task is installed reflow on this build with recorded viewport/zoom, then the remaining cases in FEATURE-STATUS.md. Vite was started at 127.0.0.1:5173; the optional AI adapter/model was not started.


## Current continuation: installed verification blocked (2026-11-07)

Source/build: `6d227bc3f52e8387f44c0849f5850c5bc4b045b4`, upstream main after merged PR #7. Earlier results below are preserved, not rerun or superseded.

Environment: Windows NT 10.0.26300.0, Node 24.16.0, npm 11.13.0. Chrome windows were discoverable, but Chrome version, profile, viewport, zoom and installed source were not verified. Tester: coding assistant; no new listener or screen-reader observations.

Attempted steps: locate the existing Chrome window and bind it through supported Computer Use before inspecting the installed build. Actual result: the tool stopped before returning browser state because it could not determine the current URL with enough confidence to enforce policy. This recurred on a later user-requested retry. Browser interaction stopped; no alternate UI route bypassed verification. No profile, grant or extension setting was changed.

| Case | Result this continuation | Steps / expected result still to verify |
|---|---|---|
| P0-RF: installed reflow | BLOCKED | Reload this build; article at 150% Verdana, 0.09em letter/0.21em word spacing with side panel open. Record viewport width and zoom. Heading wraps, prose adds no horizontal scrolling, Restore returns baseline. |
| P0-RD: Reading edges | NOT RUN | Navigation discards changed draft; Apply preserves other modes; heading hierarchy and forms/custom controls stay usable. |
| P0-AC: access/ownership | NOT RUN | Internal/store pages, supported real grant revocation, and tab switch proven to occur while Apply is pending. Destination must stay unchanged. |
| P0-DY: dynamic pages | NOT RUN | With Charts off, unrelated chart mutation preserves Reading. Restore preserves newer text/fill edits. Inserted prose adapts only after explicit reapply. |
| P0-SP: speech gaps | NOT RUN | Measure audible Stop, page Escape, tab-switch, normal-navigation and history-only cancellation latency in fresh runs. Test rate/volume endpoints separately; record voices/settings/listener outcomes. |
| P0-AX: accessibility | NOT RUN | All modules, popup/panel, keyboard and named/versioned screen reader; focus, names, values, announcements, errors, table headers. Zoom 100/200/400%, narrow widths, all palettes, normal/error contrast and icons. |
| P0-RL: release materials | NOT RUN | After P0 passes, owner chooses licence; prepare supported-feature store/privacy copy, screenshots and package evidence. Owner decides publishing. |

These are environment/procedure outcomes, not product failures. No new installed, audible or screen-reader PASS is claimed. Resume at P0-RF when URL verification works or an authorized human tester can execute and report the case. P1 remains deferred until required P0 gates pass.

Build preparation passed separately: `npm ci` (zero vulnerabilities reported) and `npm run package` (production typecheck/build, 11 verified ZIP files). SHA-256: `0238a53ea0bac1213fa9e28979ca395cc49f8d2ea20be867c3e5ef5c318dd9df`, matching the supplied reflow checksum. Automated suites were not rerun; packaging evidence does not close installed gates.

Environment: original Windows workstation, existing cyan dhruvkhanna1522 Chrome profile, unpacked AbleVerse AI 0.1.0, extension ID ddibeighmdafgbbnigmkojdkneemdghe. User reported reloading the current build after main checkpoint 59409be. Browser version has not yet been captured.

## Chart smoke test: PASS

- Navigated from the localhost article to /demo/charts.html using the page's Charts link; verified the current address and native page contents.
- Opened installed toolbar popup and enabled Colour-independent charts. Popup reported one supported chart enhanced and explained that other canvas/unrecognised SVG charts remained unsupported.
- Native page showed four distinct patterned bars with exact labels March: 30, April: 55, May: 40, June: 65.
- Native accessibility tree exposed a verified-source table with Category/Value/Unit headers and all four rows, units exactly as the SVG metadata (units).
- Closed popup with Escape; chart and companion remained. Reopened popup; chart control remained On and status showed this page's current preferences.
- Restore returned original red/green bars, removed labels/companion from the rendered page and accessibility tree, reset chart control Off and confirmed original page restored/speech stopped.
- Unsupported canvas remained present; no companion values appeared for it. This is a visual/accessibility-tree smoke check, not byte-for-byte DOM verification.

Corrected a fixture copy inconsistency: SVG metadata/table use units, but its static caption said sessions. Caption now agrees with declared source unit; extension behavior was correct. The corrected caption was observed after the demo refreshed.

## Sensory and form smoke test: PASS

- Navigated through the page's Sensory & forms link and opened the installed full side panel from the popup.
- Confirmed updated Hide marked distractions control exists in this installed build. Enabled Reduce motion, Focus reading region and Hide marked distractions.
- Article gained a visible outline; marked animated banner disappeared and panel reported one item hidden. Form, navigation, alert, code and editable note remained visible. Motion toggle was On; precise timing/computed animation verification remains harness evidence, not inferred from a still screenshot.
- Changed the demo name to Local acceptance check through the native form and clicked Submit locally. Native page displayed Form submitted locally.
- Restore returned the banner, removed article outline and reset the three controls Off. The edited name and submission message survived Restore.

## Native speech control smoke test: PASS for state/transport only

- Selected a full noneditable demo paragraph in the native page, then clicked Read selection in the installed side panel. Selection remained visibly highlighted after moving focus; extension reported Reading your selection.
- Completion produced Speech stopped or finished. A later run at the validated minimum rate 0.7 showed Speech paused after Pause / resume, then Reading your selection after resuming. Stop returned the stopped/finished status.
- On another run, the panel reported active reading; clicked neutral article space to focus the native page and pressed Escape. The panel changed to stopped/finished. This covers native Escape control-state cancellation, with no audio assertion.
- The test did not record audio. Audible content, voice identity, audible pause timing and volume/rate quality remain unverified unless separately confirmed by the user. Tab hide, pagehide and SPA lifecycle remain pending in native Chrome.
- Native form used only controlled demo values; no real password was entered or saved. Browser offered its normal password-save toolbar icon after the demo submission; it was not opened or acted on.

## User-confirmed audible playback: PASS (2026-11-07)

The user explicitly confirmed hearing the selected demo paragraph and that pause/resume worked. This adds human listening evidence to the native control-state checks above. It does not certify every installed voice, audible rate/volume quality, Stop/Escape timing, or hide/navigation behavior.

## Other release gates

Other voice/rate/volume combinations, audible Stop/Escape timing and hide/navigation lifecycle; native permission failures; dynamic chart contract invalidation; keyboard/screen-reader acceptance; full UI contrast/zoom; browser version and distribution licence. Automated/harness evidence remains separately recorded in TEST-MATRIX.md and BROWSER-EVIDENCE.md.

## Installed Reading spot checks on `1fb60e1` (2026-11-07)

Windows desktop Chrome, unpacked AbleVerse AI 0.1.0, verified localhost article URL. PASS: toolbar popup and native side panel opened. Starting at 100%, a typography draft left the article at its original appearance. Apply changed the live article and the panel subsequently showed 145%. Restore remained visible while scrolling through Reading and returned the article to its original appearance. A fresh 170% unapplied draft was discarded on switching to Sensory and back to Reading, which showed 100% again. The module switch was verified from the restored baseline. Discard across tabs and navigation, preservation of other active modes, and the remaining native gates are pending. Chrome version was not captured.

## Installed P0 follow-up on `1fb60e1` (2026-11-07)

- PASS (audible start only): the tester confirmed hearing the selected localhost paragraph using Browser default, rate 1 and volume 1. Chrome also indicated active tab audio. PASS (control state): the panel reported reading, paused, and stopped. An Escape attempt reached “Speech stopped or finished,” which does not distinguish cancellation from natural completion. Audible pause, resume, Stop and Escape timing and alternate voice/rate/volume cases remain open.
- PASS (visual lifecycle): with Charts active, a normal link navigation and Back returned to a chart without its companion table or enabled toggle. A controlled `history.pushState` query change with Charts active cleared the companion and showed Restore status. No audio timing or exact route cleanup delay was measured.
- PASS (tab isolation and missing grant): switching from an enhanced chart to a separately opened localhost article produced the toolbar-grant instruction and no chart adaptation on the article. Returning showed the original chart and its table still active. This covers an ungranted tab. Queued-action race, grant revocation, and restricted-page cases remain open.
- PASS (chart source changes): changing March metadata from 30 to 37 removed the old table and turned Charts off. Explicitly applying again yielded a March row of 37 units. Removing the SVG chart contract cleared the table again. The temporary fixture used buttons to perform only those DOM operations and the history transition.
- PASS (keyboard spot check): Tab traversed the panel module controls to the chart switch, with visible focus and Restore still available. Space activated Charts. The generated table exposed Category, Value and Unit column headers and category row headers in Chrome's accessibility tree. Restored the chart after the check. The full keyboard walkthrough, screen-reader announcement checks, zoom and contrast matrix remain open.

Default speech listening follow-up (2026-11-07): the tester reported that the controls worked after a prompted run of audible Pause, Resume, Stop and page Escape. The panel independently showed Reading, Paused, and Reading. Stop and Escape ended at the generic stopped-or-finished status. The tester gave an overall confirmation without separate cancellation timings. Alternate voice, rate, and volume checks remain open.

Alternate speech settings (2026-11-07): PASS for Microsoft Zira (en-US device voice) on the localhost article at rate 0.8 and volume 0.5, then rate 1.5 and volume 1. The panel reported reading with the selected settings in both runs. The tester confirmed hearing both and that the second sounded faster and louder. Browser default voice was restored afterward. These runs varied rate and volume together. Endpoint coverage and separate cancellation timings remain open.

Speech lifecycle follow-up (2026-11-07): PASS for audible cancellation on tab switch. The panel showed active speech immediately before switching to a second localhost tab, and the tester heard the paragraph cut off. Returning to the original tab showed idle speech. In a separate run, speech was active before navigation from the article to Charts, and the panel was idle on the destination and after Back. Audible cancellation on navigation remains unconfirmed. No cancellation delay was measured.

Normal navigation listening retest (2026-11-07): PASS. The installed panel showed active speech on the localhost article at browser-default voice, rate 1 and volume 1. The tester confirmed hearing speech cut off mid-paragraph when navigating to the Charts fixture in the same tab. The destination panel showed its idle prompt. Cancellation latency was not measured. Audible cancellation on a history-only route change remains open.

History-only navigation listening check (2026-11-07): PASS by tester report. On the local speech route fixture, the tester heard playback cut off after clicking a button that called history.pushState and changed the query string without reloading. Browser control timed out before the listening run, so this result relies on the tester's observation. Cancellation latency was not measured.

Permission and tab ownership retest (2026-11-07): PASS in two targeted automated UI tests. With mocked Chrome APIs, the tests verified control rollback on denied access and that a queued page change stayed bound to the tab selected at click time. The Chrome window could be listed, but browser inspection timed out on both the existing and refreshed window handles. Native restricted-page, grant revocation, and queued-action race checks remain pending. Earlier native testing already verified the missing-grant message and isolation after an ordinary tab switch.

Reading Apply follow-up (2026-11-07): the tester confirmed that clicking Apply typography preview changed the article. The installed side panel was visible on the local article. Three focused automated UI checks passed for preview and Apply, denied permission, and queued tab ownership. The tester's Apply confirmation did not establish whether a tab switch occurred while Apply was pending.

Installed access and tab isolation follow-up (2026-11-07): PASS for the ungranted localhost tab. The side panel showed the toolbar grant instruction, with Adjust page text disabled and off. After granting AbleVerse access to both local article tabs, applied a 90% draft on the source tab and immediately pressed Ctrl+Tab. The destination stayed at 100%, with Reading off and original appearance. Returning to the source showed 90% and Reading on. Restored the source's original 150%. This checks a rapid native switch. The tools did not establish whether the Apply was still queued at the instant of switching. Actual grant revocation and restricted-page handling remain open. The deterministic queued-action and permission-denial cases passed in mocked UI tests.

Local verification follow-up (2026-11-07): all 48 Vitest and 3 packaging checks passed. The production package rebuilt through a temporary drive mapping and reproduced the verified 11-file ZIP and SHA-256 b3a31e54d6d96002e105450270479066b4e0b279035702dbc8c20e95b194ae0c.

Installed Chrome: switching away with typography preview open and returning closed the preview, and the applied source size remained 150%. The browser snapshot did not establish the draft's changed value before the switch. Reflow issue observed: at the existing narrow desktop article width with the side panel open, 150% Verdana with 0.09em letter spacing and 0.21em word spacing produced horizontal scrolling and a clipped heading at the leftmost position. Browser zoom and exact article viewport width were not captured. Full reflow, contrast and screen-reader checks remain open.
