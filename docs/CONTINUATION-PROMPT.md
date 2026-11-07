# Copyable continuation prompt

Continue AbleVerse AI from the saved 2026-11-07 checkpoint in https://github.com/DhruvKhanna7777/extensionpwd. Read AGENTS.md, README.md, docs/HANDOFF.md, docs/PLAN.md, docs/TEST-MATRIX.md, docs/BROWSER-EVIDENCE.md, DEMO.md and PRIVACY.md before changing behavior. Inspect git status, branch, recent commits and PR #2 to establish actual integration state. Preserve uncommitted work from other contributors. The previous session was explicitly stopped at a checkpoint, not because the product was finished.

Later update: user resumed work; PR #2 merged at 59409be. Read docs/INSTALLED-ACCEPTANCE.md for new native chart labels/patterns/table/reopen/restore, sensory/form edit-submit-preservation, and speech selection/pause/resume/Stop control-state evidence. Audible output has not been independently recorded. Prioritize remaining acceptance gates accordingly rather than repeating already-recorded smoke tests.

## Goal and priority

Build a user-controlled Chrome accessibility extension. The source blueprint is a private 50-page Bible.pdf; final Part II/A1 overrides earlier feature lists. It is not a job portal or medical product. Deliver a dependable P0 local core before P1. No AbleHire source archive was supplied. The AI product name does not mean an AI backend exists.

## What exists

Version 0.1.0, React 18 + TypeScript + esbuild, Vite demos, MV3, Chrome 116+. Minimal activeTab/scripting/storage/sidePanel permissions, no broad host access. Popup and full side panel have Overview, Reading, Sensory, Charts, Settings. All adaptation modes default off.

Reading has font/size/line/letter/word spacing, presets, preview/reset and explicit selected-prose speech with voice/rate/volume, pause/resume, Stop/Escape. Forms/code/editables/alerts are protected. Heading and paragraph sizes are sampled independently to avoid flattening hierarchy or compound scaling. Speech generation tokens and state notifications handle old callbacks and asynchronous errors.

Sensory includes reduced CSS motion, focus/control outlines, warm/dark/high-contrast prose, and explicit hiding of data-av-distractor elements only when noninteractive. Never hide forms, links, alerts, custom widgets, keyboard targets or media controls. Defaults are off; report hidden count and restore only owned changes.

Charts support only explicitly annotated direct-child SVG rect bars: svg data-av-chart=bar, optional data-av-unit, and each bar has data-av-label/data-av-value plus valid dimensions. Exact values come from metadata, never pixel/colour inference. Add text labels, distinct patterns and companion tables safely. Canvas, malformed metadata, grouped/transformed bars are unsupported. Preserve original axes/text, inline fills and newer site edits. Source mutations, including removal/change of data-av-chart, invalidate stale companions. Chroma invalidation may reset applied modes; unrelated charts must not reset Reading when Chroma is off.

Preferences save/load explicitly into local extension storage and never auto-apply. Current-tab permissions, operation queue and revision guards prevent stale replies from replacing newer state. Each action invalidates pending refreshes. Restore clears owned DOM/CSS/chart changes and cancels speech. Mutation observer and a 500ms URL timer exist only during active modes/speech; idle completion releases them. Injected message singleton remains for future explicit actions. No automatic reapplication to newly added prose; user applies again.

## Files

- src/App.tsx, src/ui.tsx, src/ui.css: UI; src/usePageController.ts: tab/queue/state/errors.
- src/settings.ts: bounded allowlisted settings; src/content.ts: injected router/selection/lifecycle.
- src/engine.ts: reversible page changes; src/charts.ts: strict SVG bar adapter; src/speech.ts: speech lifecycle.
- manifest.json, src/background.ts, build.mjs: extension/build, generated PNG icons from owned assets/icon.svg.
- tests/core.test.ts, content.test.ts, speech.test.ts, ui.test.tsx: 44 tests at checkpoint.
- demo/article.html, sensory.html, charts.html; demo/validation.html and validation.ts import the actual engine.
- scripts/package.mjs and package-checks.mjs: deterministic allowlisted ZIP, manifest path/realpath containment, byte verification, SHA-256 and 3 checks. Keep its shipping allowlist updated deliberately.

