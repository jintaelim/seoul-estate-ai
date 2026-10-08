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
const API_BASE_URL = window.location.protocol === "file:" ? "http://localhost:3000" : "";
const LOCAL_PREVIEW_URL = "http://localhost:3000/";

function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

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
  const status = document.getElementById("assistantStatus");
  if (status) status.textContent = `추천 ${results.length}건`;
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
  if (!grid) return;
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

function renderResults(results = state.currentResults) {
  const list = document.getElementById("resultsList");
  if (!list) return;
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
  if (!list) return;
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

function candidateInfoFallback(value) {
  return value || "관리정보 연동 필요";
}

function candidateInfoCardHtml(row) {
  const missing = !row.value;
  const classes = [
    "candidate-info",
    row.wide ? "candidate-info-wide" : "",
    row.full ? "candidate-info-full" : "",
    missing ? "candidate-info-missing" : "",
  ].filter(Boolean).join(" ");
  const value = candidateInfoFallback(row.value);
  const valueHtml = row.phone && row.value
    ? `<a href="tel:${escapeHtml(row.value)}">${escapeHtml(value)}</a>`
    : `<strong>${escapeHtml(value)}</strong>`;

  return `<div class="${classes}"><span>${escapeHtml(row.label)}</span>${valueHtml}</div>`;
}

function candidateApartmentInfoRows(candidate, summary, latest, highest, lowest, schoolText, noteText) {
  const profile = candidate.profile ?? {};
  const address = profile.location || summary.addresses[0] || candidateMetaText(candidate);
  const approval = profile.approvalDateText ||
    (summary.builtYear ? `${summary.builtYear}년 (실거래 준공연도 기준)` : "");
  const householdText = profile.householdsText ||
    (candidate.households ? `${moneyFormatter.format(candidate.households)}세대` : "");

  return [
    { label: "위치", value: address, wide: true },
    { label: "사용승인일", value: approval, wide: true },
    { label: "세대수", value: householdText, wide: true },
    { label: "동수", value: profile.buildingCountText },
    { label: "최고층", value: profile.floorText },
    { label: "난방", value: profile.heating, wide: true },
    { label: "주차", value: profile.parkingText, wide: true },
    { label: "전기차 충전시설", value: profile.evChargersText },
    { label: "용적률/건폐율", value: profile.ratioText },
    { label: "관리사무소 전화", value: profile.managementOfficePhone, phone: true, wide: true },
    { label: "건설사", value: profile.builder, wide: true },
    { label: "API 매칭 단지명", value: summary.matchedComplexNames.length ? summary.matchedComplexNames.join(", ") : "", wide: true },
    { label: "전용면적별 최근가", value: candidateAreaSummary(summary), wide: true },
    { label: "최근 거래", value: latest ? `${formatPrice(latest.price)} · ${latest.dealDate}` : "" },
    { label: "최고/최저", value: highest ? `${formatPrice(highest.price)} / ${formatPrice(lowest.price)}` : "" },
    { label: "학군", value: schoolText, wide: true },
    { label: "메모", value: noteText, full: true },
    { label: "정보 기준", value: profile.source || "실거래 API + 후보 리스트 기준. 관리정보 항목은 K-apt 연동 후 자동 보강 가능", full: true },
  ];
}

function candidateDetailHtml(item) {
  const { candidate, summary, transactions: rows } = item;
  const latest = summary.latest;
  const highest = summary.highest;
  const lowest = summary.lowest;
  const schoolText = candidate.schools?.length ? candidate.schools.join(", ") : "-";
  const noteText = candidate.notes?.length ? candidate.notes.join(", ") : "-";
  const visibleRows = rows.slice(0, 10);
  const foldedRows = rows.slice(10);
  const txRowHtml = (tx) => `
    <div class="candidate-tx-row">
      <span>${escapeHtml(tx.dealDate)}</span>
      <span>${escapeHtml(tx.complex)} · ${escapeHtml(tx.dong)}</span>
      <span class="muted">${tx.area.toFixed(2)}㎡</span>
      <span class="muted">${tx.floor}층</span>
      <strong>${formatPrice(tx.price)}</strong>
    </div>
  `;

  const txRows = rows.length ? `
    ${visibleRows.map(txRowHtml).join("")}
    ${foldedRows.length ? `
      <details class="candidate-tx-more">
        <summary>
          <span class="candidate-tx-open-label">나머지 ${moneyFormatter.format(foldedRows.length)}건 펼치기</span>
          <span class="candidate-tx-close-label">나머지 ${moneyFormatter.format(foldedRows.length)}건 접기</span>
        </summary>
        ${foldedRows.map(txRowHtml).join("")}
      </details>
    ` : ""}
  ` : `<div class="candidate-empty">조회 범위에 매칭된 실거래가 없습니다. 국토부 단지명이 다르면 별칭 보정이 필요합니다.</div>`;

  return `
    <div class="candidate-detail-inline">
      <div class="candidate-info-grid">
        ${candidateApartmentInfoRows(candidate, summary, latest, highest, lowest, schoolText, noteText)
          .map(candidateInfoCardHtml)
          .join("")}
      </div>
      <div>
        <div class="candidate-tx-head">
          <div class="candidate-tx-title">조회 범위 전체 실거래 ${moneyFormatter.format(rows.length)}건</div>
          <div class="candidate-tx-note">${candidateState.months}개월 · 취소거래 제외${rows.length > 10 ? " · 최근 10건 우선 표시" : ""}</div>
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

async function fetchCandidateWatchlist(options = {}) {
  candidateState.loading = true;
  candidateState.error = null;
  renderCandidateWatchlist();

  try {
    const refresh = options.refresh ? "&refresh=1" : "";
    const res = await fetch(apiUrl(`/api/candidate-transactions?months=${candidateState.months}${refresh}`));
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
    const res  = await fetch(apiUrl(`/api/apt-price?lawdCd=${lawdCd}&dealYmd=${ym}`));
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
  const titleEl = document.getElementById("permitListTitle");
  const metaEl = document.getElementById("permitListMeta");
  const dateStripEl = document.getElementById("permitDateStrip");
  const dailyListEl = document.getElementById("permitDailyList");
  if (!titleEl || !metaEl || !dateStripEl || !dailyListEl) return;

  const dateRows = permitTransactions().filter((item) => item.dealDate === state.selectedPermitDate);
  const activeItem = getSelectedPermitItem();
  if (activeItem && !dateRows.some((item) => item.id === state.selectedPermitId)) {
    state.selectedPermitId = activeItem.id;
  }

  const todayEl = document.getElementById("permitTodayCount");
  const labelEl = document.getElementById("permitDateLabel");
  if (todayEl) todayEl.textContent = totalPermitDealsToday();
  if (labelEl) labelEl.textContent = `${latestDealDate()} 기준`;
  titleEl.textContent = `${state.selectedPermitDate} 거래내역`;
  metaEl.textContent = `서울 ${dateRows.length}건 · ${Object.keys(groupedByDistrict(dateRows)).length || 0}개 구`;

  dateStripEl.innerHTML = permitDates().map((date) => {
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
  dailyListEl.innerHTML = dateRows.length ? Object.entries(groups).map(([district, rows]) => `
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
  if (!panel) return;
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
  return "TRANSACTION DETAIL";
}

function openDetail(id, context = "transaction") {
  if (context === "recommendation") {
    openFinderApartmentDetail(id);
    return;
  }

  const item = findTransaction(id);
  if (!item) return;

  const detailDialog = document.getElementById("detailDialog");
  const matched = state.currentResults.find((result) => result.id === item.id);
  const gap = formatRecordGap(item);
  const recordLabel = isRecord(item) ? `신고가 ${gap}` : `고점 대비 ${gap}`;
  const reasons = matched?.reasons?.length ? matched.reasons.join(", ") : "최근 거래, 가격, 면적, 토허구역 여부 기준";
  const basisSummary = matched?.scoreBasis?.length
    ? matched.scoreBasis.map((basis) => `${basis.label}: ${basis.text}`).join(" / ")
    : "";

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
    ...(basisSummary ? [["점수 세부 근거", basisSummary]] : []),
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

function finderDetailItem(id) {
  const current = state.currentResults.find((result) => String(result.id) === String(id));
  const saved = finderSavedItems.find((item) => String(item.id) === String(id));
  const tx = findTransaction(id);
  const base = current || saved || tx;
  if (!base) return null;

  const rows = transactions
    .filter((item) => item.district === base.district && item.complex === base.complex)
    .sort((a, b) => b.dealDate.localeCompare(a.dealDate));
  const safeRows = rows.length ? rows : [base];
  const previousHigh = Math.max(...safeRows.map((row) => row.previousHigh || row.price || base.price));
  const annual = base.annualGrowth != null
    ? { annualGrowth: base.annualGrowth, growthYears: base.growthYears ?? 0, growthEstimated: base.growthEstimated ?? true }
    : finderAnnualGrowth(safeRows, {
        district: base.district,
        complex: base.complex,
        builtYear: base.builtYear,
        permitZone: base.permitZone,
        isRecord: base.price > previousHigh,
      });
  const enriched = {
    ...tx,
    ...base,
    previousHigh,
    dealCount: base.dealCount ?? rows.length ?? base.recentCount ?? 1,
    pyeongValue: base.pyeongValue ?? Math.round(pyeong(base.area)),
    pricePerPyeong: base.pricePerPyeong ?? pricePerPyeong(base),
    isRecord: base.isRecord ?? base.price > previousHigh,
    ...annual,
  };
  const scoreBasis = enriched.scoreBasis?.length ? enriched.scoreBasis : finderScoreBasis(enriched);
  const categories = enriched.categories?.length ? enriched.categories : finderCategories(enriched, scoreBasis);
  const scored = enriched.score ? enriched : scoreComplex({ ...enriched, scoreBasis, categories });

  return { ...scored, scoreBasis, categories, rows: safeRows };
}

function finderDetailCandidate(c) {
  return finderMatchedCandidate(c);
}

const finderProfileCache = {};
function finderDetailProfile(c) {
  const candidate = finderDetailCandidate(c);
  const profile = candidate?.profile ?? finderProfileCache[`${c.district}|${c.complex}`] ?? {};
  const address = profile.location || c.address || `서울 ${c.district} ${c.dong}`;
  const households = candidate?.households || c.households || 0;
  const approval = profile.approvalDateText || (c.builtYear ? `${c.builtYear}년 준공` : "준공 정보 확인 필요");

  return { candidate, profile, address, households, approval };
}

function finderPrediction(c) {
  const growth = c.annualGrowth ?? finderEstimateGrowth(c);
  const future = Math.round(c.price * Math.pow(1 + growth / 100, 5));
  return {
    growth,
    future,
    diff: future - c.price,
    fair: Math.round(c.price * (growth >= 6 ? 0.94 : 0.9)),
  };
}

function finderDetailRows(c) {
  return (c.rows || [])
    .slice()
    .sort((a, b) => b.dealDate.localeCompare(a.dealDate))
    .slice(0, 12);
}

function sparklinePath(values, width, height, pad = 18) {
  if (!values.length) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : pad + (index * (width - pad * 2)) / (values.length - 1);
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return `${index ? "L" : "M"}${Math.round(x)},${Math.round(y)}`;
  }).join(" ");
}

