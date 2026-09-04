import { useMemo, useState } from "react";
import { SegmentedControl } from "@seed-design/react";
import { askingSignals } from "../data/sampleTransactions";
import { formatPrice, isRecord, latestDate, pricePerPyeong, recordRate } from "../utils";
import { DealRow, Empty, SectionHeader } from "./Common";
import { SeedSelect } from "./SeedFormControls";

export function NewClosings({ transactions, onSelect }) {
  const [tab, setTab] = useState("latest");
  const [district, setDistrict] = useState("전체");
  const dates = [...new Set(transactions.map((item) => item.dealDate))].sort().reverse();
  const base = tab === "latest" ? transactions.filter((item) => item.dealDate === dates[0]) : tab === "previous" ? transactions.filter((item) => item.dealDate === dates[1]) : transactions;
  const districts = ["전체", ...new Set(base.map((item) => item.district))];
  const visible = (district === "전체" ? base : base.filter((item) => item.district === district)).sort((a, b) => pricePerPyeong(b) - pricePerPyeong(a));
  const recordCount = visible.filter(isRecord).length;
  return (
    <section className="card" id="closings">
      <SectionHeader eyebrow="TODAY'S CLOSINGS" title="오늘 들어온 실거래" description={`${dates[0] ?? "-"} 신고분 · 평당가 높은 순`} action={<SegmentedControl.Root className="seed-segmented" size="medium" value={tab} onValueChange={(value) => { setTab(value); setDistrict("전체"); }}><SegmentedControl.Indicator />{[["latest", "최신일"], ["previous", "이전일"], ["all", "누적"]].map(([key, label]) => <SegmentedControl.Item value={key} key={key}><SegmentedControl.ItemHiddenInput />{label}</SegmentedControl.Item>)}</SegmentedControl.Root>} />
      <div className="section-data-bar"><span><b>{visible.length.toLocaleString("ko-KR")}</b>건 조회</span><span>신고가 <b className="red-text">{recordCount}</b>건</span><span>최고 거래가 <b>{visible.length ? formatPrice(Math.max(...visible.map((item) => item.price))) : "-"}</b></span></div>
      <div className="rpills">{districts.map((name) => <button className={`rpill ${district === name ? "on" : ""}`} type="button" key={name} onClick={() => setDistrict(name)}>{name}</button>)}</div>
      <div className="deal-list"><div className="deal-list-head"><span>지역</span><span>단지 / 위치</span><span>면적</span><span>거래금액</span><span>계약일</span></div>{visible.length ? visible.slice(0, 12).map((item) => <DealRow item={item} onSelect={onSelect} key={item.id} />) : <Empty>해당 기간에 집계된 거래가 없습니다.</Empty>}</div>
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
  const [zone, setZone] = useState("전체");
  const [district, setDistrict] = useState("전체");
  const [limit, setLimit] = useState(8);
  const visible = permits.filter((item) => (zone === "전체" || item.permitZone === zone) && (district === "전체" || item.district === district));
  const selectDistrict = (value) => { setDistrict(value); setLimit(8); };
  const selectZone = (value) => { setZone(value); setLimit(8); };
  return (
    <section className="card permit-section" id="permits">
      <SectionHeader
        eyebrow="LAND PERMIT LEDGER"
        title="토지거래허가구역 거래"
        description="서울 자치구와 허가구역을 함께 선택해 거래를 좁혀봅니다."
        action={<div className="permit-header-actions"><SeedSelect className="permit-district-select" label="자치구 선택" value={district} onChange={selectDistrict} options={districts} /><span className="permit-count"><b>{visible.length.toLocaleString("ko-KR")}</b>건 <small>/ {zones.length}개 구역</small></span></div>}
      />
      <div className="permit-notice"><span className="notice-mark">!</span><p><strong>허가 여부가 아닌 구역 내 실거래입니다.</strong><small>실제 허가 상태와 이용 목적은 관할 구청 자료를 함께 확인하세요.</small></p></div>
      <div className="permit-zone-tabs"><button className={zone === "전체" ? "on" : ""} type="button" onClick={() => selectZone("전체")}>전체 <b>{permits.filter((item) => district === "전체" || item.district === district).length}</b></button>{zones.map((name) => <button className={zone === name ? "on" : ""} type="button" key={name} onClick={() => selectZone(name)}>{name} <b>{permits.filter((item) => item.permitZone === name && (district === "전체" || item.district === district)).length}</b></button>)}</div>
      <div className="permit-filter-state"><span>현재 필터</span><strong>{district === "전체" ? "서울 전체 자치구" : district}</strong><i>×</i><strong>{zone === "전체" ? "전체 허가구역" : zone}</strong></div>
      <div className="deal-list permit-preview-list"><div className="deal-list-head"><span>지역</span><span>단지 / 허가구역</span><span>면적</span><span>거래금액</span><span>계약일</span></div>{visible.length ? visible.slice(0, limit).map((item) => <DealRow item={item} onSelect={onSelect} key={item.id} />) : <Empty>선택한 자치구와 허가구역에 거래가 없습니다.</Empty>}</div>
      {limit < visible.length && <button className="morebtn" type="button" onClick={() => setLimit((value) => value + 8)}>+{visible.length - limit}건 더 보기 ↓</button>}
    </section>
  );
}
