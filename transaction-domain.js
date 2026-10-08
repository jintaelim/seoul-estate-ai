export function yearMonth(offset = 0, now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit" }).formatToParts(now).map(p => [p.type, p.value]));
  const date = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1 - offset, 1));
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function assertMolitResponse(parsed) {
  const response = parsed?.response;
  if (!response?.body || !["000", "00", "0"].includes(String(response?.header?.resultCode))) {
    throw new Error(`국토부 응답 오류 (${response?.header?.resultCode ?? "invalid-response"})`);
  }
  return response.body;
}

export function enrichTransactions(items) {
  const counts = new Map();
  const key = t => `${t.district}|${t.dong}|${t.complex}`;
  for (const item of items) counts.set(key(item), (counts.get(key(item)) || 0) + 1);
  const highs = new Map();
  const result = [];
  const dates = new Map();
  for (const item of [...items].sort((a,b) => a.dealDate.localeCompare(b.dealDate))) {
    if (!dates.has(item.dealDate)) dates.set(item.dealDate, []);
    dates.get(item.dealDate).push(item);
  }
  for (const rows of dates.values()) {
    for (const item of rows) result.push({ ...item, permitZone: null, recentCount: counts.get(key(item)), previousHigh: highs.get(`${key(item)}|${item.area}`) || 0 });
    for (const item of rows) {
      const k = `${key(item)}|${item.area}`;
      highs.set(k, Math.max(highs.get(k) || 0, item.price));
    }
  }
  return result.sort((a,b) => b.dealDate.localeCompare(a.dealDate));
}
