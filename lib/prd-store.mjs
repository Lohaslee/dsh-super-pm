import { mkdir, rename, writeFile, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

function paths(project) {
  if (typeof project !== "string" || !project.trim() || !project.startsWith("/")) throw new Error("project must be a non-empty absolute path");
  const root = resolve(project);
  return { root, file: join(root, ".super-pm", "prd.md") };
}

export async function readPrd(project) {
  const target = paths(project);
  try { return { ...target, text: await readFile(target.file, "utf8") }; }
  catch (error) { if (error?.code === "ENOENT") return { ...target, text: "" }; throw error; }
}

export async function writePrd(project, text) {
  const target = paths(project);
  if (Buffer.byteLength(text, "utf8") > 256 * 1024) throw new Error("PRD exceeds 256KB");
  const dir = dirname(target.file);
  await mkdir(dir, { recursive: true });
  const temp = join(dir, `.prd.${process.pid}.${Date.now()}.tmp`);
  try { await writeFile(temp, text, { encoding: "utf8", mode: 0o600 }); await rename(temp, target.file); }
  catch (error) { try { const { unlink } = await import("node:fs/promises"); await unlink(temp); } catch {} throw error; }
  return target;
}
