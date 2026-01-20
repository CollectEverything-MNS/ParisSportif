FROM node:22-alpine AS builder
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY services/calendar-service ./services/calendar-service

RUN yarn install --frozen-lockfile
RUN yarn workspace calendar-service build
RUN yarn cache clean

FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/calendar-service/package.json ./services/calendar-service/package.json
COPY --from=builder /usr/src/app/services/calendar-service/dist ./services/calendar-service/dist

EXPOSE 3000
CMD ["node", "services/calendar-service/dist/main.js"]
