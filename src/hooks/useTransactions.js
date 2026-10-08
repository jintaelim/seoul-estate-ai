import { useEffect, useRef, useState } from "react";
import { fetchTransactions } from "../services/estateApi";

export function useTransactions(enabled = true) {
  // The server persists the complete ledger. A 300-row browser cache cannot
  // represent district totals or historical highs.
  const [transactions, setTransactions] = useState([]);
  const [source, setSource] = useState("loading");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(0);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastSuccess = useRef(null);

  useEffect(() => {
    if (!enabled) { setLoading(false); return undefined; }
    let active = true;
    const controller = new AbortController();
    const isRefresh = refreshKey > 0 && Boolean(lastSuccess.current);
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    fetchTransactions(controller.signal, refreshKey > 0)
      .then((payload) => {
        if (!active) return;
        lastSuccess.current = payload;
        setTransactions(payload.data);
        setMetadata({ ...payload, data: undefined });
        setSource(payload.source === "stale" ? "cache" : "molit");
        if (refreshKey > 0 && !payload.warning) setRefreshedAt(Date.now());
        if (payload.warning) setError(payload.warning);
      })
      .catch((reason) => {
        if (!active) return;
        setSource(lastSuccess.current ? "cache" : "unavailable");
        setError(reason.message || "최신 실거래를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setRefreshing(false);
      });
    return () => { active = false; controller.abort(); };
  }, [refreshKey, enabled]);

  return {
    transactions,
    source,
    loading,
    refreshing,
    refreshedAt,
    error,
    metadata,
    retry: () => {
      if (!loading && !refreshing) setRefreshKey((key) => key + 1);
    },
  };
}
