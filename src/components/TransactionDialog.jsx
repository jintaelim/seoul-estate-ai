import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@seed-design/react";
import { formatHousingArea, formatPrice, isRecord, pricePerPyeong } from "../utils";
import { fetchApartmentMeta, fetchRentTransactions } from "../services/estateApi";
import { compareContracts, datePosition } from "../comparison";

const sameUnit = (candidate, item) => candidate.district === item.district
  && candidate.dong === item.dong
  && candidate.complex === item.complex
  && candidate.area === item.area;

const changeRate = (current, previous) => previous ? ((current / previous) - 1) * 100 : 0;
const signedRate = (rate) => `${rate > 0 ? "+" : ""}${rate.toFixed(1)}%`;
const nicePriceStep = (span) => {
  const target = Math.max(span / 5, 1);
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const normalized = target / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return factor * magnitude;
};

function TrendChart({ items, rentItems = [] }) {
  const [active, setActive] = useState(null);
  if (!items.length && !rentItems.length) {
    return <div className="detail-chart-empty"><span>—</span><p>동일 면적 거래가 더 쌓이면 가격 추이를 보여드립니다.</p></div>;
  }

  const width = 720;
  const height = 260;
  const plot = { left: 92, right: 24, top: 36, bottom: 54 };
  const prices = [...items.map((entry) => entry.price), ...rentItems.map((entry) => entry.deposit).filter(Boolean)];
  const rawMin = Math.min(...prices);
  const rawMax = Math.max(...prices);
  const rawRange = Math.max(rawMax - rawMin, Math.max(rawMax * 0.08, 1));
  const priceStep = nicePriceStep(rawRange);
  const roundedMin = Math.max(0, Math.floor(rawMin / priceStep) * priceStep);
  const roundedMax = Math.ceil(rawMax / priceStep) * priceStep || priceStep;
  const min = roundedMin === roundedMax ? Math.max(0, roundedMin - priceStep) : roundedMin;
  const max = roundedMin === roundedMax ? roundedMax + priceStep : roundedMax;
  const range = max - min;
  const dates = [...new Set([...items, ...rentItems].map(entry => entry.dealDate))].sort();
  const xFor = dealDate => plot.left + datePosition(dealDate, dates) * (width - plot.left - plot.right);
  const yFor = value => plot.top + ((max - value) / range) * (height - plot.top - plot.bottom);
  const points = items.map((entry) => ({
    ...entry,
    x: xFor(entry.dealDate), y: yFor(entry.price),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const baseline = height - plot.bottom;
  const area = points.length > 1 ? `${points[0].x},${baseline} ${line} ${points.at(-1).x},${baseline}` : "";
  const rentPoints = rentItems.map(entry => ({ ...entry, x: xFor(entry.dealDate), y: yFor(entry.deposit) }));
  const activePoint = active?.kind === "rent" ? rentPoints[active.index] : points[active?.index ?? -1];
  const ticks = [max, min + (max - min) / 2, min];
  const latestSale = points.at(-1);
  const latestRent = rentPoints.at(-1);
  const activate = (kind, index) => setActive({ kind, index });
  const keyboardActivate = (event, kind, index) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(kind, index); }
  };
  const tooltipEdge = activePoint?.x < 150 ? "is-left" : activePoint?.x > width - 150 ? "is-right" : "";
  const tooltipVertical = activePoint?.y < 76 ? "is-below" : "";

  return (
    <div className="detail-chart-wrap" onMouseLeave={() => setActive(null)}>
      <div className="detail-chart-series-summary" aria-label="최근 매매와 전세 가격">
        <span className="sale"><i />최근 매매 <strong>{points.length ? formatPrice(points.at(-1).price) : "없음"}</strong></span>
        <span className="rent"><i />최근 전세 <strong>{rentPoints.length ? formatPrice(rentPoints.at(-1).deposit) : "없음"}</strong></span>
      </div>
      <div className="detail-chart-canvas">
        <svg className="detail-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${items.length}건의 동일 면적 실거래 가격 추이`}>
        <defs><linearGradient id="transactionArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1769e0" stopOpacity=".2" /><stop offset="100%" stopColor="#1769e0" stopOpacity="0" /></linearGradient></defs>
        {ticks.map((tick, index) => {
          const y = yFor(tick);
          return <g key={tick}><line className="detail-chart-guide" x1={plot.left} y1={y} x2={width - plot.right} y2={y} /><text className="detail-chart-axis-label" x={plot.left - 12} y={y + 4} textAnchor="end">{formatPrice(Math.round(tick))}</text></g>;
        })}
        <text className="detail-chart-date-label" x={plot.left} y={height - 17} textAnchor="start">{dates[0]}</text>
        {dates.length > 1 && <text className="detail-chart-date-label" x={width - plot.right} y={height - 17} textAnchor="end">{dates.at(-1)}</text>}
        {points.length > 1 && <polygon points={area} fill="url(#transactionArea)" />}
        {points.length > 1 && <polyline className="detail-chart-line" points={line} />}
        {rentPoints.length > 1 && <polyline className="detail-chart-rent-line" points={rentPoints.map((point) => `${point.x},${point.y}`).join(" ")} />}
        {latestSale && <text className="detail-chart-value-label sale" x={latestSale.x + (latestSale.x < plot.left + 80 ? 9 : -9)} y={Math.max(plot.top + 15, latestSale.y - 13)} textAnchor={latestSale.x < plot.left + 80 ? "start" : "end"}>{formatPrice(latestSale.price)}</text>}
        {latestRent && <text className="detail-chart-value-label rent" x={latestRent.x + (latestRent.x < plot.left + 80 ? 9 : -9)} y={Math.min(baseline - 8, latestRent.y + 22)} textAnchor={latestRent.x < plot.left + 80 ? "start" : "end"}>{formatPrice(latestRent.deposit)}</text>}
        {points.map((point, index) => <g key={point.id || `sale-${index}`}><circle className={`detail-chart-point ${index === points.length - 1 ? "latest" : ""}`} cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 4} /><circle className="detail-chart-hit" cx={point.x} cy={point.y} r="13" tabIndex="0" role="button" aria-label={`매매 ${point.dealDate} ${formatPrice(point.price)} ${formatHousingArea(point)}`} onPointerEnter={() => activate("sale", index)} onFocus={() => activate("sale", index)} onKeyDown={(event) => keyboardActivate(event, "sale", index)} onClick={() => activate("sale", index)} /></g>)}
        {rentPoints.map((point, index) => <g key={point.id || `rent-${index}`}><circle className="detail-chart-point rent-point" cx={point.x} cy={point.y} r={index === rentPoints.length - 1 ? 5 : 4} /><circle className="detail-chart-hit" cx={point.x} cy={point.y} r="13" tabIndex="0" role="button" aria-label={`전세 ${point.dealDate} ${formatPrice(point.deposit)} ${formatHousingArea(point)}`} onPointerEnter={() => activate("rent", index)} onFocus={() => activate("rent", index)} onKeyDown={(event) => keyboardActivate(event, "rent", index)} onClick={() => activate("rent", index)} /></g>)}
        </svg>
        {activePoint && <div className={`detail-chart-tooltip ${active?.kind === "rent" ? "rent" : "sale"} ${tooltipEdge} ${tooltipVertical}`} role="tooltip" style={{ left: `${(activePoint.x / width) * 100}%`, top: `${(activePoint.y / height) * 100}%` }}><strong>{active?.kind === "rent" ? "전세 보증금" : "매매 실거래"}</strong><b>{formatPrice(active?.kind === "rent" ? activePoint.deposit : activePoint.price)}</b><span>{activePoint.dealDate} · {formatHousingArea(activePoint)}{activePoint.floor ? ` · ${activePoint.floor}층` : ""}</span></div>}
      </div>
    </div>
  );
}

