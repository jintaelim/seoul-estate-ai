import { useEffect, useState } from "react";

export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top">
        <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        <span><strong>서울 집값</strong><small>LIVE LEDGER</small></span>
      </a>
      <nav className="tnav" aria-label="주요 메뉴">
        <a href="#closings">오늘의 실거래</a>
        <a href="#propertySearch">아파트 검색</a>
        <a href="#records">신고가</a>
        <a href="#permits">토지거래허가</a>
        <a href="#candidateWatch">갈아타기 후보</a>
      </nav>
      <a className="header-cta" href="#propertySearch">조건 검색 <span>↗</span></a>
    </header>
  );
}

export function MobileNav() {
  const items = [["#top", "홈", "⌂"], ["#closings", "실거래", "거"], ["#propertySearch", "검색", "⌕"], ["#records", "신고가", "↑"], ["#permits", "토허", "허"]];
  const [active, setActive] = useState(window.location.hash || "#top");
  useEffect(() => {
    const update = () => setActive(window.location.hash || "#top");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return <nav className="mobile-nav" aria-label="모바일 메뉴">{items.map(([href, label, icon]) => <a className={active === href ? "active" : ""} href={href} aria-current={active === href ? "page" : undefined} key={href}><b>{icon}</b><span>{label}</span></a>)}</nav>;
}
