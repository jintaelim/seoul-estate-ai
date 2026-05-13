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

const moneyFormatter = new Intl.NumberFormat("ko-KR");

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
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  thread.appendChild(message);
  thread.scrollTop = thread.scrollHeight;
}

function renderMetrics() {
  document.getElementById("metricDeals").textContent = transactions.length;
  document.getElementById("metricRecords").textContent = transactions.filter(isRecord).length;
  document.getElementById("metricPermits").textContent = permitTransactions().length;
}

function renderDistricts() {
  const grid = document.getElementById("districtGrid");
  grid.innerHTML = "";
  districts.forEach((district) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = district;
    button.className = district === state.selectedDistrict ? "active" : "";
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
  const today = latestDealDate();
  const list = document.getElementById("transactionList");
  const rows = transactions
    .filter((item) => item.dealDate === today)
    .sort((a, b) => state.sortHighFirst ? b.price - a.price : a.price - b.price)
    .slice(0, 10);

  list.innerHTML = rows.length ? rows.map((item) => `
    <button class="transaction-row detail-trigger" type="button" data-detail-id="${item.id}" data-detail-context="transaction" aria-label="${item.complex} 실거래 상세 보기">
      <div>
        <h3>${item.complex}</h3>
        <p>${item.district} ${item.dong} · 전용 ${item.area.toFixed(1)}㎡ · ${item.floor}층</p>
      </div>
      <div class="amount">${formatPrice(item.price)}</div>
    </button>
  `).join("") : `<div class="transaction-row"><div><h3>${today} 실거래 없음</h3><p>데이터가 아직 집계 중이거나 오늘 거래가 없습니다.</p></div></div>`;
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
  const grid = document.getElementById("districtActivityGrid");
  if (!grid) return;
  const data = getDistrictActivity();
  const labelMap = { hot: "활발", mid: "보통", low: "조용" };
  grid.innerHTML = data.map(({ district, count, ratio, level }) => `
    <button class="dac ${level}" type="button" data-activity-district="${district}" aria-label="${district} 거래 현황 보기">
      <div class="dac-top">
        <span class="dac-name">${district}</span>
        <span class="dac-badge ${level}">${labelMap[level]}</span>
      </div>
      <div class="dac-count"><strong>${count}</strong><small>건</small></div>
      <div class="dac-bar-wrap"><span class="dac-bar ${level}" style="width:${Math.max(6, Math.round(ratio * 100))}%"></span></div>
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
    <div class="dd-inner">
      <div class="dd-main">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            자치구 목록
          </button>
          <span>›</span>
          <span>${district}</span>
        </div>
        <div class="dd-title-row">
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
              `).join("") : `<div class="dd-top-item" style="color:rgba(255,255,255,0.55)">오늘 거래 데이터 없음</div>`}
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

      <aside class="dd-sidebar">
        <div class="dd-insight-title">부동산 인사이트 더 깊게 즐기기</div>
        <div class="dd-insight-list">
          <button class="dd-insight-item" type="button">
            <span class="dd-insight-icon">📋</span>
            <div>
              <div class="dd-insight-name">이때샀으면</div>
              <div class="dd-insight-desc">과거 거래 시점 대비 현재 수익률을 계산해 보세요.</div>
            </div>
          </button>
          <button class="dd-insight-item" type="button">
            <span class="dd-insight-icon">📊</span>
            <div>
              <div class="dd-insight-name">통합분석</div>
              <div class="dd-insight-desc">최대 3개 단지의 실거래가, 허가내역, AI 예측을 통합 분석합니다.</div>
            </div>
          </button>
          <button class="dd-insight-item" type="button">
            <span class="dd-insight-icon">🏆</span>
            <div>
              <div class="dd-insight-name">면적별 최고가 단지</div>
              <div class="dd-insight-desc">전용면적 기준 ${district}의 면적별 최고가 단지를 확인하세요.</div>
            </div>
          </button>
        </div>
      </aside>
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
  const today = latestDealDate();
  const todayRecords = transactions
    .filter(isRecord)
    .filter((t) => t.dealDate === today)
    .sort((a, b) => recordIncrease(b) - recordIncrease(a));
  const top10 = todayRecords.slice(0, 10);
  const remaining = todayRecords.length - 10;

  if (!todayRecords.length) {
    list.innerHTML = `<div class="transaction-row"><div><h3>${today} 신고가 없음</h3><p>More View에서 날짜별 신고가를 확인하세요.</p></div></div>
      <button class="more-view-btn" type="button" data-more-type="records">More View <span>날짜별 전체 보기</span></button>`;
    return;
  }

  list.innerHTML = top10.map(recordRowHtml).join("") + (remaining > 0 ? `
    <button class="more-view-btn" type="button" data-more-type="records">
      More View <span>+${remaining}건 더 보기</span>
    </button>
  ` : `<button class="more-view-btn" type="button" data-more-type="records">More View <span>날짜별 전체 보기</span></button>`);
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
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            홈으로
          </button>
          <span>›</span><span>날짜별 실거래</span>
        </div>
        <div class="dd-title-row">
          <h2 class="dd-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            날짜별 실거래 전체
          </h2>
        </div>
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
    <div class="dd-inner" style="grid-template-columns:1fr">
      <div class="dd-main">
        <div class="dd-breadcrumb">
          <button class="dd-back" type="button" id="ddBackBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 5l-7 7 7 7"/></svg>
            홈으로
          </button>
          <span>›</span><span>날짜별 토허구역</span>
        </div>
        <div class="dd-title-row">
          <h2 class="dd-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10l4 4v14H7z"/><path d="M17 3v5h4"/><path d="M3 8h4v13H3z"/></svg>
            날짜별 토지거래허가 내역
          </h2>
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
  const form = document.getElementById("assistantForm");
  const input = document.getElementById("assistantInput");
  const budget = document.getElementById("budgetRange");
  const budgetLabel = document.getElementById("budgetLabel");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    runAssistant(query);
    input.value = "";
  });

  document.querySelectorAll(".quick-prompts button").forEach((button) => {
    button.addEventListener("click", () => {
      const prompt = button.dataset.prompt;
      input.value = prompt;
      runAssistant(prompt);
    });
  });

  budget.addEventListener("input", () => {
    state.maxBudget = Number(budget.value);
    budgetLabel.textContent = `${state.maxBudget}억`;
    renderTransactions();
    renderResults([]);
  });

  document.getElementById("sortDealsButton").addEventListener("click", () => {
    state.sortHighFirst = !state.sortHighFirst;
    renderTransactions();
  });

  // 구 활성도 카드 클릭
  document.getElementById("districtActivityGrid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-activity-district]");
    if (card) openDistrictDetail(card.dataset.activityDistrict);
  });

  // 마켓 카드 메트릭 클릭 → 상세 오버레이
  document.querySelector(".metric-stack").addEventListener("click", (event) => {
    const div = event.target.closest("[data-metric-nav]");
    if (!div) return;
    const type = div.dataset.metricNav;
    if (type === "deals") openTransactionsOverlay();
    else if (type === "records") openRecordsOverlay();
    else if (type === "permits") openPermitsOverlay();
  });

  // More View 버튼 (신고가 전체 보기)
  document.body.addEventListener("click", (event) => {
    const moreBtn = event.target.closest("[data-more-type]");
    if (moreBtn) {
      if (moreBtn.dataset.moreType === "records") openRecordsOverlay();
      return;
    }
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

  document.getElementById("detailClose").addEventListener("click", closeDetail);
  document.getElementById("detailDialog").addEventListener("click", (event) => {
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
  renderTransactions();
  renderRecords();
  renderPermits();
  renderResults([]);
  renderDistrictActivity();
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
        statusEl.textContent = "샘플 데이터";
        addMessage("국토교통부 API 키가 설정되지 않아 샘플 데이터로 동작합니다. .env 파일에 MOLIT_API_KEY를 추가하세요.", "assistant");
      }
      return;
    }

    if (json.data?.length) {
      saveToStorage(json.data);
      applyTransactions(json.data);
      state.dataSource = "molit";
      const fetched = new Date(json.fetchedAt).toLocaleTimeString("ko-KR");
      statusEl.textContent = `실데이터 ${json.data.length.toLocaleString()}건`;
      addMessage(`국토교통부 실거래 데이터 ${json.data.length.toLocaleString()}건이 로드됐습니다 (${fetched} 기준). 원하는 지역, 예산, 면적, 준공연도를 말해 주세요.`, "assistant");
    }
  } catch (err) {
    if (state.dataSource !== "molit") {
      statusEl.textContent = "샘플 데이터";
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
    statusEl.textContent = `캐시 ${cached.length.toLocaleString()}건`;
    addMessage(`캐시된 실거래 데이터 ${cached.length.toLocaleString()}건을 즉시 로드했습니다. 백그라운드에서 최신 데이터를 확인 중입니다.`, "assistant");
    fetchAndUpdateCache(statusEl); // 백그라운드 갱신, await 없음
    return;
  }

  statusEl.textContent = "데이터 로딩 중…";
  await fetchAndUpdateCache(statusEl);
}

async function init() {
  state.selectedPermitDate = latestDealDate();
  renderMetrics();
  renderDistricts();
  renderTransactions();
  renderRecords();
  renderPermits();
  renderResults([]);
  renderDistrictActivity();
  wireEvents();
  addMessage("데이터를 불러오는 중입니다…", "assistant");
  await loadRealData();
}

init();
