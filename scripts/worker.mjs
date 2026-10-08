import { readFileSync } from "node:fs";

try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(\"|')(.*)\1$/, "$2");
  }
} catch {}

const { startLocalIngestion } = await import("../api/_ingest.js");
const stop = startLocalIngestion();
const keepAlive = setInterval(() => {}, 60_000);
console.log("Estate ingestion worker started");

const shutdown = () => {
  stop();
  clearInterval(keepAlive);
  process.exit(0);
};
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
