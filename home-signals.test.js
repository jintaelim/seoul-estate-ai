import test from "node:test";
import assert from "node:assert/strict";
import { buildHomeThemes } from "./api/_home-themes.js";

const sale = (date, price, extra = {}) => ({ id: `${date}-${price}`, district: "성동구", dong: "성수동", complex: "테스트아파트", area: 84.96, floor: 10, price, dealDate: date, dealingGbn: "중개거래", ...extra });
const rent = (date, deposit) => ({ id: `rent-${date}-${deposit}`, district: "성동구", dong: "성수동", complex: "테스트아파트", area: 84.96, floor: 8, deposit, monthlyRent: 0, dealDate: date, contractType: "신규" });

test("execution strength excludes direct trades and keeps distinct contract days", () => {
  const sales = [sale("2026-09-01", 100000), sale("2026-09-11", 101000), sale("2026-09-21", 102000), sale("2026-10-01", 103000),
    sale("2026-10-01", 200000, { id: "direct", dealingGbn: "직거래" })];
  const result = buildHomeThemes(sales, [], "2026-10-06");
  assert.equal(result.themes.liquidity[0].tradeCount90, 4);
  assert.equal(result.themes.liquidity[0].tradeDays90, 4);
  assert.equal(result.themes.liquidity[0].medianIntervalDays, 10);
  assert.equal(result.themes.liquidity[0].priceBandHigh < 200000, true);
});

test("rent defense and permit signals use the matching complex and area", () => {
  const sales = [sale("2026-10-01", 100000)];
  const rents = [rent("2026-09-01", 50000), rent("2026-10-02", 55000)];
  const permits = [{ district: "성동구", permitDate: "2026-10-03", status: "허가", purpose: "주거용", matches: [sales[0]] }];
  const result = buildHomeThemes(sales, rents, "2026-10-06", permits);
  assert.equal(result.themes.rentDefense[0].jeonseRatio, 55);
  assert.equal(result.themes.rentDefense[0].gapAmount, 45000);
  assert.equal(result.themes.rentDefense[0].depositChange, 5000);
  assert.equal(result.themes.permitImpact[0].approvedCount, 1);
});
