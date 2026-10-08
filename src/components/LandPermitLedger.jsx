import { useMemo, useState } from "react";
import { Callout } from "@seed-design/react";
import PageHeader from "./PageHeader";
import { Empty, SectionHeader } from "./Common";
import { useLandPermits } from "../hooks/useLandPermits";
import MarketDataNav from "./MarketDataNav";
import RefreshButton from "./RefreshButton";

const shiftDate = (value, amount) => {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};
const dateParts = value => {
  const date = new Date(`${value}T00:00:00Z`);
  return { day: String(date.getUTCDate()).padStart(2, "0"), month: date.getUTCMonth() + 1, weekday: new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(date) };
};

export default function LandPermitLedger({ onSelect }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [district, setDistrict] = useState("전체");
  const [status, setStatus] = useState("허가");
  const { permits, metadata, loading, refreshing, refreshedAt, error, retry } = useLandPermits(selectedDate, district, status);
  const latest = metadata?.latestDate || "";
  const date = selectedDate || latest;
  const dates = latest ? Array.from({ length: 14 }, (_, index) => shiftDate(latest, index - 13)) : [];
  const districts = useMemo(() => [...new Set(metadata?.groups?.map(item => item.district) || [])].sort(), [metadata]);
  const statuses = useMemo(() => [...new Set(metadata?.groups?.map(item => item.status) || [])].filter(Boolean).sort(), [metadata]);
  const visible = permits
    .filter(item => item.permitDate === date && (district === "전체" || item.district === district) && (status === "전체" || item.status === status))
    .map(item => ({ ...item, matches: item.matches || [] }));
  const grouped = Object.entries(visible.reduce((result, item) => { (result[item.district] ??= []).push(item); return result; }, {})).sort(([a], [b]) => a.localeCompare(b));
  const countDate = value => (metadata?.groups || []).filter(item => item.date === value && (district === "전체" || item.district === district) && (status === "전체" || item.status === status)).reduce((sum, item) => sum + item.count, 0);

  return <main className="main route-page">
    <PageHeader eyebrow="MARKET DATA" title="토지거래허가 원장" description="허가일별 처리 내역을 자치구와 이용목적별로 확인합니다." meta={metadata ? `${metadata.count.toLocaleString("ko-KR")}건 · 최근 62일` : "서울시 공식 원장"} metaLabel="공개 허가원장" sourceLabel="서울시·K-Geo · 허가일 기준" />
    <MarketDataNav />
    {error && <Callout.Root className="data-callout" tone="warning"><Callout.Content><Callout.Title>{metadata ? "마지막으로 저장된 허가 원장을 표시합니다" : "허가 원장을 불러오지 못했어요"}</Callout.Title><Callout.Description>{error} 목업 데이터는 표시하지 않습니다.</Callout.Description></Callout.Content><Callout.Link onClick={retry}>다시 조회</Callout.Link></Callout.Root>}
    <section className="card permit-section permit-ledger">
      <SectionHeader eyebrow="PERMIT DATE" title="허가일별 토지거래허가" description="허가일 → 자치구 → 개별 허가내역" action={<RefreshButton className="permit-refresh" loading={loading || refreshing} refreshedAt={refreshedAt} onClick={retry} label="원장 새로고침" />} />
      <div className={`permit-sync-state ${loading || refreshing ? "syncing" : ""}`} role="status" aria-live="polite">
        <i aria-hidden="true" />
        <span>{loading ? "허가 내역을 불러오고 있습니다" : refreshing ? "저장된 최신 원장을 확인하고 있습니다" : metadata ? `${metadata.count.toLocaleString("ko-KR")}건 · 수집 ${new Date(metadata.fetchedAt).toLocaleString("ko-KR")}${metadata.stale ? " · 갱신 대기" : ""}` : "서울시 허가 원장 연결 대기"}</span>
      </div>
      <div className="permit-controls">
        <label>자치구<select value={district} onChange={event => setDistrict(event.target.value)}><option>전체</option>{districts.map(value => <option key={value}>{value}</option>)}</select></label>
        <div className="permit-status-tabs" aria-label="처리결과 선택"><button className={status === "전체" ? "on" : ""} onClick={() => setStatus("전체")} type="button">전체</button>{statuses.map(value => <button className={status === value ? "on" : ""} onClick={() => setStatus(value)} type="button" key={value}>{value}</button>)}</div>
      </div>
      <div className="permit-date-strip" aria-label="허가일 선택">{dates.map(value => { const label = dateParts(value); const count = countDate(value); return <button className={`${date === value ? "on" : ""} ${count ? "has-data" : "empty-date"}`} type="button" key={value} onClick={() => setSelectedDate(value)}><small>{label.weekday}</small><strong>{label.day}</strong><i>{label.month}월</i><span className="permit-date-count">{count}건</span></button>; })}</div>
      <div className="permit-filter-state"><span>현재 기준</span><strong>{date || "조회 대기"} 허가일</strong><i>·</i><strong>{district === "전체" ? "서울 전체" : district}</strong><i>·</i><strong>{status === "전체" ? "모든 처리결과" : status}</strong><i>·</i><strong>{visible.length.toLocaleString("ko-KR")}건</strong></div>
      <p className="permit-source-note">서울부동산정보광장·국토부 K-Geo 연계 자료입니다. 허가 원장의 대표 지번과 국토부 실거래 원장의 지번이 정확히 일치할 때만 단지명을 표시합니다.</p>
      <div className="permit-groups">{loading && !permits.length ? <div className="permit-loading-list" aria-hidden="true"><i /><i /><i /></div> : grouped.length ? grouped.map(([name, items]) => <section className="permit-district-group" key={name}><header><div><small>자치구</small><strong>{name}</strong></div><span>{items.length}건</span></header><div className="permit-record-list">{items.map(item => <article className="permit-record" key={item.id}><div className="permit-record-main"><div className="permit-complex-line">{item.matches.length ? <div className="permit-complex-actions">{item.matches.map(match => <button type="button" key={match.complex} onClick={() => onSelect?.({ ...match, permitInfo: item })} aria-label={`${match.complex} 단지 정보 보기`}><strong>{match.complex}</strong><span aria-hidden="true">›</span></button>)}</div> : <strong>단지명 확인 불가</strong>}<small className={item.matches.length ? "matched" : ""}>{item.matches.length ? "거래·허가 상세 보기" : "대표 지번만 제공"}</small></div><span className="permit-address">{item.address}</span><span>{item.landCategory || "지목 미기재"} · {item.purpose || "이용목적 미기재"}</span></div><div><b className={`permit-result ${item.status === "허가" ? "approved" : ""}`}>{item.status || "처리결과 미기재"}</b><span>{item.permitDate}</span></div></article>)}</div></section>) : <Empty>선택한 허가일과 조건에 해당하는 실제 허가 내역이 없습니다.</Empty>}</div>
    </section>
  </main>;
}
