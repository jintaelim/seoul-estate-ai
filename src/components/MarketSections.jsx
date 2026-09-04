import { useMemo, useState } from "react";
import { SegmentedControl } from "@seed-design/react";
import { askingSignals } from "../data/sampleTransactions";
import { formatPrice, isRecord, latestDate, pricePerPyeong, recordRate } from "../utils";
import { DealRow, Empty, SectionHeader } from "./Common";
import { SeedSelect } from "./SeedFormControls";

const TRANSACTION_PERIODS = [
  ["latest", "최신일"],
  ["week", "이번주"],
  ["month", "이번달"],
  ["previousMonth", "지난달"],
  ["all", "누적"],
];

const VOLUME_PERIODS = [
  ["thisWeek", "이번주"],
  ["thisMonth", "이번달"],
  ["lastMonth", "지난달"],
  ["thisYear", "올해"],
  ["all", "누적"],
];

const SEOUL_DISTRICTS = [
  "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구",
  "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구",
  "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구",
];

function seoulDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function shiftDateKey(value, amount) {
  const date = parseDateKey(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return formatDateKey(date);
}

function periodWindow(period, latest) {
  const today = seoulDateKey();
  const anchor = parseDateKey(today);
  const dayOfWeek = anchor.getUTCDay();
  const monday = shiftDateKey(today, -(dayOfWeek + 6) % 7);
  const monthStart = `${today.slice(0, 7)}-01`;
  const previousMonth = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - 1, 1));
  const previousMonthStart = formatDateKey(previousMonth);
  const previousMonthEnd = formatDateKey(new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 0)));

  if (period === "latest") return { start: latest || "", end: latest || "" };
  if (period === "week") return { start: monday, end: today };
  if (period === "month") return { start: monthStart, end: today };
  if (period === "previousMonth") return { start: previousMonthStart, end: previousMonthEnd };
  if (period === "year") return { start: `${today.slice(0, 4)}-01-01`, end: today };
  return { start: "", end: "" };
}

export function NewClosings({ transactions, onSelect }) {
  const [period, setPeriod] = useState("week");
  const [district, setDistrict] = useState("전체");
  const dates = [...new Set(transactions.map((item) => item.dealDate))].sort().reverse();
  const window = periodWindow(period, dates[0]);
  const base = period === "all"
    ? transactions
    : transactions.filter((item) => item.dealDate >= window.start && item.dealDate <= window.end);
  const districts = ["전체", ...new Set(base.map((item) => item.district))];
  const visible = (district === "전체" ? base : base.filter((item) => item.district === district)).slice().sort((a, b) => pricePerPyeong(b) - pricePerPyeong(a));
  const recordCount = visible.filter(isRecord).length;
  const periodLabel = TRANSACTION_PERIODS.find(([key]) => key === period)?.[1] ?? "기간";
  const rangeLabel = period === "all"
    ? `${dates.at(-1) ?? "-"}~${dates[0] ?? "-"}`
    : window.start === window.end
      ? window.start || "-"
      : `${window.start}~${window.end}`;
  return (
    <section className="card" id="closings">
      <SectionHeader
        eyebrow="LATEST CONTRACTS"
        title={period === "latest" ? "최신 계약일 실거래" : `${periodLabel} 실거래`}
        description={`${rangeLabel} 계약일 기준 · ${periodLabel} · 평당가 높은 순`}
        action={<SegmentedControl.Root className="seed-segmented transaction-period-control" size="medium" value={period} onValueChange={(value) => { setPeriod(value); setDistrict("전체"); }}><SegmentedControl.Indicator />{TRANSACTION_PERIODS.map(([key, label]) => <SegmentedControl.Item value={key} key={key}><SegmentedControl.ItemHiddenInput />{label}</SegmentedControl.Item>)}</SegmentedControl.Root>}
      />
      <div className="section-data-bar"><span><b>{visible.length.toLocaleString("ko-KR")}</b>건 조회</span><span>조회 기간 <b>{periodLabel}</b></span><span>신고가 <b className="red-text">{recordCount}</b>건</span><span>최고 거래가 <b>{visible.length ? formatPrice(Math.max(...visible.map((item) => item.price))) : "-"}</b></span></div>
      <div className="rpills">{districts.map((name) => <button className={`rpill ${district === name ? "on" : ""}`} type="button" key={name} onClick={() => setDistrict(name)}>{name}</button>)}</div>
      <div className="deal-list"><div className="deal-list-head"><span>지역</span><span>단지 / 위치</span><span>면적</span><span>거래금액</span><span>계약일</span></div>{visible.length ? visible.slice(0, 12).map((item) => <DealRow item={item} onSelect={onSelect} key={item.id} />) : <Empty>해당 기간에 집계된 거래가 없습니다.</Empty>}</div>
    </section>
  );
}

