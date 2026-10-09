import { useEffect, useState } from "react";
import { Callout } from "@seed-design/react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header, { MobileNav } from "./components/Header";
import PageHeader from "./components/PageHeader";
import PropertySearch from "./components/PropertySearch";
import LoanCalculator from "./components/LoanCalculator";
import CandidateWatchlist from "./components/CandidateWatchlist";
import TransactionDialog from "./components/TransactionDialog";
import { RecordsAndSignals } from "./components/MarketSections";
import { useTransactions } from "./hooks/useTransactions";
import { useLatestTransactions } from "./hooks/useLatestTransactions";
import { useHomeThemes } from "./hooks/useHomeThemes";
import { fetchComplexTransactions } from "./services/estateApi";
import DataStatus from "./components/DataStatus";
import LandPermitLedger from "./components/LandPermitLedger";
import SeoulActivityMap from "./components/SeoulActivityMap";
import PurchaseFlow from "./components/PurchaseFlow";
import TransactionsWorkspace from "./components/TransactionsWorkspace";
import MarketDataNav from "./components/MarketDataNav";
import RentExplorer from "./components/RentExplorer";
import HomePage from "./pages/HomePage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const needsFullLedger = ["/transactions", "/records"].includes(pathname);
  const { transactions, source, loading, refreshing, refreshedAt, error, metadata, retry } = useTransactions(needsFullLedger);
  const latest = useLatestTransactions(pathname === "/");
  const homeThemes = useHomeThemes(pathname === "/");
  const [selected, setSelected] = useState(null);
  const [detailTransactions, setDetailTransactions] = useState([]);
  const [budgetSearch, setBudgetSearch] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (item) => {
    setSelected(item);
    const available = transactions.filter(candidate => candidate.district === item.district && candidate.dong === item.dong && candidate.complex === item.complex);
    if (available.length) { setDetailTransactions(available); return; }
    setDetailTransactions([item]);
    const controller = new AbortController();
    fetchComplexTransactions(item, controller.signal).then(rows => {
      if (!rows.length) return;
      setDetailTransactions(rows);
      setSelected(current => rows.find(row => row.id === current?.id) || current);
    }).catch(() => {});
  };

  const handleBudgetSearch = (criteria) => {
    setBudgetSearch({ ...criteria, key: Date.now() });
    navigate("/search");
  };

  const handleDistrict = (district) => {
    setBudgetSearch({ district, budget: 0, key: Date.now() });
    navigate("/search");
  };

  const status = <>
    <DataStatus metadata={metadata} loading={loading} refreshing={refreshing} refreshedAt={refreshedAt} error={error} retry={retry} />
    {error && <Callout.Root className="data-callout" tone="warning"><Callout.Content><Callout.Title>{transactions.length ? "저장된 거래 내역을 보여드리고 있어요" : "최신 거래 내역을 불러오지 못했어요"}</Callout.Title><Callout.Description>{error} 잠시 후 다시 시도해 주세요.</Callout.Description></Callout.Content><Callout.Link onClick={retry}>다시 불러오기</Callout.Link></Callout.Root>}
  </>;

  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage latest={latest} homeThemes={homeThemes} onBudgetSearch={handleBudgetSearch} onSelect={handleSelect} />} />
        <Route path="/transactions" element={<main className="main route-page"><PageHeader eyebrow="MARKET DATA" title="서울 아파트 거래 데이터" description="매매·전월세·신고가·토지허가 원장을 같은 기준으로 탐색하세요." meta={`${transactions.length.toLocaleString("ko-KR")}건`} /><MarketDataNav />{status}<SeoulActivityMap transactions={transactions} onSelect={handleSelect} /><TransactionsWorkspace transactions={transactions} onSelect={handleSelect} onDistrict={handleDistrict} /></main>} />
        <Route path="/rent" element={<main className="main route-page"><PageHeader eyebrow="MARKET DATA" title="서울 아파트 전월세" description="실제 거래 단지를 선택해 전세 보증금과 월세 계약을 조회합니다." metaLabel="국토부 전월세" meta="최근 3개월" sourceLabel="계약일 기준 · 저장 원장" /><MarketDataNav /><RentExplorer onSelect={handleSelect} /></main>} />
        <Route path="/search" element={<main className="main route-page"><PageHeader eyebrow="APARTMENT FINDER" title="내 조건에 맞는 아파트 찾기" description="최근 매매와 전세를 함께 확인하고 관심 단지를 저장하세요." meta="저장 원장 검색" /><PropertySearch remote transactions={[]} source="cache" initialBudget={budgetSearch} onSelect={handleSelect} /></main>} />
        <Route path="/purchase" element={<main className="main route-page purchase-route"><PurchaseFlow onApply={(criteria, path) => { setBudgetSearch({ ...criteria, key: Date.now() }); navigate(path); }} /><details className="loan-details"><summary>대출 가능액을 먼저 계산할까요?</summary><LoanCalculator /></details></main>} />
        <Route path="/records" element={<main className="main route-page"><PageHeader eyebrow="MARKET DATA" title="실거래 최고가 경신" description="동일 단지·전용면적의 이전 계약과 비교한 가격 신호입니다." meta="가격 신호" /><MarketDataNav />{status}<RecordsAndSignals transactions={transactions} onSelect={handleSelect} /></main>} />
        <Route path="/permits" element={<LandPermitLedger onSelect={handleSelect} />} />
        <Route path="/watchlist" element={<main className="main route-page"><PageHeader eyebrow="SAVED APARTMENTS" title="저장한 후보" description="관심 단지를 선택해 최근 실거래와 주택 조건을 나란히 비교하세요." meta="최대 5개 저장" /><CandidateWatchlist onSelect={handleSelect} /></main>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="footer"><span>국토교통부·서울시 공개 원장 기준</span><span>서울 25개 자치구 아파트 거래 데이터</span><span>서울 집값</span></footer>
      <MobileNav />
      <TransactionDialog item={selected} transactions={detailTransactions.length ? detailTransactions : transactions} onClose={() => setSelected(null)} />
    </>
  );
}
