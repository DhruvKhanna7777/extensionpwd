# Copyable prompts for the next person

Current full prompt: [CONTINUATION-PROMPT.md](CONTINUATION-PROMPT.md). Project state: [CONTRIBUTOR-HANDOFF.md](CONTRIBUTOR-HANDOFF.md). All implementation PRs through #12 are merged; begin with latest upstream main, not an old implementation fork. These templates describe tasks; actual owner instructions and repository rules govern merge/publishing permission.

## 1. Short human handoff message

```text
Please continue AbleVerse AI: https://github.com/DhruvKhanna7777/extensionpwd
Start with docs/START-HERE.md, AGENTS.md and docs/CONTRIBUTOR-HANDOFF.md.
For a coding assistant, use docs/CONTINUATION-PROMPT.md; workflow and task prompts are linked there.
All feature/fix PRs through #12 are merged. Runtime baseline f86e2f1; fetch latest main.
109 automated tests + 4 packaging checks and production package pass. Engine browser harness has 35 passing checks; native/audio/model/screen-reader evidence remains separate.
First task: test current installed reflow and Reading, then finish access/dynamic/speech/accessibility gaps. Real AI setup and approved sign videos remain unfinished. Product is not release-certified.
Preserve existing features, record actual evidence, fix reproducible defects, update handoff and send focused PRs using your own account/fork. No owner password is needed. Coordinate merge/licence/publishing decisions with the owner.
```

## 2. Developer/acceptance task

```text
Read AGENTS.md, current handoff, WORKFLOW.md and NEXT-CONTRIBUTOR.md in extensionpwd. Inspect status/latest main/open PRs including forks; preserve others' work. Test current installed reflow/Reading preview Apply-discard, other-mode preservation, protected controls/headings/fonts/ruler/hover/profiles/shortcuts. Then access/tab ownership and dynamic chart/site-edit cases using /demo/advanced.html. Record tested commit, environment, steps/expected/actual/PASS-FAIL-BLOCKED. Reproduce failures, add meaningful regressions, fix causes and retest actual behavior plus npm test/npm run package. Save focused commits/PRs and evidence. Do not certify native behavior from fakes or start a rewrite.
```

## 3. Speech tester

```text
Use the current installed extension on controlled localhost data. Follow NEXT-CONTRIBUTOR.md. Record actual voice/browser/OS/commit and test allowed rate/volume endpoints separately. Fresh runs: selection playback/pause-resume/Stop/page Escape/tab-hide/pagehide/normal/history-only navigation and hover paragraph/sentence/word dwell. Measure audible cancellation delay; UI status is separate evidence. Verify hidden/editable/code exclusion and no unsolicited reactivation. Keep historical listener passes distinct. Mark unavailable cases BLOCKED; do not bypass browser verification or invent listening evidence.
```

## 4. Keyboard/screen-reader tester

```text
Test all five modules, popup and panel on the latest installed AbleVerse with keyboard-only use and a named/versioned screen reader. Check focus/order/visibility, labels/values/states, status/error announcements, disabled actions, generated table headers, Restore and all new Reading/AI/sign-unavailable states. Test zoom 100/200/400%, narrow widths, palettes/control contrast and icons. Record actual commit/environment/case outcomes and reproducible defects. Existing axe/preview/font/contrast checks do not substitute for this walkthrough. Preserve live behavior and document blockers honestly.
```

## 5. Real AI setup and testing

```text
Follow OPTIONAL-AI.md and current handoff. No model is bundled; real inference is not verified. Prepare the actual model/runtime/licence/data/cost/download choices for owner review before installing or buying anything. Use controlled nonprivate text, actual extension ID, fixed loopback adapter and explicit per-selection consent. Test real meaning/facts/numbers/negation/warning preservation, latency, cancellation, offline/malformed service, optional permission denial, recapture, comparison/copy, once-only safe Apply, stale completions and Restore preserving later site edits. Record model/runtime/browser/commit and actual output limits. Do not count fake-model HTTP/UI tests as real inference, upload whole pages, expose the local service or put keys/models/text in Git.
```

## 6. Sign-language data/feature task

```text
The approved ASL catalog is empty. Read THIRD-PARTY.md and FEATURE-STATUS.md. Identify source videos with documented redistribution rights and required attribution plus linguistic/source review; submit concrete provenance for owner/reviewer approval. Do not infer video rights from code licences or credit. Once approved, package a small real local dictionary/notices and test exact hits/misses/multiple senses/video errors/keyboard/Escape/source attribution. Then implement A9 anchored/pinnable word-hover behavior and speech arbitration with regressions. No generated/guessed signs or synthetic entries marketed as shipped media.
```

## 7. Review/integration task

```text
Review PR [number/link] against latest upstream main. Read AGENTS.md/current handoff and inspect actual diff/dependencies/permissions/privacy/restoration/tab ownership/consent/metadata/asset provenance. Run appropriate checks; distinguish contributor-reported checks from independently rerun checks. Report blocking defects with reproduction and impact. Preserve author credit. Merge only under owner's authorization and normal rules, then sync/verify clean main and update state/package/evidence if needed. A merge does not authorize publication or establish release certification.
```

## 8. Checkpoint/baton pass

```text
Stop at the next safe checkpoint. Inspect all open PRs including forks; review/test and merge only authorized ready work. Preserve unrelated changes. Save all completed work remotely, update canonical handoff/feature status/master prompt/evidence with exact done/remaining/decisions, and verify local/remote state before claiming everything saved. Provide final main/branch/commit/PR, actual checks, open blockers, first next task, package/checksum and local services/browser state. Stop owned services if handing off. No passwords/private originals/generated builds/unlicensed data in Git. Stop further implementation after checkpoint; publishing/licence choices remain separate owner decisions.
```
