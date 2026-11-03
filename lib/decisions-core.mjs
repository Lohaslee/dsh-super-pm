import { createHash } from "node:crypto";

export const MAX_RECORDS = 300;
export const MAX_DOCUMENT_BYTES = 256 * 1024;

/**
 * Locale-aware field labels for the decision record schema.
 * `zh` stays the default so existing files and tests keep working; `en` and
 * `pt-BR` let the save tool honour the working language instead of always
 * emitting Chinese labels.
 */
export const DECISION_LOCALES = {
  zh: {
    title: "# Super PM 产品决策",
    fields: [
      ["status", "状态"],
      ["date", "日期"],
      ["decision", "决定"],
      ["negativeBoundary", "负向边界"],
      ["evidence", "证据"],
      ["toValidate", "待验证"],
      ["nextValidation", "下一步验证"],
      ["revisitTrigger", "重审触发"],
      ["owner", "负责人"],
      ["supersedes", "替代了"],
      ["supersededBy", "被替代为"],
      ["changeReason", "变更原因"]
    ],
    statusCurrent: "当前",
    statusSuperseded: "已替代",
    pending: "待确认",
    none: "无",
    reason: "理由",
    separator: "："
  },
  en: {
    title: "# Super PM Product Decisions",
    fields: [
      ["status", "Status"],
      ["date", "Date"],
      ["decision", "Decision"],
      ["negativeBoundary", "Negative Boundary"],
      ["evidence", "Evidence"],
      ["toValidate", "To validate"],
      ["nextValidation", "Next validation"],
      ["revisitTrigger", "Revisit trigger"],
      ["owner", "Owner"],
      ["supersedes", "Supersedes"],
      ["supersededBy", "Superseded by"],
      ["changeReason", "Change reason"]
    ],
    statusCurrent: "current",
    statusSuperseded: "superseded",
    pending: "Pending",
    none: "None",
    reason: "Reason",
    separator: ": "
  },
  "pt-BR": {
    title: "# Decisões de Produto Super PM",
    fields: [
      ["status", "Status"],
      ["date", "Data"],
      ["decision", "Decisão"],
      ["negativeBoundary", "Fronteira Negativa"],
      ["evidence", "Evidência"],
      ["toValidate", "A validar"],
      ["nextValidation", "Próxima validação"],
      ["revisitTrigger", "Gatilho de revisão"],
      ["owner", "Responsável"],
      ["supersedes", "Substitui"],
      ["supersededBy", "Substituída por"],
      ["changeReason", "Motivo da mudança"]
    ],
    statusCurrent: "atual",
    statusSuperseded: "substituída",
    pending: "Pendente",
    none: "Nenhuma",
    reason: "Motivo",
    separator: ": "
  }
};

const LOCALE_ALIASES = new Map([
  ["zh", "zh"],
  ["zh-cn", "zh"],
  ["cn", "zh"],
  ["chinese", "zh"],
  ["en", "en"],
  ["en-us", "en"],
  ["english", "en"],
  ["pt", "pt-BR"],
  ["pt-br", "pt-BR"],
  ["pt_br", "pt-BR"],
  ["português", "pt-BR"],
  ["portugues", "pt-BR"],
  ["portuguese", "pt-BR"],
  ["brazilian", "pt-BR"]
]);

export function normalizeLocale(value) {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  return LOCALE_ALIASES.get(raw) || null;
}

/** Infer a locale from existing decision-file content so saves stay in-language. */
export function detectLocale(text) {
  if (typeof text !== "string" || !text) return null;
  if (/Fronteira Negativa|Decisões de Produto|Próxima validação|Gatilho de revisão/u.test(text)) return "pt-BR";
  if (/Negative Boundary|Super PM Product Decisions/u.test(text)) return "en";
  if (/负向边界|产品决策|下一步验证|重审触发/u.test(text)) return "zh";
  return null;
}

/** Union of every locale's labels, so a file can be parsed in any language. */
const FIELD_BY_LABEL = new Map();
for (const locale of Object.values(DECISION_LOCALES)) {
  for (const [key, label] of locale.fields) FIELD_BY_LABEL.set(label, key);
}
const STATUS_SUPERSEDED = new Set(
  Object.values(DECISION_LOCALES).map((locale) => locale.statusSuperseded.toLowerCase())
);
const EMPTY_VALUES = new Set(["无", "暂无", "待确认", "none", "n/a", "nenhuma", "pendente", "pending"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^DEC-\d{4,}$/;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeQuestion(question) {
  return clean(question)
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}\s]+/gu, "")
    .trim();
}

