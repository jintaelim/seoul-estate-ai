import { Callout } from "@seed-design/react";
import Hero from "../components/Hero";
import QuickAccess from "../components/QuickAccess";
import HomeSnapshot from "../components/HomeSnapshot";
import HomeThemes from "../components/HomeThemes";

export default function HomePage({ latest, homeThemes, onBudgetSearch, onSelect }) {
  return <main className="main home-page">
    <Hero transactions={latest.transactions} onBudgetSearch={onBudgetSearch} />
    <QuickAccess transactions={latest.transactions} />
    {latest.error && <Callout.Root className="data-callout" tone="warning">
      <Callout.Content><Callout.Title>최신 거래를 불러오지 못했어요</Callout.Title><Callout.Description>{latest.error}</Callout.Description></Callout.Content>
    </Callout.Root>}
    <HomeSnapshot transactions={latest.transactions} onSelect={onSelect} />
    <HomeThemes payload={homeThemes.payload} loading={homeThemes.loading} error={homeThemes.error} onSelect={onSelect} />
  </main>;
}
