cd /var/www/virtual/kultursp/api.kulturspektakel.de
yarn install --production
yarn generate:prisma
yarn dotenv-cli pull production
yarn dotenv-cli pull
# Merging production env with dev env to override values
cat .env.production >> .env
supervisorctl restart api