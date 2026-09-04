import { useMemo, useState } from "react";
import { SectionHeader } from "./Common";
import { SeedTextInput, SeedSelect } from "./SeedFormControls";

const money = (value) => `${Math.round(value / 10000).toLocaleString("ko-KR")}억 ${Math.round(value % 10000).toLocaleString("ko-KR")}만원`;

function monthlyPayment(principal, annualRate, years) {
  const months = Math.max(1, years * 12);
  const rate = annualRate / 100 / 12;
  if (!rate) return principal / months;
  return principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
}

export default function LoanCalculator() {
  const [form, setForm] = useState({ price: "", income: "", existingBalance: "", existingPayment: "", rate: "4.2", years: "30", firstHome: "no" });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const result = useMemo(() => {
    const price = Number(form.price) * 10000;
    const income = Number(form.income) * 10000;
    const existingBalance = Number(form.existingBalance) * 10000;
    const existingPayment = Number(form.existingPayment) * 10000;
    if (!price || !income) return null;
    const ltvRate = form.firstHome === "yes" ? 0.8 : 0.7;
    const ltvLimit = price * ltvRate;
    const dsrLimit = income * 0.4;
    // If the user does not know the annual payment, estimate a conservative
    // 10-year amortization from the remaining balance for the preview.
    const estimatedExistingAnnual = existingPayment || monthlyPayment(existingBalance, 5, 10) * 12;
    const availableAnnual = Math.max(0, dsrLimit - estimatedExistingAnnual);
    const monthlyCap = availableAnnual / 12;
    const factor = monthlyPayment(10000, Number(form.rate) || 0, Number(form.years) || 30);
    const dsrLoan = factor ? monthlyCap / factor * 10000 : 0;
    const maxLoan = Math.max(0, Math.min(ltvLimit, dsrLoan));
    return { ltvRate, ltvLimit, dsrLoan, maxLoan, monthly: monthlyPayment(maxLoan, Number(form.rate) || 0, Number(form.years) || 30), availableAnnual };
  }, [form]);

  return <section className="card loan-calculator">
    <SectionHeader eyebrow="LOAN CHECK" title="대출 가능액 미리 계산" description="LTV·DSR·생애최초 여부를 반영한 참고용 추정치입니다." />
    <div className="loan-grid">
      <SeedTextInput label="매수 주택가격" type="number" min="0" suffix="만원" placeholder="예: 150000" value={form.price} onChange={update("price")} />
      <SeedTextInput label="연소득(부부합산)" type="number" min="0" suffix="만원" placeholder="예: 8000" value={form.income} onChange={update("income")} />
      <SeedTextInput label="기존 대출 잔액" type="number" min="0" suffix="만원" placeholder="선택" value={form.existingBalance} onChange={update("existingBalance")} />
      <SeedTextInput label="기존 대출 연간 원리금" type="number" min="0" suffix="만원" placeholder="예: 1200" value={form.existingPayment} onChange={update("existingPayment")} />
      <SeedSelect label="생애최초" value={form.firstHome} onChange={update("firstHome")} options={[{ value: "no", label: "아니오 (LTV 70% 가정)" }, { value: "yes", label: "예 (LTV 80% 가정)" }]} />
      <SeedSelect label="상환기간" value={form.years} onChange={update("years")} options={[{ value: "20", label: "20년" }, { value: "30", label: "30년" }, { value: "40", label: "40년" }]} />
    </div>
    {result ? <div className="loan-result"><div><span>추정 가능 대출</span><strong>{money(result.maxLoan)}</strong></div><div><span>LTV 한도</span><b>{money(result.ltvLimit)}</b></div><div><span>DSR 한도</span><b>{money(result.dsrLoan)}</b></div><div><span>예상 월 상환액</span><b>{money(result.monthly)}</b></div></div> : <div className="loan-empty">주택가격과 연소득을 입력하면 추정 한도를 계산합니다.</div>}
    <p className="loan-disclaimer">참고용 계산입니다. 실제 한도는 금융기관의 스트레스 DSR, 담보평가, 신용점수, 보유주택·대출 종류 및 지역 규제를 반영해 달라질 수 있습니다.</p>
  </section>;
}
