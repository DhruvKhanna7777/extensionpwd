# Next contributor: ordered work

Read [the current handoff](CONTRIBUTOR-HANDOFF.md), [feature status](FEATURE-STATUS.md) and [continuation prompt](CONTINUATION-PROMPT.md) first. Implementation PRs #1–#12 are merged; runtime baseline f86e2f1. Fetch latest upstream main/open PRs and preserve existing source/evidence. Do not return to an obsolete implementation fork. Work is stopped at the owner's checkpoint until the next continuation request.

1. Rebuild/load the current extension in an authorized profile. Verify the page URL using supported controls; stop that browser interaction if URL verification fails.
2. Retest installed reflow: article, full panel, 150% Verdana, 0.09em letter/0.21em word spacing; heading wraps, no prose-induced horizontal scrolling, exact Restore. Record viewport and zoom.
3. Finish Reading draft/navigation and other-mode preservation, heading/form/custom-control protection, width/paragraph/alignment/font/ruler and hover-word behavior. Check profiles load without applying or activating on new sites.
4. Test internal/store pages, supported real revocation and confirmed pending-Apply tab switches. Keep earlier rapid-switch/native results distinct from deterministic fake queue tests.
5. Test chart metadata/contract/geometry changes, independent encodings/table focus, line/pie exact values, newer site text/fill preservation and explicit reapply for inserted prose.
6. Record actual listener results and cancellation latency for Stop, page Escape, tab hide, normal navigation and history-only routes. Exercise remaining rate/volume endpoints separately with exact voices.
7. Complete installed popup/panel keyboard and named/versioned screen-reader walkthroughs; names/states/values/focus/announcements/errors/table headers; 100/200/400% zoom, narrow widths, palettes, full UI contrast and icons.
8. Follow OPTIONAL-AI.md to configure a real model and record output quality, permission/consent/cancellation/failure/safe Apply/Restore evidence. Fake provider responses are not actual inference.
9. Obtain licensed, source/linguistically reviewed sign clips per THIRD-PARTY.md, package a small approved dictionary and test real video hits/misses/senses. Then implement the A9 anchored/pinnable word-hover card and speech arbitration. Current catalog is empty.
10. After required gates pass, owner chooses distribution licence; prepare accurate store/privacy/screenshot/package materials. Publishing is separately authorized. P2 roadmap is not implemented.

Each case needs PASS/FAIL/BLOCKED/NOT RUN, source commit, environment, date/tester, steps, expected/actual, evidence and limitations. Include voice/model/screen-reader details. Update INSTALLED-ACCEPTANCE.md, TEST-MATRIX.md and HANDOFF.md. Use meaningful regressions for failures, reviewable commits/PRs and no force-push to main. Do not claim a manual PASS from preview, jsdom or HTTP fakes.
