const PRD_LOCALES = {
  zh: {
    title: "# Super PM 产品文档",
    maturity: "> 文档成熟度",
    project: "> 项目",
    separator: "：",
    listSeparator: "；",
    pending: "待确认",
    defaultMaturity: "讨论快照",
    defaultAudience: "开发或交付团队",
    retained: "保持",
    sections: {
      current: "当前决定",
      question: "决策问题",
      recommendation: "直接建议",
      definition: "一句话产品定义",
      audience: "交付对象",
      value: "用户价值",
      user: "核心用户",
      situation: "关键场景",
      need: "未满足需求",
      alternative: "当前替代方案",
      promise: "产品承诺",
      boundary: "负向边界",
      mustNot: "绝对不要",
      notNow: "这次不做",
      constraints: "硬约束",
      protectedQuality: "必须保护的品质",
      scope: "范围",
      must: "必须",
      later: "以后",
      out: "明确不做",
      decisions: "决策记录",
      validations: "验证记录",
      delivery: "交付与验收",
      metric: "核心指标",
      acceptance: "验收标准",
      recovery: "失败和恢复",
      openQuestions: "待决事项",
      observed: "结果",
      changed: "决策变化"
    }
  },
  en: {
    title: "# Super PM Product Document",
    maturity: "> Artifact maturity",
    project: "> Project",
    separator: ": ",
    listSeparator: "; ",
    pending: "Pending",
    defaultMaturity: "Discussion snapshot",
    defaultAudience: "engineering or delivery team",
    retained: "Retained",
    sections: {
      current: "Current Decision",
      question: "Decision question",
      recommendation: "Direct recommendation",
      definition: "One-sentence product definition",
      audience: "Intended handoff",
      value: "User value",
      user: "Primary user",
      situation: "Key situation",
      need: "Unmet need",
      alternative: "Current alternative",
      promise: "Product promise",
      boundary: "Negative Boundary",
      mustNot: "Must not",
      notNow: "Not now",
      constraints: "Hard constraints",
      protectedQuality: "Protected qualities",
      scope: "Scope",
      must: "Must",
      later: "Later",
      out: "Explicitly not doing",
      decisions: "Decision log",
      validations: "Validation log",
      delivery: "Delivery and acceptance",
      metric: "Primary metric",
      acceptance: "Acceptance criteria",
      recovery: "Failure and recovery",
      openQuestions: "Open questions",
      observed: "Observed",
      changed: "Decision change"
    }
  },
  "pt-BR": {
    title: "# Documento de Produto Super PM",
    maturity: "> Maturidade do artefato",
    project: "> Projeto",
    separator: ": ",
    listSeparator: "; ",
    pending: "Pendente",
    defaultMaturity: "Snapshot de discussão",
    defaultAudience: "time de engenharia ou entrega",
    retained: "Mantida",
    sections: {
      current: "Decisão Atual",
      question: "Pergunta de decisão",
      recommendation: "Recomendação direta",
      definition: "Definição do produto em uma frase",
      audience: "Público-alvo da entrega",
      value: "Valor para o usuário",
      user: "Usuário principal",
      situation: "Situação-chave",
      need: "Necessidade não atendida",
      alternative: "Alternativa atual",
      promise: "Promessa do produto",
      boundary: "Fronteira Negativa",
      mustNot: "Não deve",
      notNow: "Não agora",
      constraints: "Restrições rígidas",
      protectedQuality: "Qualidades protegidas",
      scope: "Escopo",
      must: "Obrigatório",
      later: "Depois",
      out: "Explicitamente fora",
      decisions: "Registro de decisões",
      validations: "Registro de validações",
      delivery: "Entrega e aceitação",
      metric: "Métrica principal",
      acceptance: "Critérios de aceitação",
      recovery: "Falha e recuperação",
      openQuestions: "Questões em aberto",
      observed: "Observado",
      changed: "Mudança de decisão"
    }
  }
};

function resolveLocale(value) {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (["pt", "pt-br", "pt_br", "português", "portugues", "portuguese", "brazilian"].includes(raw)) return "pt-BR";
  if (["zh", "zh-cn", "cn", "chinese"].includes(raw)) return "zh";
  if (["en", "en-us", "english"].includes(raw)) return "en";
  return "zh";
}

