import { createHash } from "node:crypto";

export const MAX_RECORDS = 300;
export const MAX_DOCUMENT_BYTES = 256 * 1024;

const FIELDS = [
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
];
const FIELD_BY_LABEL = new Map(FIELDS.map(([key, label]) => [label, key]));
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
      current[key] = value === "无" || value === "暂无" || value === "待确认" ? "" : value;
      if (key === "status") current.status = value === "已替代" || value === "superseded" ? "superseded" : "current";
      continue;
    }
    if (!/^\s*$/.test(line) && !/^<!--.*-->$/.test(line.trim())) prose.push(line);
  }
  finish();
  for (const record of records) {
    record.key ??= decisionKey(record.question);
    record.created ??= record.date || "";
    record.status = record.status === "superseded" || record.status === "已替代" ? "superseded" : "current";
  }
  errors.push(...validate(records));
  return { records, errors };
}

function displayStatus(status) {
  return status === "superseded" ? "已替代" : "当前";
}

export function serializeDocument(records) {
  const body = records.map((record) => {
    const created = record.created || record.date || new Date().toISOString().slice(0, 10);
    const lines = [
      `## ${record.id}：${record.question}`,
      `<!-- dcid: ${record.id}; key: ${record.key || decisionKey(record.question)}; status: ${record.status || "current"}; created: ${created} -->`
    ];
    const values = {
      status: displayStatus(record.status),
      date: record.date || created,
      decision: record.decision,
      negativeBoundary: record.negativeBoundary,
      evidence: record.evidence,
      toValidate: record.toValidate,
      nextValidation: record.nextValidation,
      revisitTrigger: record.revisitTrigger,
      owner: record.owner,
      supersedes: record.supersedes || "无",
      supersededBy: record.supersededBy || "无",
      changeReason: record.changeReason || "无"
    };
    for (const [key, label] of FIELDS) lines.push(`- ${label}：${values[key] || "待确认"}`);
    if (record.reason) lines.push("", `**理由**：${record.reason}`);
    return lines.join("\n");
  });
  return body.length ? `${body.join("\n\n")}\n` : "# Super PM 产品决策\n\n";
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
