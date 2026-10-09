import { database, databaseConfigured, getLedger, sendJson } from "./_ledger-store.js";
import { guardReadRequest, noStore } from "./_http.js";
import { getHomeThemes, readStoredHomeThemes } from "./_home-themes.js";

export function summarizeLedger(value) {
  const counts = new Map();
  for (const row of value.data) {
    const date = row.dealDate || row.permitDate;
    const key = JSON.stringify([date, row.district, row.status || "거래"]);
    const group = counts.get(key) || { date, district: row.district, status: row.status || "거래", count: 0 };
    group.count++;
    counts.set(key, group);
  }
  const { data, ...metadata } = value;
  return { ...metadata, groups: [...counts.values()], stale: Date.now() - Date.parse(value.fetchedAt) > 3600000 };
}

const shiftDate = (value, days) => new Date(Date.parse(`${value}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);

async function summarizeRecentDatabase(dataset) {
  const headers = await database(`estate_ledgers?dataset=eq.${encodeURIComponent(dataset)}&select=metadata&limit=1`);
  const metadata = headers?.[0]?.metadata;
  if (!metadata) return null;
  const latest = metadata.latestDealDate || metadata.latestPermitDate;
  if (!latest) return { ...metadata, groups: [], persistence: { persisted: true, local: false } };
  const from = shiftDate(latest, -89);
  const data = [];
  for (let offset = 0; ; offset += 1000) {
    const page = await database(`estate_ledger_rows?dataset=eq.${encodeURIComponent(dataset)}&contract_date=gte.${from}&select=contract_date,district,status&order=contract_date.desc&limit=1000&offset=${offset}`);
    data.push(...page.map(row => ({ dealDate: row.contract_date, district: row.district, status: row.status })));
    if (page.length < 1000) break;
  }
  return summarizeLedger({ ...metadata, data, persistence: { persisted: true, local: false } });
}

export default async function handler(req, res) {
  if (!guardReadRequest(req, res)) return;
  if (req.query?.view === "home-themes") {
    try {
      const stored = await readStoredHomeThemes();
      const payload = stored?.version === 2 ? stored : await getHomeThemes();
      return sendJson(req, res, payload, { browser: 300, edge: 21600, stale: 86400 });
    }
    catch (error) { noStore(res); return res.status(503).json({ error: error.message }); }
  }
  const dataset = req.query?.dataset || "transactions";
  if (!["transactions", "rent-transactions", "land-permits"].includes(dataset)) return res.status(400).json({ error: "지원하지 않는 원장입니다." });
  try {
    if (databaseConfigured()) {
      try {
        if (dataset === "transactions" || dataset === "rent-transactions") {
          const recent = await summarizeRecentDatabase(dataset);
          if (recent) return sendJson(req, res, recent);
        }
        const remote = await database("rpc/summarize_estate_ledger", { method: "POST", body: JSON.stringify({ p_dataset: dataset }) });
        if (remote) return sendJson(req, res, { ...remote, persistence: { persisted: true, local: false }, stale: Date.now() - Date.parse(remote.fetchedAt) > 3600000 });
      } catch (error) { if (process.env.VERCEL) throw error; }
    }
    return sendJson(req, res, summarizeLedger(await getLedger(dataset, { refresh: req.query?.refresh === "1" })));
  }
  catch (error) { noStore(res); return res.status(503).json({ error: error.message }); }
}
