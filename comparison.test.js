import test from "node:test";
import assert from "node:assert/strict";
import { compareContracts, datePosition, formatArea } from "./src/comparison.js";
const item = { district: "도봉구", dong: "도봉동", complex: "도봉파크빌2", area: 84.35, price: 66000, dealDate: "2026-09-18" };
test("calendar month average keeps area scopes explicit and excludes cancellations", () => {
  const rows = [item, { ...item, area: 84.17, price: 61800 }, { ...item, price: 10000, cancelled: true }, { ...item, dong: "다른동", price: 1 }, { ...item, dealDate: "2026-08-27", price: 60700 }];
  assert.deepEqual(compareContracts(rows, item, "2026-09"), { count: 2, average: 63900 });
  assert.deepEqual(compareContracts(rows, item, "2026-09", "84.35"), { count: 1, average: 66000 });
  assert.deepEqual(compareContracts(rows, item, "2026-06"), { count: 0, average: null });
});
test("sale and rent dates share a chronological axis", () => {
  const dates = ["2026-09-01", "2026-09-11", "2026-09-21"];
  assert.equal(datePosition(dates[1], dates), 0.5);
  assert.equal(datePosition(dates[0], dates), 0);
  assert.equal(datePosition(dates[2], dates), 1);
  assert.equal(datePosition(dates[0], [dates[0]]), 0.5);
});
test("exclusive area retains source precision", () => assert.equal(formatArea(59.9335), "59.9335"));
