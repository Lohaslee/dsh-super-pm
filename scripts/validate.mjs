import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const packageJson = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const skillPath = join(root, "skills", "super-pm", "SKILL.md");
const patchPath = join(root, "cordis.patch.yml");
const skill = await readFile(skillPath, "utf8");
const patch = await readFile(patchPath, "utf8");

if (packageJson.name !== "dsh-super-pm") throw new Error("package name must be dsh-super-pm");
if (packageJson.main !== "lib/index.js") throw new Error("main must point to lib/index.js");
if (packageJson.dsh?.bundle?.patch !== "./cordis.patch.yml") throw new Error("missing DSH bundle patch");
if (!/^---\s*\nname:\s*super-pm\s*\n/m.test(skill)) throw new Error("bundled Skill must declare name: super-pm");
if (!/^description:\s*.+$/m.test(skill)) throw new Error("bundled Skill must declare a description");
if (!patch.includes("id: super-pm-skill-filesystem")) throw new Error("patch must declare the Super PM provider node");
if (!patch.includes("name: skill-filesystem")) throw new Error("patch must use skill-filesystem");
if (!patch.includes("providerName: super-pm-filesystem")) throw new Error("patch must use a unique provider name");
if (!patch.includes("customSkillDirs:") || !patch.includes("- ./skills")) throw new Error("patch must mount the package-local skills directory");

console.log(`validated ${packageJson.name}@${packageJson.version}`);
console.log(`skill: ${skillPath}`);
console.log(`patch: ${patchPath}`);