export function TransactionVolumeRanking({ transactions, onSelect }) {
  const [period, setPeriod] = useState("thisYear");
  const [district, setDistrict] = useState("전체");
  const periodKey = period === "thisWeek" ? "week" : period === "thisMonth" ? "month" : period === "lastMonth" ? "previousMonth" : period === "thisYear" ? "year" : "all";
  const window = periodWindow(periodKey, latestDate(transactions));
  const periodLabel = VOLUME_PERIODS.find(([key]) => key === period)?.[1] ?? "기간";
  const rangeLabel = period === "all"
    ? "저장된 전체 원장"
    : window.start === window.end
      ? window.start || "-"
      : `${window.start}~${window.end}`;
  const filtered = period === "all"
    ? transactions
    : transactions.filter((item) => item.dealDate >= window.start && item.dealDate <= window.end);
  const ranking = useMemo(() => {
    const groups = new Map();
    for (const item of filtered) {
      if (district !== "전체" && item.district !== district) continue;
      const key = `${item.district}|${item.dong}|${item.complex}`;
      const current = groups.get(key);
      if (current) {
        current.count += 1;
        if (item.dealDate > current.latest.dealDate || (item.dealDate === current.latest.dealDate && item.price > current.latest.price)) current.latest = item;
      } else {
        groups.set(key, { district: item.district, dong: item.dong, complex: item.complex, count: 1, latest: item });
      }
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || b.latest.dealDate.localeCompare(a.latest.dealDate) || a.complex.localeCompare(b.complex, "ko"));
  }, [district, filtered]);
  const topRows = ranking.slice(0, 10);
  const maxCount = topRows[0]?.count || 1;
  const totalCount = filtered.filter((item) => district === "전체" || item.district === district).length;
  const districtOptions = ["전체", ...SEOUL_DISTRICTS];
  return (
    <section className="card volume-ranking-section" id="volume-ranking">
      <SectionHeader
        eyebrow="VOLUME RANKING"
        title="거래량 많은 단지"
        description={`${rangeLabel} 계약일 기준 · 단지별 거래 건수`}
        action={<SeedSelect className="volume-district-select" label="자치구 선택" value={district} onChange={setDistrict} options={districtOptions} />}
      />
      <div className="volume-period-row" aria-label="거래량 조회 기간">
        <span className="volume-period-label">조회 기간</span>
        <SegmentedControl.Root className="seed-segmented volume-period-control" size="medium" value={period} onValueChange={setPeriod}>
          <SegmentedControl.Indicator />
          {VOLUME_PERIODS.map(([key, label]) => <SegmentedControl.Item value={key} key={key}><SegmentedControl.ItemHiddenInput />{label}</SegmentedControl.Item>)}
        </SegmentedControl.Root>
      </div>
      <div className="section-data-bar volume-summary"><span><b>{totalCount.toLocaleString("ko-KR")}</b>건 집계</span><span><b>{ranking.length.toLocaleString("ko-KR")}</b>개 단지</span><span>지역 <b>{district}</b></span><span>계약일 기준</span></div>
      <div className="volume-ranking-list" aria-live="polite">
        {topRows.length ? topRows.map((item, index) => (
          <button className="volume-ranking-row" type="button" key={`${item.district}|${item.dong}|${item.complex}`} onClick={() => onSelect?.(item.latest)} aria-label={`${item.complex}, ${item.count}건 거래`}>
            <span className="volume-rank-number">{index + 1}</span>
            <span className="volume-rank-copy"><strong>{item.complex}</strong><small>{item.district} {item.dong}</small><i><em style={{ width: `${Math.max(12, (item.count / maxCount) * 100)}%` }} /></i></span>
            <strong className="volume-rank-count">{item.count}<small>건</small></strong>
          </button>
        )) : <Empty>선택한 기간과 자치구에 집계된 거래가 없습니다.</Empty>}
      </div>
      {ranking.length > topRows.length && <p className="volume-ranking-note">거래량 상위 {topRows.length}개 단지를 표시하고 있습니다.</p>}
    </section>
  );
}

