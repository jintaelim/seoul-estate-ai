# Seoul Estate AI — Fly.io 배포용 이미지
# 상시 실행 서버(server.js)를 그대로 컨테이너로 띄운다.
# 데이터(data/cache, data/regime-index.json)는 이미지에 담지 않고
# Fly Volume을 /app/data 에 마운트해 재배포·재시작에도 남게 한다.

FROM node:20-alpine

WORKDIR /app

# 의존성만 먼저 복사해 캐시 활용 (package.json 안 바뀌면 npm ci 재실행 안 됨)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 나머지 애플리케이션 코드 복사
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
