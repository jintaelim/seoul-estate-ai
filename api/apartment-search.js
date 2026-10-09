import { buildApartmentCatalog, readStoredApartmentCatalog } from "./apartment-catalog.js";
import { database, databaseConfigured, getLedger, sendJson } from "./_ledger-store.js";
import { guardReadRequest, noStore } from "./_http.js";

export const normalizeApartmentKeyword = value => String(value || "")
  .toLowerCase()
  .replace(/\([^)]*\)/g, "")
  .replace(/아파트|단지/g, "")
  .replace(/[^0-9a-z가-힣]/g, "");

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function searchApartmentCatalog(rows, query = {}) {
  const keyword = normalizeApartmentKeyword(query.keyword);
  const district = String(query.district || "전체");
  const minPrice = number(query.minPrice);
  const maxPrice = number(query.maxPrice);
  const minArea = number(query.minArea);
  const minBuilt = number(query.minBuilt);
  const builtBefore = number(query.builtBefore);
  const minHouseholds = number(query.minHouseholds);
  const minRooms = number(query.minRooms);
  const far = number(query.far);
  const minTrades = number(query.minTrades);
  const maxInterval = number(query.maxInterval);
  const maxDaysSince = number(query.maxDaysSince);
  const minDiscount = number(query.minDiscount);
  const maxGap = number(query.maxGap);
  const minJeonseRatio = number(query.minJeonseRatio);
  const minRentTrades = number(query.minRentTrades);
  const maxRentAge = number(query.maxRentAge);
  const dealType = String(query.dealType || "all");
  const quality = String(query.quality || "all");
  const permit = String(query.permit || "all");
  const theme = String(query.theme || "all");
  const sort = String(query.sort || "latest");
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  const latestDealDate = rows.reduce((latest, item) => item.dealDate > latest ? item.dealDate : latest, "");
  const filtered = rows.filter(item => {
    const text = normalizeApartmentKeyword(`${item.district}${item.dong}${item.complex}`);
    if (keyword && !text.includes(keyword)) return false;
    if (district !== "전체" && item.district !== district) return false;
    if (minPrice && item.price < minPrice) return false;
    if (maxPrice && item.price > maxPrice) return false;
    if (minArea && item.area < minArea) return false;
    if (minBuilt && item.builtYear < minBuilt) return false;
    if (builtBefore && (!item.builtYear || item.builtYear >= builtBefore)) return false;
    if (minHouseholds && (!item.households || item.households < minHouseholds)) return false;
    if (minRooms && (!item.rooms || item.rooms < minRooms)) return false;
    if (far && (far === 301 ? (!item.floorAreaRatio || item.floorAreaRatio <= 300) : (!item.floorAreaRatio || item.floorAreaRatio > far))) return false;
    if (dealType === "broker" && item.dealingGbn !== "중개거래") return false;
    if (minTrades && item.tradeCount90 < minTrades) return false;
    if (maxInterval && (!item.medianIntervalDays || item.medianIntervalDays > maxInterval)) return false;
    if (maxDaysSince && item.daysSinceTrade > maxDaysSince) return false;
    if (minDiscount && item.priceDrawdownRate < minDiscount) return false;
    if (maxGap && (!item.latestJeonse || item.gapAmount > maxGap)) return false;
    if (minJeonseRatio && item.jeonseRatio < minJeonseRatio) return false;
    if (minRentTrades && item.rentCount < minRentTrades) return false;
    if (maxRentAge && (!item.latestJeonse || item.rentAgeDays > maxRentAge)) return false;
    if (quality === "high" && item.dataConfidence !== "high") return false;
    if (permit === "linked" && item.permitCount < 1) return false;
    if (permit === "approved" && item.approvedPermitCount < 1) return false;
    if (theme === "latest" && item.dealDate !== latestDealDate) return false;
    if (theme === "rent" && !item.latestJeonse) return false;
    if (theme === "record" && !(item.previousHigh > 0 && item.price > item.previousHigh)) return false;
    if (theme === "active" && item.recentCount < 7) return false;
    if (theme === "value" && (!item.previousHigh || item.price >= item.previousHigh)) return false;
    return true;
  });
  filtered.sort((a, b) => sort === "priceAsc" ? a.price - b.price
    : sort === "priceDesc" ? b.price - a.price
      : sort === "activity" ? b.recentCount - a.recentCount
        : sort === "liquidity" ? b.tradeDays90 - a.tradeDays90 || b.tradeCount90 - a.tradeCount90
          : sort === "discount" ? b.priceDrawdownRate - a.priceDrawdownRate
            : sort === "gap" ? (a.gapAmount || Infinity) - (b.gapAmount || Infinity)
              : b.dealDate.localeCompare(a.dealDate) || b.price - a.price);
  const offset = (page - 1) * limit;
  return { data: filtered.slice(offset, offset + limit), count: Math.min(limit, Math.max(0, filtered.length - offset)),
    totalCount: filtered.length, page, limit, hasMore: offset + limit < filtered.length };
}

