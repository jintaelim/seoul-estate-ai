import { latestDate } from "../utils";
import { Link } from "react-router-dom";

export default function QuickAccess({ transactions }) {
  const latest = latestDate(transactions);
  const items = [
    { href: "/search", key: "FIND", title: "조건으로 아파트 찾기", value: 25, unit: "개 구", tone: "blue", icon: "⌕", description: "예산·지역·면적으로 좁히기" },
    { href: "/transactions", key: "MARKET", title: "거래 데이터 확인", value: transactions.filter((item) => item.dealDate === latest).length, unit: "건", tone: "ink", icon: "▤", description: "매매·전월세·신고가·토지허가" },
    { href: "/watchlist", key: "COMPARE", title: "저장한 후보 비교", value: "최대 5", unit: "개", tone: "amber", icon: "☆", description: "관심 단지의 실제 거래 비교" },
  ];
  return <nav className="quick-access journey-access" aria-label="아파트 탐색 순서">{items.map((item, index) => <Link className={`quick-card ${item.tone}`} to={item.href} key={item.href}><span className="quick-index">0{index + 1}</span><span className="quick-icon" aria-hidden="true">{item.icon}</span><span className="quick-copy"><small>{item.key}</small><strong>{item.title}</strong><em>{item.description}</em></span><span className="quick-value"><b>{typeof item.value === "number" ? item.value.toLocaleString("ko-KR") : item.value}</b>{item.unit}</span><span className="quick-arrow">›</span></Link>)}</nav>;
}
