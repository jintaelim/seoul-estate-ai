export const formatPrice = (price = 0) => {
  const eok = Math.floor(price / 10000);
  const man = price % 10000;
  return `${eok ? `${eok}억` : ""}${man ? ` ${man.toLocaleString("ko-KR")}만` : ""}`.trim() || "0원";
};

export const pyeong = (area = 0) => area / 3.3058;
export const pricePerPyeong = (item) => item.price / Math.max(pyeong(item.area), 1);
export const isRecord = (item) => item.previousHigh > 0 && item.price > item.previousHigh;
export const recordRate = (item) => item.previousHigh ? ((item.price / item.previousHigh) - 1) * 100 : 0;
export const latestDate = (items) => [...new Set(items.map((item) => item.dealDate))].sort().at(-1) ?? "";

export function representativeTransactions(items) {
  const latest = new Map();
  for (const item of items) {
    const key = `${item.district}|${item.complex}|${Math.round(item.area)}`;
    const current = latest.get(key);
    if (!current || item.dealDate > current.dealDate || (item.dealDate === current.dealDate && item.price > current.price)) {
      latest.set(key, item);
    }
  }
  return [...latest.values()];
}
