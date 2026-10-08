import { Link } from "react-router-dom";
import { formatHousingArea, formatPrice, isRecord, latestDate } from "../utils";

export default function HomeSnapshot({ transactions = [], onSelect }) {
  const latest = latestDate(transactions);
  const rows = transactions.filter(item => item.dealDate === latest).sort((a, b) => b.price - a.price).slice(0, 5);
  const recordCount = transactions.filter(item => item.dealDate === latest && isRecord(item)).length;
  return <section className="card home-snapshot">
    <header><div><span>TODAY'S CONTRACTS</span><h2>{latest || "최신 계약일"} 실거래</h2><p>국토부 계약일 기준으로 가장 최근 확인된 서울 아파트 거래입니다.</p></div><div className="snapshot-count"><strong>{transactions.filter(item => item.dealDate === latest).length}</strong><span>건 · 신고가 {recordCount}건</span></div></header>
    <div className="snapshot-list">{rows.map(item => <button type="button" key={item.id} onClick={() => onSelect?.(item)}><span><strong>{item.complex}</strong><small>{item.district} {item.dong} · {formatHousingArea(item)}</small></span><span><strong>{formatPrice(item.price)}</strong><small>{item.floor}층</small></span></button>)}</div>
    <Link className="snapshot-link" to="/transactions">계약일별 원장 전체 보기 <span>→</span></Link>
  </section>;
}
