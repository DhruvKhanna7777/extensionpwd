# Validation record — 2026-11-07

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
| Restore acknowledgement | Internal state notification no longer replaces explicit confirmation | PASS |
| Keyboard controls | React user-event Tab/Space/Enter activation/restore | PASS (DOM; native walkthrough pending) |
| Semantic accessibility | axe wcag2a/wcag2aa/wcag21aa across five modules, contrast excluded | PASS (automated; screen reader pending) |
| Real browser page-engine suite | `/demo/validation.html`, 16/16 checks in in-app browser | PASS (engine, not installed extension) |
| Motion, status exclusions and restored animation | Actual browser computed animation names | PASS (engine harness) |
| Prose palette contrast | Actual computed warm/dark/contrast RGB pairs >=4.5:1 | PASS (engine harness; full UI contrast pending) |
| Rendered charts/forms/restore | Exact table data, patterns over inline fill, editable form submission, newer website changes | PASS (engine harness; native extension pending) |
| Real voice/pause/stop/hide/navigation | Not run installed | PENDING |
| Keyboard-only, screen reader, 360/400px | Not run fully | PENDING |
| Installed behavior on two layouts plus form | Fixtures supplied; runtime checks not run | PENDING |
| SPA and changed chart nodes | Needs installed coverage | PENDING |
| AI/ASL/hover/line/pie | Deferred P1 | NOT IN CORE |

Release gates remain open. Record actual browser version/results/defects and evidence; do not infer manual PASS from unit tests.

37 automated tests currently pass. After the earlier interrupted attempt, installation succeeded on the next turn in the existing cyan profile. Native popup/full-panel, activeTab, Reading and Restore smoke tests passed. A heading-size defect was reproduced, fixed, reloaded and rechecked. Further browser input stopped when URL verification failed during chart navigation; native chart/form/audio results remain pending.

Navigation and chart hardening: history-only URL changes cancel active speech within the 500ms active-session check; unrelated chart updates leave Reading enabled when Chroma is off; inline CSS fills no longer suppress chart patterns, and original inline styles are restored. All three have automated regression coverage; native checks remain pending.
