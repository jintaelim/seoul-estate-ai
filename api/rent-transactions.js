import { XMLParser } from "fast-xml-parser";
import { fetchMolit, runInBatches } from "../molit-fetch.js";
import { DISTRICT_CODES, parsePrice } from "./_districts.js";

const SERVICE_KEY = process.env.MOLIT_API_KEY;
const xmlParser = new XMLParser({ ignoreAttributes: false });
const FETCH_HEADERS = { "User-Agent": "Seoul-Estate-AI/1.0", "Accept": "application/xml, text/xml, */*" };

async function fetchRentDistrictPage(lawdCd, dealYmd, pageNo) {
  const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent");
  url.searchParams.set("serviceKey", SERVICE_KEY);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("LAWD_CD", lawdCd);
  url.searchParams.set("DEAL_YMD", dealYmd);
  const response = await fetchMolit(url.toString(), { headers: FETCH_HEADERS });
  if (!response.ok) throw new Error(`전월세 API ${response.status}`);
  const body = xmlParser.parse(await response.text())?.response?.body;
  const items = body?.items?.item;
  const list = !items ? [] : Array.isArray(items) ? items : [items];
  return { list, totalCount: Number(body?.totalCount ?? list.length) };
}

async function fetchRentDistrict(lawdCd, dealYmd) {
  const first = await fetchRentDistrictPage(lawdCd, dealYmd, 1);
  const all = [...first.list];
  const pages = Math.ceil(first.totalCount / 1000);
  if (pages > 1) {
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => fetchRentDistrictPage(lawdCd, dealYmd, i + 2)));
    rest.forEach(({ list }) => all.push(...list));
  }
  return all;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const district = String(req.query?.district ?? "").trim();
  const complex = String(req.query?.complex ?? "").trim();
  const dong = String(req.query?.dong ?? "").trim();
  const months = Math.max(1, Math.min(96, Number(req.query?.months) || 24));
  if (!district || !complex) return res.status(400).json({ error: "district, complex 파라미터가 필요합니다." });
  if (!SERVICE_KEY) return res.status(503).json({ error: "MOLIT_API_KEY가 없습니다." });
  const lawdCd = DISTRICT_CODES[district];
  if (!lawdCd) return res.status(400).json({ error: "서울 자치구를 확인할 수 없습니다." });
  try {
    const base = new Date();
    base.setDate(1);
    const monthsList = Array.from({ length: months }, (_, index) => {
      const date = new Date(base);
      date.setMonth(base.getMonth() - index);
      return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    });
    const rows = (await runInBatches(monthsList.map((ym) => () => fetchRentDistrict(lawdCd, ym)), 4, 200)).flat();
    const normalized = rows
      .filter((row) => String(row.aptNm ?? "").includes(complex) && (!dong || String(row.umdNm ?? "").trim() === dong))
      .map((row, index) => ({
        id: `rent-${district}-${complex}-${row.dealYear}-${row.dealMonth}-${row.dealDay}-${row.excluUseAr}-${index}`,
        district, dong: String(row.umdNm ?? "").trim(), complex: String(row.aptNm ?? "").trim(), area: Number(row.excluUseAr) || 0,
        floor: Number(row.floor) || 0, deposit: parsePrice(row.deposit), monthlyRent: parsePrice(row.monthlyRent),
        dealDate: `${row.dealYear}-${String(row.dealMonth).padStart(2, "0")}-${String(row.dealDay).padStart(2, "0")}`,
      }))
      .sort((a, b) => b.dealDate.localeCompare(a.dealDate));
    return res.json({ data: normalized, source: "molit-rent", months, fetchedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
