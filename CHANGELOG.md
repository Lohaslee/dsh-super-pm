# Changelog

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
