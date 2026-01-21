FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/odds-service ./services/odds-service

RUN yarn install --frozen-lockfile
RUN yarn workspace odds-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/odds-service/package.json ./services/odds-service/package.json
COPY --from=builder /usr/src/app/services/odds-service/dist ./services/odds-service/dist

EXPOSE 3000
CMD ["node", "services/odds-service/dist/main.js"]
