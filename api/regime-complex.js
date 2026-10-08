import { readIndex, findComplex } from "../regime-service.js";

// 정권별 비교 — 단일 단지의 연도별 시계열 + 정권 구간 상승률 + 국면 분석 (실데이터만)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const id = req.query?.id ? String(req.query.id) : "";

  const index = readIndex();
  if (!index) return res.json({ available: false, message: "아직 수집된 데이터가 없습니다." });

  const complex = findComplex(index, id);
  if (!complex) return res.status(404).json({ available: false, message: "해당 단지의 수집 데이터가 없습니다." });

  res.json({ available: true, complex });
}
