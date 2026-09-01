const MAX_TASKS = 20;

function text(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

export function decisionToTaskDraft(decision, options = {}) {
  if (!decision || typeof decision !== "object") throw new Error("decision is required");
  const title = text(options.title, text(decision.decision, "产品决策交付"));
  const source = decision.id ? `来源产品决策：${decision.id}` : "来源产品决策：当前确认决定";
  const boundary = [
    `目标：落实“${text(decision.decision)}”`,
    `包含：${text(decision.negativeBoundary, "按已确认产品边界实现")}`,
    "不包含：未在该产品决策中确认的扩展功能",
    "验收：实现结果符合产品决定，并完成对应验证"
  ].join("\n");
  const details = [
    source,
    `决策问题：${text(decision.question)}`,
    `证据：${text(decision.evidence, "待补充")}`,
    `待验证：${text(decision.toValidate, "无")}`,
    `下一步验证：${text(decision.nextValidation, "待确认")}`,
    `重审触发：${text(decision.revisitTrigger, "待确认")}`
  ].join("\n");
  return { key: "super-pm-decision", title, details, boundary, kind: "main", completed: false };
}

export function validationToTaskDraft(validation, index) {
  if (!validation || typeof validation !== "object") throw new Error("validation is required");
  const title = text(validation.title, `验证假设${index + 1}`);
  return {
    key: `super-pm-validation-${index + 1}`,
    parent_key: "super-pm-decision",
    title,
    details: [
      `验证假设：${text(validation.hypothesis, "待确认")}`,
      `方法与样本：${text(validation.method, "待确认")}`,
      `判断阈值：${text(validation.threshold, "待确认")}`
    ].join("\n"),
    boundary: "目标：验证一个高影响产品假设\n不包含：扩展产品范围\n验收：记录观察结果并更新产品决定",
    kind: "subtask",
    completed: false
  };
}

export function decisionToBoardOperations(decision, validations = [], options = {}) {
  const list = Array.isArray(validations) ? validations : [];
  if (list.length > MAX_TASKS - 1) throw new Error(`at most ${MAX_TASKS - 1} validation tasks are allowed`);
  const root = decisionToTaskDraft(decision, options);
  return [root, ...list.map((item, index) => validationToTaskDraft(item, index))];
}
