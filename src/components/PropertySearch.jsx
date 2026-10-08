import { useEffect, useMemo, useState } from "react";
import { ActionButton, Chip } from "@seed-design/react";
import { formatHousingArea, formatPrice, isRecord, latestDate, pricePerPyeong, representativeTransactions } from "../utils";
import { SectionHeader } from "./Common";
import { SeedSelect, SeedTextInput } from "./SeedFormControls";
import { SEOUL_DISTRICTS } from "../data/districts";
import { searchApartments } from "../services/estateApi";

const STORAGE_KEY = "seoul-estate-move-up-candidates";
const candidateKey = item => `${item.district}|${item.dong}|${item.complex}`;
const themes = [["all", "전체"], ["latest", "최근 계약"], ["rent", "전세 확인"], ["record", "신고가"], ["active", "거래 활발"], ["value", "고점 아래"]];
const defaults = { keyword: "", district: "전체", min: "", max: "", area: "0", built: "0", households: "0", rooms: "0", far: "0", sort: "latest", theme: "all" };

export default function PropertySearch({ transactions, source, initialBudget, onSelect, remote = false }) {
  const [filters, setFilters] = useState(defaults);
  const [advanced, setAdvanced] = useState(true);
  const [limit, setLimit] = useState(10);
  const [notice, setNotice] = useState("");
  const [remoteRows, setRemoteRows] = useState([]);
  const [remoteTotal, setRemoteTotal] = useState(0);
  const [remotePage, setRemotePage] = useState(1);
  const [remoteMore, setRemoteMore] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(remote);
  const [remoteError, setRemoteError] = useState("");
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; } });
  useEffect(() => {
    setFilters({ ...defaults, district: initialBudget?.district || "전체", min: initialBudget?.min || "", area: initialBudget?.area || "0", built: initialBudget?.built || "0", max: initialBudget?.budget ? String(initialBudget.budget / 10000) : "" });
    setAdvanced(true); setLimit(10);
  }, [initialBudget?.key]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }, [saved]);
  useEffect(() => {
    if (!remote) return undefined;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setRemoteLoading(true); setRemoteError("");
      searchApartments(filters, 1, controller.signal).then(payload => {
        setRemoteRows(payload.data); setRemoteTotal(payload.totalCount); setRemotePage(1); setRemoteMore(payload.hasMore);
      }).catch(error => { if (error.name !== "AbortError") setRemoteError(error.message); })
        .finally(() => { if (!controller.signal.aborted) setRemoteLoading(false); });
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [remote, filters]);
  const districts = useMemo(() => remote ? ["전체", ...SEOUL_DISTRICTS] : ["전체", ...new Set(transactions.map(item => item.district))], [remote, transactions]);
  const savedKeys = useMemo(() => new Set(saved.map(candidateKey)), [saved]);
  const update = key => event => { setFilters(current => ({ ...current, [key]: event.target.value })); setLimit(10); };
  const updateValue = key => value => { setFilters(current => ({ ...current, [key]: value })); setLimit(10); };
  const localRows = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase(); const latest = latestDate(transactions); const min = Number(filters.min || 0) * 10000; const max = Number(filters.max || 0) * 10000;
    return representativeTransactions(transactions).filter(item => {
      if (keyword && !`${item.district} ${item.dong} ${item.complex}`.toLowerCase().includes(keyword)) return false;
      if (filters.district !== "전체" && item.district !== filters.district) return false;
      const built = Number(filters.built || 0);
      const minHouseholds = Number(filters.households || 0);
      const minRooms = Number(filters.rooms || 0);
      const maxFar = Number(filters.far || 0);
      if ((min && item.price < min) || (max && item.price > max) || item.area < Number(filters.area) || (built && item.builtYear < built) || (filters.built === "before2010" && item.builtYear >= 2010) || (minHouseholds && (!item.households || item.households < minHouseholds)) || (minRooms && (!item.rooms || item.rooms < minRooms)) || (filters.far !== "0" && (filters.far === "301" ? (!item.floorAreaRatio || item.floorAreaRatio <= 300) : (!item.floorAreaRatio || item.floorAreaRatio > maxFar)))) return false;
      if (filters.theme === "latest" && item.dealDate !== latest) return false;
      if (filters.theme === "rent" && !item.latestJeonse) return false;
      if (filters.theme === "record" && !isRecord(item)) return false;
      if (filters.theme === "active" && item.recentCount < 7) return false;
      if (filters.theme === "value" && (!item.previousHigh || item.price >= item.previousHigh)) return false;
      return true;
    }).sort((a, b) => filters.sort === "priceAsc" ? a.price - b.price : filters.sort === "priceDesc" ? b.price - a.price : filters.sort === "activity" ? b.recentCount - a.recentCount : b.dealDate.localeCompare(a.dealDate) || b.price - a.price);
  }, [transactions, filters]);
  const rows = remote ? remoteRows : localRows;
  const total = remote ? remoteTotal : rows.length;
  const average = rows.length ? Math.round(rows.reduce((sum, item) => sum + item.price, 0) / rows.length) : 0;
  function loadMore() {
    if (!remote) { setLimit(value => value + 10); return; }
    if (remoteLoading || !remoteMore) return;
    const nextPage = remotePage + 1;
    setRemoteLoading(true); setRemoteError("");
    searchApartments(filters, nextPage).then(payload => {
      setRemoteRows(current => [...current, ...payload.data]); setRemotePage(nextPage); setRemoteMore(payload.hasMore);
    }).catch(error => setRemoteError(error.message)).finally(() => setRemoteLoading(false));
  }
  function toggleSaved(item) {
    const key = candidateKey(item);
    if (savedKeys.has(key)) { setSaved(current => current.filter(entry => candidateKey(entry) !== key)); setNotice(`${item.complex}을 저장 목록에서 뺐습니다.`); }
    else if (saved.length >= 5) setNotice("비교 후보는 최대 5개까지 저장할 수 있습니다.");
    else { setSaved(current => [...current, item]); setNotice(`${item.complex}을 비교 후보로 저장했습니다.`); }
  }
  const activeCount = [filters.district !== "전체", filters.min, filters.max, filters.area !== "0", filters.built !== "0", filters.households !== "0", filters.rooms !== "0", filters.far !== "0"].filter(Boolean).length;

  return <section className="card property-search-card property-search-focused" id="propertySearch">
    <SectionHeader eyebrow="APARTMENT FINDER" title="아파트 찾기" description="단지명이나 지역으로 시작하고, 필요할 때 예산과 주택 조건을 더하세요." action={<span className={`source-pill ${remoteLoading ? "loading" : source}`}><i />{remoteLoading ? "검색 중" : source === "molit" ? "국토부 실데이터" : source === "cache" ? "저장 원장" : source === "loading" ? "데이터 확인 중" : "연결 대기"}</span>} />
    <div className="finder-primary"><SeedTextInput label="단지명 · 지역" type="search" placeholder="예: 잠실엘스, 성수동, 마포구" value={filters.keyword} onChange={update("keyword")} /><SeedSelect label="자치구" value={filters.district} onChange={updateValue("district")} options={districts} /><button className="on" type="button" disabled aria-expanded="true">상세 조건{activeCount ? ` ${activeCount}` : ""}</button></div>
    {advanced && <div className="finder-advanced"><SeedTextInput label="최소 거래가" type="number" min="0" placeholder="0" suffix="억" value={filters.min} onChange={update("min")} /><SeedTextInput label="최대 거래가" type="number" min="0" placeholder="제한 없음" suffix="억" value={filters.max} onChange={update("max")} /><SeedSelect label="전용면적" value={filters.area} onChange={updateValue("area")} options={[{ value: "0", label: "전체" }, { value: "59", label: "59㎡ 이상" }, { value: "84", label: "84㎡ 이상" }, { value: "114", label: "114㎡ 이상" }]} /><SeedSelect label="준공일" value={filters.built} onChange={updateValue("built")} options={[{ value: "0", label: "전체" }, { value: "before2010", label: "2010년 이전" }, { value: "2010", label: "2010년 이후" }, { value: "2015", label: "2015년 이후" }, { value: "2020", label: "2020년 이후" }]} /><SeedSelect label="단지 세대" value={filters.households} onChange={updateValue("households")} options={[{ value: "0", label: "전체" }, { value: "300", label: "300세대 이상" }, { value: "500", label: "500세대 이상" }, { value: "1000", label: "1000세대 이상" }]} /><SeedSelect label="방 개수" value={filters.rooms} onChange={updateValue("rooms")} options={[{ value: "0", label: "전체" }, { value: "1", label: "1개 이상" }, { value: "2", label: "2개 이상" }, { value: "3", label: "3개 이상" }, { value: "4", label: "4개 이상" }]} /><SeedSelect label="용적률" value={filters.far} onChange={updateValue("far")} options={[{ value: "0", label: "전체" }, { value: "150", label: "150% 이하" }, { value: "200", label: "200% 이하" }, { value: "300", label: "300% 이하" }, { value: "301", label: "300% 초과" }]} /><SeedSelect label="정렬" value={filters.sort} onChange={updateValue("sort")} options={[{ value: "latest", label: "최신 거래순" }, { value: "priceDesc", label: "가격 높은순" }, { value: "priceAsc", label: "가격 낮은순" }, { value: "activity", label: "거래 많은순" }]} /></div>}
    <div className="search-tool-row"><div className="listing-theme-row">{themes.map(([key, label]) => <Chip.Root className={`rpill ${filters.theme === key ? "on" : ""}`} variant={filters.theme === key ? "solid" : "outlineWeak"} size="small" type="button" key={key} onClick={() => { setFilters(current => ({ ...current, theme: key })); setLimit(10); }}><Chip.Label>{label}</Chip.Label></Chip.Root>)}</div><ActionButton className="filter-reset" variant="ghost" size="xsmall" type="button" onClick={() => { setFilters(defaults); setLimit(10); setAdvanced(true); }}>초기화</ActionButton></div>
    {(notice || remoteError) && <p className="finder-notice" role="status">{remoteError || notice}</p>}
    <div className="search-summary"><p><strong>{total.toLocaleString("ko-KR")}</strong>개 단지·면적</p><span>{rows.length.toLocaleString("ko-KR")}개 표시 · 표시 결과 평균 {formatPrice(average)} · 저장한 후보 {saved.length}/5</span></div>
    <p className="finder-data-scope">국토교통부 신고 계약 기준입니다. 현재 판매 중인 매물과 호가는 포함하지 않습니다.</p>
    <div className="finder-results-head" role="row" aria-label="검색 결과 열 제목"><div><span role="columnheader">단지</span><span role="columnheader">면적</span><span role="columnheader">전세 금액</span><span role="columnheader">매매 계약 금액</span></div><span role="columnheader">저장</span></div>
    <div className="finder-results" aria-label="아파트 검색 결과">{rows.slice(0, remote ? rows.length : limit).map(item => { const isSaved = savedKeys.has(candidateKey(item)); return <article className="finder-result" key={item.id}><button className="finder-result-main" type="button" onClick={() => onSelect(item)}><span className="complex-cell"><strong>{item.complex}</strong><small>{item.district} {item.dong} · {item.builtYear || "-"}년</small><span className="mobile-badges">{isRecord(item) && <i className="status-tag record">신고가</i>}{item.latestJeonse > 0 && <i className="status-tag rent">전세 확인</i>}{item.permitZone && <i className="status-tag permit">토허</i>}</span></span><span><strong>{formatHousingArea(item)}</strong><small>{item.floor}층{!item.supplyArea ? " · 전용률 82.5% 기준" : ""}</small></span><span><strong>{item.latestJeonse ? formatPrice(item.latestJeonse) : "전세 없음"}</strong><small>{item.latestJeonse ? `전세가율 ${Math.round(item.latestJeonse / item.price * 100)}% · ${item.latestJeonseDate}` : `전용평당 ${formatPrice(Math.round(pricePerPyeong(item)))}`}</small></span><span className="price-cell"><strong>{formatPrice(item.price)}</strong><small>{item.dealDate} 매매 계약</small></span></button><button className={`finder-save ${isSaved ? "saved" : ""}`} type="button" onClick={() => toggleSaved(item)} aria-pressed={isSaved} aria-label={`${item.complex} ${isSaved ? "저장 해제" : "후보 저장"}`}><span className="finder-save-icon" aria-hidden="true">{isSaved ? "✓" : "＋"}</span><span>{isSaved ? "저장됨" : "저장"}</span></button></article>; })}</div>
    {(remote ? remoteMore : limit < rows.length) && <ActionButton className="morebtn" variant="neutralWeak" size="large" type="button" disabled={remoteLoading} onClick={loadMore}>{remoteLoading ? "불러오는 중" : "더 보기"}</ActionButton>}
    {!remoteLoading && !rows.length && <div className="listing-empty"><h3>조건에 맞는 거래가 없습니다.</h3><p>지역이나 가격 범위를 넓혀보세요.</p></div>}
  </section>;
}
