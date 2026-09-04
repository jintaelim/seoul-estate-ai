const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const storageConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

// Vercel 함수가 매 요청마다 국토부 25개 구를 다시 조회하지 않도록
// Supabase에 저장된 원장을 읽습니다. PostgREST 기본 최대 행 수(1,000)를
// 고려해 페이지 단위로 가져옵니다.
export async function readTransactions() {
  if (!storageConfigured) return null;
  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; offset < 20000; offset += pageSize) {
    const url = new URL(`${SUPABASE_URL}/rest/v1/transactions`);
    url.searchParams.set("select", "id,district,dong,complex,area,floor,price,deal_date,dealing_type,permit_zone,apartments(approval_date)");
    url.searchParams.set("order", "deal_date.desc,id.desc");
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    });
    if (!response.ok) throw new Error(`Supabase transactions ${response.status}: ${await response.text()}`);
    const page = await response.json();
    rows.push(...page.map((row) => ({
      id: row.id,
      district: row.district,
      dong: row.dong || "",
      aptDong: "",
      complex: row.complex,
      area: Number(row.area) || 0,
      floor: Number(row.floor) || 0,
      price: Number(row.price) || 0,
      builtYear: Number(String(row.apartments?.approval_date || "").slice(0, 4)) || 0,
      dealDate: row.deal_date,
      dealingGbn: row.dealing_type || "",
      permitZone: row.permit_zone || null,
      address: `서울 ${row.district} ${row.dong || ""}`.trim(),
      households: 0,
      permitDays: null,
      recentCount: 0,
      previousHigh: 0,
    })));
    if (page.length < pageSize) break;
  }
  return rows.length ? rows : null;
}

export async function persistTransactions(items) {
  if (!storageConfigured || !items.length) return { persisted: false, reason: "storage-not-configured" };
  const apartments = [...new Map(items.map((item) => [
    `${item.district}|${item.complex}`,
    { id: `${item.district}-${item.complex}`.slice(0, 180), name: item.complex, district: item.district, dong: item.dong, address: item.address, approval_date: item.builtYear ? `${item.builtYear}-01-01` : null, source: "molit" },
  ])).values()];
  // 국토부 원본은 같은 날짜·동·층·면적에 여러 건이 있을 수 있어
  // 화면용 id만으로 upsert하면 한 요청 안에서 ON CONFLICT가 중복됩니다.
  // 가격까지 포함한 안정적인 키로 만들고, 완전히 같은 키는 마지막 값 하나만 저장합니다.
  const transactionMap = new Map();
  for (const item of items) {
    const id = `${item.id}-${item.price}`.slice(0, 240);
    transactionMap.set(id, { id, apartment_id: `${item.district}-${item.complex}`.slice(0, 180), district: item.district, dong: item.dong, complex: item.complex, area: item.area, floor: item.floor, price: item.price, deal_date: item.dealDate, dealing_type: item.dealingGbn || null, permit_zone: item.permitZone || null, source: "molit" });
  }
  const transactions = [...transactionMap.values()];
  await supabaseUpsert("apartments", apartments, "id");
  await supabaseUpsert("transactions", transactions, "id");
  return { persisted: true, apartments: apartments.length, transactions: transactions.length };
}

async function supabaseUpsert(table, rows, onConflict) {
  for (let index = 0; index < rows.length; index += 500) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
      method: "POST",
      headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(rows.slice(index, index + 500)),
    });
    if (!response.ok) throw new Error(`Supabase ${table} ${response.status}: ${await response.text()}`);
  }
}
