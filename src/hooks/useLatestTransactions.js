import { useEffect, useState } from "react";
import { fetchLatestTransactions } from "../services/estateApi";

export function useLatestTransactions(enabled) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!enabled) { setLoading(false); return undefined; }
    const controller = new AbortController();
    setLoading(true); setError("");
    fetchLatestTransactions(controller.signal).then(payload => setTransactions(payload.data))
      .catch(reason => { if (reason.name !== "AbortError") setError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [enabled]);
  return { transactions, loading, error };
}
