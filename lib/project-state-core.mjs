export const MAX_VALIDATIONS = 300;
export const MAX_STATE_BYTES = 32 * 1024;
export const MAX_VALIDATIONS_BYTES = 256 * 1024;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^VAL-\d{4,}$/;
const STATES = new Set(["discovery", "validation", "delivery", "maintenance", "paused"]);
const clean = (value) => typeof value === "string" ? value.trim() : "";

function nextId(records) {
  const max = records.reduce((value, record) => {
    const match = /^VAL-(\d+)$/.exec(record.id || "");
    return match ? Math.max(value, Number(match[1])) : value;
  }, 0);
  return `VAL-${String(max + 1).padStart(4, "0")}`;
}

function yamlQuote(value) {
  return JSON.stringify(clean(value));
}

function parseScalar(value) {
  const text = value.trim();
  if (text === "null") return null;
  if (text === "true") return true;
  if (text === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    try { return JSON.parse(text); } catch { return text.slice(1, -1); }
  }
  return text;
}

export function defaultState() {
  return {
    schema: 1,
    stage: "discovery",
    objective: "",
    lead: "",
    currentDecision: "",
    openAssumptions: [],
    lastValidation: "",
    nextAction: "",
    updated: ""
  };
}

export function serializeState(input = {}) {
  const state = { ...defaultState(), ...input };
  const lines = [
    `schema: ${state.schema || 1}`,
    `stage: ${yamlQuote(state.stage)}`,
    `objective: ${yamlQuote(state.objective)}`,
    `lead: ${yamlQuote(state.lead)}`,
    `currentDecision: ${yamlQuote(state.currentDecision)}`,
    "openAssumptions:"
  ];
  for (const assumption of Array.isArray(state.openAssumptions) ? state.openAssumptions : []) lines.push(`  - ${yamlQuote(assumption)}`);
  lines.push(
    `lastValidation: ${yamlQuote(state.lastValidation)}`,
    `nextAction: ${yamlQuote(state.nextAction)}`,
    `updated: ${yamlQuote(state.updated)}`,
    ""
  );
  return lines.join("\n");
}

export function parseState(text) {
  const state = defaultState();
  const errors = [];
  let list = false;
  for (const line of String(text || "").split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (line.trim() === "openAssumptions:") { list = true; continue; }
    if (list && /^\s+-\s+/.test(line)) { state.openAssumptions.push(parseScalar(line.replace(/^\s+-\s+/, ""))); continue; }
    list = false;
    const match = /^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/.exec(line);
    if (!match) { errors.push({ code: "BAD_STATE_LINE", line }); continue; }
    if (!(match[1] in state)) { errors.push({ code: "UNKNOWN_STATE_FIELD", field: match[1] }); continue; }
    state[match[1]] = parseScalar(match[2]);
  }
  errors.push(...validateState(state));
  return { state, errors: [...new Map(errors.map((error) => [`${error.code}:${error.field || error.line || ""}`, error])).values()] };
}

export function validateState(state) {
  const errors = [];
  if (state.schema !== 1) errors.push({ code: "BAD_SCHEMA", message: "state schema must be 1" });
  if (!STATES.has(state.stage)) errors.push({ code: "BAD_STAGE", message: "unknown product stage" });
  if (state.updated && !DATE_RE.test(state.updated)) errors.push({ code: "BAD_DATE", field: "updated", message: "updated must be YYYY-MM-DD" });
  if (!Array.isArray(state.openAssumptions)) errors.push({ code: "BAD_ASSUMPTIONS", message: "openAssumptions must be an array" });
  for (const [field, limit] of [["objective", 500], ["lead", 200], ["currentDecision", 500], ["lastValidation", 500], ["nextAction", 500]]) {
    if (clean(state[field]).length > limit) errors.push({ code: "FIELD_TOO_LONG", field, message: `${field} exceeds ${limit} characters` });
  }
  return errors;
}

export function serializeValidations(records = []) {
  const body = records.map((record) => [
    `## ${record.id}：${record.title}`,
    `<!-- valid: ${record.id} -->`,
    `- 日期：${record.date}`,
    `- 假设：${record.hypothesis || "待确认"}`,
    `- 预期结果：${record.predicted || "待确认"}`,
    `- 方法与样本：${record.method || "待确认"}`,
    `- 判断阈值：${record.threshold || "待确认"}`,
    `- 观察结果：${record.observed || "待确认"}`,
    `- 解释：${record.interpretation || "待确认"}`,
    `- 决策变化：${record.decisionChange || "保持"}`,
    `- 下一步：${record.nextAction || "待确认"}`,
    `- 关联决策：${record.decisionId || "无"}`
  ].join("\n"));
  return body.length ? `# Super PM 验证记录\n\n${body.join("\n\n")}\n` : "# Super PM 验证记录\n\n";
}

