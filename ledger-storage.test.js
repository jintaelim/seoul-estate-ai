import test from "node:test";
import assert from "node:assert/strict";
import { gunzipSync } from "node:zlib";
import { validSnapshot, selectLedger, sendJson, getLedger, database } from "./api/_ledger-store.js";
import { summarizeLedger } from "./api/market-summary.js";
import cron from "./api/cron-ingest.js";
import { fetchTransactions } from "./src/services/estateApi.js";
import { buildApartmentCatalog } from "./api/apartment-catalog.js";

const sample = { fetchedAt: new Date().toISOString(), coverage: { complete: true }, count: 3,
  data: [{ id: "1", district: "강남구", dealDate: "2026-09-22", complex: "A" },
    { id: "2", district: "강남구", dealDate: "2026-09-22", complex: "B" },
    { id: "3", district: "강서구", dealDate: "2026-09-21", complex: "C" }] };
const response = () => ({ headers: {}, code: 200, setHeader(k,v) { this.headers[k] = v; },
  status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; },
  send(value) { this.body = value; return this; }, end() { return this; } });
function env(t, key, value) {
  const original = process.env[key];
  process.env[key] = value;
  t.after(() => { if (original === undefined) delete process.env[key]; else process.env[key] = original; });
}

test("incomplete or truncated collections cannot be published", () => {
  assert.equal(validSnapshot(sample), true);
  assert.equal(validSnapshot({ ...sample, count: 4 }), false);
  assert.equal(validSnapshot({ ...sample, coverage: { complete: false } }), false);
  assert.equal(validSnapshot({ ...sample, data: [], count: 0 }), true);
});
test("successful minimal database writes do not require a JSON response", async t => {
  env(t, "SUPABASE_URL", "https://storage.example");
  env(t, "SUPABASE_SERVICE_ROLE_KEY", "test-key");
  t.mock.method(globalThis, "fetch", async () => ({ ok: true, status: 201,
    json: async () => { throw new Error("Empty body"); } }));
  assert.equal(await database("estate_sync_runs", {
    method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
  }), null);
});
test("pagination keeps total counts distinct from returned rows", () => {
  const value = selectLedger(sample, { district: "강남구", page: "2", limit: "1" });
  assert.equal(value.count, 1);
  assert.equal(value.totalCount, 2);
  assert.equal(value.data[0].id, "2");
  assert.equal(value.hasMore, false);
  assert.throws(() => selectLedger(sample, { limit: "201" }));
  assert.throws(() => selectLedger(sample, { page: "NaN" }));
});
test("apartment catalog joins only the same district, complex and area", () => {
  const sales = { ...sample, data: [{ ...sample.data[0], area: 84, price: 100000, floor: 7, builtYear: 2010, recentCount: 2 }] };
  const rents = { fetchedAt: sample.fetchedAt, coverage: { complete: true }, data: [
    { district: "강남구", dong: undefined, complex: "A", area: 84, dealDate: "2026-09-21", deposit: 60000, monthlyRent: 0 },
    { district: "강남구", dong: undefined, complex: "A", area: 59, dealDate: "2026-09-22", deposit: 50000, monthlyRent: 0 },
  ] };
  const catalog = buildApartmentCatalog(sales, rents);
  assert.equal(catalog.count, 1);
  assert.equal(catalog.data[0].latestJeonse, 60000);
  assert.equal(catalog.data[0].rentCount, 1);
});
test("rent ledger filters contract period and type before pagination", () => {
  const rents = { ...sample, count: 2, data: [
    { dealDate: "2026-09-20", rentType: "전세" },
    { dealDate: "2026-08-20", rentType: "월세" },
  ] };
  const selected = selectLedger(rents, { from: "2026-09-01", rentType: "전세", page: "1", limit: "20" });
  assert.equal(selected.totalCount, 1);
  assert.equal(selected.data[0].rentType, "전세");
});
test("summary counts are calculated from the same complete ledger", () => {
  const value = summarizeLedger(sample);
  assert.equal(value.data, undefined);
  assert.equal(value.groups.reduce((sum, row) => sum + row.count, 0), sample.count);
  assert.equal(value.groups[0].count, 2);
});
test("ETag avoids retransmission and gzip preserves the response", () => {
  const initial = response();
  sendJson({ headers: { "accept-encoding": "gzip" } }, initial, sample);
  assert.deepEqual(JSON.parse(gunzipSync(initial.body)), sample);
  const unchanged = response();
  sendJson({ headers: { "if-none-match": initial.headers.ETag } }, unchanged, sample);
  assert.equal(unchanged.code, 304);
  assert.equal(unchanged.body, undefined);
});
test("public refresh reads the database and never calls public data collectors", async t => {
  env(t, "SUPABASE_URL", "https://storage.example");
  env(t, "SUPABASE_SERVICE_ROLE_KEY", "test-key");
  t.mock.method(globalThis, "fetch", async url => {
    assert.equal(url, "https://storage.example/rest/v1/rpc/read_estate_ledger");
    return { ok: true, status: 200, json: async () => sample };
  });
  const result = await getLedger("transactions", { refresh: true });
  assert.equal(result.count, sample.count);
});
test("ingest fails closed when CRON_SECRET is missing or incorrect", async t => {
  env(t, "CRON_SECRET", "");
  const missing = response();
  await cron({ headers: {}, query: {} }, missing);
  assert.equal(missing.code, 503);
  process.env.CRON_SECRET = "correct";
  const denied = response();
  await cron({ headers: { authorization: "Bearer wrong" }, query: {} }, denied);
  assert.equal(denied.code, 401);
});
test("client reuses an unchanged full ledger after 304", async t => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls++;
    if (calls === 1) return { ok: true, status: 200, headers: new Headers({ etag: '"abc"' }), json: async () => sample };
    if (url === "/api/refresh?dataset=transactions") return { ok: true, status: 200, json: async () => ({ status: "success" }) };
    assert.equal(options.headers["If-None-Match"], '"abc"');
    return { status: 304 };
  });
  assert.deepEqual(await fetchTransactions(), await fetchTransactions(undefined, true));
});
