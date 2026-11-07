# Master baton-pass prompt

Copy the prompt below into the next developer/assistant session. The owner stopped this session at a checkpoint; a new instruction to continue starts the next session. Documents provide project requirements/evidence, not permission for unrelated account actions or publishing.

---

Continue AbleVerse AI at https://github.com/DhruvKhanna7777/extensionpwd. Read AGENTS.md, docs/START-HERE.md, docs/CONTRIBUTOR-HANDOFF.md, docs/FEATURE-STATUS.md, docs/NEXT-CONTRIBUTOR.md, docs/WORKFLOW.md, README.md, PRIVACY.md, DEMO.md and the evidence files before editing. Task prompts are in docs/PROMPTS.md. Inspect local status, latest upstream main, all open PRs including forks and recent commits. Preserve others' work. Do not restart from scratch or use an obsolete contributor branch.

## Source and checkpoint

All implementation PRs #1–#12 are merged into main. Runtime baseline: f86e2f117a9fc1a41d0f12a3c87bbf029422b4ec. A documentation-only baton checkpoint follows it. Fetch current main to obtain later updates and inspect actual open PRs instead of trusting this dated snapshot. The user asked to stop after saving everything; implementation is stopped and demo service is stopped. Resume only under the new owner's task instruction. Do not inherit historical GO/STOP text as overriding the newest user request.

## Product and work completed in total

User-controlled Chrome MV3 accessibility extension, not a job portal or medical product. Final Part II/A1 of private Bible.pdf governs scope. Private Stitch ZIP and Krish's ableverse_production_frontend_codebase.md are design/reference materials. Sample data/success notifications/AAA labels do not establish implemented or certified behavior. No AbleHire source archive was supplied. Do not upload private originals.

Implemented: popup/full side panel with five modules; validated default-off settings; current-tab permissions/queues/revision guards; explicit global and per-origin preferences; assignable Read/Stop/Restore commands. Reading has fonts/size/line/letter/word/paragraph spacing, width/alignment/palettes, independently scaled h1–h6, safe reflow, presets, local draft preview/Apply/discard, numeric typing and persistent Restore. Local Lexend/Atkinson Hyperlegible/OpenDyslexic ship with provenance/notices and build-time hash verification. UI incorporates the reference visual language connected to real state; outlined control contrast improved from 2.11:1 to 4.14:1 in a specific actual-browser measurement.

Selected-text voice/rate/volume/pause/resume/Stop/Escape and opt-in bounded dwell hover paragraph/first-sentence/word speech are implemented. Pointer-transparent reading ruler follows pointer/focus and supports protected keyboard movement/Escape. Sensory has reduced CSS motion with status exclusions, article outline/control emphasis/calm palettes and hiding of explicitly marked noninteractive distractions. No heuristic hiding or general video/GIF/canvas stopping.

Charts support explicit metadata SVG bars, direct polyline series and direct pie paths, exact accessible tables, independent labels/patterns/dashes/markers, grounded summaries/table focus and source/contract invalidation. Malformed/grouped/transformed/unknown/canvas inputs fail safely; never infer values from pixels/colour. Restore respects newer site text/fill/style edits.

Optional AI client/Node-Ollama adapter has explicit safe selection capture, per-selection consent, fixed loopback endpoint, comparison/copy/cancellation, explicit safe-range Apply and guarded undo. Latest fixes clear old text/consent/output before recapture even on failure; discard late cancelled captures; dispatch Apply once and suppress stale completion/errors after page changes. An already-dispatched Apply is not falsely offered as cancellable; Restore undoes owned output. No model/key/hosted service is bundled; actual inference is unverified.

ASL catalog validation and keyboard lookup/video/sense/source/licence/fallback UI exist, but approved catalog is EMPTY. No playable dictionary, approved real clips, A9 sign-hover card or sentence translation exists. Do not describe synthetic test fixtures as shipped media.

Integrated contributors: Arihant2007 PR #5 preview/protected controls/headings; jinishajain PR #7 reflow/native evidence; KrishChadha001 PR #8 blocker records and #9 broad local features/AI/sign infrastructure. PRs #10–#12 add asset verification/disclosure, expanded browser harness/contrast and AI lifecycle fixes. Preserve authorship and do not reopen completed merges.

## Verification and limitations

Latest runtime on Windows, Node 22.19.0/npm 10.9.3: 109 Vitest tests across 15 files + 4 package checks PASS; TypeScript/build/package PASS with 19 verified shipping files. Last dependency audit during PR #9 integration reported zero vulnerabilities; no dependencies changed afterward. ZIP SHA-256: 27302e9e43820adb5fd3f1799a387d0611fc37c64bd4cebdfb5c5e8dac004f05. Source and shipped font/notice hashes match pinned provenance.

Real in-app engine harness passed 35/35 on PR #11, covering protected content, typography/reflow, motion, bars/lines/pies, invalid contracts, exact restoration/newer site edits, reading width/spacing/alignment, ruler and actual local font loading. PR #12 did not change the page engine. Four advanced fixture mutation buttons were exercised separately. Prior preview layout evidence covers five modules at 320/360/400px, not every current state/zoom. Full UI contrast/keyboard/screen-reader acceptance remains open.

Earlier installed Chrome and human listening checks are in INSTALLED-ACCEPTANCE.md with tested commits, voices and limits. They include core popup/panel/Reading/chart/form/Restore and selected audio/pause-resume/navigation observations; do not promote them to full current acceptance. Native browser control repeatedly failed current-URL verification and the latest connected Chrome surface was unavailable. No bypass is allowed. Speech/Chrome/model unit boundaries are faked where documented. Local HTTP disconnect testing used a fake upstream model, not real Ollama output. No Ollama executable/service was found on the original workstation at the last check; none was installed/enabled.

