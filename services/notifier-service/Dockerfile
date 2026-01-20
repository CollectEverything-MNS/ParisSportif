FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/notifier-service ./services/notifier-service

RUN yarn install --frozen-lockfile
RUN yarn workspace notifier-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/notifier-service/package.json ./services/notifier-service/package.json
COPY --from=builder /usr/src/app/services/notifier-service/dist ./services/notifier-service/dist

CMD ["node", "services/notifier-service/dist/main.js"]