const MATURITY_VALUES = {
  zh: ["讨论快照", "方向草案", "可进入交付"],
  en: ["Snapshot", "Draft", "Implementation-ready"],
  "pt-BR": ["Snapshot de discussão", "Rascunho de direção", "Pronto para implementação"]
};

export function renderPrd(input = {}) {
  const locale = resolveLocale(input.locale);
  const L = PRD_LOCALES[locale];
  const S = L.sections;
  const sep = L.separator;
  const listSep = L.listSeparator;
  const clean = (value, fallback = L.pending) => (typeof value === "string" && value.trim() ? value.trim() : fallback);
  const section = (title, body) => `## ${title}\n\n${body}\n`;
  const maturity = clean(input.maturity, L.defaultMaturity);
  const decisions = Array.isArray(input.decisions) ? input.decisions : [];
  const validations = Array.isArray(input.validations) ? input.validations : [];
  const scope = input.scope || {};
  const lines = [
    L.title,
    "",
    `${L.maturity}${sep}${maturity}`,
    `${L.project}${sep}${clean(input.project)}`,
    "",
    section(S.current, [
      `- ${S.question}${sep}${clean(input.question)}`,
      `- ${S.recommendation}${sep}${clean(input.recommendation)}`,
      `- ${S.definition}${sep}${clean(input.productDefinition)}`,
      `- ${S.audience}${sep}${clean(input.audience, L.defaultAudience)}`
    ].join("\n")),
    section(S.value, [
      `- ${S.user}${sep}${clean(input.user)}`,
      `- ${S.situation}${sep}${clean(input.situation)}`,
      `- ${S.need}${sep}${clean(input.need)}`,
      `- ${S.alternative}${sep}${clean(input.alternative)}`,
      `- ${S.promise}${sep}${clean(input.promise)}`
    ].join("\n")),
    section(S.boundary, [
      `- ${S.mustNot}${sep}${clean(input.mustNot)}`,
      `- ${S.notNow}${sep}${clean(input.notNow)}`,
      `- ${S.constraints}${sep}${clean(input.constraints)}`,
      `- ${S.protectedQuality}${sep}${clean(input.protectedQuality)}`
    ].join("\n")),
    section(S.scope, [
      `- ${S.must}${sep}${clean(scope.must)}`,
      `- ${S.later}${sep}${clean(scope.later)}`,
      `- ${S.out}${sep}${clean(scope.out)}`
    ].join("\n")),
    section(S.decisions, decisions.length ? decisions.map((item) => `- ${clean(item.id)}${sep}${clean(item.question)} → ${clean(item.decision)}`).join("\n") : `- ${L.pending}`),
    section(S.validations, validations.length ? validations.map((item) => `- ${clean(item.id)}${sep}${clean(item.title)}${listSep}${S.observed}${sep}${clean(item.observed)}${listSep}${S.changed}${sep}${clean(item.decisionChange, L.retained)}`).join("\n") : `- ${L.pending}`),
    section(S.delivery, [
      `- ${S.metric}${sep}${clean(input.metric)}`,
      `- ${S.acceptance}${sep}${clean(input.acceptance)}`,
      `- ${S.recovery}${sep}${clean(input.recovery)}`,
      `- ${S.openQuestions}${sep}${clean(input.openQuestions)}`
    ].join("\n"))
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

export function validatePrd(input = {}) {
  const errors = [];
  const allMaturities = Object.values(MATURITY_VALUES).flat();
  if (!allMaturities.includes(input.maturity)) errors.push({ code: "BAD_MATURITY", message: "maturity must be a supported artifact maturity" });
  for (const field of ["question", "recommendation", "user", "need", "mustNot", "notNow", "acceptance"]) if (!String(input[field] || "").trim()) errors.push({ code: "MISSING_FIELD", field, message: `${field} is required for a useful PRD` });
  const ready = ["可进入交付", "Implementation-ready", "Pronto para implementação"];
  if (ready.includes(input.maturity) && (!String(input.acceptance || "").trim() || !String(input.metric || "").trim())) errors.push({ code: "INCOMPLETE_READY", message: "implementation-ready PRDs require acceptance and metrics" });
  return errors;
}
