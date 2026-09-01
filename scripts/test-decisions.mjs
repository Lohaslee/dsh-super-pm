import assert from "node:assert/strict";
import {
  decisionKey,
  findDuplicate,
  lineage,
  normalizeQuestion,
  parseDocument,
  serializeDocument,
  upsert,
  validate
} from "../lib/decisions-core.mjs";

const base = {
  question: "首个版本服务谁？",
  decision: "首个版本只服务独立开发者",
  negativeBoundary: "不做大型企业采购流程",
  date: "2026-09-01",
  created: "2026-09-01",
  owner: "产品负责人"
};

assert.equal(normalizeQuestion("  首个版本服务谁？ "), "首个版本服务谁");
assert.equal(decisionKey(base.question).length, 64);

const appended = upsert([], base);
assert.equal(appended.op, "append");
assert.equal(appended.id, "DEC-0001");
assert.equal(validate(appended.records).length, 0);

const roundTrip = parseDocument(serializeDocument(appended.records));
assert.equal(roundTrip.errors.length, 0);
assert.equal(roundTrip.records[0].decision, base.decision);
assert.equal(findDuplicate(roundTrip.records, "首个版本服务谁？")?.id, "DEC-0001");

const updated = upsert(roundTrip.records, { ...base, evidence: "访谈 5 位独立开发者" });
assert.equal(updated.op, "update");
assert.equal(updated.id, "DEC-0001");
assert.equal(updated.records[0].evidence, "访谈 5 位独立开发者");

const conflict = upsert(updated.records, { ...base, decision: "首个版本同时服务独立开发者和小团队" });
assert.equal(conflict.op, "conflict");
assert.equal(conflict.errors[0].code, "MISSING_CHANGE_REASON");

const superseded = upsert(updated.records, { ...base, decision: "首个版本同时服务独立开发者和小团队" }, { changeReason: "访谈显示小团队也有同样的高频痛点" });
assert.equal(superseded.op, "supersede");
assert.equal(superseded.records.length, 2);
assert.equal(validate(superseded.records).length, 0);
assert.deepEqual(lineage(superseded.records, superseded.id).map((record) => record.id), ["DEC-0001", "DEC-0002"]);

const orphan = parseDocument("## DEC-0001：问题\n- 状态：已替代\n- 日期：2026-09-01\n- 决定：方向\n- 被替代为：DEC-9999\n");
assert.ok(orphan.errors.some((error) => error.code === "ORPHAN_LINK"));

console.log("decision core tests passed");
