import assert from "node:assert/strict";
import { appendValidation, defaultState, parseState, parseValidations, recoverySummary, serializeState, serializeValidations, validateState } from "../lib/project-state-core.mjs";

const state = { ...defaultState(), stage: "validation", objective: "验证独立开发者留存", lead: "产品负责人", currentDecision: "DEC-0001", openAssumptions: ["用户愿意持续使用"], lastValidation: "VAL-0001", nextAction: "完成一周试用", updated: "2026-09-01" };
const stateRoundTrip = parseState(serializeState(state));
assert.deepEqual(stateRoundTrip.errors, []);
assert.deepEqual(stateRoundTrip.state, state);
assert.equal(validateState({ ...state, stage: "unknown" }).length, 1);

const validation = appendValidation([], { title: "一周留存", date: "2026-09-01", hypothesis: "用户愿意持续使用", predicted: "用户完成第二次整理", method: "10 位用户试用", threshold: "次周留存 >= 40%", observed: "6 位完成第二次整理", interpretation: "达到阈值", decisionChange: "保持 DEC-0001", nextAction: "扩大样本", decisionId: "DEC-0001" });
assert.equal(validation.record.id, "VAL-0001");
const validationRoundTrip = parseValidations(serializeValidations(validation.records));
assert.deepEqual(validationRoundTrip.errors, []);
assert.equal(validationRoundTrip.records[0].observed, "6 位完成第二次整理");
const summary = recoverySummary(state, [{ id: "DEC-0001", status: "current", question: "服务谁？", decision: "独立开发者" }], validation.records);
assert.equal(summary.currentDecisionCount, 1);
assert.equal(summary.recentValidations[0].id, "VAL-0001");

console.log("project state tests passed");
