import { XMLParser } from "fast-xml-parser";
import { fetchMolit, runInBatches } from "../molit-fetch.js";
import { yearMonth, assertMolitResponse, enrichTransactions } from "../transaction-domain.js";

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


const xmlParser = new XMLParser({ ignoreAttributes: false });

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

  const res = await fetchMolit(url.toString(), { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`API ${res.status} for ${lawdCd} ${dealYmd}`);
  const xml = await res.text();
  const parsed = xmlParser.parse(xml);
  const body = assertMolitResponse(parsed);
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
  const floor = Number(item["floor"]) || 0;
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
  if (["취소", "O", "Y"].includes(cdealType) || String(item.cdealDay ?? "").trim()) return null;
  if (!price || !area || !complex) return null;

  return {
    id: `${district}-${dong}-${complex}-${aptDong}-${year}${month}${day}-${floor}-${area}-${price}`,
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
    permitZone: null,
    address: `서울 ${district} ${dong}${jibun ? " " + jibun : ""}`,
    households: 0,
    permitDays: null,
    recentCount: 0,
    previousHigh: 0,
  };
}

export async function collectTransactions({ months = 3 } = {}) {
  if (!SERVICE_KEY) throw new Error("MOLIT_API_KEY가 설정되지 않았습니다.");
  const startedAt = new Date().toISOString();
  const monthCount = Math.min(60, Math.max(1, Number(months) || 3));
  const yearMonths = Array.from({ length: monthCount }, (_, index) => yearMonth(index));
  const failures = [];
  const tasks = Object.entries(DISTRICT_CODES).flatMap(([district, code]) =>
    yearMonths.map((ym) => async () => {
      try {
        const items = await fetchDistrict(code, ym);
        const occurrences = new Map();
        return items.map((item) => {
          const row = normalizeItem(item, district);
          if (!row) return null;
          const ordinal = occurrences.get(row.id) || 0;
          occurrences.set(row.id, ordinal + 1);
          return { ...row, id: `${row.id}-${ordinal}` };
        }).filter(Boolean);
      } catch (error) {
        failures.push({ district, month: ym, error: error.message });
        return [];
      }
    })
  );


  const raw = (await runInBatches(tasks, 3, 300)).flat();
  if (failures.length) throw new Error(`${failures.length}개 지역·월 수집 실패. 이전 원장을 유지합니다.`);
  const data = enrichTransactions(raw);
  return { data, count: data.length, source: "molit", startedAt,
    fetchedAt: new Date().toISOString(), latestDealDate: data[0]?.dealDate ?? null,
    dateBasis: "contract", registrationDateAvailable: false,
    coverage: { months: yearMonths, requested: tasks.length, succeeded: tasks.length, complete: true },
    recordBasis: "수집 기간 내 동일 지역·단지·전용면적의 이전 계약일 최고가",
    capabilities: { listings: false, permits: false } };
}
