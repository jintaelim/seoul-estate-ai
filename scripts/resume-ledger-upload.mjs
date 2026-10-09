import { readFileSync } from "node:fs";

for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^("|')(.*)\1$/, "$2");
}

const dataset = process.argv[2];
if (!["transactions", "rent-transactions"].includes(dataset)) throw new Error("dataset을 지정하세요.");
const snapshot = JSON.parse(readFileSync(new URL(`../data/cache/${dataset}.json`, import.meta.url), "utf8"));
const { resumeLedgerUpload } = await import("../api/_ledger-store.js");
console.log(JSON.stringify(await resumeLedgerUpload(dataset, snapshot)));
