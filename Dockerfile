FROM node:20-alpine

WORKDIR /usr/src/app
COPY package.json yarn.lock prisma/schema.prisma ./
RUN yarn install --frozen-lockfile --production=false
RUN yarn generate:prisma
COPY . .
ENV NODE_OPTIONS --max_old_space_size=4096
RUN yarn build
CMD ["yarn", "start"]