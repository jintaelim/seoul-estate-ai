import { createHash, randomUUID } from "node:crypto";
import { gzipSync } from "node:zlib";
import { readSnapshot, writeSnapshot } from "./_snapshot.js";
import { cacheControl, guardReadRequest, noStore } from "./_http.js";

const memory = new Map();
const reads = new Map();
export const datasets = ["transactions", "rent-transactions", "land-permits"];
export const databaseConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function database(path, options = {}) {
  const { timeoutMs = 20000, ...requestOptions } = options;
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...requestOptions,
    signal: AbortSignal.timeout(timeoutMs),
    headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json", ...requestOptions.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`DB ${response.status} (${body.code || "request-failed"}): 원장 DB 연결 또는 ledger 스키마를 확인하세요.`);
  }
  if (response.status === 204 || requestOptions.headers?.Prefer?.split(",").some(value => value.trim() === "return=minimal")) return null;
  return response.json();
}

export function validSnapshot(value) {
  return Boolean(value && Array.isArray(value.data) && value.count === value.data.length
    && Number.isFinite(Date.parse(value.fetchedAt)) && value.coverage?.complete === true);
}

export async function getLedger(dataset, { refresh = false } = {}) {
  if (!datasets.includes(dataset)) throw new Error("Unknown dataset");
  const cached = memory.get(dataset);
  if (!refresh && cached && Date.now() - cached.checkedAt < 30000) return cached.value;
  if (reads.has(dataset)) return reads.get(dataset);
  const pending = (async () => {
    let value = cached?.value;
    if (!value) value = await readSnapshot(dataset);
    if (!validSnapshot(value)) value = null;
    let warning;
    if (databaseConfigured()) {
      try {
        const remote = await database("rpc/read_estate_ledger", { method: "POST", body: JSON.stringify({ p_dataset: dataset }) });
        if (remote && !validSnapshot(remote)) throw new Error("DB 원장 건수가 일치하지 않습니다.");
        if (remote && (!value || remote.fetchedAt >= value.fetchedAt)) {
          value = { ...remote, persistence: { persisted: true, local: false } };
        } else if (!remote) warning = "DB 초기 적재 대기 중입니다. 마지막 저장 원장을 표시합니다.";
      } catch (error) { warning = error.message; }
    }
    if (!value) throw new Error(warning || "저장된 원장이 없습니다. 초기 수집이 완료되면 표시됩니다.");
    const { warning: oldWarning, ...clean } = value;
    value = { ...clean, ...(warning ? { warning } : {}) };
    memory.set(dataset, { value, checkedAt: Date.now() });
    return value;
  })().finally(() => reads.delete(dataset));
  reads.set(dataset, pending);
  return pending;
}

export async function publishLedger(dataset, value) {
  if (!validSnapshot(value)) throw new Error("불완전한 원장은 게시하지 않습니다.");
  const snapshot = { ...value, persistence: { persisted: false, local: false } };
  let storageWarning;
  if (databaseConfigured()) {
    try {
      if (value.count > 5000) {
        const runId = randomUUID();
        const chunks = [];
        for (let offset = 0; offset < value.data.length; offset += 2000) {
          chunks.push(value.data.slice(offset, offset + 2000).map((payload, index) => ({
            run_id: runId, dataset, ordinal: offset + index + 1, payload,
          })));
        }
        try {
          for (let index = 0; index < chunks.length; index += 3) {
            await Promise.all(chunks.slice(index, index + 3).map(rows => database("estate_ledger_staging", {
              method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(rows),
            })));
          }
          const { data, warning, persistence, ...metadata } = value;
          await database("rpc/publish_estate_ledger_staged", { method: "POST", timeoutMs: 120000, body: JSON.stringify({
            p_dataset: dataset, p_metadata: metadata, p_run_id: runId, p_expected_count: value.count,
          }) });
        } catch (error) {
          await database(`estate_ledger_staging?run_id=eq.${runId}`, { method: "DELETE" }).catch(() => {});
          throw error;
        }
      } else {
        await database("rpc/publish_estate_ledger", { method: "POST", body: JSON.stringify({ p_dataset: dataset, p_payload: value }) });
      }
      snapshot.persistence.persisted = true;
    } catch (error) {
      if (process.env.VERCEL) throw error;
      storageWarning = error.message;
    }
  } else if (process.env.VERCEL) throw new Error("운영 환경의 SUPABASE 설정이 필요합니다.");
  // Local development can operate with durable files while DB migration is pending.
  snapshot.persistence.local = true;
  try { await writeSnapshot(snapshot, dataset); }
  catch (error) { snapshot.persistence.local = false; if (!snapshot.persistence.persisted) throw error; }
  if (storageWarning) snapshot.warning = storageWarning;
  memory.set(dataset, { value: snapshot, checkedAt: Date.now() });
  return snapshot;
}

