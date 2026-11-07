# AbleVerse AI: start here

Use [CONTRIBUTOR-HANDOFF.md](CONTRIBUTOR-HANDOFF.md) for current source/PR/setup/next tasks, [FEATURE-STATUS.md](FEATURE-STATUS.md) for implemented versus verified behavior, and [CONTINUATION-PROMPT.md](CONTINUATION-PROMPT.md) for the complete copy-paste prompt.

This is a user-controlled Chrome accessibility extension, not a portal or medical product. Modes start off, changes require explicit action, and Restore removes owned changes while preserving later site edits. Optional local AI requires setup and per-selection consent. The approved sign-video catalog is empty.

PR #8 is merged at `6d30201`; newer implementation is on `feat/reading-tools-and-chart-adapters` in the contributor fork. Check the implementation PR before choosing main or that branch. Never restart from an older checkout without reviewing existing work.

Prerequisites: Node 22.12+, desktop Chrome 116+, an authorized testing profile. Run npm ci, npm test, npm run package, then npm run demo. Load/reload the correct generated dist and refresh the fixture. The Vite root is a sample-only UI preview; installed extension, listening, real-model and screen-reader evidence are separate.

Current source passed 103 Vitest tests, 4 packaging checks, production typecheck/build/19-file packaging, 20 browser-engine checks and the 15-case narrow preview matrix. Core native release gates remain open. Begin with installed reflow at 150% Verdana, 0.09em letter and 0.21em word spacing with the panel open; record viewport, zoom, commit, OS and Chrome version.

Read AGENTS.md and WORKFLOW.md before changes. Record every actual result in INSTALLED-ACCEPTANCE.md, TEST-MATRIX.md and HANDOFF.md. See OPTIONAL-AI.md for local model setup, THIRD-PARTY.md for font/parser/sign rights, and CHART-CONTRACTS.md for exact line/pie metadata. Owner chooses distribution licence and publishing; a PR or green mock test is not release certification.

Share the original private PDF/design ZIP separately with an authorized recipient if detailed reference work is needed; neither is committed. Never transfer passwords, tokens or browser profiles.
