/**
 * dsh-super-pm — DSH runtime plugin.
 *
 * The bundled Skill provides the product method. This plugin adds a narrow,
 * explicit project-memory layer for reading and saving confirmed decisions.
 */
import { apply as applyTools } from "./tools.mjs";

export const name = "dsh-super-pm";
// `tools` and `systemPrompt` are handled lazily inside tools.mjs. Keep the
// static inject empty so the plugin loads in community-bundle Cordis realms.
export const inject = [];
export const skillName = "super-pm";
export const skillDirectory = new URL("../skills", import.meta.url);

export function apply(ctx, config = {}) {
  applyTools(ctx, config);
}

export default { name, apply, skillName, skillDirectory };
