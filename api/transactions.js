import { XMLParser } from "fast-xml-parser";

const SERVICE_KEY = process.env.MOLIT_API_KEY;

const DISTRICT_CODES = {
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

const PERMIT_ZONE_MAP = {
  "대치동": "잠실·삼성·대치·청담", "삼성동": "잠실·삼성·대치·청담",
  "청담동": "잠실·삼성·대치·청담", "잠실동": "잠실·삼성·대치·청담",
  "성수동1가": "성수전략정비구역", "성수동2가": "성수전략정비구역",
  "한남동": "한남재정비촉진구역",
  "목동": "목동택지개발지구", "신정동": "목동택지개발지구",
  "여의도동": "여의도 토지거래허가구역",
  "압구정동": "압구정 토지거래허가구역",
  "개포동": "개포·일원 토지거래허가구역", "일원동": "개포·일원 토지거래허가구역",
  "도곡동": "도곡·대치 토지거래허가구역",
};

const xmlParser = new XMLParser({ ignoreAttributes: false });

function getPermitZone(dong) {
  return PERMIT_ZONE_MAP[dong] ?? null;
}

function getYearMonth(offsetMonths = 0) {
  const d = new Date();
  d.setMonth(d.getMonth() - offsetMonths);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const FETCH_HEADERS = {
  "User-Agent": "Seoul-Estate-AI/1.0",
  "Accept": "application/xml, text/xml, */*",
};

async function fetchDistrictPage(lawdCd, dealYmd, pageNo) {
  const url = new URL("http://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade");
  url.searchParams.set("serviceKey", SERVICE_KEY);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("LAWD_CD", lawdCd);
  url.searchParams.set("DEAL_YMD", dealYmd);

  const res = await fetch(url.toString(), { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`API ${res.status} for ${lawdCd} ${dealYmd}`);
  const xml = await res.text();
  const parsed = xmlParser.parse(xml);
  const body = parsed?.response?.body;
  const items = body?.items?.item;
  const totalCount = Number(body?.totalCount ?? 0);
  const list = !items ? [] : Array.isArray(items) ? items : [items];
  return { list, totalCount };
}

async function fetchDistrict(lawdCd, dealYmd) {
  const first = await fetchDistrictPage(lawdCd, dealYmd, 1);
  const allItems = [...first.list];
  const totalPages = Math.ceil(first.totalCount / 1000);
  // 2페이지 이상 있으면 나머지 페이지 병렬 수집
  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) => fetchDistrictPage(lawdCd, dealYmd, i + 2))
    );
    for (const { list } of rest) allItems.push(...list);
  }
  return allItems;
}

function parsePrice(raw) {
  return Number(String(raw ?? "0").replace(/,/g, "").trim());
}

function normalizeItem(item, district) {
  const price = parsePrice(item["dealAmount"]);
  const area = Number(item["excluUseAr"]) || 0;
  const floor = Number(item["floor"]) || 1;
  const builtYear = Number(item["buildYear"]) || 0;
  const year = String(item["dealYear"]);
  const month = String(item["dealMonth"]).padStart(2, "0");
  const day = String(item["dealDay"]).padStart(2, "0");
  const dong = String(item["umdNm"] ?? "").trim();
  const aptDong = String(item["aptDong"] ?? "").trim(); // 아파트 동 (건물 동호수 구분)
  const complex = String(item["aptNm"] ?? "").trim();
  const jibun = String(item["jibun"] ?? "").trim();
  const dealingGbn = String(item["dealingGbn"] ?? "").trim(); // 중개거래/직거래
  const cdealType = String(item["cdealType"] ?? "").trim(); // 취소 거래 여부

  // 취소된 거래 제외
  if (cdealType === "취소") return null;

  return {
    id: `${district}-${complex}-${aptDong}-${year}${month}${day}-${floor}-${area}`,
    district,
    dong,
    aptDong,
    complex,
    area,
    floor,
    price,
    builtYear,
    dealDate: `${year}-${month}-${day}`,
    dealingGbn,
    permitZone: getPermitZone(dong),
    address: `서울 ${district} ${dong}${jibun ? " " + jibun : ""}`,
    households: 0,
    permitDays: null,
    recentCount: 0,
    previousHigh: 0,
  };
}

function computePreviousHighs(items) {
  const latestMonth = items.reduce((max, t) => t.dealDate > max ? t.dealDate : max, "");
  const currentYm = latestMonth.slice(0, 7);
  const highs = {};
  for (const t of items) {
    if (t.dealDate.slice(0, 7) < currentYm) {
      const key = `${t.complex}|${t.area}`;
      highs[key] = Math.max(highs[key] ?? 0, t.price);
    }
  }
  return items.map((t) => {
    const key = `${t.complex}|${t.area}`;
    return { ...t, previousHigh: highs[key] || t.price };
  });
}

function computeRecentCounts(items) {
  const counts = {};
  for (const t of items) {
    counts[t.complex] = (counts[t.complex] ?? 0) + 1;
  }
  return items.map((t) => ({ ...t, recentCount: counts[t.complex] ?? 1 }));
}

async function batchFetch(tasks, batchSize = 10) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = await Promise.all(tasks.slice(i, i + batchSize).map((fn) => fn()));
    results.push(...batch.flat());
  }
  return results;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (!SERVICE_KEY) {
    return res.status(503).json({
      error: "MOLIT_API_KEY가 설정되지 않았습니다.",
      fallback: true,
    });
  }

  const yearMonths = [getYearMonth(0), getYearMonth(1), getYearMonth(2)];
  const tasks = Object.entries(DISTRICT_CODES).flatMap(([district, code]) =>
    yearMonths.map((ym) => async () => {
      try {
        const items = await fetchDistrict(code, ym);
        return items.map((item) => normalizeItem(item, district)).filter(Boolean);
      } catch {
        return [];
      }
    })
  );

  try {
    let raw = await batchFetch(tasks, 10);
    raw = computePreviousHighs(raw);
    raw = computeRecentCounts(raw);
    raw.sort((a, b) => b.dealDate.localeCompare(a.dealDate));

    res.json({
      data: raw,
      source: "molit",
      fetchedAt: new Date().toISOString(),
      count: raw.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
