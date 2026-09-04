import express from "express";
import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { fetchCandidateTransactions, normalizeMonthsParam } from "./candidate-service.js";
import { fetchMolit, runInBatches } from "./molit-fetch.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env 수동 로드 (dotenv 없이)
try {
  const env = readFileSync(join(__dirname, ".env"), "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {}

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_KEY = process.env.MOLIT_API_KEY;  // 국토부 실거래가
const KREAI_KEY   = process.env.KREAI_API_KEY;  // 한국부동산원 시세 (선택)
const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY; // 카카오 로컬/도보 API (선택)

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

  const res = await fetchMolit(url.toString(), { headers: FETCH_HEADERS });
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

async function fetchRentDistrictPage(lawdCd, dealYmd, pageNo) {
  const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent");
  url.searchParams.set("serviceKey", SERVICE_KEY);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("LAWD_CD", lawdCd);
  url.searchParams.set("DEAL_YMD", dealYmd);
  const response = await fetchMolit(url.toString(), { headers: FETCH_HEADERS });
  if (!response.ok) throw new Error(`전월세 API ${response.status}`);
  const parsed = xmlParser.parse(await response.text());
  const body = parsed?.response?.body;
  const items = body?.items?.item;
  const list = !items ? [] : Array.isArray(items) ? items : [items];
  return { list, totalCount: Number(body?.totalCount ?? list.length) };
}

async function fetchRentDistrict(lawdCd, dealYmd) {
  const first = await fetchRentDistrictPage(lawdCd, dealYmd, 1);
  const all = [...first.list];
  const pages = Math.ceil(first.totalCount / 1000);
  if (pages > 1) {
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => fetchRentDistrictPage(lawdCd, dealYmd, i + 2)));
    rest.forEach(({ list }) => all.push(...list));
  }
  return all;
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
    let raw = (await runInBatches(tasks, 3, 300)).flat();
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

app.get("/api/rent-transactions", async (req, res) => {
  const district = String(req.query.district ?? "").trim();
  const complex = String(req.query.complex ?? "").trim();
  const dong = String(req.query.dong ?? "").trim();
  const months = Math.max(1, Math.min(96, Number(req.query.months) || 24));
  if (!district || !complex) return res.status(400).json({ error: "district, complex 파라미터가 필요합니다." });
  if (!SERVICE_KEY) return res.status(503).json({ error: "MOLIT_API_KEY가 없습니다." });
  const lawdCd = DISTRICT_CODES[district];
  if (!lawdCd) return res.status(400).json({ error: "서울 자치구를 확인할 수 없습니다." });
  try {
    const base = new Date(); base.setDate(1);
    const monthsList = Array.from({ length: months }, (_, index) => { const date = new Date(base); date.setMonth(base.getMonth() - index); return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`; });
    const rows = (await runInBatches(monthsList.map((ym) => () => fetchRentDistrict(lawdCd, ym)), 3, 250)).flat();
    const normalized = rows.filter((row) => String(row.aptNm ?? "").includes(complex) && (!dong || String(row.umdNm ?? "").trim() === dong)).map((row, index) => ({
      id: `rent-${district}-${complex}-${row.dealYear}-${row.dealMonth}-${row.dealDay}-${row.excluUseAr}-${index}`,
      district, dong: String(row.umdNm ?? "").trim(), complex: String(row.aptNm ?? "").trim(), area: Number(row.excluUseAr) || 0,
      floor: Number(row.floor) || 0, deposit: parsePrice(row.deposit), monthlyRent: parsePrice(row.monthlyRent),
      dealDate: `${row.dealYear}-${String(row.dealMonth).padStart(2, "0")}-${String(row.dealDay).padStart(2, "0")}`,
    })).sort((a, b) => b.dealDate.localeCompare(a.dealDate));
    res.json({ data: normalized, source: "molit-rent", months, fetchedAt: new Date().toISOString() });
  } catch (error) { res.status(502).json({ error: error.message }); }
});

app.get("/api/candidate-transactions", async (req, res) => {
  const months = normalizeMonthsParam(req.query.months, 12);
  const cacheKey = String(months);
  const cached = candidateCache.get(cacheKey);

  if (cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_TTL_MS) {
    return res.json({ ...cached, source: "molit-candidate-cache" });
  }

  try {
    const result = await fetchCandidateTransactions({ serviceKey: SERVICE_KEY, months });
    candidateCache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 단지 좌표·인근 역 메타데이터 프록시. 카카오 REST 키가 있으면 실제 장소를
// 조회하고, 도보 경로 API가 허용되지 않은 앱에서는 직선거리 기반 참고값을 반환합니다.
app.get("/api/apartment-meta", async (req, res) => {
  const query = String(req.query.query ?? "").trim();
  if (!query) return res.status(400).json({ error: "query 파라미터가 필요합니다." });
  if (!KAKAO_REST_API_KEY) return res.status(503).json({ error: "KAKAO_REST_API_KEY가 없습니다." });
  const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };
  try {
    const placeUrl = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    placeUrl.searchParams.set("query", `서울 ${query} 아파트`);
    placeUrl.searchParams.set("size", "5");
    const placeRes = await fetch(placeUrl, { headers });
    if (!placeRes.ok) throw new Error(`카카오 장소 API ${placeRes.status}`);
    const places = (await placeRes.json()).documents ?? [];
    const apartment = places[0];
    if (!apartment) return res.status(404).json({ error: "단지 위치를 찾지 못했습니다." });

    const stationUrl = new URL("https://dapi.kakao.com/v2/local/search/category.json");
    stationUrl.searchParams.set("category_group_code", "SW8");
    stationUrl.searchParams.set("x", apartment.x);
    stationUrl.searchParams.set("y", apartment.y);
    stationUrl.searchParams.set("radius", "2000");
    stationUrl.searchParams.set("sort", "distance");
    stationUrl.searchParams.set("size", "1");
    const stationRes = await fetch(stationUrl, { headers });
    if (!stationRes.ok) throw new Error(`카카오 역 API ${stationRes.status}`);
    const station = (await stationRes.json()).documents?.[0] ?? null;
    const distance = station ? Number(station.distance) : null;
    return res.json({
      apartment: { name: apartment.place_name, address: apartment.road_address_name || apartment.address_name, lat: Number(apartment.y), lng: Number(apartment.x) },
      station: station ? { name: station.place_name, distanceMeters: distance, estimatedWalkMinutes: Math.max(1, Math.ceil(distance / 80)), lat: Number(station.y), lng: Number(station.x) } : null,
      source: "kakao-local",
      note: "도보시간은 직선거리 기반 참고값입니다. 실제 경로는 카카오맵 길찾기를 확인하세요.",
    });
  } catch (err) {
    return res.status(502).json({ error: err.message });
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

// Vite 빌드 결과 제공. 개발 중에는 Vite(5173)가 이 API 서버(3000)를 프록시합니다.
const distDir = join(__dirname, "dist");
app.use(express.static(distDir));
app.get("*", (req, res) => res.sendFile(join(distDir, "index.html")));

// 서버 시작 시 즉시 수집 시작
app.listen(PORT, () => {
  console.log(`\n  Seoul Estate AI  →  http://localhost:${PORT}\n`);
  if (!SERVICE_KEY) {
    console.warn("  ⚠  MOLIT_API_KEY 없음 — 샘플 데이터로 동작합니다.");
    console.warn("     .env 파일에 MOLIT_API_KEY=디코딩키 를 추가하세요.\n");
  } else {
    console.log("  ⏳ 국토교통부 실거래 데이터 수집 중...\n");
    fetchAllDistricts(); // 서버 시작 즉시 워밍업
  }
});
