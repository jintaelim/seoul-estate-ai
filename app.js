// Legacy reference: the browser entry point is now src/main.jsx.
// Kept temporarily so the pre-React implementation can be compared during migration.
const transactions = [
  {
    id: 1,
    district: "강남구",
    dong: "대치동",
    complex: "은마아파트",
    area: 84.43,
    floor: 9,
    price: 244000,
    previousHigh: 238000,
    builtYear: 1979,
    dealDate: "2026-05-11",
    permitZone: "잠실·삼성·대치·청담",
    recentCount: 8,
    address: "서울 강남구 대치동 316",
    households: 4424,
    permitDays: 2,
  },
  {
    id: 2,
    district: "송파구",
    dong: "잠실동",
    complex: "리센츠",
    area: 84.99,
    floor: 17,
    price: 248500,
    previousHigh: 250000,
    builtYear: 2008,
    dealDate: "2026-05-11",
    permitZone: "잠실·삼성·대치·청담",
    recentCount: 12,
    address: "서울 송파구 잠실동 22",
    households: 5563,
    permitDays: 1,
  },
  {
    id: 3,
    district: "성동구",
    dong: "성수동1가",
    complex: "트리마제",
    area: 84.54,
    floor: 22,
    price: 321000,
    previousHigh: 315000,
    builtYear: 2017,
    dealDate: "2026-05-10",
    permitZone: "성수전략정비구역",
    recentCount: 3,
    address: "서울 성동구 성수동1가 685-700",
    households: 688,
    permitDays: 7,
  },
  {
    id: 4,
    district: "성동구",
    dong: "행당동",
    complex: "서울숲리버뷰자이",
    area: 59.98,
    floor: 13,
    price: 118000,
    previousHigh: 122000,
    builtYear: 2018,
    dealDate: "2026-05-09",
    permitZone: null,
    recentCount: 7,
  },
  {
    id: 5,
    district: "마포구",
    dong: "아현동",
    complex: "마포래미안푸르지오",
    area: 59.96,
    floor: 11,
    price: 119500,
    previousHigh: 124000,
    builtYear: 2014,
    dealDate: "2026-05-10",
    permitZone: null,
    recentCount: 9,
  },
  {
    id: 6,
    district: "마포구",
    dong: "공덕동",
    complex: "공덕자이",
    area: 84.88,
    floor: 16,
    price: 169000,
    previousHigh: 171000,
    builtYear: 2015,
    dealDate: "2026-05-08",
    permitZone: null,
    recentCount: 4,
  },
  {
    id: 7,
    district: "용산구",
    dong: "한남동",
    complex: "한남더힐",
    area: 177.76,
    floor: 5,
    price: 870000,
    previousHigh: 840000,
    builtYear: 2011,
    dealDate: "2026-05-10",
    permitZone: "한남재정비촉진구역",
    recentCount: 2,
    address: "서울 용산구 한남동 810",
    households: 600,
    permitDays: 12,
  },
  {
    id: 8,
    district: "서초구",
    dong: "반포동",
    complex: "래미안원베일리",
    area: 84.94,
    floor: 20,
    price: 438000,
    previousHigh: 430000,
    builtYear: 2023,
    dealDate: "2026-05-11",
    permitZone: null,
    recentCount: 6,
  },
  {
    id: 9,
    district: "동작구",
    dong: "흑석동",
    complex: "아크로리버하임",
    area: 84.91,
    floor: 12,
    price: 218000,
    previousHigh: 221000,
    builtYear: 2019,
    dealDate: "2026-05-11",
    permitZone: null,
    recentCount: 5,
  },
  {
    id: 10,
    district: "노원구",
    dong: "중계동",
    complex: "청구3차",
    area: 84.78,
    floor: 8,
    price: 94000,
    previousHigh: 99000,
    builtYear: 1996,
    dealDate: "2026-05-07",
    permitZone: null,
    recentCount: 10,
  },
  {
    id: 11,
    district: "강동구",
    dong: "고덕동",
    complex: "고덕그라시움",
    area: 59.78,
    floor: 18,
    price: 126000,
    previousHigh: 130000,
    builtYear: 2019,
    dealDate: "2026-05-09",
    permitZone: null,
    recentCount: 11,
  },
  {
    id: 12,
    district: "양천구",
    dong: "목동",
    complex: "목동신시가지7단지",
    area: 74.32,
    floor: 6,
    price: 198000,
    previousHigh: 193000,
    builtYear: 1986,
    dealDate: "2026-05-08",
    permitZone: "목동택지개발지구",
    recentCount: 4,
    address: "서울 양천구 목동 925",
    households: 2550,
    permitDays: 6,
  },
  {
    id: 13,
    district: "동대문구",
    dong: "전농동",
    complex: "래미안크레시티",
    area: 59.99,
    floor: 15,
    price: 103000,
    previousHigh: 104500,
    builtYear: 2014,
    dealDate: "2026-05-10",
    permitZone: null,
    recentCount: 8,
  },
  {
    id: 14,
    district: "서대문구",
    dong: "북아현동",
    complex: "e편한세상신촌",
    area: 59.85,
    floor: 9,
    price: 113000,
    previousHigh: 116000,
    builtYear: 2018,
    dealDate: "2026-05-11",
    permitZone: null,
    recentCount: 6,
  },
  {
    id: 15,
    district: "강남구",
    dong: "도곡동",
    complex: "도곡렉슬",
    area: 84.93,
    floor: 14,
    price: 272000,
    previousHigh: 268000,
    builtYear: 2006,
    dealDate: "2026-05-12",
    permitZone: "도곡·대치 토지거래허가구역",
    recentCount: 5,
    address: "서울 강남구 도곡동 527",
    households: 3002,
    permitDays: 4,
  },
  {
    id: 16,
    district: "강남구",
    dong: "개포동",
    complex: "개포래미안포레스트",
    area: 84.86,
    floor: 19,
    price: 274000,
    previousHigh: 270000,
    builtYear: 2020,
    dealDate: "2026-05-12",
    permitZone: "개포·일원 토지거래허가구역",
    recentCount: 6,
    address: "서울 강남구 개포동 1282",
    households: 2296,
    permitDays: 4,
  },
];

// 샘플 데이터는 API 연결 실패 시 폴백으로 사용됩니다.
const SAMPLE_TRANSACTIONS = transactions.slice();

let districts = ["전체", ...new Set(transactions.map((item) => item.district))];

const state = {
  selectedDistrict: "전체",
  maxBudget: 18,
  sortHighFirst: true,
  currentResults: [],
  selectedPermitDate: null,
  selectedPermitId: null,
  dataSource: "sample",
};

// ── 새로 올라온 거래 상태 ─────────────────────────────────
const newClosingsState = { tab: "today", region: "전체", showAll: false };

// ── 아파트 매물 검색 상태 ─────────────────────────────────
const listingSearchState = {
  theme: "all",
  page: 1,
  results: [],
};

// ── 갈아타기 후보 실거래 상태 ─────────────────────────────
const candidateState = {
  items: [],
  filter: "all",
  selectedId: null,
  months: 12,
  loading: false,
  fetchedAt: null,
  error: null,
};

// ── 거래량 캘린더 상태 ───────────────────────────────────
const calTxState = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  selectedDate: latestDealDate(),
};

const calendarEvents = [
  { date: "2026-05-12", type: "특별공급", title: "이촌 르엘", region: "용산" },
  { date: "2026-05-13", type: "일반공급", title: "더샵 신길센트럴", region: "영등포" },
  { date: "2026-05-14", type: "당첨자발표", title: "아크로 드 서초", region: "서초" },
  { date: "2026-05-20", type: "전매제한해제", title: "래미안 엘라비네", region: "강서" },
  { date: "2026-05-27", type: "전매제한해제", title: "고척 푸르지오 힐스테이트", region: "구로" },
];

const askingSignals = [
  { complex: "래미안원베일리", area: "224B", before: "180억", after: "150억", delta: "-30억", tone: "down" },
  { complex: "현대(신현대)", area: "165B", before: "92억", after: "80억", delta: "-12억", tone: "down" },
  { complex: "디에이치퍼스티어아이파크", area: "85A", before: "26억", after: "29억", delta: "+3억", tone: "up" },
  { complex: "올림픽파크포레온", area: "85A", before: "24.8억", after: "27억", delta: "+2.2억", tone: "up" },
];

const offerItems = [
  { title: "이촌 르엘", meta: "서울 용산 · 98세대 · 03.30" },
  { title: "아크로 드 서초", meta: "서울 서초 · 177세대 · 03.20" },
  { title: "더샵 신길센트럴", meta: "서울 영등포 · 169세대 · 03.20" },
];

const noticeItems = [
  { title: "압구정특별계획구역2 환경영향평가 공람", meta: "강남구 · 2026.04.02" },
  { title: "흑석11구역 관리처분계획 변경인가", meta: "동작구 · 2026.04.02" },
  { title: "신촌지역 마포3구역 정비계획 재공람", meta: "마포구 · 2026.04.02" },
];

const moneyFormatter = new Intl.NumberFormat("ko-KR");

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function toEok(priceInManwon) {
  return priceInManwon / 10000;
}

function formatPrice(priceInManwon) {
  const eok = Math.floor(priceInManwon / 10000);
  const man = priceInManwon % 10000;
  if (man === 0) return `${eok}억`;
  return `${eok}억 ${moneyFormatter.format(man)}만`;
}

function pyeong(area) {
  return area / 3.3058;
}

function pricePerPyeong(item) {
  return Math.round(item.price / pyeong(item.area));
}

function isRecord(item) {
  return item.price > item.previousHigh;
}

function recordIncrease(item) {
  return Math.round(((item.price - item.previousHigh) / item.previousHigh) * 1000) / 10;
}

function formatRecordGap(item) {
  const gap = recordIncrease(item);
  if (gap > 0) return `+${gap}%`;
  if (gap < 0) return `${gap}%`;
  return "0%";
}

function permitTransactions() {
  return transactions.filter((item) => item.permitZone);
}

function permitDates() {
  const dates = [...new Set(permitTransactions().map((item) => item.dealDate))].sort();
  if (dates.length) return dates.slice(-7); // 최근 7일
  return ["2026-05-07", "2026-05-08", "2026-05-09", "2026-05-10", "2026-05-11", "2026-05-12"];
}

function formatDayLabel(date) {
  const day = new Date(`${date}T00:00:00`).getDate();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(`${date}T00:00:00`).getDay()];
  return { day, weekday };
}

// 날짜별 탭 HTML (오버레이 공통)
function overlayDateStripHtml(dates, selectedDate, countFn) {
  return `<div class="overlay-date-strip">` +
    dates.map((date) => {
      const { day, weekday } = formatDayLabel(date);
      const count = countFn(date);
      const active = date === selectedDate ? "active" : "";
      return `<button class="permit-date ${active}" type="button" data-overlay-date="${date}">
        <span>${weekday}</span>
        <strong>${day}</strong>
        <em>${count}</em>
      </button>`;
    }).join("") +
  `</div>`;
}

// 날짜 탭 클릭 이벤트 바인딩 (오버레이 공통)
function bindOverlayDateTabs(overlay, renderFn) {
  overlay.querySelector(".overlay-date-strip")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-overlay-date]");
    if (!btn) return;
    const date = btn.dataset.overlayDate;
    // 활성 탭 교체
    overlay.querySelectorAll(".overlay-date-strip .permit-date").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    // 콘텐츠 교체
    const contentEl = overlay.querySelector(".overlay-date-content");
    if (contentEl) contentEl.innerHTML = renderFn(date);
    // 새로 생긴 detail-trigger 이벤트 rebind은 bubbling으로 처리됨
  });
}

function groupedByDistrict(items) {
  return items.reduce((groups, item) => {
    groups[item.district] = groups[item.district] || [];
    groups[item.district].push(item);
    return groups;
  }, {});
}

