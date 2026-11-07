# AbleVerse AI: handoff start here

Repository: https://github.com/DhruvKhanna7777/extensionpwd

This pack is for a developer, tester, or coding assistant taking over the project. Read this file first, then use PROMPTS.md for ready-to-copy instructions and WORKFLOW.md for the exact order of work.

## What the project does

AbleVerse AI is a Chrome extension that lets people make webpages easier to read, reduce distractions, hear selected text and understand supported bar charts without relying only on colour. Changes are optional and reversible. It is a working local core, not a finished public release.

## Latest verified starting point

PR #5 by Arihant2007 was reviewed and merged into main at f257cda on 2026-11-07. PRs #1–#4 contain the earlier implementation and acceptance evidence. Fetch GitHub before starting: this recorded commit is a baseline, not a guarantee that nobody has contributed since.

The integrating reviewer reran 48 core/UI tests and 3 packaging checks, production typecheck/build/package, and dependency audit successfully. The merged source tree matched the tested PR. The contributor additionally recorded 19 browser-engine checks and 15 narrow preview layout combinations passing; those browser checks were not rerun during integration.

Earlier installed Chrome smoke checks passed for installation, popup/full panel, Reading, chart labels/patterns/exact table, form editing/submission, reopening state and Restore. Speech control states included pause/resume/Stop/Escape. The user confirmed hearing a selected paragraph and working pause/resume. These native checks predate PR #5; the latest preview/protection changes still need installed testing.

## What is implemented

- Popup and side panel with Overview, Reading, Sensory, Charts and Settings.
- Font, size and spacing controls; optional preview before applying; independent heading scaling including h4–h6; Reading colour choices; Restore stays visible while scrolling.
- Selected-text speech with voice, rate, volume, pause/resume, Stop and page Escape.
- Reduced CSS motion, article focus outline, control emphasis and optional hiding of explicitly marked safe distractions.
- Annotated SVG bar chart labels, distinct patterns and exact value tables. Unsupported charts remain unchanged.
- Explicit local preference save/load, current-tab handling, reversible changes and protection for forms, custom controls, code, warnings and editable content.
- Local demos, browser harness, tests, verified ZIP packaging and contributor documentation.

## What remains

Finish P0: this means proving the existing core is safe and usable before adding big new features. Reload the latest build in Chrome; test new preview Apply/discard and sticky Restore, voices/rate/volume and audible stopping, tab/page/SPA navigation, denied access, dynamic charts, full keyboard/screen-reader use, zoom/contrast/icons. Choose a licence with the owner and prepare release materials after these checks pass.

P1 is later: AI simplification, verified licensed sign-language lookup, hover speech, settings per website and line/pie chart support. These are not implemented. No backend or AI account/key is needed for the current core.

No numeric completion percentage is a release criterion. Earlier percentages in chat were rough estimates. Use the checks and evidence instead.

## What to send someone

Send the repository URL and the Short handoff message in PROMPTS.md. For a coding assistant, send docs/CONTINUATION-PROMPT.md. For the person testing, send WORKFLOW.md and NEXT-CONTRIBUTOR.md. They should read AGENTS.md before editing.

The public repository can be cloned without your password. To contribute, they need their own GitHub account and either a fork or collaborator permission. Never share your account password or put it into a prompt. Publishing is a later owner decision; this pack does not grant permission to publish, choose a licence, or spend money on services.

## First 30 minutes

1. Read AGENTS.md, this page and WORKFLOW.md. Inspect the latest main and open PRs.
2. Clone on your own machine; install Node 22.12+ and Chrome 116+ if needed. Run the setup commands in WORKFLOW.md.
3. Confirm tests/package pass, run the demo, and load the generated dist in a testing profile.
4. Start with the latest preview/Restore acceptance cases, then the ordered remaining core checks. Record outcomes rather than assuming they passed.
5. If browser/audio/screen-reader access is unavailable, mark those cases BLOCKED, preserve the evidence and continue checks that are available. Do not invent certification.

## Documentation map

| File | Purpose |
|---|---|
| WORKFLOW.md | Setup, ordered milestones, done conditions, evidence and delivery templates |
| PROMPTS.md | Ready-to-copy messages and task prompts |
| CONTINUATION-PROMPT.md | Complete master prompt for a coding assistant |
| NEXT-CONTRIBUTOR.md | Detailed remaining native acceptance cases |
| TEST-MATRIX.md | Automated and manual evidence with limitations |
| INSTALLED-ACCEPTANCE.md | Earlier native Chrome and user listening evidence |
| BROWSER-EVIDENCE.md | Browser-engine and interface preview evidence |
| HANDOFF.md | Historical work and latest checkpoint notes |
| PLAN.md | Scope and priority decisions |
| ../DEMO.md, ../PRIVACY.md | Demo steps and current privacy behavior |

The original workstation's PDF, Chrome profile, installed extension and ZIP files do not transfer with Git. Build your own dist/ZIP. The private blueprint is not required for the documented core checks; request it privately from the owner if an unresolved product decision requires it.