function Metric({ label, value, note, tone = "" }) {
  return <div className={`detail-metric ${tone}`}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

export default function TransactionDialog({ item, transactions, onClose }) {
  const ref = useRef(null);
  const [rentDeals, setRentDeals] = useState([]);
  const [rentError, setRentError] = useState("");
  const [placeMeta, setPlaceMeta] = useState(null);
  const [compareMonth, setCompareMonth] = useState("");
  const [compareArea, setCompareArea] = useState("all");
  useEffect(() => {
    setCompareMonth(item?.dealDate.slice(0, 7) ?? "");
    setCompareArea("all");
  }, [item]);

  useEffect(() => {
    const dialog = ref.current;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  useEffect(() => {
    if (!item) { setPlaceMeta(null); return undefined; }
    const controller = new AbortController();
    setPlaceMeta(null);
    fetchApartmentMeta(`${item.district} ${item.dong} ${item.complex}`, controller.signal)
      .then(setPlaceMeta)
      .catch((error) => { if (error.name !== "AbortError") setPlaceMeta(null); });
    return () => controller.abort();
  }, [item]);

  useEffect(() => {
    if (!item) { setRentDeals([]); return undefined; }
    const controller = new AbortController();
    setRentError("");
    setRentDeals([]);
    fetchRentTransactions({ district: item.district, dong: item.dong, complex: item.complex, months: 60 }, controller.signal)
      .then((payload) => setRentDeals((payload.data ?? []).filter((entry) => entry.area === item.area && entry.monthlyRent === 0).reverse()))
      .catch((error) => { if (error.name !== "AbortError") { setRentDeals([]); setRentError(error.message); } });
    return () => controller.abort();
  }, [item]);

  const detail = useMemo(() => {
    if (!item) return null;
    const unitDeals = transactions.filter((candidate) => sameUnit(candidate, item)).sort((a, b) => a.dealDate.localeCompare(b.dealDate) || a.price - b.price);
    const complexDeals = transactions.filter((candidate) => candidate.district === item.district && candidate.dong === item.dong && candidate.complex === item.complex);
    const previous = [...unitDeals].reverse().find((candidate) => candidate.dealDate < item.dealDate);
    const prices = unitDeals.map((candidate) => candidate.price);
    const areaTypes = [...new Set(complexDeals.map((candidate) => candidate.area))].sort((a, b) => a - b);
    return {
      unitDeals,
      chartDeals: unitDeals,
      recentDeals: [...unitDeals].reverse(),
      previous,
      previousChange: previous ? changeRate(item.price, previous.price) : null,
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / Math.max(prices.length, 1)),
      low: Math.min(...prices),
      high: Math.max(...prices),
      complexCount: complexDeals.length,
      areaTypes,
      months: [...new Set(transactions.map(deal => deal.dealDate.slice(0, 7)))].sort().reverse(),
    };
  }, [item, transactions]);
  const comparison = item ? compareContracts(transactions, item, compareMonth, compareArea) : null;
  const permitInfo = item?.permitInfo || null;

  return (
    <dialog className="detail-dialog" ref={ref} onClose={onClose} onClick={(event) => event.target === ref.current && onClose()}>
      {item && detail && (
        <article className="detail-panel">
          <header className="detail-header">
            <div><span className="kicker">APARTMENT LEDGER</span><h2>{item.complex}</h2><p>{item.address || `서울 ${item.district} ${item.dong}`}</p></div>
            <div className="detail-header-tags">{isRecord(item) && <Badge className="status-tag record" variant="weak" tone="critical">수집기간 최고가 경신</Badge>}{(item.permitZone || permitInfo) && <Badge className="status-tag permit" variant="weak" tone="warning">토허제</Badge>}</div>
            <button className="dialog-close" type="button" onClick={onClose} aria-label="상세 닫기">×</button>
          </header>

          <section className="detail-hero-ledger">
            <div className="detail-primary-price"><span>선택한 실거래</span><strong>{formatPrice(item.price)}</strong><p>{item.dealDate} 계약 · {formatHousingArea(item)} · {item.floor}층</p></div>
            <div className="detail-price-change"><span>직전 동일면적 거래 대비</span>{detail.previous ? <><strong className={detail.previousChange >= 0 ? "up" : "down"}>{signedRate(detail.previousChange)}</strong><small>{formatPrice(detail.previous.price)} · {detail.previous.dealDate}</small></> : <><strong>비교 없음</strong><small>이전 거래가 없습니다.</small></>}</div>
          </section>

          <section className="detail-metrics" aria-label="거래 핵심 지표">
            <Metric label="전용면적당 가격" value={formatPrice(Math.round(pricePerPyeong(item)))} note="전용 3.3058㎡당 · 공급평당가 아님" />
            <Metric label="동일면적 평균" value={formatPrice(detail.average)} note={`원장 내 ${detail.unitDeals.length}건`} />
            <Metric label="동일면적 기간 최고" value={formatPrice(detail.high)} note="수집 기간 기준 · 역대 최고 아님" tone="record-tone" />
            <Metric label="기존 최고가 대비" value={item.previousHigh ? signedRate(changeRate(item.price, item.previousHigh)) : "비교 없음"} note={item.previousHigh ? formatPrice(item.previousHigh) : "기존 최고가 없음"} tone={item.price >= item.previousHigh ? "record-tone" : "value-tone"} />
          </section>

          <section className="detail-comparison" aria-label="계약월별 가격 비교">
            <h3>계약월별 가격 비교</h3>
            <div className="detail-comparison-controls">
              <label>계약월<select value={compareMonth} onChange={event => setCompareMonth(event.target.value)}><option value="">수집 기간 전체</option>{detail.months.map(month => <option key={month} value={month}>{month}</option>)}</select></label>
              <label>면적<select value={compareArea} onChange={event => setCompareArea(event.target.value)}><option value="all">단지 전체 면적</option>{detail.areaTypes.map(area => <option key={area} value={area}>{formatHousingArea({ area })}</option>)}</select></label>
              <div><span>해제 제외 {comparison.count}건 평균</span><strong>{comparison.average === null ? "거래 없음" : formatPrice(comparison.average)}</strong></div>
            </div>
            <p>계약월 기준 산술평균 · 공급면적·타입 미연결 · 전체 면적 평균은 서로 다른 면적의 거래를 포함합니다.</p>
          </section>

          <div className="detail-content-grid">
            <section className="detail-section detail-trend-section"><div className="detail-section-head"><div><span>PRICE TRACE</span><h3>매매·전세 가격 추이</h3></div><p>저장 원장 전체 · 매매 {detail.chartDeals.length}건 · 전세 {rentDeals.length}건</p></div><TrendChart items={detail.chartDeals} rentItems={rentDeals} />{rentError && <p className="detail-rent-note">{rentError}</p>}</section>
            <section className="detail-section detail-facts-section">
              <div className="detail-section-head"><div><span>BUILDING FILE</span><h3>단지·거래 정보</h3></div></div>
              <dl className="detail-facts">
                <div><dt>준공연도</dt><dd>{item.builtYear ? `${item.builtYear}년` : "정보 없음"}</dd></div><div><dt>거래 방식</dt><dd>{item.dealingGbn || "정보 없음"}</dd></div><div><dt>동</dt><dd>{item.aptDong || "미기재"}</dd></div><div><dt>단지 거래</dt><dd>{detail.complexCount.toLocaleString("ko-KR")}건</dd></div><div><dt>확인 면적</dt><dd>{detail.areaTypes.length ? detail.areaTypes.map(area => formatHousingArea({ area })).join(" / ") : "정보 없음"}</dd></div><div><dt>동일면적 범위</dt><dd>{formatPrice(detail.low)} – {formatPrice(detail.high)}</dd></div><div><dt>가까운 역</dt><dd>{placeMeta?.station ? `${placeMeta.station.name} · 도보 약 ${placeMeta.station.estimatedWalkMinutes}분` : "정보 없음"}</dd></div>
              </dl>
            </section>
          </div>

          <section className="detail-section detail-history-section">
            <div className="detail-section-head"><div><span>RECENT CONTRACTS</span><h3>동일 면적 최근 거래 원장</h3></div><p>{formatHousingArea(item)} · 평당가는 전용면적 기준</p></div>
            {detail.recentDeals.length ? <div className="detail-history-table" role="table" aria-label="동일 면적 최근 거래"><div className="detail-history-head" role="row"><span>계약일</span><span>층</span><span>거래 방식</span><span>평당가</span><span>거래금액</span></div>{detail.recentDeals.map((deal) => <div className={`detail-history-row ${deal.id === item.id ? "selected" : ""}`} role="row" key={deal.id}><span data-label="계약일">{deal.dealDate}{deal.id === item.id && <i>선택</i>}</span><span data-label="층">{deal.floor}층</span><span data-label="거래 방식">{deal.dealingGbn || "-"}</span><span data-label="평당가">{formatPrice(Math.round(pricePerPyeong(deal)))}</span><strong data-label="거래금액">{formatPrice(deal.price)}</strong></div>)}</div> : <div className="detail-chart-empty"><p>표시할 거래 이력이 없습니다.</p></div>}
          </section>

          <aside className={`detail-permit-note ${permitInfo ? "is-confirmed" : item.permitZone ? "is-zone" : "is-guide"}`}>
            <span>LAND PERMIT</span>
            <div>
              {permitInfo ? <>
                <strong>서울시 허가 원장과 주소가 일치합니다 · {permitInfo.status || "처리결과 미기재"}</strong>
                <p>{permitInfo.permitDate || "허가일 미기재"} 허가 · {permitInfo.purpose || "이용목적 미기재"}{permitInfo.obligationEndDate ? ` · 이용 의무 ${permitInfo.obligationEndDate}까지` : ""}</p>
                <small>허가 주소: {permitInfo.address}</small>
              </> : item.permitZone ? <>
                <strong>{item.permitZone}</strong>
                <p>허가구역으로 매핑된 거래입니다. 실제 허가 상태와 이용 목적은 관할 구청 허가 원장에서 확인하세요.</p>
              </> : <>
                <strong>토지거래허가 여부 확인</strong>
                <p>이 거래의 주소와 계약일 기준 허가 상태는 서울시 허가 원장에서 별도로 확인할 수 있습니다.</p>
              </>}
            </div>
          </aside>
          {item.dealingGbn === "직거래" && <aside className="detail-direct-note"><span>DIRECT DEAL</span><div><strong>직거래 신고 건입니다.</strong><p>일반 중개 거래보다 가격 차이가 클 수 있으므로 시세 비교 시 거래 관계와 특수 조건을 함께 확인하세요.</p></div></aside>}
          <footer className="detail-source">국토교통부 · 계약일 기준 · 수집 계약월 {detail.months.slice().reverse().join(", ")} · 최고가와 직전 거래는 수집 기간 내 비교이며 역대 신고가가 아닙니다. 해제 거래는 제외됩니다. 공급면적 원본값이 없는 거래는 전용률 82.5%로 환산한 참고값이며 현재 매물 호가는 미연결입니다.</footer>
        </article>
      )}
    </dialog>
  );
}