function getSelectedPermitItem() {
  const dateRows = permitTransactions().filter((item) => item.dealDate === state.selectedPermitDate);
  return (
    dateRows.find((item) => item.id === state.selectedPermitId) ||
    dateRows[0] ||
    null
  );
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function latestDealDate() {
  return transactions.reduce((max, t) => t.dealDate > max ? t.dealDate : max, "");
}

function totalPermitDealsToday() {
  const today = latestDealDate();
  return permitTransactions().filter((item) => item.dealDate === today).length;
}

function extractQuery(query) {
  const compact = query.replace(/\s+/g, " ");
  const mentionedDistricts = districts
    .filter((district) => district !== "전체")
    .filter((district) => compact.includes(district));
  const budgetMatch = compact.match(/(\d+(?:\.\d+)?)\s*억/);
  const areaMatch =
    compact.match(/(?:전용|면적)\s*(\d{2,3}(?:\.\d+)?)/i) ||
    compact.match(/(\d{2,3}(?:\.\d+)?)\s*(?:㎡|m2|평)/i);
  const yearMatch = compact.match(/(19\d{2}|20\d{2})\s*년?\s*(?:이후|부터|준공)/);

  return {
    districts: mentionedDistricts,
    maxBudget: budgetMatch ? Number(budgetMatch[1]) : null,
    minArea: areaMatch ? Number(areaMatch[1]) : null,
    builtAfter: yearMatch ? Number(yearMatch[1]) : null,
    recentOnly: /최근|6개월|거래 많은|거래가 있는/.test(compact),
    excludeRecord: /신고가.*(제외|빼|말고)|너무 오른 곳.*(제외|빼)/.test(compact),
    recordOnly: /신고가/.test(compact) && !/제외|빼|말고/.test(compact),
    permitOnly: /토허|토지거래허가|허가구역/.test(compact),
    newBuild: /신축|새 아파트/.test(compact),
  };
}

function scoreTransaction(item, criteria) {
  let score = 48;
  const reasons = [];

  if (criteria.districts.length) {
    if (criteria.districts.includes(item.district)) {
      score += 25;
      reasons.push(`${item.district} 조건 일치`);
    } else {
      score -= 30;
    }
  }

  if (criteria.maxBudget) {
    if (toEok(item.price) <= criteria.maxBudget) {
      score += 22;
      reasons.push(`${criteria.maxBudget}억 이하`);
    } else {
      score -= Math.min(45, (toEok(item.price) - criteria.maxBudget) * 5);
    }
  }

  if (criteria.minArea) {
    if (item.area >= criteria.minArea) {
      score += 14;
      reasons.push(`전용 ${criteria.minArea}㎡ 이상`);
    } else {
      score -= 18;
    }
  }

  if (criteria.builtAfter) {
    if (item.builtYear >= criteria.builtAfter) {
      score += 16;
      reasons.push(`${criteria.builtAfter}년 이후 준공`);
    } else {
      score -= 15;
    }
  }

  if (criteria.recentOnly) {
    score += Math.min(16, item.recentCount * 1.7);
    reasons.push(`최근 거래 ${item.recentCount}건`);
  }

  if (criteria.newBuild && item.builtYear >= 2018) {
    score += 12;
    reasons.push("신축 선호");
  }

  if (criteria.recordOnly && isRecord(item)) {
    score += 24;
    reasons.push("신고가");
  }

  if (criteria.excludeRecord && isRecord(item)) {
    score -= 35;
  }

  if (criteria.permitOnly && item.permitZone) {
    score += 28;
    reasons.push("토허구역");
  } else if (criteria.permitOnly) {
    score -= 20;
  }

  if (item.price <= item.previousHigh) {
    score += 7;
    reasons.push("직전 고점 이하");
  }

  return {
    ...item,
    score: Math.max(0, Math.round(score)),
    reasons: reasons.slice(0, 4),
  };
}

function runAssistant(query) {
  const criteria = extractQuery(query);
  const results = transactions
    .map((item) => scoreTransaction(item, criteria))
    .filter((item) => item.score >= 40)
    .sort((a, b) => b.score - a.score || a.price - b.price)
    .slice(0, 5);

  state.currentResults = results;
  renderResults(results);
  addMessage(query, "user");
  addMessage(buildAssistantResponse(criteria, results), "assistant");
  document.getElementById("assistantStatus").textContent = `추천 ${results.length}건`;
}

function buildAssistantResponse(criteria, results) {
  if (!results.length) {
    return "조건에 강하게 맞는 후보가 없습니다. 예산 범위를 넓히거나 지역을 줄이면 다시 찾을 수 있습니다.";
  }

  const filterText = [];
  if (criteria.districts.length) filterText.push(criteria.districts.join("·"));
  if (criteria.maxBudget) filterText.push(`${criteria.maxBudget}억 이하`);
  if (criteria.minArea) filterText.push(`전용 ${criteria.minArea}㎡ 이상`);
  if (criteria.builtAfter) filterText.push(`${criteria.builtAfter}년 이후`);
  if (criteria.recordOnly) filterText.push("신고가 중심");
  if (criteria.excludeRecord) filterText.push("신고가 제외");
  if (criteria.permitOnly) filterText.push("토허구역");

  const top = results[0];
  return `${filterText.join(", ") || "현재 조건"} 기준으로 ${results.length}개 후보를 찾았습니다. 우선순위는 ${top.district} ${top.complex}입니다. ${top.reasons.join(", ")} 조건이 맞고, 평당가는 약 ${moneyFormatter.format(pricePerPyeong(top))}만원입니다.`;
}

function addMessage(text, type) {
  const thread = document.getElementById("assistantThread");
  if (!thread) return;
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  thread.appendChild(message);
  thread.scrollTop = thread.scrollHeight;
}

function renderMetrics() {
  const latest = getTabTransactions("today"); // 최신 등록분
  document.getElementById("mDeals").textContent = latest.length;
  document.getElementById("mRec").textContent = latest.filter(isRecord).length;
  document.getElementById("mPerm").textContent = latest.filter(t => t.permitZone).length;
}

function renderServiceMap() {
  const grid = document.getElementById("serviceModuleGrid");
  if (!grid) return;

  const modules = [
    { title: "아가리 호가", value: "28단지", desc: "매물 호가 인상·인하와 매수/매도 압력", target: "#askingSignal" },
    { title: "토지거래허가", value: `${permitTransactions().length}건`, desc: "날짜별 허가 거래와 단지 상세", target: "#permits" },
    { title: "실거래가", value: `${transactions.length}건`, desc: "날짜별 실거래, 자치구별·가격대별 분석", target: "#transactions" },
    { title: "입주자모집공고", value: "진행 13건", desc: "청약 공고와 전매제한 해제 일정", target: "#offers" },
    { title: "고시/공고", value: "서울 25구", desc: "정비사업 고시·공고 검색과 필터", target: "#notices" },
    { title: "손피 계산기", value: "무한급수", desc: "분양권 손피와 양도세 역산 계산", target: "#sonp" },
    { title: "부동산 캘린더", value: "5월", desc: "특별공급, 일반공급, 당첨자발표 일정", target: "#calendar" },
    { title: "관심단지·뉴스", value: "20건", desc: "관심단지 저장, 정책 시그널, 오늘 뉴스", target: "#serviceMap" },
  ];

  grid.innerHTML = modules.map((module) => `
    <a class="service-module-card" href="${module.target}" aria-label="${module.title} 섹션으로 이동">
      <span>${module.title}</span>
      <strong>${module.value}</strong>
      <p>${module.desc}</p>
    </a>
  `).join("");
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;
  const dates = ["2026-05-12", "2026-05-13", "2026-05-14", "2026-05-15", "2026-05-20", "2026-05-27"];
  grid.innerHTML = dates.map((date) => {
    const { day, weekday } = formatDayLabel(date);
    const events = calendarEvents.filter((event) => event.date === date);
    return `
      <div class="calendar-day ${events.length ? "has-event" : ""}">
        <span>${weekday}</span>
        <strong>${day}</strong>
        ${events.map((event) => `<em>${event.type}</em><p>${event.title}</p>`).join("")}
      </div>
    `;
  }).join("");
}

function renderAskingSignals() {
  const list = document.getElementById("askList");
  if (!list) return;
  list.innerHTML = askingSignals.map((item) => `
    <div class="ask-item">
      <div>
        <div class="acplx">${item.complex}</div>
        <div class="acgu">${item.area} · ${item.before} → ${item.after}</div>
      </div>
      <span class="achg ${item.tone}">${item.delta}</span>
    </div>
  `).join("");
}

function renderMiniDataPanels() {
  const offerList = document.getElementById("offerList");
  const noticeList = document.getElementById("noticeList");
  if (offerList) {
    offerList.innerHTML = offerItems.map((item) => `
      <div class="mini-data-row">
        <strong>${item.title}</strong>
        <span>${item.meta}</span>
      </div>
    `).join("");
  }
  if (noticeList) {
    noticeList.innerHTML = noticeItems.map((item) => `
      <div class="mini-data-row">
        <strong>${item.title}</strong>
        <span>${item.meta}</span>
      </div>
    `).join("");
  }
}

function calculateSonp() {
  const premium = Number(document.getElementById("sonpPremium")?.value || 0);
  const rate = Number(document.getElementById("sonpRate")?.value || 0.77);
  const tax = Math.round((premium * rate) / (1 - rate));
  const total = premium + tax;
  const result = document.getElementById("sonpResult");
  if (!result) return;
  result.innerHTML = `
    <span>예상 양도세</span>
    <strong>${moneyFormatter.format(tax)}만원</strong>
    <p>매수자 부담 총액 ${moneyFormatter.format(total)}만원</p>
  `;
}

function renderHomeModules() {
  renderServiceMap();
  renderCalendar();
  renderAskingSignals();
  renderMiniDataPanels();
  calculateSonp();
}

function renderDistricts() {
  const grid = document.getElementById("districtGrid");
  grid.innerHTML = "";
  districts.forEach((district) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = district;
    button.className = `fcheck ${district === state.selectedDistrict ? "active" : ""}`;
    button.addEventListener("click", () => {
      state.selectedDistrict = district;
      renderDistricts();
      renderTransactions();
    });
    grid.appendChild(button);
  });
}

/* ── 아파트 매물 검색 ─────────────────────────────────── */

const LISTING_PAGE_SIZE = 12;

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, "").toLowerCase();
}

function getListingDistrictValue() {
  return document.getElementById("listingDistrict")?.value || "전체";
}

function renderListingDistrictOptions() {
  const select = document.getElementById("listingDistrict");
  if (!select) return;
  const current = select.value || "전체";
  select.innerHTML = districts.map((district) => `
    <option value="${escapeHtml(district)}">${escapeHtml(district)}</option>
  `).join("");
  select.value = districts.includes(current) ? current : "전체";
}

