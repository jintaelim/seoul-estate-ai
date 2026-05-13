# Seoul Estate AI Prototype

서울 아파트 실거래, 신고가, 토지거래허가구역, 온디바이스 검색비서를 한 화면에서 확인하는 정적 MVP입니다.

## 실행

`index.html`을 브라우저로 열면 바로 실행됩니다. 로컬 서버를 쓰려면 아래처럼 실행할 수 있습니다.

```bash
python3 -m http.server 5173
```

## 현재 범위

- 서울 실거래 샘플 데이터 기반 검색
- 자연어 조건 추출
- 신고가 판정
- 토지거래허가 일자별 내역과 단지 상세
- AppFolio 스타일을 참고한 화이트/스카이 블루 카드 UI

## 다음 단계

- 국토교통부/서울 열린데이터광장 API 수집 배치
- DuckDB-Wasm 또는 SQLite-Wasm 로컬 저장소
- WebLLM/Transformers.js 기반 브라우저 내 LLM 검색비서
- 구/동/단지별 실거래 Parquet 데이터 다운로드
