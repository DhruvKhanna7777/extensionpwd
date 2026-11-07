# Local PDF features implementation plan

Goal: implement the remaining local A7/A8/A10/A11/A14 features in the existing Chrome extension, keeping native acceptance separate.

Architecture: retain React controls, validated Settings, PageEngine and the injected singleton. Add focused hover/ruler/profile/structured-chart modules. No new broad permissions, external service or automatic activation.

Spec: supplied PDF final Part II A7-A14; current AGENTS.md protections. The user explicitly requested implementation and PRs, not merges. P0 native gates remain open; this branch implements local P1 functionality without certifying it for release.

Review focus: nested/custom controls must never be spoken; repeated hover/route/visibility/Restore must cancel all owned work; loading profiles cannot activate a page; newer site styles survive Restore; malformed chart metadata/geometry must cause atomic rejection.

## Tasks

1. Reading controls and ruler (`settings.ts`, `engine.ts`, new `ruler.ts`, App): write failing tests for bounded width/paragraph settings, protected regions, reversible prose-only width and ruler Escape/pointer transparency; implement; run affected tests.
2. Hover speech (`hover.ts`, `content.ts`, Settings/App): failing fake-timer tests for dwell, rapid targets, duplicate suppression, protected descendants, leave/hidden/Escape/disable cancellation and sentence/paragraph scope; implement delegated safe prose targeting and shared SpeechPlayer; test lifecycle.
3. Site profiles (`profiles.ts`, Settings UI): failing tests for origin scoping, schema validation, bounded records, save/load/reset, no auto-apply and changing-tab ownership; implement explicit local preference storage and UI.
4. SVG line/pie adapters (`structuredCharts.ts`, charts/content/App, fixtures): failing tests for explicit metadata, geometry validation, exact values, dash/marker differentiation, percentage totals, unsupported/transformed data, mutation invalidation and preservation of newer styles; implement and document contracts.
5. Run full tests/typecheck/package, review branch, update evidence/scope and open a focused PR. Report unavailable native checks separately. Research AI/ASL reuse; do not ship unlicensed clips, fictitious translations or an unconfigured AI service as working functionality.

Each implementation task follows RED -> GREEN, with focused commits. Keep generated output, private PDF and scratch outside Git. Preserve the incumbent UI and default all active modes off.
