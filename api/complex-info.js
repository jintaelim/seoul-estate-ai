import { fetchComplexProfile } from "../kapt-service.js";

// 단지 관리정보(K-apt + 건축물대장) 즉석 조회 — 추천 상세용
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const district = String(req.query?.district || "");
  const name = String(req.query?.name || "");
  const dong = String(req.query?.dong || "");
  try {
    const profile = await fetchComplexProfile({ district, name, dong });
    res.json({ profile: profile || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
