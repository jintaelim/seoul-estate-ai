import { useEffect, useState } from "react";
import { fetchHomeThemes } from "../services/estateApi";

export function useHomeThemes(enabled = true) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!enabled) { setLoading(false); return undefined; }
    const controller = new AbortController();
    setLoading(true); setError("");
    fetchHomeThemes(controller.signal).then(setPayload)
      .catch(reason => { if (reason.name !== "AbortError") setError(reason.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [enabled]);
  return { payload, loading, error };
}
