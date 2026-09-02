import { defineTool } from "@deepseek-ai/dsh-tools";
import { decisionKey, findDuplicate, lineage, parseDocument, serializeDocument, upsert, validate } from "./decisions-core.mjs";
import { projectDecisionPath, readDecisions, writeDecisions } from "./decisions-store.mjs";
import { decisionToBoardOperations } from "./handoff-core.mjs";
import { appendValidation, buildTraceability, parseState, parseValidations, recoverySummary, serializeState, serializeValidations, validateState, validateValidations } from "./project-state-core.mjs";
import { readProjectState, readValidations, writeProjectState, writeValidations } from "./project-state-store.mjs";
import { renderPrd, validatePrd } from "./prd-core.mjs";
import { readPrd, writePrd } from "./prd-store.mjs";
import { easterEgg, productPulse, redactedDecisionCard } from "./share-core.mjs";

const text = (value) => [{ type: "text", text: JSON.stringify(value, null, 2) }];
const string = (description) => ({ type: "string", description });
const requiredString = (description) => ({ type: "string", required: true, description });

const output = {
  type: "object",
  additionalProperties: false,
  properties: {
    file: { type: "string", required: true },
    records: { type: "array", required: true, items: { type: "json" } },
    errors: { type: "array", required: true, items: { type: "json" } }
  }
};

const draftParameters = {
  project: requiredString("Absolute project root. The plugin never guesses this from cwd."),
  question: requiredString("The product decision question, at most 200 characters."),
  decision: requiredString("The confirmed product decision, at most 500 characters."),
  negative_boundary: string("Must-not outcomes or hard constraints."),
  evidence: string("Evidence supporting the decision."),
  to_validate: string("Remaining high-impact assumption."),
  next_validation: string("Cheapest next validation method and threshold."),
  revisit_trigger: string("Evidence or condition that should reopen this decision."),
  owner: string("Decision owner."),
  supersedes: string("Existing decision ID to supersede."),
  change_reason: string("Required when changing an existing decision direction.")
};

function draftFromArgs(args) {
  return {
    question: args.question,
    decision: args.decision,
    negativeBoundary: args.negative_boundary,
    evidence: args.evidence,
    toValidate: args.to_validate,
    nextValidation: args.next_validation,
    revisitTrigger: args.revisit_trigger,
    owner: args.owner,
    date: new Date().toISOString().slice(0, 10)
  };
}

export const name = "super-pm-tools";
// NOTE: `tools` and `systemPrompt` are provided by the base bundle and are NOT
// visible inside this community bundle's Cordis realm (sibling loader entries
// cannot see each other's services). On dsh rc.2 the base bundle scopes these
// services to its own context, so a separate community bundle cannot statically
// inject them. We drop them from the static inject and register everything
// lazily via ctx.inject: when the host exposes them in this realm the tools and
// the prompt section activate; otherwise the plugin still loads (the skill
// mounts and the decision tools stay inactive until a compatible dsh release
// provides the services in this bundle's realm).
export const inject = [];

