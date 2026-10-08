import { useEffect, useState } from "react";

export default function RefreshButton({
  className = "",
  loading = false,
  refreshedAt = 0,
  onClick,
  label = "새로고침",
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!refreshedAt) return undefined;
    setConfirmed(true);
    const timeout = window.setTimeout(() => setConfirmed(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [refreshedAt]);

  const state = loading ? "loading" : confirmed ? "success" : "idle";
  const text = loading ? "확인 중" : confirmed ? "확인 완료" : label;

  return (
    <button
      className={`refresh-button ${state} ${className}`.trim()}
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-live="polite"
    >
      <i aria-hidden="true">{confirmed && !loading ? "✓" : ""}</i>
      <span>{text}</span>
    </button>
  );
}