export function decisionKey(question) {
  return createHash("sha256").update(normalizeQuestion(question), "utf8").digest("hex");
}

function nextId(records) {
  const max = records.reduce((highest, record) => {
    const match = /^DEC-(\d+)$/.exec(record.id ?? "");
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `DEC-${String(max + 1).padStart(4, "0")}`;
}

function parseAnchor(line) {
  const match = /^<!--\s*dcid:\s*(DEC-\d+);\s*key:\s*([a-f0-9]{64});\s*status:\s*(current|superseded);\s*created:\s*(\d{4}-\d{2}-\d{2})\s*-->$/u.exec(line.trim());
  return match ? { id: match[1], key: match[2], status: match[3], created: match[4] } : null;
}

export function parseDocument(text) {
  const source = typeof text === "string" ? text : "";
  const lines = source.split(/\r?\n/);
  const records = [];
  const errors = [];
  let current = null;
  let prose = [];

  const finish = () => {
    if (!current) return;
    current.reason = prose.join("\n").trim();
    records.push(current);
    current = null;
    prose = [];
  };

  for (const line of lines) {
    const heading = /^##\s+(DEC-\d+)\s*[：:]\s*(.+?)\s*$/.exec(line);
    if (heading) {
      finish();
      current = { id: heading[1], question: heading[2], status: "current", fields: {} };
      continue;
    }
    if (!current) continue;
    const anchor = parseAnchor(line);
    if (anchor) {
      current.id = anchor.id;
      current.key = anchor.key;
      current.status = anchor.status;
      current.created = anchor.created;
      continue;
    }
    const field = /^-\s*([^：:]+)[：:]\s*(.*?)\s*$/.exec(line);
    if (field && FIELD_BY_LABEL.has(field[1].trim())) {
      const key = FIELD_BY_LABEL.get(field[1].trim());
      const value = clean(field[2]);
      current[key] = EMPTY_VALUES.has(value.toLowerCase()) ? "" : value;
      if (key === "status") current.status = STATUS_SUPERSEDED.has(value.toLowerCase()) ? "superseded" : "current";
      continue;
    }
    if (!/^\s*$/.test(line) && !/^<!--.*-->$/.test(line.trim())) prose.push(line);
  }
  finish();
  for (const record of records) {
    record.key ??= decisionKey(record.question);
    record.created ??= record.date || "";
    record.status = record.status === "superseded" || STATUS_SUPERSEDED.has(String(record.status).toLowerCase()) ? "superseded" : "current";
  }
  errors.push(...validate(records));
  return { records, errors };
}

function displayStatus(status, locale) {
  const labels = DECISION_LOCALES[locale] || DECISION_LOCALES.zh;
  return status === "superseded" ? labels.statusSuperseded : labels.statusCurrent;
}

/**
 * Serialize decision records.
 *
 * `options.locale` selects the output language (`zh`, `en`, or `pt-BR`). When it
 * is omitted, the locale is inferred from the records/text if possible and
 * otherwise falls back to `zh`, preserving the historical default.
 */
export function serializeDocument(records, options = {}) {
  const locale =
    normalizeLocale(options.locale) ||
    detectLocale(options.sourceText) ||
    "zh";
  const labels = DECISION_LOCALES[locale];
  const sep = labels.separator;
  const body = records.map((record) => {
    const created = record.created || record.date || new Date().toISOString().slice(0, 10);
    const lines = [
      `## ${record.id}${sep}${record.question}`,
      `<!-- dcid: ${record.id}; key: ${record.key || decisionKey(record.question)}; status: ${record.status || "current"}; created: ${created} -->`
    ];
    const values = {
      status: displayStatus(record.status, locale),
      date: record.date || created,
      decision: record.decision,
      negativeBoundary: record.negativeBoundary,
      evidence: record.evidence,
      toValidate: record.toValidate,
      nextValidation: record.nextValidation,
      revisitTrigger: record.revisitTrigger,
      owner: record.owner,
      supersedes: record.supersedes || labels.none,
      supersededBy: record.supersededBy || labels.none,
      changeReason: record.changeReason || labels.none
    };
    for (const [key, label] of labels.fields) lines.push(`- ${label}${sep}${values[key] || labels.pending}`);
    if (record.reason) lines.push("", `**${labels.reason}**${sep}${record.reason}`);
    return lines.join("\n");
  });
  return body.length ? `${body.join("\n\n")}\n` : `${labels.title}\n\n`;
}

export function findDuplicate(records, question) {
  const key = decisionKey(question);
  return records.find((record) => record.key === key && record.status === "current") || null;
}

function sameDirection(record, draft) {
  return clean(record.decision) === clean(draft.decision) && clean(record.negativeBoundary) === clean(draft.negativeBoundary);
}

export function supersede(records, oldId, newId, reason) {
  const changeReason = clean(reason);
  if (!changeReason) return { records, errors: [{ code: "MISSING_CHANGE_REASON", message: "supersede requires changeReason" }] };
  const next = records.map((record) => ({ ...record }));
  const old = next.find((record) => record.id === oldId);
  const replacement = next.find((record) => record.id === newId);
  if (!old || !replacement) return { records, errors: [{ code: "ORPHAN_LINK", message: "supersede target does not exist" }] };
  old.status = "superseded";
  old.supersededBy = newId;
  old.changeReason = changeReason;
  replacement.supersedes = oldId;
  replacement.changeReason = changeReason;
  return { records: next, errors: validate(next) };
}

export function upsert(records, draft, options = {}) {
  const current = [...records];
  const duplicate = findDuplicate(current, draft.question);
  if (duplicate && sameDirection(duplicate, draft)) {
    const updated = current.map((record) => record.id === duplicate.id ? { ...record, ...draft, id: record.id, key: duplicate.key, status: "current", created: record.created } : record);
    return { records: updated, op: "update", id: duplicate.id, links: [] };
  }
  const id = draft.id || nextId(current);
  const record = { ...draft, id, key: decisionKey(draft.question), status: "current", created: draft.created || draft.date };
  if (!record.created) record.created = new Date().toISOString().slice(0, 10);
  if (duplicate) {
    if (!clean(options.changeReason)) return { records: current, op: "conflict", id: duplicate.id, links: [], errors: [{ code: "MISSING_CHANGE_REASON", message: "A changed direction requires changeReason" }] };
    current.push(record);
    const result = supersede(current, duplicate.id, id, options.changeReason);
    return { ...result, op: "supersede", id, links: [duplicate.id, id] };
  }
  current.push(record);
  return { records: current, op: "append", id, links: [] };
}

export function validate(records) {
  const errors = [];
  const byId = new Map();
  const currentByKey = new Map();
  for (const record of records) {
    if (!ID_RE.test(record.id || "")) errors.push({ code: "BAD_ID", id: record.id, message: "invalid decision id" });
    if (byId.has(record.id)) errors.push({ code: "DUPLICATE_ID", id: record.id, message: "duplicate decision id" });
    byId.set(record.id, record);
  }
  for (const record of records) {
    if (!DATE_RE.test(record.date || record.created || "")) errors.push({ code: "BAD_DATE", id: record.id, message: "date must be YYYY-MM-DD" });
    if (record.status === "current") {
      if (currentByKey.has(record.key)) errors.push({ code: "DUPLICATE_CURRENT", id: record.id, message: "more than one current decision has the same key" });
      currentByKey.set(record.key, record.id);
    }
    if (record.supersedes && !byId.has(record.supersedes)) errors.push({ code: "ORPHAN_SUPERSEDES", id: record.id, message: `missing superseded record ${record.supersedes}` });
    if (record.supersededBy && !byId.has(record.supersededBy)) errors.push({ code: "ORPHAN_LINK", id: record.id, message: `missing replacement record ${record.supersededBy}` });
    if (record.status === "superseded" && !record.changeReason) errors.push({ code: "MISSING_CHANGE_REASON", id: record.id, message: "superseded record needs changeReason" });
    if (record.key !== decisionKey(record.question)) errors.push({ code: "KEY_CONFLICT", id: record.id, message: "decision key does not match question" });
  }
  for (const record of records) {
    if (record.supersedes && byId.get(record.supersedes)?.supersededBy !== record.id) errors.push({ code: "ORPHAN_LINK", id: record.id, message: "supersede links are not bidirectional" });
    if (record.supersededBy && byId.get(record.supersededBy)?.supersedes !== record.id) errors.push({ code: "ORPHAN_LINK", id: record.id, message: "replacement links are not bidirectional" });
  }
  return errors;
}

export function lineage(records, id) {
  const byId = new Map(records.map((record) => [record.id, record]));
  const result = [];
  const seen = new Set();
  let current = byId.get(id);
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    result.unshift(current);
    current = current.supersedes ? byId.get(current.supersedes) : null;
  }
  return result;
}
