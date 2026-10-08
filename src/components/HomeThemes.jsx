import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { formatHousingArea, formatPrice } from "../utils";

const definitions = [
  { key: "active", marker: "30D", eyebrow: "ACTIVE DISTRICTS", title: "자치구별 거래 1위 단지", description: "최근 30일 매매 계약을 기준으로 각 자치구의 대표 단지를 비교합니다.", tone: "active" },
  { key: "premium", marker: "₩", eyebrow: "PRICE LEADERS", title: "자치구별 가격 선도 단지", description: "최근 90일, 자치구에서 가장 높은 매매 계약이 확인된 단지입니다.", tone: "premium" },
  { key: "rentDemand", marker: "J", eyebrow: "JEONSE DEMAND", title: "전세 수요가 모인 단지", description: "최근 90일, 자치구마다 전세 계약이 가장 많이 확인된 단지입니다.", tone: "rent" },
];

function ThemeCard({ item, definition, onSelect }) {
  const metric = definition.key === "premium" ? formatPrice(item.price) : item.themeMetric;
  const secondary = definition.key === "rentDemand" && item.latestJeonse
    ? `최근 전세 ${formatPrice(item.latestJeonse)}`
    : `최근 매매 ${formatPrice(item.price)}`;
  return <button className={`home-theme-card ${definition.tone}`} type="button" onClick={() => onSelect?.(item)}>
    <span className="home-theme-district">{item.district}</span>
    <span className="home-theme-marker" aria-hidden="true">{definition.marker}</span>
    <strong>{item.complex}</strong>
    <small>{item.dong} · {formatHousingArea(item)}</small>
    <span className="home-theme-metric"><b>{metric}</b><small>{item.themeNote}</small></span>
    <span className="home-theme-price">{secondary}<i>상세 보기 →</i></span>
  </button>;
}

const countOf = (item) => Number.parseInt(String(item.themeMetric || "0").replace(/[^0-9]/g, ""), 10) || 0;

function ActiveDistricts({ items, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const ranked = useMemo(() => [...items].sort((a, b) => countOf(b) - countOf(a)
    || b.dealDate.localeCompare(a.dealDate)
    || b.price - a.price), [items]);
  const maxCount = Math.max(...ranked.map(countOf), 1);
  const visible = expanded ? ranked : ranked.slice(0, 6);

  return <div className="active-districts-board">
    <div className="active-districts-summary">
      <span><b>{ranked.length}</b>개 자치구</span>
      <span>단지별 최근 30일 매매 계약</span>
      <span>계약 건수 순</span>
    </div>
    <div className="active-districts-list">
      {visible.map((item, index) => {
        const count = countOf(item);
        return <button className={`active-district-row ${index < 3 ? "leader" : ""}`} type="button" key={`active-${item.district}-${item.complex}`} onClick={() => onSelect?.(item)} aria-label={`${index + 1}위 ${item.district} ${item.complex}, 최근 30일 ${count}건`}>
          <span className="active-district-rank">{String(index + 1).padStart(2, "0")}</span>
          <span className="active-district-copy">
            <span className="active-district-location"><b>{item.district}</b><small>{item.dong}</small></span>
            <strong>{item.complex}</strong>
            <small>{formatHousingArea(item)} · 최근 {item.dealDate}</small>
            <i><em style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }} /></i>
          </span>
          <span className="active-district-stat"><strong>{count}<small>건</small></strong><span>{formatPrice(item.price)}</span></span>
          <span className="active-district-arrow" aria-hidden="true">→</span>
        </button>;
      })}
    </div>
    {ranked.length > 6 && <button className="active-districts-more" type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? "상위 6개만 보기" : `전체 ${ranked.length}개 자치구 보기`}<span aria-hidden="true">{expanded ? "↑" : "↓"}</span></button>}
  </div>;
}

export default function HomeThemes({ payload, loading, error, onSelect }) {
  if (loading) return <section className="card home-themes home-themes-loading" aria-label="테마별 아파트 불러오는 중"><i /><i /><i /></section>;
  if (error || !payload) return <section className="card home-themes home-themes-empty"><span>THEME APARTMENTS</span><p>{error || "테마별 단지를 준비하고 있습니다."}</p></section>;
  return <section className="card home-themes" aria-label="테마별 아파트 단지">
    <header className="home-themes-intro"><div><span>SEOUL APARTMENT THEMES</span><h2>어떤 기준으로 단지를 볼까요?</h2><p>같은 기간과 기준으로 서울 25개 자치구의 대표 단지를 골랐습니다.</p></div><strong>{payload.latestDealDate}<small>계약일 기준</small></strong></header>
    <div className="home-theme-groups">{definitions.map(definition => {
      const items = payload.themes[definition.key] || [];
      return <section className={`home-theme-group ${definition.key === "active" ? "home-theme-group-active" : ""}`} key={definition.key}>
        <header><div><span>{definition.eyebrow}</span><h3>{definition.title}</h3><p>{definition.description}</p></div><em>{items.length}개 자치구</em></header>
        {definition.key === "active" ? <ActiveDistricts items={items} onSelect={onSelect} /> : <div className="home-theme-rail">{items.map(item => <ThemeCard item={item} definition={definition} onSelect={onSelect} key={`${definition.key}-${item.district}-${item.complex}`} />)}</div>}
      </section>;
    })}</div>
    <Link className="home-theme-search-link" to="/search">조건을 직접 정해서 아파트 찾기 <span>→</span></Link>
  </section>;
}
