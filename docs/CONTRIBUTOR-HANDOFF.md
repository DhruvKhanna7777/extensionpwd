# AbleVerse AI contributor handoff

Checkpoint: **7 November 2026**. This document is for a new developer, tester or coding assistant. Read it with [feature status](FEATURE-STATUS.md) and [the copy-paste continuation prompt](CONTINUATION-PROMPT.md).

## Get the correct work

- Upstream: https://github.com/DhruvKhanna7777/extensionpwd
- Latest verified upstream main: `6d30201cbaeb67f3952dbabb47b49a89f08b4b6e`, which merged PR #8. PR #7's reflow fix is already included. Do not reopen or merge those changes again.
- Implementation fork: https://github.com/KrishChadha001/extensionpwd
- Implementation branch: `feat/reading-tools-and-chart-adapters`.
- Tested runtime commit: `84035f8e78df1b5ad15c30865e759565583ee863`. Documentation commits may follow it. Inspect the PR's latest head before work.
- Implementation PR: https://github.com/DhruvKhanna7777/extensionpwd/pull/9

If the implementation PR is still open, start from its branch, not upstream main, which may lack the new features. If it has merged, start from updated upstream main. Fetch and inspect status/history/open PRs; do not discard local work or duplicate someone else's contribution.

```sh
git clone --branch feat/reading-tools-and-chart-adapters --single-branch https://github.com/KrishChadha001/extensionpwd.git
cd extensionpwd
git remote add upstream https://github.com/DhruvKhanna7777/extensionpwd.git
git fetch upstream
git status
npm ci
npm test
npm run package
npm run demo -- --port 5173 --strictPort
```

Use Node 22.12+ and desktop Chrome 116+. Current authoring environment was Windows NT 10.0.26300.0, Node 24.16.0, npm 11.13.0. A GitHub password is not needed to clone the public repository. Use your own account/fork for contributions.

## Product and reference documents

AbleVerse is a user-controlled accessibility **Chrome extension**, not a job portal, medical product or ordinary website. Popup and side panel control eligible content in the explicitly authorized current tab. The Vite page at `/` is only an interface preview. It can update its own sample controls but cannot modify browser tabs or provide real extension speech/permission behavior.

The owner supplied a 50-page **Bible.pdf** and **stitch_ableverse_ai_accessibility_extension.zip**. The PDF's final Part II/A1 ledger supersedes earlier broad feature lists. The ZIP contains a Markdown frontend specification, sample components/state and vector assets; it is a visual reference, not a complete installable extension. Preserve real behavior when adapting its design. Both private originals stay outside public Git; request them privately if needed. Their old workstation paths are not portable.

The committed FEATURE-STATUS.md maps the main requirements, implemented behavior and remaining gaps. A7 covers Reading, A8 hover speech, A9 ethical verified sign lookup, A10 Sensory, A11-A12 charts, A13-A14 architecture/state, A16-A19 acceptance/evidence and A20-A22 demo/release/sign-off. The original PDF is still the detailed reference; do not infer that this summary replaces it or grants unrelated permissions.

## What was built in this contribution

- Optional reading width, paragraph spacing and natural/left alignment, with safe defaults, clamping, preview/Apply and exact owned restoration.
- Local licensed Lexend, Atkinson Hyperlegible and OpenDyslexic fonts with pinned provenance and bundled notices.
- A pointer-transparent reading ruler with pointer/focus/keyboard movement, Escape and protected-control handling.
- Opt-in hover speech with bounded dwell/scope/text, word-to-word dwell inside a paragraph, hidden/protected-content exclusion and cancellation/duplicate suppression.
- Explicit origin-scoped site profiles with save/load/reset; no automatic activation. Existing global preferences remain supported.
- Metadata-based SVG line/pie adapters, exact accessible tables, dashes/markers/patterns, independently configurable visual encodings and grounded chart summaries; explicit focus/open-table action. Malformed paths use an existing MIT parser and fail safely.
- Assignable Chrome keyboard commands for Read selection, Stop and Restore, retaining their initial tab target.
- Optional consent-based local AI integration: safe selection capture, fixed loopback adapter, comparison, cancellation, copy, explicit safe-range Apply, stale-selection checks and undo preserving later site edits. Actual model setup/inference is not completed on this workstation.
- ASL dictionary validation and keyboard lookup/video UI with sense selection, attribution and honest missing-video behavior. The approved catalog is empty; there is no shipped playable dictionary or ASL hover card.
- ZIP-inspired UI tied to actual state, persistent actions, sample preview, local fonts, interactive preview controls and a fix for typing complete numeric values.

Existing Reading/Sensory/bar/speech/source-protection behavior remains covered by regressions. No sign video, AI model, paid service, account, distribution licence or public release was selected.

## What was actually verified

`npm test` passed **103 Vitest tests and 4 packaging checks**. Production typecheck/build/package passed and verified **19 shipping files**. Current ZIP SHA-256:

```text
39b3c70e9ab384ab43bc929dd00973cb30db8ce43ed61ab16633946f7d801e8f
```

Generated ZIP: `artifacts/ableverse-ai-0.1.0.zip`; unpacked build: `dist/`. Neither belongs in Git. Packaging includes explicit font assets/notices and omits unrelated files. Runtime files were unchanged when rebased onto main after PR #8 merged.

Final browser preview passed the 15-case five-module/320-360-400px fit matrix, including later AI/sign/chart-option UI. Expanded hover, local-AI-unavailable and sign-miss states fit at 320px. The current real engine harness passed 20/20. Local OpenDyslexic loading was observed. Unit/HTTP model tests use fakes; speech tests fake the device boundary. Independent reviews found and drove regressions for hidden hover text, invalid pie geometry, ruler/custom-control shortcuts and partial-inline AI restoration.