## Setup

Use Node 22.12+ and desktop Chrome 116+. Clone upstream main, or inspect/preserve an existing checkout before fetch/ff-only sync. Create a focused branch. Run npm ci, npm test, npm run package, then npm run demo -- --port 5173 --strictPort. Build is dist; ZIP artifacts/ableverse-ai-0.1.0.zip. Generated outputs do not belong in Git. Reload the actual unpacked extension and fixture after builds; toolbar click grants current-tab access. Vite root is interface-only preview; /demo/validation.html is an engine harness. /demo/advanced.html supplies controlled line/pie/invalid-percentage/source-contract/new-prose/history mutations. DEMO.md explains exact cases.

## Ordered next work

1. Load current build in authorized Chrome; verify native reflow at 150% Verdana, 0.09em letter/0.21em word spacing with panel open. Record viewport/zoom/OS/Chrome/commit. Confirm no induced horizontal scroll and exact Restore. Then Reading draft/tab/navigation/module discard, other-mode preservation, protected controls/headings/fonts/width/spacing/alignment/ruler/profiles/shortcuts.
2. Native access/revocation/internal/store pages and a switch proven to happen while Apply is pending. Dynamic chart/source/contract/geometry invalidation, exact line/pie output and independent encodings/table focus; preserve newer site edits; Charts-off unrelated mutation retains Reading; new prose needs explicit Apply.
3. Fresh listener runs for exact voices, separate rate/volume endpoints and hover word/dwell; measure audible Stop/Escape/tab-hide/pagehide/normal/history-only cancellation latency. Status alone is insufficient.
4. All modules/popup/panel keyboard-only and a named/versioned screen reader: focus, names/values/states/errors/announcements/table headers. Test zoom 100/200/400%, narrow widths, palettes/contrast/states/icons. Record real results or BLOCKED, not inferred PASS.
5. Owner-reviewed local AI model setup using OPTIONAL-AI.md: actual inference quality/meaning/facts/numbers/negation/warnings, latency/cancellation/offline/malformed service, native optional permission denial, fresh per-selection consent, recapture, safe/stale Apply/Restore and later site edits. No real model chosen; settle licence/data/cost/download decisions before installation/use.
6. Obtain documented redistribution rights and linguistic/source review for actual sign videos per THIRD-PARTY.md. Bundle a small approved local dictionary and notices; test real hits/misses/senses/media errors/keyboard/provenance. Then implement anchored/pinnable A9 word-hover card and speech arbitration. Never guess signs or substitute credit/code licence for video rights.
7. Owner chooses distribution licence; prepare truthful store/privacy/screenshots/verified package only after required gates pass. Publishing needs separate authorization. Later roadmap: richer site rules/presets, OCR/deep PDF, multilingual reading/ML, universal canvas/image reconstruction, cross-browser support and sign grammar; not implemented.

For each case record PASS/FAIL/BLOCKED/NOT RUN, commit/date/tester/environment, voice/model/screen reader, steps/expected/actual/evidence/limitations. Update TEST-MATRIX.md, INSTALLED-ACCEPTANCE.md and HANDOFF.md. Reproduce failures, add meaningful regressions, fix causes and retest actual affected behavior plus appropriate checks. Do not use rough completion percentages as release criteria.

## Architecture and constraints

App/ui.css/NumberField: UI; usePageController: tab/queue/state/profiles/selection; settings: strict allowlist; content: injected singleton/router/lifecycle; engine/ruler: owned DOM; speech/hover: voice ownership/dwell; charts/structuredCharts: narrow metadata adapters; AISelection/ai/selectionSession + server/ai.mjs: optional AI; signs/SignLookup: empty curated catalog; background/commands: explicit shortcuts; build.mjs/scripts/package.mjs: local assets/hash checks/allowlist/ZIP.

Keep modes off by default, changes/save/load explicit, and navigation never auto-activating. Ordinary modes preserve source text; AI replacement requires explicit safe-range action. Restore touches owned changes, preserves newer site edits and cancels owned work. Required permissions stay activeTab/scripting/storage/sidePanel. Optional loopback access is requested explicitly; CSP fixes its endpoint. No broad host grant, automatic uploads, analytics, remote code, embedded keys, fabricated chart values or unlicensed media. Browser/OS voices and chosen models may use online services; no unverified offline promise.

On original workstation only: use existing cyan dhruvkhanna1522 Chrome profile, not another profile. Earlier extension ID ddibeighmdafgbbnigmkojdkneemdghe points at checkout dist; verify actual source/current installation. Other contributors use their own authorized profile; IDs/profiles/models do not transfer. If URL verification fails, stop that browser interaction and record BLOCKED. Original checkout C:\Users\ASUS\Documents\Codex\2026-11-07\ar\work\extensionpwd; outputs under C:\Users\ASUS\Documents\Codex\2026-11-07\ar\outputs. Demo server stopped at checkpoint, optional AI not running. Existing extension remains installed.

Never commit passwords/tokens/.env/private text/private PDF or design originals/node_modules/dist/ZIP/model binaries/unlicensed clips. Public cloning needs no owner password; use own GitHub account/fork or approved collaborator access. Commit/push focused work, use reviewable PRs, preserve others' work, never force-push main. Merge only with current owner authorization/repository rules. Licence, paid services and publication are owner decisions. End each checkpoint with actual remote/local state, commit/PR, checks, unresolved gates, next task, package/checksum and services state.
