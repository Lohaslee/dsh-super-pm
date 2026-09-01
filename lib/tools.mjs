import { defineTool } from "@deepseek-ai/dsh-tools";
import { decisionKey, findDuplicate, lineage, parseDocument, serializeDocument, upsert, validate } from "./decisions-core.mjs";
import { projectDecisionPath, readDecisions, writeDecisions } from "./decisions-store.mjs";

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
export const inject = ["tools", "systemPrompt"];

export function apply(ctx) {
  ctx.systemPrompt.section({
    name: "tool:super-pm",
    order: 110,
    text: "Super PM decision tools require an explicit absolute project path. Read decisions before relying on them. Only save a decision after the user explicitly asks to save or modify it; never persist hidden reasoning, unconfirmed assumptions, or full council dialogue."
  });

  ctx.tools.register(defineTool({
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

  ctx.tools.register(defineTool({
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

  ctx.tools.register(defineTool({
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

  ctx.tools.register(defineTool({
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
}
