# Browser evidence — 2026-11-07

## Expanded current engine harness: 35/35 PASS

In the in-app browser, clicked Run browser checks at `/demo/validation.html` on the continuation based on merged main 73b98ef. All 35 displayed checks passed. Fifteen new checks cover exact line/pie rows, differentiated rendered dashes/markers/patterns, malformed percentage rejection, repeated Apply, disabled visual encodings with retained tables, exact double Restore, width/27px paragraph spacing/left alignment, pointer-transparent ruler movement/Escape and actual loading of Lexend/Atkinson Hyperlegible/OpenDyslexic from local assets. The final check restores original markup and removes owned guides.

Separately exercised all four mutation buttons at `/demo/advanced.html`: line February value became 27, pie contract became absent, a new prose paragraph appeared, and history query changed to demo-route=1 without reload. These establish that the controlled fixture works; installed companion invalidation and audible cancellation remain separate tests, not inferred passes.

Measured actual preview Stop button border against its white background: 2.1138:1 before the change and 4.1369:1 after. Unselected font chips share the corrected border colour. No new full UI contrast, zoom, native transport, listening, model inference or screen-reader certification is claimed. See FRONTEND-REFERENCE.md.

## Method

The in-app browser loaded the Vite-served `/demo/validation.html` and the tester clicked **Run browser checks** through browser UI. The harness imports the actual `PageEngine`, not a mock. All 17 displayed checks returned PASS. This evidence covers browser rendering and DOM behavior only; native Chrome extension permission/transport and actual audio remain separate pending gates.

## Passed checks

1. Only explicitly marked noninteractive distraction hidden; form visible.
2. CSS motion disabled while essential status animation remains.
3. Focus and control outlines visible. Accounted for one device pixel of outline rounding at current display scaling (computed 2.4px/1.6px for authored 3px/2px).
4. Heading 54px and paragraph 27px after 150% scale from 36px/18px originals.
5. Input values and protected input/code font sizes preserved.
6. Alerts and editable content excluded from prose changes.
7. Exact source table: March 30 units; April 55 units.
8. SVG patterns take precedence over existing inline fill.
9. Canvas data unavailable: unsupported result, no fabricated measurements.
10. Repeated Apply creates one companion table.
11. Restore re-enables original animation.
12. Double Restore reproduces original fixture markup before simulated site edits.
13. Adapted form accepts edits and submits locally.
14. Restore preserves subsequent website text, fill and unrelated opacity changes.
15. Warm prose computed colours meet 4.5:1 contrast.
16. Dark prose computed colours meet 4.5:1 contrast.
17. High-contrast prose computed colours meet 4.5:1 contrast.

## Panel layout matrix

The current React interface preview was checked in the browser at each viewport below. All five module buttons were used. DOM measurements found zero horizontally clipped buttons, inputs or selects, and document scrollWidth never exceeded viewport width.

| Viewport | Overview | Reading | Sensory | Charts | Settings |
|---|---|---|---|---|---|
| 320px | PASS | PASS | PASS | PASS | PASS |
| 360px | PASS | PASS | PASS | PASS | PASS |
| 400px | PASS | PASS | PASS | PASS | PASS |

Reading was visually inspected at 320px and Settings at 400px. Vertical scrolling is intentional; this matrix does not claim all text, states, or screen-reader interactions were manually certified. Viewport override was reset afterwards.

## Remaining native gates

Installed Chrome has earlier installation/popup/panel/Reading/Restore smoke evidence. Later native chart/form smoke checks and user-confirmed paragraph audio/pause/resume are recorded in INSTALLED-ACCEPTANCE.md. Other voice combinations, audible cancellation, native lifecycle, screen-reader walkthrough and full UI acceptance remain open. No browser-engine or preview result is substituted for those gates.

## Implementation follow-up - 2026-11-07

Reran the real engine in the in-app browser: 19/19 PASS, adding custom-control exclusion and 20px h4 -> 30px scaling. Reran five-module layout matrix at 320/360/400px: 15/15 with no horizontal overflow or clipped controls. Observed local typography preview at 150%, Reading colour selector, and sticky Restore at top 0px after keyboard focus moved to Pause/resume near the bottom. Temporary viewport override reset afterwards. This is browser-engine/interface evidence, not installed Chrome or audible evidence.
