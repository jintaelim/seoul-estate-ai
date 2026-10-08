import { Badge } from "@seed-design/react";
import { formatHousingArea, formatPrice, isRecord } from "../utils";

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="sheader">
      <div>
        <span className="kicker">{eyebrow}</span>
        <h2 className="stitle">{title}</h2>
        {description && <p className="sdesc">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DealRow({ item, onSelect }) {
  const [, month, day] = item.dealDate.split("-");
  return (
    <button className="di" type="button" onClick={() => onSelect?.(item)}>
      <span className="dgu">{item.district}</span>
      <span>
        <span className="dname">
          {item.complex}
          {isRecord(item) && <Badge className="hibadge" size="medium" variant="weak" tone="critical">신고가</Badge>}
          {item.permitZone && <Badge className="hibadge permit-badge" size="medium" variant="weak" tone="warning">토허</Badge>}
        </span>
        <span className="dinfo">{item.dong} · {item.floor}층</span>
      </span>
      <span className="darea">{formatHousingArea(item)}</span>
      <span className={`dprice ${isRecord(item) ? "hi" : ""}`}>{formatPrice(item.price)}</span>
      <span className="ddate">{Number(month)}/{Number(day)}</span>
    </button>
  );
}

export function Empty({ children }) {
  return <div className="deal-empty">{children}</div>;
}
