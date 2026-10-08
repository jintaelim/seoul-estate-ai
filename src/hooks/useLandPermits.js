import { useEffect, useRef, useState } from "react";
import { fetchPermitDay } from "../services/estateApi";

export function useLandPermits(date = "", district = "전체", status = "허가") {
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(0);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const lastSuccess = useRef(null);
  const lastScope = useRef("");
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const scope = JSON.stringify([date, district, status]);
    const isRefresh = lastScope.current === scope && Boolean(lastSuccess.current);
    lastScope.current = scope;
    if (isRefresh) setRefreshing(true);
    else { setLoading(true); setData([]); setRefreshedAt(0); }
    setError("");
    fetchPermitDay({ date, district, status, refresh: refreshKey > 0 }, controller.signal)
      .then(payload => {
        if (!active) return;
        lastSuccess.current = payload;
        setData(payload.data);
        setMetadata({ ...payload, data: undefined });
        if (isRefresh && !payload.warning) setRefreshedAt(Date.now());
        if (payload.warning) setError(payload.warning);
      })
      .catch(reason => {
        if (!active) return;
        if (!isRefresh) {
          setData([]);
          setMetadata(null);
        }
        setError(reason.message || "허가 원장을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setRefreshing(false);
      });
    return () => { active = false; controller.abort(); };
  }, [refreshKey, date, district, status]);
  return {
    permits: data,
    metadata,
    loading,
    refreshing,
    refreshedAt,
    error,
    retry: () => {
      if (!loading && !refreshing) setRefreshKey(value => value + 1);
    },
  };
}