export function apply(ctx) {
  ctx.inject(["tools", "systemPrompt"], (c) => {
    c.systemPrompt.section({
    name: "tool:super-pm",
    order: 110,
      text: "Super PM decision tools require an explicit absolute project path. Read decisions before relying on them. Only save a decision after the user explicitly asks to save or modify it; never persist hidden reasoning, unconfirmed assumptions, or full council dialogue. Fun and sharing features are opt-in, low-noise, and must not disclose project paths or private discussion."
  });

  c.tools.register(defineTool({
    name: "super_pm_read_decisions",
    description: "Read the current Super PM product decisions for one explicit project root.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd.") },
    output: { schema: output, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      const loaded = await readDecisions(args.project);
      const parsed = parseDocument(loaded.text);
      return { file: loaded.file, records: parsed.records, errors: parsed.errors };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_save_decision",
    description: "Save a user-confirmed Super PM product decision, preserving superseded history.",
    parameters: draftParameters,
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          op: { type: "string", required: true },
          id: { type: "string", required: true },
          links: { type: "array", required: true, items: { type: "string" } },
          file: { type: "string", required: true }
        }
      },
      render: (_args, value) => text(value)
    },
    async execute(args) {
      const loaded = await readDecisions(args.project);
      const parsed = parseDocument(loaded.text);
      if (parsed.errors.length) throw new Error(`refusing to overwrite invalid decisions file: ${parsed.errors.map((error) => error.code).join(", ")}`);
      const draft = draftFromArgs(args);
      const result = upsert(parsed.records, draft, { changeReason: args.change_reason });
      if (result.errors?.length) throw new Error(result.errors.map((error) => error.message).join("; "));
      const serialized = serializeDocument(result.records);
      const saved = await writeDecisions(args.project, serialized);
      return { op: result.op, id: result.id, links: result.links || [], file: saved.file };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_decision_history",
    description: "Read one product decision and its supersede lineage from an explicit project root.",
    parameters: {
      project: requiredString("Absolute project root; never inferred from cwd."),
      id: string("Decision ID, such as DEC-0001."),
      question: string("Decision question used to locate the current record.")
    },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          file: { type: "string", required: true },
          record: { type: "json" },
          lineage: { type: "array", required: true, items: { type: "json" } },
          errors: { type: "array", required: true, items: { type: "json" } }
        }
      },
      render: (_args, value) => text(value)
    },
    isConcurrencySafe: () => true,
    async execute(args) {
      const loaded = await readDecisions(args.project);
      const parsed = parseDocument(loaded.text);
      const record = args.id ? parsed.records.find((item) => item.id === args.id) : findDuplicate(parsed.records, args.question || "");
      return { file: loaded.file, record: record || null, lineage: record ? lineage(parsed.records, record.id) : [], errors: parsed.errors };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_prepare_handoff",
    description: "Prepare confirmed product decisions as board_sync operations without modifying the Task Board.",
    parameters: {
      project: requiredString("Absolute project root; never inferred from cwd."),
      decision_id: requiredString("Existing confirmed decision ID, such as DEC-0001."),
      validations: { type: "array", description: "Optional validation task drafts.", items: { type: "json" } }
    },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          project_path: { type: "string", required: true },
          source_decision: { type: "json", required: true },
          operations: { type: "array", required: true, items: { type: "json" } },
          next_action: { type: "string", required: true }
        }
      },
      render: (_args, value) => text(value)
    },
    isConcurrencySafe: () => true,
    async execute(args) {
      const loaded = await readDecisions(args.project);
      const parsed = parseDocument(loaded.text);
      if (parsed.errors.length) throw new Error(`cannot prepare handoff from invalid decisions file: ${parsed.errors.map((error) => error.code).join(", ")}`);
      const decision = parsed.records.find((record) => record.id === args.decision_id);
      if (!decision) throw new Error(`decision not found: ${args.decision_id}`);
      if (decision.status !== "current") throw new Error("only current decisions can be handed off");
      return {
        project_path: args.project,
        source_decision: { id: decision.id, question: decision.question, decision: decision.decision },
        operations: decisionToBoardOperations(decision, args.validations || []),
        next_action: "Review these operations with the user, then call board_sync with the same project_path and operations after explicit confirmation."
      };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_recovery_summary",
    description: "Read the explicit project's current Super PM state, decisions, and recent validations for session recovery.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd.") },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      const [stateFile, decisionFile, validationFile] = await Promise.all([readProjectState(args.project), readDecisions(args.project), readValidations(args.project)]);
      const state = parseState(stateFile.text);
      const decisions = parseDocument(decisionFile.text);
      const validations = parseValidations(validationFile.text);
      return { project: args.project, state: state.state, decisions: decisions.records, validations: validations.records, summary: recoverySummary(state.state, decisions.records, validations.records), errors: [...state.errors, ...decisions.errors, ...validations.errors] };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_record_validation",
    description: "Record an explicit product validation result in the project's validations file.",
    parameters: {
      project: requiredString("Absolute project root; never inferred from cwd."),
      title: requiredString("Short validation title."),
      hypothesis: requiredString("Hypothesis being tested."),
      predicted: string("Predicted behavior or outcome."),
      method: requiredString("Method and sample."),
      threshold: requiredString("Decision threshold."),
      observed: requiredString("Observed result."),
      interpretation: requiredString("Interpretation of the result."),
      decision_change: string("Decision changed or retained."),
      next_action: requiredString("Next action."),
      decision_id: string("Related decision ID.")
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    async execute(args) {
      const loaded = await readValidations(args.project);
      const parsed = parseValidations(loaded.text);
      if (parsed.errors.length) throw new Error(`refusing to overwrite invalid validations file: ${parsed.errors.map((error) => error.code).join(", ")}`);
      const result = appendValidation(parsed.records, { title: args.title, hypothesis: args.hypothesis, predicted: args.predicted, method: args.method, threshold: args.threshold, observed: args.observed, interpretation: args.interpretation, decisionChange: args.decision_change, nextAction: args.next_action, decisionId: args.decision_id });
      if (result.errors.length) throw new Error(result.errors.map((error) => error.code).join(", "));
      const saved = await writeValidations(args.project, serializeValidations(result.records));
      return { id: result.record.id, file: saved.validations, record: result.record };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_update_state",
    description: "Update the explicit project's compact Super PM state for future session recovery.",
    parameters: {
      project: requiredString("Absolute project root; never inferred from cwd."),
      stage: string("discovery, validation, delivery, maintenance, or paused."),
      objective: string("Current product objective."),
      lead: string("Current product decision owner."),
      current_decision: string("Current decision summary or ID."),
      open_assumptions: { type: "array", items: { type: "string" }, description: "Open high-impact assumptions." },
      last_validation: string("Latest validation ID."),
      next_action: string("Next concrete product action.")
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    async execute(args) {
      const loaded = await readProjectState(args.project);
      const parsed = parseState(loaded.text);
      if (parsed.errors.length) throw new Error(`refusing to overwrite invalid state file: ${parsed.errors.map((error) => error.code).join(", ")}`);
      const state = { ...parsed.state, ...(args.stage === undefined ? {} : { stage: args.stage }), ...(args.objective === undefined ? {} : { objective: args.objective }), ...(args.lead === undefined ? {} : { lead: args.lead }), ...(args.current_decision === undefined ? {} : { currentDecision: args.current_decision }), ...(args.open_assumptions === undefined ? {} : { openAssumptions: args.open_assumptions }), ...(args.last_validation === undefined ? {} : { lastValidation: args.last_validation }), ...(args.next_action === undefined ? {} : { nextAction: args.next_action }), updated: new Date().toISOString().slice(0, 10) };
      const errors = validateState(state);
      if (errors.length) throw new Error(errors.map((error) => error.code).join(", "));
      const saved = await writeProjectState(args.project, serializeState(state));
      return { file: saved.state, state };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_traceability_report",
    description: "Build a read-only decision-to-validation-to-Task-Board traceability report for one explicit project.",
    parameters: {
      project: requiredString("Absolute project root; never inferred from cwd."),
      tasks: { type: "array", items: { type: "json" }, description: "Optional board_get tasks supplied by the native DSH Task Board tool." }
    },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      const [stateFile, decisionFile, validationFile] = await Promise.all([readProjectState(args.project), readDecisions(args.project), readValidations(args.project)]);
      const state = parseState(stateFile.text);
      const decisions = parseDocument(decisionFile.text);
      const validations = parseValidations(validationFile.text);
      const tasks = Array.isArray(args.tasks) ? args.tasks : [];
      return { project: args.project, traceability: buildTraceability(decisions.records, validations.records, tasks), errors: [...state.errors, ...decisions.errors, ...validations.errors] };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_generate_prd",
    description: "Generate a reviewable PRD from explicit confirmed project context without writing files.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd."), input: { type: "json", required: true, description: "PRD fields based on confirmed product context." } },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      const document = renderPrd({ ...args.input, project: args.project });
      return { project: args.project, document, errors: validatePrd(args.input), next_action: "Review this document before saving it or handing it to an implementation team." };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_save_prd",
    description: "Save a user-confirmed PRD to the explicit project after validation.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd."), input: { type: "json", required: true, description: "Confirmed PRD fields." } },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    async execute(args) {
      const errors = validatePrd(args.input);
      if (errors.length) throw new Error(errors.map((error) => error.message).join("; "));
      const saved = await writePrd(args.project, renderPrd({ ...args.input, project: args.project }));
      return { file: saved.file, maturity: args.input.maturity };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_validate_prd",
    description: "Validate a PRD payload or the saved PRD in one explicit project without modifying it.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd."), input: { type: "json", description: "Optional PRD fields; omit to validate the saved PRD's presence." } },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      if (args.input) return { file: null, errors: validatePrd(args.input) };
      const saved = await readPrd(args.project);
      return { file: saved.file, errors: saved.text ? [] : [{ code: "MISSING_PRD", message: "no saved PRD exists" }] };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_share_decision",
    description: "Create an opt-in, redacted Markdown decision card for copying or sharing.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd."), decision_id: requiredString("Current decision ID."), include_evidence: { type: "boolean", description: "Include only the decision's evidence field when explicitly requested." } },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      const loaded = await readDecisions(args.project);
      const parsed = parseDocument(loaded.text);
      const decision = parsed.records.find((record) => record.id === args.decision_id);
      if (!decision) throw new Error(`decision not found: ${args.decision_id}`);
      return { card: redactedDecisionCard(decision, { includeEvidence: args.include_evidence === true }), privacy: "No project path, owner, hidden reasoning, or full discussion is included." };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_product_pulse",
    description: "Show a lightweight product clarity pulse from one decision and its validations.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd."), decision_id: requiredString("Decision ID to assess.") },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      const [decisionFile, validationFile] = await Promise.all([readDecisions(args.project), readValidations(args.project)]);
      const decisions = parseDocument(decisionFile.text);
      const validations = parseValidations(validationFile.text);
      const decision = decisions.records.find((record) => record.id === args.decision_id);
      if (!decision) throw new Error(`decision not found: ${args.decision_id}`);
      return { decision_id: args.decision_id, pulse: productPulse(decision, validations.records.filter((item) => item.decisionId === args.decision_id)) };
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_discover_easter_egg",
    description: "Check for an opt-in Super PM easter egg without changing project state.",
    parameters: { phrase: string("User-provided phrase or context."), completed_decisions: { type: "number", description: "Optional number of completed product decisions." }, event: string("Optional meaningful milestone, such as scope-cut, first-validation, decision-reversal, or taskboard-handoff."), random: { type: "boolean", description: "Allow a low-probability stateless random discovery." } },
    output: { schema: { type: "object", additionalProperties: true }, render: (_args, value) => text(value) },
    isConcurrencySafe: () => true,
    async execute(args) {
      return easterEgg(args.phrase, { completedDecisions: args.completed_decisions, random: args.random === true, event: args.event });
    }
  }));

  c.tools.register(defineTool({
    name: "super_pm_validate_decisions",
    description: "Validate the Super PM decisions file for one explicit project root without modifying it.",
    parameters: { project: requiredString("Absolute project root; never inferred from cwd.") },
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          file: { type: "string", required: true },
          errors: { type: "array", required: true, items: { type: "json" } }
        }
      },
      render: (_args, value) => text(value)
    },
    isConcurrencySafe: () => true,
    async execute(args) {
      const loaded = await readDecisions(args.project);
      return { file: loaded.file, errors: validate(parseDocument(loaded.text).records) };
    }
  }));
  });
}
