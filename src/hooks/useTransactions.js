import { useEffect, useState } from "react";
import { sampleTransactions } from "../data/sampleTransactions";
import { fetchTransactions, readTransactionCache } from "../services/estateApi";

export function useTransactions() {
  const cached = readTransactionCache();
  const [transactions, setTransactions] = useState(cached ?? sampleTransactions);
  const [source, setSource] = useState(cached ? "cache" : "sample");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchTransactions()
      .then((payload) => {
        if (!active) return;
        setTransactions(payload.data);
        setSource("molit");
      })
      .catch((reason) => active && setError(reason.message || "최신 실거래를 불러오지 못했습니다."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [refreshKey]);

  return { transactions, source, loading, error, retry: () => setRefreshKey((key) => key + 1) };
}
