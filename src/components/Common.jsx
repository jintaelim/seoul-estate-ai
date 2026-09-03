import { formatPrice, isRecord } from "../utils";

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
          {isRecord(item) && <span className="hibadge">신고가</span>}
          {item.permitZone && <span className="hibadge permit-badge">토허</span>}
        </span>
        <span className="dinfo">{item.dong} · {item.floor}층</span>
      </span>
      <span className="darea">{item.area.toFixed(0)}㎡</span>
      <span className={`dprice ${isRecord(item) ? "hi" : ""}`}>{formatPrice(item.price)}</span>
      <span className="ddate">{Number(month)}/{Number(day)}</span>
    </button>
  );
}

export function Empty({ children }) {
  return <div className="deal-empty">{children}</div>;
}
