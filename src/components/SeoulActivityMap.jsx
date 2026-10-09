import { useEffect, useMemo, useState } from "react";
import districtsGeo from "../data/seoul-districts.json";
import { latestDate } from "../utils";

const WIDTH = 680;
const HEIGHT = 500;
const PAD = 18;
const COLORS = ["#f1f5ff", "#dfe8ff", "#bccdff", "#8fa8ff", "#626eea", "#3638de"];

function coordinatePairs(value, result = []) {
  if (typeof value?.[0] === "number") result.push(value);
  else value?.forEach(item => coordinatePairs(item, result));
  return result;
}

const allCoordinates = districtsGeo.features.flatMap(feature => coordinatePairs(feature.geometry.coordinates));
const bounds = allCoordinates.reduce((box, [lon, lat]) => ({ minLon: Math.min(box.minLon, lon), maxLon: Math.max(box.maxLon, lon), minLat: Math.min(box.minLat, lat), maxLat: Math.max(box.maxLat, lat) }), { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity });
const project = ([lon, lat]) => [PAD + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (WIDTH - PAD * 2), PAD + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (HEIGHT - PAD * 2)];

function ringsToPath(rings) {
  return rings.map(ring => ring.map((point, index) => `${index ? "L" : "M"}${project(point).map(value => value.toFixed(1)).join(",")}`).join(" ") + " Z").join(" ");
}

function geometryPath(geometry) {
  return geometry.type === "Polygon" ? ringsToPath(geometry.coordinates) : geometry.coordinates.map(ringsToPath).join(" ");
}

function featureCenter(feature) {
  const pairs = coordinatePairs(feature.geometry.coordinates);
  const box = pairs.reduce((result, [lon, lat]) => ({ minLon: Math.min(result.minLon, lon), maxLon: Math.max(result.maxLon, lon), minLat: Math.min(result.minLat, lat), maxLat: Math.max(result.maxLat, lat) }), { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity });
  return project([(box.minLon + box.maxLon) / 2, (box.minLat + box.maxLat) / 2]);
}

function shiftDate(value, amount) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function countGroups(items, keyOf) {
  const groups = new Map();
  items.forEach(item => {
    const key = keyOf(item); const current = groups.get(key);
    if (current) { current.count += 1; if (item.dealDate > current.latest.dealDate) current.latest = item; }
    else groups.set(key, { key, count: 1, latest: item });
  });
  return [...groups.values()].sort((a, b) => b.count - a.count || b.latest.dealDate.localeCompare(a.latest.dealDate));
}

