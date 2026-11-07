# Installed Chrome acceptance — 2026-11-07

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
