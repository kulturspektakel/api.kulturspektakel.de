#!/bin/bash
set -e

yarn install --production
yarn generate:prisma
supervisorctl restart api