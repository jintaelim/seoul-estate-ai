import { useState } from "react";
import { Callout, ProgressCircle } from "@seed-design/react";
import Header, { MobileNav } from "./components/Header";
import Hero from "./components/Hero";
import QuickAccess from "./components/QuickAccess";
import PropertySearch from "./components/PropertySearch";
import CandidateWatchlist from "./components/CandidateWatchlist";
import TransactionDialog from "./components/TransactionDialog";
import { DistrictActivity, History, NewClosings, PermitPreview, RecordsAndSignals } from "./components/MarketSections";
import { useTransactions } from "./hooks/useTransactions";

export default function App() {
  const { transactions, source, loading, error, retry } = useTransactions();
  const [selected, setSelected] = useState(null);
  const [budgetSearch, setBudgetSearch] = useState(null);

  const handleBudgetSearch = (criteria) => {
    setBudgetSearch({ ...criteria, key: Date.now() });
    requestAnimationFrame(() => document.querySelector("#propertySearch")?.scrollIntoView({ behavior: "smooth" }));
  };

  const handleDistrict = (district) => {
    setBudgetSearch({ district, budget: 0, key: Date.now() });
    requestAnimationFrame(() => document.querySelector("#propertySearch")?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <>
      <Header />
      <main className="main">
        <Hero transactions={transactions} onBudgetSearch={handleBudgetSearch} />
        <QuickAccess transactions={transactions} />
        {loading && <div className="data-loading" role="status"><ProgressCircle.Root size="24" tone="staticWhite"><ProgressCircle.Track /><ProgressCircle.Range /></ProgressCircle.Root>국토교통부 최신 데이터를 확인하고 있습니다.</div>}
        {error && <Callout.Root className="data-callout" tone="warning"><Callout.Content><Callout.Title>저장된 거래 내역을 보여드리고 있어요</Callout.Title><Callout.Description>{error} 네트워크가 안정되면 최신 자료를 다시 확인할 수 있습니다.</Callout.Description></Callout.Content><Callout.Link onClick={retry}>다시 불러오기</Callout.Link></Callout.Root>}
        <PropertySearch transactions={transactions} source={source} initialBudget={budgetSearch} onSelect={setSelected} />
        <div className="market-workspace">
          <div className="market-primary"><NewClosings transactions={transactions} onSelect={setSelected} /><History transactions={transactions} onSelect={setSelected} /></div>
          <aside className="market-rail"><RecordsAndSignals transactions={transactions} onSelect={setSelected} /><DistrictActivity transactions={transactions} onDistrict={handleDistrict} /></aside>
        </div>
        <PermitPreview transactions={transactions} onSelect={setSelected} />
        <CandidateWatchlist />
      </main>
      <footer className="footer"><span>국토교통부 실거래가 공개시스템 기준</span><span>서울 25개 자치구 아파트 실거래 데이터</span><span>Seoul Estate AI</span></footer>
      <MobileNav />
      <TransactionDialog item={selected} transactions={transactions} onClose={() => setSelected(null)} />
    </>
  );
}
