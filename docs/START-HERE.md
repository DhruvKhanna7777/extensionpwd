# AbleVerse AI: baton-pass checkpoint

Saved 7 November 2026. Repository: https://github.com/DhruvKhanna7777/extensionpwd

**Start from updated upstream main. All implementation PRs #1–#12 are merged. Runtime baseline is f86e2f117a9fc1a41d0f12a3c87bbf029422b4ec.** This documentation checkpoint follows it; fetch current GitHub state before continuing. There were zero open PRs when this handoff began. Do not restart from an old contributor fork or repeat a completed merge.

The owner requested a stopping checkpoint and a complete baton pass. No additional feature implementation is running. The local demo server has been stopped; the optional AI adapter/model was not started. Resume only on the owner's next instruction.

## In plain language

This is a working Chrome extension for easier reading, calmer pages, reading text aloud and accessible supported charts. It also has optional local-AI plumbing and a sign lookup interface. It is **not yet certified for public release**. Real AI setup/output tests, approved sign videos and complete real-browser/accessibility checks are still required.

- **109 automated tests + 4 packaging checks pass.** Production typecheck/build and 19-file ZIP passed on the runtime baseline.
- **35 browser-engine checks pass** on PR #11's page-engine code, which PR #12 did not change. These do not certify installed Chrome permissions, audio or screen readers.
- Earlier native smoke checks and user-confirmed speech results are documented with exact scope. They predate the latest runtime changes and must not be promoted to current full acceptance.
- No approved sign clips or local model are bundled. No model was found installed/reachable on the original workstation at the last check.

## Send these to the next person

1. [Complete project handoff](CONTRIBUTOR-HANDOFF.md): total completed work, decisions, evidence, setup and remaining work.
2. [Master continuation prompt](CONTINUATION-PROMPT.md): copy into a new coding-assistant chat.
3. [Copyable task prompts](PROMPTS.md): human handoff, developer, tester, AI/sign-data, reviewer and checkpoint tasks.
4. [Ordered workflow](WORKFLOW.md) and [acceptance checklist](NEXT-CONTRIBUTOR.md).

Read AGENTS.md before editing. Detailed evidence is in TEST-MATRIX.md, BROWSER-EVIDENCE.md and INSTALLED-ACCEPTANCE.md. FEATURE-STATUS.md maps implemented versus unfinished features; HANDOFF.md preserves historical checkpoints. OPTIONAL-AI.md, THIRD-PARTY.md and CHART-CONTRACTS.md explain integrations and data limits.

The public repo can be cloned without the owner's password. Contributors use their own account/fork or approved collaborator access. Local Chrome profiles/models/private PDF/design references do not transfer with Git. Share private originals separately only with an authorized recipient. Publishing, model/service costs and the distribution licence remain owner decisions. Rough percentages in chat are not acceptance criteria.
