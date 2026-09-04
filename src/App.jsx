import { useEffect, useState } from "react";
import { Callout, ProgressCircle } from "@seed-design/react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header, { MobileNav } from "./components/Header";
import Hero from "./components/Hero";
import QuickAccess from "./components/QuickAccess";
import PageHeader from "./components/PageHeader";
import PropertySearch from "./components/PropertySearch";
import LoanCalculator from "./components/LoanCalculator";
import CandidateWatchlist from "./components/CandidateWatchlist";
import TransactionDialog from "./components/TransactionDialog";
import { DistrictActivity, History, NewClosings, PermitPreview, RecordsAndSignals } from "./components/MarketSections";
import { useTransactions } from "./hooks/useTransactions";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  const { transactions, source, loading, error, retry } = useTransactions();
  const [selected, setSelected] = useState(null);
  const [budgetSearch, setBudgetSearch] = useState(null);
  const navigate = useNavigate();

  const handleBudgetSearch = (criteria) => {
    setBudgetSearch({ ...criteria, key: Date.now() });
    navigate("/search");
  };

  const handleDistrict = (district) => {
    setBudgetSearch({ district, budget: 0, key: Date.now() });
    navigate("/search");
  };

  const status = <>
    {loading && <div className="data-loading" role="status"><ProgressCircle.Root size="24" tone="staticWhite"><ProgressCircle.Track /><ProgressCircle.Range /></ProgressCircle.Root>국토교통부 최신 데이터를 확인하고 있습니다.</div>}
    {error && <Callout.Root className="data-callout" tone="warning"><Callout.Content><Callout.Title>{transactions.length ? "저장된 거래 내역을 보여드리고 있어요" : "최신 거래 내역을 불러오지 못했어요"}</Callout.Title><Callout.Description>{error} 잠시 후 다시 시도해 주세요.</Callout.Description></Callout.Content><Callout.Link onClick={retry}>다시 불러오기</Callout.Link></Callout.Root>}
  </>;

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<main className="main home-page"><Hero transactions={transactions} onBudgetSearch={handleBudgetSearch} /><QuickAccess transactions={transactions} />{status}</main>} />
        <Route path="/transactions" element={<main className="main route-page"><PageHeader eyebrow="TRANSACTION LEDGER" title="서울 실거래 원장" description="최신 계약일을 중심으로 이번주·이번달·지난달 거래를 비교합니다." meta={`${transactions.length.toLocaleString("ko-KR")}건`} />{status}<div className="market-workspace"><div className="market-primary"><NewClosings transactions={transactions} onSelect={setSelected} /><History transactions={transactions} onSelect={setSelected} /></div><aside className="market-rail"><DistrictActivity transactions={transactions} onDistrict={handleDistrict} /></aside></div></main>} />
        <Route path="/search" element={<main className="main route-page"><PageHeader eyebrow="APARTMENT FINDER" title="아파트 조건 검색" description="지역·예산·면적·준공연도 조건을 조합해 최근 거래 단지를 좁혀보세요." meta={`${new Set(transactions.map((item) => item.complex)).size.toLocaleString("ko-KR")}개 단지`} />{status}<PropertySearch transactions={transactions} source={source} initialBudget={budgetSearch} onSelect={setSelected} /><LoanCalculator /></main>} />
        <Route path="/records" element={<main className="main route-page"><PageHeader eyebrow="PRICE SIGNALS" title="신고가와 호가 흐름" description="직전 고점을 넘어선 실거래와 시장의 매물 가격 움직임을 함께 봅니다." meta="가격 신호" />{status}<RecordsAndSignals transactions={transactions} onSelect={setSelected} /></main>} />
        <Route path="/permits" element={<main className="main route-page"><PageHeader eyebrow="LAND PERMIT LEDGER" title="토지거래허가구역 거래" description="허가구역 안에서 신고된 아파트 거래를 구역별로 분리해 확인합니다." meta={`${transactions.filter((item) => item.permitZone).length.toLocaleString("ko-KR")}건`} />{status}<PermitPreview transactions={transactions} onSelect={setSelected} /></main>} />
        <Route path="/watchlist" element={<main className="main route-page"><PageHeader eyebrow="MOVE-UP WATCHLIST" title="갈아타기 후보" description="관심 후보 단지와 국토부 실거래 원장을 매칭해 최근 움직임을 추적합니다." meta="후보 모니터링" />{status}<CandidateWatchlist /></main>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="footer"><span>국토교통부 실거래가 공개시스템 기준</span><span>서울 25개 자치구 아파트 실거래 데이터</span><span>Seoul Estate AI</span></footer>
      <MobileNav />
      <TransactionDialog item={selected} transactions={transactions} onClose={() => setSelected(null)} />
    </>
  );
}
