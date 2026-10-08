import test from "node:test";
import assert from "node:assert/strict";
import { calculateLoan, money, monthlyPayment } from "./src/loan-calculator.js";

test("loan money labels do not round into a duplicated billion remainder", () => {
  assert.equal(money(59999), "5억 9,999만원");
  assert.equal(money(60000), "6억원");
  assert.equal(money(775), "775만원");
});

test("monthly repayment responds to rate and term", () => {
  const twentyYears = monthlyPayment(50000, 4.2, 20);
  const fortyYears = monthlyPayment(50000, 4.2, 40);
  const higherRate = monthlyPayment(50000, 6, 40);
  assert.ok(twentyYears > fortyYears);
  assert.ok(higherRate > fortyYears);
});

test("loan calculator keeps all money inputs in ten-thousand-won units", () => {
  const result = calculateLoan({ price: 150000, income: 8000, rate: 4.2, years: 30 });
  assert.equal(result.ltvLimit, 105000);
  assert.ok(result.dsrLoan > 50000 && result.dsrLoan < 60000);
  assert.equal(result.maxLoan, result.dsrLoan);
  assert.ok(result.monthly > 260 && result.monthly < 270);
});
