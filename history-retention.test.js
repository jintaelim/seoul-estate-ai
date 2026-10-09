import test from "node:test";
import assert from "node:assert/strict";
import { mergeRollingLedger } from "./api/_ingest.js";

const sale = (id, dealDate, price) => ({
  id, district: "노원구", dong: "상계동", complex: "테스트", area: 84.96,
  floor: 10, price, builtYear: 2010, dealDate, dealingGbn: "중개거래",
});

test("rolling collection replaces refreshed months and retains older history", () => {
  const previous = {
    data: [sale("cancelled", "2026-10-01", 90000), sale("history", "2025-10-01", 80000)],
    count: 2, fetchedAt: "2026-10-08T00:00:00.000Z", coverage: { complete: true, months: ["202610", "202510"] },
  };
  const fresh = {
    data: [sale("current", "2026-10-02", 95000)], count: 1, fetchedAt: "2026-10-09T00:00:00.000Z",
    latestDealDate: "2026-10-02", coverage: { complete: true, months: ["202610"] },
  };
  const merged = mergeRollingLedger(previous, fresh, "transactions");
  assert.deepEqual(merged.data.map(row => row.id), ["current", "history"]);
  assert.equal(merged.data[0].previousHigh, 80000);
  assert.deepEqual(merged.coverage.months, ["202610", "202510"]);
  assert.equal(merged.coverage.retainedHistory, true);
});
