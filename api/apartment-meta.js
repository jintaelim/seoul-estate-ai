const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const query = String(req.query?.query ?? "").trim();
  if (!query) return res.status(400).json({ error: "query 파라미터가 필요합니다." });
  if (!KAKAO_REST_API_KEY) return res.status(503).json({ error: "KAKAO_REST_API_KEY가 없습니다." });

  const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };
  try {
    const placeUrl = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    placeUrl.searchParams.set("query", `서울 ${query} 아파트`);
    placeUrl.searchParams.set("size", "5");
    const placeRes = await fetch(placeUrl, { headers });
    if (!placeRes.ok) throw new Error(`카카오 장소 API ${placeRes.status}`);
    const apartment = (await placeRes.json()).documents?.[0];
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
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
