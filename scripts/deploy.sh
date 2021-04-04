#!/bin/bash

set -e
HOST="kultursp@kulturspektakel.de"
DIR="/var/www/virtual/kultursp/api.kulturspektakel.de"

cd "$(dirname "$0")/.."
rm -rf dist
yarn build
rsync -avz --delete dist prisma package.json yarn.lock $HOST:$DIR
ssh $HOST "cd $DIR; yarn install --production; yarn generate:prisma; supervisorctl restart api"
