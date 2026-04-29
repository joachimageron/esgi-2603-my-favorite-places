# Build stage
FROM node:lts-alpine AS build-stage

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build
RUN pnpm prune --prod

# Production stage
FROM node:lts-alpine AS production-stage

WORKDIR /app

COPY package.json ./
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
