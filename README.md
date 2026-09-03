# Seoul Estate AI Prototype

서울 아파트 실거래, 신고가, 토지거래허가구역과 갈아타기 후보를 한 화면에서 확인하는 React MVP입니다.

## 실행

의존성을 설치하고 React 개발 서버와 API 서버를 함께 실행합니다.

```bash
npm install
npm run dev
```

- 웹: `http://localhost:5173`
- API: `http://localhost:3100`
- 프로덕션 빌드: `npm run build`
- 빌드 후 실행: `npm start`

`.env`에 `MOLIT_API_KEY`를 설정하지 않으면 기본 화면은 샘플 실거래로 동작합니다.

## 프런트엔드 구조

```text
src/
  components/   화면 단위 React 컴포넌트
  data/         샘플 폴백 데이터
  hooks/        실거래 데이터 상태와 수명주기
  services/     API 및 브라우저 캐시
  App.jsx       화면 조합과 공통 선택 상태
  main.jsx      React 진입점
```

기존 `app.js`는 마이그레이션 비교용 레거시 파일이며 브라우저에서 로드하지 않습니다.

## 현재 범위

- 서울 실거래 샘플 데이터 기반 검색
- 예산·지역·면적·준공연도 기반 검색
- 신고가 판정
- 토지거래허가구역 거래와 단지 상세
- 지역별 거래 활성도와 호가 흐름
- 갈아타기 후보 단지별 국토교통부 실거래 API 매칭
- AppFolio 스타일을 참고한 화이트/스카이 블루 카드 UI

## 다음 단계

- 서울 열린데이터광장 API 수집 배치
- DuckDB-Wasm 또는 SQLite-Wasm 로컬 저장소
- WebLLM/Transformers.js 기반 브라우저 내 LLM 검색비서
- 구/동/단지별 실거래 Parquet 데이터 다운로드

## API

- `GET /api/transactions`: 서울 25개 구 최근 실거래
- `GET /api/candidate-transactions?months=12`: 갈아타기 후보 단지 실거래 매칭
