# Validation record — 2026-11-07

## Current implementation checkpoint — 7 November 2026

Upstream PR #8 is merged at `6d30201`. New runtime work is on `feat/reading-tools-and-chart-adapters` in `KrishChadha001/extensionpwd`, tested runtime `84035f8e78df1b5ad15c30865e759565583ee863`; documentation follows it. See [the current handoff](CONTRIBUTOR-HANDOFF.md), [feature status](FEATURE-STATUS.md) and [continuation prompt](CONTINUATION-PROMPT.md). Older checkpoints below are historical.

103 Vitest + 4 packaging checks PASS; production typecheck/build and 19-file package PASS. SHA-256 `39b3c70e9ab384ab43bc929dd00973cb30db8ce43ed61ab16633946f7d801e8f`. Current engine harness 20/20 PASS; final five-module/320-360-400px preview fit matrix 15/15 PASS, plus expanded hover/AI-unavailable/sign-miss states at 320px without horizontal overflow. Preview is not installed evidence.

Reading width/spacing/alignment/fonts/ruler, hover speech, profiles, line/pie adapters, chart options/summaries and keyboard actions are implemented and regression tested. Optional local AI client/adapter and guarded text replacement are implemented with fake-model tests; no real model was run. ASL loader/UI is implemented but approved clips are absent; no playable sign dictionary or hover card is claimed. Native Chrome remains BLOCKED by current-URL verification; new listening/screen-reader/zoom/contrast/permissions acceptance remains NOT RUN. Do not promote historical passes to this build.

The latest user request authorizes committing this implementation and contributor documentation and opening a PR, not merging or publishing. Main must not be force-pushed. First next task is installed reflow on this build with recorded viewport/zoom, then the remaining cases in FEATURE-STATUS.md. Vite was started at 127.0.0.1:5173; the optional AI adapter/model was not started.


## Current continuation on merged PR #7

Source/build: `6d227bc3f52e8387f44c0849f5850c5bc4b045b4`. Windows NT 10.0.26300.0, Node 24.16.0 / npm 11.13.0. `npm ci` passed with zero vulnerabilities reported; `npm run package` passed production typecheck/build and verified 11 ZIP files. SHA-256: `0238a53ea0bac1213fa9e28979ca395cc49f8d2ea20be867c3e5ef5c318dd9df`. Existing automated/browser PASS evidence remains historical; those suites were not rerun.

