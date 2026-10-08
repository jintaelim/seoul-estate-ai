# Seoul Estate AI Prototype

서울 아파트 실거래, 신고가, 토지거래허가구역과 갈아타기 후보를 한 화면에서 확인하는 React MVP입니다.

## 실행

의존성을 설치하고 React 개발 서버, 조회 API, 수집 워커를 각각 분리해 실행합니다.

```bash
npm install
npm run dev
```

- 웹: `http://localhost:5173`
- API: `http://localhost:3100`
- 프로덕션 빌드: `npm run build`
- 빌드 후 실행: `npm start`
- 수집 워커만 실행: `npm run worker`
- 수집 없이 화면과 API만 개발: `npm run dev:web`

`.env`의 `MOLIT_API_KEY`로 실제 데이터를 수집합니다. 연결 실패 시 저장된 원장과 오류를 표시하며 샘플을 실거래로 사용하지 않습니다. 파일을 직접 열지 말고 서버 주소로 접속하세요.

실제 연결 검증 및 남은 설정은 [데이터 검증 기록](docs/data-verification.md)을 참고하세요.

## 프런트엔드 구조

```text
src/
  components/   화면 단위 React 컴포넌트
  data/         서울 행정구역 등 정적 기준 데이터
  hooks/        저장 원장과 단지 검색 상태
  services/     API 및 브라우저 캐시
  App.jsx       화면 조합과 공통 선택 상태
  main.jsx      React 진입점
```

기존 `app.js`는 마이그레이션 비교용 레거시 파일이며 브라우저에서 로드하지 않습니다.

## 현재 범위

- 서울 25개 구 최근 3개월 매매·전월세 저장 원장
- 예산·지역·면적·준공연도 기반 검색과 최근 전세 비교
- 신고가 판정
- 단지 상세와 동일 면적 매매·전세 거래 이력
- 지역별 거래 활성도 (호가 공급원 미연결)
- 갈아타기 후보 단지별 국토교통부 실거래 API 매칭
- AppFolio 스타일을 참고한 화이트/스카이 블루 카드 UI

## API

저장형 원장 수집·조회 구조와 운영 적용 절차는 [저장소 구축 안내](docs/storage-rollout.md)를 참고하세요. 매매·전월세·토지허가 조회는 사용자 요청 중 외부 수집을 실행하지 않으며, 수집 작업과 화면 조회를 분리합니다. 운영에서는 Vercel Cron이 수집하고 사용자는 Supabase 저장 원장과 CDN 캐시만 조회합니다.

- `GET /api/transactions?page=1&limit=50`: 서울 25개 구 최근 실거래 페이지 조회
- `GET /api/rent-transactions`: 저장된 전월세 원장 필터 조회
- `GET /api/apartment-search?keyword=잠실&district=송파구&page=1`: 경량 단지 검색
- `GET /api/market-summary?dataset=transactions`: 날짜·자치구 집계
- `GET /api/candidate-transactions?months=12`: 갈아타기 후보 단지 실거래 매칭
