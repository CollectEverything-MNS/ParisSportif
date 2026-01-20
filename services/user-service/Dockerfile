FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/user-service ./services/user-service

RUN yarn install --frozen-lockfile
RUN yarn workspace user-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/user-service/package.json ./services/user-service/package.json
COPY --from=builder /usr/src/app/services/user-service/dist ./services/user-service/dist

EXPOSE 3000
CMD ["node", "services/user-service/dist/main.js"]
