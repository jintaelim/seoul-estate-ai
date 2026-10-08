export const formatPrice = (price = 0) => {
  const eok = Math.floor(price / 10000);
  const man = price % 10000;
  return `${eok ? `${eok}억` : ""}${man ? ` ${man.toLocaleString("ko-KR")}만` : ""}`.trim() || "0원";
};

export const pyeong = (area = 0) => area / 3.3058;
export const formatAreaValue = area => Number(area || 0).toLocaleString("ko-KR", { maximumFractionDigits: 4 });
export const housingArea = (item = {}) => {
  const exclusiveArea = Number(item.area) || 0;
  const recordedSupplyArea = Number(item.supplyArea) || 0;
  const supplyArea = recordedSupplyArea || Math.round(exclusiveArea / 0.825);
  return {
    exclusiveArea,
    supplyArea,
    supplyPyeong: Math.round(pyeong(supplyArea)),
    estimated: !recordedSupplyArea,
  };
};
export const formatHousingArea = item => {
  const area = housingArea(item);
  return `${area.estimated ? "공급환산" : "공급"} ${formatAreaValue(area.supplyArea)}㎡ (${area.supplyPyeong}평) · 전용 ${formatAreaValue(area.exclusiveArea)}㎡`;
};
export const pricePerPyeong = (item) => item.price / Math.max(pyeong(item.area), 1);
export const isRecord = (item) => item.previousHigh > 0 && item.price > item.previousHigh;
export const recordRate = (item) => item.previousHigh ? ((item.price / item.previousHigh) - 1) * 100 : 0;
export const latestDate = (items) => [...new Set(items.map((item) => item.dealDate))].sort().at(-1) ?? "";
export const complexKey = item => [item.district, item.dong, item.complex].join("|");
export const complexCount = items => new Set(items.map(complexKey)).size;

export function representativeTransactions(items) {
  const latest = new Map();
  for (const item of items) {
    const key = `${item.district}|${item.dong}|${item.complex}|${item.area}`;
    const current = latest.get(key);
    if (!current || item.dealDate > current.dealDate || (item.dealDate === current.dealDate && item.price > current.price)) {
      latest.set(key, item);
    }
  }
  return [...latest.values()];
}
