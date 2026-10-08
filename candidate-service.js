import { XMLParser } from "fast-xml-parser";
import { CANDIDATE_APARTMENTS, CANDIDATE_DISTRICTS } from "./candidate-apartments.js";

export const DISTRICT_CODES = {
  종로구: "11110", 중구: "11140", 용산구: "11170",
  성동구: "11200", 광진구: "11215", 동대문구: "11230",
  중랑구: "11260", 성북구: "11290", 강북구: "11305",
  도봉구: "11320", 노원구: "11350", 은평구: "11380",
  서대문구: "11410", 마포구: "11440", 양천구: "11470",
  강서구: "11500", 구로구: "11530", 금천구: "11545",
  영등포구: "11560", 동작구: "11590", 관악구: "11620",
  서초구: "11650", 강남구: "11680", 송파구: "11710",
  강동구: "11740",
};

const xmlParser = new XMLParser({ ignoreAttributes: false });
const FETCH_HEADERS = {
  "User-Agent": "Seoul-Estate-AI/1.0",
  "Accept": "application/xml, text/xml, */*",
};

export function normalizeMonthsParam(value, fallback = 12) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(240, Math.round(n)));
}

function getYearMonths(months) {
  const base = new Date();
  base.setDate(1);
  return Array.from({ length: months }, (_, i) => {
    const d = new Date(base);
    d.setMonth(base.getMonth() - i);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
}

function parsePrice(raw) {
  return Number(String(raw ?? "0").replace(/,/g, "").trim());
}

function normalizeName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/이편한세상/g, "e편한세상")
    .replace(/e-편한세상/g, "e편한세상")
    .replace(/아파트|맨션|단지/g, "")
    .replace(/[()\[\]{}·.\s_-]/g, "")
    .trim();
}

function arrayify(items) {
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function assertApiHeader(parsed, lawdCd, dealYmd) {
  const header = parsed?.response?.header;
  const code = String(header?.resultCode ?? "00");
  if (code !== "00" && code !== "0") {
    const msg = header?.resultMsg || "국토부 API 오류";
    throw new Error(`${lawdCd} ${dealYmd}: ${code} ${msg}`);
  }
}

async function fetchDistrictPage(serviceKey, lawdCd, dealYmd, pageNo) {
  const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade");
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("LAWD_CD", lawdCd);
  url.searchParams.set("DEAL_YMD", dealYmd);

  const res = await fetch(url.toString(), { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`${lawdCd} ${dealYmd}: HTTP ${res.status}`);

  const parsed = xmlParser.parse(await res.text());
  assertApiHeader(parsed, lawdCd, dealYmd);

  const body = parsed?.response?.body;
  const list = arrayify(body?.items?.item);
  const totalCount = Number(body?.totalCount ?? list.length);
  return { list, totalCount };
}

async function fetchDistrictMonth(serviceKey, lawdCd, dealYmd) {
  const first = await fetchDistrictPage(serviceKey, lawdCd, dealYmd, 1);
  const allItems = [...first.list];
  const totalPages = Math.ceil(first.totalCount / 1000);

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchDistrictPage(serviceKey, lawdCd, dealYmd, i + 2)
      )
    );
    for (const { list } of rest) allItems.push(...list);
  }

  return allItems;
}

function normalizeTransaction(item, district) {
  const year = String(item.dealYear ?? "");
  const month = String(item.dealMonth ?? "").padStart(2, "0");
  const day = String(item.dealDay ?? "").padStart(2, "0");
  const cdealType = String(item.cdealType ?? "").trim();
  const cdealDay = String(item.cdealDay ?? "").trim();

  if (cdealType === "O" || cdealType.includes("취소") || cdealDay) return null;

  const dong = String(item.umdNm ?? "").trim();
  const complex = String(item.aptNm ?? "").trim();
  const jibun = String(item.jibun ?? "").trim();
  const roadName = String(item.roadNm ?? "").trim();
  const area = Number(item.excluUseAr) || 0;
  const price = parsePrice(item.dealAmount);
  const floor = Number(item.floor) || 0;
  const builtYear = Number(item.buildYear) || null;
  const dealDate = `${year}-${month}-${day}`;

  return {
    id: `${district}-${dong}-${complex}-${dealDate}-${area}-${floor}-${price}`,
    district,
    dong,
    complex,
    area,
    floor,
    price,
    builtYear,
    dealDate,
    dealingGbn: String(item.dealingGbn ?? "").trim(),
    aptDong: String(item.aptDong ?? "").trim(),
    jibun,
    roadName,
    address: `서울 ${district} ${dong}${jibun ? " " + jibun : ""}`,
    rawName: complex,
  };
}

async function batch(tasks, size = 5) {
  const results = [];
  for (let i = 0; i < tasks.length; i += size) {
    const chunk = await Promise.all(tasks.slice(i, i + size).map((task) => task()));
    results.push(...chunk);
  }
  return results;
}

