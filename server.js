import express from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const root = dirname(fileURLToPath(import.meta.url));
try {
  for (const line of readFileSync(join(root, ".env"), "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
} catch {}
const app = express();
const port = Number(process.env.PORT || 3100);
// Import after environment initialization; local and deployed APIs share handlers.
for (const route of ["transactions", "candidate-transactions", "rent-transactions", "land-permits", "apartment-catalog", "apartment-search", "apartment-basic", "apartment-meta", "health", "market-summary", "cron-ingest", "refresh"]) {
  const { default: handler } = await import(`./api/${route}.js`);
  app[route === "refresh" || route === "cron-ingest" ? "all" : "get"](`/api/${route}`, (req, res, next) => Promise.resolve(handler(req, res)).catch(next));
}
app.use("/api", (_req, res) => res.status(404).json({ error: "존재하지 않는 API입니다." }));
app.use(express.static(join(root, "dist")));
app.get("*", (_req, res) => res.sendFile(join(root, "dist", "index.html")));
app.use((_error, _req, res, _next) => res.status(500).json({ error: "요청 처리에 실패했습니다." }));
app.listen(port, "127.0.0.1", () => console.log(`Seoul Estate AI: http://localhost:${port}`));
if (process.env.INGEST_ENABLED === "true") {
  const { startLocalIngestion } = await import("./api/_ingest.js");
  startLocalIngestion();
}
