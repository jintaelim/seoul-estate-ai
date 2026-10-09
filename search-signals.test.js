import test from "node:test";
import assert from "node:assert/strict";
import { buildApartmentCatalog } from "./api/apartment-catalog.js";
import { searchApartmentCatalog } from "./api/apartment-search.js";

const sale = (overrides = {}) => ({
  id: overrides.id || crypto.randomUUID(), district: "마포구", dong: "아현동", complex: "테스트단지",
  area: 84.9, supplyArea: 112, price: 90000, floor: 10, builtYear: 2018, dealDate: "2026-10-01",
  previousHigh: 100000, recentCount: 3, dealingGbn: "중개거래", address: "서울 마포구 아현동 1",
  households: 1000, rooms: 3, floorAreaRatio: 220, ...overrides,
});

test("catalog derives execution, price, rent, confidence and permit signals for an exact unit", () => {
  const sales = { latestDealDate: "2026-10-07", fetchedAt: "2026-10-08T00:00:00Z", coverage: { complete: true }, data: [
    sale({ id: "a1", dealDate: "2026-09-01", price: 100000, previousHigh: 0 }),
    sale({ id: "a2", dealDate: "2026-09-15", price: 95000, previousHigh: 100000 }),
    sale({ id: "a3" }),
  ] };
  const rents = { fetchedAt: sales.fetchedAt, coverage: { complete: true }, data: [
    { district: "마포구", dong: "아현동", complex: "테스트단지", area: 84.9, dealDate: "2026-09-10", deposit: 50000, monthlyRent: 0 },
    { district: "마포구", dong: "아현동", complex: "테스트단지", area: 84.9, dealDate: "2026-10-02", deposit: 55000, monthlyRent: 0 },
  ] };
  const permits = { data: [{ status: "허가", permitDate: "2026-09-20", matches: [sale({ id: "permit-match" })] }] };
  const [item] = buildApartmentCatalog(sales, rents, permits).data;

  assert.deepEqual({ trades: item.tradeCount90, days: item.tradeDays90, interval: item.medianIntervalDays }, { trades: 3, days: 3, interval: 15 });
  assert.equal(item.priceDrawdownRate, 10);
  assert.deepEqual({ ratio: item.jeonseRatio, gap: item.gapAmount, rents: item.rentCount, change: item.depositChange }, { ratio: 61, gap: 35000, rents: 2, change: 5000 });
  assert.deepEqual({ confidence: item.dataConfidence, permits: item.permitCount, approved: item.approvedPermitCount }, { confidence: "high", permits: 1, approved: 1 });
});

test("decision filters combine all five signals", () => {
  const matching = { id: "match", district: "마포구", dong: "아현동", complex: "테스트단지", area: 84.9, price: 90000,
    dealDate: "2026-10-01", dealingGbn: "중개거래", tradeCount90: 3, tradeDays90: 3, medianIntervalDays: 15,
    daysSinceTrade: 6, priceDrawdownRate: 10, latestJeonse: 55000, jeonseRatio: 61, gapAmount: 35000,
    rentCount: 2, rentAgeDays: 5, dataConfidence: "high", permitCount: 1, approvedPermitCount: 1 };
  const weak = { ...matching, id: "weak", complex: "표본부족", tradeCount90: 1, dataConfidence: "medium", permitCount: 0, approvedPermitCount: 0 };
  const result = searchApartmentCatalog([weak, matching], {
    dealType: "broker", minTrades: 3, maxInterval: 20, maxDaysSince: 10, minDiscount: 10,
    maxGap: 40000, minJeonseRatio: 60, minRentTrades: 2, maxRentAge: 10, quality: "high", permit: "approved",
  });

  assert.equal(result.totalCount, 1);
  assert.equal(result.data[0].id, "match");
});
