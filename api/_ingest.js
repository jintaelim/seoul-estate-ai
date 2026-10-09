import { randomUUID } from "node:crypto";
import { collectTransactions } from "./_collect-transactions.js";
import { collectPermits, enrichPermitsWithTransactions } from "./_collect-permits.js";
import { collectRents } from "./_collect-rents.js";
import { database, databaseConfigured, getLedger, publishLedger, datasets } from "./_ledger-store.js";
import { readSnapshot, writeSnapshot } from "./_snapshot.js";
import { getHomeThemes, storeHomeThemes } from "./_home-themes.js";
import { enrichTransactionLedgerWithApartmentMetadata } from "./_enrich-apartments.js";
import { enrichTransactions } from "../transaction-domain.js";

const running = new Map();
const recent = new Map();
const rowMonth = row => String(row.dealDate || row.permitDate || "").slice(0, 7).replace("-", "");

export function mergeRollingLedger(previous, fresh, dataset) {
  if (!previous?.data?.length || !fresh?.coverage?.months?.length) return fresh;
  const refreshedMonths = new Set(fresh.coverage.months);
  const retained = previous.data.filter(row => !refreshedMonths.has(rowMonth(row)));
  let data = [...fresh.data, ...retained];
  if (dataset === "transactions") data = enrichTransactions(data);
  else data.sort((a, b) => String(b.dealDate || b.permitDate).localeCompare(String(a.dealDate || a.permitDate)));
  const months = [...new Set(data.map(rowMonth).filter(Boolean))].sort().reverse();
  return {
    ...fresh,
    data,
    count: data.length,
    latestDealDate: data.find(row => row.dealDate)?.dealDate || fresh.latestDealDate,
    coverage: { ...fresh.coverage, months, refreshMonths: fresh.coverage.months, retainedHistory: retained.length > 0 },
  };
}
async function record(run) {
  recent.set(run.dataset, run);
  await writeSnapshot({ data: [...recent.values()], fetchedAt: new Date().toISOString() }, "sync-status").catch(() => {});
  if (databaseConfigured()) {
    await database("estate_sync_runs?on_conflict=id", {
      method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(run),
    }).catch(() => {});
  }
}

export async function ingest(dataset) {
  if (![...datasets, "home-themes", "apartment-metadata"].includes(dataset)) throw new Error("지원하지 않는 원장입니다.");
  if (running.has(dataset)) return running.get(dataset);
  const pending = (async () => {
    const run = { id: randomUUID(), dataset, status: "running", started_at: new Date().toISOString() };
    await record(run);
    try {
      if (dataset === "apartment-metadata") {
        const sales = await getLedger("transactions", { refresh: true });
        const enriched = await enrichTransactionLedgerWithApartmentMetadata(sales);
        const stored = await publishLedger("transactions", enriched);
        Object.assign(run, { status: stored.warning ? "local_only" : "success", row_count: stored.count,
          finished_at: new Date().toISOString(), error: stored.warning || null });
        await record(run);
        return { ...run, apartmentMetadata: enriched.apartmentMetadata, persistence: stored.persistence };
      }
      if (dataset === "home-themes") {
        const theme = await getHomeThemes();
        const persistence = await storeHomeThemes(theme);
        const rowCount = Object.values(theme.themes).reduce((sum, rows) => sum + rows.length, 0);
        Object.assign(run, { status: "success", row_count: rowCount, finished_at: new Date().toISOString(), error: null });
        await record(run);
        return { ...run, persistence };
      }
      let payload = await (dataset === "transactions" ? collectTransactions()
        : dataset === "rent-transactions" ? collectRents()
          : collectPermits());
      if (dataset === "transactions" || dataset === "rent-transactions") {
        const previous = await getLedger(dataset, { refresh: true }).catch(() => null);
        payload = mergeRollingLedger(previous, payload, dataset);
      }
      if (dataset === "land-permits") {
        const sales = await getLedger("transactions").catch(() => null);
        if (sales) payload = enrichPermitsWithTransactions(payload, sales);
      }
      const stored = await publishLedger(dataset, payload);
      Object.assign(run, { status: stored.warning ? "local_only" : "success", row_count: stored.count, finished_at: new Date().toISOString(), error: stored.warning || null });
      await record(run);
      return { ...run, persistence: stored.persistence };
    } catch (error) {
      Object.assign(run, { status: "failed", error: error.message, finished_at: new Date().toISOString() });
      await record(run);
      throw error;
    }
  })().finally(() => running.delete(dataset));
  running.set(dataset, pending);
  return pending;
}

export function startLocalIngestion() {
  const run = dataset => ingest(dataset).catch(error => console.error(`[ingest:${dataset}] ${error.message}`));
  const runIfStale = async (dataset, maxAge) => {
    const snapshot = await readSnapshot(dataset).catch(() => null);
    if (!snapshot || Date.now() - Date.parse(snapshot.fetchedAt) >= maxAge) run(dataset);
  };
  const startup = setTimeout(() => {
    runIfStale("transactions", 30 * 60 * 1000);
    runIfStale("land-permits", 30 * 60 * 1000);
    runIfStale("rent-transactions", 6 * 60 * 60 * 1000);
  }, 1000);
  startup.unref();
  const marketInterval = setInterval(() => { run("transactions"); run("land-permits"); }, 30 * 60 * 1000);
  const rentInterval = setInterval(() => run("rent-transactions"), 6 * 60 * 60 * 1000);
  marketInterval.unref();
  rentInterval.unref();
  return () => { clearTimeout(startup); clearInterval(marketInterval); clearInterval(rentInterval); };
}
