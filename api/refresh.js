import { ingest } from "./_ingest.js";

// The browser refresh action is intentionally available only to the local
// server. Hosted environments should use the authenticated cron endpoint.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST 요청만 지원합니다." });
  if (process.env.VERCEL) return res.status(404).json({ error: "운영 환경은 예약 수집을 사용합니다." });

  const dataset = req.query?.dataset || "transactions";
  if (!["transactions", "rent-transactions", "land-permits"].includes(dataset)) {
    return res.status(400).json({ error: "지원하지 않는 원장입니다." });
  }

  try {
    return res.json(await ingest(dataset));
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
