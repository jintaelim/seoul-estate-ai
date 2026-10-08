import { useMemo, useState } from "react";
import { ActionButton } from "@seed-design/react";
import { latestDate } from "../utils";
import { SEOUL_DISTRICTS } from "../data/districts";

export default function Hero({ transactions, onBudgetSearch }) {
  const [form, setForm] = useState({ capital: "", loan: "", district: "전체" });
  const districts = useMemo(() => ["전체", ...SEOUL_DISTRICTS], []);
  const date = latestDate(transactions);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <section className="hero" id="top">
      <div className="hero-top">
        <div>
          <h1 className="hero-title">서울 아파트,<br /><em>움직인 가격</em>부터 봅니다.</h1>
          <p className="hero-lead">서울 아파트의 실제 계약 가격과 거래 흐름을 확인하고<br className="desktop-only" /> 내 예산에 맞는 다음 단지를 찾아보세요.</p>
        </div>
        <div className="hero-asof"><span>DATA AS OF</span><strong>{date || "불러오는 중"}</strong><small>국토교통부 신고 기준</small></div>
      </div>
      <form className="hero-search" onSubmit={(event) => {
        event.preventDefault();
        onBudgetSearch({ budget: (Number(form.capital) + Number(form.loan)) * 10000, district: form.district });
      }}>
        <div className="hero-search-title">
          <span className="search-step">예산</span>
          <span><span className="kicker">BUDGET COMPASS</span><strong className="hero-search-heading">내 예산이 닿는 서울 찾기</strong><small className="hero-search-desc">자본금 + 대출 가능액으로 최근 거래를 바로 거릅니다.</small></span>
        </div>
        <div className="hero-search-bar">
          <label className="hseg"><span className="hseg-label">자본금</span><input className="hseg-input" type="number" min="0" placeholder="0" value={form.capital} onChange={update("capital")} /><span className="hseg-unit">억</span></label>
          <label className="hseg"><span className="hseg-label">예상 대출금</span><input className="hseg-input" type="number" min="0" placeholder="0" value={form.loan} onChange={update("loan")} /><span className="hseg-unit">억</span></label>
          <label className="hseg district-segment"><span className="hseg-label">관심 지역</span><select className="hseg-input" value={form.district} onChange={update("district")}>{districts.map((district) => <option key={district}>{district}</option>)}</select></label>
          <ActionButton className="hero-submit-inline" variant="neutralSolid" size="large" type="submit"><span>검색 결과 보기</span><b>→</b></ActionButton>
        </div>
      </form>
    </section>
  );
}
