import { database, databaseConfigured, getLedger, readFilteredLedger } from "./_ledger-store.js";

const DAY = 86400000;
const complexKey = row => `${row.district}|${row.dong}|${row.complex}`;
const unitKey = row => `${complexKey(row)}|${Number(row.area || 0).toFixed(1)}`;
const shiftDate = (value, days) => new Date(Date.parse(`${value}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
const later = (a, b) => !a || b.dealDate > a.dealDate || (b.dealDate === a.dealDate && Number(b.price || b.deposit) > Number(a.price || a.deposit)) ? b : a;
const median = values => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
};
const quantile = (values, ratio) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)))];
};

async function readRange(dataset, from) {
  if (!databaseConfigured()) {
    const ledger = await getLedger(dataset);
    return ledger.data.filter(row => (row.dealDate || row.permitDate || "") >= from);
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

function buildLiquidity(sales, latestDealDate) {
  const groups = new Map();
  for (const row of sales) {
    if (row.dealingGbn === "직거래") continue;
    const key = unitKey(row);
    const group = groups.get(key) || { rows: [], representative: row };
    group.rows.push(row);
    group.representative = later(group.representative, row);
    groups.set(key, group);
  }
  const bestByComplex = new Map();
  for (const group of groups.values()) {
    const rows = [...group.rows].sort((a, b) => a.dealDate.localeCompare(b.dealDate));
    const dates = [...new Set(rows.map(row => row.dealDate))];
    const gaps = dates.slice(1).map((date, index) => Math.max(0, Math.round((Date.parse(date) - Date.parse(dates[index])) / DAY)));
    const prices = rows.map(row => Number(row.price || 0)).filter(Boolean);
    const signal = { ...group.representative, tradeCount90: rows.length, tradeDays90: dates.length, medianIntervalDays: median(gaps),
      priceBandLow: quantile(prices, .25), priceBandHigh: quantile(prices, .75),
      daysSinceTrade: Math.max(0, Math.round((Date.parse(latestDealDate) - Date.parse(group.representative.dealDate)) / DAY)),
      executionLevel: dates.length >= 4 && rows.length >= 6 && median(gaps) <= 20 ? "높음" : dates.length >= 2 && rows.length >= 3 ? "보통" : "관찰 중" };
    const key = complexKey(signal);
    const current = bestByComplex.get(key);
    if (!current || signal.tradeCount90 > current.tradeCount90 || (signal.tradeCount90 === current.tradeCount90 && signal.dealDate > current.dealDate)) bestByComplex.set(key, signal);
  }
  return [...bestByComplex.values()].sort((a, b) => b.tradeDays90 - a.tradeDays90 || b.tradeCount90 - a.tradeCount90 || a.medianIntervalDays - b.medianIntervalDays || b.dealDate.localeCompare(a.dealDate)).slice(0, 8);
}

function buildRentDefense(sales, rents) {
  const latestSales = new Map();
  for (const row of sales) latestSales.set(unitKey(row), later(latestSales.get(unitKey(row)), row));
  const groups = new Map();
  for (const row of rents) {
    if (Number(row.monthlyRent || 0) > 0 || !Number(row.deposit || 0)) continue;
    const key = unitKey(row);
    const group = groups.get(key) || [];
    group.push(row);
    groups.set(key, group);
  }
  const bestByComplex = new Map();
  for (const [key, rows] of groups) {
    const sale = latestSales.get(key);
    if (!sale) continue;
    const ordered = [...rows].sort((a, b) => a.dealDate.localeCompare(b.dealDate));
    const rent = ordered.at(-1);
    const ratio = Math.round(Number(rent.deposit) / Number(sale.price) * 100);
    if (!Number.isFinite(ratio) || ratio <= 0 || ratio >= 100) continue;
    const signal = { ...sale, latestJeonse: Number(rent.deposit), latestJeonseDate: rent.dealDate,
      rentCount90: rows.length, jeonseRatio: ratio, gapAmount: Number(sale.price) - Number(rent.deposit),
      depositChange: Number(rent.deposit) - Number(ordered[0].deposit), contractType: rent.contractType || "" };
    const complex = complexKey(signal);
    const current = bestByComplex.get(complex);
    if (!current || signal.rentCount90 > current.rentCount90 || (signal.rentCount90 === current.rentCount90 && signal.latestJeonseDate > current.latestJeonseDate)) bestByComplex.set(complex, signal);
  }
  return [...bestByComplex.values()].sort((a, b) => b.rentCount90 - a.rentCount90 || b.jeonseRatio - a.jeonseRatio).slice(0, 8);
}

function buildPermitImpact(permits) {
  const groups = new Map();
  for (const permit of permits) {
    for (const match of permit.matches || []) {
      const key = complexKey(match);
      const group = groups.get(key) || { representative: match, permitCount: 0, approvedCount: 0, latestPermitDate: "", purpose: "" };
      group.permitCount++;
      if (permit.status === "허가") group.approvedCount++;
      if (permit.permitDate >= group.latestPermitDate) {
        group.latestPermitDate = permit.permitDate;
        group.purpose = permit.purpose;
        group.status = permit.status;
      }
      if (match.dealDate > group.representative.dealDate) group.representative = match;
      groups.set(key, group);
    }
  }
  return [...groups.values()].map(group => ({ ...group.representative, permitCount: group.permitCount,
    approvedCount: group.approvedCount, latestPermitDate: group.latestPermitDate, permitPurpose: group.purpose, permitStatus: group.status }))
    .sort((a, b) => b.permitCount - a.permitCount || b.latestPermitDate.localeCompare(a.latestPermitDate)).slice(0, 8);
}

export function buildHomeThemes(sales, rents, latestDealDate, permits = []) {
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

  const liquidity = buildLiquidity(sales, latestDealDate);
  const rentDefense = buildRentDefense(sales, rents);
  const permitImpact = buildPermitImpact(permits);
  return { version: 2, latestDealDate, periods: { activeFrom: cutoff30, historyFrom: shiftDate(latestDealDate, -89) },
    themes: { active, premium, rentDemand, liquidity, rentDefense, permitImpact } };
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
  const [sales, rents, permits] = await Promise.all([readRange("transactions", from), readRange("rent-transactions", from), readRange("land-permits", from)]);
  return buildHomeThemes(sales, rents, latestDealDate, permits);
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
