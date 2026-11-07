# Copy-and-paste handoff prompts

Use the short message for a person. Use CONTINUATION-PROMPT.md for an assistant starting from scratch. The task prompts below narrow a session to one milestone; combine them with the repository instructions. Replace bracketed fields with actual results before sending a template as evidence.

## A. Short handoff message to send a contributor

```text
Please continue AbleVerse AI, our Chrome accessibility extension:
https://github.com/DhruvKhanna7777/extensionpwd

Start at docs/START-HERE.md, then read AGENTS.md and docs/WORKFLOW.md. For an AI coding assistant, use docs/CONTINUATION-PROMPT.md. Ready-to-use task prompts are in docs/PROMPTS.md.

The working core includes reading/speech/sensory controls, supported SVG bar charts, local settings and Restore. Arihant's PR #5 is merged into main at f257cda. At that checkpoint, 48 core/UI tests + 3 packaging checks and the production package passed. Fetch the latest main before starting.

Your first job is to test the latest typography preview, persistent Restore and page-control protection in installed Chrome, then finish the remaining core acceptance gates. AI/sign language/hover/site profiles/line and pie charts come later. The product is not release-certified.

Record what actually passes or fails, fix reproducible defects, update the handoff/test evidence, and send a focused PR. Use your own GitHub account/fork; you do not need my password. Coordinate merge/publishing decisions with me. Do not upload the private blueprint or page data.
```

## B. Developer: latest preview and protected controls

```text
Work on the latest main of DhruvKhanna7777/extensionpwd. Follow AGENTS.md and docs/WORKFLOW.md. PR #5 is already merged; inspect current history rather than recreating it.

Verify the latest installed Chrome build: local typography preview makes no webpage change until Apply; Apply preserves other modes and enables Reading; unapplied edits discard on tab/navigation/module changes and Restore; Reading colours work; Restore stays visible without covering keyboard focus; h1-h6 keep their hierarchy; forms/custom controls/dialog/focus targets remain protected. Check errors and narrow panels too.

Reproduce failures, add meaningful regressions where appropriate, fix the cause and retest affected native cases. Run npm test and npm run package after runtime edits. Update TEST-MATRIX.md, INSTALLED-ACCEPTANCE.md and HANDOFF.md. Save a focused commit and PR, with actual evidence and remaining limits. Do not claim native acceptance from preview/jsdom alone, expand permissions or start P1 features.
```

## C. Tester: speech and navigation

```text
Test the latest built AbleVerse extension on controlled localhost demos, following docs/WORKFLOW.md and NEXT-CONTRIBUTOR.md. Record commit, Chrome/OS versions, voice names, exact allowed rates/volumes and listener observations.

For each case start a fresh run: select eligible prose; verify audible playback and pause/resume; Stop; page-focused Escape; tab hide; pagehide/navigation; same-document/history-only route change. Verify no unwanted speech or automatic reapplication when returning. Test editable/code selection exclusion and actual error/permission paths where available. Measure cancellation delay; distinguish UI state from what is heard.

Historical paragraph audio and pause/resume were user-confirmed on the original device, not every voice or current build. Mark unavailable cases BLOCKED. Do not change OS/privacy settings or bypass browser verification to force a pass. Record results and reproducible defects without private text or credentials.
```

## D. Tester: keyboard, screen reader and appearance

```text
Test AbleVerse's current installed popup and full panel using keyboard-only operation and a real screen reader. Read docs/WORKFLOW.md and existing evidence first. Record browser/OS/screen-reader versions and the tested commit.

Walk Overview, Reading, Sensory, Charts and Settings. Verify focus visibility/order, names/values, toggles, status/error announcements, disabled actions, speech controls, chart table headers and Restore. Check 100/200/400% zoom, narrow panel layouts and palette/control contrast. Confirm sticky Restore does not hide focused controls.

Existing semantic axe and preview width checks do not certify screen-reader behavior. Record PASS/FAIL/BLOCKED per case; provide steps and expected/actual behavior for defects. If fixing code, add useful regression coverage and rerun affected native checks plus npm test/npm run package. Preserve scope and page safety.
```

## E. Developer: investigate a specific bug

```text
Repository: DhruvKhanna7777/extensionpwd. Read AGENTS.md and current handoff.
Bug: [symptom]
Tested commit/environment: [details]
Steps: [minimal controlled reproduction]
Expected: [behavior]
Actual/evidence: [observed result]

Reproduce before changing code. Find and fix the cause while preserving optional activation, owned-change Restore, protected controls, exact chart metadata and current-tab ownership. Add a meaningful regression where feasible. Test the affected real-browser behavior and appropriate automated/build checks. Update evidence and handoff, save a focused commit/PR and describe remaining uncertainty. Do not claim a fix solely because a mock test passes.
```

## F. Reviewer: review a contribution

```text
Review PR [number/link] against current main of DhruvKhanna7777/extensionpwd. Do not assume the PR description's checks were independently verified. Inspect the diff, behavior, regressions, page safety, permission scope, privacy, restoration, races and package effects. Preserve contributor authorship.

Run appropriate checks and state actual results. Prioritize actionable defects with reproduction and impact. Do not merge a blocking failure or count browser previews as installed/audio certification. Report the recommendation and remaining native gates; merge only with the owner's authorization and repository rules. After an authorized merge, synchronize main and update the handoff if its state changed.
```

## G. Release preparation, after acceptance

```text
Read current core acceptance evidence for AbleVerse AI. Identify unresolved release gates before preparing release materials. Do not declare release-ready while required cases fail or are blocked.

Once core acceptance is complete, prepare a reviewable store description, supported-feature list, privacy disclosures, screenshots plan and verified package/checksum instructions. Describe the strict SVG chart contract and browser/OS voice service limitation honestly. Ask the owner to choose the distribution licence and approve publishing/account/cost decisions. Do not publish or buy services from this prompt alone. AI/ASL and other P1 features are unimplemented until separately approved and built.
```

## H. End-of-session checkpoint

```text
Stop at a safe checkpoint for AbleVerse AI. Preserve other contributors' work. Run checks appropriate to the changes, review the diff for secrets/unrelated files, update current state/decisions/evidence/remaining work, and save a focused commit and PR. Push through the configured authorized account or explain the exact access blocker; never ask for an account password.

Provide repository, branch, commit/PR, what changed, actual validation, unresolved cases, next first task, local services/browser state and package checksum when applicable. Update the continuation prompt and entry docs if needed. Verify remote/local state before claiming everything is saved. Do not claim all work is in main until a merge is confirmed. Stop further implementation after the checkpoint.
```
