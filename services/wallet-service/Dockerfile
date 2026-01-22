FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/wallet-service ./services/wallet-service

RUN yarn install --frozen-lockfile
RUN yarn workspace wallet-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/wallet-service/package.json ./services/wallet-service/package.json
COPY --from=builder /usr/src/app/services/wallet-service/dist ./services/wallet-service/dist

EXPOSE 3000
CMD ["node", "services/wallet-service/dist/main.js"]
