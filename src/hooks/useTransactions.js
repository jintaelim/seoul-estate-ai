import { useEffect, useState } from "react";
import { sampleTransactions } from "../data/sampleTransactions";
import { fetchTransactions, readTransactionCache } from "../services/estateApi";

export function useTransactions() {
  const cached = readTransactionCache();
  const [transactions, setTransactions] = useState(cached ?? sampleTransactions);
  const [source, setSource] = useState(cached ? "cache" : "sample");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchTransactions()
      .then((payload) => {
        if (!active) return;
        setTransactions(payload.data);
        setSource("molit");
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return { transactions, source, loading };
}
