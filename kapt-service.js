// ──────────────────────────────────────────────────────────────
// K-apt (공동주택관리정보시스템) 연동
//  - 후보 단지명을 K-apt 단지코드(kaptCode)로 매칭한 뒤
//    기본정보 + 상세정보를 받아 관리정보(profile)를 채운다.
//  - data.go.kr "공동주택 기본/상세 정보제공 서비스" 무료 활용신청 후
//    발급받은 인증키를 .env 의 KAPT_API_KEY 에 넣으면 자동 동작한다.
//  - 키가 없으면 아무 것도 하지 않고 기존 화면(관리정보 연동 필요)을 유지한다.
// ──────────────────────────────────────────────────────────────
import { XMLParser } from "fast-xml-parser";
import { DISTRICT_CODES } from "./candidate-service.js";

// .env 는 server.js 의 loadEnvFile() 이 import 이후에 채우므로, 키는 '호출 시점'에 읽는다
function kaptKey() {
  return process.env.KAPT_API_KEY;
}
// 단지목록과 기본/상세정보는 data.go.kr 상 서로 다른 서비스(base)다
//  - 단지목록(이름→코드): "공동주택 단지 목록제공 서비스" (AptListService3)  ※ 별도 활용신청 필요
//  - 기본/상세정보: "공동주택 기본/상세 정보제공 서비스" V4 (JSON 응답)
const LIST_BASE = "http://apis.data.go.kr/1613000/AptListService3";
const INFO_BASE = "http://apis.data.go.kr/1613000/AptBasisInfoServiceV4";
// 용적률/건폐율: 국토교통부 건축물대장(건축HUB) 총괄표제부
const BLD_BASE = "http://apis.data.go.kr/1613000/BldRgstHubService";
const xmlParser = new XMLParser({ ignoreAttributes: false });
const FETCH_HEADERS = {
  "User-Agent": "Seoul-Estate-AI/1.0",
  "Accept": "application/json, application/xml, text/xml, */*",
};

// 시군구코드 → 단지목록(코드·이름) / 단지코드 → 관리정보 캐시 (관리정보는 거의 안 바뀜)
const sigunguCache = new Map();
const profileCache = new Map();

export function isKaptEnabled() {
  return Boolean(kaptKey());
}

function normName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/아파트단지|아파트|맨션|단지/g, "")
    .replace(/[()\[\]{}·.\s_-]/g, "")
    .trim();
}

