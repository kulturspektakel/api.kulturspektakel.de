FROM oven/bun:1.0.15

WORKDIR /usr/src/app
COPY package.json bun.lockb prisma/schema.prisma ./
RUN bun install --frozen-lockfile
RUN yarn generate:prisma
COPY . .
CMD ["bun", "run", "index.ts"]