# Contributor instructions

Read docs/START-HERE.md, docs/WORKFLOW.md, README.md, docs/HANDOFF.md, docs/TEST-MATRIX.md and docs/CONTINUATION-PROMPT.md before continuing. Task prompts are in docs/PROMPTS.md. The latest user instruction takes precedence over historical autonomous-work requests.

## Product decisions

- AbleVerse AI is a user-controlled Chrome accessibility extension, not a portal or medical product. The final Part II/A1 of the supplied blueprint governs priorities; the private source PDF is not redistributed.
- Finish P0 release gates before P1. All modes default off. Apply only after an explicit action; Save preferences is explicit and does not apply them.
- Preserve source text and site edits. Protect forms, code, editable content, warnings, navigation and interactive controls. Restore must undo only extension-owned changes and cancel owned speech.
- Charts require explicit SVG bar metadata. Never infer values from pixels or colours. Unsupported/malformed/grouped/transformed charts must fail safely. Invalidate stale companions after source or contract changes.
- Hide only explicitly marked, noninteractive distractions. Do not add heuristic hiding of unknown page regions.
- No backend, account, analytics, remote code, AI upload, secrets or unlicensed ASL assets. Browser/OS speech voices may use online services; do not promise offline speech.
- Keep Chrome permissions minimal: activeTab, scripting, storage, sidePanel. Minimum Chrome 116.

## Validation and delivery

- Node 22.12+; use npm ci, npm test and npm run package. Keep package-lock.json committed. Packaging has an explicit file allowlist; update it for legitimate new shipped assets.
- Add meaningful regressions for behavior changes. Do not substitute jsdom/API fakes or browser preview for native extension/audio/screen-reader acceptance.
- Record actual evidence and limitations in docs/TEST-MATRIX.md and docs/HANDOFF.md. Never turn pending gates into PASS by inference.
- Commit and push useful checkpoints. User requested completed work integrated into main; use reviewable focused branches/PRs and preserve others' work. Never force-push main.
- Never commit credentials, private page text, the source PDF, .env, node_modules, generated dist or ZIP artifacts. No password is needed in project files.

## Local user context

- If native browser testing is needed on the original workstation, use only the existing cyan dhruvkhanna1522 Chrome profile. The user previously approved loading/testing the local extension there. Do not open another Chrome profile.
- Use supported browser controls. If current-URL verification fails, stop that browser interaction; do not bypass verification.
- Latest user instruction: STOP AT CHECKPOINT, save everything on GitHub and prepare contributor documentation. Work is stopped after saving the native acceptance evidence and user audio confirmation. Do not resume implementation/testing until the user asks. Newer explicit user instructions override this saved status.
