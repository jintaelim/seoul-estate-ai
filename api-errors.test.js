import test from "node:test";
import assert from "node:assert/strict";
import { storageError, rentError } from "./api/_errors.js";
test("DNS failure is explained without leaking configured host or key", () => {
  const error = new Error("fetch failed", {cause:{code:"ENOTFOUND"}});
  assert.match(storageError(error), /DB_DNS_ERROR/);
});
test("rent registration error distinguishes service registration from empty data", () => {
  assert.match(rentError(403, {OpenAPI_ServiceResponse:{cmmMsgHeader:{returnReasonCode:30}}}), /등록되지 않은 인증키/);
  assert.equal(rentError(500, {}), "전월세 API 500");
});
