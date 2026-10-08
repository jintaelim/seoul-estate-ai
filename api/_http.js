const visitors = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 180;

function clientKey(req) {
  const forwarded = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.ip || req.socket?.remoteAddress || "unknown";
}

export function guardReadRequest(req, res) {
  const now = Date.now();
  const key = clientKey(req);
  const current = visitors.get(key);
  const entry = !current || now - current.startedAt >= WINDOW_MS
    ? { startedAt: now, count: 1 }
    : { ...current, count: current.count + 1 };
  visitors.set(key, entry);

  if (visitors.size > 5000) {
    for (const [visitor, value] of visitors) {
      if (now - value.startedAt >= WINDOW_MS) visitors.delete(visitor);
    }
  }

  res.setHeader("X-RateLimit-Limit", String(MAX_REQUESTS));
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, MAX_REQUESTS - entry.count)));
  if (entry.count <= MAX_REQUESTS) return true;

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Retry-After", String(Math.ceil((entry.startedAt + WINDOW_MS - now) / 1000)));
  res.status(429).json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." });
  return false;
}

export function cacheControl(req, { browser = 30, edge = 300, stale = 86400 } = {}) {
  if (req.query?.refresh === "1") return "no-store";
  return `public, max-age=${browser}, s-maxage=${edge}, stale-while-revalidate=${stale}, stale-if-error=${stale}`;
}

export function noStore(res) {
  res.setHeader("Cache-Control", "no-store");
}
