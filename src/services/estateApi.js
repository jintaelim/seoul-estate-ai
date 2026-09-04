const CACHE_KEY = "seoul_estate_react_v1";
const CACHE_TTL = 60 * 60 * 1000;
// 전체 거래 원장은 Supabase에 보관합니다. 브라우저에는 오프라인 fallback용
// 최신 일부만 저장해 localStorage 용량을 안정적으로 제한합니다.
const CACHE_MAX_ROWS = 300;
const CACHE_MAX_BYTES = 350_000;

export function readTransactionCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cached || Date.now() - cached.savedAt >= CACHE_TTL || !Array.isArray(cached.data)) return null;
    const trimmed = cached.data.slice(0, CACHE_MAX_ROWS);
    // 예전 버전이 저장한 대용량 캐시를 다음 성공 시도 전에 정리합니다.
    if (cached.data.length > CACHE_MAX_ROWS) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: trimmed, savedAt: cached.savedAt })); } catch { try { localStorage.removeItem(CACHE_KEY); } catch {} }
    }
    return trimmed;
  } catch {
    return null;
  }
}

export async function fetchTransactions() {
  const response = await fetch("/api/transactions", { cache: "no-store" });
  if (!response.ok) throw new Error(`실거래 API ${response.status}`);
  const payload = await response.json();
  if (!payload.data?.length) throw new Error(payload.error || "실거래 데이터가 비어 있습니다.");
  // 전체 원장(수천 건)은 브라우저 localStorage 한도를 넘을 수 있습니다.
  // 화면에는 전체 응답을 그대로 반환하되, 오프라인 fallback용 최근 일부만 저장합니다.
  try {
    const cachePayload = { data: payload.data.slice(0, CACHE_MAX_ROWS), savedAt: Date.now() };
    const serialized = JSON.stringify(cachePayload);
    if (serialized.length <= CACHE_MAX_BYTES) localStorage.setItem(CACHE_KEY, serialized);
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // 저장 공간이 부족해도 API 응답 자체는 성공으로 처리합니다.
    try { localStorage.removeItem(CACHE_KEY); } catch {}
  }
  return payload;
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
  const params = new URLSearchParams({ district, complex, months: String(months) });
  if (dong) params.set("dong", dong);
  const response = await fetch(`/api/rent-transactions?${params}`, { signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `전월세 API ${response.status}`);
  return payload;
}

export async function fetchApartmentBasic(query, signal) {
  const response = await fetch(`/api/apartment-basic?query=${encodeURIComponent(query)}`, { signal });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `단지 기본정보 API ${response.status}`);
  return payload;
}
