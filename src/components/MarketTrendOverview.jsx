import { useMemo, useState } from "react";
import { formatPrice } from "../utils";

const WIDTH = 920;
const HEIGHT = 250;
const PAD = { left: 66, right: 18, top: 18, bottom: 34 };
const shiftDate = (value, amount) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
};

export default function MarketTrendOverview({ transactions }) {
  const [metric, setMetric] = useState("price");
  const [district, setDistrict] = useState("전체");
  const [area, setArea] = useState("all");
  const [active, setActive] = useState(null);
  const districts = useMemo(() => [...new Set(transactions.map(item => item.district))].sort(), [transactions]);
  const latest = transactions.reduce((value, item) => item.dealDate > value ? item.dealDate : value, "");
  const rows = useMemo(() => {
    if (!latest) return [];
    const dates = Array.from({ length: 45 }, (_, index) => shiftDate(latest, index - 44));
    const filtered = transactions.filter(item => (district === "전체" || item.district === district)
      && (area === "all" || (area === "small" && item.area < 70) || (area === "medium" && item.area >= 70 && item.area < 100) || (area === "large" && item.area >= 100)));
    return dates.map(date => {
      const deals = filtered.filter(item => item.dealDate === date);
      return { date, count: deals.length, price: deals.length ? median(deals.map(item => item.price)) : null };
    });
  }, [transactions, latest, district, area]);
  const values = rows.map(row => metric === "price" ? row.price : row.count).filter(value => value !== null);
  const max = Math.max(...values, 1);
  const min = metric === "price" ? Math.min(...values, max) : 0;
  const range = Math.max(max - min, metric === "price" ? 1000 : 1);
  const x = index => PAD.left + (index / Math.max(rows.length - 1, 1)) * (WIDTH - PAD.left - PAD.right);
  const y = value => PAD.top + ((max - value) / range) * (HEIGHT - PAD.top - PAD.bottom);
  const pricePoints = rows.map((row, index) => row.price === null ? null : { ...row, index, x: x(index), y: y(row.price) }).filter(Boolean);
  const line = pricePoints.map(point => `${point.x},${point.y}`).join(" ");
  const latestValue = [...rows].reverse().find(row => metric === "price" ? row.price !== null : row.count > 0);
  const summary = metric === "price" ? (latestValue?.price ? formatPrice(latestValue.price) : "거래 없음") : `${latestValue?.count ?? 0}건`;
  const priceSeries = rows.filter(row => row.price !== null);
  const firstPrice = priceSeries[0]?.price ?? null;
  const latestPrice = priceSeries.at(-1)?.price ?? null;
  const priceChange = firstPrice && latestPrice ? ((latestPrice - firstPrice) / firstPrice) * 100 : null;
  const activeRow = active === null ? null : rows[active];
  const activeValue = activeRow ? (metric === "price" ? (activeRow.price ?? min) : activeRow.count) : 0;

  return <section className="card market-trend-overview" aria-label="서울 실거래 추이">
    <header className="market-trend-head"><div><span>SALE PRICE TREND</span><h2>매매가격·거래량 트렌드</h2><p>최근 45일의 실제 매매 계약을 날짜별 중위가격과 거래량으로 비교합니다.</p></div><div className="market-trend-summary"><strong>{summary}</strong>{metric === "price" && priceChange !== null && <span className={priceChange >= 0 ? "up" : "down"}>{priceChange >= 0 ? "▲" : "▼"} {Math.abs(priceChange).toFixed(1)}%</span>}</div></header>
    <div className="market-trend-controls">
      <div className="trend-metric-tabs" aria-label="그래프 지표"><button className={metric === "price" ? "on" : ""} type="button" onClick={() => { setMetric("price"); setActive(null); }}>매매가격</button><button className={metric === "count" ? "on" : ""} type="button" onClick={() => { setMetric("count"); setActive(null); }}>거래 건수</button></div>
      <label>자치구<select value={district} onChange={event => { setDistrict(event.target.value); setActive(null); }}><option>전체</option>{districts.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>전용면적<select value={area} onChange={event => { setArea(event.target.value); setActive(null); }}><option value="all">전체</option><option value="small">70㎡ 미만</option><option value="medium">70–100㎡</option><option value="large">100㎡ 이상</option></select></label>
    </div>
    <div className="market-trend-chart-wrap">
      <div className="market-trend-y"><span>{metric === "price" ? formatPrice(max) : `${max}건`}</span><span>{metric === "price" ? formatPrice(min) : "0건"}</span></div>
      <svg className="market-trend-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`최근 45일 ${metric === "price" ? "중위 거래가" : "거래 건수"} 추이`}>
        {[PAD.top, (HEIGHT - PAD.bottom + PAD.top) / 2, HEIGHT - PAD.bottom].map(value => <line className="market-trend-guide" x1={PAD.left} x2={WIDTH - PAD.right} y1={value} y2={value} key={value} />)}
        {rows.map((row, index) => <rect className="market-trend-hit" x={x(index) - 10} y={PAD.top} width="20" height={HEIGHT - PAD.top - PAD.bottom} key={`hit-${row.date}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onMouseLeave={() => setActive(null)} tabIndex="0" aria-label={`${row.date} ${row.count}건${row.price ? `, 매매 중위가격 ${formatPrice(row.price)}` : ""}`} />)}
        {metric === "price" && pricePoints.length > 1 && <polyline className="market-trend-line" points={line} />}
        {metric === "price" && pricePoints.map(point => <circle className="market-trend-point" cx={point.x} cy={point.y} r={active === point.index ? 5 : 3} key={point.date} />)}
        {metric === "count" && rows.map((row, index) => { const barHeight = (row.count / max) * (HEIGHT - PAD.top - PAD.bottom); return <rect className="market-trend-bar" x={x(index) - 6} y={HEIGHT - PAD.bottom - barHeight} width="12" height={Math.max(row.count ? 2 : 0, barHeight)} rx="2" key={row.date} onMouseEnter={() => setActive(index)} tabIndex="0" onFocus={() => setActive(index)} />; })}
      </svg>
      {activeRow && <div className="market-trend-tooltip" style={{ left: `${(x(active) / WIDTH) * 100}%`, top: `${(y(activeValue) / HEIGHT) * 100}%` }}><strong>{activeRow.date}</strong><span>{activeRow.price ? `매매 ${formatPrice(activeRow.price)}` : "매매가격 없음"}</span><small>거래량 {activeRow.count}건</small></div>}
      <div className="market-trend-x"><span>{rows[0]?.date.slice(5)}</span><span>{rows[Math.floor(rows.length / 2)]?.date.slice(5)}</span><span>{rows.at(-1)?.date.slice(5)}</span></div>
    </div>
    <footer>매매가격은 해당 날짜·조건의 실제 계약금액 중앙값입니다. 거래가 없는 날짜는 선을 연결하지 않으며, 면적을 섞은 전체 값은 참고용입니다.</footer>
  </section>;
}
