import { useEffect, useMemo, useRef } from "react";
import { formatPrice, isRecord, pricePerPyeong, pyeong } from "../utils";

const sameUnit = (candidate, item) => candidate.district === item.district
  && candidate.complex === item.complex
  && Math.abs(candidate.area - item.area) < 1;

const changeRate = (current, previous) => previous ? ((current / previous) - 1) * 100 : 0;
const signedRate = (rate) => `${rate > 0 ? "+" : ""}${rate.toFixed(1)}%`;

function TrendChart({ items }) {
  if (items.length < 2) {
    return <div className="detail-chart-empty"><span>—</span><p>동일 면적 거래가 더 쌓이면 가격 추이를 보여드립니다.</p></div>;
  }

  const width = 640;
  const height = 190;
  const padX = 10;
  const padY = 18;
  const prices = items.map((entry) => entry.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = Math.max(max - min, 1);
  const points = items.map((entry, index) => ({
    ...entry,
    x: padX + (index / (items.length - 1)) * (width - padX * 2),
    y: padY + ((max - entry.price) / range) * (height - padY * 2),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padX},${height - padY} ${line} ${width - padX},${height - padY}`;

  return (
    <div className="detail-chart-wrap">
      <div className="detail-chart-scale"><span>{formatPrice(max)}</span><span>{formatPrice(min)}</span></div>
      <svg className="detail-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${items.length}건의 동일 면적 실거래 가격 추이`}>
        <defs><linearGradient id="transactionArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1769e0" stopOpacity=".2" /><stop offset="100%" stopColor="#1769e0" stopOpacity="0" /></linearGradient></defs>
        <line className="detail-chart-guide" x1="10" y1="18" x2="630" y2="18" />
        <line className="detail-chart-guide" x1="10" y1="95" x2="630" y2="95" />
        <line className="detail-chart-guide" x1="10" y1="172" x2="630" y2="172" />
        <polygon points={area} fill="url(#transactionArea)" />
        <polyline className="detail-chart-line" points={line} />
        {points.map((point, index) => <circle className={index === points.length - 1 ? "latest" : ""} cx={point.x} cy={point.y} r={index === points.length - 1 ? 5 : 3} key={point.id} />)}
      </svg>
      <div className="detail-chart-dates"><span>{items[0].dealDate}</span><span>{items.at(-1).dealDate}</span></div>
    </div>
  );
}

function Metric({ label, value, note, tone = "" }) {
  return <div className={`detail-metric ${tone}`}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

export default function TransactionDialog({ item, transactions, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
  }, [item]);

  const detail = useMemo(() => {
    if (!item) return null;
    const unitDeals = transactions.filter((candidate) => sameUnit(candidate, item)).sort((a, b) => a.dealDate.localeCompare(b.dealDate) || a.price - b.price);
    const complexDeals = transactions.filter((candidate) => candidate.district === item.district && candidate.complex === item.complex);
    const previous = [...unitDeals].reverse().find((candidate) => candidate.id !== item.id && candidate.dealDate <= item.dealDate);
    const prices = unitDeals.map((candidate) => candidate.price);
    const areaTypes = [...new Set(complexDeals.map((candidate) => Math.round(candidate.area)))].sort((a, b) => a - b);
    return {
      unitDeals,
      chartDeals: unitDeals.slice(-18),
      recentDeals: [...unitDeals].reverse().slice(0, 8),
      previous,
      previousChange: previous ? changeRate(item.price, previous.price) : null,
      average: Math.round(prices.reduce((sum, price) => sum + price, 0) / Math.max(prices.length, 1)),
      low: Math.min(...prices),
      high: Math.max(...prices),
      complexCount: complexDeals.length,
      areaTypes,
    };
  }, [item, transactions]);

  return (
    <dialog className="detail-dialog" ref={ref} onClose={onClose} onClick={(event) => event.target === ref.current && onClose()}>
      {item && detail && (
        <article className="detail-panel">
          <header className="detail-header">
            <div><span className="kicker">APARTMENT LEDGER</span><h2>{item.complex}</h2><p>{item.address || `서울 ${item.district} ${item.dong}`}</p></div>
            <div className="detail-header-tags">{isRecord(item) && <span className="status-tag record">신고가</span>}{item.permitZone && <span className="status-tag permit">토허구역</span>}</div>
            <button className="dialog-close" type="button" onClick={onClose} aria-label="상세 닫기">×</button>
          </header>

          <section className="detail-hero-ledger">
            <div className="detail-primary-price"><span>선택한 실거래</span><strong>{formatPrice(item.price)}</strong><p>{item.dealDate} 계약 · 전용 {item.area.toFixed(2)}㎡ ({pyeong(item.area).toFixed(1)}평) · {item.floor}층</p></div>
            <div className="detail-price-change"><span>직전 동일면적 거래 대비</span>{detail.previous ? <><strong className={detail.previousChange >= 0 ? "up" : "down"}>{signedRate(detail.previousChange)}</strong><small>{formatPrice(detail.previous.price)} · {detail.previous.dealDate}</small></> : <><strong>비교 없음</strong><small>이전 거래가 없습니다.</small></>}</div>
          </section>

          <section className="detail-metrics" aria-label="거래 핵심 지표">
            <Metric label="평당가" value={formatPrice(Math.round(pricePerPyeong(item)))} note="3.3㎡ 기준" />
            <Metric label="동일면적 평균" value={formatPrice(detail.average)} note={`원장 내 ${detail.unitDeals.length}건`} />
            <Metric label="동일면적 최고" value={formatPrice(detail.high)} note={item.price === detail.high ? "현재 최고가" : "원장 기준"} tone="record-tone" />
            <Metric label="기존 최고가 대비" value={item.previousHigh ? signedRate(changeRate(item.price, item.previousHigh)) : "비교 없음"} note={item.previousHigh ? formatPrice(item.previousHigh) : "기존 최고가 없음"} tone={item.price >= item.previousHigh ? "record-tone" : "value-tone"} />
          </section>

          <div className="detail-content-grid">
            <section className="detail-section detail-trend-section"><div className="detail-section-head"><div><span>PRICE TRACE</span><h3>동일 면적 가격 추이</h3></div><p>최근 {detail.chartDeals.length}건</p></div><TrendChart items={detail.chartDeals} /></section>
            <section className="detail-section detail-facts-section">
              <div className="detail-section-head"><div><span>BUILDING FILE</span><h3>단지·거래 정보</h3></div></div>
              <dl className="detail-facts">
                <div><dt>준공연도</dt><dd>{item.builtYear ? `${item.builtYear}년` : "정보 없음"}</dd></div><div><dt>거래 방식</dt><dd>{item.dealingGbn || "정보 없음"}</dd></div><div><dt>동</dt><dd>{item.aptDong || "미기재"}</dd></div><div><dt>단지 거래</dt><dd>{detail.complexCount.toLocaleString("ko-KR")}건</dd></div><div><dt>확인 면적</dt><dd>{detail.areaTypes.length ? detail.areaTypes.map((area) => `${area}㎡`).join(" · ") : "정보 없음"}</dd></div><div><dt>동일면적 범위</dt><dd>{formatPrice(detail.low)} – {formatPrice(detail.high)}</dd></div>
              </dl>
            </section>
          </div>

          <section className="detail-section detail-history-section">
            <div className="detail-section-head"><div><span>RECENT CONTRACTS</span><h3>동일 면적 최근 거래 원장</h3></div><p>전용 {Math.round(item.area)}㎡ 기준</p></div>
            {detail.recentDeals.length ? <div className="detail-history-table" role="table" aria-label="동일 면적 최근 거래"><div className="detail-history-head" role="row"><span>계약일</span><span>층</span><span>거래 방식</span><span>평당가</span><span>거래금액</span></div>{detail.recentDeals.map((deal) => <div className={`detail-history-row ${deal.id === item.id ? "selected" : ""}`} role="row" key={deal.id}><span data-label="계약일">{deal.dealDate}{deal.id === item.id && <i>선택</i>}</span><span data-label="층">{deal.floor}층</span><span data-label="거래 방식">{deal.dealingGbn || "-"}</span><span data-label="평당가">{formatPrice(Math.round(pricePerPyeong(deal)))}</span><strong data-label="거래금액">{formatPrice(deal.price)}</strong></div>)}</div> : <div className="detail-chart-empty"><p>표시할 거래 이력이 없습니다.</p></div>}
          </section>

          {item.permitZone && <aside className="detail-permit-note"><span>LAND PERMIT</span><div><strong>{item.permitZone}</strong><p>허가구역 내 신고된 거래입니다. 실제 허가 상태와 이용 목적은 관할 구청 자료를 함께 확인하세요.</p></div></aside>}
          {item.dealingGbn === "직거래" && <aside className="detail-direct-note"><span>DIRECT DEAL</span><div><strong>직거래 신고 건입니다.</strong><p>일반 중개 거래보다 가격 차이가 클 수 있으므로 시세 비교 시 거래 관계와 특수 조건을 함께 확인하세요.</p></div></aside>}
          <footer className="detail-source">국토교통부 실거래가 공개시스템 신고 자료 기준 · 해제 거래 및 정정 신고는 원문에서 최종 확인하세요.</footer>
        </article>
      )}
    </dialog>
  );
}
