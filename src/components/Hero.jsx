import { useMemo, useState } from "react";
import { ActionButton, Badge, Box, Grid, Text } from "@seed-design/react";
import { latestDate } from "../utils";
import { SEOUL_DISTRICTS } from "../data/districts";

export default function Hero({ transactions, onBudgetSearch }) {
  const [form, setForm] = useState({ capital: "", loan: "", district: "전체" });
  const districts = useMemo(() => ["전체", ...SEOUL_DISTRICTS], []);
  const date = latestDate(transactions);
  const budget = Number(form.capital || 0) + Number(form.loan || 0);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <Box as="section" className="hero" id="top">
      <Grid className="hero-top">
        <Box>
          <Text as="h1" className="hero-title">서울 아파트,<br /><em>움직인 가격</em>부터 봅니다.</Text>
          <Text as="p" className="hero-lead">서울 아파트의 실제 계약 가격과 거래 흐름을 확인하고<br className="desktop-only" /> 내 예산에 맞는 다음 단지를 찾아보세요.</Text>
        </Box>
        <Box className="hero-asof"><Text>DATA AS OF</Text><Text as="strong">{date || "불러오는 중"}</Text><Text as="small">국토교통부 신고 기준</Text></Box>
      </Grid>
      <Box as="form" className="hero-search" aria-label="예산으로 아파트 찾기" onSubmit={(event) => {
        event.preventDefault();
        onBudgetSearch({ budget: budget * 10000, district: form.district });
      }}>
        <Box className="hero-search-title">
          <Badge className="search-step" size="medium" variant="outline" tone="informative">예산</Badge>
          <Box><Text className="kicker">BUDGET COMPASS</Text><Text as="strong" className="hero-search-heading">내 예산이 닿는 서울 찾기</Text><Text as="small" className="hero-search-desc">자본금 + 대출 가능액으로 최근 거래를 바로 거릅니다.</Text></Box>
          <Box className="hero-budget-preview" aria-live="polite"><Text>검색 예산</Text><Text as="strong">{budget > 0 ? `${budget.toLocaleString("ko-KR")}억` : "입력 전"}</Text></Box>
        </Box>
        <Grid className="hero-search-bar">
          <Box as="label" className="hseg"><Text className="hseg-label">자본금</Text><input className="hseg-input" type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={form.capital} onChange={update("capital")} /><Text className="hseg-unit">억</Text></Box>
          <Box as="label" className="hseg"><Text className="hseg-label">예상 대출금</Text><input className="hseg-input" type="number" inputMode="decimal" min="0" step="0.1" placeholder="0" value={form.loan} onChange={update("loan")} /><Text className="hseg-unit">억</Text></Box>
          <Box as="label" className="hseg district-segment"><Text className="hseg-label">관심 지역</Text><select className="hseg-input" value={form.district} onChange={update("district")}>{districts.map((district) => <option key={district}>{district}</option>)}</select></Box>
          <ActionButton className="hero-submit-inline" variant="neutralSolid" size="large" type="submit"><span>검색 결과 보기</span><b>→</b></ActionButton>
        </Grid>
      </Box>
    </Box>
  );
}
