import { readFileSync } from "node:fs";
try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
} catch {}
const { ingest } = await import("../api/_ingest.js");
const targets = process.argv[2] ? [process.argv[2]] : ["transactions", "land-permits"];
for (const dataset of targets) {
  try { console.log(JSON.stringify(await ingest(dataset))); }
  catch (error) { console.error(`${dataset}: ${error.message}`); process.exitCode = 1; }
}
