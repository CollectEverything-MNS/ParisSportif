FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/api-gateway ./services/api-gateway

RUN yarn install --frozen-lockfile
RUN yarn workspace api-gateway build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/api-gateway/package.json ./services/api-gateway/package.json
COPY --from=builder /usr/src/app/services/api-gateway/dist ./services/api-gateway/dist

EXPOSE 3000
CMD ["node", "services/api-gateway/dist/main.js"]
