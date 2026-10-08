import { useEffect, useMemo, useRef, useState } from "react";
import { formatHousingArea, formatPrice, isRecord, latestDate } from "../utils";
import { Empty, SectionHeader } from "./Common";

const dayShift = (value, days) => {
  const date = new Date(value + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};
const complexKey = item => [item.district, item.dong, item.complex].join("|");
const priceBand = price => price < 50000 ? "5억 미만" : price < 100000 ? "5억~10억 미만" : price < 150000 ? "10억~15억 미만" : price < 200000 ? "15억~20억 미만" : "20억 이상";
const bands = ["5억 미만", "5억~10억 미만", "10억~15억 미만", "15억~20억 미만", "20억 이상"];

function ComplexRows({ rows, onSelect }) {
  const [limit, setLimit] = useState(10);
  const prices = rows.map(item => item.price);
  const areas = rows.map(item => item.area);
  const low = Math.min(...prices), high = Math.max(...prices);
  return <details className="ledger-complex">
    <summary><span><strong>{rows[0].complex}</strong><small>{rows[0].district} {rows[0].dong} · 전용 {Math.min(...areas).toFixed(2)}{Math.min(...areas) !== Math.max(...areas) ? `~${Math.max(...areas).toFixed(2)}` : ""}㎡</small></span>
      <span className="ledger-range"><strong>{formatPrice(low)}{low !== high ? `~${formatPrice(high)}` : ""}</strong><small>{rows.length}건{rows.some(isRecord) ? " · 최고가 경신" : ""}</small></span></summary>
    <div className="ledger-trades">
      {rows.slice(0,limit).map(item => <button type="button" key={item.id} onClick={() => onSelect(item)} aria-label={`${item.complex} ${formatHousingArea(item)} ${item.floor}층 ${formatPrice(item.price)} 상세`}>
        <span>{formatHousingArea(item)} · {item.floor}층<small>{item.dealingGbn || "거래방식 미기재"} · {item.dealDate} 계약</small></span>
        <span><strong>{formatPrice(item.price)}</strong><small>{isRecord(item) ? "수집기간 최고가 경신" : "실거래"} ›</small></span>
      </button>)}
      {limit < rows.length && <button type="button" onClick={() => setLimit(limit+10)}>거래 {rows.length-limit}건 더 보기</button>}
    </div>
  </details>;
}

function Group({ name, rows, onSelect }) {
  const [limit, setLimit] = useState(12);
  const complexes = useMemo(() => {
    const result = new Map();
    for (const row of rows) {
      const key = complexKey(row);
      if (!result.has(key)) result.set(key, []);
      result.get(key).push(row);
    }
    return [...result.entries()].sort((a,b) => b[1].length-a[1].length || a[1][0].complex.localeCompare(b[1][0].complex,"ko"));
  }, [rows]);
  return <details className="ledger-group" open>
    <summary><strong>{name}</strong><span>{rows.length}건 · {complexes.length}개 단지</span></summary>
    <div className="ledger-complexes">{complexes.slice(0,limit).map(([key,items]) => <ComplexRows key={key} rows={items} onSelect={onSelect}/>)}</div>
    {limit < complexes.length && <button className="morebtn" type="button" onClick={() => setLimit(limit+12)}>단지 {complexes.length-limit}곳 더 보기</button>}
  </details>;
}

export default function DailyLedger({ transactions, onSelect, recordsOnly = false }) {
  const latest = latestDate(transactions);
  const oldest = transactions.reduce((date,item) => !date || item.dealDate < date ? item.dealDate : date,"");
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("district");
  const [keyword, setKeyword] = useState("");
  const [copied, setCopied] = useState("");
  const date = selected || latest;
  const [pageEnd, setPageEnd] = useState("");
  const end = pageEnd || latest;
  const strip = useRef(null);
  useEffect(() => { if (strip.current) strip.current.scrollLeft = strip.current.scrollWidth; }, [end]);
  const dates = end ? Array.from({length:14},(_,index)=>dayShift(end,index-13)).filter(d=>d>=oldest) : [];
  const daily = useMemo(() => {
    const result = new Map();
    for (const item of transactions) {
      if (!result.has(item.dealDate)) result.set(item.dealDate,{count:0,records:0});
      const stats = result.get(item.dealDate);
      stats.count++; if(isRecord(item)) stats.records++;
    }
    return result;
  }, [transactions]);
  const rows = useMemo(() => transactions.filter(item => item.dealDate === date && (!recordsOnly || isRecord(item)) && `${item.district} ${item.dong} ${item.complex}`.replaceAll(" ","").includes(keyword.trim().replaceAll(" ",""))),[transactions,date,recordsOnly,keyword]);
  const groups = useMemo(() => {
    const result = new Map();
    for (const row of rows) {
      const key = mode === "district" ? row.district : priceBand(row.price);
      if (!result.has(key)) result.set(key,[]);
      result.get(key).push(row);
    }
    return [...result.entries()].sort(([a],[b]) => mode==="district" ? a.localeCompare(b,"ko") : bands.indexOf(a)-bands.indexOf(b));
  },[rows,mode]);
  const selectDate = value => {setSelected(value);setCopied("");};
  async function copySummary() {
    const text = [`${date} 계약일 기준 · ${rows.length}건`,...groups.map(([name,items])=>`${name}: ${items.length}건 / ${new Set(items.map(complexKey)).size}개 단지`)].join("\n");
    try { await navigator.clipboard.writeText(text); setCopied("요약을 복사했습니다."); }
    catch { setCopied("클립보드에 접근할 수 없습니다."); }
  }
  return <section className="card daily-ledger">
    <SectionHeader eyebrow={recordsOnly ? "DAILY PRICE HIGHS" : "DAILY TRANSACTIONS"} title={recordsOnly ? "계약일별 최고가 경신" : "계약일별 실거래"} description="국토부 계약일 기준 · 날짜 → 지역·가격대 → 단지 → 개별 거래" />
    <div className="ledger-toolbar">
      <label>계약일<input type="date" value={date} min={oldest || undefined} max={latest || undefined} onChange={event=>{selectDate(event.target.value);setPageEnd(event.target.value);}}/></label>
      <label>단지 · 지역<input type="search" value={keyword} placeholder="단지명, 자치구, 동" onChange={event=>setKeyword(event.target.value)}/></label>
      <button type="button" onClick={()=>{selectDate(latest);setPageEnd("");setKeyword("");}}>최신 계약일</button>
    </div>
    <div className="ledger-calendar">
      <button type="button" aria-label="이전 14일" title="이전 14일" disabled={!dates.length || dates[0]<=oldest} onClick={()=>setPageEnd(dayShift(end,-14))}>‹</button>
      <div className="ledger-date-strip" ref={strip}>{dates.map(value => <button type="button" aria-label={`${value} 거래 ${daily.get(value)?.count || 0}건`} aria-pressed={date===value} key={value} className={date===value?"on":""} onClick={()=>selectDate(value)}>
        <small>{new Intl.DateTimeFormat("ko-KR",{weekday:"short",timeZone:"UTC"}).format(new Date(value+"T00:00:00Z"))}</small><strong>{value.slice(5).replace("-","/")}</strong>
        <span>{daily.get(value)?.count || 0}건</span><small>경신 {daily.get(value)?.records || 0}</small>
      </button>)}</div>
      <button type="button" aria-label="다음 14일" title="다음 14일" disabled={!end || end>=latest} onClick={()=>setPageEnd(dayShift(end,14)>latest?latest:dayShift(end,14))}>›</button>
    </div>
    <div className="ledger-summary"><span><strong>{date || "조회 대기"}</strong> · {rows.length}건 · {new Set(rows.map(complexKey)).size}개 단지</span><button type="button" disabled={!rows.length} onClick={copySummary}>요약 복사</button></div>
    <div className="ledger-modes" role="group" aria-label="거래 묶음 기준"><button aria-pressed={mode==="district"} className={mode==="district"?"on":""} type="button" onClick={()=>setMode("district")}>자치구별</button><button aria-pressed={mode==="price"} className={mode==="price"?"on":""} type="button" onClick={()=>setMode("price")}>가격대별</button></div>
    <p className="ledger-basis">이 날짜는 계약일입니다. 오늘의 부동산처럼 신고서 등록일로 묶는 서비스와 일별 건수가 다릅니다. 최고가 경신은 수집기간 내 이전 계약과 비교합니다.</p>
    <span role="status">{copied}</span>
    <div className="ledger-groups">{groups.length ? groups.map(([name,items])=><Group key={`${date}-${mode}-${keyword}-${name}`} name={name} rows={items} onSelect={onSelect}/>) : <Empty>선택한 날짜와 조건에 해당하는 거래가 없습니다.</Empty>}</div>
  </section>;
}
