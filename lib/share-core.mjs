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
const LENS_MESSAGES = [
  { id: "qiaobangzhu-cut", event: "scope-cut", lens: "乔帮主", lead: "这次由乔帮主路过提醒一句：", message: "真正该删掉的，通常不是一个功能，而是一个没有用户的假设。" },
  { id: "longge-focus", event: "first-core-user", lens: "龙哥", lead: "龙哥思考了一下说：", message: "如果每个人都是用户，那就等于还没有用户。" },
  { id: "lianglaoshi-value", event: "first-product-promise", lens: "梁老师", lead: "梁老师友情提醒：", message: "先把产品做得值得使用，再讨论怎样让更多人看到。" },
  { id: "yulaoshi-complexity", event: "feature-sprawl", lens: "俞老师", lead: "俞老师看了一眼补充道：", message: "复杂不是能力的证明，用户感受到的复杂才是成本。" },
  { id: "shimu-trust", event: "trust-breakthrough", lens: "师母", lead: "师母温柔地提醒一句：", message: "能让人愿意留下来的，往往不是功能，而是被理解的感觉。" },
  { id: "xiangge-risk", event: "first-validation", lens: "想哥", lead: "想哥想了想说：", message: "当你不知道下一步做什么，先找出哪个假设最贵。" },
  { id: "junge-proof", event: "decision-reversal", lens: "军哥", lead: "军哥友情提醒：", message: "一个不能被验证的愿景，离执行越近，风险越大。" }
];
const RANDOM_MESSAGES = [
  { id: "smallest-test", message: "今天最强的产品动作，可能是删掉一个没人会想念的按钮。" },
  { id: "negative-boundary", message: "一句清楚的“不做”，有时比十个新功能更接近产品灵魂。" },
  { id: "evidence-over-drama", message: "让证据拥有推翻好主意的权力，产品才开始变得诚实。" }
];
const META_EGGS = [
  "彩蛋是彩色的蛋，在合适的时候你就会发现它。",
  "有些彩蛋不藏在菜单里，而藏在你终于做出一个决定的那一刻。",
  "它现在还不是彩蛋，只是一句普通的话。等时机到了，你会知道。"
];

export function easterEgg(input, context = {}) {
  const text = clean(input).toLocaleLowerCase();
  const completed = Number(context.completedDecisions || 0);
  const explicit = /彩蛋|隐藏功能|隐藏体验|惊喜|有意思|特别的|easter\s*egg/.test(text);
  if (explicit) {
    const index = Math.floor((typeof context.pickFn === "function" ? context.pickFn() : Math.random()) * META_EGGS.length) % META_EGGS.length;
    return { found: true, id: "meta-egg", message: META_EGGS[index], trigger: "explicit" };
  }
  if (completed >= 7) return { found: true, id: "seven-lenses", message: "你已经完成七个决定。七不是终点，只是终于可以少问一个问题的信号。", trigger: "milestone" };
  if (context.random !== true) return { found: false, id: null, message: "", trigger: "disabled" };
  const random = typeof context.randomFn === "function" ? context.randomFn() : Math.random();
  if (random >= RANDOM_EGG_RATE) return { found: false, id: null, message: "", trigger: "random-miss" };
  const pool = context.event ? LENS_MESSAGES.filter((item) => item.event === context.event) : [];
  const choices = pool.length ? pool : LENS_MESSAGES;
  const pick = Math.floor((typeof context.pickFn === "function" ? context.pickFn() : Math.random()) * choices.length) % choices.length;
  const item = choices[pick];
  if (context.event) return { ...item, found: true, message: `${item.lead}\n${item.message}`, trigger: "random-event" };
  const genericPick = Math.floor((typeof context.pickFn === "function" ? context.pickFn() : Math.random()) * RANDOM_MESSAGES.length) % RANDOM_MESSAGES.length;
  return { ...RANDOM_MESSAGES[genericPick], found: true, trigger: "random" };
}

export { RANDOM_EGG_RATE };