function listingRepresentativeRows() {
  const groups = new Map();
  for (const tx of transactions) {
    const areaBucket = Math.round(Number(tx.area || 0));
    const key = `${tx.district}|${tx.dong}|${tx.complex}|${areaBucket}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(tx);
  }

  return Array.from(groups.values()).map((rows) => {
    const sorted = [...rows].sort((a, b) =>
      b.dealDate.localeCompare(a.dealDate) || Number(b.price) - Number(a.price)
    );
    const latest = sorted[0];
    const prices = rows.map((row) => Number(row.price || 0)).filter(Boolean);
    const highest = Math.max(...prices, latest.price);
    const lowest = Math.min(...prices, latest.price);
    const avg = Math.round(prices.reduce((sum, price) => sum + price, 0) / Math.max(1, prices.length));
    return {
      ...latest,
      listingStats: {
        count: rows.length,
        highest,
        lowest,
        avg,
        latestDate: latest.dealDate,
      },
    };
  });
}

function getListingCriteria() {
  return {
    keyword: normalizeText(document.getElementById("listingKeyword")?.value || ""),
    district: getListingDistrictValue(),
    minPrice: Number(document.getElementById("listingMinPrice")?.value || 0) * 10000,
    maxPrice: Number(document.getElementById("listingMaxPrice")?.value || 0) * 10000,
    minArea: Number(document.getElementById("listingMinArea")?.value || 0),
    builtAfter: Number(document.getElementById("listingBuiltAfter")?.value || 0),
    sort: document.getElementById("listingSort")?.value || "latest",
    theme: listingSearchState.theme,
  };
}

function matchListingTheme(item, theme) {
  if (theme === "today") return item.dealDate === latestDealDate();
  if (theme === "record") return isRecord(item);
  if (theme === "permit") return Boolean(item.permitZone);
  if (theme === "active") return Number(item.recentCount || item.listingStats?.count || 0) >= 10;
  if (theme === "undervalued") return item.previousHigh && item.price <= item.previousHigh * 0.95;
  if (theme === "newbuild") return Number(item.builtYear || 0) >= 2018;
  return true;
}

function filterListingRows() {
  const criteria = getListingCriteria();
  const keyword = criteria.keyword;

  let rows = listingRepresentativeRows().filter((item) => {
    if (criteria.district !== "전체" && item.district !== criteria.district) return false;
    if (criteria.minPrice && item.price < criteria.minPrice) return false;
    if (criteria.maxPrice && item.price > criteria.maxPrice) return false;
    if (criteria.minArea && item.area < criteria.minArea) return false;
    if (criteria.builtAfter && item.builtYear < criteria.builtAfter) return false;
    if (!matchListingTheme(item, criteria.theme)) return false;

    if (keyword) {
      const haystack = normalizeText([
        item.complex,
        item.district,
        item.dong,
        item.address,
        item.permitZone,
        item.dealingGbn,
      ].join(" "));
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });

  rows.sort((a, b) => {
    if (criteria.sort === "priceDesc") return b.price - a.price;
    if (criteria.sort === "priceAsc") return a.price - b.price;
    if (criteria.sort === "ppDesc") return pricePerPyeong(b) - pricePerPyeong(a);
    if (criteria.sort === "activity") return (b.recentCount || b.listingStats.count) - (a.recentCount || a.listingStats.count);
    if (criteria.sort === "gap") {
      const gapA = a.previousHigh ? a.price / a.previousHigh : 1;
      const gapB = b.previousHigh ? b.price / b.previousHigh : 1;
      return gapA - gapB;
    }
    return b.dealDate.localeCompare(a.dealDate) || b.price - a.price;
  });

  return rows;
}

function renderListingInsights(rows) {
  const insights = document.getElementById("listingInsights");
  const status = document.getElementById("listingDataStatus");
  if (!insights) return;

  if (status) {
    status.textContent = state.dataSource === "molit"
      ? `실거래 ${transactions.length.toLocaleString()}건`
      : "샘플 데이터";
  }

  const avgPrice = rows.length
    ? Math.round(rows.reduce((sum, item) => sum + item.price, 0) / rows.length)
    : 0;
  const recordCount = rows.filter(isRecord).length;
  const permitCount = rows.filter((item) => item.permitZone).length;
  const topDistrict = Object.entries(rows.reduce((acc, item) => {
    acc[item.district] = (acc[item.district] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1])[0];

  insights.innerHTML = [
    ["검색 후보", `${rows.length.toLocaleString()}개`],
    ["평균 거래가", rows.length ? formatPrice(avgPrice) : "-"],
    ["신고가", `${recordCount.toLocaleString()}개`],
    ["토허구역", `${permitCount.toLocaleString()}개`],
    ["최다 지역", topDistrict ? `${topDistrict[0]} ${topDistrict[1]}개` : "-"],
  ].map(([label, value]) => `
    <div class="listing-insight">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function listingBadgeHtml(item) {
  const badges = [];
  if (isRecord(item)) badges.push(`<span class="listing-badge record">신고가</span>`);
  if (item.permitZone) badges.push(`<span class="listing-badge permit">토허</span>`);
  if (item.builtYear >= 2018) badges.push(`<span class="listing-badge">신축권</span>`);
  if ((item.recentCount || item.listingStats?.count || 0) >= 10) badges.push(`<span class="listing-badge">거래활발</span>`);
  if (item.previousHigh && item.price <= item.previousHigh * 0.95) badges.push(`<span class="listing-badge value">고점대비</span>`);
  return badges.join("");
}

function listingCardHtml(item) {
  const stats = item.listingStats || { count: item.recentCount || 1, highest: item.price, lowest: item.price, avg: item.price };
  const gap = item.previousHigh ? Math.round((item.price / item.previousHigh - 1) * 1000) / 10 : 0;
  const gapText = item.previousHigh
    ? `${gap > 0 ? "+" : ""}${gap}%`
    : "비교 없음";
  return `
    <button class="listing-card detail-trigger" type="button" data-detail-id="${escapeHtml(item.id)}" data-detail-context="listing" aria-label="${escapeHtml(item.complex)} 상세 보기">
      <div class="listing-card-head">
        <div>
          <h3>${escapeHtml(item.complex)}</h3>
          <p>${escapeHtml(item.district)} ${escapeHtml(item.dong)} · ${escapeHtml(item.dealDate)} · ${item.area.toFixed(1)}㎡ · ${item.floor}층</p>
        </div>
        <strong>${formatPrice(item.price)}</strong>
      </div>
      <div class="listing-badges">${listingBadgeHtml(item) || `<span class="listing-badge">일반거래</span>`}</div>
      <div class="listing-metrics">
        <span><em>평당가</em><strong>${moneyFormatter.format(pricePerPyeong(item))}만</strong></span>
        <span><em>최근거래</em><strong>${moneyFormatter.format(item.recentCount || stats.count)}건</strong></span>
        <span><em>고점대비</em><strong>${gapText}</strong></span>
        <span><em>최고/최저</em><strong>${formatPrice(stats.highest)} / ${formatPrice(stats.lowest)}</strong></span>
      </div>
      <div class="listing-foot">
        <span>${escapeHtml(item.address || `서울 ${item.district} ${item.dong}`)}</span>
        <span>${escapeHtml(item.dealingGbn || "거래유형 미상")}</span>
      </div>
    </button>
  `;
}

function renderListingSearch({ resetPage = false } = {}) {
  if (resetPage) listingSearchState.page = 1;
  const list = document.getElementById("listingResults");
  const more = document.getElementById("listingMoreBtn");
  if (!list) return;

  const rows = filterListingRows();
  listingSearchState.results = rows;
  renderListingInsights(rows);

  const visible = rows.slice(0, listingSearchState.page * LISTING_PAGE_SIZE);
  list.innerHTML = visible.length
    ? visible.map(listingCardHtml).join("")
    : `<div class="listing-empty">
        <h3>조건에 맞는 매물 후보가 없습니다</h3>
        <p>가격 범위를 넓히거나 테마 필터를 전체로 바꿔보세요.</p>
      </div>`;

  if (more) {
    more.style.display = rows.length > visible.length ? "" : "none";
    more.textContent = `더보기 (${visible.length.toLocaleString()} / ${rows.length.toLocaleString()}) ↓`;
  }
}

function renderResults(results = state.currentResults) {
  const list = document.getElementById("resultsList");
  const data = results.length ? results : transactions
    .filter((item) => toEok(item.price) <= state.maxBudget)
    .sort((a, b) => b.recentCount - a.recentCount)
    .slice(0, 4)
    .map((item) => ({ ...item, score: 72, reasons: ["예산 조건", "거래 빈도"] }));

  list.innerHTML = data.map((item) => `
    <button class="result-card detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="recommendation" aria-label="${item.complex} 상세 보기">
      <div>
        <h3>${item.complex}</h3>
        <p>${item.district} ${item.dong} · 전용 ${item.area.toFixed(2)}㎡ · ${item.floor}층 · ${item.builtYear}년 준공</p>
        <div class="tags">
          <span class="tag">${item.score}점 매칭</span>
          <span class="tag">평당 ${moneyFormatter.format(pricePerPyeong(item))}만</span>
          ${isRecord(item) ? `<span class="tag record">신고가</span>` : `<span class="tag">고점 대비 ${Math.round((1 - item.price / item.previousHigh) * 100)}%</span>`}
          ${item.permitZone ? `<span class="tag permit">토허 ${item.permitZone}</span>` : `<span class="tag">토허 외</span>`}
        </div>
      </div>
      <div class="price-block">
        <strong>${formatPrice(item.price)}</strong>
        <small>최근 ${item.recentCount}건</small>
      </div>
    </button>
  `).join("");
}

function filteredTransactions() {
  return transactions
    .filter((item) => state.selectedDistrict === "전체" || item.district === state.selectedDistrict)
    .filter((item) => toEok(item.price) <= state.maxBudget)
    .sort((a, b) => state.sortHighFirst ? b.price - a.price : a.price - b.price);
}

function renderTransactions() {
  const today = todayDate();
  const list = document.getElementById("transactionList");
  const rows = transactions
    .filter((item) => item.dealDate === today)
    .sort((a, b) => state.sortHighFirst ? b.price - a.price : a.price - b.price)
    .slice(0, 10);

  const latestInData = latestDealDate();
  const noDataMsg = latestInData
    ? `아직 오늘(${today}) 실거래가 집계되지 않았어요.<br><small>가장 최근 데이터는 ${latestInData} 기준이에요. 아래 누적 내역에서 확인하세요.</small>`
    : "오늘 실거래 데이터를 불러오는 중입니다.";

  list.innerHTML = rows.length ? rows.map((item) => `
    <button class="transaction-row detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="transaction" aria-label="${item.complex} 실거래 상세 보기">
      <div>
        <h3>${item.complex}</h3>
        <p>${item.district} ${item.dong} · 전용 ${item.area.toFixed(1)}㎡ · ${item.floor}층</p>
      </div>
      <div class="amount">${formatPrice(item.price)}</div>
    </button>
  `).join("") : `<div class="transaction-row no-data"><div><h3>오늘 실거래 집계 중</h3><p>${noDataMsg}</p></div></div>`;
}

/* ── 지역별 거래 활성도 ─────────────────────────────────── */

function lastMonthTransactions() {
  const latest = latestDealDate();
  if (!latest) return [];
  const cutoff = new Date(`${latest}T00:00:00`);
  cutoff.setMonth(cutoff.getMonth() - 1);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return transactions.filter((t) => t.dealDate >= cutoffStr);
}

function getDistrictActivity() {
  const monthly = lastMonthTransactions();
  const counts = {};
  for (const t of monthly) {
    counts[t.district] = (counts[t.district] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  return sorted.map(([district, count]) => {
    const ratio = count / max;
    const level = ratio > 0.55 ? "hot" : ratio > 0.28 ? "mid" : "low";
    return { district, count, ratio, level };
  });
}

function renderDistrictActivity() {
  const grid = document.getElementById("distGrid");
  if (!grid) return;
  const data = getDistrictActivity();
  grid.innerHTML = data.map(({ district, count, ratio, level }) => `
    <button class="dcell ${level}" type="button" data-activity-district="${district}" aria-label="${district} 거래 현황 보기">
      <div class="dcnm">${district}</div>
      <div class="dccnt">${count}건</div>
    </button>
  `).join("");
}

/* ── 구 상세 패널 ───────────────────────────────────────── */

function openDistrictDetail(district) {
  const overlay = document.getElementById("districtDetailOverlay");
  renderDistrictDetailContent(district, "today");
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
}

function closeDistrictDetail() {
  document.getElementById("districtDetailOverlay").setAttribute("hidden", "");
  document.body.style.overflow = "";
}

function renderDistrictDetailContent(district, view) {
  const monthly = lastMonthTransactions().filter((t) => t.district === district);
  const today = latestDealDate();
  const todayData = transactions.filter((t) => t.district === district && t.dealDate === today);
  const sevenDaysAgo = (() => {
    const d = new Date(`${today}T00:00:00`);
    d.setDate(d.getDate() - 6);
    return d.toISOString().slice(0, 10);
  })();
  const weekData = transactions.filter((t) => t.district === district && t.dealDate >= sevenDaysAgo);
  const viewData = view === "today" ? todayData : weekData;

  const totalCount = monthly.length;
  const recordCount = monthly.filter(isRecord).length;
  const permitCount = monthly.filter((t) => t.permitZone).length;

  // TOP 동 (오늘 기준)
  const dongCounts = {};
  for (const t of todayData.length ? todayData : monthly) {
    dongCounts[t.dong] = (dongCounts[t.dong] || 0) + 1;
  }
  const topDongs = Object.entries(dongCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // 하이라이트 카드
  const maxPriceItem = [...monthly].sort((a, b) => b.price - a.price)[0];
  const maxRecordItem = [...monthly].filter(isRecord).sort((a, b) => recordIncrease(b) - recordIncrease(a))[0];
  const maxPPItem = [...monthly].sort((a, b) => pricePerPyeong(b) - pricePerPyeong(a))[0];

  // 가격대별
  const priceRanges = [
    { label: "30억 이상",   min: 300000, max: Infinity },
    { label: "20억 ~ 30억", min: 200000, max: 300000 },
    { label: "15억 ~ 20억", min: 150000, max: 200000 },
    { label: "10억 ~ 15억", min: 100000, max: 150000 },
    { label: "10억 미만",   min: 0,      max: 100000 },
  ];
  const rangeData = priceRanges
    .map((r) => ({ ...r, count: monthly.filter((t) => t.price >= r.min && t.price < r.max).length }))
    .filter((r) => r.count > 0);

  const overlay = document.getElementById("districtDetailOverlay");
  overlay.innerHTML = `
    <div class="dd-topbar">
      <button class="dd-back" type="button" id="ddBackBtn" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--t1);padding:8px 14px;border-radius:var(--r2);background:var(--bg);border:1.5px solid var(--div);transition:all .15s">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
        뒤로가기
      </button>
      <span style="font-size:15px;font-weight:800;color:var(--t1)">${district} 부동산 현황</span>
    </div>
    <div class="dd-inner">
      <div class="dd-main">
        <div class="dd-title-row" style="margin-top:4px">
          <h2 class="dd-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${district} 부동산 현황
          </h2>
          <span class="dd-date">${today} 기준</span>
        </div>

        <div class="dd-stats-row">
          <div class="dd-stat-card">
            <div class="dd-stat-label">총 거래 (1개월)</div>
            <div class="dd-stat-value">${totalCount}건</div>
          </div>
          <div class="dd-stat-card">
            <div class="dd-stat-label">새로운 신고가</div>
            <div class="dd-stat-value record">${recordCount}건</div>
          </div>
          <div class="dd-stat-card">
            <div class="dd-stat-label">토지거래허가</div>
            <div class="dd-stat-value">${permitCount}건</div>
          </div>
          <div class="dd-top-dong">
            <div class="dd-top-header">
              <span class="dd-top-label">오늘 TOP 동</span>
              <span class="dd-hot-badge">HOT AREA</span>
            </div>
            <p class="dd-top-desc">거래 신고 데이터를 기반으로 거래량 및 가격 변동이 가장 활발한 상위 3개 동네를 선정합니다.</p>
            <div class="dd-top-list">
              ${topDongs.length ? topDongs.map(([dong, cnt], i) => `
                <div class="dd-top-item">
                  <span class="dd-top-rank">${i + 1}</span>
                  <span class="dd-top-dong-name">${dong}</span>
                  <span class="dd-top-count">${cnt}건</span>
                </div>
              `).join("") : `<div class="dd-top-item" style="color:var(--t3)">오늘 거래 데이터 없음</div>`}
            </div>
          </div>
        </div>

        <div class="dd-view-tabs">
          <button class="dd-tab ${view === "today" ? "active" : ""}" type="button" data-dd-view="today">오늘 내역</button>
          <button class="dd-tab ${view === "7days" ? "active" : ""}" type="button" data-dd-view="7days">7일 분석</button>
        </div>

        ${maxPriceItem ? `
        <div class="dd-highlights">
          <div class="dd-highlight-card">
            <div class="dd-hl-label">🏆 최고가 거래</div>
            <div class="dd-hl-complex">${maxPriceItem.complex}</div>
            <div class="dd-hl-price">${formatPrice(maxPriceItem.price)}</div>
            <div class="dd-hl-meta">${maxPriceItem.dong} · ${maxPriceItem.area.toFixed(1)}㎡ · ${Math.round(pyeong(maxPriceItem.area))}평</div>
          </div>
          <div class="dd-highlight-card ${maxRecordItem ? "record" : ""}">
            <div class="dd-hl-label">🔥 눈여겨볼 신고가</div>
            ${maxRecordItem ? `
              <div class="dd-hl-complex">${maxRecordItem.complex}</div>
              <div class="dd-hl-price">${formatPrice(maxRecordItem.price)}<span class="dd-hl-gap">+${recordIncrease(maxRecordItem)}%</span></div>
              <div class="dd-hl-meta">${maxRecordItem.dong} · 이전 최고 ${formatPrice(maxRecordItem.previousHigh)}</div>
            ` : `<div class="dd-hl-complex" style="color:var(--ink-muted)">해당 없음</div><div class="dd-hl-meta">최근 신고가 거래 없음</div>`}
          </div>
          <div class="dd-highlight-card">
            <div class="dd-hl-label">💎 최고 평단가 거래</div>
            <div class="dd-hl-complex">${maxPPItem.complex}</div>
            <div class="dd-hl-price">${moneyFormatter.format(pricePerPyeong(maxPPItem))}만<span class="dd-hl-unit">/평</span></div>
            <div class="dd-hl-meta">${maxPPItem.dong} · ${maxPPItem.area.toFixed(1)}㎡</div>
          </div>
        </div>
        ` : ""}

        ${rangeData.length ? `
        <div class="dd-ranges">
          ${rangeData.map((r) => `
            <div class="dd-range-row">
              <span class="dd-range-label">${r.label}</span>
              <span class="dd-range-count">${r.count}건</span>
              <div class="dd-range-bar"><span style="width:${Math.round(r.count / totalCount * 100)}%"></span></div>
            </div>
          `).join("")}
        </div>
        ` : ""}

        <div class="dd-list">
          ${viewData.length ? viewData.sort((a, b) => b.price - a.price).slice(0, 30).map((item) => `
            <button class="transaction-row detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="transaction" aria-label="${item.complex} 상세 보기">
              <div>
                <h3>${item.complex}</h3>
                <p>${item.dealDate} · ${item.dong} · 전용 ${item.area.toFixed(1)}㎡ · ${item.floor}층</p>
              </div>
              <div class="amount">${formatPrice(item.price)}</div>
            </button>
          `).join("") : `<div class="transaction-row"><div><h3>${view === "today" ? "오늘" : "최근 7일"} 거래 없음</h3><p>해당 기간에 집계된 ${district} 거래가 없습니다.</p></div></div>`}
        </div>
      </div>

    </div>
  `;

  document.getElementById("ddBackBtn").addEventListener("click", closeDistrictDetail);
  overlay.querySelectorAll("[data-dd-view]").forEach((btn) => {
    btn.addEventListener("click", () => renderDistrictDetailContent(district, btn.dataset.ddView));
  });
}

function recordRowHtml(item) {
  return `
    <button class="record-row detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="record" aria-label="${item.complex} 신고가 상세 보기">
      <div>
        <h3>${item.complex}</h3>
        <p>${item.district} ${item.dong} · 이전 최고 ${formatPrice(item.previousHigh)} · ${item.dealDate}</p>
      </div>
      <div class="amount">${formatRecordGap(item)}</div>
    </button>
  `;
}

function renderRecords() {
  const list = document.getElementById("recordList");
  if (!list) return;
  // 전체 신고가를 상승률 순으로
  const allRecords = transactions
    .filter(isRecord)
    .sort((a, b) => recordIncrease(b) - recordIncrease(a));
  const top5 = allRecords.slice(0, 5);

  if (!allRecords.length) {
    list.innerHTML = `<div class="transaction-row no-data"><div><h3>신고가 없음</h3><p>신고가 거래가 집계되면 표시됩니다.</p></div></div>`;
    return;
  }

  list.innerHTML = top5.map((item, i) => `
    <button class="rec-item detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="record">
      <div class="rank">${i + 1}</div>
      <div>
        <div class="rnm">${item.complex}</div>
        <div class="rdt">${item.district} ${item.dong} · ${item.area.toFixed(0)}㎡ · ${item.dealDate}</div>
      </div>
      <div class="rprice">
        <div class="rpval">${formatPrice(item.price)}</div>
        <div class="rpchg">${formatRecordGap(item)}</div>
      </div>
    </button>
  `).join("");
}

/* ── 새로 올라온 거래 ────────────────────────────────── */

function getTabTransactions(tab) {
  const dates = [...new Set(transactions.map(t => t.dealDate))].sort((a, b) => b.localeCompare(a));
  if (!dates.length) return [];
  if (tab === "today") return transactions.filter(t => t.dealDate === dates[0]);
  if (tab === "yesterday") return transactions.filter(t => t.dealDate === dates[1]);
  // 이번 주: 최근 7일치
  const cutoff = dates[Math.min(6, dates.length - 1)];
  return transactions.filter(t => t.dealDate >= cutoff);
}

function renderNewClosings() {
  const tab = newClosingsState.tab;
  const region = newClosingsState.region;
  const allItems = getTabTransactions(tab);
  const filtered = region === "전체" ? allItems : allItems.filter(t => t.district === region);
  const showAll = newClosingsState.showAll;

  // 지역 필터 pills
  const regionCounts = {};
  allItems.forEach(t => { regionCounts[t.district] = (regionCounts[t.district] || 0) + 1; });
  const regionList = ["전체", ...Object.keys(regionCounts).sort((a, b) => regionCounts[b] - regionCounts[a])];

  const pillsEl = document.getElementById("regionPills");
  if (pillsEl) pillsEl.innerHTML = regionList.map(r => {
    const cnt = r === "전체" ? allItems.length : (regionCounts[r] || 0);
    return `<button class="rpill ${r === region ? "on" : ""}" type="button" data-reg-region="${r}">${r} <em>${cnt}</em></button>`;
  }).join("");

  // 거래 목록: 평당가 높은 순
  const sorted = [...filtered].sort((a, b) => pricePerPyeong(b) - pricePerPyeong(a));
  const visible = showAll ? sorted : sorted.slice(0, 12);

  const listEl = document.getElementById("dealList");
  if (listEl) listEl.innerHTML = visible.length ? visible.map(item => {
    const [, cm, cd] = item.dealDate.split("-");
    return `
      <button class="di detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="transaction">
        <span class="dgu">${item.district}</span>
        <div>
          <div class="dname">${item.complex}${isRecord(item) ? '<span class="hibadge">신고가</span>' : ''}${item.permitZone ? '<span class="hibadge" style="background:#fff0e6;color:#e06020">토허</span>' : ''}</div>
          <div class="dinfo">${item.dong} · ${item.floor}층</div>
        </div>
        <span class="darea">${item.area.toFixed(0)}㎡</span>
        <span class="dprice${isRecord(item) ? ' hi' : ''}">${formatPrice(item.price)}</span>
        <span class="ddate">${parseInt(cm)}/${parseInt(cd)}</span>
      </button>
    `;
  }).join("") : `<div class="deal-empty">해당 기간에 집계된 거래가 없습니다.</div>`;

  // 더보기 버튼
  const moreBtn = document.getElementById("regMoreBtn");
  if (moreBtn) {
    const remaining = sorted.length - 12;
    if (!showAll && remaining > 0) {
      moreBtn.style.display = "";
      moreBtn.textContent = `+${remaining}건 더 보기 ↓`;
    } else {
      moreBtn.style.display = "none";
    }
  }
}

/* ── 갈아타기 후보 실거래 ─────────────────────────────── */

function candidateFilterItems(items) {
  if (candidateState.filter === "matched") {
    return items.filter((item) => item.summary.transactionCount > 0);
  }
  if (candidateState.filter === "tier1") return items.filter((item) => item.candidate.tier === "1티어");
  if (candidateState.filter === "tier2") return items.filter((item) => item.candidate.tier === "2티어");
  if (candidateState.filter === "tier3") return items.filter((item) => item.candidate.tier === "3티어");
  if (candidateState.filter === "watch") {
    return items.filter((item) => item.candidate.grade === "관찰" || item.candidate.tier === "관찰");
  }
  return items;
}

function candidateMetaText(candidate) {
  const parts = [
    candidate.district,
    candidate.dongs?.[0],
    candidate.station,
    candidate.households ? `${moneyFormatter.format(candidate.households)}세대` : "",
  ].filter(Boolean);
  return parts.join(" · ");
}

function renderCandidateStats(items) {
  const statsEl = document.getElementById("candidateStats");
  if (!statsEl) return;

  const matched = items.filter((item) => item.summary.transactionCount > 0);
  const txCount = items.reduce((sum, item) => sum + item.summary.transactionCount, 0);
  const latest = matched
    .map((item) => item.summary.latest)
    .filter(Boolean)
    .sort((a, b) => b.dealDate.localeCompare(a.dealDate))[0];
  const highest = matched
    .map((item) => item.summary.highest)
    .filter(Boolean)
    .sort((a, b) => b.price - a.price)[0];

  statsEl.innerHTML = `
    <div class="candidate-stat"><span>후보 단지</span><strong>${items.length}개</strong></div>
    <div class="candidate-stat"><span>거래 매칭</span><strong>${matched.length}개</strong></div>
    <div class="candidate-stat"><span>실거래 원장</span><strong>${moneyFormatter.format(txCount)}건</strong></div>
    <div class="candidate-stat"><span>최근 거래</span><strong>${latest ? escapeHtml(latest.dealDate) : "-"}</strong></div>
  `;

  const desc = document.getElementById("candidateDesc");
  if (desc) {
    const fetched = candidateState.fetchedAt ? new Date(candidateState.fetchedAt).toLocaleString("ko-KR") : "";
    const top = highest ? ` 최고가는 ${escapeHtml(highest.complex)} ${formatPrice(highest.price)}입니다.` : "";
    desc.textContent = `${candidateState.months}개월 범위의 국토교통부 아파트 매매 실거래를 후보 단지명으로 매칭했습니다.${top}${fetched ? ` ${fetched} 기준.` : ""}`;
  }
}

function renderCandidateTabs(items) {
  const tabsEl = document.getElementById("candidateTabs");
  if (!tabsEl) return;

  const filters = [
    ["all", "전체", items.length],
    ["tier1", "1티어", items.filter((item) => item.candidate.tier === "1티어").length],
    ["tier2", "2티어", items.filter((item) => item.candidate.tier === "2티어").length],
    ["tier3", "3티어", items.filter((item) => item.candidate.tier === "3티어").length],
    ["watch", "관찰", items.filter((item) => item.candidate.grade === "관찰" || item.candidate.tier === "관찰").length],
    ["matched", "거래 있음", items.filter((item) => item.summary.transactionCount > 0).length],
  ];

  tabsEl.innerHTML = filters.map(([key, label, count]) => `
    <button class="rpill ${candidateState.filter === key ? "on" : ""}" type="button" data-candidate-filter="${key}">
      ${label} <em>${count}</em>
    </button>
  `).join("");
}

function candidateAreaSummary(summary) {
  if (!summary.areaGroups.length) return "-";
  return summary.areaGroups
    .slice(0, 4)
    .map((group) => `${Math.round(group.area)}㎡ ${formatPrice(group.latestPrice)}`)
    .join(" · ");
}

function candidateDetailHtml(item) {
  const { candidate, summary, transactions: rows } = item;
  const latest = summary.latest;
  const highest = summary.highest;
  const lowest = summary.lowest;
  const schoolText = candidate.schools?.length ? candidate.schools.join(", ") : "-";
  const noteText = candidate.notes?.length ? candidate.notes.join(", ") : "-";

  const txRows = rows.length ? rows.map((tx) => `
    <div class="candidate-tx-row">
      <span>${escapeHtml(tx.dealDate)}</span>
      <span>${escapeHtml(tx.complex)} · ${escapeHtml(tx.dong)}</span>
      <span class="muted">${tx.area.toFixed(2)}㎡</span>
      <span class="muted">${tx.floor}층</span>
      <strong>${formatPrice(tx.price)}</strong>
    </div>
  `).join("") : `<div class="candidate-empty">조회 범위에 매칭된 실거래가 없습니다. 국토부 단지명이 다르면 별칭 보정이 필요합니다.</div>`;

  return `
    <div class="candidate-detail-inline">
      <div class="candidate-info-grid">
        <div class="candidate-info"><span>API 매칭 단지명</span><strong>${summary.matchedComplexNames.length ? escapeHtml(summary.matchedComplexNames.join(", ")) : "-"}</strong></div>
        <div class="candidate-info"><span>주소</span><strong>${summary.addresses.length ? escapeHtml(summary.addresses[0]) : escapeHtml(candidateMetaText(candidate))}</strong></div>
        <div class="candidate-info"><span>준공/세대</span><strong>${summary.builtYear || "-"}${candidate.households ? ` · ${moneyFormatter.format(candidate.households)}세대` : ""}</strong></div>
        <div class="candidate-info"><span>전용면적별 최근가</span><strong>${escapeHtml(candidateAreaSummary(summary))}</strong></div>
        <div class="candidate-info"><span>최근 거래</span><strong>${latest ? `${formatPrice(latest.price)} · ${escapeHtml(latest.dealDate)}` : "-"}</strong></div>
        <div class="candidate-info"><span>최고/최저</span><strong>${highest ? `${formatPrice(highest.price)} / ${formatPrice(lowest.price)}` : "-"}</strong></div>
        <div class="candidate-info"><span>학군</span><strong>${escapeHtml(schoolText)}</strong></div>
        <div class="candidate-info"><span>메모</span><strong>${escapeHtml(noteText)}</strong></div>
      </div>
      <div>
        <div class="candidate-tx-head">
          <div class="candidate-tx-title">조회 범위 전체 실거래 ${moneyFormatter.format(rows.length)}건</div>
          <div class="candidate-tx-note">${candidateState.months}개월 · 취소거래 제외</div>
        </div>
        <div class="candidate-tx-list">${txRows}</div>
      </div>
    </div>
  `;
}

function renderCandidateWatchlist() {
  const listEl = document.getElementById("candidateList");
  if (!listEl) return;

  renderCandidateStats(candidateState.items);
  renderCandidateTabs(candidateState.items);

  if (candidateState.loading) {
    listEl.innerHTML = `<div class="candidate-empty">국토교통부 실거래 API에서 후보 단지 거래를 불러오는 중입니다.</div>`;
    return;
  }

  if (candidateState.error) {
    listEl.innerHTML = `<div class="candidate-empty">${escapeHtml(candidateState.error)}</div>`;
    return;
  }

  const visible = candidateFilterItems(candidateState.items);
  if (!visible.length) {
    listEl.innerHTML = `<div class="candidate-empty">현재 필터에 해당하는 후보가 없습니다.</div>`;
    return;
  }

  listEl.innerHTML = visible.map((item) => {
    const { candidate, summary } = item;
    const latest = summary.latest;
    const isOpen = candidateState.selectedId === candidate.id;
    const rank = candidate.priority ? `${candidate.priority}위` : candidate.grade;
    const price = latest ? formatPrice(latest.price) : "거래 없음";
    const date = latest ? latest.dealDate : "-";
    const count = summary.transactionCount ? `${moneyFormatter.format(summary.transactionCount)}건` : "0건";
    const chipItems = [candidate.grade, candidate.tier, candidate.targetPrice].filter(Boolean).slice(0, 3);

    return `
      <button class="candidate-row ${isOpen ? "open" : ""}" type="button" data-candidate-id="${escapeHtml(candidate.id)}">
        <span class="candidate-rank">${escapeHtml(rank)}</span>
        <span>
          <span class="candidate-name">${escapeHtml(candidate.name)}</span>
          <span class="candidate-meta">${escapeHtml(candidateMetaText(candidate))}</span>
          <span class="candidate-chipline">${chipItems.map((chip) => `<span class="candidate-chip">${escapeHtml(chip)}</span>`).join("")}</span>
        </span>
        <span class="candidate-price">${price}</span>
        <span class="candidate-count">${count}</span>
        <span class="candidate-date">${escapeHtml(date)}</span>
      </button>
      ${isOpen ? candidateDetailHtml(item) : ""}
    `;
  }).join("");
}

async function fetchCandidateWatchlist() {
  candidateState.loading = true;
  candidateState.error = null;
  renderCandidateWatchlist();

  try {
    const res = await fetch(`/api/candidate-transactions?months=${candidateState.months}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);

    candidateState.items = json.data ?? [];
    candidateState.fetchedAt = json.fetchedAt ?? null;
    candidateState.selectedId =
      candidateState.selectedId ||
      candidateState.items.find((item) => item.summary.transactionCount > 0)?.candidate.id ||
      candidateState.items[0]?.candidate.id ||
      null;
  } catch (err) {
    candidateState.error = `후보 실거래 데이터를 불러오지 못했습니다. ${err.message}`;
  } finally {
    candidateState.loading = false;
    renderCandidateWatchlist();
  }
}

/* ── 거래량 캘린더 ──────────────────────────────────── */

function renderTxCalendar() {
  const { year, month, selectedDate } = calTxState;
  const ym = `${year}-${String(month).padStart(2, "0")}`;

  // 날짜별 거래 건수
  const dayCounts = {};
  transactions.filter(t => t.dealDate.startsWith(ym)).forEach(t => {
    const day = t.dealDate.slice(8);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const label = document.getElementById("calMonthLabel");
  if (label) label.textContent = `${year}년 ${month}월`;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  let html = `<div class="tx-cal-weekdays">${weekdays.map(w => `<span>${w}</span>`).join("")}</div>`;
  html += `<div class="tx-cal-grid">`;

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="tx-cal-cell empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, "0");
    const dateStr = `${ym}-${dayStr}`;
    const count = dayCounts[dayStr] || 0;
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === todayDate();
    const cls = ["tx-cal-cell", count ? "has-data" : "", isSelected ? "selected" : "", isToday ? "today" : ""].filter(Boolean).join(" ");
    html += `<button class="${cls}" type="button" data-cal-date="${dateStr}">
      <span class="cal-day-num">${d}</span>
      ${count ? `<span class="cal-count">${count >= 1000 ? Math.round(count/100)/10 + "k" : count}</span>` : ""}
    </button>`;
  }

  html += `</div>`;
  const grid = document.getElementById("txCalendarGrid");
  if (grid) grid.innerHTML = html;
}

/* ── 지역별 거래 (날짜 기준) ────────────────────────── */

function renderRegionDaily(date) {
  const label = document.getElementById("regionDateLabel");
  if (label) {
    const [, m, d] = date.split("-");
    label.textContent = `${parseInt(m)}월 ${parseInt(d)}일 기준`;
  }

  const items = transactions.filter(t => t.dealDate === date);
  const districtOrder = [
    "강남구","서초구","송파구","강동구","용산구","마포구","성동구","광진구",
    "강서구","양천구","영등포구","동작구","관악구","은평구","서대문구","종로구",
    "중구","중랑구","성북구","강북구","도봉구","노원구","동대문구","금천구","구로구",
  ];
  const regionCounts = {};
  items.forEach(t => { regionCounts[t.district] = (regionCounts[t.district] || 0) + 1; });

  const listEl = document.getElementById("regionDailyList");
  if (!listEl) return;

  if (!items.length) {
    listEl.innerHTML = `<div class="region-daily-hint">해당 날짜에 등록된 거래가 없습니다.</div>`;
    return;
  }

  const sorted = districtOrder
    .filter(d => regionCounts[d])
    .concat(Object.keys(regionCounts).filter(d => !districtOrder.includes(d)))
    .sort((a, b) => (regionCounts[b] || 0) - (regionCounts[a] || 0));

  listEl.innerHTML = sorted.map(district => {
    const cnt = regionCounts[district] || 0;
    const distItems = items.filter(t => t.district === district);
    const maxPrice = Math.max(...distItems.map(t => t.price));
    const recordCnt = distItems.filter(isRecord).length;
    return `
      <button class="region-daily-row" type="button" data-activity-district="${district}">
        <span class="rdr-name">${district}</span>
        <span class="rdr-count">${cnt}건</span>
        <span class="rdr-max">${formatPrice(maxPrice)}</span>
        ${recordCnt ? `<span class="rdr-badge">신고가 ${recordCnt}</span>` : ""}
      </button>
    `;
  }).join("");
}

/* ── 전체 실거래 누적 내역 (날짜별 스택) ─────────────── */

function renderTransactionHistory() {
  const historyEl = document.getElementById("transactionHistory");
  if (!historyEl) return;

  const today = todayDate();
  const past = transactions.filter(t => t.dealDate < today);

  if (!past.length) {
    historyEl.innerHTML = `<div class="transaction-row no-data"><div><h3>이전 거래 내역 없음</h3><p>데이터를 불러오면 날짜별로 쌓입니다.</p></div></div>`;
    return;
  }

  const dates = [...new Set(past.map(t => t.dealDate))]
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 90); // 최근 90일치

  historyEl.innerHTML = dates.map(date => {
    const items = past.filter(t => t.dealDate === date).sort((a, b) => b.price - a.price);
    const [, m, d] = date.split("-");
    const weekday = ["일","월","화","수","목","금","토"][new Date(`${date}T00:00:00`).getDay()];
    const recordCount = items.filter(isRecord).length;
    const permitCount = items.filter(t => t.permitZone).length;

    return `
      <div class="hgrp">
        <div class="hhdr" role="button" tabindex="0">
          <div>
            <span class="hdate">${parseInt(m)}월 ${parseInt(d)}일 ${weekday}요일</span>
            <span class="hcnt">${items.length}건</span>
            ${recordCount ? `<span class="htag record">신고가 ${recordCount}</span>` : ""}
            ${permitCount ? `<span class="htag permit">토허 ${permitCount}</span>` : ""}
          </div>
          <svg class="hchev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="hbody">
          ${items.slice(0, 30).map(item => `
            <div class="hdeal detail-trigger" role="button" tabindex="0" data-detail-id="${item.id}" data-detail-context="transaction" style="cursor:pointer">
              <span class="hgu">${item.district}</span>
              <span>${item.complex}</span>
              <span style="color:var(--t3);font-size:12px">${item.area.toFixed(0)}㎡</span>
              <span style="margin-left:auto;font-weight:800${isRecord(item) ? ";color:#E03535" : ""}">${formatPrice(item.price)}</span>
            </div>
          `).join("")}
          ${items.length > 30 ? `<div class="hmore">+${items.length - 30}건 더 있음</div>` : ""}
        </div>
      </div>
    `;
  }).join("");
  // 아코디언 이벤트는 wireEvents()에서 한 번만 등록됨
}

/* ── 전체 신고가 오버레이 ──────────────────────────────── */

function renderRecordsByDate(date) {
  const rows = transactions
    .filter(isRecord)
    .filter((t) => t.dealDate === date)
    .sort((a, b) => recordIncrease(b) - recordIncrease(a));
  if (!rows.length) return `<div class="transaction-row"><div><h3>${date} 신고가 없음</h3><p>해당 날짜에 신고가 거래가 없습니다.</p></div></div>`;
  return rows.map(recordRowHtml).join("");
}

function openRecordsOverlay() {
  const overlay = document.getElementById("districtDetailOverlay");
  const today = latestDealDate();
  const allRecords = transactions.filter(isRecord);
  const dates = [...new Set(allRecords.map((t) => t.dealDate))].sort((a, b) => b.localeCompare(a)).slice(0, 14);
  const countFn = (d) => allRecords.filter((t) => t.dealDate === d).length;

  // 전체 요약 (날짜 무관)
  const sorted = [...allRecords].sort((a, b) => recordIncrease(b) - recordIncrease(a));
  const topRecord = sorted[0];
  const avgIncrease = sorted.length ? (sorted.reduce((s, t) => s + recordIncrease(t), 0) / sorted.length).toFixed(1) : 0;
  const distCnt = {};
  sorted.forEach((t) => { distCnt[t.district] = (distCnt[t.district] || 0) + 1; });
  const topDist = Object.entries(distCnt).sort((a, b) => b[1] - a[1])[0];

  overlay.innerHTML = `
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            홈으로
          </button>
          <span>›</span><span>날짜별 신고가</span>
        </div>
        <div class="dd-title-row">
          <h2 class="dd-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            날짜별 신고가 내역
          </h2>
          <span class="dd-date">전체 ${allRecords.length}건</span>
        </div>
        <div class="dd-highlights" style="margin-top:16px">
          <div class="dd-highlight-card record">
            <div class="dd-hl-label">🔥 최고 상승률</div>
            <div class="dd-hl-complex">${topRecord?.complex ?? "-"}</div>
            <div class="dd-hl-price">${formatPrice(topRecord?.price ?? 0)}<span class="dd-hl-gap">+${recordIncrease(topRecord ?? {})}%</span></div>
            <div class="dd-hl-meta">${topRecord?.district ?? ""} ${topRecord?.dong ?? ""} · ${topRecord?.dealDate ?? ""}</div>
          </div>
          <div class="dd-highlight-card">
            <div class="dd-hl-label">📊 평균 상승률</div>
            <div class="dd-hl-complex">신고가 ${sorted.length}건</div>
            <div class="dd-hl-price">${avgIncrease}%</div>
            <div class="dd-hl-meta">전체 신고가 평균</div>
          </div>
          <div class="dd-highlight-card">
            <div class="dd-hl-label">📍 신고가 최다 구</div>
            ${topDist ? `<div class="dd-hl-complex">${topDist[0]}</div><div class="dd-hl-price">${topDist[1]}건</div><div class="dd-hl-meta">신고가 최다 발생 구</div>` : ""}
          </div>
        </div>
        ${overlayDateStripHtml(dates, today, countFn)}
        <div class="overlay-date-content dd-list" style="margin-top:8px">
          ${renderRecordsByDate(today)}
        </div>
      </div>
    </div>
  `;
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn").addEventListener("click", closeDistrictDetail);
  bindOverlayDateTabs(overlay, renderRecordsByDate);
}

/* ── 실거래 오버레이 (월/연 이동 + 자치구 / 가격대별) ─── */

const PRICE_RANGES = [
  { label: "5억 이하",    min: 0,      max: 50000  },
  { label: "5억 ~ 10억",  min: 50000,  max: 100000 },
  { label: "10억 ~ 15억", min: 100000, max: 150000 },
  { label: "15억 ~ 20억", min: 150000, max: 200000 },
  { label: "20억 ~ 30억", min: 200000, max: 300000 },
  { label: "30억 초과",   min: 300000, max: Infinity },
];

let txOvState = { month: null, date: null, view: "district" };

function txAvailableMonths() {
  return [...new Set(transactions.map((t) => t.dealDate.slice(0, 7)))]
    .sort((a, b) => b.localeCompare(a));
}

function txDatesInMonth(ym) {
  return [...new Set(
    transactions.filter((t) => t.dealDate.startsWith(ym)).map((t) => t.dealDate)
  )].sort((a, b) => b.localeCompare(a));
}

function txMonthNavHtml(month) {
  const months = txAvailableMonths();
  const idx = months.indexOf(month);
  const [y, m] = month.split("-");
  return `
    <div class="tx-month-nav">
      <button class="tx-month-arrow" type="button" data-month-step="1" ${idx >= months.length - 1 ? "disabled" : ""}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <span class="tx-month-label">${y}년 ${parseInt(m)}월</span>
      <button class="tx-month-arrow" type="button" data-month-step="-1" ${idx <= 0 ? "disabled" : ""}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>`;
}

function txDayStripHtml(month, selectedDate) {
  const dates = txDatesInMonth(month);
  if (!dates.length) return `<div class="overlay-date-strip"><span style="padding:16px;color:var(--ink-muted);font-size:13px">해당 월 거래 없음</span></div>`;
  return `<div class="overlay-date-strip">` + dates.map((date) => {
    const { day, weekday } = formatDayLabel(date);
    const count = transactions.filter((t) => t.dealDate === date).length;
    return `<button class="permit-date ${date === selectedDate ? "active" : ""}" type="button" data-overlay-date="${date}">
      <span>${weekday}</span><strong>${day}</strong><em>${count}</em>
    </button>`;
  }).join("") + `</div>`;
}

function txViewTabsHtml(view) {
  return `<div class="tx-view-tabs">
    <button class="tx-view-tab ${view === "district" ? "active" : ""}" type="button" data-view="district">자치구별</button>
    <button class="tx-view-tab ${view === "price" ? "active" : ""}" type="button" data-view="price">가격대별</button>
  </div>`;
}

function txGroupHtml(label, subLabel, count, itemsHtml) {
  return `<div class="tx-group">
    <button class="tx-group-header" type="button">
      <span class="tx-group-name">${label}</span>
      <span class="tx-group-meta">${subLabel} · ${count}건</span>
      <svg class="tx-group-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <div class="tx-group-items">${itemsHtml}</div>
  </div>`;
}

function txRowsHtml(items) {
  return items.map((item) => `
    <button class="transaction-row detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="transaction">
      <div>
        <h3>${item.complex}</h3>
        <p>${item.district} ${item.dong} · 전용 ${item.area.toFixed(1)}㎡ · ${item.floor}층</p>
      </div>
      <div class="amount">${formatPrice(item.price)}</div>
    </button>`).join("");
}

function txRenderByDistrict(items) {
  if (!items.length) return `<div class="transaction-row"><div><h3>거래 없음</h3><p>해당 날짜에 집계된 거래가 없습니다.</p></div></div>`;
  const groups = {};
  items.forEach((t) => { (groups[t.district] = groups[t.district] || []).push(t); });
  return Object.entries(groups)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([district, rows]) => {
      const sorted = [...rows].sort((a, b) => b.price - a.price);
      const maxP = sorted[0]?.price ?? 0;
      return txGroupHtml(district, `최고 ${formatPrice(maxP)}`, rows.length, txRowsHtml(sorted));
    }).join("");
}

function txRenderByPrice(items) {
  if (!items.length) return `<div class="transaction-row"><div><h3>거래 없음</h3><p>해당 날짜에 집계된 거래가 없습니다.</p></div></div>`;
  return PRICE_RANGES.map((range) => {
    const rows = items
      .filter((t) => t.price >= range.min && t.price < range.max)
      .sort((a, b) => b.price - a.price);
    if (!rows.length) return "";
    const districts = [...new Set(rows.map((r) => r.district))].join(", ");
    return txGroupHtml(range.label, districts, rows.length, txRowsHtml(rows));
  }).join("");
}

function txRenderContent(date, view) {
  const items = transactions.filter((t) => t.dealDate === date).sort((a, b) => b.price - a.price);
  return view === "district" ? txRenderByDistrict(items) : txRenderByPrice(items);
}

function openTransactionsOverlay() {
  const overlay = document.getElementById("districtDetailOverlay");
  const today = latestDealDate();
  const todayMonth = today.slice(0, 7);
  txOvState = { month: todayMonth, date: today, view: "district" };

  overlay.innerHTML = `
    <div class="dd-topbar">
      <button class="dd-back" type="button" id="ddBackBtn" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--t1);padding:8px 14px;border-radius:var(--r2);background:var(--bg);border:1.5px solid var(--div)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
        뒤로가기
      </button>
      <span style="font-size:15px;font-weight:800;color:var(--t1)">날짜별 실거래 전체</span>
    </div>
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main">
        <div>
        <div id="txMonthNav">${txMonthNavHtml(todayMonth)}</div>
        <div id="txDayStrip">${txDayStripHtml(todayMonth, today)}</div>
        <div id="txViewTabs">${txViewTabsHtml("district")}</div>
        <div class="tx-content dd-list" id="txContent">${txRenderContent(today, "district")}</div>
      </div>
    </div>`;

  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn").addEventListener("click", closeDistrictDetail);

  overlay.addEventListener("click", (e) => {
    // 월 이동
    const monthBtn = e.target.closest("[data-month-step]");
    if (monthBtn && !monthBtn.disabled) {
      const step = parseInt(monthBtn.dataset.monthStep);
      const months = txAvailableMonths();
      const newIdx = months.indexOf(txOvState.month) + step;
      if (newIdx >= 0 && newIdx < months.length) {
        txOvState.month = months[newIdx];
        const dates = txDatesInMonth(txOvState.month);
        txOvState.date = dates[0] || txOvState.date;
        document.getElementById("txMonthNav").innerHTML = txMonthNavHtml(txOvState.month);
        document.getElementById("txDayStrip").innerHTML = txDayStripHtml(txOvState.month, txOvState.date);
        document.getElementById("txContent").innerHTML = txRenderContent(txOvState.date, txOvState.view);
      }
      return;
    }
    // 일자 탭
    const dayBtn = e.target.closest("[data-overlay-date]");
    if (dayBtn) {
      txOvState.date = dayBtn.dataset.overlayDate;
      overlay.querySelectorAll("[data-overlay-date]").forEach((b) => b.classList.remove("active"));
      dayBtn.classList.add("active");
      document.getElementById("txContent").innerHTML = txRenderContent(txOvState.date, txOvState.view);
      return;
    }
    // 뷰 탭
    const viewBtn = e.target.closest("[data-view]");
    if (viewBtn) {
      txOvState.view = viewBtn.dataset.view;
      overlay.querySelectorAll("[data-view]").forEach((b) => b.classList.remove("active"));
      viewBtn.classList.add("active");
      document.getElementById("txContent").innerHTML = txRenderContent(txOvState.date, txOvState.view);
      return;
    }
    // 그룹 열기/닫기
    const groupHeader = e.target.closest(".tx-group-header");
    if (groupHeader) {
      groupHeader.closest(".tx-group").classList.toggle("open");
    }
  });
}

/* ── 예산 검색 결과 ───────────────────────────────────── */

const BUDGET_PAGE = 20;
let budgetPage = 1;
let budgetFiltered = [];

function renderBudgetResults(totalMan, region) {
  budgetPage = 1;

  // 총 예산 이하 전체 + 예산의 90% 이상인 것 우선 표시 (딱 맞는 매물 강조)
  const maxPrice = totalMan;
  const nearMin  = Math.round(totalMan * 0.85); // 예산 85% 이상이면 "딱 맞는" 가격대

  let filtered = transactions.filter(t => t.price <= maxPrice);

  if (region) {
    filtered = filtered.filter(t => t.district === region || t.dong?.includes(region));
  }

  // 단지별로 대표 거래(최신) 1건씩 묶기
  const seen = new Set();
  const unique = [];
  for (const t of filtered) {
    const key = `${t.complex}|${t.area}`;
    if (!seen.has(key)) { seen.add(key); unique.push(t); }
  }
  // 예산에 가까운 것 먼저 (딱 맞는 가격대 상위 노출)
  unique.sort((a, b) => b.price - a.price);
  budgetFiltered = unique;

  const resultEl   = document.getElementById("budgetResults");
  const titleEl    = document.getElementById("budgetResultTitle");
  const descEl     = document.getElementById("budgetResultDesc");
  const countEl    = document.getElementById("budgetResultCount");
  const listEl     = document.getElementById("budgetDealList");
  const moreBtn    = document.getElementById("budgetMoreBtn");

  if (!resultEl) return;

  const budgetStr = totalMan >= 10000
    ? `${Math.floor(totalMan / 10000)}억 ${totalMan % 10000 > 0 ? (totalMan % 10000).toLocaleString() + "만원" : ""}`.trim()
    : `${totalMan.toLocaleString()}만원`;

  titleEl.textContent = `예산 ${budgetStr} 이하 단지`;
  descEl.textContent  = region
    ? `${region} 기준 · 가격 높은 순 정렬`
    : `서울 전체 기준 · 가격 높은 순 정렬`;
  countEl.textContent = `${unique.length.toLocaleString()}건`;

  resultEl.style.display = "block";

  function paintPage() {
    const slice = budgetFiltered.slice(0, budgetPage * BUDGET_PAGE);
    listEl.innerHTML = slice.length === 0
      ? `<div style="padding:32px;text-align:center;color:var(--t3);font-size:14px">
           해당 가격대 거래 단지가 없어요<br>
           <span style="font-size:12px;margin-top:6px;display:block">예산을 조정하거나 지역 조건을 바꿔보세요</span>
         </div>`
      : slice.map(t => {
          const isNew = t.price > (t.previousHigh || 0);
          const diff  = t.price - (t.previousHigh || t.price);
          const diffStr = diff > 0 ? `+${(diff/1000).toFixed(1)}억` : diff < 0 ? `${(diff/1000).toFixed(1)}억` : "전고가";
          const pct  = totalMan > 0 ? Math.round((t.price / totalMan) * 100) : 0;
          return `<button class="di" type="button" data-id="${t.id}">
            <span class="dc">${t.district}</span>
            <span class="dn">${t.complex} <span class="da">${t.area.toFixed(0)}㎡ ${t.floor}층</span></span>
            <span class="dd">${t.dealDate.slice(0, 7)}</span>
            <span class="dp">${(t.price / 10000).toFixed(1)}억
              <span class="dch ${isNew ? "up" : diff < 0 ? "dn2" : "flat"}">${diffStr}</span>
            </span>
            <span class="dbudget-bar" title="예산 대비 ${pct}%">
              <span class="dbudget-fill" style="width:${Math.min(pct,100)}%"></span>
            </span>
          </button>`;
        }).join("");

    moreBtn.style.display = budgetFiltered.length > budgetPage * BUDGET_PAGE ? "" : "none";
  }

  paintPage();

  moreBtn.onclick = () => { budgetPage++; paintPage(); };

  // 거래 상세 클릭
  listEl.addEventListener("click", e => {
    const btn = e.target.closest("[data-id]");
    if (!btn) return;
    const t = transactions.find(x => String(x.id) === btn.dataset.id);
    if (t) openDetailDialog(t);
  });

  // 한국부동산원 시세 버튼 — 지역 선택된 경우에만 표시
  const kreaiBtn = document.getElementById("kreaiPriceBtn");
  if (kreaiBtn) {
    kreaiBtn.style.display = region ? "" : "none";
    kreaiBtn.onclick = () => fetchKreaiPrice(region);
  }
}

/* ── 한국부동산원 시세 조회 ──────────────────────────────── */

// 구 이름 → 법정동 코드
const DISTRICT_CODES_JS = {
  종로구:"11110",중구:"11140",용산구:"11170",성동구:"11200",광진구:"11215",
  동대문구:"11230",중랑구:"11260",성북구:"11290",강북구:"11305",도봉구:"11320",
  노원구:"11350",은평구:"11380",서대문구:"11410",마포구:"11440",양천구:"11470",
  강서구:"11500",구로구:"11530",금천구:"11545",영등포구:"11560",동작구:"11590",
  관악구:"11620",서초구:"11650",강남구:"11680",송파구:"11710",강동구:"11740",
};

async function fetchKreaiPrice(region) {
  const rowEl = document.getElementById("kreaiPriceRow");
  const btn   = document.getElementById("kreaiPriceBtn");
  if (!rowEl) return;

  const lawdCd = DISTRICT_CODES_JS[region];
  if (!lawdCd) {
    rowEl.style.display = "";
    rowEl.innerHTML = `<span style="color:var(--t3);font-size:14px">지역을 구 단위로 선택해주세요 (예: 강남구)</span>`;
    return;
  }

  rowEl.style.display = "";
  rowEl.innerHTML = `<span style="color:var(--t3);font-size:14px">한국부동산원 시세 불러오는 중…</span>`;
  if (btn) btn.disabled = true;

  const now = new Date();
  const ym  = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    const res  = await fetch(`/api/apt-price?lawdCd=${lawdCd}&dealYmd=${ym}`);
    const json = await res.json();

    if (!res.ok || json.error) {
      rowEl.innerHTML = `
        <div style="padding:14px 0;">
          <div style="font-size:14px;font-weight:700;color:var(--t1);margin-bottom:6px">📊 한국부동산원 시세</div>
          <div style="font-size:13px;color:var(--t3);line-height:1.6">
            API 키가 없어요. 아래 방법으로 발급받고 .env에 추가하면 시세 데이터를 볼 수 있어요.<br>
            <a href="https://www.data.go.kr/data/15058017/openapi.do" target="_blank" style="color:var(--accent)">data.go.kr → 한국부동산원_아파트매매실거래상세 신청</a><br>
            발급 후: <code style="background:var(--bg);padding:2px 6px;border-radius:4px;font-size:12px">KREAI_API_KEY=발급받은키</code> 를 .env에 추가
          </div>
        </div>`;
      return;
    }

    const list = json.data || [];
    if (list.length === 0) {
      rowEl.innerHTML = `<span style="color:var(--t3);font-size:14px">${region} ${ym} 시세 데이터가 없어요</span>`;
      return;
    }

    // 단지별 평균 단가 계산
    const byComplex = {};
    for (const item of list) {
      const nm = item["aptNm"] || item["아파트"] || "알 수 없음";
      const price = Number(String(item["dealAmount"] || item["거래금액"] || "0").replace(/,/g, ""));
      const area  = Number(item["excluUseAr"] || item["전용면적"] || 1);
      if (!byComplex[nm]) byComplex[nm] = { total: 0, count: 0, perSqm: 0 };
      byComplex[nm].total += price;
      byComplex[nm].count += 1;
      byComplex[nm].perSqm = Math.round((byComplex[nm].total / byComplex[nm].count) / area * 3.3);
    }

    const sorted = Object.entries(byComplex)
      .map(([nm, d]) => ({ nm, avg: Math.round(d.total / d.count), perSqm: d.perSqm }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6);

    rowEl.innerHTML = `
      <div style="margin-bottom:10px">
        <span style="font-size:13px;font-weight:800;color:var(--accent)">📊 한국부동산원 시세</span>
        <span style="font-size:12px;color:var(--t3);margin-left:8px">${region} · ${ym.slice(0,4)}년 ${ym.slice(4)}월</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${sorted.map(s => `
          <div style="background:var(--bg);border-radius:var(--r2);padding:10px 14px;min-width:140px">
            <div style="font-size:13px;font-weight:700;color:var(--t1);margin-bottom:3px">${s.nm}</div>
            <div style="font-size:16px;font-weight:900;color:var(--t1)">${(s.avg/10000).toFixed(1)}억</div>
            <div style="font-size:11px;color:var(--t3);margin-top:1px">평당 ${s.perSqm.toLocaleString()}만원</div>
          </div>
        `).join("")}
      </div>`;
  } catch (e) {
    rowEl.innerHTML = `<span style="color:var(--t3);font-size:14px">시세 불러오기 실패: ${e.message}</span>`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ── 토허구역 프리뷰 (메인 카드) ───────────────────────── */

function renderPermitPreview() {
  const permits = permitTransactions();
  const latest = latestDealDate();
  const todayCount = permits.filter(t => t.dealDate === latest).length;
  const todayEl = document.getElementById("permitTodayCount");
  const labelEl = document.getElementById("permitDateLabel");
  if (todayEl) todayEl.textContent = todayCount;
  if (labelEl) labelEl.textContent = `${latest} 기준`;
  const distCounts = {};
  permits.forEach(t => { distCounts[t.district] = (distCounts[t.district] || 0) + 1; });
  const tags = document.getElementById("permitTagsRow");
  if (tags) {
    tags.innerHTML = Object.entries(distCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 8)
      .map(([d, c]) => `<span style="font-size:12px;font-weight:800;padding:5px 12px;background:var(--accent-l);color:var(--accent);border-radius:99px">${d} ${c}</span>`)
      .join('');
  }
}

/* ── 자치구 팝업 ─────────────────────────────────────── */

function initGuDropdown() {
  const input = document.getElementById("hRegion");
  const overlay = document.getElementById("guOverlay");
  const popup = document.getElementById("guPopup");
  const grid = document.getElementById("guGrid");
  const closeBtn = document.getElementById("guPopupClose");
  const clearBtn = document.getElementById("guClear");
  if (!input || !popup || !grid) return;

  const guList = [
    "강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구",
    "노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구",
    "성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"
  ];

  grid.innerHTML = guList.map(gu => `<div class="gu-opt" data-gu="${gu}">${gu}</div>`).join("");

  function openPopup() {
    const rect = input.getBoundingClientRect();
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.bottom + 6}px`;
    popup.style.display = "block";
    overlay.classList.add("open");
  }
  function closePopup() {
    popup.style.display = "none";
    overlay.classList.remove("open");
  }

  input.addEventListener("click", openPopup);
  overlay.addEventListener("click", closePopup);
  closeBtn?.addEventListener("click", closePopup);
  clearBtn?.addEventListener("click", () => {
    input.value = "";
    grid.querySelectorAll(".gu-opt").forEach(el => el.classList.remove("sel"));
    closePopup();
  });
  grid.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-gu]");
    if (!opt) return;
    grid.querySelectorAll(".gu-opt").forEach(el => el.classList.remove("sel"));
    opt.classList.add("sel");
    input.value = opt.dataset.gu;
    closePopup();
  });
}

/* ── 토허구역 오버레이 ────────────────────────────────── */

function renderPermitsByDate(date) {
  const rows = permitTransactions()
    .filter((t) => t.dealDate === date)
    .sort((a, b) => b.price - a.price);
  if (!rows.length) return `<div class="transaction-row"><div><h3>${date} 토허구역 거래 없음</h3><p>해당 날짜에 토지거래허가 거래가 없습니다.</p></div></div>`;
  return rows.map((item) => `
    <button class="transaction-row detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="permit">
      <div>
        <h3>${item.complex}</h3>
        <p>${item.district} ${item.dong} · ${item.permitZone}</p>
      </div>
      <div class="amount">${formatPrice(item.price)}</div>
    </button>
  `).join("");
}

function openPermitsOverlay() {
  const overlay = document.getElementById("districtDetailOverlay");
  const all = permitTransactions();
  const today = latestDealDate();
  const dates = [...new Set(all.map((t) => t.dealDate))].sort((a, b) => b.localeCompare(a)).slice(0, 14);
  const countFn = (d) => all.filter((t) => t.dealDate === d).length;

  overlay.innerHTML = `
    <div class="dd-topbar">
      <button class="dd-back" type="button" id="ddBackBtn" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--t1);padding:8px 14px;border-radius:var(--r2);background:var(--bg);border:1.5px solid var(--div)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
        뒤로가기
      </button>
      <span style="font-size:15px;font-weight:800;color:var(--t1)">날짜별 토지거래허가 내역</span>
    </div>
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main">
        <div class="dd-title-row">
          <span class="dd-date">전체 ${all.length}건</span>
        </div>
        ${overlayDateStripHtml(dates, today, countFn)}
        <div class="overlay-date-content dd-list" style="margin-top:8px">
          ${renderPermitsByDate(today)}
        </div>
      </div>
    </div>
  `;
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn").addEventListener("click", closeDistrictDetail);
  bindOverlayDateTabs(overlay, renderPermitsByDate);
}

function renderPermits() {
  const dateRows = permitTransactions().filter((item) => item.dealDate === state.selectedPermitDate);
  const activeItem = getSelectedPermitItem();
  if (activeItem && !dateRows.some((item) => item.id === state.selectedPermitId)) {
    state.selectedPermitId = activeItem.id;
  }

  document.getElementById("permitTodayCount").textContent = totalPermitDealsToday();
  document.getElementById("permitDateLabel").textContent = `${latestDealDate()} 기준`;
  document.getElementById("permitListTitle").textContent = `${state.selectedPermitDate} 거래내역`;
  document.getElementById("permitListMeta").textContent = `서울 ${dateRows.length}건 · ${Object.keys(groupedByDistrict(dateRows)).length || 0}개 구`;

  document.getElementById("permitDateStrip").innerHTML = permitDates().map((date) => {
    const { day, weekday } = formatDayLabel(date);
    const count = permitTransactions().filter((item) => item.dealDate === date).length;
    const active = date === state.selectedPermitDate ? "active" : "";
    return `
      <button class="permit-date ${active}" type="button" data-permit-date="${date}" aria-label="${date} 토지거래허가 ${count}건">
        <span>${weekday}</span>
        <strong>${day}</strong>
        <small>허가 ${count}</small>
      </button>
    `;
  }).join("");

  const groups = groupedByDistrict(dateRows);
  document.getElementById("permitDailyList").innerHTML = dateRows.length ? Object.entries(groups).map(([district, rows]) => `
    <section class="permit-district-group">
      <div class="permit-district-title">
        <strong>${district}</strong>
        <span>허가 ${rows.length}</span>
      </div>
      ${rows.map((item) => `
        <button class="permit-deal-row ${item.id === state.selectedPermitId ? "active" : ""}" type="button" data-permit-id="${item.id}">
          <div>
            <h4>${item.complex}</h4>
            <p>${item.dong} · ${formatPrice(item.price)} · 전용 ${item.area.toFixed(2)}㎡</p>
            <span>${item.permitDays}일 만에 허가</span>
          </div>
          <div class="permit-row-status">허가</div>
        </button>
      `).join("")}
    </section>
  `).join("") : `
    <div class="permit-empty">
      <h3>해당 일자의 허가 거래 없음</h3>
      <p>다른 날짜를 선택하면 거래 단지 정보를 확인할 수 있습니다.</p>
    </div>
  `;

  renderPermitComplex(activeItem);
}

function renderPermitComplex(item) {
  const panel = document.getElementById("permitComplexInfo");
  if (!item) {
    panel.innerHTML = `
      <div class="card-kicker">COMPLEX INFO</div>
      <h3>단지 정보 없음</h3>
      <p>선택한 일자에 토지거래허가 거래가 없습니다.</p>
    `;
    return;
  }

  const waiting = Math.max(0, Math.round((item.permitDays || 1) * 1.8));
  panel.innerHTML = `
    <div class="card-kicker">COMPLEX INFO</div>
    <h3>${item.complex}</h3>
    <p class="complex-address">${item.address || `서울 ${item.district} ${item.dong}`} · 총 ${moneyFormatter.format(item.households || 0)}세대</p>
    <div class="complex-status">
      <div>
        <span>토지거래허가</span>
        <strong>오늘 등록</strong>
      </div>
      <div>
        <span>실거래 신고</span>
        <strong>${item.permitDays || 1}일 전</strong>
      </div>
      <div>
        <span>AI 예측 대기량</span>
        <strong>${waiting}건</strong>
      </div>
    </div>
    <div class="mini-chart" aria-label="단지 거래 현황">
      <span style="height: 24%"></span>
      <span style="height: 38%"></span>
      <span style="height: 44%"></span>
      <span style="height: 56%"></span>
      <span style="height: 62%"></span>
      <span style="height: 80%"></span>
    </div>
    <div class="complex-actions">
      <button class="outline-mini detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="permit">거래 상세 보기</button>
      <span>${item.permitZone}</span>
    </div>
  `;
}

function buildPermitSummary() {
  const rows = permitTransactions().filter((item) => item.dealDate === state.selectedPermitDate);
  if (!rows.length) return `${state.selectedPermitDate} 토지거래허가 거래는 없습니다.`;
  const complexes = rows.map((item) => `${item.district} ${item.complex} ${formatPrice(item.price)}`).join(", ");
  return `${state.selectedPermitDate} 토지거래허가 ${rows.length}건: ${complexes}`;
}

function handlePermitSummary(button) {
  const summary = buildPermitSummary();
  navigator.clipboard?.writeText(summary).catch(() => {});
  button.textContent = "요약 준비됨";
  setTimeout(() => {
    button.textContent = "요약 보기";
  }, 1600);
}

function findTransaction(id) {
  return transactions.find((item) => String(item.id) === String(id));
}

function detailContextLabel(context) {
  if (context === "record") return "NEW HIGH DETAIL";
  if (context === "recommendation") return "MATCH DETAIL";
  if (context === "permit") return "PERMIT DEAL DETAIL";
  if (context === "listing") return "APARTMENT SEARCH DETAIL";
  return "TRANSACTION DETAIL";
}

function openDetail(id, context = "transaction") {
  const item = findTransaction(id);
  if (!item) return;

  const detailDialog = document.getElementById("detailDialog");
  const matched = state.currentResults.find((result) => result.id === item.id);
  const gap = formatRecordGap(item);
  const recordLabel = isRecord(item) ? `신고가 ${gap}` : `고점 대비 ${gap}`;
  const reasons = matched?.reasons?.length ? matched.reasons.join(", ") : "최근 거래, 가격, 면적, 토허구역 여부 기준";

  document.getElementById("detailKicker").textContent = detailContextLabel(context);
  document.getElementById("detailTitle").textContent = item.complex;
  const aptDongLabel = item.aptDong ? ` ${item.aptDong}동` : "";
  document.getElementById("detailSummary").innerHTML = `
    <div>
      <strong>${formatPrice(item.price)}</strong>
      <span>${item.district} ${item.dong}${aptDongLabel} · ${item.dealDate} 계약 · 전용 ${item.area.toFixed(2)}㎡</span>
    </div>
    <div class="detail-badge">${recordLabel}</div>
  `;

  const fields = [
    ["거래일", item.dealDate],
    ["지역", `${item.district} ${item.dong}`],
    ["아파트 동", item.aptDong ? `${item.aptDong}동` : "정보 없음"],
    ["거래유형", item.dealingGbn || "정보 없음"],
    ["전용면적", `${item.area.toFixed(2)}㎡ · ${pyeong(item.area).toFixed(1)}평`],
    ["거래층", `${item.floor}층`],
    ["건축년도", `${item.builtYear}년`],
    ["주소", item.address || `서울 ${item.district} ${item.dong}`],
    ["평당가", `${moneyFormatter.format(pricePerPyeong(item))}만원`],
    ["이전 최고가", formatPrice(item.previousHigh)],
    ["최고가 대비", gap],
    ["최근 거래", `${item.recentCount}건`],
    ["토지거래허가", item.permitZone || "해당 없음"],
    ["AI 매칭 근거", reasons],
  ];

  document.getElementById("detailGrid").innerHTML = fields.map(([label, value]) => `
    <div class="detail-field">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");

  document.getElementById("detailNote").textContent =
    "국토교통부 실거래가 공개시스템 원천 데이터 기준입니다. 신고일 기준으로 최대 60일 이내 데이터가 반영됩니다.";

  detailDialog.showModal();
}

function closeDetail() {
  document.getElementById("detailDialog").close();
}

function wireEvents() {
  const budget = document.getElementById("budgetRange");
  const budgetLabel = document.getElementById("budgetLabel");

  if (budget && budgetLabel) {
    budget.addEventListener("input", () => {
      state.maxBudget = Number(budget.value);
      budgetLabel.textContent = `${state.maxBudget}억 이하`;
    });
  }

  document.getElementById("listingSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderListingSearch({ resetPage: true });
    document.getElementById("propertySearch")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("listingKeyword")?.addEventListener("input", () => {
    renderListingSearch({ resetPage: true });
  });

  ["listingDistrict", "listingMinPrice", "listingMaxPrice", "listingMinArea", "listingBuiltAfter", "listingSort"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", () => renderListingSearch({ resetPage: true }));
  });

  document.querySelector(".listing-theme-row")?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-listing-theme]");
    if (!btn) return;
    listingSearchState.theme = btn.dataset.listingTheme;
    document.querySelectorAll("[data-listing-theme]").forEach((el) => el.classList.remove("on"));
    btn.classList.add("on");
    renderListingSearch({ resetPage: true });
  });

  document.getElementById("listingMoreBtn")?.addEventListener("click", () => {
    listingSearchState.page++;
    renderListingSearch();
  });

  // 구 활성도 카드 클릭
  document.getElementById("distGrid")?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-activity-district]");
    if (card) openDistrictDetail(card.dataset.activityDistrict);
  });

  // 히어로 메트릭 클릭 → 상세 오버레이
  document.querySelector(".hero-stats")?.addEventListener("click", (event) => {
    const div = event.target.closest("[data-metric-nav]");
    if (!div) return;
    const type = div.dataset.metricNav;
    if (type === "deals") openTransactionsOverlay();
    else if (type === "records") openRecordsOverlay();
    else if (type === "permits") openPermitsOverlay();
  });

  // More View 버튼 (신고가 / 전체 실거래)
  document.body.addEventListener("click", (event) => {
    const moreBtn = event.target.closest("[data-more-type]");
    if (moreBtn) {
      if (moreBtn.dataset.moreType === "records") openRecordsOverlay();
      return;
    }
  });

  // 누적 내역 More View 버튼
  document.getElementById("historyMoreBtn")?.addEventListener("click", openTransactionsOverlay);

  // 전체 실거래 누적 내역 — 날짜별 아코디언 (한 번만 등록)
  document.getElementById("transactionHistory")?.addEventListener("click", (e) => {
    const header = e.target.closest(".hhdr");
    if (!header) return;
    const group = header.closest(".hgrp");
    group.classList.toggle("open");
  });

  // 새로 올라온 거래 — 탭 전환
  document.getElementById("closingsTabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-t]");
    if (!btn) return;
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    newClosingsState.tab = btn.dataset.t;
    newClosingsState.region = "전체";
    newClosingsState.showAll = false;
    renderNewClosings();
    renderMetrics();
  });

  // 새로 올라온 거래 — 지역 필터 pills
  document.getElementById("regionPills")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-reg-region]");
    if (!btn) return;
    newClosingsState.region = btn.dataset.regRegion;
    newClosingsState.showAll = false;
    document.querySelectorAll("#regionPills .rpill").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    renderNewClosings();
  });

  // 갈아타기 후보 — 필터/행 열기/기간 변경
  document.getElementById("candidateTabs")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-candidate-filter]");
    if (!btn) return;
    candidateState.filter = btn.dataset.candidateFilter;
    renderCandidateWatchlist();
  });

  document.getElementById("candidateList")?.addEventListener("click", (e) => {
    const row = e.target.closest("[data-candidate-id]");
    if (!row) return;
    candidateState.selectedId = candidateState.selectedId === row.dataset.candidateId ? null : row.dataset.candidateId;
    renderCandidateWatchlist();
  });

  document.getElementById("candidateMonths")?.addEventListener("change", (e) => {
    candidateState.months = Number(e.target.value) || 36;
    candidateState.selectedId = null;
    fetchCandidateWatchlist();
  });

  document.getElementById("candidateRefreshBtn")?.addEventListener("click", () => {
    candidateState.selectedId = null;
    fetchCandidateWatchlist();
  });

  // 새로 올라온 거래 — 더보기
  document.getElementById("regMoreBtn")?.addEventListener("click", () => {
    newClosingsState.showAll = true;
    renderNewClosings();
  });

  // 거래량 캘린더 — 날짜 클릭
  document.getElementById("txCalendarGrid")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cal-date]");
    if (!btn) return;
    calTxState.selectedDate = btn.dataset.calDate;
    renderTxCalendar();
    renderRegionDaily(calTxState.selectedDate);
  });

  // 거래량 캘린더 — 월 이동
  document.getElementById("calPrevBtn")?.addEventListener("click", () => {
    calTxState.month--;
    if (calTxState.month < 1) { calTxState.month = 12; calTxState.year--; }
    renderTxCalendar();
  });
  document.getElementById("calNextBtn")?.addEventListener("click", () => {
    calTxState.month++;
    if (calTxState.month > 12) { calTxState.month = 1; calTxState.year++; }
    renderTxCalendar();
  });

  // ESC로 오버레이 닫기
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDistrictDetail();
  });

  document.body.addEventListener("click", (event) => {
    const summaryButton = event.target.closest(".copy-button");
    if (summaryButton) {
      handlePermitSummary(summaryButton);
      return;
    }

    const permitDate = event.target.closest("[data-permit-date]");
    if (permitDate) {
      state.selectedPermitDate = permitDate.dataset.permitDate;
      state.selectedPermitId = null;
      renderPermits();
      return;
    }

    const permitDeal = event.target.closest("[data-permit-id]");
    if (permitDeal) {
      state.selectedPermitId = permitDeal.dataset.permitId;
      renderPermits();
      return;
    }

    const trigger = event.target.closest(".detail-trigger");
    if (!trigger) return;
    openDetail(trigger.dataset.detailId, trigger.dataset.detailContext);
  });

  document.getElementById("detailClose")?.addEventListener("click", closeDetail);
  document.getElementById("detailDialog")?.addEventListener("click", (event) => {
    if (event.target.id === "detailDialog") closeDetail();
  });
}

function applyTransactions(data) {
  transactions.length = 0;
  transactions.push(...data);
  districts.length = 0;
  districts.push("전체", ...new Set(data.map((item) => item.district)));

  // 최신 날짜를 기본 선택일로
  const latest = latestDealDate();
  state.selectedPermitDate = latest;
  state.selectedPermitId = null;

  renderMetrics();
  renderDistricts();
  renderListingDistrictOptions();
  renderListingSearch({ resetPage: true });
  renderNewClosings();
  renderRecords();
  renderTransactionHistory();
  renderPermitPreview();
  renderDistrictActivity();
  renderAskingSignals();
  renderCandidateWatchlist();
}

const LS_KEY = "seoul_estate_v1";
const LS_TTL = 60 * 60 * 1000; // 1시간

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > LS_TTL) return null;
    return data;
  } catch { return null; }
}

function saveToStorage(data) {
  try { localStorage.setItem(LS_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

async function fetchAndUpdateCache(statusEl) {
  try {
    const res = await fetch("/api/transactions");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (json.fallback) {
      if (state.dataSource !== "molit") {
        if (statusEl) statusEl.textContent = "샘플 데이터";
        addMessage("국토교통부 API 키가 설정되지 않아 샘플 데이터로 동작합니다. .env 파일에 MOLIT_API_KEY를 추가하세요.", "assistant");
      }
      return;
    }

    if (json.data?.length) {
      saveToStorage(json.data);
      applyTransactions(json.data);
      state.dataSource = "molit";
      const fetched = new Date(json.fetchedAt).toLocaleTimeString("ko-KR");
      if (statusEl) statusEl.textContent = `실데이터 ${json.data.length.toLocaleString()}건`;
      addMessage(`국토교통부 실거래 데이터 ${json.data.length.toLocaleString()}건이 로드됐습니다 (${fetched} 기준). 원하는 지역, 예산, 면적, 준공연도를 말해 주세요.`, "assistant");
    }
  } catch (err) {
    if (state.dataSource !== "molit") {
      if (statusEl) statusEl.textContent = "샘플 데이터";
      console.info("[Seoul Estate AI] 로컬 서버 없음 — 샘플 데이터로 동작:", err.message);
    }
  }
}

async function loadRealData() {
  const statusEl = document.getElementById("assistantStatus");

  const cached = loadFromStorage();
  if (cached?.length) {
    applyTransactions(cached);
    state.dataSource = "molit";
    if (statusEl) statusEl.textContent = `캐시 ${cached.length.toLocaleString()}건`;
    addMessage(`캐시된 실거래 데이터 ${cached.length.toLocaleString()}건을 즉시 로드했습니다. 백그라운드에서 최신 데이터를 확인 중입니다.`, "assistant");
    fetchAndUpdateCache(statusEl); // 백그라운드 갱신, await 없음
    return;
  }

  if (statusEl) statusEl.textContent = "데이터 로딩 중…";
  await fetchAndUpdateCache(statusEl);
}

async function init() {
  state.selectedPermitDate = latestDealDate();

  // 히어로 날짜 표시
  const heroDate = document.getElementById("heroDate");
  if (heroDate) heroDate.textContent = new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) + " 기준";

  renderMetrics();
  renderDistricts();
  renderListingDistrictOptions();
  renderListingSearch({ resetPage: true });
  renderNewClosings();
  renderRecords();
  renderTransactionHistory();
  renderPermitPreview();
  renderDistrictActivity();
  renderAskingSignals();

  try { wireEvents(); } catch (e) { console.warn("[wireEvents]", e); }
  initGuDropdown();

  // 히어로 제출 버튼 — 예산 검색
  document.getElementById("heroSubmit")?.addEventListener("click", () => {
    const capEok  = Number(document.getElementById("hCapEok")?.value  || 0);
    const capMan  = Number(document.getElementById("hCapMan")?.value  || 0);
    const loanEok = Number(document.getElementById("hLoanEok")?.value || 0);
    const loanMan = Number(document.getElementById("hLoanMan")?.value || 0);
    const region  = document.getElementById("hRegion")?.value?.trim() || "";

    const totalMan = capEok * 10000 + capMan + loanEok * 10000 + loanMan;

    if (totalMan > 0) {
      renderBudgetResults(totalMan, region);
      document.getElementById("budgetResults")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // 예산 미입력 시 지역 필터만
      if (region) {
        state.selectedDistrict = region;
        renderDistricts();
      }
      document.getElementById("closings")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  // 토허 프리뷰 카드 클릭
  document.getElementById("permits")?.addEventListener("click", openPermitsOverlay);
  document.getElementById("permitPreviewBtn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openPermitsOverlay();
  });

  await loadRealData();
  fetchCandidateWatchlist();
}

init();
