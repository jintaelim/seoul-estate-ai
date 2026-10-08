export default function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.json({ status: "ok", checkedAt: new Date().toISOString(), note: "설정 여부이며 실제 upstream 연결 성공을 의미하지 않습니다.", configured: {
    transactions: Boolean(process.env.MOLIT_API_KEY),
    rent: Boolean(process.env.MOLIT_API_KEY),
    apartmentBasic: Boolean(process.env.APT_BASIC_API_KEY || process.env.DATA_GO_KR_API_KEY || process.env.REB_APT_API_KEY),
    buildingHub: Boolean(process.env.BUILDING_HUB_API_KEY || process.env.DATA_GO_KR_API_KEY),
    location: Boolean(process.env.KAKAO_REST_API_KEY),
    storage: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    listings: false, permits: true,
  } });
}
