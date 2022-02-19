cd /var/www/virtual/kultursp/api.kulturspektakel.de
yarn install --production
yarn generate:prisma
yarn dotenv-cli pull production
yarn dotenv-cli pull
cat .env.production >> .env
supervisorctl restart api