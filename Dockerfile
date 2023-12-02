FROM node:20-slim

WORKDIR /usr/src/app
COPY package.json yarn.lock prisma/schema.prisma ./
RUN yarn install --production
RUN yarn generate:prisma
COPY . .
RUN yarn build
CMD ["yarn", "start"]