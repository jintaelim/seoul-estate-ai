import test from "node:test";
import assert from "node:assert/strict";
import { cacheControl, guardReadRequest } from "./api/_http.js";
import { normalizeApartmentKeyword, searchApartmentCatalog } from "./api/apartment-search.js";
import { enrichPermitsWithTransactions } from "./api/_collect-permits.js";

const units = [58.01, 59.2, 59.28].map((area, index) => ({
  id: String(index), district: "노원구", dong: "상계동", complex: "상계주공6(고층)",
  area, price: 80000 + index, builtYear: 1988, dealDate: `2026-09-${20 + index}`,
  recentCount: 10, previousHigh: 70000, latestJeonse: 0,
}));

test("apartment search normalizes spaces, complex suffixes and parentheses", () => {
  assert.equal(normalizeApartmentKeyword("상계주공 6단지"), "상계주공6");
  const result = searchApartmentCatalog(units, { keyword: "상계주공 6단지", limit: 20 });
  assert.equal(result.totalCount, 3);
  assert.deepEqual(result.data.map(row => row.area).sort((a, b) => a - b), [58.01, 59.2, 59.28]);
});

test("apartment search returns bounded pages", () => {
  const result = searchApartmentCatalog(units, { page: 2, limit: 2 });
  assert.equal(result.count, 1);
  assert.equal(result.totalCount, 3);
  assert.equal(result.hasMore, false);
});

test("read responses are edge cacheable unless refresh is explicit", () => {
  assert.match(cacheControl({ query: {} }), /s-maxage=300/);
  assert.equal(cacheControl({ query: { refresh: "1" } }), "no-store");
});

test("permit collection stores matching apartment identities once", () => {
  const permit = { data: [{ id: "p1", address: "서울 노원구 상계동 720" }], count: 1 };
  const sales = { fetchedAt: "2026-09-28T00:00:00.000Z", data: [
    { ...units[0], address: "서울 노원구 상계동 720" },
    { ...units[1], address: "서울 노원구 상계동 720" },
  ] };
  const result = enrichPermitsWithTransactions(permit, sales);
  assert.equal(result.data[0].matches.length, 1);
  assert.equal(result.data[0].matches[0].complex, "상계주공6(고층)");
  assert.equal(result.complexMatchBasis, sales.fetchedAt);
});

test("burst protection returns a retryable 429", () => {
  const req = { headers: { "x-forwarded-for": "203.0.113.10" } };
  const res = { headers: {}, code: 200, setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
  for (let index = 0; index < 181; index++) guardReadRequest(req, res);
  assert.equal(res.code, 429);
  assert.ok(Number(res.headers["Retry-After"]) > 0);
});
