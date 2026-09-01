/**
 * dsh-super-pm — DSH runtime plugin.
 *
 * The bundled Skill provides the product method. This plugin adds a narrow,
 * explicit project-memory layer for reading and saving confirmed decisions.
 */
import { apply as applyTools } from "./tools.mjs";

export const name = "dsh-super-pm";
export const inject = ["tools", "systemPrompt"];
export const skillName = "super-pm";
export const skillDirectory = new URL("../skills", import.meta.url);

export function apply(ctx, config = {}) {
  applyTools(ctx, config);
  if (ctx.commands?.register) {
    ctx.commands.register({
      name: "super-pm",
      description: "start Super PM product discovery or review",
      input: { hint: "[diagnose|decide|brief|prd|review|handoff]" },
      handler: () => ({ kind: "success", text: "Super PM modes: decide, diagnose, brief, prd, review, handoff. Describe the product question to continue." })
    });
  }
}

export default { name, apply, skillName, skillDirectory };
