FROM node:lts-alpine

LABEL org.opencontainers.image.source=https://github.com/aleygues/esgi-2603-my-favorite-places
LABEL org.opencontainers.image.description="MFP Server"
LABEL org.opencontainers.image.licenses=MIT

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]