# Adaptive PRD Template

Choose the smallest artifact that supports the next decision. Use the one-page brief for solo work, early alignment, or a compact decision handoff. Use the full PRD only when the user requests it or the product is ready for implementation or delivery handoff. A PRD is a carrier for product decisions, not proof that the product has been understood.

## One-Page Decision Brief

Do not label this brief `Implementation-ready`. Keep it to one page where practical:

1. **Decision**: the decision question, direct recommendation, and maturity.
2. **User value**: primary user, situation, unmet need, current alternative, and decisive product promise.
3. **Negative Boundary**: `must not`, `not now`, hard constraints, and protected qualities.
4. **Scope**: `must`, `later`, and `not doing`.
5. **Evidence**: known facts, highest-impact assumption, strongest objection, and what would reverse the decision.
6. **Next validation**: cheapest method, sample, threshold, owner, and next action.

Use the remaining sections only for the full PRD.

Keep the core short. Add only the product-type modules that affect delivery. Do not fill sections for completeness; write `Not applicable` or `Pending` with a reason.

At the top, state:

- **Artifact maturity**: `Snapshot`, `Draft`, or `Implementation-ready`.
- **Coverage**: discussion, evidence, repository or product state, selected dimensions, and excluded dimensions.
- **Known gaps**: decisions or evidence blocking the next maturity level.
- **Collaboration model**: `Dynamic council` or `Lead-PM collaboration`, including the Lead PM when selected.
- **Intended handoff**: AI coding agent, engineering team, design, operations, manufacturing, service delivery, or another owner.

When requested before discovery is complete, produce the PRD immediately from confirmed information. Never convert missing information into confident prose.

## Core 1. Product Decision Summary

- One-sentence product definition.
- Primary user, customer, beneficiary, buyer, or operator and situation.
- Current alternative and switching barrier.
- Product promise and decisive mechanism.
- Primary success signal and guardrails.
- Recommended decision and current maturity.
- Lead PM and Primary Owner for the current decision when relevant.

## Core 2. Negative Boundary

### Must not

### Not now

### Hard constraints

### Protected qualities

For each item, state the product decision and acceptance check it constrains.

## Core 3. Evidence, Assumptions, And Validation

| Statement | Type: fact, user statement, assumption, inference, or recommendation | Confidence | Validation status |
|---|---|---|---|

For each high-impact assumption, include:

| Hypothesis | Predicted behavior or outcome | Method and sample | Decision threshold | Observed result | Interpretation | Decision changed or retained |
|---|---|---|---|---|---|---|

Leave result fields `Pending` until evidence exists. Record whether the user authorized external research, competitor inspection, or prototype execution.

## Core 4. Selected Product Dimensions

Use [product-dimensions.md](product-dimensions.md). Include only dimensions that change the product:

- **需求与价值**: participants, situation, need, alternative, value exchange, objective.
- **产品系统**: mechanism, system boundary, components, rules, economics, scope.
- **使用与交付**: use, operating, ownership, fulfillment, support, and recovery lifecycle.
- **触点与形态**: interface, device, physical form, service, channel, environment, or communication touchpoints.
- **体验与信任**: product character, comprehension, feedback, quality signals, accessibility, safety, and trust.

For every selected dimension, record the decision, supporting evidence, material alternative, rejected option, remaining assumption, and downstream constraint. Do not create separate lens monologues unless a disagreement remains decision-relevant.

## Core 5. Scope And Acceptance

### Must deliver

For each item, state:

- user or system need;
- required behavior or outcome;
- responsible component, actor, or touchpoint;
- business or operating rule;
- failure and recovery behavior where relevant;
- acceptance boundary;
- metric contribution.

### Later

### Not doing

An AI coding agent or delivery team must not silently decide unresolved product questions.

## Core 6. Decision Constraint Chain

| Upstream need or boundary | Product mechanism or scope rule | Lifecycle or operating behavior | Touchpoint, form, experience, or trust constraint | Acceptance check |
|---|---|---|---|---|

## Core 7. Delivery, Measurement, And Open Decisions

- Primary metric, leading indicators, and guardrails.
- Events, observations, or operational data required.
- Dependencies and technical, commercial, policy, supply, or organizational constraints.
- Milestones appropriate to the product type.
- Release, launch, rollout, production, service-readiness, or rollback approach.
- Owners when known.
- Stop conditions and escalation boundaries.
- Open decisions, accepted risks, and revisit triggers.

## Optional Product-Type Modules

Add only what materially affects delivery.

### Software And Interface

- Objects, relationships, states, permissions, and transitions.
- Primary and secondary flows.
- Screen or surface inventory, navigation, information priority, and controls.
- Empty, loading, error, interruption, and recovery states.
- Integration, migration, analytics, privacy, accessibility, and support requirements.

### AI And Data

- Model-enabled value and non-AI fallback.
- Input, output, context, memory, and data-rights boundaries.
- Quality evaluation, uncertainty expression, guardrails, and refusal behavior.
- Human oversight, correction, audit, and incident handling.
- Latency, cost, reliability, privacy, security, and model-change acceptance checks.

### Hardware And Physical Product

- Physical architecture, materials, dimensions, controls, environment, and ergonomics.
- Safety, reliability, durability, certification, and quality thresholds.
- Manufacturing, sourcing, assembly, testing, packaging, logistics, repair, and disposal.
- Firmware, software, service, or accessory dependencies.

### Service And Operations

- Service blueprint: user actions, frontstage, backstage, systems, and evidence.
- Roles, staffing, training, scripts, capacity, service levels, and handoffs.
- Exceptions, escalation, compensation, recovery, and quality assurance.
- Location, scheduling, channel, and operating-cost constraints.

### Marketplace, Platform, Content, Or Community

- Participant roles, value exchange, incentives, permissions, and governance.
- Supply, demand, liquidity, cold start, quality, ranking, and discovery.
- Creation, review, moderation, dispute, abuse, and appeal paths.
- Ecosystem health and party-specific guardrail metrics.

### Commercialization And Adoption

- Packaging, pricing, margin, sales, channel, and unit economics.
- Acquisition, onboarding, education, migration, and switching plan.
- Launch promise, proof, reputation mechanism, retention, and expansion.
- Commercial assumptions and thresholds that would change the plan.

## Material Decision Log

Include only decisions where alternatives or lens disagreements changed the outcome:

| Decision question | Primary Owner | Direct recommendation | Challenger and named test | Evidence | Final decision | Rejected alternative | Revisit trigger |
|---|---|---|---|---|---|---|---|
