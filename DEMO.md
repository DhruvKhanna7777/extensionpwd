# Reproducible core demo

Build/load using README.md. Start `npm run demo`; use http rather than file URLs.

1. `/demo/article.html`: open popup/full panel, enable Reading, Georgia, 120% size, 1.8 line height. Inspect changes and preserved links.
2. Select a paragraph before opening controls. Read aloud, Pause/resume, Stop. Verify Escape on the page stops speech. No hovering audio. Missing voices must give an error.
3. `/demo/sensory.html`: Reduce motion, Focus and emphasis. Banner stops, article gets an outline. Tab to form, edit name, submit locally. Inputs, editable note, warning and code remain untouched.
4. `/demo/charts.html`: enable charts. Match labels/table against March 30, April 55, May 40, June 65 units. Verify canvas fallback without invented data.
5. Save preferences, Load saved, Apply saved/current. Loading alone must not change a page. Reopen popup and verify effective state.
6. Restore twice on each fixture. No owned stylesheet/attributes/pattern group/table; original fills/content/forms remain.

Do not present the Vite interface preview as a functioning extension. Do not claim AI, ASL, hover speech, universal charts or full release acceptance. Record installed-extension results in docs/TEST-MATRIX.md.

## Repeatable browser-engine validation

Open `/demo/validation.html` and select **Run browser checks**. The page imports the actual page engine and visibly reports 16 checks covering rendered heading size, protected fields/code/warnings, motion/status exclusions, focus/controls, exact SVG labels/table, inline fill, canvas fallback, repeat application, restore, local form submission, newer site edits and palette contrast. This harness is explicitly labelled as separate from installed-extension transport and speech tests. It contains controlled demo-only values and makes no server requests.
