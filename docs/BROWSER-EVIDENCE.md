# Browser evidence — 2026-11-07

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

Installed Chrome has earlier installation/popup/panel/Reading/Restore smoke evidence. Current native chart/form/audio, screen-reader walkthrough, actual voice lifecycle, and updated installed build still need verification. No browser-engine or preview result is substituted for those gates.
