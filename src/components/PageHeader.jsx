import { Badge } from "@seed-design/react";
import { Link } from "react-router-dom";

export default function PageHeader({ eyebrow, title, description, meta, backTo = "/", metaLabel = "공개 실거래", sourceLabel = "국토교통부 · 계약일 기준" }) {
  return (
    <section className="page-header">
      <div className="page-header-copy">
        <Link className="page-back" to={backTo}>← 전체 현황</Link>
        <span className="kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-header-meta">
        <Badge size="medium" variant="weak" tone="informative">{metaLabel}</Badge>
        <strong>{meta}</strong>
        <small>{sourceLabel}</small>
      </div>
    </section>
  );
}
