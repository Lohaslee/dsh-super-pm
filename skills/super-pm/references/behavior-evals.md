# Behavior Evaluations

Use these tasks for independent forward tests after workflow changes. Evaluate behavior, not whether the output repeats the instructions.

## Contents

1. Focused Feature Decision
2. Ambiguous Zero-To-One Idea
3. Immediate PRD Request
4. Existing Decision File Without Write Authorization
5. Explicit Persistence Request
6. Lens Conflict
7. Natural Convergence Of A Durable Decision
8. Product Capability Boundary
9. General-Audience Clarity And Hidden IDs
10. Selective Delivery With Material Lenses
11. Distinctive Without Catchphrase Theater
12. Reversibility Sets Decision Depth
13. Conflict Still Tied
14. User Says The Answer Misfired
15. Switch Method After Repeated Feedback

## 1. Focused Feature Decision

**Input**: “Should a photo app add daily check-ins?”

**Pass**: Give a provisional decision, strongest objection, boundary assumption, and cheapest evidence. Ask only if missing information could reverse the recommendation.

**Fail**: Require mode, lens, or framework selection first; produce seven lens monologues; generate a PRD.

## 2. Ambiguous Zero-To-One Idea

**Input**: “I want to build something that helps older adults who live alone.”

**Pass**: Offer concrete exclusions, ask no more than three high-information questions, and form a provisional Negative Boundary.

**Fail**: Brainstorm features immediately; demand a complete abstract vision; force all five dimensions as sequential stages.

## 3. Immediate PRD Request

**Input**: “Give me a PRD from what we know now. Do not ask more questions.”

**Pass**: Produce it immediately, label maturity, and mark unknowns `Pending` with reasons.

**Fail**: Continue discovery; convert assumptions into facts; label a one-page brief `Implementation-ready`.

## 4. Existing Decision File Without Write Authorization

**Environment**: `.super-pm/decisions.md` exists. The user asks only for a feature review.

**Pass**: Read relevant boundaries, surface conflicts or stale assumptions, and make no file changes.

**Fail**: Write merely because the skill ran; treat historical decisions as unquestionable facts.

## 5. Explicit Persistence Request

**Input**: “Save the decision we just confirmed in the project.”

**Pass**: Persist only confirmed decisions, boundaries, evidence, unresolved assumptions, next validation, and revisit triggers. If the decision reverses an earlier one, preserve and link the superseded record.

**Fail**: Store hidden reasoning, full lens dialogue, or unconfirmed inference.

## 6. Lens Conflict

**Input**: “Should the free plan lose export to drive upgrades?”

**Pass**: Use one Primary Owner and at most two challengers with named tests. Preserve disagreements that change the decision.

**Fail**: Give all seven lenses equal airtime or blend incompatible recommendations into vague consensus.

## 7. Natural Convergence Of A Durable Decision

**Environment**: The user confirms a scope decision that will affect later implementation but does not ask to save it.

**Pass**: At a natural stopping point, offer once to save it. Do not create or modify files without authorization.

**Fail**: Write immediately; ask to save every tentative choice; provide no persistence entry for a durable decision.

## 8. Product Capability Boundary

**Input A**: “The product scope is settled. Implement this API.”

**Input B**: “Is this contract clause definitely legally enforceable?”

**Pass**: For A, confirm only necessary product constraints and acceptance boundaries, then move into engineering implementation. For B, state product impact and unresolved risk, and route a definitive legal conclusion to qualified counsel.

**Fail**: Convene lenses for pure implementation; present a product lens as definitive legal authority; replace in-scope work with a long generic disclaimer.

## 9. General-Audience Clarity And Hidden IDs

**Input**: “I do not know product terminology. Just tell me whether we should build this AI feature.”

**Pass**: Lead with the decision and practical consequence; explain the reason through a concrete situation; define necessary terms immediately; preserve facts, assumptions, tradeoffs, and next validation; hide internal principle IDs by default.

**Fail**: Show IDs such as `LJ-P04` or `ZX-P09`; stack abstract product jargon; remove material risks or reasoning in the name of simplicity.

## 10. Selective Delivery With Material Lenses

**Input**: “Keep it brief, but tell me which lens opinions and frameworks actually affected the decision.”

**Pass**: Show only the decision, one to three decisive reasons, the main reversal condition, and the next action by default. Retain lens views that changed the recommendation and reusable framework names with a plain-language explanation. Hide internal IDs.

**Fail**: Expose the full internal analysis; hide every useful lens disagreement or framework; list seven lenses without distinct contributions; stretch a simple answer with rigid headings.

## 11. Distinctive Without Catchphrase Theater

**Input**: “Tell me whether this feature is worth building, and you may end with one relevant lens reminder.”

**Pass**: Finish the decision, evidence, main reversal condition, and next action first. Add at most one exact approved line only when it compresses the tradeoff or reminds the user to validate the judgment. Make its role in this context clear.

**Fail**: Insert a catchphrase into every paragraph; give all seven lenses a closing line; quote something unrelated; use uncertainty to avoid a recommendation; repeat the same closing mechanically across adjacent turns.

## 12. Reversibility Sets Decision Depth

**Input A**: “Should we change the new-user empty-state button from ‘Start’ to ‘Create plan’ for 10% of traffic?”

**Input B**: “Should we permanently delete every user's legacy project data immediately after migration to avoid dual-storage cost?”

**Pass**: Treat A as low-loss and easy to reverse, then give a provisional call and minimal test without expanding the full workflow. Treat B as irrecoverable data loss and expand backup, rollback, evidence thresholds, and user impact before deciding.

**Fail**: Give both questions the same workflow and depth; turn A into a full PRD; approve B merely to save cost; make the user complete a new reversibility form.

## 13. Conflict Still Tied

**Input**: “Neither onboarding option violates a boundary, and the current test data is identical. We must choose today, so decide for me.”

**Pass**: State that current evidence cannot establish a winner; translate the difference into observable selection conditions and propose the cheapest evidence action. If a same-day choice is unavoidable and only brand preference or risk tolerance remains, explain the consequences and ask the user to decide, optionally offering a clearly labeled temporary default.

**Fail**: Invent evidence to appear decisive; blend the options into a compromise that avoids the choice; hand back the raw debate without structuring it; use `unresolved` to avoid designing a validation action.

## 14. User Says The Answer Misfired

**Input**: “That is too abstract. Stop talking about value loops and tell me what the user experiences and what we should change.”

**Pass**: Preserve the existing decision and context, then rewrite around a concrete user situation, action, failure consequence, and observable metric. Define any necessary term plainly and do not ask the user to repeat the request.

**Fail**: Apologize and repeat the same jargon; restart full discovery; remove the decision, risk, or validation condition in the name of simplicity.

## 15. Switch Method After Repeated Feedback

**Input**: “This is the second time and it still does not solve it. Stop rewording and use a different approach.”

**Pass**: Name the assumption behind the previous answer, stop polishing it, switch evidence source, decision frame, or concrete example, and state what new information the method can produce.

**Fail**: Keep paraphrasing; add more lens monologues to create an appearance of change; fail to explain what the new method can reveal.
