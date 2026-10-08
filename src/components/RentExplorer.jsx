import { useEffect, useMemo, useState } from "react";
import { fetchRentSummary, fetchRentTransactions, searchApartments } from "../services/estateApi";
import { formatHousingArea, formatPrice } from "../utils";
import { Empty, SectionHeader } from "./Common";
import { SEOUL_DISTRICTS } from "../data/districts";

const keyOf = item => `${item.district}|${item.dong}|${item.complex}`;

export default function RentExplorer({ onSelect }) {
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("전체");
  const [months] = useState(3);
  const [selected, setSelected] = useState(null);
  const [rentDeals, setRentDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [summaryError, setSummaryError] = useState("");
  const [apartments, setApartments] = useState([]);
  const [searching, setSearching] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    fetchRentSummary(controller.signal).then(setMetadata).catch(reason => setSummaryError(reason.message));
    return () => controller.abort();
  }, []);
  const districts = useMemo(() => ["전체", ...SEOUL_DISTRICTS], []);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true); setError("");
      searchApartments({ keyword, district, min: "", max: "", area: "0", built: "0", theme: "all", sort: "latest" }, 1, controller.signal)
        .then(payload => {
          const unique = new Map();
          for (const item of payload.data) if (!unique.has(keyOf(item))) unique.set(keyOf(item), item);
          setApartments([...unique.values()].slice(0, 12));
        })
        .catch(reason => { if (reason.name !== "AbortError") setError(reason.message); })
        .finally(() => { if (!controller.signal.aborted) setSearching(false); });
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [keyword, district]);

  async function loadRent(item, period = months) {
    setSelected(item); setLoading(true); setError(""); setRentDeals([]);
    try { const payload = await fetchRentTransactions({ district: item.district, dong: item.dong, complex: item.complex, months: period }); setRentDeals(payload.data ?? []); }
    catch (reason) { setError(reason.message || "전월세 원장을 불러오지 못했습니다."); }
    finally { setLoading(false); }
  }

  return <div className="rent-workspace">
    <section className="card rent-finder">
      <SectionHeader eyebrow="RENT FINDER" title="단지 전월세 조회" description="저장된 국토부 전월세 원장에서 단지별 계약을 바로 확인합니다." />
      <div className="rent-source-state" role="status"><i className={summaryError ? "warning" : ""} /><span>{metadata ? `${metadata.count.toLocaleString("ko-KR")}건 · 최신 계약 ${metadata.latestDealDate || "-"} · 수집 ${new Date(metadata.fetchedAt).toLocaleString("ko-KR")}` : summaryError ? summaryError : "전월세 원장 연결 중"}</span></div>
      <div className="rent-search-row"><label><span>단지명 · 동</span><input type="search" value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="예: 잠실엘스, 성수동" /></label><label><span>자치구</span><select value={district} onChange={event => setDistrict(event.target.value)}>{districts.map(value => <option key={value}>{value}</option>)}</select></label></div>
      <div className="rent-apartment-list">{apartments.map(item => <button className={selected && keyOf(selected) === keyOf(item) ? "on" : ""} type="button" key={keyOf(item)} onClick={() => loadRent(item)}><span><strong>{item.complex}</strong><small>{item.district} {item.dong}</small></span><span>{formatHousingArea(item)}<b>›</b></span></button>)}</div>
      {searching && <div className="rent-state">저장된 거래 단지를 검색하고 있습니다.</div>}
      {!searching && !apartments.length && <Empty>검색 조건에 맞는 실제 거래 단지가 없습니다.</Empty>}
    </section>
    <section className="card rent-ledger">
      <div className="rent-ledger-head"><div><span>RENT LEDGER</span><h2>{selected ? selected.complex : "조회할 단지를 선택하세요"}</h2><p>{selected ? `${selected.district} ${selected.dong} · 매매 상세와 함께 비교할 수 있습니다.` : "왼쪽 검색 결과에서 단지를 고르면 전세와 월세 계약이 표시됩니다."}</p></div><span className="rent-period">최근 3개월</span></div>
      {loading && <div className="rent-state">저장된 전월세 계약을 확인하고 있습니다.</div>}
      {error && <div className="rent-state error"><strong>전월세 데이터를 불러오지 못했습니다.</strong><span>{error}</span></div>}
      {!loading && !error && selected && <>{rentDeals.length ? <div className="rent-deal-list"><div className="rent-deal-head"><span>계약일</span><span>면적·층</span><span>구분</span><span>보증금</span><span>월세</span></div>{rentDeals.map(item => <div className="rent-deal-row" key={item.id}><span>{item.dealDate}</span><span>{formatHousingArea(item)} · {item.floor || "-"}층</span><span>{item.monthlyRent ? "월세" : "전세"}</span><strong>{formatPrice(item.deposit)}</strong><strong>{item.monthlyRent ? `${item.monthlyRent.toLocaleString("ko-KR")}만` : "-"}</strong></div>)}</div> : <Empty>선택한 기간에 신고된 전월세 계약이 없습니다.</Empty>}<button className="rent-sale-detail" type="button" onClick={() => onSelect?.(selected)}>매매·전세 가격 추이 보기</button></>}
      {!selected && <div className="rent-state empty"><span>단지를 선택하면 저장된 실제 전월세 계약을 조회합니다.</span></div>}
    </section>
  </div>;
}
