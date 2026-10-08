// ════════════════════════════════════════════════════════════════
// 정권별 아파트 상승률 비교 — 프론트엔드
// 이 파일은 서버가 준 실데이터만 그린다. 값이 없으면 "데이터 없음"을
// 표시할 뿐, 어떤 숫자도 화면단에서 만들어내지 않는다.
// ════════════════════════════════════════════════════════════════

const LS_COMPARE = "regimeCompareListV1"; // [{id, areaKey, name, district, dong}]
const LS_BASE = "regimeBaseKeyV1";        // "id::areaKey"

const SERIES_COLORS = ["#15aef4", "#f43f5e", "#f59e0b", "#22c55e", "#a855f7", "#0ea5e9", "#84cc16", "#ec4899", "#6366f1", "#14b8a6"];
// 정권 구간은 어느 차트에서든 항상 같은 색으로 — 트렌드 차트의 배경 밴드 색과도 맞춤
const WINDOW_COLORS = { moon: "#f59e0b", yoon: "#15aef4", lee: "#22c55e" };
function windowColor(id, fallbackIdx) { return WINDOW_COLORS[id] || SERIES_COLORS[fallbackIdx % SERIES_COLORS.length]; }

// 프리셋 — 이름/지역 힌트만 담는다. 실제 수치는 검색 결과(=실데이터)에서만 가져온다.
const PRESETS = [
  { name: "상계한양", district: "노원구", dong: "상계동", base: true },
  { name: "상계주공6단지", district: "노원구", dong: "상계동" },
  { name: "상계주공4단지", district: "노원구", dong: "상계동" },
  { name: "광장현대", district: "광진구", dong: "광장동" },
  { name: "남산타운", district: "중구", dong: "신당동" },
  { name: "행당대림", district: "성동구", dong: "행당동" },
  { name: "금호두산", district: "성동구", dong: "금호동" },
  { name: "신당동삼성", district: "중구", dong: "신당동" },
  { name: "강변현대프라임", district: "광진구", dong: "구의동" },
  { name: "풍납현대", district: "송파구", dong: "풍납동" },
];

const state = {
  tab: "search",
  districts: [],
  compareList: loadCompareList(),
  baseKey: localStorage.getItem(LS_BASE) || null,
  detailCache: new Map(), // "id::areaKey" 무관, id -> full complex detail (모든 areaBuckets 포함)
};

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function escapeHtml(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function fmtEok(manwon) {
  if (manwon == null) return "데이터 없음";
  const eok = manwon / 10000;
  return eok >= 1 ? `${Math.round(eok * 10) / 10}억` : `${manwon.toLocaleString("ko-KR")}만`;
}
function fmtPct(pct) { return pct == null ? null : `${pct > 0 ? "+" : ""}${pct}%`; }
function keyOf(id, areaKey) { return `${id}::${areaKey}`; }

// regime-service.js 의 normalizeComplexName/bestMatch 와 동일한 로직 (서버 모듈은 브라우저에서 import 불가해 소규모 재구현)
function normName(value) {
  return String(value ?? "").replace(/\([^)]*\)/g, "").replace(/[·.\-_\s]/g, "").trim();
}
function pickBestMatch(results, query) {
  if (!results?.length) return null;
  const q = normName(query);
  const score = (c) => {
    const name = normName(c.name);
    const exact = name === q ? 1000 : 0;
    const totalTx = (c.areaBuckets ?? []).reduce((s, b) => s + (b.txCount ?? 0), 0);
    const closeness = 100 - Math.abs(q.length - name.length);
    return exact + closeness + Math.min(50, totalTx);
  };
  return [...results].sort((a, b) => score(b) - score(a))[0];
}

/* ── localStorage ── */
function loadCompareList() {
  try { return JSON.parse(localStorage.getItem(LS_COMPARE) || "[]"); } catch { return []; }
}
function saveCompareList() { localStorage.setItem(LS_COMPARE, JSON.stringify(state.compareList)); }

