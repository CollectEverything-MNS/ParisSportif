FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY services/auth-service/package.json ./package.json
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
RUN yarn cache clean

FROM node:22-alpine AS runner

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
