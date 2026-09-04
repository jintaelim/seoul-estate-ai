import { useEffect, useState } from "react";
import { fetchTransactions, readTransactionCache } from "../services/estateApi";

export function useTransactions() {
  const cached = readTransactionCache();
  // API 응답 전 샘플 날짜(2026-05-12)를 실거래처럼 노출하지 않습니다.
  // 이전에 성공적으로 저장한 브라우저 캐시가 있을 때만 즉시 보여줍니다.
  const [transactions, setTransactions] = useState(cached ?? []);
  const [source, setSource] = useState(cached ? "cache" : "loading");
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
      .catch((reason) => {
        if (!active) return;
        // 캐시가 있으면 마지막 성공 원장을 유지하고, 없으면 빈 상태로 둡니다.
        // 샘플 데이터를 최신 실거래로 오인하지 않도록 합니다.
        if (!cached) setTransactions([]);
        setSource(cached ? "cache" : "unavailable");
        setError(reason.message || "최신 실거래를 불러오지 못했습니다.");
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [refreshKey]);

  return { transactions, source, loading, error, retry: () => setRefreshKey((key) => key + 1) };
}