export function parseValidations(text) {
  const records = [];
  const errors = [];
  let current = null;
  const labels = new Map([["日期", "date"], ["假设", "hypothesis"], ["预期结果", "predicted"], ["方法与样本", "method"], ["判断阈值", "threshold"], ["观察结果", "observed"], ["解释", "interpretation"], ["决策变化", "decisionChange"], ["下一步", "nextAction"], ["关联决策", "decisionId"]]);
  for (const line of String(text || "").split(/\r?\n/)) {
    const heading = /^##\s+(VAL-\d+)\s*[：:]\s*(.+?)\s*$/.exec(line);
    if (heading) { if (current) records.push(current); current = { id: heading[1], title: heading[2] }; continue; }
    if (!current) continue;
    const field = /^-\s*([^：:]+)[：:]\s*(.*?)\s*$/.exec(line);
    if (field && labels.has(field[1].trim())) { const key = labels.get(field[1].trim()); current[key] = ["待确认", "无"].includes(field[2].trim()) ? "" : field[2].trim(); }
  }
  if (current) records.push(current);
  for (const record of records) { if (!ID_RE.test(record.id)) errors.push({ code: "BAD_ID", id: record.id }); }
  errors.push(...validateValidations(records));
  return { records, errors };
}

export function validateValidations(records) {
  const errors = [];
  if (records.length > MAX_VALIDATIONS) errors.push({ code: "TOO_MANY_RECORDS", message: `more than ${MAX_VALIDATIONS} validation records` });
  const ids = new Set();
  for (const record of records) {
    if (ids.has(record.id)) errors.push({ code: "DUPLICATE_ID", id: record.id });
    ids.add(record.id);
    if (!DATE_RE.test(record.date || "")) errors.push({ code: "BAD_DATE", id: record.id });
    for (const [field, limit] of [["title", 200], ["hypothesis", 500], ["predicted", 500], ["method", 500], ["threshold", 300], ["observed", 500], ["interpretation", 500], ["decisionChange", 500], ["nextAction", 500], ["decisionId", 100]]) {
      if (clean(record[field]).length > limit) errors.push({ code: "FIELD_TOO_LONG", id: record.id, field });
    }
  }
  return errors;
}

export function appendValidation(records, draft) {
  const record = {
    title: clean(draft.title) || "未命名验证",
    date: clean(draft.date) || new Date().toISOString().slice(0, 10),
    hypothesis: clean(draft.hypothesis), predicted: clean(draft.predicted), method: clean(draft.method),
    threshold: clean(draft.threshold), observed: clean(draft.observed), interpretation: clean(draft.interpretation),
    decisionChange: clean(draft.decisionChange), nextAction: clean(draft.nextAction), decisionId: clean(draft.decisionId),
    id: nextId(records)
  };
  const next = [...records, record];
  const errors = validateValidations(next);
  return { record, records: next, errors };
}

export function buildTraceability(decisions = [], validations = [], tasks = []) {
  const decisionById = new Map(decisions.map((record) => [record.id, record]));
  const result = { decisions: [], orphanValidations: [], orphanTasks: [] };
  for (const decision of decisions.filter((record) => record.status === "current")) {
    const relatedValidations = validations.filter((record) => record.decisionId === decision.id);
    const relatedTasks = tasks.filter((task) => task.details?.includes(`来源产品决策：${decision.id}`) || task.details?.includes(`决策来源：${decision.id}`));
    result.decisions.push({ id: decision.id, question: decision.question, decision: decision.decision, validations: relatedValidations.map(({ id, title, observed, decisionChange }) => ({ id, title, observed, decisionChange })), tasks: relatedTasks.map(({ id, code, title, completed }) => ({ id, code, title, completed })) });
  }
  for (const validation of validations) if (validation.decisionId && !decisionById.has(validation.decisionId)) result.orphanValidations.push({ id: validation.id, decisionId: validation.decisionId });
  for (const task of tasks) {
    const match = /(?:来源产品决策|决策来源)：(DEC-\d+)/.exec(task.details || "");
    if (match && !decisionById.has(match[1])) result.orphanTasks.push({ id: task.id, decisionId: match[1], title: task.title });
  }
  return result;
}

export function recoverySummary(state, decisions = [], validations = []) {
  const current = decisions.filter((record) => record.status === "current");
  const recent = validations.slice(-3);
  return {
    stage: state.stage,
    objective: state.objective,
    lead: state.lead,
    currentDecisionCount: current.length,
    currentDecisions: current.map(({ id, question, decision }) => ({ id, question, decision })),
    openAssumptions: state.openAssumptions,
    recentValidations: recent.map(({ id, title, observed, decisionChange }) => ({ id, title, observed, decisionChange })),
    nextAction: state.nextAction,
    updated: state.updated
  };
}
