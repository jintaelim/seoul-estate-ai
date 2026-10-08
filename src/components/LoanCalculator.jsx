import { useMemo, useState } from "react";
import { SectionHeader } from "./Common";
import { SeedTextInput, SeedSelect } from "./SeedFormControls";
import { calculateLoan, money } from "../loan-calculator";

export default function LoanCalculator() {
  const [form, setForm] = useState({ price: "", income: "", existingBalance: "", existingPayment: "", rate: "4.2", years: "30", firstHome: "no" });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const updateValue = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));
  const result = useMemo(() => {
    const price = Number(form.price);
    const income = Number(form.income);
    const existingBalance = Number(form.existingBalance);
    const existingPayment = Number(form.existingPayment);
    if (!price || !income) return null;
    return calculateLoan({ price, income, existingBalance, existingPayment, rate: Number(form.rate) || 0, years: Number(form.years) || 30, firstHome: form.firstHome === "yes" });
  }, [form]);

  return <section className="card loan-calculator">
    <SectionHeader eyebrow="LOAN CHECK" title="대출 가능액 미리 계산" description="LTV·DSR·생애최초 여부를 반영한 참고용 추정치입니다." />
    <div className="loan-grid">
      <SeedTextInput label="매수 주택가격" type="number" min="0" suffix="만원" placeholder="예: 150000" value={form.price} onChange={update("price")} />
      <SeedTextInput label="연소득(부부합산)" type="number" min="0" suffix="만원" placeholder="예: 8000" value={form.income} onChange={update("income")} />
      <SeedTextInput label="기존 대출 잔액" type="number" min="0" suffix="만원" placeholder="선택" value={form.existingBalance} onChange={update("existingBalance")} />
      <SeedTextInput label="기존 대출 연간 원리금" type="number" min="0" suffix="만원" placeholder="예: 1200" value={form.existingPayment} onChange={update("existingPayment")} />
      <SeedTextInput label="예상 대출금리" type="number" min="0" step="0.1" suffix="%" placeholder="예: 4.2" value={form.rate} onChange={update("rate")} />
      <SeedSelect label="생애최초" value={form.firstHome} onChange={updateValue("firstHome")} options={[{ value: "no", label: "아니오 (LTV 70% 가정)" }, { value: "yes", label: "예 (LTV 80% 가정)" }]} />
      <SeedSelect label="상환기간" value={form.years} onChange={updateValue("years")} options={[{ value: "20", label: "20년" }, { value: "30", label: "30년" }, { value: "40", label: "40년" }]} />
    </div>
    {result ? <><div className="loan-result"><div><span>추정 가능 대출</span><strong>{money(result.maxLoan)}</strong></div><div><span>LTV 한도</span><b>{money(result.ltvLimit)}</b></div><div><span>DSR 한도</span><b>{money(result.dsrLoan)}</b></div><div><span>예상 월 상환액</span><b>{money(result.monthly)}</b></div></div><p className="loan-basis">LTV 한도와 DSR 한도 중 낮은 금액을 적용했습니다.{Number(form.existingBalance) > 0 && !Number(form.existingPayment) ? " 기존 대출 연간 원리금 미입력으로 잔액을 금리 5%·10년 상환으로 추정했습니다." : ""}</p></> : <div className="loan-empty">주택가격과 연소득을 입력하면 추정 한도를 계산합니다.</div>}
    <p className="loan-disclaimer">참고용 계산입니다. 연소득의 40%를 연간 원리금 한도로 가정합니다. 실제 한도는 금융기관의 스트레스 DSR, 담보평가, 신용점수, 보유주택·대출 종류 및 지역 규제를 반영해 달라질 수 있습니다.</p>
  </section>;
}