/* ── API ── */
async function apiSearch(params) {
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v)));
  const res = await fetch(`/api/regime-search?${qs}`);
  return res.json();
}
async function apiComplex(id) {
  if (state.detailCache.has(id)) return state.detailCache.get(id);
  const res = await fetch(`/api/regime-complex?id=${encodeURIComponent(id)}`);
  const json = await res.json();
  if (json.available) state.detailCache.set(id, json);
  return json;
}

/* ── 지역 목록 로드 ── */
async function loadDistricts() {
  try {
    const raw = await fetch("/data/lawd_codes.json").then((r) => r.json());
    const districts = [];
    for (const [city, entries] of Object.entries(raw)) {
      if (city.startsWith("_")) continue;
      districts.push(...Object.keys(entries));
    }
    state.districts = districts;
    for (const sel of $all("#rgDistrictSelect, #rgModalDistrictSelect")) {
      sel.innerHTML = `<option value="">전체 지역</option>` + districts.map((d) => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("");
    }
  } catch { /* 지역 목록 로드 실패해도 검색 자체는 가능(전체 지역으로) */ }
}

/* ── 데이터 가용성 배너 ── */
async function refreshStatusBanner() {
  const json = await apiSearch({});
  const el = $("#rgStatus");
  if (!json.available) {
    el.className = "rg-status warn";
    el.textContent = json.message || "아직 수집된 데이터가 없습니다.";
  } else {
    el.className = "rg-status ok";
    const at = json.generatedAt ? new Date(json.generatedAt).toLocaleString("ko-KR") : "";
    el.textContent = `실거래 데이터 준비됨 — 단지 ${json.count ?? 0}건 이상 검색 가능${at ? ` · ${at} 기준` : ""}`;
  }
  return json.available;
}

/* ── 검색 결과 렌더 ── */
function resultCardHtml(c, { compact = false } = {}) {
  const buckets = c.areaBuckets.map((b) => {
    const already = state.compareList.some((x) => x.id === c.id && x.areaKey === b.key);
    return `<button type="button" class="rg-bucket-chip ${already ? "added" : ""}" data-add-id="${escapeHtml(c.id)}" data-add-area="${escapeHtml(b.key)}"
      data-add-name="${escapeHtml(c.name)}" data-add-district="${escapeHtml(c.district)}" data-add-dong="${escapeHtml(c.dong)}" ${already ? "disabled" : ""}>
      ${escapeHtml(b.label)} <em>${b.txCount}건</em>
      <small>${b.latestPrice != null ? fmtEok(b.latestPrice) : "데이터 없음"}</small>
      <span class="rg-chip-add">${already ? "추가됨" : "+ 추가"}</span>
    </button>`;
  }).join("");

  return `<article class="rg-result-card">
    <div class="rg-result-head">
      <h3>${escapeHtml(c.name)}</h3>
      <span class="rg-result-meta">${escapeHtml(c.district)} ${escapeHtml(c.dong)}${c.buildYear ? ` · ${c.buildYear}년` : ""}</span>
    </div>
    <div class="rg-bucket-list">${buckets}</div>
  </article>`;
}

function renderResults(container, json) {
  if (!json.available) {
    container.innerHTML = `<div class="rg-empty">${escapeHtml(json.message || "아직 수집된 데이터가 없습니다.")}</div>`;
    return;
  }
  if (!json.results?.length) {
    container.innerHTML = `<div class="rg-empty">검색 결과가 없어요. 다른 이름·지역으로 검색해보세요.<br><small>이 지역이 아직 수집되지 않았을 수도 있습니다.</small></div>`;
    return;
  }
  container.innerHTML = json.results.map((c) => resultCardHtml(c)).join("");
}

async function runSearch({ district, q }, container) {
  container.innerHTML = `<div class="rg-empty">검색 중…</div>`;
  const json = await apiSearch({ district, q });
  renderResults(container, json);
}

/* ── 비교 목록 추가/삭제 ── */
function addToCompare({ id, areaKey, name, district, dong }) {
  if (state.compareList.some((x) => x.id === id && x.areaKey === areaKey)) return;
  state.compareList.push({ id, areaKey, name, district, dong });
  if (!state.baseKey) state.baseKey = keyOf(id, areaKey);
  saveCompareList();
  localStorage.setItem(LS_BASE, state.baseKey);
  updateCompareCount();
}
function removeFromCompare(id, areaKey) {
  state.compareList = state.compareList.filter((x) => !(x.id === id && x.areaKey === areaKey));
  saveCompareList();
  if (state.baseKey === keyOf(id, areaKey)) {
    state.baseKey = state.compareList[0] ? keyOf(state.compareList[0].id, state.compareList[0].areaKey) : null;
    if (state.baseKey) localStorage.setItem(LS_BASE, state.baseKey); else localStorage.removeItem(LS_BASE);
  }
  updateCompareCount();
  renderCompareTab();
}
function setBase(id, areaKey) {
  state.baseKey = keyOf(id, areaKey);
  localStorage.setItem(LS_BASE, state.baseKey);
  renderCompareTab();
}
function updateCompareCount() { $("#rgCompareCount").textContent = String(state.compareList.length); }

/* ── 프리셋 ── */
async function loadPreset() {
  const btn = $("#rgPresetBtn");
  const statusEl = $("#rgPresetStatus");
  btn.disabled = true;
  btn.textContent = "검색 중…";
  statusEl.hidden = true;

  const notFound = [];
  const added = [];
  for (const p of PRESETS) {
    const json = await apiSearch({ district: p.district, dong: p.dong, q: p.name });
    const candidates = json.available ? (json.results ?? []) : [];
    const match = pickBestMatch(candidates, p.name);
    if (!match || !match.areaBuckets?.length) { notFound.push(p.name); continue; }
    // 거래건수가 가장 많은 평형을 대표로 선택
    const bucket = [...match.areaBuckets].sort((a, b) => b.txCount - a.txCount)[0];
    addToCompare({ id: match.id, areaKey: bucket.key, name: match.name, district: match.district, dong: match.dong });
    if (p.base) setBase(match.id, bucket.key);
    added.push(`${p.name}(→${match.name})`);
  }

  btn.disabled = false;
  btn.textContent = "기본 프리셋 불러오기 (상계한양 외 9곳)";

  statusEl.hidden = false;
  const parts = [];
  if (added.length) parts.push(`<strong>${added.length}곳 추가됨</strong>: ${escapeHtml(added.join(", "))}`);
  if (notFound.length) parts.push(`<span class="rg-preset-missing">데이터 없음(수집 전) — ${escapeHtml(notFound.join(", "))}</span>`);
  statusEl.innerHTML = parts.join("<br>") || "추가된 단지가 없습니다.";

  if (added.length) switchTab("compare");
}

/* ── 탭 전환 ── */
function switchTab(tab) {
  state.tab = tab;
  $all(".rg-tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
  $("#rgSearchPanel").hidden = tab !== "search";
  $("#rgComparePanel").hidden = tab !== "compare";
  if (tab === "compare") renderCompareTab();
}

/* ── 비교하기 탭 렌더 ── */
function compareCardHtml(item, detail) {
  const isBase = state.baseKey === keyOf(item.id, item.areaKey);
  const bucket = detail?.complex?.areaBuckets?.find((b) => b.key === item.areaKey);
  const latest = bucket?.latestPrice != null ? fmtEok(bucket.latestPrice) : "데이터 없음";
  const bucketLabel = bucket?.label ?? item.areaKey;
  return `<article class="rg-compare-card ${isBase ? "is-base" : ""}">
    ${isBase ? `<span class="rg-base-badge">기준 단지</span>` : ""}
    <h3>${escapeHtml(item.name)}</h3>
    <p class="rg-result-meta">${escapeHtml(item.district)} ${escapeHtml(item.dong)} · ${escapeHtml(bucketLabel)}</p>
    <div class="rg-card-price">${latest}</div>
    <div class="rg-card-actions">
      ${isBase ? "" : `<button type="button" class="rg-btn-ghost" data-base-id="${escapeHtml(item.id)}" data-base-area="${escapeHtml(item.areaKey)}">기준으로 지정</button>`}
      <button type="button" class="rg-btn-ghost danger" data-remove-id="${escapeHtml(item.id)}" data-remove-area="${escapeHtml(item.areaKey)}">삭제</button>
    </div>
  </article>`;
}

async function renderCompareTab() {
  updateCompareCount();
  const cardsEl = $("#rgCompareCards");
  const chartsWrap = $("#rgChartsWrap");

  if (!state.compareList.length) {
    cardsEl.innerHTML = `<div class="rg-empty">아직 추가한 아파트가 없어요. [검색] 탭이나 [+ 아파트 추가]로 비교할 단지를 담아보세요.</div>`;
    chartsWrap.hidden = true;
    return;
  }

  cardsEl.innerHTML = state.compareList.map((item) => compareCardHtml(item, null)).join(""); // 우선 스켈레톤

  const details = await Promise.all(state.compareList.map((item) => apiComplex(item.id)));
  cardsEl.innerHTML = state.compareList.map((item, i) => compareCardHtml(item, details[i])).join("");

  const missing = state.compareList.filter((item, i) => !details[i]?.available);
  if (missing.length === state.compareList.length) {
    chartsWrap.hidden = true;
    cardsEl.insertAdjacentHTML("beforeend", `<div class="rg-empty">비교 목록의 단지들이 아직 수집되지 않았어요.</div>`);
    return;
  }

  chartsWrap.hidden = false;
  renderCharts(state.compareList, details);
}

/* ══════════════════ 차트 (인라인 SVG, 라이브러리 없음) ══════════════════ */
function seriesFor(item, detail) {
  const bucket = detail?.complex?.areaBuckets?.find((b) => b.key === item.areaKey);
  return { item, bucket, yearly: bucket?.yearly ?? {}, regimeGrowth: bucket?.regimeGrowth ?? [] };
}

function renderCharts(items, details) {
  const seriesList = items.map((item, i) => seriesFor(item, details[i])).filter((s) => s.bucket);
  if (!seriesList.length) return;

  renderTrendChart(seriesList);
  renderYoyHeatmap(seriesList);
  renderRegimeBars(seriesList);
  renderRelativeBars(seriesList);
}

const CURRENT_YEAR = new Date().getFullYear();
const CHART_YEARS = Array.from({ length: CURRENT_YEAR - 2016 + 1 }, (_, i) => 2016 + i);

function renderTrendChart(seriesList) {
  const W = 780, H = 320, PAD_L = 56, PAD_R = 20, PAD_T = 34, PAD_B = 34;
  const innerW = W - PAD_L - PAD_R, innerH = H - PAD_T - PAD_B;

  const allVals = seriesList.flatMap((s) => CHART_YEARS.map((y) => s.yearly[y]?.avg).filter((v) => v != null));
  const min = allVals.length ? Math.min(...allVals) : 0;
  const max = allVals.length ? Math.max(...allVals) : 1;
  const pad = (max - min) * 0.1 || max * 0.1 || 1;
  const yMin = Math.max(0, min - pad), yMax = max + pad;

  const xFor = (year) => PAD_L + ((year - CHART_YEARS[0]) / (CHART_YEARS.length - 1)) * innerW;
  const yFor = (val) => PAD_T + innerH - ((val - yMin) / (yMax - yMin || 1)) * innerH;

  // 정권 구간 배경 밴드 (첫 시리즈의 regimeGrowth 메타 사용)
  const windows = seriesList[0].regimeGrowth;
  const bandColors = { moon: "rgba(255,159,10,.10)", yoon: "rgba(21,174,244,.10)", lee: "rgba(34,197,94,.10)" };
  const bands = windows.map((w) => {
    const x1 = xFor(Math.max(w.startYear, CHART_YEARS[0]));
    const x2 = xFor(Math.min(w.endYear ?? CURRENT_YEAR, CHART_YEARS[CHART_YEARS.length - 1]));
    return `<rect x="${x1}" y="${PAD_T}" width="${Math.max(0, x2 - x1)}" height="${innerH}" fill="${bandColors[w.window] || "rgba(0,0,0,.04)"}"></rect>
      <text x="${(x1 + x2) / 2}" y="${PAD_T + 14}" text-anchor="middle" class="rg-band-label">${escapeHtml(w.label)}</text>`;
  }).join("");

  const gridY = [yMin, (yMin + yMax) / 2, yMax];
  const grid = gridY.map((v) => `<line x1="${PAD_L}" y1="${yFor(v)}" x2="${W - PAD_R}" y2="${yFor(v)}" class="rg-gridline"></line>
    <text x="${PAD_L - 8}" y="${yFor(v) + 4}" text-anchor="end" class="rg-axis-label">${fmtEok(v)}</text>`).join("");

  const xLabels = CHART_YEARS.filter((y) => y % 2 === 0 || y === CHART_YEARS[CHART_YEARS.length - 1])
    .map((y) => `<text x="${xFor(y)}" y="${H - 10}" text-anchor="middle" class="rg-axis-label">${y}</text>`).join("");

  const lines = seriesList.map((s, i) => {
    const color = SERIES_COLORS[i % SERIES_COLORS.length];
    const segs = [];
    let cur = [];
    for (const y of CHART_YEARS) {
      const v = s.yearly[y]?.avg;
      if (v == null) { if (cur.length) { segs.push(cur); cur = []; } continue; }
      cur.push(`${xFor(y)},${yFor(v)}`);
    }
    if (cur.length) segs.push(cur);
    const paths = segs.map((seg) => `<polyline points="${seg.join(" ")}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>`).join("");
    const dots = CHART_YEARS.map((y) => {
      const v = s.yearly[y]?.avg;
      if (v == null) return "";
      const warn = s.yearly[y]?.status === "표본부족";
      return `<circle cx="${xFor(y)}" cy="${yFor(v)}" r="${warn ? 4.5 : 3.5}" fill="${warn ? "#fff" : color}" stroke="${color}" stroke-width="${warn ? 2 : 0}"><title>${y}년 ${fmtEok(v)}${warn ? " (표본 부족)" : ""}</title></circle>`;
    }).join("");
    return paths + dots;
  }).join("");

  $("#rgTrendChart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="rg-svg" role="img" aria-label="연도별 실거래가 추이">${bands}${grid}${xLabels}${lines}</svg>`;
  $("#rgTrendLegend").innerHTML = seriesList.map((s, i) => `<span class="rg-legend-item"><i style="background:${SERIES_COLORS[i % SERIES_COLORS.length]}"></i>${escapeHtml(s.item.name)}</span>`).join("");
}

function yoyForSeries(s) {
  const out = {};
  for (const y of CHART_YEARS) {
    if (y === CHART_YEARS[0]) { out[y] = null; continue; }
    const cur = s.yearly[y], prev = s.yearly[y - 1];
    if (!cur || cur.avg == null || !prev || prev.avg == null) { out[y] = { pct: null, status: cur?.status ?? "미수집" }; continue; }
    const pct = Math.round(((cur.avg - prev.avg) / prev.avg) * 1000) / 10;
    out[y] = { pct, status: cur.status };
  }
  return out;
}

function heatColor(pct) {
  if (pct == null) return "var(--bg2)";
  const mag = Math.min(1, Math.abs(pct) / 30);
  return pct >= 0 ? `rgba(34,197,94,${0.12 + mag * 0.55})` : `rgba(224,53,53,${0.12 + mag * 0.55})`;
}

function renderYoyHeatmap(seriesList) {
  const years = CHART_YEARS.filter((y) => y !== CHART_YEARS[0]);
  const rows = seriesList.map((s) => {
    const yoy = yoyForSeries(s);
    const cells = years.map((y) => {
      const cell = yoy[y];
      const warn = cell?.status === "표본부족" ? ' <i class="rg-warn-icon" title="표본 3건 미만">⚠</i>' : "";
      const text = cell?.pct != null ? `${fmtPct(cell.pct)}${warn}` : `<span class="rg-nodata">데이터 부족</span>`;
      return `<td style="background:${heatColor(cell?.pct)}">${text}</td>`;
    }).join("");
    return `<tr><th>${escapeHtml(s.item.name)}<br><small>${escapeHtml(s.bucket.label)}</small></th>${cells}</tr>`;
  }).join("");
  const head = years.map((y) => `<th>${y}</th>`).join("");
  $("#rgYoyHeatmap").innerHTML = `<table class="rg-heatmap"><thead><tr><th>단지</th>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function barsGroupSvg(seriesList, valueFn, { yLabel100 = false } = {}) {
  const W = 780, H = 300, PAD_L = 56, PAD_R = 20, PAD_T = 16, PAD_B = 60;
  const innerW = W - PAD_L - PAD_R, innerH = H - PAD_T - PAD_B;
  const windows = seriesList[0].regimeGrowth.map((w) => ({ id: w.window, label: w.label }));

  const allVals = seriesList.flatMap((s) => windows.map((w) => valueFn(s, w.id))).filter((v) => v != null);
  const zero = yLabel100 ? 100 : 0;
  const maxAbs = Math.max(1, ...allVals.map((v) => Math.abs(v - zero)), yLabel100 ? Math.abs(100 - zero) : 0);
  const vMin = zero - maxAbs * 1.15, vMax = zero + maxAbs * 1.15;
  const yFor = (v) => PAD_T + innerH - ((v - vMin) / (vMax - vMin)) * innerH;
  const zeroY = yFor(zero);

  const groupW = innerW / seriesList.length;
  const barW = Math.min(22, (groupW - 12) / windows.length - 4);

  let bars = "";
  let xLabels = "";
  seriesList.forEach((s, gi) => {
    const groupX = PAD_L + gi * groupW;
    xLabels += `<text x="${groupX + groupW / 2}" y="${H - 38}" text-anchor="middle" class="rg-axis-label">${escapeHtml(s.item.name)}</text>
      <text x="${groupX + groupW / 2}" y="${H - 22}" text-anchor="middle" class="rg-axis-label rg-axis-sub">${escapeHtml(s.bucket.label)}</text>`;
    windows.forEach((w, wi) => {
      const v = valueFn(s, w.id);
      const bx = groupX + (groupW - windows.length * (barW + 4)) / 2 + wi * (barW + 4);
      const color = windowColor(w.id, wi); // 단지가 아니라 정권 구간 기준으로 색을 칠한다 (범례와 일치)
      if (v == null) {
        bars += `<rect x="${bx}" y="${zeroY - 10}" width="${barW}" height="20" fill="none" stroke="${color}" stroke-dasharray="3,3" opacity="0.5"></rect>
          <text x="${bx + barW / 2}" y="${zeroY + 24}" text-anchor="middle" class="rg-bar-nodata">산출불가</text>`;
        return;
      }
      const y1 = yFor(v), y = Math.min(y1, zeroY), h = Math.abs(y1 - zeroY);
      bars += `<rect x="${bx}" y="${y}" width="${barW}" height="${Math.max(1, h)}" fill="${color}" rx="2"><title>${escapeHtml(w.label)}: ${yLabel100 ? v + "%" : fmtPct(v)}</title></rect>
        <text x="${bx + barW / 2}" y="${v >= zero ? y - 4 : y + h + 12}" text-anchor="middle" class="rg-bar-value">${yLabel100 ? Math.round(v) : fmtPct(v)}</text>`;
    });
  });

  const zeroLine = `<line x1="${PAD_L}" y1="${zeroY}" x2="${W - PAD_R}" y2="${zeroY}" class="rg-zeroline"></line>`;
  const legend = windows.map((w, wi) => `<span class="rg-legend-item"><i style="background:${windowColor(w.id, wi)}"></i>${escapeHtml(w.label)}</span>`).join("");

  return `<svg viewBox="0 0 ${W} ${H}" class="rg-svg" role="img">${zeroLine}${bars}${xLabels}</svg><div class="rg-legend">${legend}</div>`;
}

function renderRegimeBars(seriesList) {
  $("#rgRegimeBars").innerHTML = barsGroupSvg(seriesList, (s, wid) => s.regimeGrowth.find((g) => g.window === wid)?.pct ?? null);
}

function renderRelativeBars(seriesList) {
  const baseItem = state.compareList.find((x) => keyOf(x.id, x.areaKey) === state.baseKey);
  $("#rgBaseLabel").textContent = baseItem ? `(기준: ${baseItem.name})` : "";
  if (!baseItem) { $("#rgRelativeBars").innerHTML = `<div class="rg-empty">기준 단지를 지정해주세요.</div>`; return; }
  const baseSeries = seriesList.find((s) => s.item.id === baseItem.id && s.item.areaKey === baseItem.areaKey);
  if (!baseSeries) { $("#rgRelativeBars").innerHTML = `<div class="rg-empty">기준 단지의 수집 데이터가 없어요.</div>`; return; }

  const relFor = (s, wid) => {
    const basePct = baseSeries.regimeGrowth.find((g) => g.window === wid)?.pct;
    const unitPct = s.regimeGrowth.find((g) => g.window === wid)?.pct;
    if (unitPct == null || basePct == null || basePct === 0) return null;
    return Math.round((unitPct / basePct) * 1000) / 10;
  };

  // 기준 단지 자체가 특정 정권 구간에 데이터가 없으면, 그 구간은 모든 단지의 상대지수가
  // "산출불가"가 된다(0으로 나눌 수 없으니까). 왜 비어있는지 이유를 명확히 알려준다.
  const missingBaseWindows = baseSeries.regimeGrowth.filter((g) => g.pct == null);
  const warnHtml = missingBaseWindows.length ? `<div class="rg-warn-note">
      ⚠ 기준 단지(${escapeHtml(baseItem.name)})는 <strong>${escapeHtml(missingBaseWindows.map((w) => w.label).join(", "))}</strong> 구간의
      상승률을 계산할 수 없어(해당 연도에 실거래가 없음) 이 구간의 상대지수도 모든 단지에서 "산출불가"로 표시됩니다.
      다른 단지를 기준으로 지정하면 확인할 수 있어요.
    </div>` : "";

  $("#rgRelativeBars").innerHTML = warnHtml + barsGroupSvg(seriesList, relFor, { yLabel100: true });
}

/* ── 이벤트 바인딩 ── */
function wireEvents() {
  $all(".rg-tab").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

  $("#rgSearchBtn").addEventListener("click", () => runSearch({ district: $("#rgDistrictSelect").value, q: $("#rgQueryInput").value.trim() }, $("#rgSearchResults")));
  $("#rgQueryInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#rgSearchBtn").click(); });
  $("#rgPresetBtn").addEventListener("click", loadPreset);

  $("#rgSearchResults").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-id]");
    if (!btn || btn.disabled) return;
    addToCompare({ id: btn.dataset.addId, areaKey: btn.dataset.addArea, name: btn.dataset.addName, district: btn.dataset.addDistrict, dong: btn.dataset.addDong });
    btn.classList.add("added"); btn.disabled = true; btn.querySelector(".rg-chip-add").textContent = "추가됨";
  });

  $("#rgAddBtn").addEventListener("click", () => { $("#rgModalOverlay").hidden = false; document.body.style.overflow = "hidden"; });
  $("#rgModalClose").addEventListener("click", closeModal);
  $("#rgModalOverlay").addEventListener("click", (e) => { if (e.target.id === "rgModalOverlay") closeModal(); });
  function closeModal() { $("#rgModalOverlay").hidden = true; document.body.style.overflow = ""; renderCompareTab(); }

  $("#rgModalSearchBtn").addEventListener("click", () => runSearch({ district: $("#rgModalDistrictSelect").value, q: $("#rgModalQueryInput").value.trim() }, $("#rgModalResults")));
  $("#rgModalQueryInput").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#rgModalSearchBtn").click(); });
  $("#rgModalResults").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-id]");
    if (!btn || btn.disabled) return;
    addToCompare({ id: btn.dataset.addId, areaKey: btn.dataset.addArea, name: btn.dataset.addName, district: btn.dataset.addDistrict, dong: btn.dataset.addDong });
    btn.classList.add("added"); btn.disabled = true; btn.querySelector(".rg-chip-add").textContent = "추가됨";
    updateCompareCount();
  });

  $("#rgCompareCards").addEventListener("click", (e) => {
    const rm = e.target.closest("[data-remove-id]");
    if (rm) { removeFromCompare(rm.dataset.removeId, rm.dataset.removeArea); return; }
    const base = e.target.closest("[data-base-id]");
    if (base) { setBase(base.dataset.baseId, base.dataset.baseArea); return; }
  });
}

async function init() {
  updateCompareCount();
  wireEvents();
  await loadDistricts();
  await refreshStatusBanner();
  await runSearch({}, $("#rgSearchResults"));
}

init();
