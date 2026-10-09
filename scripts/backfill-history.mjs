import { readFileSync } from "node:fs";

try {
  for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^("|')(.*)\1$/, "$2");
  }
} catch {}

const months = Math.min(60, Math.max(3, Number(process.argv.find(value => value.startsWith("--months="))?.split("=")[1] || 24)));
const target = process.argv.find(value => value.startsWith("--dataset="))?.split("=")[1] || "all";
const { collectTransactions } = await import("../api/_collect-transactions.js");
const { collectRents } = await import("../api/_collect-rents.js");
const { publishLedger } = await import("../api/_ledger-store.js");

const jobs = target === "all" ? ["transactions", "rent-transactions"] : [target];
for (const dataset of jobs) {
  if (!["transactions", "rent-transactions"].includes(dataset)) throw new Error("지원하지 않는 원장입니다.");
  const datasetMonths = dataset === "rent-transactions" ? Math.min(months, 12) : months;
  console.log(`${dataset}: 최근 ${datasetMonths}개월 수집을 시작합니다.`);
  const payload = dataset === "transactions" ? await collectTransactions({ months: datasetMonths }) : await collectRents({ months: datasetMonths });
  const stored = await publishLedger(dataset, payload);
  console.log(JSON.stringify({ dataset, count: stored.count, latestDealDate: stored.latestDealDate, months: stored.coverage.months.length, persistence: stored.persistence, warning: stored.warning || null }));
}
