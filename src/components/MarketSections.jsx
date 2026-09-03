import { useMemo, useState } from "react";
import { askingSignals } from "../data/sampleTransactions";
import { formatPrice, isRecord, latestDate, pricePerPyeong, recordRate } from "../utils";
import { DealRow, Empty, SectionHeader } from "./Common";

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
      <SectionHeader eyebrow="TODAY'S CLOSINGS" title="오늘 들어온 실거래" description={`${dates[0] ?? "-"} 신고분 · 평당가 높은 순`} action={<div className="tab-group">{[["latest", "최신일"], ["previous", "이전일"], ["all", "누적"]].map(([key, label]) => <button className={`tab ${tab === key ? "on" : ""}`} type="button" key={key} onClick={() => { setTab(key); setDistrict("전체"); }}>{label}</button>)}</div>} />
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
  const [zone, setZone] = useState("전체");
  const [limit, setLimit] = useState(8);
  const visible = zone === "전체" ? permits : permits.filter((item) => item.permitZone === zone);
  return <section className="card permit-section" id="permits"><SectionHeader eyebrow="LAND PERMIT LEDGER" title="토지거래허가구역 거래" description="허가구역 안에서 신고된 아파트 거래를 구역별로 확인합니다." action={<span className="permit-count"><b>{permits.length.toLocaleString("ko-KR")}</b>건 <small>/ {zones.length}개 구역</small></span>} /><div className="permit-notice"><span className="notice-mark">!</span><p><strong>허가 여부가 아닌 구역 내 실거래입니다.</strong><small>실제 허가 상태와 이용 목적은 관할 구청 자료를 함께 확인하세요.</small></p></div><div className="permit-zone-tabs"><button className={zone === "전체" ? "on" : ""} type="button" onClick={() => { setZone("전체"); setLimit(8); }}>전체 <b>{permits.length}</b></button>{zones.map((name) => <button className={zone === name ? "on" : ""} type="button" key={name} onClick={() => { setZone(name); setLimit(8); }}>{name} <b>{permits.filter((item) => item.permitZone === name).length}</b></button>)}</div><div className="deal-list permit-preview-list"><div className="deal-list-head"><span>지역</span><span>단지 / 허가구역</span><span>면적</span><span>거래금액</span><span>계약일</span></div>{visible.slice(0, limit).map((item) => <DealRow item={item} onSelect={onSelect} key={item.id} />)}</div>{limit < visible.length && <button className="morebtn" type="button" onClick={() => setLimit((value) => value + 8)}>+{visible.length - limit}건 더 보기 ↓</button>}</section>;
}
