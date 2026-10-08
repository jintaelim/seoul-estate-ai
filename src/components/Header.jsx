import { Link, NavLink, useLocation } from "react-router-dom";

const navItems = [
  ["/search", "아파트 찾기"],
  ["/transactions", "거래 데이터"],
  ["/watchlist", "저장한 후보"],
];

export default function Header() {
  const { pathname } = useLocation();
  const marketActive = ["/transactions", "/rent", "/records", "/permits"].includes(pathname);
  return (
    <header className="topbar">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span><strong>서울 집값</strong><small>LIVE LEDGER</small></span>
      </Link>
      <nav className="tnav" aria-label="주요 메뉴">
        {navItems.map(([to, label]) => <NavLink className={({ isActive }) => isActive || (to === "/transactions" && marketActive) ? "active" : ""} to={to} key={to}>{label}</NavLink>)}
      </nav>
      <Link className="header-cta" to="/purchase">내 구매조건 <span>↗</span></Link>
    </header>
  );
}

export function MobileNav() {
  const { pathname } = useLocation();
  const items = [["/", "홈", "⌂"], ["/search", "찾기", "⌕"], ["/purchase", "조건", "◎"], ["/transactions", "거래", "▤"], ["/watchlist", "저장", "☆"]];
  const marketActive = ["/transactions", "/rent", "/records", "/permits"].includes(pathname);
  return <nav className="mobile-nav" aria-label="모바일 메뉴">{items.map(([to, label, icon]) => <NavLink className={({ isActive }) => isActive || (to === "/transactions" && marketActive) ? "active" : ""} to={to} end={to === "/"} key={to}><b>{icon}</b><span>{label}</span></NavLink>)}</nav>;
}
