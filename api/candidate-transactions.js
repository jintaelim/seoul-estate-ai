import { fetchCandidateTransactions, normalizeMonthsParam } from "../candidate-service.js";

const SERVICE_KEY = process.env.MOLIT_API_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const months = normalizeMonthsParam(req.query?.months, 12);

  try {
    const result = await fetchCandidateTransactions({ serviceKey: SERVICE_KEY, months });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