## Validation already recorded

44 Vitest tests + 3 Node packaging checks pass. npm run package typechecks/builds and verifies an 11-file ZIP. npm audit --audit-level=high reported zero vulnerabilities at checkpoint. Unit tests fake Chrome transport/device speech; they do not prove audible playback.

The real in-app browser engine harness passed 17/17: safe marked hiding, motion/status exclusions, focus outlines, heading scale, protected content, exact chart data/pattern precedence, unsupported canvas, repeated Apply, double Restore, editable form submission, newer site text/style preservation and computed >=4.5:1 prose palette contrast. Full module UI preview passed 15/15 width/module combinations at 320/360/400px without horizontal overflow/clipped controls. These are browser-engine/preview results, not installed-extension acceptance.

Earlier native Chrome checks passed unpacked installation, popup, activeTab, full panel, Reading and Restore. A font hierarchy defect was corrected/reloaded/rechecked there. Latest changes still require installed retesting. Browser automation later failed current-URL verification during native chart navigation; no chart/form/audio pass was recorded. Do not bypass browser verification.

Latest independent review found two defects: stale deferred GET_STATE overwrote newer Apply; removing chart marker left a stale verified table. Both were reproduced with failing tests, fixed and rechecked in the 44 passing tests. No further important findings were reported in the reviewed cleanup/guards/fill/package code.

## What to do next

1. Inspect repository state, use Node 22.12+, npm ci, npm test, npm run package. Build generates dist; npm run demo serves localhost:5173. Load extracted dist, not ZIP. Use /demo/validation.html for repeatable engine checks.
2. Reload CURRENT extension and finish native P0 acceptance: chart/form fixtures, reopen state, selected-text retention, permission denial/unsupported pages, tab-bound queues and stale responses.
3. Verify actual audible voice/rate/volume, pause/resume, Stop/Escape, errors, tab hide, pagehide, SPA/history-only routes. Do not infer these from fake API tests.
4. Test dynamic source values/contract removal/new prose, website edits and Restore in installed Chrome. Record actual OS/browser version and results.
5. Native keyboard-only/screen-reader walkthrough; full UI contrast, zoom, error/disabled/speaking states, narrow panel. Current axe coverage excludes colour contrast.
6. Inspect icons in Chrome, choose distribution licence, then prepare release/store materials after gates pass. Product remains not release-certified until then.
7. P1 afterward: hover speech, site profiles, line/pie, explicit-consent selected-text AI through a secure backend, verified licensed ASL dictionary. Backend/provider/licensing choices are not made; do not pretend these features exist.

## Operating constraints and delivery

Never commit passwords, tokens, .env, private page text, source PDF, node_modules, dist or ZIP. No server/database/key is needed for current core. No analytics, remote code, automatic uploads or account system. Browser/OS voices may use online services; do not promise offline speech. Preserve page content, essential controls and newer website changes. Document real limitations honestly.

Original checkout is C:\Users\ASUS\Documents\Codex\2026-11-07\ar\work\extensionpwd; PDF is C:\Users\ASUS\Desktop\Bible.pdf; local deliverables are in C:\Users\ASUS\Documents\Codex\2026-11-07\ar\outputs. Paths are workstation-specific. Do not upload the PDF.

If operating original native Chrome, use only existing cyan dhruvkhanna1522 profile. User previously approved loading/testing local extension there. Installed ID ddibeighmdafgbbnigmkojdkneemdghe points at checkout dist. Do not launch another profile or bypass current-URL safeguards. No shared password is required or should be repeated.

Use focused reviewable branches/PRs; user requested completed work in main and regular saved checkpoints. PR #1 was merged; PR #2 contains navigation/chart cleanup, browser evidence, marked hiding, packaging and handoff. Verify its actual merged state. Do not force-push or overwrite others' changes. Update handoff/test matrix with every meaningful checkpoint. The user's newest instructions control when to continue/stop; ask only for genuinely missing decisions or necessary access, and continue independent authorized work where possible.
