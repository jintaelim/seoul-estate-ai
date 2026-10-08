import test from "node:test";
import assert from "node:assert/strict";
import { complexCount, representativeTransactions } from "./src/utils.js";
import { fetchTransactions } from "./src/services/estateApi.js";

test("same apartment names in different districts remain distinct", () => {
  const base = { district:"강남구", dong:"삼성동", complex:"현대", area:84, price:100, dealDate:"2026-09-01" };
  const rows=[base,{...base,district:"노원구",dong:"월계동"},{...base,area:59}];
  assert.equal(complexCount(rows),2);
  assert.equal(representativeTransactions(rows).length,3);
});
test("manual refresh revalidates the saved ledger", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url,"/api/transactions?full=1&refresh=1");
    return {ok:true,json:async()=>({data:[],count:0})};
  });
  assert.equal((await fetchTransactions(undefined,true)).count,0);
});
test("truncated ledgers are rejected instead of displayed as full totals", async (t) => {
  t.mock.method(globalThis, "fetch", async()=>({ok:true,json:async()=>({data:[{id:"one"}],count:300})}));
  await assert.rejects(fetchTransactions(),/전체 건수/);
});
test("upstream errors are not converted to sample or partial browser data", async (t) => {
  t.mock.method(globalThis, "fetch", async()=>({ok:false,status:502,json:async()=>({error:"수집 실패"})}));
  await assert.rejects(fetchTransactions(),/수집 실패/);
});
