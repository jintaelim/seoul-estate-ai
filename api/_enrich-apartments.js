import { runInBatches } from "../molit-fetch.js";

const SERVICE_KEY = process.env.DATA_GO_KR_API_KEY || process.env.APT_BASIC_API_KEY || process.env.BUILDING_HUB_API_KEY;
const LIST_BASE = "https://apis.data.go.kr/1613000/AptListService4";
const BASIC_BASE = "https://apis.data.go.kr/1613000/AptBasisInfoServiceV5";
const BUILDING_BASE = "https://apis.data.go.kr/1613000/BldRgstHubService";
const DEFAULT_BATCH_SIZE = 80;

export const normalizeComplexName = value => String(value || "")
  .toLowerCase()
  .replace(/\([^)]*\)/g, "")
  .replace(/아파트|단지/g, "")
  .replace(/[^0-9a-z가-힣]/g, "");

const complexKey = (district, dong, name) => `${district}|${dong}|${normalizeComplexName(name)}`;
const districtKey = (district, name) => `${district}|${normalizeComplexName(name)}`;
const number = value => {
  const parsed = Number(String(value ?? "").replaceAll(",", "").trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};
const date = value => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 8 ? `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}` : "";
};
const items = body => {
  const raw = body?.items ?? body?.item;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.item)) return raw.item;
  if (raw.item) return [raw.item];
  return [raw];
};

async function request(base, path, params, attempts = 2) {
  const url = new URL(`${base}/${path}`);
  url.search = new URLSearchParams({ serviceKey: SERVICE_KEY, ...params });
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { Accept: "application/json" } });
      const payload = await response.json().catch(() => null);
      const header = payload?.response?.header || payload?.OpenAPI_ServiceResponse?.cmmMsgHeader || {};
      const code = String(header.resultCode ?? header.returnReasonCode ?? "");
      if (!response.ok || (code && code !== "00")) {
        throw new Error(`${path} ${response.status} ${header.resultMsg || header.returnAuthMsg || header.errMsg || code}`.trim());
      }
      return payload?.response?.body || {};
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw lastError;
}

export function parseParcel(bjdCode, address) {
  const code = String(bjdCode || "").replace(/\D/g, "");
  const match = String(address || "").match(/[동가리]\s+(산\s*)?(\d+)(?:-(\d+))?/);
  if (code.length !== 10 || !match) return null;
  return {
    sigunguCd: code.slice(0, 5), bjdongCd: code.slice(5),
    platGbCd: match[1] ? "1" : "0",
    bun: match[2].padStart(4, "0"), ji: String(match[3] || "0").padStart(4, "0"),
  };
}

async function fetchSeoulComplexes() {
  const body = await request(LIST_BASE, "getSidoAptList4", { sidoCode: "11", numOfRows: "4000", pageNo: "1" });
  const rows = items(body);
  if (!rows.length) throw new Error("공동주택 단지목록이 비어 있습니다.");
  return rows;
}

async function fetchBasic(kaptCode) {
  const body = await request(BASIC_BASE, "getAphusBassInfoV5", { kaptCode });
  return items(body)[0] || body.item || null;
}

function chooseBuilding(rows, basic) {
  if (!rows.length) return null;
  const target = normalizeComplexName(basic.kaptName);
  return rows.find(row => {
    const name = normalizeComplexName(row.bldNm);
    return name && target && (name.includes(target) || target.includes(name));
  }) || rows.sort((a, b) => number(b.hhldCnt) - number(a.hhldCnt) || number(b.totArea) - number(a.totArea))[0];
}

async function fetchBuilding(basic) {
  const parcel = parseParcel(basic.bjdCode, basic.kaptAddr);
  if (!parcel) return null;
  const body = await request(BUILDING_BASE, "getBrRecapTitleInfo", { ...parcel, numOfRows: "100", pageNo: "1", _type: "json" });
  return chooseBuilding(items(body), basic);
}

