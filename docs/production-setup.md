# 운영 배포 준비

## 권장 구성

- 프론트엔드/API: Vercel Functions (`api/`)
- 영속 데이터: Supabase 또는 Neon PostgreSQL
- 수집: Vercel Cron으로 국토부 매매·전월세 원장 주기 수집
- 개인 저장: Supabase Auth + `saved_apartments` RLS

## 환경변수

```env
MOLIT_API_KEY=
KAKAO_REST_API_KEY=
REB_APT_API_KEY=
DATABASE_URL=
```

`supabase/schema.sql`을 먼저 실행한 뒤 `DATABASE_URL`을 Vercel 프로젝트 환경변수에 등록합니다. API 키는 브라우저 코드에 넣지 않고 Functions에서만 읽습니다.

## 단계

1. Supabase 프로젝트 생성 후 `supabase/schema.sql` 실행
2. Vercel 환경변수 등록(Preview/Production 각각)
3. 실거래 수집 함수를 DB upsert 방식으로 연결
4. Cron으로 하루 1~2회 수집
5. 사용자 로그인과 후보 저장 UI 연결
