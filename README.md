# api.kulturspektakel.de

## Getting started
1. Install node_modules using `yarn`
1. Get secrets by running `yarn generate:env` or manually creating a `.env` file in the root of the directory containing all secrets
1. Generate Prisma fixtures `yarn generate:prisma`
1. Tunnel the production database to your local machine `ssh -L 5432:localhost:5432 kultursp@kulturspektakel.de`

## Running the server
1. Run the app using `yarn dev`
1. Access GraphiQL at `http://localhost:4000/graphql` in your browser

## Running scripts
1. `yarn ts-node scripts/myScript.ts`
