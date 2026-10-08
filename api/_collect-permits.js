import { runInBatches } from "../molit-fetch.js";
import { DISTRICT_CODES } from "./_districts.js";

const SOURCE_URL = "https://land.seoul.go.kr/land/wsklis/getContractList.do";

const dateKey = (date) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
}).format(date);
const compact = value => String(value || "").replaceAll("-", "");
const displayDate = value => {
  const text = compact(value);
  return text.length === 8 ? `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}` : "";
};
const parcelKey = value => String(value || "").replace(/^서울(?:특별시)?\s+/, "").trim().replace(/\s+/g, " ");

export function enrichPermitsWithTransactions(payload, sales) {
  const byParcel = new Map();
  for (const row of sales?.data || []) {
    const key = parcelKey(row.address);
    if (!key || !row.complex) continue;
    const matches = byParcel.get(key) || new Map();
    const current = matches.get(row.complex);
    if (!current || row.dealDate > current.dealDate) matches.set(row.complex, row);
    byParcel.set(key, matches);
  }
  const data = payload.data.map(row => ({
    ...row,
    matches: [...(byParcel.get(parcelKey(row.address))?.values() || [])]
      .sort((a, b) => a.complex.localeCompare(b.complex, "ko")),
  }));
  return { ...payload, data, count: data.length, complexMatchBasis: sales?.fetchedAt || null };
}

async function fetchDistrict(district, districtCode, beginDate, endDate) {
  const body = new URLSearchParams({ sggCd: districtCode, beginDate: compact(beginDate), endDate: compact(endDate) });
  const response = await fetch(SOURCE_URL, {
    method: "POST",
    signal: AbortSignal.timeout(15000),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": "Seoul-Estate-AI/1.0",
      Accept: "application/json",
      Referer: "https://land.seoul.go.kr/land/other/contractStatus.do",
    },
    body,
  });
  if (!response.ok) throw new Error(`서울시 허가 원장 ${district} HTTP ${response.status}`);
  const payload = await response.json();
  if (!Array.isArray(payload.result)) throw new Error(`서울시 허가 원장 ${district} 응답 형식 오류`);
  if (payload.result[0]?.MESSAGE === "EXCEPTION") throw new Error(`서울시 허가 원장 ${district} 연계 점검 중`);
  return payload.result.map((row) => ({
    id: `permit-${districtCode}-${row.ACC_YEAR}-${row.ACC_NO}-${row.OBJ_SEQNO}`,
    district,
    dong: String(row.ADDRESS || "").trim().split(/\s+/)[1] || "",
    address: String(row.ADDRESS || "").trim(),
    landCategory: String(row.JIMOK || "").trim(),
    permitDate: displayDate(row.HNDL_YMD),
    purpose: String(row.USE_PURP || "").trim(),
    status: String(row.JOB_GBN_NM || "").trim(),
    obligationEndDate: displayDate(row.DEAL_END_YMD),
    source: "seoul-land-kgeo",
  })).filter(row => row.permitDate && row.address);
}

export async function collectPermits() {
  const startedAt = new Date().toISOString();
  const end = new Date();
  const begin = new Date(end);
  begin.setDate(begin.getDate() - 61);
  const beginDate = dateKey(begin);
  const endDate = dateKey(end);
  const failures = [];
  const tasks = Object.entries(DISTRICT_CODES).map(([district, code]) => async () => {
    try { return await fetchDistrict(district, code, beginDate, endDate); }
    catch (error) { failures.push({ district, error: error.message }); return []; }
  });


  const data = (await runInBatches(tasks, 4, 150)).flat()
    .sort((a, b) => b.permitDate.localeCompare(a.permitDate) || a.district.localeCompare(b.district));
  if (failures.length) throw new Error(`${failures.length}개 자치구 허가 원장 수집 실패. 이전 원장을 유지합니다.`);
  return { data, count: data.length, source: "seoul-land-kgeo", startedAt,
    fetchedAt: new Date().toISOString(), dateBasis: "permit",
    coverage: { beginDate, endDate, districts: 25, complete: true },
    retentionNotice: "서울시 K-Geo 연계 최근 62일 공개 원장" };
}