**Not verified in this contribution:** installed Chrome transport/permissions on this new build, audible hover/voice quality or cancellation timing, real Ollama inference, real sign-video playback/linguistic review, complete screen-reader/zoom/contrast acceptance. Supported Computer Use stopped because it could not confidently verify the native Chrome URL. Do not bypass that safeguard or convert preview/mocked evidence into native PASS. Earlier native evidence belongs to the commits recorded in INSTALLED-ACCEPTANCE.md.

## Begin here: installed reflow, then the remaining gates

1. Read AGENTS.md, this handoff, FEATURE-STATUS.md, WORKFLOW.md, INSTALLED-ACCEPTANCE.md and TEST-MATRIX.md. Check current refs and PR status.
2. Build the branch. In your authorized Chrome testing profile, open `chrome://extensions`, use Developer mode/Load unpacked for `dist`, or reload only an installation known to point at this build. Refresh fixtures after rebuilding. The original owner's cyan-profile restriction applies on that original workstation; another contributor uses their own authorized profile. Never assume a profile or installed extension ID transfers with Git.
3. Open `http://127.0.0.1:5173/demo/article.html`, click the extension toolbar icon, open the full panel. Record exact source commit, OS, Chrome version, viewport width and browser zoom.
4. Retest 150% Verdana with 0.09em letter and 0.21em word spacing, panel open: heading wraps, enlarged prose adds no horizontal scrolling, Restore returns baseline. This is the first unclosed native case.
5. Continue Reading/navigation draft discard, other-mode preservation, heading/form/custom-control safety; new width/ruler/hover/profile behavior; restricted pages/revocation and confirmed pending-action tab switch; dynamic chart/text/fill and explicit reapply cases.
6. Use fresh listener runs to measure Stop/Escape/tab-hide/navigation/history-only cancellation latency. Test remaining voice/rate/volume endpoints separately. Record actual voice identity and audible outcomes.
7. Walk all modules/popup/panel by keyboard and a named/versioned screen reader. Check names, states, values, focus, status/errors and table headers; 100/200/400% zoom, narrow widths, all palettes, contrast and installed icons.

For every case record PASS, FAIL, BLOCKED or NOT RUN, source commit, date/tester, environment, exact steps, expected/actual result, evidence and limitations. Update all three evidence/handoff documents. Reproduce/fix failures with meaningful regressions, then retest the affected native path.

## Optional integrations and remaining implementation

- Follow OPTIONAL-AI.md to install/configure a chosen Ollama model and run the adapter. Test real consent, output quality, cancellation, malformed/offline service, safe Apply and Restore. No API key is bundled or required for the local adapter. Avoid promising offline inference without checking the model/runtime configuration.
- Follow THIRD-PARTY.md to obtain and review a small licensed ASL dictionary. Code licences and credit alone do not establish video rights. Add real bundled clips/notices and exact package entries. Verify actual hits/misses/multiple senses/playback; then build the A9 word-hover card, pinning/anchoring and speech arbitration. Do not fabricate signs or mark synthetic tests as real media evidence.
- Finish the scoped P1 gaps listed in FEATURE-STATUS.md. P2 OCR/deep PDF, multilingual/ML, universal canvas, cross-browser and grammar-aware sign translation remain roadmap. Discuss substantial new scope instead of claiming universal support.
- Owner chooses the app's distribution licence. Prepare honest release/store/privacy/screenshot materials only after required gates pass. Publishing and paid services need separate authorization.

## Architecture and safe contribution rules

Settings validation is in `src/settings.ts`; injected ownership/lifecycle in `src/content.ts`; reversible prose/sensory/ruler in `engine.ts`/`ruler.ts`; hover and speech in `hover.ts`/`speech.ts`; bars/structured charts in `charts.ts`/`structuredCharts.ts`; tab queues/profiles in `usePageController.ts`/`profiles.ts`; commands in `commands.ts`/`background.ts`; AI in `AISelection.tsx`, `ai.ts`, `selectionSession.ts` and `server/ai.mjs`; sign catalog/UI in `signs.ts`/`SignLookup.tsx`; React surface in `App.tsx`/`ui.css`. Build/packaging are explicit in `build.mjs`, manifest and `scripts/package.mjs`.

All active modes default off. User actions own changes. Protect forms/code/editables/warnings/custom widgets; preserve newer website text/fills. Charts require exact metadata, never pixel guesses. No analytics, remote code, hidden uploads, client provider keys or unlicensed media. Optional local AI is separate from the core and requires explicit consent. Keep private PDF/ZIP, credentials, `.env`, model downloads, generated `dist`, ZIPs and `node_modules` outside Git.

Use focused branches and PRs; preserve others' work. Never force-push main, choose the owner's licence or publish implicitly. The latest user request authorizes committing this work and opening a PR; it does not authorize merging the implementation PR. Contributor/reviewer should verify repository rules and current permissions.

## Transfer checklist

Share this guide, CONTINUATION-PROMPT.md, FEATURE-STATUS.md, the repository/PR links, and optionally the verified extension/source ZIPs. Share the original PDF and design ZIP privately and separately if the recipient is authorized; they are excluded from the public repo and generated source archive. No Chrome profile, passwords, tokens or local model installation should be transferred.

Local state at handoff: Vite was started on `127.0.0.1:5173`; verify it is still running or restart it. The optional AI adapter/model was not started. Rebuild/reload on the recipient's machine; do not reuse the previous machine's extension ID or paths.
