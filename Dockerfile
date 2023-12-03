FROM oven/bun:1.0.15

WORKDIR /usr/src/app
COPY package.json bun.lockb prisma/schema.prisma ./
RUN bun install --frozen-lockfile

# Install nodejs using n
RUN apt-get -y update; apt-get -y install curl
ARG NODE_VERSION=20
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY . .
RUN yarn generate:prisma
CMD ["bun", "run", "index.ts"]