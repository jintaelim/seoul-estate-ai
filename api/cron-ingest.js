import { timingSafeEqual } from "node:crypto";
import { ingest } from "./_ingest.js";
export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  const expected = process.env.CRON_SECRET;
  const provided = req.headers.authorization?.replace(/^Bearer\s+/i, "") || "";
  res.setHeader("Cache-Control", "no-store");
  if (!expected) return res.status(503).json({ error: "CRON_SECRET 설정이 필요합니다." });
  if (Buffer.byteLength(expected) !== Buffer.byteLength(provided) || !timingSafeEqual(Buffer.from(expected), Buffer.from(provided))) return res.status(401).json({ error: "Unauthorized" });
  const dataset = req.query?.dataset || "transactions";
  if (!["transactions", "rent-transactions", "land-permits", "home-themes", "apartment-metadata"].includes(dataset)) return res.status(400).json({ error: "지원하지 않는 원장입니다." });
  try {
    res.json(await ingest(dataset));
  } catch (error) { res.status(502).json({ error: error.message }); }
}
