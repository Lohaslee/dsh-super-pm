/**
 * dsh-super-pm — package entry point.
 *
 * The runtime contribution is intentionally small: the bundle patch mounts the
 * bundled Super PM skill through DSH's local filesystem skill provider. The
 * product method remains in SKILL.md and its references, while this package
 * makes distribution and activation reproducible.
 */
export const name = "dsh-super-pm";

export const skillName = "super-pm";

export const skillDirectory = new URL("../skills", import.meta.url);

export default {
  name,
  skillName,
  skillDirectory
};
