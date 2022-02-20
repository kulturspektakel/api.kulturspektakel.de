#!/bin/bash
set -e

cd /var/www/virtual/kultursp/api.kulturspektakel.de

yarn install --production

yarn dotenv-cli pull production
yarn dotenv-cli pull
# Merging production env with dev env to override values
echo "" >> .env # add new line
cat .env.production >> .env

yarn generate:prisma

supervisorctl restart api