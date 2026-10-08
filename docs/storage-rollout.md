# Stored ledger rollout

## Current architecture

`npm run ingest` performs a one-time official-data collection independently of
user requests. `npm run worker` runs the local schedule in a separate process:
sales and permits every 30 minutes and rent every 6 hours. The web server is
read-only unless `INGEST_ENABLED=true` is explicitly set. The computer must stay
awake for local scheduling. Deployed Vercel reads never launch background work.

`/api/transactions`, `/api/rent-transactions` and `/api/land-permits` read a validated DB ledger, a short-lived
memory cache, or the last complete local snapshot. `refresh=1` rechecks the DB;
it never calls the public data provider. A missing initial snapshot returns 503,
not fake empty transactions. Old data retains its original collection timestamp.

## One-time Supabase setup

Run `supabase/ledger-storage.sql` in the existing project's SQL Editor. It is
rerunnable and does not modify legacy tables. Only service_role can access the
new tables and RPCs. The service role credential stays in server environment
variables, never VITE_ variables.

New tables: estate_ledgers (active collection metadata), estate_ledger_rows
(complete records with indexed date/district/complex), estate_sync_runs (jobs).
Publishing is one DB transaction. Partial collections cannot replace a complete
ledger; a full replacement incorporates cancellations and corrections, including
duplicate-looking genuine transactions. Concurrent publications are serialized,
and older collection runs cannot overwrite newer runs.

## Initialize and verify

1. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and MOLIT_API_KEY in `.env`.
2. Execute the SQL above.
3. Run `npm run ingest`. All three datasets must report `status: success` and
   `persistence.persisted: true`. `local_only` explicitly means the DB is not ready.
4. Start the read server with `npm start` and, when local scheduling is needed,
   start `npm run worker` in a separate process.
5. Check `/api/market-summary?dataset=land-permits` and
   `/api/land-permits?date=YYYY-MM-DD&page=1&limit=50`.

## Deployment

Set the same server variables and a random CRON_SECRET in Vercel. The authenticated
`/api/cron-ingest?dataset=transactions`, `?dataset=rent-transactions` and
`?dataset=land-permits` endpoints collect
directly; they do not call the public GET endpoints or trust request Host headers.
Missing secrets deny ingestion. `vercel.json` configures one daily run per dataset
(02:00/02:15/02:30 UTC for sales, permits and rent), compatible with Hobby's daily frequency. A 300-second function
budget is configured; verify the target plan supports it. If source retries exceed
this budget, run `npm run ingest` on a dedicated worker with an external scheduler.
For 30-minute hosted updates, configure a supported
scheduler/plan; it is not enabled by the daily schedule. No hosting purchase or
deployment is automatic.

## Performance and remaining scope

Public read responses use ETag/gzip plus `s-maxage` and stale-on-error CDN policies.
Unscoped raw ledger requests default to 50 rows, and page size is capped at 200.
The permit page fetches a compact
summary followed by the selected date/district/status only, in pages of 200.
Both GET endpoints support date/district/dong/complex/status/page/limit filters;
count is returned rows, totalCount is filtered total. `/api/market-summary` returns
date/district/status counts, never raw rows.

The transaction and records workspaces currently request the complete three-month
sales ledger explicitly because their charts and record calculations require the
full period; CDN caching prevents repeated DB reads. Search and rent use
`/api/apartment-search`, which filters inside Supabase and returns at most 20 rows
per page. Purchase uses the static Seoul district list and no longer downloads a
catalog. Opening a detail fetches only that complex's sales and rent rows. Permit
collection stores its exact parcel-to-complex matches once, so permit visitors do
not download the sales ledger. Collections recheck complete
three-month sales, three-month rent and 62-day permit scopes so corrections remain
consistent.

The read layer includes a generous per-instance burst limit (180 requests/minute).
For a multi-region production deployment, keep the CDN policy and add a shared
edge limiter if traffic abuse requires account-wide enforcement.

## Failure handling

Local mode keeps durable files under ignored `data/cache`. DB setup failures show
a warning and `local_only` status. Vercel ingestion requires successful persistent
DB publication; /tmp is not treated as durable. Errors retain the last complete
snapshot; UI does not receive a partial newly collected ledger. Monitor job finish
timestamps as well as status: terminated jobs can remain `running` in the history.
