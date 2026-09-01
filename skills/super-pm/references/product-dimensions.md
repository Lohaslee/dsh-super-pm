# Adaptive Product Dimensions

Use this framework as a decision map, not a fixed sequence or a completeness checklist. It must work for software, AI, hardware, services, content, marketplaces, enterprise products, and offline experiences.

Always resolve demand, value, and the Negative Boundary. Select the remaining dimensions and cross-cutting constraints only when they can change the product decision. State what is intentionally skipped.

## Selection Rule

Start with the product's actual delivery system:

| Product type | Usually emphasize | Add when material |
|---|---|---|
| Software or app | demand and value; product system; use lifecycle; touchpoints | data, privacy, accessibility, distribution, support |
| AI product | demand and value; model-enabled mechanism; interaction and recovery; trust | data rights, uncertainty, human oversight, evaluation, cost |
| Hardware or physical product | product system; use and ownership lifecycle; physical form | manufacturing, supply, safety, repair, packaging, retail |
| Service | demand and value; service journey; people and operations; recovery | capacity, training, scripts, location, policy, unit economics |
| Content or community | demand and value; content system; participation lifecycle | governance, recommendation, creator incentives, moderation |
| Marketplace or platform | multi-party value; rules and incentives; transaction lifecycle | liquidity, trust, disputes, compliance, ecosystem health |
| Enterprise product | stakeholder value; workflow and system fit; adoption lifecycle | procurement, permissions, integration, migration, administration |
| Offline place or event | demand and value; spatial and service journey; physical touchpoints | capacity, staffing, safety, accessibility, weather, logistics |

The table is a starting point, not a taxonomy. A product can combine several types.

## Dependency Model

`Negative Boundary -> demand and value -> product mechanism and system boundary -> use and delivery lifecycle -> touchpoints and form -> experience and trust -> acceptance checks`

This is a dependency direction, not a waterfall. A downstream contradiction should reopen the earliest affected decision and propagate the change forward.

## 1. Demand And Value

Always include this dimension.

Answer:

- Who is the primary user, customer, beneficiary, buyer, or operator in a specific situation?
- What progress, outcome, relief, identity, or obligation matters to them?
- What do they do today, and why is that alternative still acceptable?
- What value is created, exchanged, captured, or imposed on each important participant?
- Why is this problem worth solving now?
- Which observable result would prove the product bet?

Produce:

- Primary and excluded participants.
- Situation, unmet need, current alternative, and switching barrier.
- Product promise and product objective.
- Value exchange and one primary success signal with guardrails.
- Strategic assumptions and cheapest validation.

Exit when the product can be described without listing features or touchpoints.

## 2. Product System And Scope

Use this dimension when the product combines capabilities, content, data, physical components, services, people, partners, or rules.

Answer:

- What is the smallest coherent mechanism that can deliver the promise?
- Which components and capabilities are essential, and which are familiar but unnecessary patterns?
- Where does the product begin and end? What belongs to users, partners, staff, or external systems?
- Which rules, economics, dependencies, and quality thresholds hold the system together?
- What must be complete for the core value to be credible?

Produce:

- Product mechanism and system boundary.
- Components, capabilities, content, data, people, and partner responsibilities where relevant.
- `must`, `later`, and `not doing` scope.
- Business rules, quality thresholds, and acceptance boundaries.
- Traceability from each `must` item to the product promise.

Exit when removing any remaining `must` item breaks the promise and adding a `later` item is unnecessary to test it.

## 3. Use, Operation, And Delivery Lifecycle

Use this dimension whenever value depends on a sequence over time, including discovery, purchase, setup, use, fulfillment, maintenance, support, renewal, disposal, or return.

Answer:

- How does the product reach the user and become ready for use?
- What do users, staff, systems, suppliers, or partners do at each meaningful stage?
- Where can the journey fail, pause, hand off, recover, escalate, or end?
- What happens before first use and after the main value moment?
- Which operational capability is required to keep the promise repeatedly?

Produce:

- User, service, operating, or ownership lifecycle as relevant.
- States, transitions, handoffs, and decision points.
- Fulfillment, maintenance, support, return, interruption, and recovery paths where relevant.
- Roles, service levels, and operational dependencies.
- Failure containment and escalation behavior.

Exit when the product can be delivered repeatedly without inventing a missing actor, state, handoff, or recovery rule.

## 4. Touchpoints And Form

Use this dimension for every place where a person, organization, or system encounters the product.

Touchpoints may include screens, APIs, AI conversations, devices, controls, physical form, packaging, retail, environments, service staff, documents, notifications, channels, or brand communication.

Answer:

- Which touchpoint should carry each decision, action, or piece of information?
- What must be visible, tangible, nearby, persistent, progressive, or intentionally absent?
- Which form best fits the situation, environment, capability, and constraint?
- How does the user know the current state and the next action?
- Which conventions should be preserved, and where should the product be distinct?

Produce:

- Touchpoint inventory and purpose.
- Interface, physical, spatial, conversational, service, or channel form as relevant.
- Information and control hierarchy.
- Navigation, discoverability, packaging, or environmental arrangement where relevant.
- Low-fidelity representations only when they help resolve a product decision.

Exit when the chosen form expresses the lifecycle and product rules without inventing new ones.

For interface-heavy digital products, the classic five-plane sequence may be used as a nested tool: strategy maps to demand and value, scope to product system, structure to lifecycle and information relationships, framework to interface arrangement, and surface to experience expression. Do not impose it on products where physical, operational, commercial, or service decisions dominate.

## 5. Experience, Trust, And Product Character

Use this dimension whenever adoption, comprehension, emotion, safety, reputation, or repeated use depends on how the product is perceived and felt.

Answer:

- What should the product feel like in the target situation?
- Which sensory, verbal, behavioral, material, or interpersonal signals clarify quality and state?
- What must users understand or trust before they act?
- How does the product behave during waiting, uncertainty, failure, recovery, maintenance, and exit?
- Which expression would violate the Negative Boundary or product character?

Produce:

- Product character and trust principles.
- Visual, material, spatial, verbal, motion, audio, haptic, or service direction as relevant.
- Feedback, expectation setting, proof, and recovery language.
- Accessibility, inclusion, privacy, and sensory constraints.
- Positive references, negative references, and forbidden expressions when useful.

Exit when the experience strengthens comprehension, value, and trust without hiding a product-system or delivery weakness.

## Cross-Cutting Constraints

Check only the constraints capable of changing the decision:

- **Business and economics**: pricing, cost structure, incentives, revenue, cash cycle, sustainability.
- **Technology, data, and AI**: feasibility, architecture, model behavior, data rights, evaluation, uncertainty, oversight.
- **Operations and supply**: staffing, manufacturing, sourcing, quality control, capacity, logistics, maintenance.
- **Safety, law, and governance**: physical safety, privacy, security, accessibility, regulation, moderation, accountability.
- **Distribution and adoption**: channel, sales, onboarding, migration, switching cost, education, ecosystem participation.
- **Environmental and lifecycle impact**: durability, repairability, energy, materials, disposal, long-term support.

Do not turn these into boilerplate sections. Name the constraint, the decision it changes, and the acceptance boundary it creates.

## Dimension Decision Record

Use this only when the record improves traceability:

```text
Decision question:
Selected dimension and reason:
Primary Owner:
Evidence and user statements:
Recommendation:
Strongest objection or alternative:
Negative Boundary check:
Decision and rejected alternative:
Remaining assumption and validation threshold:
Downstream constraints:
```
