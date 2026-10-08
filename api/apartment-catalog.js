import { getLedger, sendJson } from "./_ledger-store.js";
import { guardReadRequest, noStore } from "./_http.js";

const unitKey = row => `${row.district}|${row.dong}|${row.complex}|${Number(row.area).toFixed(1)}`;

export function buildApartmentCatalog(sales, rents) {
  const units = new Map();
  for (const row of sales.data) {
    const key = unitKey(row);
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
        latestMonthlyRent: 0, latestMonthlyDate: "",
      });
    }
  }
  for (const row of rents.data) {
    const item = units.get(unitKey(row));
    if (!item) continue;
    item.rentCount++;
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
  return {
    data: [...units.values()].sort((a, b) => b.dealDate.localeCompare(a.dealDate)),
    count: units.size,
    fetchedAt: sales.fetchedAt,
    rentFetchedAt: rents.fetchedAt,
    latestDealDate: sales.latestDealDate,
    source: "stored-ledgers",
    coverage: { complete: sales.coverage?.complete === true && rents.coverage?.complete === true },
  };
}

export default async function handler(req, res) {
  if (!guardReadRequest(req, res)) return;
  try {
    const [sales, rents] = await Promise.all([
      getLedger("transactions", { refresh: req.query?.refresh === "1" }),
      getLedger("rent-transactions", { refresh: req.query?.refresh === "1" }),
    ]);
    return sendJson(req, res, buildApartmentCatalog(sales, rents), { browser: 30, edge: 900, stale: 86400 });
  } catch (error) {
    noStore(res);
    return res.status(503).json({ error: error.message });
  }
}