export function DistrictActivity({ transactions, onDistrict }) {
  const activity = useMemo(() => {
    const counts = transactions.reduce((map, item) => map.set(item.district, (map.get(item.district) ?? 0) + 1), new Map());
    const rows = [...counts].sort((a, b) => b[1] - a[1]);
    const max = rows[0]?.[1] || 1;
    return rows.map(([district, count]) => ({ district, count, level: count / max > .55 ? "hot" : count / max > .28 ? "mid" : "low" }));
  }, [transactions]);
  return <section className="card" id="districts"><SectionHeader eyebrow="DISTRICT ACTIVITY" title="지역별 거래 활성도" description="현재 조회된 원장 기준 구별 거래 건수" /><div className="dact-grid">{activity.map((item) => <button className={`dcell ${item.level}`} type="button" key={item.district} onClick={() => onDistrict(item.district)}><span className="dcnm">{item.district}</span><span className="dccnt">{item.count}건</span></button>)}</div></section>;
}

export function RecordsAndSignals({ transactions, onSelect }) {
  const records = transactions.filter(isRecord).sort((a, b) => recordRate(b) - recordRate(a)).slice(0, 5);
  return (
    <div className="two">
      <section className="card" id="records"><SectionHeader eyebrow="NEW HIGHS" title="신고가" /><div className="rec-list">{records.map((item, index) => <button className="rec-item" type="button" key={item.id} onClick={() => onSelect(item)}><span className="rank">{index + 1}</span><span><span className="rnm">{item.complex}</span><span className="rdt">{item.district} {item.dong} · {item.area.toFixed(0)}㎡</span></span><span className="rprice"><span className="rpval">{formatPrice(item.price)}</span><span className="rpchg">+{recordRate(item).toFixed(1)}%</span></span></button>)}</div></section>
      <section className="card"><SectionHeader eyebrow="ASKING PRICE SIGNAL" title="호가 흐름" action={<span className="pill">베타</span>} /><div className="ask-sum"><div className="ask-stat"><strong className="asval dn">81%</strong><span className="aslbl">호가인하</span></div><div className="ask-stat"><strong className="asval up">19%</strong><span className="aslbl">호가인상</span></div><div className="ask-stat"><strong className="asval neg">-4,742</strong><span className="aslbl">매물순증감</span></div></div><div className="ask-list">{askingSignals.map((item) => <div className="ask-item" key={item.complex}><span><span className="acplx">{item.complex}</span><span className="acgu">{item.district}</span></span><strong className={`achg ${item.change > 0 ? "up" : "dn"}`}>{item.change > 0 ? "+" : ""}{item.change}%</strong></div>)}</div></section>
    </div>
  );
}

export function History({ transactions, onSelect }) {
  const [openDate, setOpenDate] = useState(latestDate(transactions));
  const grouped = transactions.reduce((result, item) => {
    (result[item.dealDate] ??= []).push(item);
    return result;
  }, {});
  const groups = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).slice(0, 12);
  return <section className="card"><SectionHeader eyebrow="HISTORY" title="전체 실거래 누적 내역" description="날짜를 열어 개별 거래를 확인하세요." /><div className="hist-list">{groups.map(([date, items]) => <div className={`hgrp ${openDate === date ? "open" : ""}`} key={date}><button className="hhdr" type="button" onClick={() => setOpenDate(openDate === date ? null : date)}><span><span className="hdate">{date}</span><span className="hcnt">{items.length}건</span></span><span className="hchev">⌄</span></button>{openDate === date && <div className="hbody">{items.map((item) => <DealRow item={item} onSelect={onSelect} key={item.id} />)}</div>}</div>)}</div></section>;
}

