export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const expected = process.env.CRON_SECRET;
  const provided = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (expected && provided !== expected) return res.status(401).json({ error: "Unauthorized" });
  const origin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://${req.headers.host}`;
  try {
    const response = await fetch(`${origin}/api/transactions`, { headers: { "x-cron-ingest": "1" } });
    const payload = await response.json();
    res.status(response.status).json(payload);
  } catch (error) { res.status(502).json({ error: error.message }); }
}
