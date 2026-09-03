import { useEffect, useMemo, useState } from "react";
import { fetchCandidates } from "../services/estateApi";
import { formatPrice } from "../utils";
import { SectionHeader } from "./Common";

const filterLabels = [["all", "전체"], ["tier1", "1티어"], ["tier2", "2티어"], ["watch", "관찰"], ["matched", "거래 있음"]];

export default function CandidateWatchlist() {
  const [months, setMonths] = useState(12);
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState({ items: [], loading: true, error: "", fetchedAt: null });
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: "" }));
    fetchCandidates(months, controller.signal)
      .then((payload) => setState({ items: payload.data ?? [], loading: false, error: "", fetchedAt: payload.fetchedAt }))
      .catch((error) => error.name !== "AbortError" && setState({ items: [], loading: false, error: error.message, fetchedAt: null }));
    return () => controller.abort();
  }, [months, refreshKey]);

  const filtered = useMemo(() => state.items.filter(({ candidate, summary }) => {
    if (filter === "tier1") return candidate.tier === "1티어";
    if (filter === "tier2") return candidate.tier === "2티어";
    if (filter === "watch") return candidate.grade === "관찰" || candidate.tier === "관찰";
    if (filter === "matched") return summary.transactionCount > 0;
    return true;
  }), [state.items, filter]);
  const matched = state.items.filter((item) => item.summary.transactionCount > 0).length;
  const txCount = state.items.reduce((sum, item) => sum + item.summary.transactionCount, 0);

  return (
    <section className="card" id="candidateWatch">
      <SectionHeader eyebrow="MOVE-UP WATCHLIST" title="갈아타기 후보 실거래" description={`${months}개월 범위에서 후보 단지명과 국토부 원장을 매칭합니다.`} action={<div className="candidate-actions"><select className="candidate-select" value={months} onChange={(event) => setMonths(Number(event.target.value))}><option value="12">최근 12개월</option><option value="36">최근 36개월</option><option value="60">최근 60개월</option><option value="120">최근 120개월</option></select><button className="tsearch" type="button" onClick={() => setRefreshKey((key) => key + 1)}>새로고침</button></div>} />
      <div className="candidate-stats">
        <div className="candidate-stat"><span>후보 단지</span><strong>{state.items.length}개</strong></div>
        <div className="candidate-stat"><span>거래 매칭</span><strong>{matched}개</strong></div>
        <div className="candidate-stat"><span>실거래 원장</span><strong>{txCount.toLocaleString("ko-KR")}건</strong></div>
        <div className="candidate-stat"><span>조회 상태</span><strong>{state.loading ? "조회 중" : state.error ? "연결 실패" : "완료"}</strong></div>
      </div>
      <div className="rpills candidate-tabs">{filterLabels.map(([key, label]) => <button className={`rpill ${filter === key ? "on" : ""}`} type="button" key={key} onClick={() => setFilter(key)}>{label}</button>)}</div>
      <div className="candidate-list">
        {state.loading && <div className="candidate-empty">후보 단지 실거래를 불러오는 중입니다.</div>}
        {state.error && <div className="candidate-empty">{state.error}<br />API 서버가 실행 중인지 확인하세요.</div>}
        {!state.loading && !state.error && !filtered.length && <div className="candidate-empty">현재 필터에 해당하는 후보가 없습니다.</div>}
        {filtered.map(({ candidate, summary, transactions }) => {
          const open = openId === candidate.id;
          return (
            <div className="candidate-entry" key={candidate.id}>
              <button className={`candidate-row ${open ? "open" : ""}`} type="button" onClick={() => setOpenId(open ? null : candidate.id)}>
                <span className="candidate-rank">{candidate.priority ? `${candidate.priority}위` : candidate.grade}</span>
                <span><span className="candidate-name">{candidate.name}</span><span className="candidate-meta">{[candidate.district, candidate.dongs?.[0], candidate.station].filter(Boolean).join(" · ")}</span><span className="candidate-chipline">{[candidate.grade, candidate.tier, candidate.targetPrice].filter(Boolean).map((chip) => <span className="candidate-chip" key={chip}>{chip}</span>)}</span></span>
                <span className="candidate-price">{summary.latest ? formatPrice(summary.latest.price) : "거래 없음"}</span>
                <span className="candidate-count">{summary.transactionCount}건</span>
                <span className="candidate-date">{summary.latest?.dealDate ?? "-"}</span>
              </button>
              {open && <CandidateDetail candidate={candidate} summary={summary} transactions={transactions} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CandidateDetail({ candidate, summary, transactions }) {
  return (
    <div className="candidate-detail-inline">
      <div className="candidate-info-grid">
        <Info label="API 매칭 단지명" value={summary.matchedComplexNames.join(", ") || "-"} />
        <Info label="주소" value={summary.addresses[0] || `${candidate.district} ${candidate.dongs?.[0] ?? ""}`} />
        <Info label="준공/세대" value={`${summary.builtYear || "-"}년${candidate.households ? ` · ${candidate.households.toLocaleString("ko-KR")}세대` : ""}`} />
        <Info label="중앙값" value={summary.medianPrice ? formatPrice(summary.medianPrice) : "-"} />
      </div>
      <div className="candidate-tx-list">
        {transactions.slice(0, 20).map((tx) => <div className="candidate-tx-row" key={tx.id}><span>{tx.dealDate}</span><span>{tx.complex}</span><span className="muted">{tx.area.toFixed(2)}㎡</span><span className="muted">{tx.floor}층</span><strong>{formatPrice(tx.price)}</strong></div>)}
        {!transactions.length && <div className="candidate-empty">조회 범위에 매칭된 실거래가 없습니다.</div>}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="candidate-info"><span>{label}</span><strong>{value}</strong></div>;
}