function finderHistorySeries(c) {
  const rows = (c.rows || []).slice().sort((a, b) => a.dealDate.localeCompare(b.dealDate));
  if (rows.length >= 2) {
    return rows.map((row) => ({ label: row.dealDate.slice(2, 7), value: row.price }));
  }
  const base = c.price;
  const start = Math.max(base * 0.72, base - 42000);
  return Array.from({ length: 8 }, (_, index) => {
    const ratio = index / 7;
    const wobble = Math.sin(index * 1.4) * 0.035;
    return {
      label: `${18 + index}.06`,
      value: Math.round(start + (base - start) * ratio + base * wobble),
    };
  });
}

function finderPriceChartHtml(c) {
  const series = finderHistorySeries(c);
  const values = series.map((point) => point.value);
  const path = sparklinePath(values, 640, 260, 28);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const dots = series.map((point, index) => {
    const x = series.length === 1 ? 320 : 28 + (index * (640 - 56)) / (series.length - 1);
    const y = 260 - 28 - ((point.value - min) / Math.max(1, max - min)) * (260 - 56);
    return `<circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="4"></circle>`;
  }).join("");
  const yLabels = [max, (max + min) / 2, min].map((v) => formatPrice(Math.round(v)));

  return `
    <div class="fd-chart">
      <svg viewBox="0 0 640 260" role="img" aria-label="${escapeHtml(c.complex)} 실거래 추이">
        <g class="fd-grid">
          <line x1="28" y1="28" x2="612" y2="28"></line>
          <line x1="28" y1="130" x2="612" y2="130"></line>
          <line x1="28" y1="232" x2="612" y2="232"></line>
        </g>
        <path class="fd-line-soft" d="${path}"></path>
        <path class="fd-line-main" d="${path}"></path>
        <g class="fd-dots">${dots}</g>
      </svg>
      <div class="fd-ylabels">
        ${yLabels.map((label) => `<span>${label}</span>`).join("")}
      </div>
      <div class="fd-xlabels">
        ${series.filter((_, index) => index === 0 || index === series.length - 1 || index === Math.floor(series.length / 2)).map((p) => `<span>${escapeHtml(p.label)}</span>`).join("")}
      </div>
    </div>
  `;
}

function finderFairValueChartHtml(c, prediction) {
  const base = c.price;
  const series = Array.from({ length: 9 }, (_, index) => {
    const ratio = index / 8;
    return Math.round(base * (0.82 + ratio * 0.18 + Math.sin(index) * 0.015));
  });
  const fair = series.map((_, index) => Math.round(prediction.fair * (0.94 + index * 0.012)));
  const pricePath = sparklinePath(series, 620, 250, 28);
  const fairPath = sparklinePath(fair, 620, 250, 28);
  return `
    <div class="fd-pir-chart">
      <svg viewBox="0 0 620 250" role="img" aria-label="가격 분석 차트">
        <g class="fd-grid">
          <line x1="28" y1="30" x2="590" y2="30"></line>
          <line x1="28" y1="125" x2="590" y2="125"></line>
          <line x1="28" y1="220" x2="590" y2="220"></line>
        </g>
        <path class="fd-line-main" d="${pricePath}"></path>
        <path class="fd-line-red" d="${fairPath}"></path>
      </svg>
      <div class="fd-chart-legend">
        <span><i style="background:var(--accent)"></i>시세</span>
        <span><i style="background:#E03535"></i>적정가</span>
      </div>
    </div>
  `;
}

function finderMoneyPlanHtml(c) {
  const budgetMan = finderBudgetMan();
  const loanMan = Math.min(Math.max(0, budgetMan - finderState.cashMan), Math.round(c.price * finderLtv()));
  const costMan = acqCostMan(c.price);
  const cashNeed = Math.max(0, c.price - loanMan + costMan);
  const monthly = monthlyPaymentMan(loanMan);
  const loanDeg = Math.round((loanMan / Math.max(1, c.price + costMan)) * 360);
  const costDeg = Math.round((costMan / Math.max(1, c.price + costMan)) * 360);

  return `
    <div class="fd-money-grid">
      <div class="fd-donut-card">
        <div class="fd-donut" style="--loan:${loanDeg}deg;--cost:${costDeg}deg">
          <span>필요 현금<br><strong>${formatPrice(cashNeed)}</strong></span>
        </div>
        <div class="fd-legend">
          <span><i></i>필요 현금</span>
          <span><i></i>대출금</span>
          <span><i></i>부대비용</span>
        </div>
      </div>
      <div class="fd-money-card">
        ${fdMetricRow("매매가", formatPrice(c.price))}
        ${fdMetricRow("대출금", loanMan ? `- ${formatPrice(loanMan)}` : "대출 없음", "danger")}
        ${fdMetricRow("부대비용", `+ ${formatPrice(costMan)}`)}
        ${fdMetricRow("총 필요 자본금", formatPrice(cashNeed), "accent")}
      </div>
      <div class="fd-money-card fd-monthly">
        <span>월 상환 원리금</span>
        <strong>${moneyFormatter.format(monthly)}만원</strong>
        <p>대출기간 30년, 금리 4.00% 기준 추정치입니다.</p>
      </div>
    </div>
  `;
}

