#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// 국토부 실거래가 수집 CLI — 정권별 비교 대시보드용 원본 캐시 생성
//
// 사용법:
//   node scripts/collect-regime-transactions.mjs
//   node scripts/collect-regime-transactions.mjs --districts=강남구,서초구 --from=202001 --to=202512
//   node scripts/collect-regime-transactions.mjs --force        (캐시 무시하고 재수집)
//
// 원칙: 실패한 지역·월은 절대 값을 지어내지 않고 "수집 실패"로 남긴다.
//       다시 이 스크립트를 실행하면 실패했던 부분만 재시도된다(성공분은 캐시 스킵).
//
// 매일 자동 갱신은 이 CLI가 아니라 서버(server.js)가 내부에서 직접
// collectRegimeTransactions() 를 호출해 수행한다. 이 스크립트는 수동 실행용.
// ════════════════════════════════════════════════════════════════
import { loadDotEnv, loadLawdCodes, currentYm, COLLECTION_START_YM, collectRegimeTransactions } from "../regime-service.js";

loadDotEnv();
const SERVICE_KEY = process.env.MOLIT_API_KEY;

function parseArgs(argv) {
  const out = { concurrency: 3, delayMs: 300 };
  for (const a of argv) {
    const m = a.match(/^--([a-zA-Z-]+)(?:=(.*))?$/);
    if (!m) continue;
    const key = m[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = m[2] ?? true;
  }
  return out;
}

async function main() {
  if (!SERVICE_KEY) {
    console.error("\n✖ MOLIT_API_KEY 가 설정되지 않았습니다.\n");
    console.error("  1) https://www.data.go.kr 에서 \"국토교통부_아파트 매매 실거래자료\" 검색");
    console.error("  2) 활용신청(무료) → 마이페이지에서 \"일반 인증키(Decoding)\" 복사");
    console.error("  3) 프로젝트 루트 .env 파일에 아래 줄 추가:");
    console.error("       MOLIT_API_KEY=발급받은_디코딩_키\n");
    console.error("  키 없이는 실거래 수집이 불가능합니다. (샘플/추정 데이터로 대체하지 않습니다)\n");
    process.exit(1);
  }

  const args = parseArgs(process.argv.slice(2));
  const { flat } = loadLawdCodes();
  const districts = args.districts
    ? String(args.districts).split(",").map((s) => s.trim()).filter(Boolean)
    : Object.keys(flat);

  const unknown = districts.filter((d) => !flat[d]);
  if (unknown.length) {
    console.error(`✖ data/lawd_codes.json 에 없는 지역: ${unknown.join(", ")}`);
    console.error("  해당 지역의 법정동코드를 data/lawd_codes.json 에 먼저 추가하세요.");
    process.exit(1);
  }

  const from = args.from || COLLECTION_START_YM;
  const to = args.to || currentYm();
  const force = !!args.force;

  console.log(`\n지역 ${districts.length}개 (${from} ~ ${to})`);
  console.log(force ? "(--force: 캐시 무시하고 전부 재수집)\n" : "(이미 캐시된 항목은 건너뜁니다)\n");

  const result = await collectRegimeTransactions({
    serviceKey: SERVICE_KEY, districts, from, to, force,
    concurrency: Number(args.concurrency), delayMs: Number(args.delayMs),
    onProgress: ({ done, total, district, ym, status, count, error }) => {
      const label = status === "ok" ? `OK (${count}건)` : status === "skipped" ? "스킵(캐시됨)" : `실패: ${error}`;
      process.stdout.write(`\r[${done}/${total}] ${district} ${ym} ${label}                    ${status === "failed" ? "\n" : ""}`);
    },
  });

  console.log(`\n\n완료 — 성공 ${result.ok} · 스킵(캐시됨) ${result.skipped} · 실패 ${result.failed}`);
  if (result.failures.length) {
    console.log("\n실패 목록 (다시 이 스크립트를 실행하면 이 항목들만 재시도됩니다):");
    for (const f of result.failures.slice(0, 30)) console.log(`  - ${f.district} ${f.ym}: ${f.error}`);
    if (result.failures.length > 30) console.log(`  ... 외 ${result.failures.length - 30}건`);
  }
  console.log(`\n다음 단계: node scripts/build-regime-index.mjs 를 실행해 대시보드용 인덱스를 생성하세요.\n`);
}

main().catch((err) => { console.error("치명적 오류:", err); process.exit(1); });
