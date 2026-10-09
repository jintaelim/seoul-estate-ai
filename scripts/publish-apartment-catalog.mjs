import { readFileSync, writeFileSync } from "node:fs";

for (const line of readFileSync(new URL("../.env", import.meta.url), "utf8").split("\n")) {
  const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^("|')(.*)\1$/, "$2");
}

const load = name => JSON.parse(readFileSync(new URL(`../data/cache/${name}.json`, import.meta.url), "utf8"));
const sales = load("transactions");
const rents = load("rent-transactions");
const permits = load("land-permits");
const latest = sales.latestDealDate;
const from = new Date(Date.parse(`${latest}T00:00:00Z`) - 89 * 86400000).toISOString().slice(0, 10);
const windowed = ledger => ({ ...ledger, data: ledger.data.filter(row => row.dealDate >= from) });
const { buildApartmentCatalog } = await import("../api/apartment-catalog.js");
const catalog = buildApartmentCatalog(windowed(sales), windowed(rents), permits);
catalog.coverage = { ...catalog.coverage, from, latestDealDate: latest, days: 90 };
writeFileSync(new URL("../api/_apartment-catalog-snapshot.json", import.meta.url), JSON.stringify(catalog));
const { database } = await import("../api/_ledger-store.js");
const rows = await database("estate_ledgers?dataset=eq.transactions&select=metadata");
const metadata = rows?.[0]?.metadata;
if (!metadata) throw new Error("매매 원장 메타데이터가 없습니다.");
let warning = null;
await database("estate_ledgers?dataset=eq.transactions", {
  method: "PATCH", headers: { Prefer: "return=minimal" },
  body: JSON.stringify({ metadata: { ...metadata, apartmentCatalog: catalog, apartmentCatalogFetchedAt: new Date().toISOString() } }), timeoutMs: 120000,
}).catch(error => { warning = error.message; });
console.log(JSON.stringify({ count: catalog.count, from, latest, bytes: Buffer.byteLength(JSON.stringify(catalog)), warning }));