export async function readFilteredLedger(dataset, query) {
  const page = Number(query.page || 1), limit = Number(query.limit || 50);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 200) throw new Error("페이지는 1 이상, 페이지 크기는 1~200이어야 합니다.");
  return database("rpc/read_estate_ledger_filtered", { method: "POST", body: JSON.stringify({
    p_dataset: dataset, p_date: query.date || null, p_from: query.from || null,
    p_district: query.district || null, p_dong: query.dong || null, p_complex: query.complex || null,
    p_status: query.status || null, p_rent_type: query.rentType || null,
    p_offset: (page - 1) * limit, p_limit: limit,
  }) });
}

export function selectLedger(value, query = {}) {
  const pageRequested = query.page != null || query.limit != null;
  const page = Number(query.page || 1), limit = Number(query.limit || 50);
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 200) throw new Error("페이지는 1 이상, 페이지 크기는 1~200이어야 합니다.");
  const data = value.data.filter(row => (!query.date || (row.dealDate || row.permitDate) === query.date)
    && (!query.district || row.district === query.district)
    && (!query.dong || row.dong === query.dong)
    && (!query.complex || row.complex === query.complex)
    && (!query.status || row.status === query.status)
    && (!query.rentType || row.rentType === query.rentType)
    && (!query.from || (row.dealDate || row.permitDate) >= query.from));
  const selected = pageRequested ? data.slice((page - 1) * limit, page * limit) : data;
  return { ...value, data: selected, count: selected.length, totalCount: data.length,
    ...(pageRequested ? { page, limit, hasMore: page * limit < data.length } : {}),
    stale: Date.now() - Date.parse(value.fetchedAt) > 3600000 };
}

export function sendJson(req, res, value, cacheOptions) {
  const body = JSON.stringify(value);
  const etag = `"${createHash("sha256").update(body).digest("hex")}"`;
  res.setHeader("Cache-Control", cacheControl(req, cacheOptions));
  res.setHeader("ETag", etag);
  res.setHeader("Vary", "Accept-Encoding");
  if (req.headers?.["if-none-match"] === etag) return res.status(304).end();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (/\bgzip\b/.test(req.headers?.["accept-encoding"] || "")) {
    res.setHeader("Content-Encoding", "gzip");
    return res.send(gzipSync(body));
  }
  return res.send(body);
}

export async function serveLedger(dataset, req, res) {
  if (!guardReadRequest(req, res)) return;
  try {
    const fullRequested = req.query?.full === "1";
    const query = fullRequested || req.query?.page != null || req.query?.limit != null
      ? req.query
      : { ...req.query, page: "1", limit: "50" };
    if (databaseConfigured() && !fullRequested) {
      try {
        const filtered = await readFilteredLedger(dataset, query);
        if (!filtered) throw new Error("저장된 원장이 없습니다.");
        return sendJson(req, res, { ...filtered, page: Number(query.page || 1), limit: Number(query.limit || 50),
          persistence: { persisted: true, local: false }, stale: Date.now() - Date.parse(filtered.fetchedAt) > 3600000 });
      } catch (error) {
        if (process.env.VERCEL) throw error;
      }
    }
    const value = await getLedger(dataset, { refresh: req.query?.refresh === "1" });
    let selected;
    try { selected = selectLedger(value, query); }
    catch (error) { return res.status(400).json({ error: error.message }); }
    return sendJson(req, res, selected);
  } catch (error) {
    noStore(res);
    return res.status(503).json({ error: error.message });
  }
}
