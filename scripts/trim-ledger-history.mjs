import { readFileSync } from "node:fs";

for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^("|')(.*)\1$/, "$2");
}

const dataset = process.argv[2];
const months = Number(process.argv.find(value => value.startsWith("--months="))?.split("=")[1] || 12);
if (dataset !== "rent-transactions") throw new Error("현재 전월세 원장 정리만 지원합니다.");
const snapshot = JSON.parse(readFileSync(new URL(`../data/cache/${dataset}.json`, import.meta.url), "utf8"));
const selectedMonths = snapshot.coverage.months.slice(0, months);
const allowed = new Set(selectedMonths);
const data = snapshot.data.filter(row => allowed.has(row.dealDate.slice(0, 7).replace("-", "")));
const payload = { ...snapshot, data, count: data.length, coverage: { ...snapshot.coverage, months: selectedMonths } };
delete payload.warning;
const { database } = await import("../api/_ledger-store.js");
const { writeSnapshot } = await import("../api/_snapshot.js");
const progress = await database(`estate_ledger_rows?dataset=eq.${dataset}&select=ordinal&order=ordinal.desc&limit=1`);
let maximum = Number(progress?.[0]?.ordinal || 0);
while (maximum > payload.count) {
  const lower = Math.max(payload.count + 1, maximum - 19999);
  await database(`estate_ledger_rows?dataset=eq.${dataset}&ordinal=gte.${lower}&ordinal=lte.${maximum}`, { method: "DELETE", timeoutMs: 120000 });
  maximum = lower - 1;
  console.log(`${dataset}: ${maximum}/${payload.count} 이후 행 정리 완료`);
}
const { data: ignored, persistence: oldPersistence, ...metadata } = payload;
await database("estate_ledgers?on_conflict=dataset", {
  method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({
    dataset, metadata: { ...metadata, count: payload.count }, started_at: payload.startedAt || payload.fetchedAt, fetched_at: payload.fetchedAt,
  }),
});
const stored = { ...payload, persistence: { persisted: true, local: true } };
await writeSnapshot(stored, dataset);
console.log(JSON.stringify({ dataset, count: payload.count, months: selectedMonths.length, earliest: data.at(-1)?.dealDate }));
