import express from "express";
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { fetchCandidateTransactions, normalizeMonthsParam } from "./candidate-service.js";
import { enrichCandidatesWithKapt, isKaptEnabled, fetchComplexProfile } from "./kapt-service.js";
import {
  readIndex, searchIndex, findComplex,
  collectRegimeTransactions, buildRegimeIndex, writeRegimeIndex, checkRegimeIndex,
  currentYm, COLLECTION_START_YM,
} from "./regime-service.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(startDir) {
  let current = startDir;
  const loaded = [];
  for (let depth = 0; depth < 8; depth += 1) {
    try {
      const env = readFileSync(join(current, ".env"), "utf8");
      for (const line of env.split("\n")) {
        const [key, ...rest] = line.split("=");
        const value = rest.join("=").trim();
        const isPlaceholder = !value || value.includes("여기에_") || /^your[_-]/i.test(value);
        if (key && rest.length && !isPlaceholder && process.env[key.trim()] === undefined) {
          process.env[key.trim()] = value;
        }
      }
      loaded.push(current);
    } catch {}

    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return loaded;
}

loadEnvFile(__dirname);

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_KEY = process.env.MOLIT_API_KEY;  // 국토부 실거래가
const KREAI_KEY   = process.env.KREAI_API_KEY;  // 한국부동산원 시세 (선택)

// 서울 25개 구 법정동코드 (5자리)
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

// 토지거래허가구역 동 → 구역명 매핑 (서울시 고시 기준)
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

// API 응답 필드명 (영문) → 내부 데이터 구조 변환
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
    recentCount: 0, // 아래에서 집계
    previousHigh: 0, // 아래에서 계산
  };
}

// 동일 단지+면적의 이전 최고가 계산
function computePreviousHighs(items) {
  // 최신 거래일 기준으로 이전 달 데이터에서 최고가 산출
  const latestMonth = items.reduce((max, t) => t.dealDate > max ? t.dealDate : max, "");
  const currentYm = latestMonth.slice(0, 7); // YYYY-MM

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

// 단지별 최근 거래 건수 집계
function computeRecentCounts(items) {
  const counts = {};
  for (const t of items) {
    counts[t.complex] = (counts[t.complex] ?? 0) + 1;
  }
  return items.map((t) => ({ ...t, recentCount: counts[t.complex] ?? 1 }));
}

// 5개씩 병렬 처리 (API 과부하 방지)
async function batchFetch(tasks, batchSize = 5) {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = await Promise.all(tasks.slice(i, i + batchSize).map((fn) => fn()));
    results.push(...batch.flat());
  }
  return results;
}

// ── 서버 인메모리 캐시 ────────────────────────────────────
const CACHE_TTL_MS = 60 * 60 * 1000; // 1시간
let cache = { data: null, fetchedAt: null, fetching: false };
const candidateCache = new Map();

async function fetchAllDistricts() {
  if (cache.fetching) return; // 중복 실행 방지
  cache.fetching = true;

  const yearMonths = [getYearMonth(0), getYearMonth(1), getYearMonth(2)];
  const tasks = Object.entries(DISTRICT_CODES).flatMap(([district, code]) =>
    yearMonths.map((ym) => async () => {
      try {
        const items = await fetchDistrict(code, ym);
        return items.map((item) => normalizeItem(item, district)).filter(Boolean);
      } catch (err) {
        console.warn(`[skip] ${district} ${ym}: ${err.message}`);
        return [];
      }
    })
  );

  try {
    console.log(`[api] 수집 시작 — ${Object.keys(DISTRICT_CODES).length}개 구 × ${yearMonths.length}개월`);
    let raw = await batchFetch(tasks, 8); // 배치 크기 8로 증가
    raw = computePreviousHighs(raw);
    raw = computeRecentCounts(raw);
    raw.sort((a, b) => b.dealDate.localeCompare(a.dealDate));

    cache.data = raw;
    cache.fetchedAt = new Date().toISOString();
    console.log(`[api] 캐시 갱신 완료 — 총 ${raw.length}건 (${cache.fetchedAt})`);
  } catch (err) {
    console.error("[api] 수집 오류:", err.message);
  } finally {
    cache.fetching = false;
  }
}

function isCacheFresh() {
  return cache.data && cache.fetchedAt &&
    Date.now() - new Date(cache.fetchedAt).getTime() < CACHE_TTL_MS;
}

app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  next();
});

app.use(express.static(__dirname));

