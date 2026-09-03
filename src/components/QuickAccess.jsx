import { isRecord, latestDate } from "../utils";

export default function QuickAccess({ transactions }) {
  const latest = latestDate(transactions);
  const items = [
    { href: "#closings", key: "LIVE", title: "오늘의 실거래", value: transactions.filter((item) => item.dealDate === latest).length, unit: "건", tone: "blue", icon: "↘" },
    { href: "#propertySearch", key: "SEARCH", title: "아파트 조건 검색", value: new Set(transactions.map((item) => item.complex)).size, unit: "단지", tone: "ink", icon: "⌕" },
    { href: "#records", key: "NEW HIGH", title: "오늘의 신고가", value: transactions.filter(isRecord).length, unit: "건", tone: "red", icon: "↑" },
    { href: "#permits", key: "PERMIT", title: "토허구역 거래", value: transactions.filter((item) => item.permitZone).length, unit: "건", tone: "amber", icon: "허" },
  ];
  return <nav className="quick-access" aria-label="주요 현황 바로가기">{items.map((item) => <a className={`quick-card ${item.tone}`} href={item.href} key={item.href}><span className="quick-icon" aria-hidden="true">{item.icon}</span><span className="quick-copy"><small>{item.key}</small><strong>{item.title}</strong></span><span className="quick-value"><b>{item.value.toLocaleString("ko-KR")}</b>{item.unit}</span><span className="quick-arrow">›</span></a>)}</nav>;
}