function isCandidateMatch(tx, candidate) {
  if (tx.district !== candidate.district) return false;
  if (candidate.dongs?.length && !candidate.dongs.includes(tx.dong)) return false;

  const txName = normalizeName(tx.complex);
  const aliases = [candidate.name, ...(candidate.aliases ?? [])]
    .map(normalizeName)
    .filter((alias) => alias.length >= 2);

  return aliases.some((alias) =>
    txName === alias ||
    txName.includes(alias) ||
    (txName.length >= 3 && alias.includes(txName))
  );
}

function pickMode(values) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? null;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function summarizeAreaGroups(transactions) {
  const groups = new Map();
  for (const tx of transactions) {
    const key = tx.area.toFixed(2);
    const group = groups.get(key) ?? { area: tx.area, count: 0, latest: null, minPrice: tx.price, maxPrice: tx.price };
    group.count += 1;
    group.minPrice = Math.min(group.minPrice, tx.price);
    group.maxPrice = Math.max(group.maxPrice, tx.price);
    if (!group.latest || tx.dealDate > group.latest.dealDate) group.latest = tx;
    groups.set(key, group);
  }

  return [...groups.values()]
    .sort((a, b) => a.area - b.area)
    .map((group) => ({
      area: group.area,
      count: group.count,
      latestPrice: group.latest?.price ?? null,
      latestDate: group.latest?.dealDate ?? null,
      minPrice: group.minPrice,
      maxPrice: group.maxPrice,
    }));
}

function buildSummary(transactions) {
  if (!transactions.length) {
    return {
      transactionCount: 0,
      latest: null,
      highest: null,
      lowest: null,
      medianPrice: null,
      builtYear: null,
      areaGroups: [],
      matchedComplexNames: [],
      addresses: [],
    };
  }

  const sorted = [...transactions].sort((a, b) =>
    b.dealDate.localeCompare(a.dealDate) || b.price - a.price
  );
  const prices = transactions.map((tx) => tx.price);
  const highest = [...transactions].sort((a, b) => b.price - a.price)[0];
  const lowest = [...transactions].sort((a, b) => a.price - b.price)[0];

  return {
    transactionCount: transactions.length,
    latest: sorted[0],
    highest,
    lowest,
    medianPrice: median(prices),
    builtYear: pickMode(transactions.map((tx) => tx.builtYear)),
    areaGroups: summarizeAreaGroups(transactions),
    matchedComplexNames: [...new Set(transactions.map((tx) => tx.complex))].sort(),
    addresses: [...new Set(transactions.map((tx) => tx.address))].slice(0, 5),
  };
}

function sortCandidates(a, b) {
  const ap = a.candidate.priority ?? 999;
  const bp = b.candidate.priority ?? 999;
  return ap - bp || a.candidate.district.localeCompare(b.candidate.district, "ko") ||
    a.candidate.name.localeCompare(b.candidate.name, "ko");
}

export async function fetchCandidateTransactions({ serviceKey, months = 12 } = {}) {
  if (!serviceKey) {
    return {
      data: CANDIDATE_APARTMENTS.map((candidate) => ({
        candidate,
        summary: buildSummary([]),
        transactions: [],
      })).sort(sortCandidates),
      source: "missing-key",
      fetchedAt: new Date().toISOString(),
      months,
      errors: ["MOLIT_API_KEY가 설정되지 않았습니다."],
    };
  }

  const yearMonths = getYearMonths(months);
  const errors = [];
  const tasks = CANDIDATE_DISTRICTS.map((district) => {
    const lawdCd = DISTRICT_CODES[district];
    return yearMonths.map((dealYmd) => async () => {
      try {
        const rows = await fetchDistrictMonth(serviceKey, lawdCd, dealYmd);
        return rows.map((row) => normalizeTransaction(row, district)).filter(Boolean);
      } catch (err) {
        errors.push(`${district} ${dealYmd}: ${err.message}`);
        return [];
      }
    });
  }).flat();

  const allTransactions = (await batch(tasks, 12)).flat();

  const data = CANDIDATE_APARTMENTS.map((candidate) => {
    const transactions = allTransactions
      .filter((tx) => isCandidateMatch(tx, candidate))
      .sort((a, b) => b.dealDate.localeCompare(a.dealDate) || b.price - a.price);
    return {
      candidate,
      summary: buildSummary(transactions),
      transactions,
    };
  }).sort(sortCandidates);

  return {
    data,
    source: "molit",
    fetchedAt: new Date().toISOString(),
    months,
    districtCount: CANDIDATE_DISTRICTS.length,
    transactionPoolCount: allTransactions.length,
    matchedTransactionCount: data.reduce((sum, item) => sum + item.transactions.length, 0),
    errors: errors.slice(0, 20),
  };
}