app.get("/api/transactions", async (req, res) => {
  if (!SERVICE_KEY) {
    return res.status(503).json({
      error: "MOLIT_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.",
      fallback: true,
    });
  }

  // 캐시가 있으면 즉시 반환, 백그라운드에서 갱신
  if (cache.data) {
    if (!isCacheFresh() && !cache.fetching) {
      console.log("[api] 캐시 만료 — 백그라운드 갱신 시작");
      fetchAllDistricts(); // await 없이 백그라운드 실행
    }
    return res.json({
      data: cache.data,
      source: isCacheFresh() ? "molit-cache" : "molit-stale",
      fetchedAt: cache.fetchedAt,
      count: cache.data.length,
    });
  }

  // 캐시 없음 — 첫 요청이면 수집 후 반환
  if (!cache.fetching) fetchAllDistricts();

  // 수집 완료 대기 (최대 120초)
  const deadline = Date.now() + 120_000;
  while (!cache.data && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 800));
  }

  if (!cache.data) {
    return res.status(504).json({ error: "데이터 수집 시간 초과. 잠시 후 다시 시도하세요." });
  }

  res.json({
    data: cache.data,
    source: "molit",
    fetchedAt: cache.fetchedAt,
    count: cache.data.length,
  });
});

// 단지 관리정보(K-apt + 건축물대장) 즉석 조회 — 추천 상세용
const complexInfoCache = new Map();
app.get("/api/complex-info", async (req, res) => {
  const district = String(req.query.district || "");
  const name = String(req.query.name || "");
  const dong = String(req.query.dong || "");
  const cacheKey = `${district}|${name}|${dong}`;
  if (complexInfoCache.has(cacheKey)) return res.json({ profile: complexInfoCache.get(cacheKey), cached: true });
  try {
    const profile = await fetchComplexProfile({ district, name, dong });
    if (profile) complexInfoCache.set(cacheKey, profile); // 성공만 캐시 (null 캐시 금지)
    res.json({ profile: profile || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 정권별 상승률 비교 — 검색 & 단지 상세 (data/regime-index.json 기반, 실데이터만) ──
app.get("/api/regime-search", (req, res) => {
  const district = req.query.district ? String(req.query.district) : undefined;
  const dong = req.query.dong ? String(req.query.dong) : undefined;
  const query = req.query.q ? String(req.query.q) : undefined;
  const index = readIndex();
  if (!index || !index.complexes?.length) {
    return res.json({ available: false, message: "아직 수집된 데이터가 없습니다. npm run collect:regime 실행이 필요합니다.", results: [] });
  }
  const matched = searchIndex(index, { district, dong, query });
  const results = matched.slice(0, 100).map((c) => ({
    id: c.id, name: c.name, district: c.district, dong: c.dong, buildYear: c.buildYear,
    areaBuckets: c.areaBuckets.map((b) => ({ key: b.key, label: b.label, txCount: b.txCount, latestPrice: b.latestPrice, latestDealDate: b.latestDealDate })),
  }));
  res.json({ available: true, generatedAt: index.generatedAt, count: results.length, results });
});

app.get("/api/regime-complex", (req, res) => {
  const id = String(req.query.id || "");
  const index = readIndex();
  if (!index) return res.json({ available: false, message: "아직 수집된 데이터가 없습니다." });
  const complex = findComplex(index, id);
  if (!complex) return res.status(404).json({ available: false, message: "해당 단지의 수집 데이터가 없습니다." });
  res.json({ available: true, complex });
});

app.get("/api/candidate-transactions", async (req, res) => {
  const months = normalizeMonthsParam(req.query.months, 12);
  const useKapt = isKaptEnabled();
  const forceRefresh = req.query.refresh === "1" || req.query.refresh === "true";
  const cacheKey = `${months}:${useKapt ? "kapt" : "plain"}`;
  const cached = candidateCache.get(cacheKey);

  if (!forceRefresh && cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS) {
    return res.json({ ...cached, source: "molit-candidate-cache" });
  }

  try {
    const result = await fetchCandidateTransactions({ serviceKey: SERVICE_KEY, months });
    // K-apt 관리정보 보강 (KAPT_API_KEY 있을 때만 동작, 실패해도 무시)
    if (useKapt) {
      const kaptReport = {};
      try {
        result.data = await enrichCandidatesWithKapt(result.data, { concurrency: 6, report: kaptReport });
        result.kapt = kaptReport;
      } catch (e) {
        result.kapt = { enabled: true, status: "error", error: e.message };
      }
    } else {
      result.kapt = { enabled: false, status: "off", reason: "KAPT_API_KEY missing" };
    }
    candidateCache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 한국부동산원 아파트 시세 프록시 ──────────────────────────
// 사용: GET /api/apt-price?lawdCd=11680&dealYmd=202605
// 서비스명: 한국부동산원_아파트매매실거래상세 (getRKAptTrade)
// data.go.kr → "한국부동산원" 검색 → KREAI_API_KEY 발급 후 .env에 추가
app.get("/api/apt-price", async (req, res) => {
  if (!KREAI_KEY) {
    return res.status(503).json({
      error: "KREAI_API_KEY가 없습니다. data.go.kr에서 한국부동산원 API 키를 발급받아 .env에 KREAI_API_KEY=키값 형식으로 추가하세요.",
      guide: "https://www.data.go.kr/data/15058017/openapi.do",
    });
  }

  const { lawdCd, dealYmd } = req.query;
  if (!lawdCd || !dealYmd) {
    return res.status(400).json({ error: "lawdCd, dealYmd 파라미터 필요" });
  }

  try {
    const url = new URL("http://apis.data.go.kr/1611000/AptPriceInfoService2/getRKAptTrade");
    url.searchParams.set("serviceKey", KREAI_KEY);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", "1000");
    url.searchParams.set("LAWD_CD", lawdCd);
    url.searchParams.set("DEAL_YMD", dealYmd);

    const apiRes = await fetch(url.toString(), { headers: FETCH_HEADERS });
    if (!apiRes.ok) throw new Error(`API ${apiRes.status}`);
    const xml = await apiRes.text();
    const parsed = xmlParser.parse(xml);
    const body  = parsed?.response?.body;
    const items = body?.items?.item;
    const list  = !items ? [] : Array.isArray(items) ? items : [items];

    res.json({ data: list, totalCount: Number(body?.totalCount ?? 0) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 정권별 비교 데이터 매일 자동 갱신 (서버가 켜져 있는 동안 내부에서 직접 실행) ──
// Vercel처럼 파일을 남길 수 없는 서버리스가 아니라, 계속 떠 있는 이 서버(server.js)에서
// 직접 국토부 API를 다시 받아 data/regime-index.json 을 새로 씀. 별도 크론 서비스 불필요.
const REGIME_UPDATE_HOUR = 6; // 매일 이 시각(서버 로컬 시간)에 갱신
let regimeUpdateRunning = false;
let regimeUpdateLastRun = null; // ISO 문자열

const execFileAsync = promisify(execFile);
// 나중에 Vercel 주소를 실제 서비스로 쓰게 되면, 갱신된 데이터를 깃허브에도 올려야
// Vercel이 새로 배포됩니다. 그 전까지는 이 서버가 갖고 있는 데이터만으로 충분하므로
// 기본은 꺼둠 — .env에 REGIME_AUTO_PUSH=1 을 추가하면 켜집니다.
const AUTO_PUSH_REGIME = process.env.REGIME_AUTO_PUSH === "1" || process.env.REGIME_AUTO_PUSH === "true";

async function commitAndPushRegimeIndex() {
  if (!AUTO_PUSH_REGIME) return;
  try {
    await execFileAsync("git", ["add", "data/regime-index.json"], { cwd: __dirname });
    let hasChanges = true;
    try {
      await execFileAsync("git", ["diff", "--cached", "--quiet"], { cwd: __dirname });
      hasChanges = false; // 종료코드 0 = 변경 없음
    } catch {
      hasChanges = true; // 종료코드 1 = 변경 있음
    }
    if (!hasChanges) {
      console.log("[regime] 어제와 데이터가 같습니다 — 커밋하지 않습니다.");
      return;
    }
    const dateLabel = new Date().toISOString().slice(0, 10);
    await execFileAsync("git", [
      "-c", "user.name=Seoul Estate AI (자동 갱신)",
      "-c", "user.email=bot@seoul-estate-ai.local",
      "commit", "-m", `chore: 실거래 데이터 자동 갱신 (${dateLabel})`,
    ], { cwd: __dirname });
    await execFileAsync("git", ["push"], { cwd: __dirname });
    console.log("[regime] data/regime-index.json 커밋 & 푸시 완료 → Vercel 재배포 트리거됨");
  } catch (err) {
    console.error("[regime] 자동 커밋/푸시 실패 (다음 갱신 때 다시 시도됩니다):", err.message);
  }
}

async function runRegimeAutoUpdate() {
  if (!SERVICE_KEY || regimeUpdateRunning) return;
  regimeUpdateRunning = true;
  const startedAt = Date.now();
  console.log("[regime] 자동 갱신 시작");
  try {
    // 1) 아직 한 번도 못 받은 지역·월을 채움 (이미 있는 건 건너뜀 — API 호출 최소화)
    const filled = await collectRegimeTransactions({ serviceKey: SERVICE_KEY, from: COLLECTION_START_YM, to: currentYm(), force: false });
    if (filled.failed) console.warn(`[regime] 빠진 기간 수집 중 ${filled.failed}건 실패 (다음 갱신 때 재시도됨)`);

    // 2) 최근 3개월은 강제로 다시 받음 — 실거래 신고는 계약 후 최대 30일까지 늦게 올라오고,
    //    취소 건도 뒤늦게 반영되기 때문에 최신 몇 달은 매번 새로 받아야 함
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 2);
    const recentFrom = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
    const refreshed = await collectRegimeTransactions({ serviceKey: SERVICE_KEY, from: recentFrom, to: currentYm(), force: true });
    if (refreshed.failed) console.warn(`[regime] 최근 3개월 재수집 중 ${refreshed.failed}건 실패 (다음 갱신 때 재시도됨)`);

    // 3) 인덱스 생성 + 점검 후, 이상 없을 때만 실제 파일을 덮어씀
    //    (수집이 통째로 실패해도 화면에는 어제 데이터가 그대로 남게 하기 위함)
    const index = buildRegimeIndex();
    const health = checkRegimeIndex(index);
    if (!health.ok) {
      console.error("[regime] 점검 실패 — 인덱스를 갱신하지 않습니다:", health.problems.join(" / "));
    } else {
      writeRegimeIndex(index);
      console.log(`[regime] 갱신 완료 — 단지 ${health.complexCount}개 · 지역 ${health.districtCount}개 · 최근 거래일 ${health.newest}`);
      await commitAndPushRegimeIndex();
    }
  } catch (err) {
    console.error("[regime] 자동 갱신 오류:", err.message);
  } finally {
    regimeUpdateRunning = false;
    regimeUpdateLastRun = new Date().toISOString();
    console.log(`[regime] 소요 시간 ${Math.round((Date.now() - startedAt) / 1000)}초`);
  }
}

function scheduleRegimeAutoUpdate() {
  // 오늘 이미 갱신된 인덱스가 있으면(서버 재시작 등) 바로 다시 돌리지 않고 다음 정해진 시각까지 기다림
  const today = new Date().toDateString();
  const existing = readIndex();
  if (existing?.generatedAt && new Date(existing.generatedAt).toDateString() === today) {
    regimeUpdateLastRun = existing.generatedAt;
    console.log(`[regime] 오늘 이미 갱신됨 — 다음 자동 갱신은 매일 ${REGIME_UPDATE_HOUR}시`);
  } else {
    runRegimeAutoUpdate();
  }
  // 매시 정각마다 "오늘 갱신했는지" 확인 → 지정 시각이 지났는데 아직이면 실행
  setInterval(() => {
    const now = new Date();
    const alreadyRanToday = regimeUpdateLastRun && new Date(regimeUpdateLastRun).toDateString() === now.toDateString();
    if (now.getHours() >= REGIME_UPDATE_HOUR && !alreadyRanToday) runRegimeAutoUpdate();
  }, 60 * 60 * 1000);
}

// 서버 시작 시 즉시 수집 시작
app.listen(PORT, () => {
  console.log(`\n  Seoul Estate AI  →  http://localhost:${PORT}\n`);
  if (!SERVICE_KEY) {
    console.warn("  ⚠  MOLIT_API_KEY 없음 — 샘플 데이터로 동작합니다.");
    console.warn("     .env 파일에 MOLIT_API_KEY=디코딩키 를 추가하세요.\n");
  } else {
    console.log("  ⏳ 국토교통부 실거래 데이터 수집 중...\n");
    fetchAllDistricts(); // 서버 시작 즉시 워밍업
    console.log(`  🔁 정권별 비교 데이터는 매일 ${REGIME_UPDATE_HOUR}시에 자동 갱신됩니다.\n`);
    scheduleRegimeAutoUpdate();
  }
});
