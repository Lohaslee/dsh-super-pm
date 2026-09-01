# Worked Examples

## 1. Automatic Meeting-Note Delivery

### User Question

“Our AI meeting notes can already produce a summary. Should we add automatic delivery to every attendee after the meeting?”

Known facts: summary generation works; authorization preferences, wrong-send rate, and edit rate are unknown.

### User-Facing Answer

Do not enable automatic delivery by default in this release. Start with “preview, then host confirms delivery.” It still reduces copy-and-paste without sending incorrect or sensitive content to everyone automatically.

**俞老师's primary view**: The user needs a trustworthy summary delivered with less effort, not automation for its own sake. Measure confirmation, edit, and abandonment rates to see whether the action creates real value.

**乔帮主's challenge**: If confirmation saves little time over copy-and-paste, do not build even this flow. Technical feasibility is not a reason to add another button.

Protect the **Negative Boundary**, meaning what must not happen and what this release explicitly excludes:

- Must not: send incorrect, sensitive, or unapproved content to all attendees.
- Not now: automatic delivery to external contacts or complex approval chains.
- Protected quality: the user retains final control over content and recipients.

Next, validate only “preview and confirm” with a clickable prototype and manual delivery across 20 meetings. If fewer than 40% of hosts confirm delivery, or more than 30% of summaries need substantial edits, improve summary quality and editing before continuing delivery automation.

### Why The Workflow Stops Here

The question now has a reversible, testable scope decision. Do not require mode selection, a complete Decision Brief, all five product dimensions, or a PRD. Expand permissions, recovery, audit, and notification experience only when the feature enters implementation.

## 2. Last-Minute Home-Care Cancellation

### User Question

“A home-care worker cancels two hours before a scheduled visit. Is an automatic refund enough?”

Known facts: some customers live alone; the service can contact customers and emergency contacts; there is no backup-worker dispatch mechanism.

### User-Facing Answer

A refund is not enough. For a customer who lives alone, returning the money does not resolve who will help, when help will arrive, or whether the customer is safe.

**想哥's primary view**: Validate a three-level recovery process with human dispatch: confirm the customer's status within 10 minutes; prioritize a replacement; otherwise let the customer choose a delay or reschedule. Escalate immediate safety risks to an emergency contact or local emergency services, and do not present ordinary home care as medical response.

**军哥's challenge**: Permanent backup capacity for every order may make costs unsustainable. Start with higher-risk customers, core service areas, and defined hours, then expand only if the model works.

Two frameworks matter here: **Use and Delivery**, meaning who contacts the customer, takes ownership, and restores the service after interruption; and **Experience and Trust**, meaning the service must not hide the cancellation or falsely show “on the way.” Also protect the Negative Boundary:

- Must not: issue a refund without confirming that a customer who lives alone has an understood next arrangement.
- Not now: build medical emergency response or promise guaranteed arrival without the capacity to deliver it.
- Protected qualities: transparent status, customer choice, and one accountable owner for every exception.

Next, use a human on-call operator for 30 cancellation incidents in one area. Aim to contact at least 90% of customers within 10 minutes, give at least 80% a replacement or confirmed alternative within 30 minutes, and close no case without a clear arrangement. Record recovery cost per incident before building automated dispatch.

## 3. A Vague One-Sentence Idea

### User Question

“I want to build a product that helps people stick to their goals.”

### First Response

Do not start with check-ins, reminders, or leaderboards. First, help rule out three ways the product could go wrong:

1. Must it avoid streak loss, shame, or anxiety as pressure to continue?
2. Is public ranking or friend supervision explicitly out of scope for this release?
3. Which person and moment should come first: someone who cannot start, someone who starts and then stops, or someone with too many goals to choose from?

### User Clarification

“No punishment and no social features for now. Start with people who know what to do but delay until they never begin.”

### Converged Response

Then do not build an all-purpose goal manager in the first release. Test a narrower promise: help someone who already knows the goal complete the first two-minute action at the moment they usually delay.

The provisional **Negative Boundary** is: no streak punishment or anxiety-driven pressure; no public ranking or friend supervision; no long-term review or complex goal planning yet. Based on the current description, treat the ability to restart without penalty after an interruption as a protected-quality assumption to confirm, not as an established fact.

**梁老师's reminder**: The emotion here is not a lack of goals but the self-blame and pressure that build while the user fails to start. Help the user cross that first small threshold instead of giving them another plan to maintain.

Next, recruit eight people who regularly delay starting and run a three-day concierge test. Each day, rewrite one task into a first action that takes under two minutes. If at least five begin within 10 minutes of receiving that action, then consider reminders, progress, and retention. Otherwise, improve the specificity of the first action before adding features.

### Why This Example Starts With Exclusions

When the user supplies only a vague sentence, concrete options to reject are easier to answer than a request for a complete vision. These three questions are enough to form a provisional direction, so do not traverse every product dimension or generate a PRD.
