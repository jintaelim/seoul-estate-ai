import { useState } from "react";
import { DistrictActivity, NewClosings, TransactionVolumeRanking } from "./MarketSections";

export default function TransactionsWorkspace({ transactions, onSelect, onDistrict }) {
  const [view, setView] = useState("daily");
  return <section className="transaction-workspace">
    <div className="transaction-view-tabs" role="tablist" aria-label="실거래 보기 방식">
      <button type="button" role="tab" aria-selected={view === "daily"} className={view === "daily" ? "on" : ""} onClick={() => setView("daily")}>계약일별 원장</button>
      <button type="button" role="tab" aria-selected={view === "volume"} className={view === "volume" ? "on" : ""} onClick={() => setView("volume")}>거래량 보기</button>
    </div>
    {view === "daily" ? <NewClosings transactions={transactions} onSelect={onSelect} /> : <div className="transaction-analysis"><TransactionVolumeRanking transactions={transactions} onSelect={onSelect} /><DistrictActivity transactions={transactions} onDistrict={onDistrict} /></div>}
  </section>;
}
