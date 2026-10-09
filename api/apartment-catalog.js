import { database, databaseConfigured, getLedger, sendJson } from "./_ledger-store.js";
import { guardReadRequest, noStore } from "./_http.js";
import catalogSnapshot from "./_apartment-catalog-snapshot.json" with { type: "json" };

const unitKey = row => `${row.district}|${row.dong}|${row.complex}|${Number(row.area).toFixed(1)}`;
const DAY = 86400000;

const daysBetween = (from, to) => Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / DAY));
const median = values => {
  if (!values.length) return 0;
  const ordered = [...values].sort((a, b) => a - b);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : Math.round((ordered[middle - 1] + ordered[middle]) / 2);
};

export function buildApartmentCatalog(sales, rents, permits = { data: [] }) {
  const units = new Map();
  const saleGroups = new Map();
  const latestDealDate = sales.latestDealDate || sales.data.reduce((date, row) => row.dealDate > date ? row.dealDate : date, "");
  for (const row of sales.data) {
    const key = unitKey(row);
    const group = saleGroups.get(key) || [];
    group.push(row);
    saleGroups.set(key, group);
    const current = units.get(key);
    if (!current || row.dealDate > current.dealDate || (row.dealDate === current.dealDate && row.price > current.price)) {
      units.set(key, {
        id: row.id, district: row.district, dong: row.dong, complex: row.complex, area: row.area,
        supplyArea: Number(row.supplyArea) || 0,
        price: row.price, floor: row.floor, builtYear: row.builtYear, dealDate: row.dealDate,
        previousHigh: row.previousHigh, recentCount: row.recentCount, dealingGbn: row.dealingGbn,
        aptDong: row.aptDong, address: row.address, permitZone: row.permitZone,
        households: Number(row.households) || 0, rooms: Number(row.rooms) || 0,
        floorAreaRatio: Number(row.floorAreaRatio ?? row.far) || 0,
        rentCount: 0, latestJeonse: 0, latestJeonseDate: "", latestMonthlyDeposit: 0,
        latestMonthlyRent: 0, latestMonthlyDate: "", depositChange: 0,
        tradeCount90: 0, tradeDays90: 0, medianIntervalDays: 0, daysSinceTrade: 0,
        priceDrawdownRate: 0, jeonseRatio: 0, gapAmount: 0, rentAgeDays: 0,
        permitCount: 0, approvedPermitCount: 0, latestPermitDate: "", dataConfidence: "low",
      });
    }
  }
  for (const [key, rows] of saleGroups) {
    const item = units.get(key);
    const brokerRows = rows.filter(row => row.dealingGbn !== "직거래");
    const dates = [...new Set(brokerRows.map(row => row.dealDate))].sort();
    const gaps = dates.slice(1).map((date, index) => daysBetween(dates[index], date));
    item.tradeCount90 = brokerRows.length;
    item.tradeDays90 = dates.length;
    item.medianIntervalDays = median(gaps);
    item.daysSinceTrade = latestDealDate && item.dealDate ? daysBetween(item.dealDate, latestDealDate) : 0;
    item.priceDrawdownRate = item.previousHigh > item.price
      ? Math.round((1 - item.price / item.previousHigh) * 1000) / 10 : 0;
  }
  const rentGroups = new Map();
  for (const row of rents.data) {
    const key = unitKey(row);
    const item = units.get(key);
    if (!item) continue;
    item.rentCount++;
    if (!row.monthlyRent && Number(row.deposit || 0)) {
      const group = rentGroups.get(key) || [];
      group.push(row);
      rentGroups.set(key, group);
    }
    if (!row.monthlyRent && row.dealDate >= item.latestJeonseDate) {
      item.latestJeonse = row.deposit;
      item.latestJeonseDate = row.dealDate;
    }
    if (row.monthlyRent && row.dealDate >= item.latestMonthlyDate) {
      item.latestMonthlyDeposit = row.deposit;
      item.latestMonthlyRent = row.monthlyRent;
      item.latestMonthlyDate = row.dealDate;
    }
  }
  for (const [key, rows] of rentGroups) {
    const item = units.get(key);
    const ordered = [...rows].sort((a, b) => a.dealDate.localeCompare(b.dealDate));
    item.depositChange = Number(ordered.at(-1).deposit) - Number(ordered[0].deposit);
  }
  for (const permit of permits.data || []) {
    for (const match of permit.matches || []) {
      const item = units.get(unitKey(match));
      if (!item) continue;
      item.permitCount++;
      if (permit.status === "허가") item.approvedPermitCount++;
      if (permit.permitDate >= item.latestPermitDate) item.latestPermitDate = permit.permitDate;
    }
  }
  for (const item of units.values()) {
    if (item.latestJeonse > 0 && item.price > 0) {
      item.jeonseRatio = Math.round(item.latestJeonse / item.price * 100);
      item.gapAmount = item.price - item.latestJeonse;
      item.rentAgeDays = latestDealDate && item.latestJeonseDate ? daysBetween(item.latestJeonseDate, latestDealDate) : 0;
    }
    item.dataConfidence = item.dealingGbn && item.tradeCount90 >= 3 && item.tradeDays90 >= 2 ? "high"
      : item.tradeCount90 >= 1 ? "medium" : "low";
  }
  return {
    data: [...units.values()].sort((a, b) => b.dealDate.localeCompare(a.dealDate)),
    count: units.size,
    fetchedAt: sales.fetchedAt,
    rentFetchedAt: rents.fetchedAt,
    latestDealDate,
    source: "stored-ledgers",
    coverage: { complete: sales.coverage?.complete === true && rents.coverage?.complete === true },
  };
}

export async function readStoredApartmentCatalog() {
  if (!databaseConfigured()) return catalogSnapshot;
  try {
    const rows = await database("estate_ledgers?dataset=eq.transactions&select=metadata");
    return rows?.[0]?.metadata?.apartmentCatalog || catalogSnapshot;
  } catch {
    return catalogSnapshot;
  }
}

export default async function handler(req, res) {
  if (!guardReadRequest(req, res)) return;
  try {
    const stored = await readStoredApartmentCatalog();
    if (stored?.data) return sendJson(req, res, stored, { browser: 30, edge: 900, stale: 86400 });
    const [sales, rents, permits] = await Promise.all([
      getLedger("transactions", { refresh: req.query?.refresh === "1" }),
      getLedger("rent-transactions", { refresh: req.query?.refresh === "1" }),
      getLedger("land-permits", { refresh: req.query?.refresh === "1" }),
    ]);
    return sendJson(req, res, buildApartmentCatalog(sales, rents, permits), { browser: 30, edge: 900, stale: 86400 });
  } catch (error) {
    noStore(res);
    return res.status(503).json({ error: error.message });
  }
}
