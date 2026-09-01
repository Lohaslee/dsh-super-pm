import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, normalize, relative, resolve } from "node:path";

const DECISIONS_DIR = ".super-pm";
const DECISIONS_FILE = "decisions.md";

export function projectDecisionPath(project) {
  if (typeof project !== "string" || project.trim() === "") throw new Error("project must be a non-empty absolute path");
  if (!isAbsolute(project)) throw new Error("project must be an absolute path");
  const root = resolve(project);
  return { root, file: join(root, DECISIONS_DIR, DECISIONS_FILE) };
}

export function assertProjectPath(project, requested = projectDecisionPath(project).file) {
  const { root, file } = projectDecisionPath(project);
  const target = resolve(requested);
  const prefix = `${root}${process.platform === "win32" ? "\\" : "/"}`;
  if (target !== file && !target.startsWith(prefix)) throw new Error("path must remain inside the project");
  if (target.includes(`${process.platform === "win32" ? "\\" : "/"}..${process.platform === "win32" ? "\\" : "/"}`)) throw new Error("parent traversal is not allowed");
  return target;
}

export async function readDecisions(project) {
  const { root, file } = projectDecisionPath(project);
  try {
    const text = await readFile(file, "utf8");
    return { root, file, text };
  } catch (error) {
    if (error?.code === "ENOENT") return { root, file, text: "# Super PM 产品决策\n\n" };
    throw error;
  }
}

export async function writeDecisions(project, text) {
  if (typeof text !== "string") throw new Error("text must be a string");
  if (Buffer.byteLength(text, "utf8") > 256 * 1024) throw new Error("decisions file exceeds 256KB");
  const { root, file } = projectDecisionPath(project);
  const dir = dirname(file);
  await mkdir(dir, { recursive: true });
  const temp = join(dir, `.decisions.${process.pid}.${Date.now()}.tmp`);
  await writeFile(temp, text, { encoding: "utf8", mode: 0o600 });
  await rename(temp, file);
  return { root, file };
}
