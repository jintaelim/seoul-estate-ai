const responses = new Map();
async function readSaved(url, signal) {
  const cacheKey = url.replace(/[?&]refresh=1/, "");
  const cached = responses.get(cacheKey);
  const response = await fetch(url, { cache: "no-cache", signal,
    headers: cached?.etag ? { "If-None-Match": cached.etag } : {} });
  if (response.status === 304 && cached) return cached.payload;
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `데이터 API ${response.status}`);
  responses.set(cacheKey, { payload, etag: response.headers?.get("etag") });
  if (responses.size > 32) responses.delete(responses.keys().next().value);
  return payload;
}

export async function fetchTransactions(signal, refresh = false) {
  if (refresh) {
    const response = await fetch("/api/refresh?dataset=transactions", { method: "POST", cache: "no-store", signal });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `원장 수집 ${response.status}`);
  }
  const payload = await readSaved(`/api/transactions?full=1${refresh ? "&refresh=1" : ""}`, signal);
  if (!Array.isArray(payload.data)) throw new Error("실거래 응답 형식이 올바르지 않습니다.");
  if (payload.count !== payload.data.length) throw new Error("실거래 전체 건수와 응답 원장이 일치하지 않습니다.");
  return payload;
}

export async function fetchApartmentCatalog(signal, refresh = false) {
  const payload = await readSaved(`/api/apartment-catalog${refresh ? "?refresh=1" : ""}`, signal);
  if (!Array.isArray(payload.data) || payload.count !== payload.data.length) throw new Error("단지 검색 목록의 건수가 일치하지 않습니다.");
  return payload;
}

export async function searchApartments(filters, page = 1, signal) {
  const params = new URLSearchParams({
    keyword: filters.keyword || "", district: filters.district || "전체",
    minPrice: String(Number(filters.min || 0) * 10000), maxPrice: String(Number(filters.max || 0) * 10000),
    minArea: filters.area || "0", minBuilt: filters.built === "before2010" ? "0" : (filters.built || "0"),
    builtBefore: filters.built === "before2010" ? "2010" : "0", minHouseholds: filters.households || "0", minRooms: filters.rooms || "0", far: filters.far || "0",
    minTrades: filters.minTrades || "0", maxInterval: filters.maxInterval || "0", maxDaysSince: filters.maxDaysSince || "0",
    minDiscount: filters.minDiscount || "0", maxGap: String(Number(filters.maxGap || 0) * 10000), minJeonseRatio: filters.minJeonseRatio || "0",
    minRentTrades: filters.minRentTrades || "0", maxRentAge: filters.maxRentAge || "0", dealType: filters.dealType || "all",
    quality: filters.quality || "all", permit: filters.permit || "all", theme: filters.theme || "all",
    sort: filters.sort || "latest", page: String(page), limit: "20",
  });
  const payload = await readSaved(`/api/apartment-search?${params}`, signal);
  if (!Array.isArray(payload.data) || payload.count !== payload.data.length) throw new Error("아파트 검색 결과의 건수가 일치하지 않습니다.");
  return payload;
}

export async function fetchLatestTransactions(signal) {
  const summary = await readSaved("/api/market-summary?dataset=transactions", signal);
  const latest = summary.groups.reduce((date, row) => row.date > date ? row.date : date, "");
  if (!latest) return { ...summary, data: [], count: 0, latestDealDate: "" };
  const expected = summary.groups.filter(row => row.date === latest).reduce((sum, row) => sum + row.count, 0);
  const data = [];
  let page = 1, payload;
  do {
    payload = await readSaved(`/api/transactions?date=${latest}&page=${page++}&limit=200`, signal);
    data.push(...payload.data);
  } while (payload.hasMore);
  if (data.length !== expected) throw new Error("최신 계약일 집계와 거래 원장이 일치하지 않습니다.");
  return { ...summary, data, count: data.length, latestDealDate: latest };
}

