import test from "node:test";
import assert from "node:assert/strict";
import { yearMonth, assertMolitResponse, enrichTransactions } from "./transaction-domain.js";
test("month boundaries and Seoul time", () => {
  assert.equal(yearMonth(1, new Date("2026-03-31T00:00:00Z")), "202602");
  assert.equal(yearMonth(0, new Date("2026-08-31T16:00:00Z")), "202609");
});
test("HTTP-success business errors are rejected", () => {
  assert.throws(() => assertMolitResponse({ response: { header: { resultCode: "30" } } }));
  assert.deepEqual(assertMolitResponse({ response: { header: { resultCode: "000" }, body: { totalCount: 0 } } }), { totalCount: 0 });
});
test("previous highs use earlier dates, exact area and district identities", () => {
  const base = { district:"강남구", dong:"삼성동", complex:"현대", area:84, price:100, dealDate:"2026-07-01" };
  const rows = enrichTransactions([base, {...base, price:120, dealDate:"2026-07-02"}, {...base, price:130, dealDate:"2026-07-02"}, {...base, district:"구로구", price:50, dealDate:"2026-07-03"}]);
  assert.equal(rows.find(x=>x.price===120).previousHigh,100);
  assert.equal(rows.find(x=>x.price===130).previousHigh,100);
  assert.equal(rows.find(x=>x.price===50).previousHigh,0);
  assert.equal(rows.find(x=>x.price===100).previousHigh,0);
  assert.ok(rows.every(x=>x.permitZone===null));
});
