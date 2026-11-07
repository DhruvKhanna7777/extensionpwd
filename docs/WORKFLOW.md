# Contributor workflow

> Current checkpoint: read [CONTRIBUTOR-HANDOFF.md](CONTRIBUTOR-HANDOFF.md), [FEATURE-STATUS.md](FEATURE-STATUS.md) and [CONTINUATION-PROMPT.md](CONTINUATION-PROMPT.md) first. PR #8 is merged; the implementation branch contains newer work. Historical counts, deferred-feature lists and role prompts below may predate it. Do not start from an older main checkout while the implementation PR is open.

Start with START-HERE.md. This is a human project workflow, not a claim that release acceptance is automated.

## 1. Get a trustworthy starting point

Inspect the repository, latest main, open PRs, git status and recent history. Preserve other contributors' work. PR #5 is already merged at f257cda; do not open another PR to merge it. Use a focused branch for new work. A fork is fine if you lack push permission.

```sh
git clone https://github.com/DhruvKhanna7777/extensionpwd.git
cd extensionpwd
git switch main
git pull --ff-only
git switch -c acceptance/next-core-checks
npm ci
npm test
npm run package
npm audit --audit-level=high
```

For an existing checkout, inspect status first and use fetch/review before switching or pulling. Do not discard local edits. Prerequisites are Node 22.12+ and Chrome 116+. Current commands produce 103 Vitest + 4 package checks and a 19-file ZIP; future legitimate changes can alter those counts. Investigate failures rather than editing expected counts to match them.

Build output: dist/. ZIP: artifacts/ableverse-ai-0.1.0.zip. Both are generated and ignored by Git. Packaging prints SHA-256 and verifies its explicit shipping allowlist and bytes. Extract ZIP before Load unpacked, or load dist directly.

Done when: the working base is understood, relevant checks pass, and remaining limitations are recorded.

## 2. Run the actual extension

```sh
npm run demo
```

Open chrome://extensions in an authorized testing profile, enable Developer mode if needed, Load unpacked and select dist. After rebuild, reload the extension and the demo tab. Visit http://127.0.0.1:5173/demo/article.html and click the toolbar icon to grant access. Open the full panel from the popup.

The Vite root interface is only a preview. /demo/validation.html runs the actual page engine in a demo page; it does not test installed permissions or device audio. Keep these evidence types separate.

On the original owner's machine, use only the existing cyan dhruvkhanna1522 profile; do not open another profile. On another contributor's machine, use their authorized testing profile. Browser setup does not transfer with Git. If automation cannot verify the current URL, stop that browser interaction and document the limitation; do not bypass it.

Done when: the current build is loaded, fixture address is verified, controls reach the intended tab, and the tested commit/browser/OS are recorded.

## 3. Finish core acceptance in this order

| Milestone | What to verify | Done condition |
|---|---|---|
| Latest Reading changes | Preview edits affect only local preview; explicit Apply enables Reading and preserves other modes; discard on tab/navigation/module change and Restore; colour selector; h1–h6 hierarchy; protected form/custom controls; sticky Restore with keyboard scrolling | Installed results recorded for all new paths, no unexplained failure |
| Speech | Multiple available voices; allowed low/default/high rate and volume; audible pause/resume, Stop, page Escape; editable/code selection excluded | Exact tested combinations and listener results recorded; UI status alone is insufficient |
| Lifecycle | Fresh run for tab hide, pagehide, normal navigation and history-only route change; reopen without auto speech/reapplication | Owned speech stops and route changes clear owned adaptations; delay measured, including active 500ms polling behavior |
| Access and tab ownership | Internal/store pages, real denied/revoked grant where supported, queued action followed by tab switch | Clear explanation/rollback and no unintended page modification; unsupported test conditions marked BLOCKED |
| Dynamic content/charts | Source values/contract removed or changed; unrelated chart edits with Charts off; newer site text/fill; newly inserted prose | No stale verified data; preserve newer site edits; new prose changes only after explicit Apply |
| Accessibility | All modules/popup/panel with keyboard and screen reader; focus/names/status/errors/table headers; zoom 100/200/400%; narrow layouts and contrast | Actual assistive-tool/browser versions and results recorded; no unresolved core usability defect |
| Release readiness | Icons, owner-selected licence, honest feature/store/privacy copy, package/checksum and screenshots | Core gates pass; owner decides publishing and licence; release evidence matches actual supported behavior |

NEXT-CONTRIBUTOR.md has expanded instructions for these cases. Earlier native chart/form/audio smoke checks are useful history; rerun affected paths after runtime changes. Do not mark all voices or universal websites supported after testing one example.

## 4. Record every result

Use PASS, FAIL, BLOCKED or NOT RUN. An unavailable screen reader is BLOCKED, not PASS. Distinguish automated fakes, engine harness, interface preview, installed UI and human listening.

```text
Case ID / feature:
Commit and extension version:
Date / tester:
OS / Chrome version / screen reader or voice:
Evidence type:
Steps and controlled demo data:
Expected:
Actual:
Result: PASS / FAIL / BLOCKED / NOT RUN
Evidence reference:
Remaining limitation or defect:
```

Store summarized outcomes in TEST-MATRIX.md and actual native results in INSTALLED-ACCEPTANCE.md. Do not capture private page text, real passwords or tokens in evidence.

## 5. Fix a failure

Reproduce with minimal controlled data. Record what failed. Add a meaningful regression when feasible, fix the cause, rerun affected tests/build, then retest the actual failing browser case. Preserve source text, essential page controls and newer site edits. Do not broaden permissions, silently upload page data, add heuristic hiding or invent chart values to work around a failure.

Done when: the regression and actual affected behavior pass, or the unresolved blocker is clearly documented. A passing mock alone does not close an audible/native failure.

## 6. Save and review

Review the diff for accidental files or secrets. Run npm test and npm run package after runtime changes; documentation-only changes need link/content review and git diff --check. Update HANDOFF.md and evidence, commit and push a focused branch, then open a PR. Never force-push main or overwrite someone else's work.

```text
PR title: [Concrete problem and resulting behavior]
Changes: [What changed and why]
Validation: [Exact commands/results and native evidence]
Limitations: [Remaining failures, blockers and untested behavior]
```

Merge only under the repository owner's authorization and normal repository rules. After merging, fetch and synchronize main, confirm a clean checkout, and regenerate the final package if runtime changed. Save its checksum. Do not publish a store release merely because the merge succeeded.

## 7. Hand off again

```text
Repository / branch / final commit / PR:
Completed in this session:
Validation actually performed:
Outstanding failures and blockers:
First next task:
Important product decisions:
Local services/browser state left running:
Package path / checksum, if generated:
Files updated for the next contributor:
```

Update the main entry docs if the current state changed. Stop when asked. Do not carry historical autonomous-work instructions into a new task without the owner's current instruction.

## Later features

Remaining feature implementation is listed in FEATURE-STATUS.md. The owner authorized local P1 implementation on branches; required core acceptance still gates release. Real model/sign-media integration and native verification remain open. Before implementation, settle provider/data consent/cost/licensing choices with the owner. No placeholder AI/ASL output, client keys, automatic uploads or unlicensed media.