function metadataFrom(basic, building) {
  return {
    kaptCode: String(basic.kaptCode || ""),
    households: number(basic.kaptdaCnt) || number(basic.hoCnt) || number(building?.hhldCnt),
    approvalDate: date(basic.kaptUsedate) || date(building?.useAprDay),
    buildingCount: number(basic.kaptDongCnt) || number(building?.mainBldCnt),
    floorAreaRatio: number(building?.vlRat),
    areaHouseholds: {
      under60: number(basic.kaptMparea60), under85: number(basic.kaptMparea85),
      under135: number(basic.kaptMparea135), over135: number(basic.kaptMparea136),
    },
    metadataSource: building ? "k-apt-v5+building-register" : "k-apt-v5",
  };
}

export async function enrichTransactionLedgerWithApartmentMetadata(ledger) {
  if (!SERVICE_KEY) throw new Error("DATA_GO_KR_API_KEY 설정이 필요합니다.");
  const startedAt = new Date().toISOString();
  const list = await fetchSeoulComplexes();
  const exact = new Map();
  const byDistrict = new Map();
  for (const item of list) {
    exact.set(complexKey(item.as2, item.as3, item.kaptName), item);
    const key = districtKey(item.as2, item.kaptName);
    const group = byDistrict.get(key) || [];
    group.push(item);
    byDistrict.set(key, group);
  }

  const units = new Map();
  for (const row of ledger.data) units.set(complexKey(row.district, row.dong, row.complex), row);
  const matches = new Map();
  for (const [key, row] of units) {
    let match = exact.get(key);
    if (!match) {
      const candidates = byDistrict.get(districtKey(row.district, row.complex)) || [];
      if (candidates.length === 1) match = candidates[0];
    }
    if (match) matches.set(key, match);
  }

  const metadata = new Map();
  const failures = [];
  const batchSize = Math.min(200, Math.max(1, Number(process.env.APARTMENT_METADATA_BATCH_SIZE) || DEFAULT_BATCH_SIZE));
  const pending = [...matches].filter(([key]) => !units.get(key)?.metadataSource);
  const selected = pending.slice(0, batchSize);
  const tasks = selected.map(([key, match]) => async () => {
    try {
      const basic = await fetchBasic(match.kaptCode);
      if (!basic) throw new Error("기본정보 없음");
      let building = null;
      try { building = await fetchBuilding(basic); }
      catch (error) { failures.push({ stage: "building", kaptCode: match.kaptCode, error: error.message }); }
      metadata.set(key, metadataFrom(basic, building));
    } catch (error) {
      failures.push({ stage: "k-apt", kaptCode: match.kaptCode, error: error.message });
    }
  });
  await runInBatches(tasks, 1, 400);
  if (selected.length && metadata.size < Math.max(1, Math.floor(selected.length * 0.5))) {
    const sample = failures.slice(0, 2).map(row => row.error).join(" / ");
    throw new Error(`공동주택 보강 실패가 과다합니다 (${metadata.size}/${selected.length}). 이전 원장을 유지합니다.${sample ? ` ${sample}` : ""}`);
  }

  const data = ledger.data.map(row => {
    const info = metadata.get(complexKey(row.district, row.dong, row.complex));
    if (!info) return row;
    return { ...row, ...info, builtYear: Number(info.approvalDate.slice(0, 4)) || row.builtYear };
  });
  return {
    ...ledger, data, count: data.length, fetchedAt: new Date().toISOString(),
    apartmentMetadata: {
      source: "k-apt-v5+building-register", startedAt, fetchedAt: new Date().toISOString(),
      listCount: list.length, transactionComplexes: units.size, matchedComplexes: matches.size,
      pendingComplexes: pending.length, batchSize: selected.length, enrichedComplexes: metadata.size,
      buildingFailures: failures.filter(row => row.stage === "building").length,
      basicFailures: failures.filter(row => row.stage === "k-apt").length,
      fields: ["households", "approvalDate", "buildingCount", "floorAreaRatio", "areaHouseholds"],
    },
  };
}
