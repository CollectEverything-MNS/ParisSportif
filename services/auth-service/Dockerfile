FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/auth-service ./services/auth-service

RUN yarn install --frozen-lockfile
RUN yarn workspace auth-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/auth-service/package.json ./services/auth-service/package.json
COPY --from=builder /usr/src/app/services/auth-service/dist ./services/auth-service/dist

EXPOSE 3000
CMD ["node", "services/auth-service/dist/main.js"]
