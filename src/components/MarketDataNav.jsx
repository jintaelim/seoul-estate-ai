import { NavLink } from "react-router-dom";

const items = [
  ["/transactions", "매매 실거래", "계약일별 가격"],
  ["/rent", "전월세", "보증금·월세"],
  ["/records", "신고가", "최고가 경신"],
  ["/permits", "토지허가", "허가 처리내역"],
];

export default function MarketDataNav() {
  return <nav className="market-data-nav" aria-label="거래 데이터 보기">
    {items.map(([to, label, description]) => <NavLink to={to} key={to}><strong>{label}</strong><small>{description}</small></NavLink>)}
  </nav>;
}
