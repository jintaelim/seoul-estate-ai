import { Link, NavLink } from "react-router-dom";

const navItems = [
  ["/transactions", "오늘의 실거래"],
  ["/search", "아파트 검색"],
  ["/records", "신고가"],
  ["/permits", "토지거래허가"],
  ["/watchlist", "갈아타기 후보"],
];

export default function Header() {
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span><strong>서울 집값</strong><small>LIVE LEDGER</small></span>
      </Link>
      <nav className="tnav" aria-label="주요 메뉴">
        {navItems.map(([to, label]) => <NavLink to={to} key={to}>{label}</NavLink>)}
      </nav>
      <Link className="header-cta" to="/search">조건 검색 <span>↗</span></Link>
    </header>
  );
}

export function MobileNav() {
  const items = [["/", "홈", "⌂"], ["/transactions", "실거래", "거"], ["/search", "검색", "⌕"], ["/records", "신고가", "↑"], ["/permits", "토허", "허"]];
  return <nav className="mobile-nav" aria-label="모바일 메뉴">{items.map(([to, label, icon]) => <NavLink to={to} end={to === "/"} key={to}><b>{icon}</b><span>{label}</span></NavLink>)}</nav>;
}
