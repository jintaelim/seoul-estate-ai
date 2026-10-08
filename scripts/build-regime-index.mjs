#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// data/cache/ 의 원본 캐시를 집계해 data/regime-index.json 생성
//
// 사용법: node scripts/build-regime-index.mjs
//
// 원칙: 캐시에 없는 연도는 "미수집"으로, 캐시는 있지만 거래가 0건인
// 연도는 "거래없음"으로 명확히 구분한다(둘 다 avg=null 이지만 status 로 구분).
// ════════════════════════════════════════════════════════════════
import { existsSync } from "fs";
import { CACHE_DIR, INDEX_PATH, buildRegimeIndex, writeRegimeIndex } from "../regime-service.js";

function main() {
  if (!existsSync(CACHE_DIR)) {
    console.log("data/cache/ 가 없습니다. 아직 수집된 데이터가 없어요.");
    console.log("→ node scripts/collect-regime-transactions.mjs 를 먼저 실행하세요.");
  }

  const index = buildRegimeIndex();
  writeRegimeIndex(index);

  if (index.complexCount) {
    console.log(`✔ ${index.complexCount}개 단지(구+평형 그룹) → ${INDEX_PATH}`);
    console.log(`  수집 커버리지: ${Object.keys(index.coverage).length}개 지역`);
  } else {
    console.log(`(빈) 인덱스를 ${INDEX_PATH} 에 생성했습니다 — 대시보드는 "데이터 없음"으로 표시됩니다.`);
  }
}

main();
