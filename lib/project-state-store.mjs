import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";

const DIR = ".super-pm";
const paths = (project) => {
  if (typeof project !== "string" || !project.trim() || !isAbsolute(project)) throw new Error("project must be a non-empty absolute path");
  const root = resolve(project);
  return { root, state: join(root, DIR, "state.yaml"), validations: join(root, DIR, "validations.md") };
};

async function readOrEmpty(file, empty) {
  try { return await readFile(file, "utf8"); }
  catch (error) { if (error?.code === "ENOENT") return empty; throw error; }
}

async function atomicWrite(file, text, maxBytes) {
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new Error(`${file} exceeds size limit`);
  const dir = dirname(file);
  await mkdir(dir, { recursive: true });
  const temp = join(dir, `.${file.split("/").pop()}.${process.pid}.${Date.now()}.tmp`);
  try { await writeFile(temp, text, { encoding: "utf8", mode: 0o600 }); await rename(temp, file); }
  catch (error) { try { await import("node:fs/promises").then(({ unlink }) => unlink(temp)); } catch {} throw error; }
}

export async function readProjectState(project) {
  const pathsForProject = paths(project);
  return { ...pathsForProject, text: await readOrEmpty(pathsForProject.state, "schema: 1\nstage: \"discovery\"\nopenAssumptions:\n") };
}

export async function writeProjectState(project, text) {
  const pathsForProject = paths(project);
  await atomicWrite(pathsForProject.state, text, 32 * 1024);
  return pathsForProject;
}

export async function readValidations(project) {
  const pathsForProject = paths(project);
  return { ...pathsForProject, text: await readOrEmpty(pathsForProject.validations, "# Super PM 验证记录\n\n") };
}

export async function writeValidations(project, text) {
  const pathsForProject = paths(project);
  await atomicWrite(pathsForProject.validations, text, 256 * 1024);
  return pathsForProject;
}
