const clean = (value, fallback = "待确认") => typeof value === "string" && value.trim() ? value.trim() : fallback;
const section = (title, body) => `## ${title}\n\n${body}\n`;

export function renderPrd(input = {}) {
  const maturity = clean(input.maturity, "讨论快照");
  const decisions = Array.isArray(input.decisions) ? input.decisions : [];
  const validations = Array.isArray(input.validations) ? input.validations : [];
  const scope = input.scope || {};
  const lines = [
    "# Super PM 产品文档",
    "",
    `> 文档成熟度：${maturity}`,
    `> 项目：${clean(input.project, "待确认")}`,
    "",
    section("当前决定", [
      `- 决策问题：${clean(input.question)}`,
      `- 直接建议：${clean(input.recommendation)}`,
      `- 一句话产品定义：${clean(input.productDefinition)}`,
      `- 交付对象：${clean(input.audience, "开发或交付团队")}`
    ].join("\n")),
    section("用户价值", [
      `- 核心用户：${clean(input.user)}`,
      `- 关键场景：${clean(input.situation)}`,
      `- 未满足需求：${clean(input.need)}`,
      `- 当前替代方案：${clean(input.alternative)}`,
      `- 产品承诺：${clean(input.promise)}`
    ].join("\n")),
    section("负向边界", [
      `- 绝对不要：${clean(input.mustNot)}`,
      `- 这次不做：${clean(input.notNow)}`,
      `- 硬约束：${clean(input.constraints)}`,
      `- 必须保护的品质：${clean(input.protectedQuality)}`
    ].join("\n")),
    section("范围", [
      `- 必须：${clean(scope.must)}`,
      `- 以后：${clean(scope.later)}`,
      `- 明确不做：${clean(scope.out)}
`
    ].join("\n")),
    section("决策记录", decisions.length ? decisions.map((item) => `- ${clean(item.id)}：${clean(item.question)} → ${clean(item.decision)}`).join("\n") : "- 待确认"),
    section("验证记录", validations.length ? validations.map((item) => `- ${clean(item.id)}：${clean(item.title)}；结果：${clean(item.observed)}；决策变化：${clean(item.decisionChange, "保持")}`).join("\n") : "- 待确认"),
    section("交付与验收", [
      `- 核心指标：${clean(input.metric)}`,
      `- 验收标准：${clean(input.acceptance)}`,
      `- 失败和恢复：${clean(input.recovery)}`,
      `- 待决事项：${clean(input.openQuestions)}`
    ].join("\n"))
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

export function validatePrd(input = {}) {
  const errors = [];
  if (!["讨论快照", "方向草案", "可进入交付", "Snapshot", "Draft", "Implementation-ready"].includes(input.maturity)) errors.push({ code: "BAD_MATURITY", message: "maturity must be a supported artifact maturity" });
  for (const field of ["question", "recommendation", "user", "need", "mustNot", "notNow", "acceptance"]) if (!String(input[field] || "").trim()) errors.push({ code: "MISSING_FIELD", field, message: `${field} is required for a useful PRD` });
  if ((input.maturity === "可进入交付" || input.maturity === "Implementation-ready") && (!String(input.acceptance || "").trim() || !String(input.metric || "").trim())) errors.push({ code: "INCOMPLETE_READY", message: "implementation-ready PRDs require acceptance and metrics" });
  return errors;
}
