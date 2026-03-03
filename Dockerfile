FROM node:20-alpine AS base
RUN apk add --no-cache libc-dev

FROM base AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY packages/server/package*.json packages/server/
COPY packages/web/package*.json packages/web/
RUN npm install

COPY packages/server packages/server
COPY packages/web packages/web
COPY tsconfig.json package.json ./

RUN npm run build

FROM base AS production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/packages/server/dist packages/server/dist
COPY --from=builder /app/packages/web/dist packages/web/dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "packages/server/dist/index.js"]
