#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// 생성된 data/regime-index.json 이 정상 상태인지 점검
//
// 사용법: node scripts/check-regime-index.mjs
// ════════════════════════════════════════════════════════════════
import { readIndex, checkRegimeIndex } from "../regime-service.js";

const index = readIndex();
if (!index) {
  console.error("✖ data/regime-index.json 이 없거나 읽을 수 없습니다.");
  process.exit(1);
}

const health = checkRegimeIndex(index);
if (!health.ok) {
  console.error("\n✖ 인덱스 점검 실패\n");
  for (const p of health.problems) console.error(`  - ${p}`);
  console.error("");
  process.exit(1);
}

console.log(`✔ 점검 통과 — 단지 ${health.complexCount}개 · 지역 ${health.districtCount}개 · 최근 거래일 ${health.newest ?? "없음"}`);
