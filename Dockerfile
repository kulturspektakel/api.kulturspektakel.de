FROM oven/bun:1.3.1

WORKDIR /usr/src/app
COPY package.json bun.lock prisma ./
RUN bun install --frozen-lockfile

COPY --from=node:20 /usr/local/bin/node /usr/local/bin/node

COPY . .
RUN bun generate:prisma

CMD ["bun", "run", "src/index.ts"]
