import { database, databaseConfigured, getLedger, readFilteredLedger } from "./_ledger-store.js";

const DAY = 86400000;
const complexKey = row => `${row.district}|${row.dong}|${row.complex}`;
const shiftDate = (value, days) => new Date(Date.parse(`${value}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
const later = (a, b) => !a || b.dealDate > a.dealDate || (b.dealDate === a.dealDate && Number(b.price || b.deposit) > Number(a.price || a.deposit)) ? b : a;

async function readRange(dataset, from) {
  if (!databaseConfigured()) {
    const ledger = await getLedger(dataset);
    return ledger.data.filter(row => row.dealDate >= from);
  }
  const first = await readFilteredLedger(dataset, { from, page: 1, limit: 200 });
  const pages = Math.ceil(Number(first.totalCount || first.data?.length || 0) / 200);
  const rows = [...(first.data || [])];
  for (let start = 2; start <= pages; start += 6) {
    const batch = await Promise.all(Array.from({ length: Math.min(6, pages - start + 1) }, (_, index) =>
      readFilteredLedger(dataset, { from, page: start + index, limit: 200 })));
    for (const page of batch) rows.push(...(page.data || []));
  }
  return rows;
}

function pickDistrictLeaders(groups, compare) {
  const leaders = new Map();
  for (const group of groups.values()) {
    const current = leaders.get(group.district);
    if (!current || compare(group, current) < 0) leaders.set(group.district, group);
  }
  return [...leaders.values()].sort((a, b) => a.district.localeCompare(b.district, "ko"));
}

export function buildHomeThemes(sales, rents, latestDealDate) {
  const cutoff30 = shiftDate(latestDealDate, -29);
  const activeGroups = new Map();
  const saleGroups = new Map();
  const latestSales = new Map();
  for (const row of sales) {
    const key = complexKey(row);
    latestSales.set(key, later(latestSales.get(key), row));
    const sale = saleGroups.get(key) || { district: row.district, dong: row.dong, complex: row.complex, count: 0, representative: row, peakPrice: 0 };
    sale.count++;
    sale.representative = later(sale.representative, row);
    if (row.price > sale.peakPrice) { sale.peakPrice = row.price; sale.peakDeal = row; }
    saleGroups.set(key, sale);
    if (row.dealDate < cutoff30) continue;
    const active = activeGroups.get(key) || { district: row.district, dong: row.dong, complex: row.complex, count: 0, representative: row };
    active.count++;
    active.representative = later(active.representative, row);
    activeGroups.set(key, active);
  }

  const active = pickDistrictLeaders(activeGroups, (a, b) => b.count - a.count || b.representative.dealDate.localeCompare(a.representative.dealDate) || b.representative.price - a.representative.price)
    .map(group => ({ ...group.representative, themeMetric: `${group.count}건`, themeNote: `최근 30일 매매 ${group.count}건` }));
  const premium = pickDistrictLeaders(saleGroups, (a, b) => b.peakPrice - a.peakPrice || b.peakDeal.dealDate.localeCompare(a.peakDeal.dealDate))
    .map(group => ({ ...group.peakDeal, themeMetric: `${group.peakDeal.price}`, themeNote: "최근 90일 최고 계약" }));

  const rentGroups = new Map();
  for (const row of rents) {
    if (Number(row.monthlyRent || 0) > 0) continue;
    const key = complexKey(row);
    const group = rentGroups.get(key) || { district: row.district, dong: row.dong, complex: row.complex, count: 0, representative: row };
    group.count++;
    group.representative = later(group.representative, row);
    rentGroups.set(key, group);
  }
  const rentDemand = pickDistrictLeaders(rentGroups, (a, b) => b.count - a.count || Number(b.representative.deposit) - Number(a.representative.deposit))
    .map(group => {
      const sale = latestSales.get(`${group.district}|${group.dong}|${group.complex}`);
      if (!sale) return null;
      return { ...sale, latestJeonse: group.representative.deposit, latestJeonseDate: group.representative.dealDate,
        themeMetric: `${group.count}건`, themeNote: `최근 90일 전세 ${group.count}건` };
    }).filter(Boolean);

  return { latestDealDate, periods: { activeFrom: cutoff30, historyFrom: shiftDate(latestDealDate, -89) }, themes: { active, premium, rentDemand } };
}

export async function getHomeThemes() {
  let latestDealDate = "";
  if (databaseConfigured()) {
    const summary = await database("rpc/summarize_estate_ledger", { method: "POST", body: JSON.stringify({ p_dataset: "transactions" }) });
    latestDealDate = summary?.latestDealDate || "";
  } else {
    latestDealDate = (await getLedger("transactions")).latestDealDate || "";
  }
  if (!latestDealDate) throw new Error("매매 원장의 최신 계약일을 확인할 수 없습니다.");
  const from = shiftDate(latestDealDate, -89);
  const [sales, rents] = await Promise.all([readRange("transactions", from), readRange("rent-transactions", from)]);
  return buildHomeThemes(sales, rents, latestDealDate);
}

export async function readStoredHomeThemes() {
  if (!databaseConfigured()) return null;
  const rows = await database("estate_ledgers?dataset=eq.transactions&select=metadata");
  return rows?.[0]?.metadata?.homeThemes || null;
}

export async function storeHomeThemes(theme) {
  if (!databaseConfigured()) return { persisted: false };
  const rows = await database("estate_ledgers?dataset=eq.transactions&select=metadata");
  const metadata = rows?.[0]?.metadata;
  if (!metadata) throw new Error("매매 원장 메타데이터가 없습니다.");
  await database("estate_ledgers?dataset=eq.transactions", {
    method: "PATCH", headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ metadata: { ...metadata, homeThemes: theme, homeThemesFetchedAt: new Date().toISOString() } }),
  });
  return { persisted: true };
}
