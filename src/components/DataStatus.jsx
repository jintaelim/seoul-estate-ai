import RefreshButton from "./RefreshButton";

export default function DataStatus({ metadata, loading, refreshing, refreshedAt, error, retry }) {
  const syncing = loading || refreshing;
  const basis = metadata?.dateBasis === "permit" ? "허가일" : "계약일";
  const collectedAt = metadata?.fetchedAt ? new Date(metadata.fetchedAt) : null;
  const dateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });
  const today = dateFormatter.format(new Date());
  const collectedToday = collectedAt && dateFormatter.format(collectedAt) === today;
  const collectedLabel = collectedAt ? collectedAt.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul", month: "numeric", day: "numeric", hour: "numeric", minute: "2-digit",
  }) : "-";
  const sourceLag = metadata?.latestDealDate && metadata.latestDealDate < today;
  return <section className={`data-status data-status-compact ${syncing ? "syncing" : ""}`} aria-label="데이터 수집 상태" aria-busy={syncing}>
    <div className="data-status-primary"><i className={syncing ? "syncing" : error ? "warning" : ""} /><span><strong>{loading ? "저장 원장 연결 중" : error ? "데이터 연결 확인 필요" : refreshing ? "저장 원장 다시 확인 중" : metadata ? `공공 원장 연결${collectedToday ? " · 오늘 수집" : ""}` : "연결 대기"}</strong><small>{refreshing ? "현재 화면을 유지하며 DB에 저장된 원장을 확인합니다" : metadata ? `${metadata.count.toLocaleString("ko-KR")}건 · 최신 ${basis} ${metadata.latestDealDate || "-"} · 수집 ${collectedLabel}${sourceLag ? " · 신고 시차" : ""}` : "서울 25개 자치구"}</small></span></div>
    {metadata && <details><summary>수집 정보</summary><div><span>수집 {new Date(metadata.fetchedAt).toLocaleString("ko-KR")}</span><span>{basis} 기준 · 신고 등록일 미제공</span><span>{metadata.coverage?.succeeded}/{metadata.coverage?.requested}개 지역·월 · {metadata.coverage?.complete ? "전체 완료" : "일부 누락"}</span><span>{metadata.persistence?.persisted ? "DB 저장 완료" : metadata.persistence?.local ? "로컬 저장 완료" : "저장 미완료"}</span></div></details>}
    <RefreshButton loading={syncing} refreshedAt={refreshedAt} onClick={retry} label="원장 다시 확인" />
  </section>;
}
