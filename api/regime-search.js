import { readIndex, searchIndex } from "../regime-service.js";

// 정권별 비교 — 지역/이름으로 단지 검색 (수집된 실데이터에서만 검색)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const district = req.query?.district ? String(req.query.district) : undefined;
  const dong = req.query?.dong ? String(req.query.dong) : undefined;
  const query = req.query?.q ? String(req.query.q) : undefined;

  const index = readIndex();
  if (!index || !index.complexes?.length) {
    return res.json({ available: false, message: "아직 수집된 데이터가 없습니다. scripts/collect-regime-transactions.mjs 실행이 필요합니다.", results: [] });
  }

  const matched = searchIndex(index, { district, dong, query });
  const results = matched.slice(0, 100).map((c) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    dong: c.dong,
    buildYear: c.buildYear,
    areaBuckets: c.areaBuckets.map((b) => ({
      key: b.key, label: b.label, txCount: b.txCount, latestPrice: b.latestPrice, latestDealDate: b.latestDealDate,
    })),
  }));

  res.json({ available: true, generatedAt: index.generatedAt, count: results.length, results });
}
