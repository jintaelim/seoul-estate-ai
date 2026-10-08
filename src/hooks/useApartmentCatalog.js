import { useEffect, useRef, useState } from "react";
import { fetchApartmentCatalog } from "../services/estateApi";

export function useApartmentCatalog(enabled = true) {
  const [items, setItems] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  const loaded = useRef(false);
  useEffect(() => {
    if (!enabled || loaded.current) return undefined;
    const controller = new AbortController();
    setLoading(true);
    fetchApartmentCatalog(controller.signal).then(payload => {
      loaded.current = true;
      setItems(payload.data);
      setMetadata({ ...payload, data: undefined });
    }).catch(reason => setError(reason.message)).finally(() => setLoading(false));
    return () => controller.abort();
  }, [enabled]);
  return { items, metadata, loading, error };
}
