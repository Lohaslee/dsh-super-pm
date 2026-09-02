import assert from "node:assert/strict";
import { easterEgg, productPulse, redactedDecisionCard } from "../lib/share-core.mjs";

const decision = { id: "DEC-0001", question: "首个版本服务谁？", decision: "只服务独立开发者", negativeBoundary: "不做团队权限", evidence: "内部访谈", status: "current", nextValidation: "一周试用" };
const card = redactedDecisionCard(decision);
assert.match(card, /DEC-0001/);
assert.doesNotMatch(card, /内部访谈/);
assert.doesNotMatch(card, /super-pm\/private/);
assert.match(redactedDecisionCard(decision, { includeEvidence: true }), /内部访谈/);
const pulse = productPulse(decision, [{ observed: "6\/10", nextAction: "扩大样本" }]);
assert.equal(pulse.level, "清晰");
assert.equal(easterEgg("我想找彩蛋", { pickFn: () => 0 }).message, "彩蛋是彩色的蛋，在合适的时候你就会发现它。");
assert.equal(easterEgg("有没有隐藏功能", { pickFn: () => 0.99 }).trigger, "explicit");
assert.equal(easterEgg("普通问题").found, false);
assert.equal(easterEgg("普通问题", { random: true, randomFn: () => 0.99 }).found, false);
assert.equal(easterEgg("普通问题", { random: true, randomFn: () => 0, pickFn: () => 0 }).id, "smallest-test");
assert.match(easterEgg("普通问题", { random: true, event: "scope-cut", randomFn: () => 0, pickFn: () => 0 }).message, /乔帮主路过/);
assert.equal(easterEgg("普通问题", { completedDecisions: 7 }).id, "seven-lenses");
console.log("share and easter egg tests passed");