function arrify(items) {
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function num(value) {
  const n = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return isFinite(n) ? n : 0;
}

function pick(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

function fmtDate(value) {
  const t = String(value ?? "").replace(/\D/g, "");
  return t.length >= 8 ? `${t.slice(0, 4)}.${t.slice(4, 6)}.${t.slice(6, 8)}` : "";
}

function fmtPhone(value) {
  const d = String(value ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("02")) {
    const rest = d.slice(2);
    return rest.length <= 7 ? `02-${rest.slice(0, 3)}-${rest.slice(3)}` : `02-${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  const rest = d.slice(3);
  return rest.length <= 7 ? `${d.slice(0, 3)}-${rest.slice(0, 3)}-${rest.slice(3)}` : `${d.slice(0, 3)}-${rest.slice(0, 4)}-${rest.slice(4)}`;
}

const KAPT_WARNED = new Set();
async function getBody(base, operation, params) {
  const url = new URL(`${base}/${operation}`);
  url.searchParams.set("serviceKey", kaptKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), { headers: FETCH_HEADERS });
  const text = await res.text();
  if (!res.ok) {
    if (!KAPT_WARNED.has(operation)) {
      KAPT_WARNED.add(operation);
      console.warn(`[KAPT] ${operation} → HTTP ${res.status}: ${text.slice(0, 120)}`);
    }
    throw new Error(`KAPT ${res.status} ${operation}`);
  }
  // V4는 JSON, V3 목록은 XML(<result> 래퍼) 일 수 있어 둘 다 처리
  const t = text.trim();
  const parsed = (t.startsWith("{") || t.startsWith("[")) ? JSON.parse(text) : xmlParser.parse(text);
  const root = parsed?.response ?? parsed?.result?.response ?? parsed?.result;
  const header = root?.header;
  const code = String(header?.resultCode ?? header?.resultCd ?? "00");
  if (code !== "00" && code !== "0") {
    const msg = header?.resultMsg ?? header?.resultMessage ?? "K-apt API 오류";
    throw new Error(`${operation}: ${code} ${msg}`);
  }
  return root?.body ?? {};
}

function firstItem(body) {
  return arrify(body?.items?.item ?? body?.items ?? body?.item)[0] ?? body ?? {};
}

function field(obj, keys) {
  return pick(obj, [
    ...keys,
    ...keys.map((k) => k.toLowerCase()),
    ...keys.map((k) => k.toUpperCase()),
  ]);
}

function mergeProfiles(base = {}, incoming = {}) {
  const merged = { ...incoming, ...base };
  for (const [key, value] of Object.entries(incoming)) {
    if ((merged[key] == null || String(merged[key]).trim() === "") && value) {
      merged[key] = value;
    }
  }
  return merged;
}

const PROFILE_VALUE_KEYS = [
  "location",
  "approvalDateText",
  "householdsText",
  "buildingCountText",
  "floorText",
  "heating",
  "parkingText",
  "evChargersText",
  "ratioText",
  "managementOfficePhone",
  "builder",
];

function profileFilledCount(profile = {}) {
  return PROFILE_VALUE_KEYS.filter((key) => String(profile[key] ?? "").trim()).length;
}

function parseHouseholdCount(text) {
  return num(String(text ?? "").split("(")[0]);
}

// 시군구 전체 단지목록 (kaptCode, kaptName) — 한 번 받아 캐시
async function loadSigunguList(sigunguCode) {
  if (sigunguCache.has(sigunguCode)) return sigunguCache.get(sigunguCode);
  const all = [];
  const numOfRows = 1000;
  for (let pageNo = 1; pageNo <= 50; pageNo++) {
    const body = await getBody(LIST_BASE, "getSigunguAptList3", { sigunguCode, pageNo, numOfRows });
    // 응답이 body.items(배열) / body.items.item / body.item 등으로 올 수 있어 모두 처리
    const items = arrify(body?.items?.item ?? body?.items ?? body?.item);
    for (const it of items) {
      const kaptCode = field(it, ["kaptCode", "kapt_code", "kaptCd", "code"]);
      const kaptName = field(it, ["kaptName", "kapt_name", "aptName", "name"]);
      if (kaptCode) {
        const dong = field(it, ["as3", "bjdongNm", "dong", "umdNm"]);
        all.push({
          kaptCode: String(kaptCode),
          kaptName: String(kaptName ?? ""),
          norm: normName(kaptName),
          dong: String(dong ?? "").trim(),
          raw: it,
        });
      }
    }
    const total = Number(body?.totalCount ?? all.length);
    if (items.length === 0 || all.length >= total) break;
  }
  sigunguCache.set(sigunguCode, all);
  return all;
}

// 후보 단지명(+별칭) → kaptCode
async function resolveKaptCode(item) {
  const candidate = item.candidate;
  // candidate-apartments.js 에 kaptCode 를 직접 박아두면 단지목록 API 없이도 동작
  if (candidate.kaptCode) return candidate.kaptCode;
  const sigunguCode = DISTRICT_CODES[candidate.district];
  if (!sigunguCode) return null;
  const list = await loadSigunguList(sigunguCode);
  if (!list.length) return null;
  const names = [
    candidate.name,
    ...(candidate.aliases ?? []),
    ...(item.summary?.matchedComplexNames ?? []),
    ...((item.transactions ?? []).slice(0, 20).map((tx) => tx.complex)),
  ].map(normName).filter(Boolean);

  const scored = list
    .map((x) => {
      let score = 0;
      for (const n of names) {
        if (!n || !x.norm) continue;
        if (x.norm === n) score = Math.max(score, 100);
        else if (x.norm.includes(n) || n.includes(x.norm)) score = Math.max(score, Math.min(x.norm.length, n.length) + 30);
      }
      if (/임대/.test(x.kaptName)) score -= 12;
      return { ...x, score };
    })
    .filter((x) => x.score > 0);

  let matches = scored;
  if (!matches.length) return null;
  // 같은 법정동 매칭이 있으면 그 안에서만 (다른 동 오매칭 방지)
  if (candidate.dongs?.length) {
    const inDong = matches.filter((x) => candidate.dongs.includes(x.dong));
    if (inDong.length) matches = inDong;
  }
  // 우선순위: ① 정확히 일치 ② 임대 동 아님 ③ 이름이 더 짧은(=가까운) 것
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ar = /임대/.test(a.kaptName) ? 1 : 0, br = /임대/.test(b.kaptName) ? 1 : 0;
    if (ar !== br) return ar - br;
    return a.norm.length - b.norm.length;
  });
  return matches[0].kaptCode;
}

// 지번주소 → 본번/부번 (예: "...잠실동 22 잠실리센츠" → {bun:"0022", ji:"0000"})
function parseJibun(addr) {
  const m = String(addr ?? "").match(/[가-힣0-9]+(?:동|가|리)\s+(\d+)(?:-(\d+))?/);
  if (!m) return null;
  return { bun: String(m[1]).padStart(4, "0"), ji: String(m[2] || "0").padStart(4, "0") };
}

// 건축물대장 총괄표제부 → 용적률/건폐율 텍스트
async function fetchBuildingRatio(bjdCode, addr) {
  const code = String(bjdCode ?? "").replace(/\D/g, "");
  const jb = parseJibun(addr);
  if (code.length < 10 || !jb) return "";
  let body;
  try {
    body = await getBody(BLD_BASE, "getBrRecapTitleInfo", {
      sigunguCd: code.slice(0, 5), bjdongCd: code.slice(5, 10),
      platGbCd: 0, bun: jb.bun, ji: jb.ji, numOfRows: 10, pageNo: 1, _type: "json",
    });
  } catch { return ""; }
  const items = arrify(body?.items?.item ?? body?.item);
  const apt = items.find((it) => num(it.vlRat) > 0) ?? items[0];
  if (!apt) return "";
  const vl = num(apt.vlRat), bc = num(apt.bcRat);
  const parts = [];
  if (vl) parts.push(`용적률 ${Math.round(vl)}%`);
  if (bc) parts.push(`건폐율 ${Math.round(bc)}%`);
  return parts.join(" / ");
}

// kaptCode → 관리정보(profile)
async function fetchKaptProfile(kaptCode) {
  if (profileCache.has(kaptCode)) return profileCache.get(kaptCode);

  let basic = {}, detail = {};
  try { basic = (await getBody(INFO_BASE, "getAphusBassInfoV4", { kaptCode })); } catch { /* noop */ }
  try { detail = (await getBody(INFO_BASE, "getAphusDtlInfoV4", { kaptCode })); } catch { /* noop */ }
  const b = firstItem(basic);
  const d = firstItem(detail);

  const households = num(field(b, ["kaptdaCnt", "hoCnt", "hhldCnt", "householdCnt"]));
  const rentalHouseholds = num(field(b, ["rentalHouseholdCnt", "leaseHoCnt", "kaptdaRentCnt"]));
  const dongCnt = num(field(b, ["kaptDongCnt", "dongCnt", "bldgCnt"]));
  const minFloor = num(field(b, ["kaptLowestFloor", "kaptBottomFloor", "lowFloor"]));
  const topFloor = num(field(b, ["kaptTopFloor", "topFloor", "maxFloor"]));
  const pGround = num(field(d, ["kaptdPcnt", "parkingCnt", "groundParkingCnt"]));
  const pUnder = num(field(d, ["kaptdPcntu", "undergroundParkingCnt"]));
  const pTotal = num(field(d, ["parkingTotalCnt", "totalParkingCnt", "parkCnt"]));
  const evGround = num(field(d, ["groundElChargerCnt", "groundEvChargerCnt"]));
  const evUnder = num(field(d, ["undergroundElChargerCnt", "undergroundEvChargerCnt"]));
  const evTotal = num(field(d, ["elctyCarChargerCnt", "evChargerCnt", "evChargeCnt"]));
  const usedate = field(b, ["kaptUsedate", "useApproveYmd", "useAprDay", "useDate"]);
  const heat = field(b, ["codeHeatNm", "heatMthdNm", "heating"]);
  const builder = field(b, ["kaptBcompany", "kaptAcompany", "builder", "constructor"]);
  const addr = field(b, ["doroJuso", "roadAddr", "kaptAddr", "addr", "address"]);
  const jibunAddr = field(b, ["kaptAddr", "addr", "address"]);
  const tel = fmtPhone(field(b, ["kaptTel", "kaptTelNo", "managementTel"]) || field(d, ["kaptTel", "kaptTelNo", "managementTel"]));
  const bjdCode = field(b, ["bjdCode", "bjdongCd", "법정동코드"]);
  const ratioText = field(b, ["vlRat", "bcRat"])
    ? [
      num(field(b, ["vlRat"])) ? `용적률 ${Math.round(num(field(b, ["vlRat"])))}%` : "",
      num(field(b, ["bcRat"])) ? `건폐율 ${Math.round(num(field(b, ["bcRat"])))}%` : "",
    ].filter(Boolean).join(" / ")
    : await fetchBuildingRatio(bjdCode, jibunAddr);

  const profile = {
    officialName: field(b, ["kaptName", "aptName", "name"]),
    location: addr,
    approvalDateText: usedate ? fmtDate(usedate) : "",
    householdsText: households
      ? `${households.toLocaleString("ko-KR")}세대${rentalHouseholds ? ` (기타임대 ${rentalHouseholds.toLocaleString("ko-KR")}세대 포함)` : ""}`
      : "",
    buildingCountText: dongCnt ? `${dongCnt}개 동` : "",
    floorText: topFloor ? `${minFloor ? `${minFloor}층 / ` : ""}${topFloor}층` : "",
    heating: heat,
    parkingText: (pGround || pUnder || pTotal)
      ? `${(pTotal || pGround + pUnder).toLocaleString("ko-KR")}대${(pGround || pUnder) ? ` (지상 ${pGround.toLocaleString("ko-KR")} · 지하 ${pUnder.toLocaleString("ko-KR")})` : ""}`
      : "",
    evChargersText: (evGround || evUnder || evTotal)
      ? `${evTotal || evGround + evUnder}기${(evGround || evUnder) ? ` (지상 ${evGround} · 지하 ${evUnder})` : ""}`
      : "",
    ratioText, // 용적률/건폐율 — 건축물대장 총괄표제부
    managementOfficePhone: tel,
    builder,
    source: "국토교통부 실거래 + 공동주택 관리정보 + 건축물대장 기준",
  };
  profileCache.set(kaptCode, profile);
  return profile;
}

function pushLimited(list, value, limit = 30) {
  if (list.length < limit) list.push(value);
}

// 단일 단지 관리정보 조회 (추천 상세 등에서 단지명+구로 즉석 조회)
export async function fetchComplexProfile({ district, name, dong } = {}) {
  if (!kaptKey() || !district || !name) return null;
  const candidate = { district, name, dongs: dong ? [dong] : [], aliases: [] };
  try {
    const kaptCode = await resolveKaptCode({ candidate }); // resolveKaptCode 는 {candidate} 형태를 받음
    if (!kaptCode) { console.warn(`[complex-info] 코드 매칭 실패: ${district} ${name}`); return null; }
    return await fetchKaptProfile(kaptCode);
  } catch (e) { console.warn(`[complex-info] 오류: ${district} ${name} → ${e.message}`); return null; }
}

// 후보 목록(items: [{candidate, summary, transactions}])에 K-apt profile 보강
export async function enrichCandidatesWithKapt(items, options = {}) {
  const concurrency = typeof options === "number" ? options : (options.concurrency ?? 4);
  const report = typeof options === "object" ? options.report : null;
  if (!kaptKey() || !Array.isArray(items) || !items.length) return items;
  if (report) {
    report.enabled = true;
    report.attempted = items.length;
    report.codeMatched = 0;
    report.enriched = 0;
    report.partial = 0;
    report.missingCode = [];
    report.failed = [];
  }
  const queue = [...items];
  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      try {
        const kaptCode = await resolveKaptCode(item);
        if (kaptCode) {
          if (report) report.codeMatched += 1;
          const profile = await fetchKaptProfile(kaptCode);
          const mergedProfile = mergeProfiles(item.candidate.profile, profile);
          const filled = profileFilledCount(mergedProfile);
          if (report) {
            if (filled >= 6) report.enriched += 1;
            else if (filled > 0) {
              report.partial += 1;
              pushLimited(report.failed, `${item.candidate.name}: 일부 항목만 보강(${filled}/${PROFILE_VALUE_KEYS.length})`);
            }
          }
          item.candidate = {
            ...item.candidate,
            households: item.candidate.households || parseHouseholdCount(mergedProfile.householdsText) || null,
            profile: mergedProfile,
            kaptCode,
            kaptName: profile.officialName || item.candidate.kaptName || item.candidate.name,
          };
        } else if (report) {
          pushLimited(report.missingCode, item.candidate.name);
        }
      } catch (err) {
        if (report) pushLimited(report.failed, `${item.candidate.name}: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  if (report) report.status = `matched ${report.codeMatched}/${report.attempted}, enriched ${report.enriched}, partial ${report.partial}`;
  return items;
}