export async function fetchHomeThemes(signal) {
  const payload = await readSaved("/api/market-summary?view=home-themes", signal);
  if (!payload?.themes || !Array.isArray(payload.themes.liquidity) || !Array.isArray(payload.themes.permitImpact) || !Array.isArray(payload.themes.rentDefense)) {
    throw new Error("홈 테마 데이터 형식이 올바르지 않습니다.");
  }
  return payload;
}

export async function fetchComplexTransactions({ district, dong, complex }, signal) {
  const params = new URLSearchParams({ district, dong, complex, limit: "200", page: "1" });
  const data = [];
  let page = 1, payload;
  do {
    params.set("page", String(page++));
    payload = await readSaved(`/api/transactions?${params}`, signal);
    data.push(...payload.data);
  } while (payload.hasMore);
  return data;
}

export async function fetchCandidates(months, signal) {
  const response = await fetch(`/api/candidate-transactions?months=${months}`, { signal });
  if (!response.ok) throw new Error(`후보 단지 API ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error);
  return payload;
}

export async function fetchApartmentMeta(query, signal) {
  const response = await fetch(`/api/apartment-meta?query=${encodeURIComponent(query)}`, { signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `단지 메타 API ${response.status}`);
  return payload;
}

export async function fetchRentTransactions({ district, dong, complex, months = 24 }, signal) {
  const cutoff = new Date();
  cutoff.setDate(1);
  cutoff.setMonth(cutoff.getMonth() - Math.max(0, Number(months) - 1));
  const from = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-01`;
  const params = new URLSearchParams({ district, complex, from, limit: "200", page: "1" });
  if (dong) params.set("dong", dong);
  const data = [];
  let page = 1, payload;
  do {
    params.set("page", String(page++));
    payload = await readSaved(`/api/rent-transactions?${params}`, signal);
    if (!Array.isArray(payload.data) || payload.count !== payload.data.length) throw new Error("전월세 원장 응답 건수가 일치하지 않습니다.");
    data.push(...payload.data);
  } while (payload.hasMore);
  if (data.length !== payload.totalCount) throw new Error("전월세 원장 일부 내역이 누락되었습니다.");
  return { ...payload, data, count: data.length, months: Number(months) };
}

export function fetchRentSummary(signal, refresh = false) {
  return readSaved(`/api/market-summary?dataset=rent-transactions${refresh ? "&refresh=1" : ""}`, signal);
}

export async function fetchApartmentBasic(query, signal) {
  const response = await fetch(`/api/apartment-basic?query=${encodeURIComponent(query)}`, { signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `단지 기본정보 API ${response.status}`);
  return payload;
}

export async function fetchLandPermits(signal, refresh = false) {
  const payload = await readSaved(`/api/land-permits?full=1${refresh ? "&refresh=1" : ""}`, signal);
  if (!Array.isArray(payload.data) || payload.count !== payload.data.length) throw new Error("토지거래허가 응답 형식이 올바르지 않습니다.");
  return payload;
}

export async function fetchPermitDay({ date, district, status, refresh }, signal) {
  const summary = await readSaved(`/api/market-summary?dataset=land-permits${refresh ? "&refresh=1" : ""}`, signal);
  const latest = summary.groups.reduce((last, row) => row.date > last ? row.date : last, "");
  const selected = date || latest;
  if (!selected) return { ...summary, latestDate: latest, data: [] };
  const params = new URLSearchParams({ date: selected, limit: "200", page: "1" });
  if (district !== "전체") params.set("district", district);
  if (status !== "전체") params.set("status", status);
  const data = [];
  let page = 1, payload;
  do {
    params.set("page", String(page++));
    payload = await readSaved(`/api/land-permits?${params}`, signal);
    if (payload.fetchedAt !== summary.fetchedAt) throw new Error("원장이 갱신되었습니다. 다시 조회해 주세요.");
    if (!Array.isArray(payload.data) || payload.count !== payload.data.length) throw new Error("허가 원장 응답 건수가 일치하지 않습니다.");
    data.push(...payload.data);
  } while (payload.hasMore);
  if (data.length !== payload.totalCount) throw new Error("허가 원장 일부 내역이 누락되었습니다.");
  return { ...summary, latestDate: latest, data };
}