async function localSearch(query) {
  const stored = await readStoredApartmentCatalog();
  if (stored?.data) return { ...searchApartmentCatalog(stored.data, query), fetchedAt: stored.fetchedAt,
    source: "stored-catalog", coverage: stored.coverage };
  const [sales, rents, permits] = await Promise.all([getLedger("transactions"), getLedger("rent-transactions"), getLedger("land-permits")]);
  const catalog = buildApartmentCatalog(sales, rents, permits);
  return { ...searchApartmentCatalog(catalog.data, query), fetchedAt: catalog.fetchedAt,
    source: "stored-ledgers", coverage: catalog.coverage };
}

export default async function handler(req, res) {
  if (!guardReadRequest(req, res)) return;
  try {
    const query = {
      keyword: req.query?.keyword || "", district: req.query?.district || "전체",
      minPrice: req.query?.minPrice || 0, maxPrice: req.query?.maxPrice || 0,
      minArea: req.query?.minArea || 0, minBuilt: req.query?.minBuilt || 0,
      builtBefore: req.query?.builtBefore || 0, minHouseholds: req.query?.minHouseholds || 0,
      minRooms: req.query?.minRooms || 0, far: req.query?.far || 0,
      minTrades: req.query?.minTrades || 0, maxInterval: req.query?.maxInterval || 0,
      maxDaysSince: req.query?.maxDaysSince || 0, minDiscount: req.query?.minDiscount || 0,
      maxGap: req.query?.maxGap || 0, minJeonseRatio: req.query?.minJeonseRatio || 0,
      minRentTrades: req.query?.minRentTrades || 0, maxRentAge: req.query?.maxRentAge || 0,
      dealType: req.query?.dealType || "all", quality: req.query?.quality || "all", permit: req.query?.permit || "all",
      theme: req.query?.theme || "all", sort: req.query?.sort || "latest",
      page: req.query?.page || 1, limit: req.query?.limit || 20,
    };
    const hasExtendedFilter = number(query.builtBefore) || number(query.minHouseholds) || number(query.minRooms) || number(query.far)
      || number(query.minTrades) || number(query.maxInterval) || number(query.maxDaysSince) || number(query.minDiscount)
      || number(query.maxGap) || number(query.minJeonseRatio) || number(query.minRentTrades) || number(query.maxRentAge)
      || query.dealType !== "all" || query.quality !== "all" || query.permit !== "all"
      || ["liquidity", "discount", "gap"].includes(query.sort);
    if (hasExtendedFilter) return sendJson(req, res, await localSearch(query), { browser: 30, edge: 300, stale: 3600 });
    if (databaseConfigured()) {
      try {
        const remote = await database("rpc/search_estate_apartments", {
          method: "POST",
          body: JSON.stringify({
            p_keyword: normalizeApartmentKeyword(query.keyword), p_district: query.district === "전체" ? null : query.district,
            p_min_price: number(query.minPrice) || null, p_max_price: number(query.maxPrice) || null,
            p_min_area: number(query.minArea) || null, p_min_built: number(query.minBuilt) || null,
            p_theme: query.theme, p_sort: query.sort,
            p_offset: (Math.max(1, Number(query.page) || 1) - 1) * Math.min(50, Math.max(1, Number(query.limit) || 20)),
            p_limit: Math.min(50, Math.max(1, Number(query.limit) || 20)),
          }),
        });
        if (remote) return sendJson(req, res, remote, { browser: 30, edge: 300, stale: 3600 });
      } catch (error) {
        if (process.env.VERCEL) throw error;
      }
    }
    return sendJson(req, res, await localSearch(query), { browser: 30, edge: 300, stale: 3600 });
  } catch (error) {
    noStore(res);
    return res.status(503).json({ error: error.message });
  }
}
