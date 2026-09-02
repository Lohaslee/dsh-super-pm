# Changelog

## 0.8.2 - 2026-09-01

- Remove the misleading `/super-pm` slash command, whose DSH handler cannot create a model turn.
- Document direct natural-language Skill invocation as the supported DSH workflow.

## 0.8.1 - 2026-09-01

- Sync the refined easter-egg behavior into both the bundled and standalone Super PM Skills.
- Support vague hidden-feature curiosity with playful meta-answers instead of revealing trigger rules.
- Support contextual lens-alias lead-ins for meaningful product milestones.

## 0.8.0 - 2026-09-01

- Add contextual easter-egg events for scope cuts, first users, validation, trust breakthroughs, and decision reversals.
- Add natural lens-alias lead-ins such as “这次由乔帮主路过提醒一句” and “龙哥思考了一下说”.
- Add vague-intent meta-egg replies that preserve curiosity instead of revealing trigger rules.

## 0.7.1 - 2026-09-01

- Add low-probability stateless random easter-egg discovery after meaningful milestones.
- Keep explicit keyword and seven-decision milestone easter eggs deterministic.
- Add deterministic tests for random hit and miss behavior.

## 0.7.0 - 2026-09-01

- Add opt-in redacted decision cards for copying and sharing.
- Add lightweight product pulse feedback without pretending to be a scientific score.
- Add an offline, low-noise easter egg discovery tool.
- Keep fun features privacy-preserving and non-mutating.

## 0.6.0 - 2026-09-01

- Add `/super-pm` command mode hints for diagnose, decide, brief, prd, review, and handoff.
- Add PRD generation, validation, and explicit-confirmation persistence to `.super-pm/prd.md`.
- Add PRD maturity checks for Snapshot, Draft, and Implementation-ready artifacts.

## 0.5.0 - 2026-09-01

- Add read-only traceability reports from decisions to validations and Task Board tasks.
- Detect orphan validation and task references without rewriting project history.
- Add tests for delivery traceability and cross-artifact consistency.

## 0.4.0 - 2026-09-01

- Add compact project state in `.super-pm/state.yaml` for session recovery.
- Add structured validation records in `.super-pm/validations.md`.
- Add recovery summary, validation recording, and state update tools.
- Preserve the rule that records require explicit user authorization and executed evidence.

## 0.3.0 - 2026-09-01

- Add draft-only handoff from confirmed product decisions to native DSH Task Board `board_sync` operations.
- Add validation-task generation with source decision, non-goals, and acceptance boundaries.
- Add DSH integration guidance for review-before-create task delivery.

## 0.2.0 - 2026-09-01

- Add explicit-project Super PM decision tools for reading, saving, history, and validation.
- Add project-isolated atomic persistence for `.super-pm/decisions.md`.
- Add decision deduplication, supersede lineage, validation, and offline tests.
- Add DeepSeek Harness integration rules and a DSH decision-loop example.

## 0.1.0 - 2026-08-31

- Package the upstream `super-pm` Agent Skill as a self-contained DSH plugin.
- Add a DSH bundle patch for the package-local Skill root.
- Add local validation and GitHub/npm installation documentation.
