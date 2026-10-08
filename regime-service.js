// ════════════════════════════════════════════════════════════════
// 정권별 아파트 상승률 비교 — 공용 서비스 모듈
//
// 원칙: 이 파일은 어떤 값도 지어내지 않는다. API 호출이 실패하거나
// 데이터가 없으면 null 과 상태 플래그("데이터 없음"/"수집 실패"/"산출 불가")를
// 반환한다. 절대 임의 보간·추정으로 빈 값을 채우지 않는다.
// ════════════════════════════════════════════════════════════════
import { XMLParser } from "fast-xml-parser";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// .env 를 상위 디렉터리까지 훑어 로드 (server.js 와 동일한 방식) — CLI 스크립트에서 단독 실행 가능하게
export function loadDotEnv(startDir = __dirname) {
  let current = startDir;
  for (let depth = 0; depth < 8; depth += 1) {
    try {
      const env = readFileSync(join(current, ".env"), "utf8");
      for (const line of env.split("\n")) {
        const [key, ...rest] = line.split("=");
        if (key && rest.length && process.env[key.trim()] === undefined) {
          process.env[key.trim()] = rest.join("=").trim();
        }
      }
      return current;
    } catch {}
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(__dirname, "data");
export const CACHE_DIR = join(DATA_DIR, "cache");
export const INDEX_PATH = join(DATA_DIR, "regime-index.json");
export const LAWD_CODES_PATH = join(DATA_DIR, "lawd_codes.json");

const xmlParser = new XMLParser({ ignoreAttributes: false });
const FETCH_HEADERS = {
  "User-Agent": "Seoul-Estate-AI-Regime/1.0",
  "Accept": "application/xml, text/xml, */*",
};

/* ── 정권 구간 정의 (기본: 연도 단위, 취임일 정밀 모드도 지원) ── */
export const REGIME_WINDOWS = [
  { id: "moon", label: "문재인 정부", startYear: 2017, endYear: 2022, startDate: "2017-05-10", endDate: "2022-05-09" },
  { id: "yoon", label: "윤석열 정부", startYear: 2022, endYear: 2025, startDate: "2022-05-10", endDate: "2025-06-03" },
  { id: "lee", label: "이재명 정부", startYear: 2025, endYear: null, startDate: "2025-06-04", endDate: null },
];
export const COLLECTION_START_YM = "201601"; // 수집 시작(2016.01)

/* ══════════════════ 지역 코드 ══════════════════ */
export function loadLawdCodes() {
  const raw = JSON.parse(readFileSync(LAWD_CODES_PATH, "utf8"));
  const flat = {}; // 구 이름 -> 코드
  const byCode = {}; // 코드 -> { city, district }
  for (const [city, districts] of Object.entries(raw)) {
    if (city.startsWith("_")) continue;
    for (const [district, code] of Object.entries(districts)) {
      flat[district] = code;
      byCode[code] = { city, district };
    }
  }
  return { raw, flat, byCode };
}

/* ══════════════════ 월 범위 유틸 ══════════════════ */
export function currentYm() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}
export function currentYear() {
  return new Date().getFullYear();
}
// from(포함) ~ to(포함) 사이의 YYYYMM 목록
export function ymRange(from = COLLECTION_START_YM, to = currentYm()) {
  const out = [];
  let y = Number(from.slice(0, 4)), m = Number(from.slice(4, 6));
  const endY = Number(to.slice(0, 4)), endM = Number(to.slice(4, 6));
  while (y < endY || (y === endY && m <= endM)) {
    out.push(`${y}${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return out;
}

/* ══════════════════ 캐시 read/write ══════════════════ */
function cacheDir(lawdCd) { return join(CACHE_DIR, lawdCd); }
function cachePath(lawdCd, ym) { return join(cacheDir(lawdCd), `${ym}.json`); }

export function readCache(lawdCd, ym) {
  const p = cachePath(lawdCd, ym);
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; }
}

export function writeCache(lawdCd, ym, payload) {
  mkdirSync(cacheDir(lawdCd), { recursive: true });
  writeFileSync(cachePath(lawdCd, ym), JSON.stringify(payload, null, 0), "utf8");
}

// 특정 지역에 실제로 캐시된 YYYYMM 목록 (수집 커버리지 파악용)
export function collectedMonths(lawdCd) {
  const dir = cacheDir(lawdCd);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{6}\.json$/.test(f))
    .map((f) => f.replace(".json", ""))
    .sort();
}

/* ══════════════════ MOLIT API 호출 (재시도 + rate limit) ══════════════════ */
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchPageOnce(serviceKey, lawdCd, ym, pageNo) {
  const url = new URL("http://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade");
  url.searchParams.set("serviceKey", serviceKey);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("LAWD_CD", lawdCd);
  url.searchParams.set("DEAL_YMD", ym);

  const res = await fetch(url.toString(), { headers: FETCH_HEADERS });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const parsed = xmlParser.parse(text);
  // data.go.kr 공통 에러 응답 포맷 감지 (OpenAPI_ServiceResponse)
  const errHeader = parsed?.OpenAPI_ServiceResponse?.cmmMsgHeader;
  if (errHeader) {
    const code = errHeader.returnReasonCode;
    const msg = errHeader.errMsg || errHeader.returnAuthMsg || "알 수 없는 오류";
    const fatal = ["30", "31", "32", "20", "22"].includes(String(code)); // 인증키 오류류는 재시도 무의미
    const err = new Error(`data.go.kr 오류(${code}): ${msg}`);
    err.fatal = fatal;
    throw err;
  }
  const body = parsed?.response?.body;
  const header = parsed?.response?.header;
  if (header && header.resultCode && header.resultCode !== "00") {
    const err = new Error(`API 오류(${header.resultCode}): ${header.resultMsg}`);
    err.fatal = header.resultCode === "03"; // 데이터 없음은 fatal 아님(빈 목록으로 처리)
    if (header.resultCode === "03") return { list: [], totalCount: 0 };
    throw err;
  }
  const items = body?.items?.item;
  const totalCount = Number(body?.totalCount ?? 0);
  const list = !items ? [] : Array.isArray(items) ? items : [items];
  return { list, totalCount };
}

async function fetchPageWithRetry(serviceKey, lawdCd, ym, pageNo, { retries = 3, baseDelayMs = 700 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchPageOnce(serviceKey, lawdCd, ym, pageNo);
    } catch (err) {
      lastErr = err;
      if (err.fatal) throw err; // 인증키 오류 등은 재시도해도 소용없음
      if (attempt < retries) await sleep(baseDelayMs * Math.pow(2, attempt));
    }
  }
  throw lastErr;
}

// 한 지역×월 전체 수집 (페이지네이션 포함). 실패 시 throw (캐시 안 함 — 값 조작 금지)
export async function fetchMonth(serviceKey, lawdCd, ym) {
  const first = await fetchPageWithRetry(serviceKey, lawdCd, ym, 1);
  const all = [...first.list];
  const totalPages = Math.ceil(first.totalCount / 1000);
  for (let p = 2; p <= totalPages; p++) {
    const { list } = await fetchPageWithRetry(serviceKey, lawdCd, ym, p);
    all.push(...list);
  }
  return all.map(normalizeRawItem).filter(Boolean);
}

/* ══════════════════ 지역×월 일괄 수집 (CLI·서버 자동 갱신 공용) ══════════════════ */
async function pMapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// districts 지정 없으면 lawd_codes.json 의 전체 지역. force=false 면 이미 캐시된 지역·월은 건너뜀(재시도 안전).
export async function collectRegimeTransactions({
  serviceKey, districts, from = COLLECTION_START_YM, to = currentYm(),
  force = false, concurrency = 3, delayMs = 300, onProgress,
} = {}) {
  const { flat } = loadLawdCodes();
  const targetDistricts = districts?.length ? districts : Object.keys(flat);
  const months = ymRange(from, to);
  const jobs = targetDistricts.flatMap((district) => months.map((ym) => ({ district, lawdCd: flat[district], ym })));

  let ok = 0, skipped = 0, failed = 0;
  const failures = [];
  let done = 0;

  await pMapLimit(jobs, concurrency, async ({ district, lawdCd, ym }) => {
    done += 1;
    if (!force && readCache(lawdCd, ym)) {
      skipped += 1;
      onProgress?.({ done, total: jobs.length, district, ym, status: "skipped" });
      return;
    }
    try {
      const items = await fetchMonth(serviceKey, lawdCd, ym);
      writeCache(lawdCd, ym, { lawdCd, district, ym, fetchedAt: new Date().toISOString(), count: items.length, items });
      ok += 1;
      onProgress?.({ done, total: jobs.length, district, ym, status: "ok", count: items.length });
    } catch (err) {
      failed += 1;
      failures.push({ district, ym, error: err.message });
      onProgress?.({ done, total: jobs.length, district, ym, status: "failed", error: err.message });
    }
    await sleep(delayMs);
  });

  return { ok, skipped, failed, failures, total: jobs.length };
}

/* ══════════════════ 정규화 ══════════════════ */
function parsePrice(raw) {
  return Number(String(raw ?? "0").replace(/,/g, "").trim());
}

function normalizeRawItem(item) {
  const cdealType = String(item["cdealType"] ?? "").trim();
  if (cdealType === "취소") return null; // 취소 거래 제외 — 실제 유효 거래만 보관

  const price = parsePrice(item["dealAmount"]);
  const area = Number(item["excluUseAr"]) || 0;
  const floor = Number(item["floor"]) || 0;
  const buildYear = Number(item["buildYear"]) || 0;
  const year = String(item["dealYear"] ?? "");
  const month = String(item["dealMonth"] ?? "").padStart(2, "0");
  const day = String(item["dealDay"] ?? "").padStart(2, "0");
  const dong = String(item["umdNm"] ?? "").trim();
  const jibun = String(item["jibun"] ?? "").trim();
  const complex = String(item["aptNm"] ?? "").trim();
  const dealingGbn = String(item["dealingGbn"] ?? "").trim();

  if (!price || !area || !complex || !year) return null;

  return { complex, dong, jibun, area, floor, price, buildYear, dealDate: `${year}-${month}-${day}`, dealingGbn };
}

/* ══════════════════ 단지 그룹핑 (이름+지번+법정동, 표기 차이 흡수) ══════════════════ */
export function normalizeComplexName(value) {
  return String(value ?? "")
    .replace(/\([^)]*\)/g, "")           // 괄호 부기 제거 (예: "래미안(2단지)")
    .replace(/[·.\-_\s]/g, "")            // 공백/구두점 제거
    .trim();
}

export function complexGroupKey(district, item) {
  return `${district}|${normalizeComplexName(item.complex)}|${item.dong}|${item.jibun}`;
}

/* ══════════════════ 평형 버킷 (전용면적 5㎡ 단위) ══════════════════ */
const AREA_BINS = [40, 50, 60, 70, 80, 90, 100, 110, 130, 150];
export function areaBucket(area) {
  for (let i = 0; i < AREA_BINS.length; i++) {
    if (area < AREA_BINS[i]) {
      const lo = i === 0 ? 0 : AREA_BINS[i - 1];
      return { key: `${lo}-${AREA_BINS[i]}`, label: `${lo}~${AREA_BINS[i]}㎡`, min: lo, max: AREA_BINS[i] };
    }
  }
  const lo = AREA_BINS[AREA_BINS.length - 1];
  return { key: `${lo}+`, label: `${lo}㎡ 이상`, min: lo, max: Infinity };
}

/* ══════════════════ 연도별 집계 ══════════════════ */
// transactions: 특정 단지+평형버킷에 속하는 거래 배열
// coverageYears: 그 지역에서 "연도 전체(또는 현재까지) 수집이 완료된" 연도 Set
export function yearlyAverages(transactions, coverageYears) {
  const byYear = {};
  for (const t of transactions) {
    const y = Number(t.dealDate.slice(0, 4));
    (byYear[y] = byYear[y] || []).push(t.price);
  }
  const years = {};
  const allYears = new Set([...Object.keys(byYear).map(Number), ...coverageYears]);
  for (const y of allYears) {
    const collected = coverageYears.has(y);
    const prices = byYear[y];
    if (!collected && !prices) { years[y] = { year: y, avg: null, count: 0, status: "미수집" }; continue; }
    if (!prices || !prices.length) { years[y] = { year: y, avg: null, count: 0, status: collected ? "거래없음" : "미수집" }; continue; }
    const avg = Math.round(prices.reduce((s, v) => s + v, 0) / prices.length);
    years[y] = { year: y, avg, count: prices.length, status: prices.length < 3 ? "표본부족" : "정상" };
  }
  return years;
}

/* ══════════════════ 정권 구간 계산 ══════════════════ */
export function regimeGrowth(yearly, window) {
  const endYear = window.endYear ?? currentYear();
  const start = yearly[window.startYear];
  const end = yearly[endYear];
  if (!start || start.avg == null || !end || end.avg == null) {
    return { window: window.id, label: window.label, startYear: window.startYear, endYear, startAvg: start?.avg ?? null, endAvg: end?.avg ?? null, pct: null, status: "산출 불가" };
  }
  const pct = Math.round(((end.avg - start.avg) / start.avg) * 1000) / 10;
  return { window: window.id, label: window.label, startYear: window.startYear, endYear, startAvg: start.avg, endAvg: end.avg, pct, status: "정상" };
}

export function allRegimeGrowth(yearly) {
  return REGIME_WINDOWS.map((w) => regimeGrowth(yearly, w));
}

// 기준 단지 대비 상대성 지수 (기준=100)
export function relativeIndex(unitPct, basePct) {
  if (unitPct == null || basePct == null || basePct === 0) return null;
  return Math.round((unitPct / basePct) * 1000) / 10;
}

// 국면별 분석: 문정부 고점 → 윤정부 저점 → 현재
export function phaseAnalysis(yearly) {
  const moon = REGIME_WINDOWS[0], yoon = REGIME_WINDOWS[1];
  const inRange = (y, w) => y >= w.startYear && y <= (w.endYear ?? currentYear());
  const withData = Object.values(yearly).filter((y) => y.avg != null);

  const peakCandidates = withData.filter((y) => inRange(y.year, moon));
  const peak = peakCandidates.length ? peakCandidates.reduce((a, b) => (b.avg > a.avg ? b : a)) : null;

  const troughCandidates = withData.filter((y) => inRange(y.year, yoon));
  const trough = troughCandidates.length ? troughCandidates.reduce((a, b) => (b.avg < a.avg ? b : a)) : null;

  const current = withData.length ? withData.reduce((a, b) => (b.year > a.year ? b : a)) : null;

  const pct = (a, b) => (a && b && a.avg != null && b.avg != null) ? Math.round(((b.avg - a.avg) / a.avg) * 1000) / 10 : null;

  return {
    peak: peak ? { year: peak.year, avg: peak.avg } : null,
    trough: trough ? { year: trough.year, avg: trough.avg } : null,
    current: current ? { year: current.year, avg: current.avg } : null,
    peakToTroughPct: pct(peak, trough),
    troughToCurrentPct: pct(trough, current),
    peakToCurrentPct: pct(peak, current),
  };
}

/* ══════════════════ 인덱스 생성 (data/cache/ 집계 → regime-index.json) ══════════════════ */
function coverageYearsFor(lawdCd) {
  const months = new Set(collectedMonths(lawdCd));
  const years = new Set();
  const nowY = currentYear();
  const nowM = new Date().getMonth() + 1;
  const candidateYears = new Set([...months].map((ym) => Number(ym.slice(0, 4))));
  for (const y of candidateYears) {
    const expected = y === nowY ? nowM : 12;
    let complete = true;
    for (let m = 1; m <= expected; m++) {
      if (!months.has(`${y}${String(m).padStart(2, "0")}`)) { complete = false; break; }
    }
    if (complete) years.add(y);
  }
  return years;
}

// data/cache/ 를 집계해 인덱스 객체를 만든다 (파일에 쓰지는 않음 — writeRegimeIndex 로 별도 저장)
export function buildRegimeIndex() {
  const { flat } = loadLawdCodes();
  if (!existsSync(CACHE_DIR)) {
    return { generatedAt: new Date().toISOString(), coverage: {}, complexCount: 0, complexes: [] };
  }

  const coverage = {};
  const groups = new Map();

  for (const [district, lawdCd] of Object.entries(flat)) {
    const months = collectedMonths(lawdCd);
    if (!months.length) continue;
    const years = coverageYearsFor(lawdCd);
    coverage[district] = { lawdCd, collectedMonths: months, collectedYears: [...years].sort((a, b) => a - b) };

    for (const ym of months) {
      const cached = readCache(lawdCd, ym);
      if (!cached?.items?.length) continue;
      for (const item of cached.items) {
        const key = complexGroupKey(district, item);
        if (!groups.has(key)) {
          groups.set(key, { district, dong: item.dong, jibun: item.jibun, nameCounts: new Map(), buildYearCounts: new Map(), byArea: new Map() });
        }
        const g = groups.get(key);
        g.nameCounts.set(item.complex, (g.nameCounts.get(item.complex) ?? 0) + 1);
        if (item.buildYear) g.buildYearCounts.set(item.buildYear, (g.buildYearCounts.get(item.buildYear) ?? 0) + 1);
        const bucket = areaBucket(item.area);
        if (!g.byArea.has(bucket.key)) g.byArea.set(bucket.key, { bucket, tx: [] });
        g.byArea.get(bucket.key).tx.push(item);
      }
    }
  }

  const mostFrequent = (map) => [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const complexes = [];
  for (const [key, g] of groups.entries()) {
    const coverageYears = new Set(coverage[g.district]?.collectedYears ?? []);
    const name = mostFrequent(g.nameCounts);
    const buildYear = mostFrequent(g.buildYearCounts);
    const areaBuckets = [...g.byArea.values()]
      .sort((a, b) => a.bucket.min - b.bucket.min)
      .map(({ bucket, tx }) => {
        const yearly = yearlyAverages(tx, coverageYears);
        const sorted = [...tx].sort((a, b) => (a.dealDate < b.dealDate ? 1 : -1));
        const latest = sorted[0];
        return {
          key: bucket.key, label: bucket.label,
          txCount: tx.length,
          latestPrice: latest?.price ?? null,
          latestDealDate: latest?.dealDate ?? null,
          yearly: Object.fromEntries(Object.entries(yearly).map(([y, v]) => [y, v])),
          regimeGrowth: allRegimeGrowth(yearly),
          phase: phaseAnalysis(yearly),
        };
      });

    complexes.push({
      id: encodeURIComponent(key),
      name, district: g.district, dong: g.dong, jibun: g.jibun, buildYear,
      areaBuckets,
    });
  }

  complexes.sort((a, b) => a.district.localeCompare(b.district) || a.name.localeCompare(b.name, "ko"));

  return { generatedAt: new Date().toISOString(), coverage, complexCount: complexes.length, complexes };
}

export function writeRegimeIndex(index) {
  writeFileSync(INDEX_PATH, JSON.stringify(index));
}

// 생성된 인덱스가 배포해도 되는 상태인지 점검 (단지 0개·지역 통째 누락·수집 정지 감지).
// 개별 지역·월의 일시적 실패는 정상 상황으로 보고 통과시킨다(다음 실행에서 재시도됨).
export function checkRegimeIndex(index) {
  const problems = [];
  if (!index?.complexCount || !index?.complexes?.length) {
    problems.push("단지가 0개입니다 — 수집이 통째로 실패했을 가능성이 높습니다.");
  }

  const { flat } = loadLawdCodes();
  const expected = Object.keys(flat);
  const covered = Object.keys(index?.coverage ?? {});
  const missing = expected.filter((d) => !covered.includes(d));
  if (missing.length) problems.push(`수집 기록이 아예 없는 지역: ${missing.join(", ")}`);

  const latestDates = (index?.complexes ?? [])
    .flatMap((c) => c.areaBuckets ?? [])
    .map((b) => b.latestDealDate)
    .filter(Boolean)
    .sort();
  const newest = latestDates[latestDates.length - 1] ?? null;
  if (newest) {
    const ageDays = Math.floor((Date.now() - new Date(`${newest}T00:00:00+09:00`).getTime()) / 86400000);
    if (ageDays > 45) problems.push(`가장 최근 거래일이 ${newest} 로 ${ageDays}일 전입니다 — 수집이 멈춰 있는지 확인하세요.`);
  }

  return { ok: problems.length === 0, problems, complexCount: index?.complexCount ?? 0, districtCount: covered.length, newest };
}

/* ══════════════════ 인덱스 파일 read/search ══════════════════ */
export function readIndex() {
  if (!existsSync(INDEX_PATH)) return null;
  try { return JSON.parse(readFileSync(INDEX_PATH, "utf8")); } catch { return null; }
}

export function searchIndex(index, { district, dong, query } = {}) {
  if (!index?.complexes?.length) return [];
  const q = normalizeComplexName(query ?? "");
  return index.complexes.filter((c) => {
    if (district && c.district !== district) return false;
    // 동 이름도 국토부 원본이 "금호동1가"처럼 세분화된 경우가 많아 정확히 일치하지
    // 않을 수 있다("금호동" 힌트로도 찾히도록 부분일치로 완화).
    if (dong && !(c.dong.includes(dong) || dong.includes(c.dong))) return false;
    const name = normalizeComplexName(c.name);
    // 국토부 원본에 단지명이 없거나 괄호뿐인 레코드(정규화 시 빈 문자열)는 검색/목록
    // 어디서도 노출하지 않는다 — 집계에는 그대로 반영되지만(실거래는 실거래이므로),
    // 사람이 식별할 수 없는 이름은 "선택 가능한 단지"로 보여주지 않는다.
    if (!name) return false;
    if (!q) return true;
    // 양방향 부분일치: 국토부 등록명이 "한양"처럼 짧고, 사용자는 "상계한양"처럼
    // 동 이름을 붙여 구어체로 검색하는 경우가 흔하다(그 반대도 있음).
    return name.includes(q) || q.includes(name);
  });
}

// 검색 결과 중 쿼리와 가장 가까운 단지를 고른다(가짜 데이터를 만드는 게 아니라,
// 이미 검색된 실데이터 후보들 중 하나를 더 합리적으로 선택하는 것뿐).
export function bestMatch(results, query) {
  if (!results?.length) return null;
  const q = normalizeComplexName(query ?? "");
  const score = (c) => {
    const name = normalizeComplexName(c.name);
    const exact = name === q ? 1000 : 0;
    const totalTx = (c.areaBuckets ?? []).reduce((s, b) => s + (b.txCount ?? 0), 0);
    // 이름 길이가 쿼리와 가까울수록(=더 구체적일수록) 가점, 총 거래건수도 소폭 반영
    const closeness = 100 - Math.abs(q.length - name.length);
    return exact + closeness + Math.min(50, totalTx);
  };
  return [...results].sort((a, b) => score(b) - score(a))[0];
}

export function findComplex(index, id) {
  return index?.complexes?.find((c) => c.id === id) ?? null;
}
