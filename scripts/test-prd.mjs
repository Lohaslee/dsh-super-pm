import assert from "node:assert/strict";
import { renderPrd, validatePrd } from "../lib/prd-core.mjs";

const input = {
  maturity: "方向草案",
  question: "首个版本服务谁？",
  recommendation: "只服务独立开发者",
  productDefinition: "把零散反馈整理为可执行问题",
  user: "独立开发者",
  situation: "每周整理用户反馈",
  need: "快速识别高价值问题",
  alternative: "手工维护文档",
  promise: "在一次整理中得到下一步行动",
  mustNot: "不能自动替用户决定产品方向",
  notNow: "不做团队协作和权限",
  constraints: "首版控制在一周试用范围",
  protectedQuality: "结果必须可解释",
  scope: { must: "导入和整理反馈", later: "团队协作", out: "复杂工作流" },
  metric: "次周留存",
  acceptance: "10 位用户中至少 4 位完成第二次整理",
  recovery: "失败时保留原始反馈",
  decisions: [{ id: "DEC-0001", question: "服务谁？", decision: "独立开发者" }],
  validations: [{ id: "VAL-0001", title: "一周留存", observed: "6/10", decisionChange: "保持" }]
};

const document = renderPrd(input);
assert.match(document, /方向草案/);
assert.match(document, /DEC-0001/);
assert.deepEqual(validatePrd(input), []);
assert.ok(validatePrd({ ...input, maturity: "可进入交付", metric: "" }).some((error) => error.code === "INCOMPLETE_READY"));
assert.ok(validatePrd({ ...input, acceptance: "" }).some((error) => error.code === "MISSING_FIELD"));

console.log("prd tests passed");
