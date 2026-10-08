import { XMLParser } from "fast-xml-parser";
import { fetchMolit, runInBatches } from "../molit-fetch.js";
import { DISTRICT_CODES, parsePrice } from "./_districts.js";
import { assertMolitResponse, yearMonth } from "../transaction-domain.js";
import { rentError } from "./_errors.js";

const SERVICE_KEY = process.env.MOLIT_RENT_API_KEY || process.env.MOLIT_API_KEY;
const xmlParser = new XMLParser({ ignoreAttributes: false });
const FETCH_HEADERS = { "User-Agent": "Seoul-Estate-AI/1.0", Accept: "application/xml, text/xml, */*" };

async function fetchPage(lawdCd, dealYmd, pageNo) {
  const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent");
  url.searchParams.set("serviceKey", SERVICE_KEY);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("LAWD_CD", lawdCd);
  url.searchParams.set("DEAL_YMD", dealYmd);
  const response = await fetchMolit(url.toString(), { headers: FETCH_HEADERS });
  const parsed = xmlParser.parse(await response.text());
  if (!response.ok || parsed?.OpenAPI_ServiceResponse) throw new Error(rentError(response.status, parsed));
  const body = assertMolitResponse(parsed);
  const items = body?.items?.item;
  const list = !items ? [] : Array.isArray(items) ? items : [items];
  return { list, totalCount: Number(body?.totalCount ?? list.length) };
}

async function fetchDistrict(lawdCd, dealYmd) {
  const first = await fetchPage(lawdCd, dealYmd, 1);
  const rows = [...first.list];
  const pages = Math.ceil(first.totalCount / 1000);
  if (pages > 1) {
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, index) => fetchPage(lawdCd, dealYmd, index + 2)));
    for (const page of rest) rows.push(...page.list);
  }
  return rows;
}

function normalize(row, district) {
  const cancelDate = String(row.cdealDay ?? row.cancelDealDay ?? "").trim();
  const cancelType = String(row.cdealType ?? "").trim();
  if (cancelDate || ["취소", "O", "Y"].includes(cancelType)) return null;
  const year = String(row.dealYear ?? "");
  const month = String(row.dealMonth ?? "").padStart(2, "0");
  const day = String(row.dealDay ?? "").padStart(2, "0");
  const dong = String(row.umdNm ?? "").trim();
  const complex = String(row.aptNm ?? "").trim();
  const area = Number(row.excluUseAr) || 0;
  const floor = Number(row.floor) || 0;
  const deposit = parsePrice(row.deposit);
  const monthlyRent = parsePrice(row.monthlyRent);
  const dealDate = `${year}-${month}-${day}`;
  return {
    id: `rent-${district}-${dong}-${complex}-${dealDate}-${area}-${floor}-${deposit}-${monthlyRent}`,
    district, dong, complex, area, floor, deposit, monthlyRent, dealDate,
    builtYear: Number(row.buildYear) || 0,
    jibun: String(row.jibun ?? "").trim(),
    contractType: String(row.contractType ?? "").trim(),
    contractTerm: String(row.contractTerm ?? "").trim(),
    renewalRight: String(row.useRRRight ?? "").trim(),
    previousDeposit: parsePrice(row.preDeposit),
    previousMonthlyRent: parsePrice(row.preMonthlyRent),
    rentType: monthlyRent > 0 ? "월세" : "전세",
  };
}

export async function collectRents() {
  if (!SERVICE_KEY) throw new Error("MOLIT_RENT_API_KEY 또는 MOLIT_API_KEY가 설정되지 않았습니다.");
  const startedAt = new Date().toISOString();
  const months = Array.from({ length: 3 }, (_, index) => yearMonth(index));
  const failures = [];
  const tasks = Object.entries(DISTRICT_CODES).flatMap(([district, code]) => months.map(ym => async () => {
    try {
      const occurrences = new Map();
      return (await fetchDistrict(code, ym)).map(raw => {
        const row = normalize(raw, district);
        if (!row) return null;
        const ordinal = occurrences.get(row.id) || 0;
        occurrences.set(row.id, ordinal + 1);
        return { ...row, id: `${row.id}-${ordinal}` };
      }).filter(Boolean);
    } catch (error) {
      failures.push({ district, month: ym, error: error.message });
      return [];
    }
  }));
  const data = (await runInBatches(tasks, 3, 180)).flat().sort((a, b) => b.dealDate.localeCompare(a.dealDate));
  if (failures.length) throw new Error(`${failures.length}개 지역·월 전월세 수집 실패. 이전 원장을 유지합니다.`);
  return {
    data, count: data.length, source: "molit-rent", startedAt, fetchedAt: new Date().toISOString(),
    latestDealDate: data[0]?.dealDate ?? null, dateBasis: "contract", registrationDateAvailable: false,
    coverage: { months, requested: tasks.length, succeeded: tasks.length, complete: true },
    recordBasis: "국토교통부 아파트 전월세 신고자료 · 계약일 기준 · 해제 거래 제외",
  };
}
