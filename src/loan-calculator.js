export const money = (value) => {
  const total = Math.max(0, Math.round(Number(value) || 0));
  const billions = Math.floor(total / 10000);
  const remainder = total % 10000;
  if (!billions) return `${remainder.toLocaleString("ko-KR")}만원`;
  return remainder
    ? `${billions.toLocaleString("ko-KR")}억 ${remainder.toLocaleString("ko-KR")}만원`
    : `${billions.toLocaleString("ko-KR")}억원`;
};

export function monthlyPayment(principal, annualRate, years) {
  const months = Math.max(1, years * 12);
  const rate = annualRate / 100 / 12;
  if (!rate) return principal / months;
  return principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
}

export function calculateLoan({ price, income, existingBalance = 0, existingPayment = 0, rate = 4.2, years = 30, firstHome = false }) {
  const ltvRate = firstHome ? 0.8 : 0.7;
  const ltvLimit = price * ltvRate;
  const dsrLimit = income * 0.4;
  const estimatedExistingAnnual = existingPayment || monthlyPayment(existingBalance, 5, 10) * 12;
  const availableAnnual = Math.max(0, dsrLimit - estimatedExistingAnnual);
  const monthlyCap = availableAnnual / 12;
  const paymentPerBillion = monthlyPayment(10000, rate, years);
  const dsrLoan = paymentPerBillion ? monthlyCap / paymentPerBillion * 10000 : 0;
  const maxLoan = Math.max(0, Math.min(ltvLimit, dsrLoan));
  return { ltvRate, ltvLimit, dsrLoan, maxLoan, monthly: monthlyPayment(maxLoan, rate, years), availableAnnual };
}
