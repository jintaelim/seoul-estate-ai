import { useEffect, useState } from "react";
import { fetchLatestTransactions } from "../services/estateApi";

export function useLatestTransactions(enabled) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!enabled) { setLoading(false); return undefined; }
    const controller = new AbortController();
    setLoading(true);
    fetchLatestTransactions(controller.signal).then(payload => setTransactions(payload.data))
      .catch(reason => setError(reason.message)).finally(() => setLoading(false));
    return () => controller.abort();
  }, [enabled]);
  return { transactions, loading, error };
}
