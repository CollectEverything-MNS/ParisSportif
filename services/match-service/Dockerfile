FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/match-service ./services/match-service

RUN yarn install --frozen-lockfile
RUN yarn workspace match-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/match-service/package.json ./services/match-service/package.json
COPY --from=builder /usr/src/app/services/match-service/dist ./services/match-service/dist

EXPOSE 3000
CMD ["node", "services/match-service/dist/main.js"]
