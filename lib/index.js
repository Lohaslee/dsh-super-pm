/**
 * dsh-super-pm — DSH runtime plugin.
 *
 * The bundled Skill provides the product method. This plugin adds a narrow,
 * explicit project-memory layer for reading and saving confirmed decisions.
 */
import { apply as applyTools } from "./tools.mjs";

export const name = "dsh-super-pm";
// `tools`/`systemPrompt` are handled lazily inside tools.mjs; `commands` is a
// base-bundle service not visible in this community bundle's Cordis realm on
// dsh rc.2, so it is registered lazily too. Keeping the static inject empty lets
// the plugin load even when these services are unavailable in this realm.
export const inject = [];
export const skillName = "super-pm";
export const skillDirectory = new URL("../skills", import.meta.url);

export function apply(ctx, config = {}) {
  applyTools(ctx, config);
  ctx.inject(["commands"], (c) => {
    if (c.commands?.register) {
      c.commands.register({
        name: "super-pm",
        description: "start Super PM product discovery or review",
        input: { hint: "[diagnose|decide|brief|prd|review|handoff]" },
        handler: () => ({ kind: "success", text: "Super PM modes: decide, diagnose, brief, prd, review, handoff. Describe the product question to continue." })
      });
    }
  });
}

export default { name, apply, skillName, skillDirectory };
