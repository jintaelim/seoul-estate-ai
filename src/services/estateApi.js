const CACHE_KEY = "seoul_estate_react_v1";
const CACHE_TTL = 60 * 60 * 1000;

export function readTransactionCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached && Date.now() - cached.savedAt < CACHE_TTL ? cached.data : null;
  } catch {
    return null;
  }
}

export async function fetchTransactions() {
  const response = await fetch("/api/transactions", { cache: "no-store" });
  if (!response.ok) throw new Error(`실거래 API ${response.status}`);
  const payload = await response.json();
  if (!payload.data?.length) throw new Error(payload.error || "실거래 데이터가 비어 있습니다.");
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: payload.data, savedAt: Date.now() }));
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
