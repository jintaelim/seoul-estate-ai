export const formatArea = area => Number(area).toLocaleString("ko-KR", { maximumFractionDigits: 4 });

export function compareContracts(transactions, item, month = "", area = "all") {
  const deals = transactions.filter(deal => deal.district === item.district
    && deal.dong === item.dong && deal.complex === item.complex
    && !deal.cancelled && (!month || deal.dealDate.startsWith(month))
    && (area === "all" || deal.area === Number(area)));
  return { count: deals.length, average: deals.length
    ? Math.round(deals.reduce((sum, deal) => sum + deal.price, 0) / deals.length) : null };
}

export function datePosition(date, dates) {
  const times = dates.map(value => Date.parse(value));
  const min = Math.min(...times);
  const range = Math.max(...times) - min;
  return range ? (Date.parse(date) - min) / range : 0.5;
}
