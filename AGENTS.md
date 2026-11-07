# Contributor instructions

Read docs/START-HERE.md, docs/WORKFLOW.md, README.md, docs/HANDOFF.md, docs/TEST-MATRIX.md and docs/CONTINUATION-PROMPT.md before continuing. Task prompts are in docs/PROMPTS.md. The latest user instruction takes precedence over historical autonomous-work requests.

## Product decisions

- AbleVerse AI is a user-controlled Chrome accessibility extension, not a portal or medical product. The final Part II/A1 of the supplied blueprint governs priorities; the private source PDF is not redistributed.
- Required P0 native acceptance remains a release gate. The owner authorized remaining PDF feature implementation on reviewable branches; this does not certify P0 or authorize publishing. All modes default off. Apply only after an explicit action; Save preferences is explicit and does not apply them.
- Preserve source text and site edits. Only the optional, explicitly consented AI Apply may replace a safely restorable prose range; preserve original markup and reject stale/unsafe ranges. Protect forms, code, editable content, warnings, navigation and interactive controls. Restore must undo only extension-owned changes and cancel owned speech.
- Charts require the documented explicit SVG bar/line/pie metadata. Never infer values from pixels or colours. Unsupported/malformed/grouped/transformed charts must fail safely. Invalidate stale companions after source or contract changes.
- Hide only explicitly marked, noninteractive distractions. Do not add heuristic hiding of unknown page regions.
- No mandatory backend/account, analytics, remote code, automatic AI upload, embedded provider secrets or unlicensed ASL assets. Optional consent-based local AI adapter is implemented; check model data practices. No approved sign clips ship. Browser/OS speech may use online services; do not promise offline speech.
- Keep required Chrome permissions minimal: activeTab, scripting, storage, sidePanel. Optional loopback host access is only for explicit local AI connection; do not broaden it silently. Minimum Chrome 116.

## Validation and delivery

- Node 22.12+; use npm ci, npm test and npm run package. Keep package-lock.json committed. Packaging has an explicit file allowlist; update it for legitimate new shipped assets.
- Add meaningful regressions for behavior changes. Do not substitute jsdom/API fakes or browser preview for native extension/audio/screen-reader acceptance.
- Record actual evidence and limitations in docs/TEST-MATRIX.md and docs/HANDOFF.md. Never turn pending gates into PASS by inference.
- Commit and push useful checkpoints. User requested completed work integrated into main; use reviewable focused branches/PRs and preserve others' work. Never force-push main.
- Never commit credentials, private page text, the source PDF, .env, node_modules, generated dist or ZIP artifacts. No password is needed in project files.

## Local user context

- If native browser testing is needed on the original workstation, use only the existing cyan dhruvkhanna1522 Chrome profile. The user previously approved loading/testing the local extension there. Do not open another Chrome profile.
- Use supported browser controls. If current-URL verification fails, stop that browser interaction; do not bypass verification.
- Latest user instruction (7 November 2026): reach the next checkpoint, merge authorized pending work, save everything and prepare the complete baton pass. Feature work is STOPPED after this documentation checkpoint. Implementation PRs #1–#12 are already merged; runtime baseline is f86e2f1. Resume only on the next user instruction. Do not publish or choose a licence implicitly. New user instructions supersede this saved stopping status.
