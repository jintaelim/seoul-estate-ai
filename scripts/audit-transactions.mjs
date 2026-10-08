import { readFile, writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import { fetchMolit, runInBatches } from "../molit-fetch.js";
import { DISTRICT_CODES } from "../api/_districts.js";
import { assertMolitResponse } from "../transaction-domain.js";

const snapshot = JSON.parse(await readFile(new URL("../data/cache/transactions.json", import.meta.url), "utf8"));
const parser = new XMLParser({ignoreAttributes:false});
const month = process.argv[2] || snapshot.coverage.months[0];
if (!/^\d{6}$/.test(month)) throw new Error("Expected YYYYMM");
if (!process.env.MOLIT_API_KEY) throw new Error("MOLIT_API_KEY required");
const signature = row => JSON.stringify([row.district,row.dong,row.complex,row.dealDate,row.area,row.floor,row.price]);
const multiset = rows => {
  const map = new Map();
  for (const row of rows) { const key=signature(row); map.set(key,(map.get(key)||0)+1); }
  return map;
};
const difference = (a,b) => [...a].flatMap(([key,count]) => count>(b.get(key)||0) ? [{transaction:JSON.parse(key),count:count-(b.get(key)||0)}] : []);
const reports = await runInBatches(Object.entries(DISTRICT_CODES).map(([district, code]) => async () => {
  try {
    let rows=[], total=0;
    for (let page=1; page===1 || rows.length<total; page++) {
      const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade");
      url.search = new URLSearchParams({serviceKey:process.env.MOLIT_API_KEY, LAWD_CD:code,DEAL_YMD:month,numOfRows:"1000",pageNo:String(page)});
      const response = await fetchMolit(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = assertMolitResponse(parser.parse(await response.text()));
      const items = body.items?.item ? [].concat(body.items.item) : [];
      total=Number(body.totalCount);
      if (!items.length && rows.length<total) throw new Error("Incomplete pagination");
      rows.push(...items);
    }
    const active=rows.filter(row=>!["O","Y","취소"].includes(String(row.cdealType||"").trim())&&!String(row.cdealDay||"").trim());
    const source=active.map(row=>({district,dong:String(row.umdNm).trim(),complex:String(row.aptNm).trim(),dealDate:`${row.dealYear}-${String(row.dealMonth).padStart(2,"0")}-${String(row.dealDay).padStart(2,"0")}`,area:Number(row.excluUseAr),floor:Number(row.floor),price:Number(String(row.dealAmount).replaceAll(",","").trim())}));
    const local=snapshot.data.filter(row=>row.district===district&&row.dealDate.replaceAll("-","").startsWith(month));
    return {district,source:source.length,stored:local.length,cancelled:rows.length-active.length,missing:difference(multiset(source),multiset(local)),extra:difference(multiset(local),multiset(source))};
  } catch(error) { return {district,error:error.message}; }
}),3,200);
const report={checkedAt:new Date().toISOString(),snapshotAt:snapshot.fetchedAt,month,reports};
await writeFile(`/tmp/estate-data-audit-${month}.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify({month,checkedAt:report.checkedAt,snapshotAt:report.snapshotAt,districts:reports.length,source:reports.reduce((n,r)=>n+(r.source||0),0),stored:reports.reduce((n,r)=>n+(r.stored||0),0),differences:reports.filter(r=>r.error||r.missing.length||r.extra.length)},null,2));