export function PermitPreview({ transactions, onSelect }) {
  const permits = transactions.filter((item) => item.permitZone);
  const zones = [...new Set(permits.map((item) => item.permitZone))];
  const districts = ["전체", ...new Set(transactions.map((item) => item.district).filter(Boolean).sort())];
  const permitDates = [...new Set(permits.map((item) => item.dealDate))].sort().reverse().slice(0, 14);
  const [zone, setZone] = useState("전체");
  const [district, setDistrict] = useState("전체");
  const [date, setDate] = useState("all");
  const [limit, setLimit] = useState(8);
  const visible = permits.filter((item) => (zone === "전체" || item.permitZone === zone) && (district === "전체" || item.district === district) && (date === "all" || item.dealDate === date));
  const selectDistrict = (value) => { setDistrict(value); setLimit(8); };
  const selectZone = (value) => { setZone(value); setLimit(8); };
  const selectDate = (value) => { setDate(value); setLimit(8); };
  const dateLabel = (value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return { month: parsed.getUTCMonth() + 1, day: parsed.getUTCDate(), weekday: new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(parsed) };
  };
  return (
    <section className="card permit-section" id="permits">
      <SectionHeader
        eyebrow="LAND PERMIT LEDGER"
        title="토지거래허가구역 거래"
        description="서울 자치구와 허가구역을 함께 선택해 거래를 좁혀봅니다."
        action={<div className="permit-header-actions"><SeedSelect className="permit-district-select" label="자치구 선택" value={district} onChange={selectDistrict} options={districts} /><span className="permit-count"><b>{visible.length.toLocaleString("ko-KR")}</b>건 <small>/ {zones.length}개 구역</small></span></div>}
      />
      <div className="permit-date-strip" aria-label="토지허가거래 기준일 선택">
        <button className={date === "all" ? "on all-date" : "all-date"} type="button" onClick={() => selectDate("all")}><small>기간</small><strong>전체</strong></button>
        {permitDates.map((value) => { const label = dateLabel(value); return <button className={date === value ? "on" : ""} type="button" key={value} onClick={() => selectDate(value)}><small>{label.weekday}</small><strong>{label.day}</strong><i>{label.month}월</i></button>; })}
      </div>
      <div className="permit-notice"><span className="notice-mark">!</span><p><strong>허가 여부가 아닌 구역 내 실거래입니다.</strong><small>실제 허가 상태와 이용 목적은 관할 구청 자료를 함께 확인하세요.</small></p></div>
      <div className="permit-zone-tabs"><button className={zone === "전체" ? "on" : ""} type="button" onClick={() => selectZone("전체")}>전체 <b>{permits.filter((item) => district === "전체" || item.district === district).length}</b></button>{zones.map((name) => <button className={zone === name ? "on" : ""} type="button" key={name} onClick={() => selectZone(name)}>{name} <b>{permits.filter((item) => item.permitZone === name && (district === "전체" || item.district === district)).length}</b></button>)}</div>
      <div className="permit-filter-state"><span>현재 필터</span><strong>{date === "all" ? "전체 기간" : date}</strong><i>·</i><strong>{district === "전체" ? "서울 전체 자치구" : district}</strong><i>·</i><strong>{zone === "전체" ? "전체 허가구역" : zone}</strong></div>
      <div className="deal-list permit-preview-list"><div className="deal-list-head"><span>지역</span><span>단지 / 허가구역</span><span>면적</span><span>거래금액</span><span>계약일</span></div>{visible.length ? visible.slice(0, limit).map((item) => <DealRow item={item} onSelect={onSelect} key={item.id} />) : <Empty>선택한 자치구와 허가구역에 거래가 없습니다.</Empty>}</div>
      {limit < visible.length && <button className="morebtn" type="button" onClick={() => setLimit((value) => value + 8)}>+{visible.length - limit}건 더 보기 ↓</button>}
    </section>
  );
}