Installed reflow P0-RF is BLOCKED: supported Computer Use could locate Chrome but stopped before browser inspection because current-URL verification failed. No installed build/profile/version, viewport or zoom was established, and no bypass was attempted. P0-RD/AC/DY/SP/AX/RL remain NOT RUN in this continuation. See [the current installed record](INSTALLED-ACCEPTANCE.md#current-continuation-installed-verification-blocked-2026-11-07) for individual steps, outcomes and limitations. No new native/audio/screen-reader acceptance or release sign-off is claimed.

Automated checks run real settings/engine/chart/content-handler code in jsdom. Chrome transport and device voice are boundary fakes; they do not prove installation or audible playback.

| Area | Evidence | Status |
|---|---|---|
| Invalid/null saved values | Clamp/allowlist tests | PASS |
| Prose vs forms/code/alerts/editables | DOM tests | PASS |
| Original text size hierarchy | Computed 36/18px at 100%, 54/27px at 150%, restore | PASS |
| Nested prose | No compound typography scaling test | PASS |
| Apply/restore twice, fresh site text | Exact DOM restoration tests | PASS |
| Chart values and distinct textures | Table and SVG tests | PASS |
| Malformed chart values | Atomic rejection tests | PASS |
| Unsupported canvas | No invented values/table | PASS |
| Effective page settings/restore | Content-router tests | PASS |
| Prose/empty/editable-overlap speech selection | API-boundary tests | PASS |
| Cancelled utterance callbacks | Old onend cannot disable Stop on newer speech | PASS |
| Voice/volume and voice errors | Selection, missing saved voice, async error, pause/resume | PASS (API boundary) |
| Denied permissions | React controls roll back to effective state | PASS |
| Unsupported page state | React actions disabled before injection | PASS |
| Queued changes and stale replies | Click-time tab binding and generation checks | PASS |
| Saved preference load | No page application until explicit action | PASS |
| Production build | TypeScript + MV3 bundles | PASS |
| All dependencies | npm audit --audit-level=high after Vitest 5.1.0 update | 0 vulnerabilities at checkpoint |
| Speech-only SPA navigation | Route + DOM mutation cancellation test | PASS (API boundary) |
| Dynamic chart source values | Invalidation removes stale companion test | PASS |
| Grouped/transformed SVG bars | Unsupported without mutation test | PASS |
| UI visual review | In-app preview; Reading at 320px | PASS (preview only) |
| Narrow Reading/Charts/Settings | DOM scrollWidth <= 320 at 320px; Sensory inspected | PASS (preview only) |
| Fresh unpacked Chrome load, popup, side panel/activeTab | Installed in cyan profile; localhost article; popup -> panel | PASS (smoke) |
| Installed Reading and Restore | Native Chrome visual inspection; heading-size defect fixed, reloaded and rechecked | PASS (smoke) |
| Current installed chart, popup reopen and Restore | Four exact patterned bars and table rows; reopened On; original fills/table removal after Restore | PASS (native smoke) |
| Current installed sensory/form | Marked hiding/focus; form edit and local submit; Restore preserves edits/result | PASS (native smoke) |
| Current installed selected-text speech controls | Selection survives focus; Reading/paused/resumed/stopped state observed; no audio recording | PASS (transport/state only) |
| Audible selected paragraph and pause/resume | User explicitly confirmed hearing paragraph and working pause/resume, 2026-11-07 | PASS (user-confirmed on this device) |
| Restore acknowledgement | Internal state notification no longer replaces explicit confirmation | PASS |
| Keyboard controls | React user-event Tab/Space/Enter activation/restore | PASS (DOM; native walkthrough pending) |
| Semantic accessibility | axe wcag2a/wcag2aa/wcag21aa across five modules, contrast excluded | PASS (automated; screen reader pending) |
| Real browser page-engine suite | `/demo/validation.html`, 17/17 checks in in-app browser | PASS (engine, not installed extension) |
| Motion, status exclusions and restored animation | Actual browser computed animation names | PASS (engine harness) |
| Prose palette contrast | Actual computed warm/dark/contrast RGB pairs >=4.5:1 | PASS (engine harness; full UI contrast pending) |
| Rendered charts/forms/restore | Exact table data, patterns over inline fill, editable form submission, newer website changes | PASS (engine harness; native extension pending) |
| Remaining voice combinations, audible Stop/Escape and hide/navigation | Paragraph and pause/resume user-confirmed; remaining cases not completed | PARTIAL |
| Native keyboard-only and screen reader | Not run fully; preview width matrix is separate evidence | PENDING |
| Installed article/chart/form layouts | Article earlier; chart and form now smoke checked; complete lifecycle acceptance still open | PARTIAL |
| SPA and changed chart nodes | Needs installed coverage | PENDING |
| AI/ASL/hover/line/pie | Deferred P1 | NOT IN CORE |

Release gates remain open. Record actual browser version/results/defects and evidence; do not infer manual PASS from unit tests.

At the earlier checkpoint, 44 core/UI tests plus 3 package checks passed. The latest 48-test baseline is recorded below. After the earlier interrupted attempt, installation succeeded on the next turn in the existing cyan profile. Native popup/full-panel, activeTab, Reading and Restore smoke tests passed. A heading-size defect was reproduced, fixed, reloaded and rechecked. Further browser input stopped when URL verification failed during chart navigation; later chart/form and user-confirmed paragraph audio results are recorded in INSTALLED-ACCEPTANCE.md; remaining lifecycle gates are still open.

Navigation and chart hardening: history-only URL changes cancel active speech within the 500ms active-session check; unrelated chart updates leave Reading enabled when Chroma is off; inline CSS fills no longer suppress chart patterns, and original inline styles are restored. All three have automated regression coverage; native checks remain pending.

Current additional checks: all 15 module/width combinations at 320/360/400px fit without horizontal overflow or clipped controls (browser preview). Disabling the final mode or finishing speech-only playback releases active observation/polling; playback completion updates its status. Explicit marked distraction hiding protects native/custom controls and keyboard targets. Packaging verifies an allowlist, rejects missing/escaping paths, omits secret/unrelated leftovers and checks ZIP byte integrity. See BROWSER-EVIDENCE.md.

Final review regressions: removing or changing an SVG chart contract removes stale companions; a deferred quiet state refresh cannot overwrite a newer Apply action. Both reproduced failures now pass. Later native smoke coverage is recorded in INSTALLED-ACCEPTANCE.md; full acceptance remains open.

## Fresh follow-up verification — 2026-11-07

On Windows, Node 24.21.0 / npm 11.19.0: npm ci succeeded (0 vulnerabilities reported), npm test passed 44 Vitest + 3 package checks, npm run package passed typechecking/build and verified 11 files. Documentation-only follow-up; no new browser or audible acceptance. See NEXT-CONTRIBUTOR.md for remaining native cases.

## Implementation follow-up - 2026-11-07

- 48 Vitest tests + 3 packaging checks PASS; production build/11-file package PASS.
- New regressions: preview makes no Apply until explicit action, preserves other modes, clears on tab change/Restore; custom widgets, focus targets, dialog/form prose protected; h4-h6 preserve relative sizes.
- Expanded browser-engine harness 19/19 PASS (adds custom-control protection and h4 scaling).
- Preview layout 15/15 module/width combinations at 320/360/400px: no horizontal overflow/clipped controls. Reading preview changed to 150%; sticky Restore remained at top (0px) with keyboard focus near speech controls after 1054px scroll.
- No new installed Chrome, audible or screen-reader acceptance. Native tests must use the updated build.

## Contributor verification on `1fb60e1` (2026-11-07)

- PASS (Windows, Node 24.20.0, npm 11.19.0): `npm ci` with a workspace-local npm cache, `npm test` (48 Vitest and 3 packaging checks), `tsc --noEmit`, and `npm audit --audit-level=high` (zero vulnerabilities reported).
- PASS (in-app browser engine): `/demo/validation.html` reported 19/19 after clicking **Run browser checks**. Vite was started locally with dependency discovery disabled for this run.
- BLOCKED (production bundle and ZIP): `npm run package` reached esbuild after typechecking. esbuild reported access denied when enumerating an ancestor directory and then failed to resolve the existing UI entry point. A separate filesystem check identified the Windows profile root as inaccessible for directory enumeration. The default `npm run demo` encountered the same failure during dependency discovery.
- BLOCKED (installed Chrome acceptance): this run produced no complete loadable extension. Reading preview and Restore, audible speech, lifecycle, access, dynamic charts, keyboard and screen reader, zoom, contrast and installed icon checks remain open. The browser engine results are separate evidence.

### Packaging follow-up

- PASS: mapped this checkout temporarily to `Z:` and ran unmodified `npm run package`. Typecheck and production bundling succeeded, and the packager verified the 11-file ZIP. Independently checked SHA-256: `b3a31e54d6d96002e105450270479066b4e0b279035702dbc8c20e95b194ae0c`. Removed the temporary drive mapping.
- BLOCKED: Windows denied launching Chrome with an isolated test profile. Installed Reading preview and sticky Restore remain unverified. The local demo fixture can run with Vite dependency discovery disabled.

Installed Reading follow-up: the popup and side panel opened on the local article. Preview before Apply, explicit Apply, sticky Restore and discard on switching modules passed. See INSTALLED-ACCEPTANCE.md for the exact scope and remaining cases.

Installed P0 follow-up: default selected-text audio was confirmed by the listener. Native chart source invalidation, normal and history-only navigation cleanup, ungranted-tab isolation, and a keyboard Charts spot check passed. See INSTALLED-ACCEPTANCE.md for limits and remaining cases.

Audible speech cancellation passed on tab switch, normal navigation, and history-only navigation. See INSTALLED-ACCEPTANCE.md for the evidence and timing limits.

Reading reflow follow-up (2026-11-07): eligible prose now breaks an overlong word when needed while Reading is on. Restore removes the rule. The regression failed before the fix and the full suite then passed 49 Vitest and 3 packaging checks. The browser engine harness passed 20/20, including a 240px column with 150% Verdana and 0.09em letter and 0.21em word spacing. The rebuilt package verified 11 files. Retest the installed build and complete the zoom and screen-reader checks.