export default function SeoulActivityMap({ transactions = [], onSelect }) {
  const latest = latestDate(transactions);
  const [period, setPeriod] = useState("30");
  const [district, setDistrict] = useState("전체");
  const [hovered, setHovered] = useState("");
  const [activeDay, setActiveDay] = useState(null);
  useEffect(() => setActiveDay(null), [period, district]);
  const filtered = useMemo(() => {
    if (!latest || period === "all") return transactions;
    const start = shiftDate(latest, -(Number(period) - 1));
    return transactions.filter(item => item.dealDate >= start && item.dealDate <= latest);
  }, [transactions, latest, period]);
  const districtCounts = useMemo(() => filtered.reduce((map, item) => map.set(item.district, (map.get(item.district) || 0) + 1), new Map()), [filtered]);
  const maxDistrict = Math.max(1, ...districtCounts.values());
  const scoped = district === "전체" ? filtered : filtered.filter(item => item.district === district);
  const dongRows = useMemo(() => countGroups(scoped, item => district === "전체" ? item.district : item.dong).slice(0, 8), [scoped, district]);
  const complexRows = useMemo(() => countGroups(scoped, item => `${item.dong}|${item.complex}`).slice(0, 8), [scoped]);
  const daily = useMemo(() => {
    const windowDays = period === "all" ? 45 : Math.min(Number(period), 60);
    const dates = latest ? Array.from({ length: windowDays }, (_, index) => shiftDate(latest, index - windowDays + 1)) : [];
    const counts = new Map();
    scoped.forEach(item => {
      const current = counts.get(item.dealDate) || { count: 0, districts: new Map() };
      current.count += 1;
      current.districts.set(item.district, (current.districts.get(item.district) || 0) + 1);
      counts.set(item.dealDate, current);
    });
    return dates.map(date => {
      const current = counts.get(date);
      return {
        date,
        count: current?.count || 0,
        districts: [...(current?.districts || new Map()).entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ko")),
      };
    });
  }, [scoped, latest, period]);
  const maxDaily = Math.max(1, ...daily.map(item => item.count));
  const chartWidth = 720; const chartHeight = 180; const chartPad = { left: 52, right: 24, top: 20, bottom: 30 };
  const chartBase = chartHeight - chartPad.bottom;
  const chartRange = chartHeight - chartPad.top - chartPad.bottom;
  const chartX = index => chartPad.left + (index / Math.max(1, daily.length - 1)) * (chartWidth - chartPad.left - chartPad.right);
  const chartY = count => chartPad.top + ((maxDaily - count) / maxDaily) * chartRange;
  const points = daily.map((item, index) => ({ ...item, x: chartX(index), y: chartY(item.count), index }));
  const dayHitWidth = Math.max(12, (chartWidth - chartPad.left - chartPad.right) / Math.max(daily.length, 1));
  const dailyTicks = [...new Set([maxDaily, Math.round(maxDaily / 2), 0])];
  const activePoint = activeDay === null ? null : points[activeDay];
  const activeName = hovered || district;
  const activeCount = activeName === "전체" ? filtered.length : districtCounts.get(activeName) || 0;
  const periodLabel = period === "all" ? "수집기간 전체" : `최근 ${period}일`;

  return <section className="card seoul-activity" aria-label="서울 자치구 거래 활성도">
    <header className="activity-head"><div><span>SEOUL ACTIVITY MAP</span><h2>서울 거래 활발도</h2><p>계약일별 실거래를 같은 기간 기준으로 지도와 그래프에 표시합니다.</p></div><div className="activity-period" role="group" aria-label="분석 기간">{[["14", "14일"], ["30", "30일"], ["90", "90일"], ["all", "전체"]].map(([value, label]) => <button className={period === value ? "on" : ""} type="button" key={value} onClick={() => setPeriod(value)}>{label}</button>)}</div></header>
    <div className="activity-layout">
      <div className="seoul-map-panel">
        <div className="map-summary"><span>{activeName === "전체" ? "서울 전체" : activeName}</span><strong>{activeCount.toLocaleString("ko-KR")}건</strong><small>{periodLabel} 계약</small></div>
        <svg className="seoul-map" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${periodLabel} 서울 자치구 거래량 히트맵`}>
          {districtsGeo.features.map(feature => {
            const name = feature.properties.sggnm; const count = districtCounts.get(name) || 0; const ratio = count / maxDistrict; const level = count ? Math.min(COLORS.length - 1, Math.max(1, Math.ceil(ratio * (COLORS.length - 1)))) : 0; const [x, y] = featureCenter(feature); const selected = district === name;
            return <g className={`district-shape ${selected ? "selected" : ""}`} key={name} onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered("")} onClick={() => setDistrict(current => current === name ? "전체" : name)} role="button" tabIndex="0" aria-label={`${name} ${count}건`} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") setDistrict(current => current === name ? "전체" : name); }}>
              <path d={geometryPath(feature.geometry)} fill={COLORS[level]} />
              <text x={x} y={y - 2}>{name.replace("구", "")}</text><text className="district-map-count" x={x} y={y + 12}>{count}</text>
            </g>;
          })}
        </svg>
        <div className="map-legend"><span>거래 적음</span>{COLORS.map(color => <i style={{ background: color }} key={color} />)}<span>거래 활발</span></div>
        <p className="map-source">행정경계: 통계청 SGIS · 가공 vuski/admdongkor 및 mapcn-kr · CC BY 4.0</p>
      </div>
      <aside className="activity-drilldown">
        <div className="drilldown-title"><span>{district === "전체" ? "자치구 순위" : `${district} 동별 순위`}</span>{district !== "전체" && <button type="button" onClick={() => setDistrict("전체")}>서울 전체</button>}</div>
        <div className="activity-bars">{dongRows.map((item, index) => <button type="button" key={item.key} onClick={() => district === "전체" ? setDistrict(item.key) : onSelect?.(item.latest)}><span><b>{index + 1}</b><strong>{item.key}</strong></span><i><em style={{ width: `${(item.count / Math.max(1, dongRows[0]?.count)) * 100}%` }} /></i><small>{item.count}건</small></button>)}</div>
        <div className="drilldown-title complex-title"><span>{district === "전체" ? "서울 거래 활발 단지" : `${district} 거래 활발 단지`}</span></div>
        <div className="active-complexes">{complexRows.slice(0, 5).map(item => <button type="button" key={item.key} onClick={() => onSelect?.(item.latest)}><span><strong>{item.latest.complex}</strong><small>{item.latest.dong} · 최근 {item.latest.dealDate}</small></span><b>{item.count}건</b></button>)}</div>
      </aside>
    </div>
    <div className="activity-chart">
      <header><div><span>CONTRACT TREND</span><h3>{district === "전체" ? "서울 전체" : district} 계약일별 거래 추이</h3><p>날짜를 가리키면 일자 합계와 자치구별 매매 계약 건수를 함께 확인할 수 있습니다.</p></div><div className="activity-chart-total"><small>기간 합계</small><strong>{scoped.length.toLocaleString("ko-KR")}건</strong></div></header>
      <div className="activity-chart-wrap">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`${district} 계약일별 거래 추이`}>
          {dailyTicks.map(count => { const y = chartY(count); return <g className="activity-chart-guide" key={count}><line x1={chartPad.left} x2={chartWidth - chartPad.right} y1={y} y2={y} /><text x={chartPad.left - 11} y={y + 4} textAnchor="end">{count.toLocaleString("ko-KR")}건</text></g>; })}
          {points.length > 1 && <polyline points={points.map(point => `${point.x},${point.y}`).join(" ")} />}
          {points.map(point => <g className={activeDay === point.index ? "active" : ""} key={point.date}><circle cx={point.x} cy={point.y} r={point.count ? (activeDay === point.index ? 5 : 3.5) : 0} /><rect className="activity-chart-hit" x={point.x - dayHitWidth / 2} y={chartPad.top} width={dayHitWidth} height={chartBase - chartPad.top} tabIndex="0" role="button" aria-label={`${point.date} 매매 계약 ${point.count}건`} onPointerDown={() => setActiveDay(point.index)} onPointerEnter={() => setActiveDay(point.index)} onFocus={() => setActiveDay(point.index)} onClick={() => setActiveDay(point.index)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActiveDay(point.index); } }} /></g>)}
          <g className="activity-chart-dates"><text x={chartPad.left} y={chartHeight - 5} textAnchor="start">{daily[0]?.date.slice(5)}</text><text x={(chartPad.left + chartWidth - chartPad.right) / 2} y={chartHeight - 5} textAnchor="middle">{daily[Math.floor(daily.length / 2)]?.date.slice(5)}</text><text x={chartWidth - chartPad.right} y={chartHeight - 5} textAnchor="end">{daily.at(-1)?.date.slice(5)}</text></g>
        </svg>
        {activePoint && <div className={`activity-chart-tooltip ${activePoint.x < 115 ? "is-left" : activePoint.x > chartWidth - 115 ? "is-right" : ""} ${activePoint.y < 58 ? "is-below" : ""}`} style={{ left: `${(activePoint.x / chartWidth) * 100}%`, top: `${(activePoint.y / chartHeight) * 100}%` }}><strong>{activePoint.date}</strong><b>{activePoint.count.toLocaleString("ko-KR")}건</b><span>{district === "전체" ? "서울 전체" : district} 매매 계약</span></div>}
      </div>
      {district === "전체" && activePoint && <section className="activity-district-breakdown" aria-live="polite" aria-label={`${activePoint.date} 자치구별 거래 건수`}>
        <header><div><strong>{activePoint.date} 자치구별 거래</strong><small>거래가 확인된 자치구를 건수순으로 표시합니다.</small></div><b>{activePoint.districts.length.toLocaleString("ko-KR")}개 자치구</b></header>
        {activePoint.districts.length ? <div>{activePoint.districts.map(item => <button type="button" key={item.name} onClick={() => setDistrict(item.name)} aria-label={`${item.name} 거래 ${item.count}건 추이 보기`}><span>{item.name}</span><strong>{item.count.toLocaleString("ko-KR")}건</strong><i aria-hidden="true">→</i></button>)}</div> : <p>이 날짜에 확인된 매매 계약이 없습니다.</p>}
      </section>}
    </div>
  </section>;
}
