/**
 * dsh-super-pm — DSH runtime plugin.
 *
 * The bundled Skill provides the product method. This plugin adds a narrow,
 * explicit project-memory layer for reading and saving confirmed decisions.
 */
import { apply as applyTools, inject as toolsInject } from "./tools.mjs";

export const name = "dsh-super-pm";
// Re-exported from ./tools.mjs: the runtime registers its tools and its prompt
// section through `tools` and `systemPrompt`, both provided by the base bundle
// as sibling rows of the same composed tree. Injecting them statically (the
// pattern working third-party bundles use) makes the mount fail loud if a
// future release stops providing them, instead of loading a plugin that
// silently registers no tools.
export const inject = toolsInject;
export const skillName = "super-pm";
export const skillDirectory = new URL("../skills", import.meta.url);

export function apply(ctx, config = {}) {
  applyTools(ctx, config);
}

// The loader normalizes module shapes with `exports.default ?? exports`, so the
// Cordis descriptor it actually applies is THIS default object: it must carry
// `inject` itself, otherwise the runtime would apply with no declared
// dependencies and could register nothing.
export default { name, apply, inject, skillName, skillDirectory };
