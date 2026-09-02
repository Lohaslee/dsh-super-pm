const clean = (value) => typeof value === "string" ? value.trim() : "";

export function redactedDecisionCard(decision, options = {}) {
  if (!decision || typeof decision !== "object") throw new Error("decision is required");
  const includeEvidence = options.includeEvidence === true;
  const lines = [
    "# 产品决定卡",
    "",
    `**编号**：${clean(decision.id) || "未编号"}`,
    `**问题**：${clean(decision.question) || "待确认"}`,
    `**决定**：${clean(decision.decision) || "待确认"}`,
    `**边界**：${clean(decision.negativeBoundary) || "待确认"}`,
    `**状态**：${decision.status === "superseded" ? "已替代" : "当前"}`
  ];
  if (includeEvidence && clean(decision.evidence)) lines.push(`**证据**：${clean(decision.evidence)}`);
  lines.push("", "> 这是一张产品决定摘要，不包含完整讨论、隐藏推理或项目路径。", "", "— Super PM");
  return lines.join("\n") + "\n";
}

export function productPulse(decision, validations = []) {
  const current = decision?.status !== "superseded";
  const evidence = clean(decision?.evidence).length > 0 || validations.some((item) => clean(item.observed).length > 0);
  const boundary = clean(decision?.negativeBoundary).length > 0;
  const next = clean(decision?.nextValidation).length > 0 || validations.some((item) => clean(item.nextAction).length > 0);
  const score = [current, evidence, boundary, next].filter(Boolean).length;
  const level = score >= 4 ? "清晰" : score >= 2 ? "成形" : "待打磨";
  return {
    level,
    score,
    dimensions: {
      direction: current ? "有当前方向" : "方向已替代",
      evidence: evidence ? "有证据线索" : "证据不足",
      boundary: boundary ? "边界明确" : "边界待补",
      momentum: next ? "有下一步" : "下一步待定"
    },
    line: level === "清晰" ? "这不是完美答案，但已经足够指导下一步。" : level === "成形" ? "方向正在成形，下一条证据比更多观点更有价值。" : "现在最值钱的不是扩展方案，而是缩小不确定性。"
  };
}

const RANDOM_EGG_RATE = 0.08;
const RANDOM_MESSAGES = [
  { id: "smallest-test", message: "隐藏提示：今天最强的产品动作，可能是删掉一个没人会想念的按钮。" },
  { id: "negative-boundary", message: "隐藏提示：一句清楚的“不做”，有时比十个新功能更接近产品灵魂。" },
  { id: "evidence-over-drama", message: "隐藏提示：让证据拥有推翻好主意的权力，产品才开始变得诚实。" }
];

export function easterEgg(input, context = {}) {
  const text = clean(input).toLocaleLowerCase();
  const completed = Number(context.completedDecisions || 0);
  const explicit = /super\s*pm|超级产品经理|彩蛋|easter\s*egg/.test(text);
  if (explicit) return { found: true, id: "product-lens", message: "彩蛋：真正稀缺的不是更多点子，而是一个愿意被证据推翻的决定。", trigger: "explicit" };
  if (completed >= 7) return { found: true, id: "seven-lenses", message: "你已经完成七个决定。七不是终点，只是终于可以少问一个问题的信号。", trigger: "milestone" };
  if (context.random !== true) return { found: false, id: null, message: "", trigger: "disabled" };
  const random = typeof context.randomFn === "function" ? context.randomFn() : Math.random();
  if (random >= RANDOM_EGG_RATE) return { found: false, id: null, message: "", trigger: "random-miss" };
  const pick = Math.floor((typeof context.pickFn === "function" ? context.pickFn() : Math.random()) * RANDOM_MESSAGES.length) % RANDOM_MESSAGES.length;
  return { ...RANDOM_MESSAGES[pick], found: true, trigger: "random" };
}

export { RANDOM_EGG_RATE };
