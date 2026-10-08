import { readFileSync } from "node:fs";
try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
} catch {}
const { readSnapshot } = await import("../api/_snapshot.js");
const { publishLedger } = await import("../api/_ledger-store.js");
const dataset = process.argv[2];
if (!dataset) throw new Error("게시할 dataset을 입력하세요.");
const snapshot = await readSnapshot(dataset);
if (!snapshot) throw new Error(`${dataset} 로컬 원장이 없습니다.`);
const months = Number(process.argv.find(value => value.startsWith("--months="))?.split("=")[1] || 0);
let payload = snapshot;
if (months > 0 && dataset === "rent-transactions") {
  const selectedMonths = snapshot.coverage.months.slice(0, months);
  const allowed = new Set(selectedMonths);
  const data = snapshot.data.filter(row => allowed.has(row.dealDate.slice(0, 7).replace("-", "")));
  payload = { ...snapshot, data, count: data.length, coverage: {
    ...snapshot.coverage, months: selectedMonths, requested: selectedMonths.length * 25,
    succeeded: selectedMonths.length * 25, complete: true,
  } };
}
const result = await publishLedger(dataset, payload);
console.log(JSON.stringify({ dataset, count: result.count, fetchedAt: result.fetchedAt, persistence: result.persistence, warning: result.warning || null }));
