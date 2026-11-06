# Validation record — 2026-11-07

Automated checks run real settings/engine/chart/content-handler code in jsdom. Chrome transport and device voice are boundary fakes; they do not prove installation or audible playback.

| Area | Evidence | Status |
|---|---|---|
| Invalid/null saved values | Clamp/allowlist tests | PASS |
| Prose vs forms/code/alerts/editables | DOM tests | PASS |
| Nested prose | No compound typography scaling test | PASS |
| Apply/restore twice, fresh site text | Exact DOM restoration tests | PASS |
| Chart values and distinct textures | Table and SVG tests | PASS |
| Malformed chart values | Atomic rejection tests | PASS |
| Unsupported canvas | No invented values/table | PASS |
| Effective page settings/restore | Content-router tests | PASS |
| Prose/empty/editable-overlap speech selection | API-boundary tests | PASS |
| Production build | TypeScript + MV3 bundles | PASS |
| Production dependencies | npm audit --omit=dev | 0 vulnerabilities at checkpoint |
| UI visual review | In-app preview; Reading at 320px | PASS (preview only) |
| Narrow Reading/Charts/Settings | DOM scrollWidth <= 320 at 320px; Sensory inspected | PASS (preview only) |
| Fresh Chrome load, popup, side panel/activeTab | Not run | PENDING |
| Real voice/pause/stop/hide/navigation | Not run installed | PENDING |
| Keyboard-only, screen reader, 360/400px | Not run fully | PENDING |
| Installed behavior on two layouts plus form | Fixtures supplied; runtime checks not run | PENDING |
| SPA and changed chart nodes | Needs installed coverage | PENDING |
| AI/ASL/hover/line/pie | Deferred P1 | NOT IN CORE |

Release gates remain open. Record actual browser version/results/defects and evidence; do not infer manual PASS from unit tests.
