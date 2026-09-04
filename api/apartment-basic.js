const REB_APT_API_KEY = process.env.REB_APT_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const query = String(req.query?.query ?? "").trim();
  if (!query) return res.status(400).json({ error: "query 파라미터가 필요합니다." });
  if (!REB_APT_API_KEY) return res.status(503).json({ error: "REB_APT_API_KEY가 없습니다." });
  try {
    const url = new URL("https://api.odcloud.kr/api/15106861/v1/uddi:46a20910-19aa-462e-ba09-e897b77d0e76");
    url.searchParams.set("serviceKey", REB_APT_API_KEY);
    url.searchParams.set("page", "1");
    url.searchParams.set("perPage", "20");
    url.searchParams.set("returnType", "JSON");
    url.searchParams.set("cond[단지명::LIKE]", query);
    const response = await fetch(url);
    const payload = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: payload?.message || "한국부동산원 API 오류" });
    return res.json({ data: payload.data ?? [], totalCount: payload.totalCount ?? 0, source: "reb-apt-basic" });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
