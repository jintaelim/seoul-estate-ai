import { useMemo, useState } from "react";
import { ActionButton, Chip } from "@seed-design/react";
import { formatPrice, isRecord, latestDate, pricePerPyeong, representativeTransactions } from "../utils";
import { SectionHeader } from "./Common";
import { SeedSelect, SeedTextInput } from "./SeedFormControls";

const themes = [
  ["all", "전체"], ["latest", "최신 실거래"], ["record", "신고가"],
  ["permit", "토허구역"], ["active", "거래 많은 단지"], ["value", "고점 대비 낮은 거래"],
];

export default function PropertySearch({ transactions, source, initialBudget, onSelect }) {
  const defaultFilters = { keyword: "", district: "전체", min: "", max: "", area: "0", built: "0", sort: "latest", theme: "all" };
  const [filters, setFilters] = useState(defaultFilters);
  const [limit, setLimit] = useState(8);
  const districts = useMemo(() => ["전체", ...new Set(transactions.map((item) => item.district))], [transactions]);
  const update = (key) => (event) => { setFilters((current) => ({ ...current, [key]: event.target.value })); setLimit(8); };
  const updateValue = (key) => (value) => { setFilters((current) => ({ ...current, [key]: value })); setLimit(8); };

  const rows = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const latest = latestDate(transactions);
    const minBudget = Number(filters.min || 0);
    const budget = Number(filters.max || initialBudget?.budget / 10000 || 0);
    return representativeTransactions(transactions).filter((item) => {
      const haystack = `${item.district} ${item.dong} ${item.complex}`.toLowerCase();
      if (keyword && !haystack.includes(keyword)) return false;
      const district = filters.district !== "전체" ? filters.district : initialBudget?.district;
      if (district && district !== "전체" && item.district !== district) return false;
      if (minBudget && item.price < minBudget * 10000) return false;
      if (budget && item.price > budget * 10000) return false;
      if (item.area < Number(filters.area) || item.builtYear < Number(filters.built)) return false;
      if (filters.theme === "latest" && item.dealDate !== latest) return false;
      if (filters.theme === "record" && !isRecord(item)) return false;
      if (filters.theme === "permit" && !item.permitZone) return false;
      if (filters.theme === "active" && item.recentCount < 7) return false;
      if (filters.theme === "value" && item.price >= item.previousHigh) return false;
      return true;
    }).sort((a, b) => {
      if (filters.sort === "priceAsc") return a.price - b.price;
      if (filters.sort === "priceDesc") return b.price - a.price;
      if (filters.sort === "activity") return b.recentCount - a.recentCount;
      return b.dealDate.localeCompare(a.dealDate) || b.price - a.price;
    });
  }, [transactions, filters, initialBudget]);

  const average = rows.length ? Math.round(rows.reduce((sum, item) => sum + item.price, 0) / rows.length) : 0;

  return (
    <section className="card property-search-card" id="propertySearch">
      <SectionHeader eyebrow="APARTMENT FINDER" title="조건으로 단지 좁히기" description="단지별 최근 실거래를 가격·면적·준공연도로 비교합니다." action={<span className={`source-pill ${source}`}><i />{source === "molit" ? "국토부 실데이터" : source === "cache" ? "1시간 캐시" : "샘플 데이터"}</span>} />
      <div className="react-search-grid">
        <SeedTextInput className="search-wide" label="단지명 · 구 · 동" type="search" placeholder="예: 반포, 성수동, 은평구" value={filters.keyword} onChange={update("keyword")} />
        <SeedSelect label="자치구" value={filters.district} onChange={updateValue("district")} options={districts} />
        <SeedTextInput label="최소 거래가" type="number" min="0" placeholder="0" suffix="억" value={filters.min} onChange={update("min")} />
        <SeedTextInput label="최대 거래가" type="number" min="0" placeholder="제한 없음" suffix="억" value={filters.max} onChange={update("max")} />
        <SeedSelect label="전용면적" value={filters.area} onChange={updateValue("area")} options={[{ value: "0", label: "전체" }, { value: "59", label: "59㎡ 이상" }, { value: "84", label: "84㎡ 이상" }, { value: "114", label: "114㎡ 이상" }]} />
        <SeedSelect label="준공" value={filters.built} onChange={updateValue("built")} options={[{ value: "0", label: "전체" }, { value: "2020", label: "2020년 이후" }, { value: "2015", label: "2015년 이후" }, { value: "2010", label: "2010년 이후" }]} />
        <SeedSelect label="정렬" value={filters.sort} onChange={updateValue("sort")} options={[{ value: "latest", label: "최신 거래순" }, { value: "priceDesc", label: "가격 높은순" }, { value: "priceAsc", label: "가격 낮은순" }, { value: "activity", label: "거래 많은순" }]} />
      </div>
      <div className="search-tool-row">
        <div className="listing-theme-row">{themes.map(([key, label]) => <Chip.Root className={`rpill ${filters.theme === key ? "on" : ""}`} variant={filters.theme === key ? "solid" : "outlineWeak"} size="small" type="button" key={key} onClick={() => { setFilters((current) => ({ ...current, theme: key })); setLimit(8); }}><Chip.Label>{label}</Chip.Label></Chip.Root>)}</div>
        <ActionButton className="filter-reset" variant="ghost" size="xsmall" type="button" onClick={() => { setFilters(defaultFilters); setLimit(8); }}>조건 초기화</ActionButton>
      </div>
      {initialBudget?.budget > 0 && !filters.max && <div className="applied-filter"><span>예산 검색 적용 중</span><strong>{initialBudget.district !== "전체" ? `${initialBudget.district} · ` : ""}{formatPrice(initialBudget.budget)} 이하</strong></div>}
      <div className="search-summary">
        <p><strong>{rows.length.toLocaleString("ko-KR")}</strong>개의 단지 거래</p>
        <span>평균 {formatPrice(average)} · 신고가 {rows.filter(isRecord).length}건 · 토허 {rows.filter((item) => item.permitZone).length}건</span>
      </div>
      <div className="listing-table" role="table" aria-label="아파트 검색 결과">
        <div className="listing-table-head" role="row"><span>단지 / 지역</span><span>면적 / 층</span><span>준공 / 거래일</span><span>평당가</span><span>거래금액</span><span /></div>
        {rows.slice(0, limit).map((item) => (
          <button className="listing-table-row" role="row" type="button" key={item.id} onClick={() => onSelect(item)}>
            <span className="complex-cell"><strong>{item.complex}</strong><small>{item.district} {item.dong}</small><span className="mobile-badges">{isRecord(item) && <i className="status-tag record">신고가</i>}{item.permitZone && <i className="status-tag permit">토허</i>}</span></span>
            <span data-label="면적 / 층"><strong>{item.area.toFixed(0)}㎡</strong><small>{item.floor}층 · {Math.round(item.area / 3.3058)}평</small></span>
            <span data-label="준공 / 거래일"><strong>{item.builtYear || "-"}년</strong><small>{item.dealDate}</small></span>
            <span data-label="평당가"><strong>{formatPrice(Math.round(pricePerPyeong(item)))}</strong><small>3.3㎡ 기준</small></span>
            <span className="price-cell" data-label="거래금액"><strong>{formatPrice(item.price)}</strong><small className={item.price >= item.previousHigh ? "up" : "down"}>{item.previousHigh ? `고점 대비 ${((item.price / item.previousHigh - 1) * 100).toFixed(1)}%` : "비교 없음"}</small></span>
            <span className="row-action">{isRecord(item) && <i className="status-tag record">신고가</i>}{item.permitZone && <i className="status-tag permit">토허</i>}<b>›</b></span>
          </button>
        ))}
      </div>
      {limit < rows.length && <ActionButton className="morebtn" variant="neutralWeak" size="large" type="button" onClick={() => setLimit((value) => value + 8)}>+{rows.length - limit}건 더 보기</ActionButton>}
      {!rows.length && <div className="listing-empty"><h3>조건에 맞는 거래가 없습니다.</h3><p>지역이나 가격 범위를 넓혀보세요.</p></div>}
    </section>
  );
}
