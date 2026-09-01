# Decision Memory

Use this schema only for confirmed product decisions that should survive the current conversation. Keep `.super-pm/decisions.md` compact and readable; do not turn it into a transcript.

```markdown
## <stable decision ID>: <decision question>

- Status: current | superseded
- Date: YYYY-MM-DD
- Decision: <confirmed direction>
- Negative Boundary: <must not; not now; hard constraints; protected qualities>
- Evidence: <facts or observed results supporting the decision>
- To validate: <unresolved high-impact assumptions>
- Next validation: <method, sample, decision threshold, and next action>
- Revisit trigger: <evidence, date, scale, cost, or constraint that reopens the decision>
- Owner: <known owner or Pending>
- Supersedes: <decision ID or None>
- Superseded by: <decision ID or None>
- Change reason: <required when the decision replaces an earlier one>
```

## Update Rules

1. Keep the ID stable while the decision direction is unchanged.
2. Update evidence, validation status, owner, or revisit trigger in place when the decision remains unchanged.
3. When the direction changes, create a new ID, mark the prior record `superseded`, link `Supersedes` and `Superseded by`, and record the change reason.
4. Surface unresolved conflicts between the file and the current request before using either as a constraint.
5. Preserve confirmed history; remove a record only when the user explicitly asks to delete it.