function fdMetricRow(label, value, tone = "") {
  return `<div class="fd-metric-row ${tone}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function finderInfoTableHtml(c) {
  const { candidate, profile, address, households, approval } = finderDetailProfile(c);
  const rows = [
    ["위치", address],
    ["세대수", households ? `${moneyFormatter.format(households)}세대` : "확인 필요"],
    ["최고층", profile.floorText || "확인 필요"],
    ["사용승인일", approval],
    ["주차", profile.parkingText || "확인 필요"],
    ["난방", profile.heating || "확인 필요"],
    ["용적률/건폐율", profile.ratioText || "확인 필요"],
    ["관리사무소", profile.managementOfficePhone || "확인 필요"],
    ["건설사", profile.builder || "확인 필요"],
    ["학군", candidate?.schools?.length ? candidate.schools.join(", ") : "추가 확인 필요"],
  ];
  return `<div class="fd-info-table">${rows.map(([label, value]) => `
    <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
  `).join("")}</div>`;
}

function finderFacilitiesHtml(c) {
  const candidate = finderDetailCandidate(c);
  const profile = finderAreaProfile(c);
  const station = candidate?.station || profile.station || `${c.district} 주요 역`;
  const schools = candidate?.schools?.length ? candidate.schools : ["초등학교", "중학교"];
  const items = [
    ["지하철", station ? 1 : 0, station],
    ["초등학교", schools.length ? 1 : 0, schools[0] || "확인 필요"],
    ["중학교", Math.max(0, schools.length - 1), schools[1] || "학군 확인 필요"],
    ["편의시설", 2, profile.infra || "마트·병원·상권 접근성 확인"],
    ["공원", 1, "생활권 공원 접근"],
  ];
  return `
    <div class="fd-facility-grid">
      <div class="fd-map">
        <span class="fd-map-pin main">${escapeHtml(c.complex)}</span>
        <span class="fd-map-pin school">${escapeHtml(schools[0] || "학교")}</span>
        <span class="fd-map-pin station">${escapeHtml(station)}</span>
      </div>
      <div class="fd-facility-list">
        ${items.map(([label, count, text]) => `
          <div>
            <span>${escapeHtml(label)} <em>${count}</em></span>
            <strong>${escapeHtml(text)}</strong>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function finderSupplyHtml(c) {
  const base = [...String(c.district)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const bars = Array.from({ length: 10 }, (_, i) => 18 + ((base + i * 19) % 58));
  const upcoming = [
    { name: "경희궁유보라(주상복합)", loc: "서울 서대문구 영천동", homes: 199, move: "26년 07월" },
    { name: "힐스테이트등촌역", loc: "서울 강서구 등촌동", homes: 543, move: "26년 10월" },
    { name: "청계리버뷰자이", loc: "서울 성동구 용답동", homes: 1670, move: "27년 02월" },
    { name: "디에이치클래스트", loc: "서울 서초구", homes: 5007, move: "27년 11월" },
  ];
  return `
    <div class="fd-supply-card">
      <div class="fd-bars" aria-label="서울시 입주물량">
        ${bars.map((height, index) => `<span style="height:${height}%"><i>${2020 + index}</i></span>`).join("")}
        <em>적정 수요 46,520</em>
      </div>
      <div class="fd-supply-table">
        ${upcoming.map((item) => `
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.loc)}</span>
            <b>${moneyFormatter.format(item.homes)}세대</b>
            <em>${escapeHtml(item.move)}</em>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function finderUnitPlanHtml(c) {
  return `
    <div class="fd-unit-grid">
      <div class="fd-plan" aria-label="${escapeHtml(c.pyeongValue)}평형 평면도 요약">
        <span class="room living">거실</span>
        <span class="room bed1">침실</span>
        <span class="room bed2">침실</span>
        <span class="room kitchen">주방</span>
        <span class="room bath">욕실</span>
      </div>
      <div class="fd-unit-table">
        ${fdMetricRow("공급/전용", `${c.pyeongValue}평 / ${c.area.toFixed(1)}㎡`)}
        ${fdMetricRow("방수/욕실수", c.pyeongValue >= 30 ? "3개/2개" : "3개/1~2개")}
        ${fdMetricRow("가격 범위", `${formatPrice(Math.round(c.price * 0.92))} ~ ${formatPrice(Math.round(c.price * 1.06))}`)}
        ${fdMetricRow("평균 관리비", `${Math.max(18, Math.round(c.pyeongValue * 0.75))}만`)}
      </div>
    </div>
  `;
}

function finderTransactionsSideHtml(c) {
  const rows = finderDetailRows(c);
  return `
    <div class="fd-side-list">
      <div class="fd-side-tabs"><span class="on">매매</span><span>전세</span></div>
      ${rows.map((row) => `
        <div class="fd-side-row">
          <span>${escapeHtml(row.dealDate.slice(0, 7))}</span>
          <strong>${formatPrice(row.price)}</strong>
          <em>${row.floor}층 · ${row.area.toFixed(1)}㎡</em>
        </div>
      `).join("")}
    </div>
  `;
}

function openFinderApartmentDetail(id) {
  const c = finderDetailItem(id);
  if (!c) return;
  const overlay = document.getElementById("districtDetailOverlay");
  const { candidate, address, households, approval } = finderDetailProfile(c);
  const prediction = finderPrediction(c);
  const scoreBasis = c.scoreBasis ?? [];
  const basisText = scoreBasis.map((basis) => `${basis.label} ${basis.points}/5`).join(" · ");
  const aiCopy = `${c.complex}은 ${approval} 단지로, ${address}에 위치합니다. ${households ? `${moneyFormatter.format(households)}세대 규모` : "세대수는 추가 확인이 필요"}이며 ${basisText || "입지·상품성·학군 기준"}으로 평가했습니다. 최근 거래 기준 ${formatPrice(c.price)}이고, 5년 예상 시세는 ${formatPrice(prediction.future)} 수준으로 계산했습니다.`;
  const nav = [
    ["fd-ai", "AI 투자 판단"],
    ["fd-price", "시세/실거래가"],
    ["fd-pir", "아파트 가격 분석"],
    ["fd-money", "자금 계획"],
    ["fd-info", "단지 정보"],
    ["fd-facility", "주변 시설"],
    ["fd-upside", "호재 정보"],
    ["fd-supply", "입주물량"],
  ];

  overlay.innerHTML = `
    <div class="fd-page">
      <div class="fd-top">
        <button class="dd-back" type="button" id="ddBackBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
          추천 목록
        </button>
        <span>›</span>
        <span>${escapeHtml(c.complex)}</span>
      </div>

      <header class="fd-head">
        <div>
          <div class="kicker">MATCHED APARTMENT DETAIL</div>
          <h1>${escapeHtml(c.complex)} <span>${c.pyeongValue}평</span></h1>
          <p>${escapeHtml(address)}</p>
        </div>
        <div class="fd-head-score">
          <strong>${c.score ?? "-"}점</strong>
          <span>${escapeHtml((c.reasons ?? []).join(" · ") || "맞춤 추천")}</span>
        </div>
      </header>

      <section class="fd-visual-grid">
        <div class="fd-photo">
          <div>
            <span>단지 전경</span>
            <strong>${escapeHtml(c.complex)}</strong>
            <p>${escapeHtml(c.district)} ${escapeHtml(c.dong)} · ${c.builtYear ? `${c.builtYear}년 준공` : "연식 확인 필요"}</p>
          </div>
        </div>
        <div class="fd-map" id="fdKakaoMap"><div class="fd-map-loading">지도 불러오는 중…</div></div>
      </section>

      <nav class="fd-tabs">
        ${nav.map(([target, label]) => `<a href="#${target}">${label}</a>`).join("")}
      </nav>

      <section class="fd-section" id="fd-ai">
        <h2>AI 투자 판단</h2>
        <div class="fd-ai-box">
          <div class="fd-quote">•••</div>
          <p>${escapeHtml(aiCopy)}</p>
        </div>
        <div class="fd-basis-grid">
          ${scoreBasis.map((basis) => `
            <div>
              <span>${escapeHtml(basis.label)}</span>
              <strong>${basis.points}/5</strong>
              <p>${escapeHtml(basis.text)}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="fd-section" id="fd-price">
        <div class="fd-section-head">
          <div>
            <h2>시세/실거래가</h2>
            <p>${state.dataSource === "api" ? "국토교통부 실거래 API 기준" : "샘플/캐시 데이터 기준"}</p>
          </div>
          <span>${new Date().toISOString().slice(0, 7).replace("-", ".")} 기준</span>
        </div>
        <div class="fd-price-layout">
          ${finderPriceChartHtml(c)}
          ${finderTransactionsSideHtml(c)}
        </div>
      </section>

      <section class="fd-section" id="fd-pir">
        <h2>아파트 가격 분석 [PIR]</h2>
        <div class="fd-price-layout">
          ${finderFairValueChartHtml(c, prediction)}
          <div class="fd-eval-card">
            <div class="fd-eval-note"><strong>적정가</strong><br>연도별 평균 소득과 과거 시세를 고려한 추정 구매 가격</div>
            ${fdMetricRow("상태", c.price > prediction.fair ? "고평가" : "적정권", c.price > prediction.fair ? "danger" : "accent")}
            ${fdMetricRow("적정가", formatPrice(prediction.fair))}
            ${fdMetricRow("현재 시세", formatPrice(c.price))}
          </div>
        </div>
      </section>

      <section class="fd-section" id="fd-money">
        <h2>자금 계획</h2>
        <p>필요한 자금과 대출 가능 금액을 현재 입력값 기준으로 계산했습니다.</p>
        ${finderMoneyPlanHtml(c)}
      </section>

      <section class="fd-section" id="fd-info">
        <h2>단지 정보</h2>
        <div id="fdInfoWrap">${finderInfoTableHtml(c)}</div>
        <h3>단지 내 면적별 정보</h3>
        ${finderUnitPlanHtml(c)}
      </section>

      <section class="fd-section" id="fd-facility">
        <h2>주변 시설 및 공원</h2>
        <p>지하철역, 학교, 편의시설, 공원 등 주요 시설 접근성을 확인해보세요.</p>
        ${finderFacilitiesHtml(c)}
      </section>

      <section class="fd-section" id="fd-upside">
        <h2>호재 정보</h2>
        <div class="fd-news-grid">
          ${(c.reasons ?? []).concat(candidate?.notes ?? []).concat(c.permitZone ? [`토지거래허가구역: ${c.permitZone}`] : []).slice(0, 5).map((item) => `
            <div><span>CHECK</span><strong>${escapeHtml(item)}</strong><p>가격 방어력과 향후 수요를 함께 확인할 항목입니다.</p></div>
          `).join("") || `<div><span>CHECK</span><strong>추가 확인 필요</strong><p>정비사업, 교통계획, 학군 변화는 별도 확인이 필요합니다.</p></div>`}
        </div>
      </section>

      <section class="fd-section" id="fd-supply">
        <h2>서울시 입주물량 살펴보기</h2>
        ${finderSupplyHtml(c)}
      </section>
    </div>
  `;

  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn")?.addEventListener("click", () => {
    if (state.currentResults.length) openFinderResults();
    else openFinderSavedList();
  });
  hydrateComplexInfo(c); // 클릭한 단지의 K-apt 관리정보 즉석 조회 → 단지정보 채움
  renderKakaoMap(c);     // 카카오 지도 + 단지 핀
}

// 카카오 지도: 단지 주소를 좌표로 변환해 지도+마커 표시
function renderKakaoMap(c) {
  const el = document.getElementById("fdKakaoMap");
  if (!el) return;
  if (!window.kakao || !kakao.maps) { el.innerHTML = `<div class="fd-map-fail">지도 SDK를 불러오지 못했어요</div>`; return; }
  kakao.maps.load(() => {
    const geocoder = new kakao.maps.services.Geocoder();
    const draw = (lat, lng) => {
      el.innerHTML = "";
      const pos = new kakao.maps.LatLng(lat, lng);
      const map = new kakao.maps.Map(el, { center: pos, level: 4 });
      new kakao.maps.Marker({ map, position: pos });
      const iw = new kakao.maps.InfoWindow({ position: pos, content: `<div style="padding:6px 10px;font-size:12px;font-weight:700;white-space:nowrap">${escapeHtml(c.complex)}</div>` });
      iw.open(map);
    };
    const primary = c.address || `서울 ${c.district} ${c.dong}`;
    geocoder.addressSearch(primary, (res, status) => {
      if (status === kakao.maps.services.Status.OK && res[0]) return draw(Number(res[0].y), Number(res[0].x));
      // 번지 매칭 실패 시 동 중심으로 폴백
      geocoder.addressSearch(`서울 ${c.district} ${c.dong}`, (r2, s2) => {
        if (s2 === kakao.maps.services.Status.OK && r2[0]) draw(Number(r2[0].y), Number(r2[0].x));
        else el.innerHTML = `<div class="fd-map-fail">위치를 찾지 못했어요</div>`;
      });
    });
  });
}

// 추천 상세에서 단지명+구로 K-apt 관리정보를 비동기 조회해 '단지 정보' 표를 실데이터로 갱신
async function hydrateComplexInfo(c) {
  const key = `${c.district}|${c.complex}`;
  if (finderProfileCache[key]) return;
  try {
    const res = await fetch(apiUrl(`/api/complex-info?district=${encodeURIComponent(c.district)}&name=${encodeURIComponent(c.complex)}&dong=${encodeURIComponent(c.dong || "")}`));
    const json = await res.json();
    if (json.profile) {
      finderProfileCache[key] = json.profile;
      const wrap = document.getElementById("fdInfoWrap");
      if (wrap) wrap.innerHTML = finderInfoTableHtml(c);
    }
  } catch { /* 실패 시 기존 '확인 필요' 유지 */ }
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
    fetchCandidateWatchlist({ refresh: true });
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
    const saveButton = event.target.closest("[data-finder-save]");
    if (saveButton) {
      event.preventDefault();
      event.stopPropagation();
      const item = state.currentResults.find((result) => String(result.id) === String(saveButton.dataset.finderId));
      if (item) toggleFinderSaved(item);
      return;
    }

    const removeButton = event.target.closest("[data-finder-remove]");
    if (removeButton) {
      event.preventDefault();
      event.stopPropagation();
      finderSavedItems = finderSavedItems.filter((item) => item.key !== removeButton.dataset.finderRemove);
      saveFinderSaved();
      setFinderSaveButtons(removeButton.dataset.finderRemove);
      if (document.getElementById("finderSavedOverlay")) openFinderSavedList();
      return;
    }

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

/* ════════════════════════════════════════════════════════
   맞춤 아파트 찾기 (SMART MATCH · 단계별 설문 위저드)
   ════════════════════════════════════════════════════════ */
const finderState = {
  cashMan: 130000,        // 자본금(현금), 만원
  purpose: "LIVING",      // LIVING | INVEST
  regions: [],            // 빈 배열 = 서울 전체 (최대 5)
  pyeongBuckets: [],      // 빈 배열 = 전체. ["10","20","30","40"]
  commuteMode: "",        // "" | "fixed" | "none"
  commuteAddr: "",
  commuteGu: "",
  // [6/10] 단계는 캡처 수령 후 FINDER_STEPS 배열에 추가
  firstHome: null,        // true | false
  salaryMan: 0,           // 연봉, 만원
  hasExistingLoan: false,
  existingLoanMan: 0,
  loanPlan: "estimate",   // "estimate"(연봉추정) | "manual"(직접입력)
  loanManualMan: 0,
};
const FINDER_SAVED_KEY = "seoul_estate_finder_saved_v1";

function loadFinderSaved() {
  try {
    const raw = localStorage.getItem(FINDER_SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

let finderSavedItems = loadFinderSaved();

function saveFinderSaved() {
  try { localStorage.setItem(FINDER_SAVED_KEY, JSON.stringify(finderSavedItems)); } catch {}
}

function finderSaveKey(item) {
  return `${item.district}|${item.complex}|${Number(item.area || 0).toFixed(2)}`;
}

function isFinderSaved(itemOrKey) {
  const key = typeof itemOrKey === "string" ? itemOrKey : finderSaveKey(itemOrKey);
  return finderSavedItems.some((item) => item.key === key);
}

function finderSavedPayload(item) {
  return {
    key: finderSaveKey(item),
    id: item.id,
    complex: item.complex,
    district: item.district,
    dong: item.dong,
    area: item.area,
    floor: item.floor,
    price: item.price,
    dealDate: item.dealDate,
    builtYear: item.builtYear,
    pyeongValue: item.pyeongValue ?? Math.round(pyeong(item.area)),
    pricePerPyeong: item.pricePerPyeong ?? pricePerPyeong(item),
    dealCount: item.dealCount ?? item.recentCount ?? 1,
    score: item.score ?? null,
    reasons: item.reasons ?? [],
    scoreBasis: item.scoreBasis ?? [],
    savedAt: new Date().toISOString(),
  };
}

function updateFinderSavedCount() {
  const label = String(finderSavedItems.length);
  const ids = ["finderSavedCount", "finderSavedInlineCount", "finderSavedListCount"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  }
}

function setFinderSaveButtons(key) {
  const saved = isFinderSaved(key);
  document.querySelectorAll("[data-finder-save]").forEach((button) => {
    if (button.dataset.finderSave !== key) return;
    button.classList.toggle("saved", saved);
    button.closest(".finder-result")?.classList.toggle("saved", saved);
    button.setAttribute("aria-pressed", saved ? "true" : "false");
    button.innerHTML = saved ? "저장됨" : "저장";
  });
  updateFinderSavedCount();
}

function toggleFinderSaved(item) {
  const key = finderSaveKey(item);
  if (isFinderSaved(key)) {
    finderSavedItems = finderSavedItems.filter((saved) => saved.key !== key);
  } else {
    finderSavedItems = [finderSavedPayload(item), ...finderSavedItems.filter((saved) => saved.key !== key)];
  }
  saveFinderSaved();
  setFinderSaveButtons(key);
  return isFinderSaved(key);
}

const GU_LIST = [
  "종로구","중구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구",
  "도봉구","노원구","은평구","서대문구","마포구","양천구","강서구","구로구","금천구",
  "영등포구","동작구","관악구","서초구","강남구","송파구","강동구",
];
// 자치구 인접 관계 (출근지 가산점용 · 근사)
const GU_ADJACENCY = {
  종로구:["중구","서대문구","성북구","동대문구","용산구"],
  중구:["종로구","용산구","성동구","동대문구","서대문구"],
  용산구:["중구","종로구","성동구","마포구","동작구","영등포구"],
  성동구:["중구","용산구","동대문구","광진구","강남구","송파구"],
  광진구:["성동구","동대문구","중랑구","강동구","송파구"],
  동대문구:["종로구","중구","성동구","광진구","중랑구","성북구"],
  중랑구:["동대문구","광진구","노원구","성북구","강북구"],
  성북구:["종로구","동대문구","중랑구","강북구","노원구","도봉구"],
  강북구:["성북구","도봉구","노원구","중랑구"],
  도봉구:["강북구","노원구","성북구"],
  노원구:["도봉구","강북구","성북구","중랑구"],
  은평구:["서대문구","마포구","종로구"],
  서대문구:["은평구","종로구","중구","마포구","성북구"],
  마포구:["서대문구","은평구","용산구","영등포구","중구"],
  양천구:["강서구","구로구","영등포구"],
  강서구:["양천구","구로구","영등포구","마포구"],
  구로구:["양천구","강서구","영등포구","금천구","관악구","동작구"],
  금천구:["구로구","관악구","영등포구"],
  영등포구:["용산구","마포구","동작구","관악구","구로구","양천구","강서구","금천구"],
  동작구:["용산구","영등포구","관악구","서초구","구로구"],
  관악구:["금천구","구로구","동작구","서초구","영등포구"],
  서초구:["동작구","관악구","강남구","송파구","용산구"],
  강남구:["서초구","송파구","성동구","광진구","용산구"],
  송파구:["강남구","서초구","강동구","광진구","성동구"],
  강동구:["송파구","광진구"],
};

const FINDER_AREA_PROFILES = {
  강남구: {
    education: "대치·도곡권 학원가 접근성이 강하고 중고교 선택지가 넓음",
    infra: "대형병원, 백화점, 업무지구, 광역 교통 이용이 편리",
    upside: "강남 핵심 수요와 재건축·정비사업 기대가 가격 방어에 기여",
  },
  서초구: {
    education: "서초·반포권 학군과 학원 접근성이 우수",
    infra: "고속터미널, 백화점, 대형병원, 법조·업무지구 접근성 우수",
    upside: "한강변·재건축 수요와 강남권 대체 수요가 탄탄",
  },
  송파구: {
    education: "잠실·송파권 학군과 학원 접근성이 양호",
    infra: "잠실 상권, 대형병원, 한강·올림픽공원 생활권",
    upside: "잠실·가락·문정 업무권과 재건축 기대가 혼재",
  },
  성동구: {
    education: "행당·옥수·금호권 초중학교 접근성이 좋고 도심 학원 이동이 쉬움",
    infra: "왕십리·성수·한양대 생활권, 병원·마트·상권 접근성 우수",
    upside: "성수·왕십리 업무·상권 확장과 한강변 선호가 꾸준함",
  },
  광진구: {
    education: "광장·구의권 학군 선호와 학원 접근성이 있음",
    infra: "강변·건대·광나루 생활권, 한강·대형마트 접근성 양호",
    upside: "한강변·동서울터미널 개발 기대와 강남·잠실 접근성이 장점",
  },
  강동구: {
    education: "명일·고덕권 학군과 초중학교 접근성이 강점",
    infra: "고덕·천호·명일 생활권, 대형병원·마트 접근성 양호",
    upside: "고덕 업무·상업지 확장, 9호선 연장 기대, 신축 대단지 수요",
  },
  중구: {
    education: "도심 학교 접근성과 사립·특목 통학 선택지가 있음",
    infra: "도심 업무지구, 대형병원, 백화점, 지하철 접근성이 매우 좋음",
    upside: "도심 직주근접 수요와 희소한 주거 대단지 프리미엄",
  },
  용산구: {
    education: "용산·마포·중구권 학교 및 국제학교 접근성이 일부 강점",
    infra: "신용산·서울역·이태원 생활권, 병원·마트·교통 인프라 우수",
    upside: "용산국제업무지구, 정비사업, 한강변 개발 기대",
  },
  동대문구: {
    education: "전농·답십리권 초중학교와 학원 접근성이 무난",
    infra: "청량리·왕십리·동대문 생활권, 대학병원 접근성 우수",
    upside: "청량리 광역교통·정비사업과 동북권 교통 개선 기대",
  },
};

const FINDER_DONG_PROFILES = {
  행당동: {
    station: "행당역·왕십리역 생활권",
    education: "행현초·행당중 등 초중학교 접근성이 좋아 실거주 선호가 높음",
    infra: "왕십리역 상권, 한양대병원, 대형마트·쇼핑시설 접근",
    upside: "왕십리 교통허브와 성동구 급지 상승 수요",
  },
  광장동: {
    station: "광나루역·강변역 생활권",
    education: "광남학군 선호와 초중고 접근성이 강점",
    infra: "한강공원, 강변 상권, 대형마트 접근성 양호",
    upside: "한강 접근성과 동서울터미널 개발 기대",
  },
  명일동: {
    station: "명일역·굽은다리역 생활권",
    education: "명일동 학군 선호와 초중학교 접근성이 강점",
    infra: "강동경희대병원, 이마트·상권 접근성 양호",
    upside: "9호선 연장 기대와 재건축·신축 수요 공존",
  },
  고덕동: {
    station: "고덕역 생활권",
    education: "고덕권 초중학교 접근성과 신축 학군 수요",
    infra: "고덕비즈밸리, 대형병원·상권 접근",
    upside: "고덕 업무지구 확장과 신축 대단지 선호",
  },
  신당동: {
    station: "약수역·신당역·청구역 생활권",
    education: "도심권 학교 접근성과 중구·성동 학원 이동 편의",
    infra: "도심 업무지구, 백화점, 대학병원, 지하철 다중노선 접근",
    upside: "도심 직주근접과 희소 대단지 수요",
  },
  풍납동: {
    station: "천호역·강동구청역 생활권",
    education: "송파권 학교 접근성과 생활 학원 이용 가능",
    infra: "한강, 아산병원, 천호·잠실 상권 접근",
    upside: "송파 진입 가격대와 한강 접근성, 문화재 규제는 별도 확인 필요",
  },
  신계동: {
    station: "신용산·삼각지역 생활권",
    education: "용산·마포권 학교 접근성과 도심 통학 편의",
    infra: "용산역, 아이파크몰, 대형병원, 업무지구 접근",
    upside: "용산 개발 기대와 신용산 생활권 확장",
  },
  전농동: {
    station: "청량리역·답십리역 생활권",
    education: "전농초·동대문권 학교 접근성이 무난",
    infra: "청량리역 상권, 대학병원, 대형마트 접근",
    upside: "청량리 광역교통 개선과 정비사업 기대",
  },
  답십리동: {
    station: "답십리역·청량리역 생활권",
    education: "초중학교 접근성과 생활 학원 이용이 무난",
    infra: "청량리·왕십리 생활권, 병원·마트 접근성 양호",
    upside: "동북권 교통 개선과 신축·준신축 선호",
  },
};

const PY_BUCKETS = { "10": [10, 20], "20": [20, 30], "30": [30, 40], "40": [40, 9999] };
const PY_LABEL = { "10": "10평대", "20": "20평대", "30": "30평대", "40": "40평 이상" };

function renderFinderRegion() {} // 위저드에서 직접 처리 (applyTransactions 호환용 스텁)

/* ── 대출 한도 추정 (LTV + DSR 간이 공식 · 추정치) ── */
function estimateLoanCapacityMan() {
  // DSR 40% 한도, 30년 만기 4% 가정 → 연 원리금/대출원금 ≈ 0.0573
  // 기존대출 연상환액은 대략 잔액의 6%로 차감
  const dsrRoom = finderState.salaryMan * 0.40 - finderState.existingLoanMan * 0.06;
  return Math.max(0, Math.round(dsrRoom / 0.0573));
}
function finderLtv() { return finderState.firstHome ? 0.70 : 0.50; }
function finderBudgetMan() {
  const cash = finderState.cashMan;
  if (finderState.loanPlan === "manual") return cash + finderState.loanManualMan;
  const byLtv = cash / (1 - finderLtv());          // 자기자본 비율 제약
  return Math.min(byLtv, cash + estimateLoanCapacityMan()); // 현금+추정대출 제약
}

function pyeongAllowed(py) {
  const b = finderState.pyeongBuckets;
  if (!b.length) return true;
  return b.some((k) => { const [lo, hi] = PY_BUCKETS[k]; return py >= lo && py < hi; });
}

// 거래를 단지 단위로 묶어 대표가/거래량/연식을 집계
function aggregateComplexes() {
  const budgetMan = finderBudgetMan();
  const groups = {};
  for (const t of transactions) {
    if (finderState.regions.length && !finderState.regions.includes(t.district)) continue;
    if (!pyeongAllowed(pyeong(t.area))) continue;
    const key = `${t.district}|${t.complex}`;
    (groups[key] = groups[key] || []).push(t);
  }
  const complexes = [];
  for (const rows of Object.values(groups)) {
    const latest = [...rows].sort((a, b) => b.dealDate.localeCompare(a.dealDate))[0];
    if (latest.price > budgetMan) continue; // 예산 초과 단지 제외
    const previousHigh = Math.max(...rows.map((r) => r.previousHigh || r.price));
    const meta = {
      district: latest.district, complex: latest.complex, builtYear: latest.builtYear,
      permitZone: latest.permitZone, isRecord: latest.price > previousHigh,
    };
    complexes.push({
      ...latest,
      pyeongValue: Math.round(pyeong(latest.area)),
      pricePerPyeong: pricePerPyeong(latest),
      dealCount: rows.length,
      previousHigh,
      isRecord: meta.isRecord,
      ...finderAnnualGrowth(rows, meta),
    });
  }
  return complexes;
}

function finderRecordGap(c) {
  if (!c.previousHigh) return 0;
  return Math.round(((c.price - c.previousHigh) / c.previousHigh) * 1000) / 10;
}

function finderNormalizeName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/아파트|맨션|단지/g, "")
    .replace(/[()\[\]{}·.\s_-]/g, "")
    .trim();
}

function finderMatchedCandidate(c) {
  const txName = finderNormalizeName(c.complex);
  return candidateState.items.find(({ candidate }) => {
    if (candidate.district !== c.district) return false;
    if (candidate.dongs?.length && !candidate.dongs.includes(c.dong)) return false;
    return [candidate.name, ...(candidate.aliases ?? [])]
      .map(finderNormalizeName)
      .some((name) => name && (txName === name || txName.includes(name) || name.includes(txName)));
  })?.candidate ?? null;
}

function finderAreaProfile(c) {
  return {
    ...(FINDER_AREA_PROFILES[c.district] ?? {}),
    ...(FINDER_DONG_PROFILES[c.dong] ?? {}),
  };
}

function finderScoreBasis(c) {
  const candidate = finderMatchedCandidate(c);
  const profile = finderAreaProfile(c);
  const households = candidate?.households || c.households || 0;
  const station = candidate?.station || profile.station || "";
  const schools = candidate?.schools?.length ? candidate.schools.join(", ") : "";
  const notes = candidate?.notes?.length ? candidate.notes.join(", ") : "";

  const scalePoints = households >= 1000 ? 5 : households >= 500 ? 4 : households > 0 ? 2 : 1;
  const educationText = schools
    ? `${schools} 기반. ${profile.education ?? "초중학교·학원 접근은 임장 확인 권장"}`
    : (profile.education ?? "학군, 초품아 여부, 학원 접근은 지도·임장으로 추가 확인 필요");

  return [
    {
      key: "transit",
      label: "역세권",
      points: station ? 5 : 2,
      text: station || `${c.district} 주요 지하철 접근성은 단지별 확인 필요`,
    },
    {
      key: "scale",
      label: "500세대 이상",
      points: scalePoints,
      text: households ? `${moneyFormatter.format(households)}세대${households >= 500 ? " 대단지 조건 충족" : "로 규모 조건은 약함"}` : "세대수 데이터 없음. 별도 확인 필요",
    },
    {
      key: "education",
      label: "교육",
      points: schools || profile.education ? 5 : 2,
      text: educationText,
    },
    {
      key: "infra",
      label: "인프라",
      points: profile.infra ? 5 : 3,
      text: profile.infra ?? `${c.district} 생활권의 병원·마트·상권 접근성은 개별 확인 필요`,
    },
    {
      key: "upside",
      label: "기타 호재",
      points: profile.upside || notes || c.permitZone ? 4 : 2,
      text: [notes, profile.upside, c.permitZone ? `토지거래허가구역: ${c.permitZone}` : ""].filter(Boolean).join(" · ") || "뚜렷한 호재 데이터 없음. 정비사업·교통계획 별도 확인 필요",
    },
  ];
}

// 입지·호재 기반 추정 상승률 (장기 실거래 이력이 없을 때 대체)
const FINDER_GROWTH_PREMIUM = {
  강남구: 2.2, 서초구: 2.0, 용산구: 1.7, 송파구: 1.6, 성동구: 1.5, 마포구: 1.3,
  광진구: 1.1, 양천구: 1.0, 영등포구: 0.9, 강동구: 0.8, 동작구: 0.8,
};
function finderEstimateGrowth(meta) {
  let g = 4.3 + (FINDER_GROWTH_PREMIUM[meta.district] ?? 0.3);
  if (meta.permitZone) g += 0.8;                       // 재건축·토허 호재
  if (meta.builtYear && meta.builtYear < 1995) g += 0.5; // 노후 재건축 기대
  if (meta.isRecord) g += 0.4;
  const h = [...String(meta.complex)].reduce((s, ch) => s + ch.charCodeAt(0), 0);
  g += ((h % 9) - 4) * 0.1;                             // 단지별 미세 변동
  return Math.round(Math.max(2, Math.min(9, g)) * 10) / 10;
}

// 연평균 상승률 (CAGR) — 단지 거래 이력(연도별 평당가 평균)으로 최대 20년. 없으면 추정치.
function finderAnnualGrowth(rows, meta) {
  const byYear = {};
  for (const t of rows) {
    const py = pyeong(t.area);
    if (py <= 0) continue;
    const y = t.dealDate.slice(0, 4);
    (byYear[y] = byYear[y] || []).push(t.price / py);
  }
  const years = Object.keys(byYear).sort();
  const avg = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  if (years.length >= 2) {
    const y0 = years[0], y1 = years[years.length - 1];
    const span = Math.min(20, Number(y1) - Number(y0));
    const ratio = avg(byYear[y1]) / avg(byYear[y0]);
    if (span >= 1 && ratio > 0) {
      const g = (Math.pow(ratio, 1 / span) - 1) * 100;
      if (isFinite(g)) return { annualGrowth: Math.round(g * 10) / 10, growthYears: span, growthEstimated: false };
    }
  }
  return { annualGrowth: finderEstimateGrowth(meta), growthYears: 0, growthEstimated: true };
}

// 점수 근거(5항목)를 입지/상품성/학군 3개 카테고리(0~99점)로 묶기
function finderCategories(c, scoreBasis) {
  const byKey = {};
  (scoreBasis || []).forEach((i) => { byKey[i.key] = i; });
  const g = (k) => byKey[k] || { points: 2, text: "" };
  const transit = g("transit"), infra = g("infra"), upside = g("upside"), scale = g("scale"), edu = g("education");
  const builtPts = c.builtYear >= 2018 ? 5 : c.builtYear >= 2010 ? 4 : c.builtYear >= 2000 ? 3 : c.builtYear >= 1990 ? 2 : 1;
  const clamp = (v) => Math.max(35, Math.min(99, Math.round(v)));
  return [
    { label: "입지", score: clamp(42 + (transit.points + infra.points + upside.points - 6) * 4.5), detail: [transit.text, infra.text, upside.text].filter(Boolean).join(" · ") || "입지 데이터 확인 필요" },
    { label: "상품성", score: clamp(40 + (scale.points - 1) * 6 + (builtPts - 1) * 7), detail: `${c.builtYear ? c.builtYear + "년 준공" : "연식 미상"} · ${scale.text}` },
    { label: "학군", score: clamp(45 + (edu.points - 2) * 8), detail: edu.text || "학군 데이터 확인 필요" },
  ];
}

function scoreComplex(c) {
  const budgetMan = finderBudgetMan();
  const ratio = budgetMan ? c.price / budgetMan : 1;
  const reasons = [];
  const scoreBasis = finderScoreBasis(c);
  const categories = finderCategories(c, scoreBasis);
  // 가치 점수: 입지·상품성·학군 평균 (단지마다 다름)
  const catAvg = categories.reduce((s, x) => s + x.score, 0) / categories.length;

  // 조건 적합도 (0~40): 내 조건에 얼마나 맞는지
  let match = 0;
  if (finderState.purpose === "LIVING") {
    if (c.builtYear >= 2018) { match += 9; reasons.push("신축"); }
    else if (c.builtYear >= 2010) { match += 6; reasons.push("준신축"); }
    else if (c.builtYear >= 2000) { match += 3; }
    if (c.dealCount >= 5) { match += 7; reasons.push(`거래 활발 ${c.dealCount}건`); }
    else if (c.dealCount >= 2) { match += 3; }
    if (ratio >= 0.7 && ratio <= 0.97) { match += 8; reasons.push("예산 적합"); }
    else if (ratio < 0.7) { match += 4; reasons.push("예산 여유"); }
    if (c.pyeongValue >= 24 && c.pyeongValue <= 36) { match += 4; reasons.push("국민평형"); }
    if (c.price <= c.previousHigh) { match += 3; reasons.push("직전 고점 이하"); }
  } else {
    if (c.isRecord) { match += 10; reasons.push("신고가 경신"); }
    else if (c.price >= c.previousHigh * 0.97) { match += 6; reasons.push("전고점 근접"); }
    if (c.dealCount >= 5) { match += 8; reasons.push(`거래량 ${c.dealCount}건`); }
    else if (c.dealCount >= 2) { match += 4; }
    if (c.permitZone) { match += 6; reasons.push("토허구역"); }
    if (ratio >= 0.85) { match += 6; reasons.push("예산 최대 활용"); }
    const gap = finderRecordGap(c);
    if (gap > 5) { match += 4; reasons.push(`고점 대비 +${gap}%`); }
  }
  // 출근지 가산점
  if (finderState.commuteGu) {
    if (c.district === finderState.commuteGu) { match += 10; reasons.unshift("출근 편리(같은 구)"); }
    else if ((GU_ADJACENCY[finderState.commuteGu] || []).includes(c.district)) { match += 5; reasons.unshift("출근 양호(인접 구)"); }
  }

  // 최종 = 가치(입지·상품성·학군 평균) 70% + 조건 적합도(출근지 포함) 가산
  const score = Math.max(45, Math.min(99, Math.round(catAvg * 0.7 + match)));
  for (const item of scoreBasis.filter((basis) => basis.points >= 4).slice(0, 2)) {
    if (!reasons.includes(item.label)) reasons.push(item.label);
  }
  return { ...c, score, reasons: reasons.slice(0, 4), scoreBasis, categories, basisBonus: Math.round(catAvg * 0.6) };
}

function runFinder() {
  return aggregateComplexes()
    .map(scoreComplex)
    .sort((a, b) => b.score - a.score || b.dealCount - a.dealCount || a.price - b.price)
    .slice(0, 30);
}

function finderCardHtml(c, rank) {
  const recordTag = c.isRecord ? `<span class="finder-badge hot">신고가</span>` : "";
  const badges = c.reasons.map((r) => `<span class="finder-badge">${r}</span>`).join("");
  const saveKey = finderSaveKey(c);
  const saved = isFinderSaved(saveKey);
  const cats = (c.categories ?? []).map((cat) => `
    <div class="finder-cat">
      <span class="finder-cat-label">${cat.label}</span>
      <span class="fstars"><span class="fstars-fill" style="width:${cat.score}%">★★★★★</span>★★★★★</span>
      <span class="finder-cat-score">${cat.score}</span>
      <span class="finder-cat-tip">${cat.detail}</span>
    </div>
  `).join("");
  const growthTip = c.growthEstimated
    ? "장기 실거래 데이터가 연동되면 실제값으로 바뀌어요. 지금은 입지·재건축 호재·거래를 반영한 추정 상승률이에요."
    : `지난 ${c.growthYears}년 동안 매년 평균 ${Math.abs(c.annualGrowth)}%씩 ${c.annualGrowth >= 0 ? "상승" : "하락"}해왔어요.`;
  const growth = c.annualGrowth != null ? `
    <div class="finder-growth">
      <span class="finder-growth-label">연평균 상승률${c.growthEstimated ? " (추정)" : ""} <i>ⓘ</i></span>
      <strong class="${c.annualGrowth >= 0 ? "up" : "down"}">${c.annualGrowth >= 0 ? "+" : ""}${c.annualGrowth}%</strong>
      <span class="finder-cat-tip right">${growthTip}</span>
    </div>` : "";
  return `<article class="finder-result ${saved ? "saved" : ""}">
    <button class="finder-result-open detail-trigger" type="button" data-detail-id="${c.id}" data-detail-context="recommendation">
      <span class="finder-rank">${rank}</span>
      <div class="finder-result-main">
        <div class="finder-result-head">
          <h3>${c.complex}</h3>
          <span class="finder-score">${c.score}<em>점</em></span>
        </div>
        <p class="finder-result-sub">${c.district} ${c.dong} · ${c.builtYear ? c.builtYear + "년" : "연식미상"} · ${c.pyeongValue}평형 · 거래 ${c.dealCount}건</p>
        <div class="finder-badges">${recordTag}${badges}</div>
        <div class="finder-cats">${cats}</div>
      </div>
      <div class="finder-result-price">
        <strong>${formatPrice(c.price)}</strong>
        <small>평당 ${moneyFormatter.format(c.pricePerPyeong)}만</small>
        ${growth}
      </div>
    </button>
    <button class="finder-save ${saved ? "saved" : ""}" type="button" data-finder-save="${escapeHtml(saveKey)}" data-finder-id="${escapeHtml(c.id)}" aria-pressed="${saved ? "true" : "false"}">${saved ? "저장됨" : "저장"}</button>
  </article>`;
}

function fmtEok(man) {
  const eok = Math.round((man / 10000) * 10) / 10;
  return `${eok}억`;
}

// 월 상환 원리금 (만원) — 30년 만기, 연 4% 가정
function monthlyPaymentMan(loanMan) {
  if (loanMan <= 0) return 0;
  const r = 0.04 / 12, n = 360;
  return Math.round(loanMan * r / (1 - Math.pow(1 + r, -n)));
}

// 부대비용 추정 (만원) — 취득세(가격대별) + 중개·기타 약 0.6%
function acqCostMan(priceMan) {
  const eok = priceMan / 10000;
  let taxRate;
  if (eok <= 6) taxRate = 0.011;
  else if (eok <= 9) taxRate = (eok * 2 / 3 - 3) / 100 + 0.002;
  else taxRate = 0.033;
  return Math.round(priceMan * taxRate + priceMan * 0.006);
}

// 대출 슬라이더 최대치 (DSR 추정 한도, 최소 5억 보장)
function fwSliderMax() {
  return Math.max(50000, Math.ceil(estimateLoanCapacityMan() / 1000) * 1000);
}

function openFinderSavedList() {
  const overlay = document.getElementById("districtDetailOverlay");
  const rows = finderSavedItems;
  const listHtml = rows.length ? rows.map((item, index) => `
    <article class="finder-saved-card">
      <button class="finder-saved-main detail-trigger" type="button" data-detail-id="${escapeHtml(item.id)}" data-detail-context="recommendation">
        <span class="finder-rank">${index + 1}</span>
        <div class="finder-result-main">
          <div class="finder-result-head">
            <h3>${escapeHtml(item.complex)}</h3>
            ${item.score ? `<span class="finder-score">${item.score}<em>점</em></span>` : ""}
          </div>
          <p class="finder-result-sub">${escapeHtml(item.district)} ${escapeHtml(item.dong)} · ${item.builtYear ? item.builtYear + "년" : "연식미상"} · ${item.pyeongValue}평형 · 저장 ${new Date(item.savedAt).toLocaleDateString("ko-KR")}</p>
          <div class="finder-badges">${(item.reasons ?? []).slice(0, 4).map((reason) => `<span class="finder-badge">${escapeHtml(reason)}</span>`).join("")}</div>
        </div>
        <div class="finder-result-price">
          <strong>${formatPrice(item.price)}</strong>
          <small>평당 ${moneyFormatter.format(item.pricePerPyeong)}만</small>
        </div>
      </button>
      <button class="finder-remove" type="button" data-finder-remove="${escapeHtml(item.key)}">삭제</button>
    </article>
  `).join("") : `<div class="finder-empty">아직 저장한 맞춤 아파트가 없어요.<br>추천 결과에서 저장 버튼을 눌러 따로 모아둘 수 있습니다.</div>`;

  overlay.innerHTML = `
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main" id="finderSavedOverlay">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            홈으로
          </button>
          <span>›</span><span>저장한 맞춤 아파트</span>
        </div>
        <div class="dd-title-row">
          <h2 class="dd-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            저장한 아파트 <span id="finderSavedListCount">${rows.length}</span>곳
          </h2>
          <button class="finder-edit" type="button" id="finderSavedFindBtn">맞춤 추천 다시 보기</button>
        </div>
        <div class="finder-results dd-list">${listHtml}</div>
      </div>
    </div>`;
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn")?.addEventListener("click", closeDistrictDetail);
  document.getElementById("finderSavedFindBtn")?.addEventListener("click", openFinderWizard);
  updateFinderSavedCount();
}

/* ── 추천 결과 화면 ── */
function openFinderResults() {
  const results = runFinder();
  state.currentResults = results;
  const overlay = document.getElementById("districtDetailOverlay");
  const budgetMan = finderBudgetMan();
  const loanMan = Math.max(0, budgetMan - finderState.cashMan);
  const purposeText = finderState.purpose === "LIVING" ? "실거주" : "투자";

  const chips = [
    finderState.regions.length ? finderState.regions.join("·") : "서울 전체",
    `예산 ${fmtEok(budgetMan)}`,
    finderState.pyeongBuckets.length ? finderState.pyeongBuckets.map((k) => PY_LABEL[k]).join("·") : null,
    finderState.commuteGu ? `${finderState.commuteGu} 출근` : null,
    `${purposeText} 추천`,
  ].filter(Boolean).map((c) => `<span class="finder-chip">${c}</span>`).join("");

  const budgetNote = finderState.loanPlan === "manual"
    ? `현금 ${fmtEok(finderState.cashMan)} + 대출 ${fmtEok(loanMan)} = 약 <strong>${fmtEok(budgetMan)}</strong>`
    : `현금 ${fmtEok(finderState.cashMan)} + 추정대출 ${fmtEok(loanMan)} = 약 <strong>${fmtEok(budgetMan)}</strong> <em>· 연봉 기반 추정치 (은행 실제 승인과 다를 수 있어요)</em>`;

  const listHtml = results.length
    ? results.map((c, i) => finderCardHtml(c, i + 1)).join("")
    : `<div class="finder-empty">조건에 맞는 아파트가 없어요.<br>예산을 높이거나 지역·평형 조건을 넓혀보세요.</div>`;

  // 자금 분석 (예산 기준)
  const acqMan = acqCostMan(budgetMan);
  const realCashMan = finderState.cashMan + acqMan;
  const monthly = monthlyPaymentMan(loanMan);
  const faField = (label, val) => `<div class="fa-field"><span>${label}</span><strong>${val}</strong></div>`;
  const analysisHtml = `
    <div class="finder-analysis">
      <div class="fa-card">
        <h3>자금 분석</h3>
        <div class="fa-rows">
          <div class="fa-row"><span>최대 매매가 (예산)</span><strong>${fmtEok(budgetMan)}</strong></div>
          <div class="fa-row"><span>대출</span><strong>${fmtEok(loanMan)}</strong></div>
          <div class="fa-row"><span>부대비용 (취득세 등·추정)</span><strong>${fmtEok(acqMan)}</strong></div>
          <div class="fa-row total"><span>실투자금 (필요 현금)</span><strong>${fmtEok(realCashMan)}</strong></div>
          <div class="fa-row"><span>예상 월 상환 원리금</span><strong>${moneyFormatter.format(monthly)}만 / 월</strong></div>
        </div>
        <p class="fa-note">취득세·월 상환액은 30년 만기·연 4% 가정의 추정치예요.</p>
      </div>
      <div class="fa-card">
        <h3>내 정보</h3>
        <div class="fa-grid">
          ${faField("목적", purposeText)}
          ${faField("관심 지역", finderState.regions.length ? finderState.regions.join(", ") : "서울 전체")}
          ${faField("선호 평수", finderState.pyeongBuckets.length ? finderState.pyeongBuckets.map((k) => PY_LABEL[k]).join(", ") : "전체")}
          ${faField("출근지", finderState.commuteGu || "고려 안 함")}
          ${faField("보유 자금", fmtEok(finderState.cashMan))}
          ${faField("연봉", finderState.salaryMan ? fmtEok(finderState.salaryMan) : "-")}
          ${faField("현재 대출", finderState.hasExistingLoan ? fmtEok(finderState.existingLoanMan) : "없음")}
          ${faField("생애 최초", finderState.firstHome ? "무주택 (예)" : "유주택 (아니오)")}
          ${faField("대출 계획", finderState.loanPlan === "manual" ? "직접 입력" : "연봉 추정")}
        </div>
      </div>
    </div>`;

  overlay.innerHTML = `
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            홈으로
          </button>
          <span>›</span><span>맞춤 아파트 추천</span>
        </div>
        <div class="dd-title-row">
          <h2 class="dd-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            맞춤 아파트 추천 ${results.length}곳
          </h2>
          <button class="finder-saved-inline" type="button" id="finderSavedInlineBtn">저장한 아파트 <span id="finderSavedInlineCount">${finderSavedItems.length}</span></button>
          <button class="finder-edit" type="button" id="finderEditBtn">조건 다시 선택</button>
        </div>
        <div class="finder-budget-note">${budgetNote}</div>
        <div class="finder-chips">${chips}</div>
        <div class="finder-results dd-list">${listHtml}</div>
        ${analysisHtml}
      </div>
    </div>`;

  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn").addEventListener("click", closeDistrictDetail);
  document.getElementById("finderEditBtn").addEventListener("click", openFinderWizard);
  document.getElementById("finderSavedInlineBtn")?.addEventListener("click", openFinderSavedList);
  updateFinderSavedCount();
}

/* ── 단계별 설문 위저드 ── */
const FINDER_STEPS = [
  { id: "cash" },
  { id: "purpose", auto: true },
  { id: "region" },
  { id: "pyeong" },
  { id: "commute" },
  // { id: "step6" },   // ⬅︎ 6/10 단계 — 캡처 수령 후 여기에 추가
  { id: "firsthome", auto: true },
  { id: "salary" },
  { id: "existingloan" },
  { id: "loanplan" },
];
let fwIndex = 0;

function fwReadNum(eokId, manId) {
  const e = Number(document.getElementById(eokId)?.value || 0);
  const m = Number(document.getElementById(manId)?.value || 0);
  return Math.max(0, e * 10000 + m);
}

function fwStepContent(id) {
  switch (id) {
    case "cash": return {
      title: "자본금 입력", desc: "현재 가지고 계신 현금은 얼마인가요?",
      body: `
        <div class="fw-chips">${[1, 2, 3, 5, 10].map((v) => `<button class="fw-chip" type="button" data-cash-eok="${v}">${v}억</button>`).join("")}</div>
        <div class="fw-sub">직접 입력</div>
        <div class="fw-inline">
          <div class="fw-num"><input id="fwCashEok" type="number" min="0" value="${Math.floor(finderState.cashMan / 10000) || ""}" placeholder="0"><span>억</span></div>
          <div class="fw-num"><input id="fwCashMan" type="number" min="0" value="${finderState.cashMan % 10000 || ""}" placeholder="0"><span>만원</span></div>
        </div>`,
    };
    case "purpose": return {
      title: "아파트 구입 목적", desc: "아파트를 찾는 목적을 선택해 주세요. 목적에 따라 추천하는 아파트가 달라요.",
      body: `<div class="fw-opts">
        <button class="fw-opt ${finderState.purpose === "LIVING" ? "active" : ""}" type="button" data-purpose="LIVING">실거주</button>
        <button class="fw-opt ${finderState.purpose === "INVEST" ? "active" : ""}" type="button" data-purpose="INVEST">투자</button>
      </div>`,
    };
    case "region": return {
      title: "관심 지역 선택", desc: "관심 있는 지역을 선택해 주세요. (최대 5개 · 선택 안 하면 서울 전체)",
      body: `<div class="fw-grid">${GU_LIST.map((g) => `<button class="fw-chip ${finderState.regions.includes(g) ? "active" : ""}" type="button" data-region="${g}">${g}</button>`).join("")}</div>`,
    };
    case "pyeong": return {
      title: "선호 평수", desc: "어느 정도 평수를 선호하시나요? (다중 선택 · 선택 안 하면 전체)",
      body: `<div class="fw-opts">${Object.keys(PY_LABEL).map((k) => `<button class="fw-opt ${finderState.pyeongBuckets.includes(k) ? "active" : ""}" type="button" data-pyeong="${k}">${PY_LABEL[k]}</button>`).join("")}</div>`,
    };
    case "commute": return {
      title: "출근하는 곳이 어디신가요?", desc: "직장 위치를 알려주시면, 출퇴근이 편한 곳을 추천해드릴게요.",
      body: `<div class="fw-opts">
        <button class="fw-opt ${finderState.commuteMode === "fixed" ? "active" : ""}" type="button" data-commute="fixed">매일 같은 곳으로 출근해요</button>
        <button class="fw-opt ${finderState.commuteMode === "none" ? "active" : ""}" type="button" data-commute="none">직장 위치는 고려하지 않을게요</button>
      </div>
      <div class="fw-addr" ${finderState.commuteMode === "fixed" ? "" : "hidden"}>
        <input id="fwCommuteAddr" type="text" placeholder="직장 주소 (예: 서울 강남구 테헤란로)" value="${finderState.commuteAddr || ""}">
        <p class="fw-hint">주소 안의 '○○구'를 읽어 같은 구·인접 구 단지에 가산점을 드려요.</p>
      </div>`,
    };
    case "firsthome": return {
      title: "생애 최초 구매", desc: "생애 최초로 주택을 구매하시나요?",
      body: `<div class="fw-opts">
        <button class="fw-opt ${finderState.firstHome === true ? "active" : ""}" type="button" data-first="yes">예</button>
        <button class="fw-opt ${finderState.firstHome === false ? "active" : ""}" type="button" data-first="no">아니오</button>
      </div>`,
    };
    case "salary": return {
      title: "연봉 입력", desc: "가능한 대출 금액을 추정하기 위해 연봉을 입력해 주세요. 부부 공동명의라면 부부 합산 연봉을 입력해 주세요.",
      body: `<div class="fw-inline">
        <div class="fw-num"><input id="fwSalEok" type="number" min="0" value="${Math.floor(finderState.salaryMan / 10000) || ""}" placeholder="0"><span>억</span></div>
        <div class="fw-num"><input id="fwSalMan" type="number" min="0" value="${finderState.salaryMan % 10000 || ""}" placeholder="0"><span>만원</span></div>
      </div>`,
    };
    case "existingloan": return {
      title: "현재 대출 현황", desc: "대출 가능액 계산을 위해 현재 대출 현황을 알려주세요.",
      body: `<div class="fw-opts">
        <button class="fw-opt ${finderState.hasExistingLoan === false ? "active" : ""}" type="button" data-exloan="no">대출이 없습니다</button>
        <button class="fw-opt ${finderState.hasExistingLoan === true ? "active" : ""}" type="button" data-exloan="yes">대출이 있습니다</button>
      </div>
      <div class="fw-inline fw-addr" ${finderState.hasExistingLoan ? "" : "hidden"}>
        <div class="fw-num"><input id="fwExEok" type="number" min="0" value="${Math.floor(finderState.existingLoanMan / 10000) || ""}" placeholder="0"><span>억</span></div>
        <div class="fw-num"><input id="fwExMan" type="number" min="0" value="${finderState.existingLoanMan % 10000 || ""}" placeholder="0"><span>만원</span></div>
      </div>`,
    };
    case "loanplan": {
      const estMax = estimateLoanCapacityMan();
      const sliderMax = fwSliderMax();
      const cur = Math.min(finderState.loanManualMan, sliderMax);
      return {
        title: "대출 계획", desc: "주택 구매 시 대출 계획이 있으신가요?",
        body: `<div class="fw-opts">
        <button class="fw-opt-rich ${finderState.loanPlan === "estimate" ? "active" : ""}" type="button" data-plan="estimate"><strong>아직 확실한 계획이 없어요</strong><span>입력하신 연봉으로 가능한 대출 한도를 추정해 드려요.</span></button>
        <button class="fw-opt-rich ${finderState.loanPlan === "manual" ? "active" : ""}" type="button" data-plan="manual"><strong>대출 계획이 있어요</strong><span>대출로 받을 금액을 직접 입력해 주세요.</span></button>
      </div>
      <div class="fw-addr fw-loancalc" ${finderState.loanPlan === "manual" ? "" : "hidden"}>
        <div class="fw-note-box">입력하신 연봉 <strong>${fmtEok(finderState.salaryMan)}</strong> 기준 DSR 40%로 <strong>약 ${fmtEok(estMax)}</strong>까지 가능해요.</div>
        <div class="fw-slider-head"><span>대출 금액</span><span class="fw-slider-max">최대 ${fmtEok(sliderMax)}</span></div>
        <input class="fw-range" type="range" id="fwLoanRange" min="0" max="${sliderMax}" step="1000" value="${cur}">
        <div class="fw-slider-scale"><span>0원</span><span class="fw-slider-cur" id="fwLoanCur">${fmtEok(cur)}</span><span>${fmtEok(sliderMax)}</span></div>
        <div class="fw-inline">
          <div class="fw-num"><input id="fwLoanEok" type="number" min="0" value="${Math.floor(cur / 10000) || ""}" placeholder="0"><span>억</span></div>
          <div class="fw-num"><input id="fwLoanManInput" type="number" min="0" value="${cur % 10000 || ""}" placeholder="0"><span>만원</span></div>
        </div>
        <div class="fw-month"><span>예상 월 상환 원리금</span><strong id="fwLoanMonthly">${moneyFormatter.format(monthlyPaymentMan(cur))}</strong> 만원/월</div>
      </div>`,
      };
    }
  }
}

function fwRender(i) {
  fwIndex = i;
  const step = FINDER_STEPS[i];
  const c = fwStepContent(step.id);
  document.getElementById("fwBody").innerHTML = `<h2 class="fw-title">${c.title}</h2><p class="fw-desc">${c.desc}</p>${c.body}`;
  document.getElementById("fwError").textContent = "";
  document.getElementById("fwBar").style.width = `${((i + 1) / FINDER_STEPS.length) * 100}%`;
  document.getElementById("fwCount").textContent = `${i + 1} / ${FINDER_STEPS.length}`;
  document.getElementById("fwPrev").style.visibility = i === 0 ? "hidden" : "visible";
  const next = document.getElementById("fwNext");
  next.style.display = step.auto ? "none" : "";
  next.textContent = i === FINDER_STEPS.length - 1 ? "추천 결과 보기" : "다음";
}

function extractGu(addr) { return GU_LIST.find((g) => addr.includes(g)) || ""; }

// 현재 단계 입력값을 상태에 반영. 문제 있으면 에러 문구 반환(없으면 null)
function fwCommit(i, soft = false) {
  const id = FINDER_STEPS[i].id;
  switch (id) {
    case "cash": {
      const v = fwReadNum("fwCashEok", "fwCashMan");
      if (!soft && v <= 0) return "현금을 입력해 주세요.";
      finderState.cashMan = v; return null;
    }
    case "commute": {
      if (!soft && !finderState.commuteMode) return "선택해 주세요.";
      if (finderState.commuteMode === "fixed") {
        const a = document.getElementById("fwCommuteAddr")?.value?.trim() || "";
        finderState.commuteAddr = a; finderState.commuteGu = extractGu(a);
      } else { finderState.commuteAddr = ""; finderState.commuteGu = ""; }
      return null;
    }
    case "firsthome":
      return (!soft && finderState.firstHome === null) ? "선택해 주세요." : null;
    case "salary":
      finderState.salaryMan = fwReadNum("fwSalEok", "fwSalMan"); return null;
    case "existingloan": {
      if (finderState.hasExistingLoan) {
        const v = fwReadNum("fwExEok", "fwExMan");
        if (!soft && v <= 0) return "대출 금액을 입력해 주세요.";
        finderState.existingLoanMan = v;
      } else finderState.existingLoanMan = 0;
      return null;
    }
    case "loanplan": {
      if (finderState.loanPlan === "manual") {
        const v = fwReadNum("fwLoanEok", "fwLoanManInput");
        if (!soft && v <= 0) return "대출 금액을 입력해 주세요.";
        finderState.loanManualMan = v;
      }
      return null;
    }
    default: return null; // purpose/region/pyeong 은 클릭 시 즉시 반영
  }
}

function fwAdvance() {
  document.getElementById("fwError").textContent = "";
  if (fwIndex >= FINDER_STEPS.length - 1) openFinderResults();
  else fwRender(fwIndex + 1);
}

function fwNext() {
  const err = fwCommit(fwIndex);
  if (err) { document.getElementById("fwError").textContent = err; return; }
  fwAdvance();
}

function fwDelegate(e) {
  const t = e.target;
  const eok = t.closest("[data-cash-eok]");
  if (eok) {
    document.getElementById("fwCashEok").value = eok.dataset.cashEok;
    document.getElementById("fwCashMan").value = 0;
    document.querySelectorAll("[data-cash-eok]").forEach((b) => b.classList.remove("active"));
    eok.classList.add("active"); return;
  }
  const pur = t.closest("[data-purpose]");
  if (pur) { finderState.purpose = pur.dataset.purpose; fwAdvance(); return; }
  const reg = t.closest("[data-region]");
  if (reg) {
    const g = reg.dataset.region; const idx = finderState.regions.indexOf(g);
    if (idx >= 0) finderState.regions.splice(idx, 1);
    else { if (finderState.regions.length >= 5) { document.getElementById("fwError").textContent = "최대 5개까지 선택할 수 있어요."; return; } finderState.regions.push(g); }
    reg.classList.toggle("active"); document.getElementById("fwError").textContent = ""; return;
  }
  const py = t.closest("[data-pyeong]");
  if (py) {
    const k = py.dataset.pyeong; const idx = finderState.pyeongBuckets.indexOf(k);
    if (idx >= 0) finderState.pyeongBuckets.splice(idx, 1); else finderState.pyeongBuckets.push(k);
    py.classList.toggle("active"); return;
  }
  const com = t.closest("[data-commute]");
  if (com) {
    finderState.commuteMode = com.dataset.commute;
    document.querySelectorAll("[data-commute]").forEach((b) => b.classList.remove("active"));
    com.classList.add("active");
    const box = document.querySelector(".fw-addr");
    if (box) box.toggleAttribute("hidden", finderState.commuteMode !== "fixed");
    document.getElementById("fwError").textContent = ""; return;
  }
  const fst = t.closest("[data-first]");
  if (fst) { finderState.firstHome = fst.dataset.first === "yes"; fwAdvance(); return; }
  const exl = t.closest("[data-exloan]");
  if (exl) {
    finderState.hasExistingLoan = exl.dataset.exloan === "yes";
    document.querySelectorAll("[data-exloan]").forEach((b) => b.classList.remove("active"));
    exl.classList.add("active");
    const box = document.querySelector(".fw-addr");
    if (box) box.toggleAttribute("hidden", !finderState.hasExistingLoan);
    return;
  }
  const pln = t.closest("[data-plan]");
  if (pln) {
    finderState.loanPlan = pln.dataset.plan;
    document.querySelectorAll("[data-plan]").forEach((b) => b.classList.remove("active"));
    pln.classList.add("active");
    const box = document.querySelector(".fw-addr");
    if (box) box.toggleAttribute("hidden", finderState.loanPlan !== "manual");
    if (finderState.loanPlan === "manual") fwUpdateLoanMonthly();
    return;
  }
}

// 대출 금액 입력/슬라이더 실시간 갱신
function fwUpdateLoanMonthly() {
  const eok = Number(document.getElementById("fwLoanEok")?.value || 0);
  const man = Number(document.getElementById("fwLoanManInput")?.value || 0);
  const max = fwSliderMax();
  let loan = Math.min(max, eok * 10000 + man);
  const range = document.getElementById("fwLoanRange");
  if (range) { range.max = max; range.value = loan; }
  const cur = document.getElementById("fwLoanCur");
  if (cur) cur.textContent = fmtEok(loan);
  const m = document.getElementById("fwLoanMonthly");
  if (m) m.textContent = moneyFormatter.format(monthlyPaymentMan(loan));
}

function fwInputDelegate(e) {
  const t = e.target;
  if (t.id === "fwLoanRange") {
    const v = Number(t.value);
    document.getElementById("fwLoanEok").value = Math.floor(v / 10000) || 0;
    document.getElementById("fwLoanManInput").value = v % 10000 || 0;
    const cur = document.getElementById("fwLoanCur"); if (cur) cur.textContent = fmtEok(v);
    const m = document.getElementById("fwLoanMonthly"); if (m) m.textContent = moneyFormatter.format(monthlyPaymentMan(v));
    return;
  }
  if (t.id === "fwLoanEok" || t.id === "fwLoanManInput") fwUpdateLoanMonthly();
}

function openFinderWizard() {
  const overlay = document.getElementById("districtDetailOverlay");
  overlay.innerHTML = `
    <div class="dd-inner" style="grid-template-columns:1fr;max-width:720px">
      <div class="dd-main fw-main">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            홈으로
          </button>
          <span>›</span><span>맞춤 아파트 찾기</span>
        </div>
        <div class="fw-progress"><span class="fw-progress-bar" id="fwBar"></span></div>
        <div class="fw-count" id="fwCount"></div>
        <div id="fwBody"></div>
        <div class="fw-error" id="fwError"></div>
        <div class="fw-nav">
          <button class="fw-prev" type="button" id="fwPrev">이전</button>
          <button class="fw-next" type="button" id="fwNext">다음</button>
        </div>
      </div>
    </div>`;
  overlay.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
  document.getElementById("ddBackBtn").addEventListener("click", closeDistrictDetail);
  document.getElementById("fwPrev").addEventListener("click", () => { fwCommit(fwIndex, true); if (fwIndex > 0) fwRender(fwIndex - 1); });
  document.getElementById("fwNext").addEventListener("click", fwNext);
  overlay.addEventListener("click", fwDelegate);
  overlay.addEventListener("input", fwInputDelegate);
  fwRender(0);
}

function setupFinder() {
  const btn = document.getElementById("finderStartBtn");
  if (btn) btn.addEventListener("click", openFinderWizard);
  document.getElementById("finderSavedBtn")?.addEventListener("click", openFinderSavedList);
  updateFinderSavedCount();
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
  renderNewClosings();
  renderRecords();
  renderTransactionHistory();
  renderPermitPreview();
  renderDistrictActivity();
  renderAskingSignals();
  renderCandidateWatchlist();
  renderFinderRegion();
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

function setDataConnectionNotice(kind, message = "") {
  let notice = document.getElementById("dataConnectionNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "dataConnectionNotice";
    notice.className = "data-notice";
    document.querySelector(".main")?.prepend(notice);
  }

  if (kind === "ok") {
    notice.remove();
    return;
  }

  const isFilePreview = window.location.protocol === "file:";
  const linkHtml = isFilePreview
    ? `<a href="${LOCAL_PREVIEW_URL}">http://localhost:3000/에서 열기</a>`
    : "";
  notice.className = `data-notice ${kind || "warn"}`;
  notice.innerHTML = `
    <div>
      <strong>${kind === "loading" ? "실거래 데이터 연결 중" : "실거래 데이터 연결 필요"}</strong>
      <p>${escapeHtml(message || "국토교통부 실거래 API는 로컬 서버를 통해 불러옵니다.")}</p>
    </div>
    ${linkHtml}
  `;
}

async function fetchAndUpdateCache(statusEl) {
  setDataConnectionNotice("loading", "로컬 API 서버에서 국토교통부 실거래 데이터를 불러오고 있습니다.");
  try {
    const res = await fetch(apiUrl("/api/transactions"));
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
      setDataConnectionNotice("ok");
      const fetched = new Date(json.fetchedAt).toLocaleTimeString("ko-KR");
      if (statusEl) statusEl.textContent = `실데이터 ${json.data.length.toLocaleString()}건`;
      addMessage(`국토교통부 실거래 데이터 ${json.data.length.toLocaleString()}건이 로드됐습니다 (${fetched} 기준). 원하는 지역, 예산, 면적, 준공연도를 말해 주세요.`, "assistant");
    }
  } catch (err) {
    if (state.dataSource !== "molit") {
      if (statusEl) statusEl.textContent = "샘플 데이터";
      setDataConnectionNotice(
        "warn",
        window.location.protocol === "file:"
          ? "현재 파일 미리보기 상태입니다. 실제 데이터는 로컬 서버가 켜져 있어야 보입니다. 터미널에서 npm start 후 localhost 주소로 열면 가장 안정적입니다."
          : "로컬 API 서버에 연결하지 못했습니다. npm start가 실행 중인지 확인해 주세요."
      );
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
  renderNewClosings();
  renderRecords();
  renderTransactionHistory();
  renderPermitPreview();
  renderDistrictActivity();
  renderAskingSignals();

  try { wireEvents(); } catch (e) { console.warn("[wireEvents]", e); }
  initGuDropdown();
  try { setupFinder(); } catch (e) { console.warn("[setupFinder]", e); }

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
