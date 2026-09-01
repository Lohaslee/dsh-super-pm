import assert from "node:assert/strict";
import { decisionToBoardOperations, decisionToTaskDraft } from "../lib/handoff-core.mjs";

const decision = {
  id: "DEC-0001",
  question: "首个版本服务谁？",
  decision: "首个版本只服务独立开发者",
  negativeBoundary: "不做大型企业采购和多人权限",
  evidence: "5 次用户访谈",
  toValidate: "独立开发者是否愿意每周持续使用",
  nextValidation: "邀请 10 位用户完成一周试用",
  revisitTrigger: "团队用户占有效需求的一半以上"
};

const root = decisionToTaskDraft(decision);
assert.equal(root.key, "super-pm-decision");
assert.match(root.details, /DEC-0001/);
assert.match(root.boundary, /不做大型企业采购/);

const operations = decisionToBoardOperations(decision, [
  { title: "验证一周留存", hypothesis: "用户愿意持续使用", method: "10 位用户试用", threshold: "次周留存 >= 40%" }
]);
assert.equal(operations.length, 2);
assert.equal(operations[1].parent_key, "super-pm-decision");
assert.match(operations[1].details, /次周留存/);
assert.throws(() => decisionToBoardOperations(decision, Array.from({ length: 20 }, () => ({}))), /at most/);

const decisionWithNoEvidence = { ...decision, evidence: "" };
assert.match(decisionToTaskDraft(decisionWithNoEvidence).details, /证据：\n/);

console.log("handoff core tests passed");
