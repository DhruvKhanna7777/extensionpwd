# Validation record â€” 2026-11-07

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

44 core/UI tests plus 3 package checks currently pass. After the earlier interrupted attempt, installation succeeded on the next turn in the existing cyan profile. Native popup/full-panel, activeTab, Reading and Restore smoke tests passed. A heading-size defect was reproduced, fixed, reloaded and rechecked. Further browser input stopped when URL verification failed during chart navigation; later chart/form and user-confirmed paragraph audio results are recorded in INSTALLED-ACCEPTANCE.md; remaining lifecycle gates are still open.

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
