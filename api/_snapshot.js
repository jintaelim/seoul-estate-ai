import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
const directory = process.env.VERCEL ? "/tmp/seoul-estate" : fileURLToPath(new URL("../data/cache/", import.meta.url));
const snapshotPath = dataset => {
  if (!["transactions", "rent-transactions", "land-permits", "sync-status"].includes(dataset)) throw new Error("Unknown dataset");
  return join(directory, `${dataset}.json`);
};
export async function readSnapshot(dataset = "transactions") {
  const path = snapshotPath(dataset);
  try { const value = JSON.parse(await readFile(path, "utf8")); if (value.persistence) value.persistence.local = true; return Array.isArray(value.data) && value.fetchedAt ? value : null; } catch { return null; }
}
export async function writeSnapshot(value, dataset = "transactions") {
  const path = snapshotPath(dataset);
  const temporary = `${path}.${randomUUID()}.tmp`;
  await mkdir(directory, { recursive: true });
  await writeFile(temporary, JSON.stringify(value), { mode: 0o600 });
  await rename(temporary, path);
}
