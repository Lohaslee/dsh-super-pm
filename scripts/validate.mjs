import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const skillPath = join(root, "skills", "super-pm", "SKILL.md");
const patchPath = join(root, "cordis.patch.yml");
const skill = await readFile(skillPath, "utf8");
const patch = await readFile(patchPath, "utf8");
const tools = await readFile(join(root, "lib", "tools.mjs"), "utf8");

if (packageJson.name !== "dsh-super-pm") throw new Error("package name must be dsh-super-pm");
if (packageJson.main !== "lib/index.js") throw new Error("main must point to lib/index.js");
if (packageJson.dsh?.bundle?.patch !== "./cordis.patch.yml") throw new Error("missing DSH bundle patch");
if (!/^---\s*\nname:\s*super-pm\s*\n/m.test(skill)) throw new Error("bundled Skill must declare name: super-pm");
if (!/^description:\s*.+$/m.test(skill)) throw new Error("bundled Skill must declare a description");
if (!patch.includes("id: super-pm-skill-filesystem")) throw new Error("patch must declare the Super PM provider node");
if (!patch.includes("name: skill-filesystem")) throw new Error("patch must use skill-filesystem");
if (!patch.includes("providerName: super-pm-filesystem")) throw new Error("patch must use a unique provider name");
if (!patch.includes("customSkillDirs:") || !patch.includes("- ./skills")) throw new Error("patch must mount the package-local skills directory");
if (!patch.includes("id: super-pm-tools") || !patch.includes("name: dsh-super-pm")) throw new Error("patch must mount the plugin entry");
if (!packageJson.peerDependencies?.["@deepseek-ai/dsh-tools"]) throw new Error("plugin must declare dsh-tools as a peer dependency");
for (const tool of ["super_pm_read_decisions", "super_pm_save_decision", "super_pm_decision_history", "super_pm_validate_decisions", "super_pm_prepare_handoff", "super_pm_recovery_summary", "super_pm_record_validation", "super_pm_update_state", "super_pm_traceability_report"]) {
  if (!tools.includes(`name: \"${tool}\"`)) throw new Error(`missing tool: ${tool}`);
}

console.log(`validated ${packageJson.name}@${packageJson.version}`);
console.log(`skill: ${skillPath}`);
console.log(`patch: ${patchPath}`);
