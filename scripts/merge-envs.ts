import dotenv from 'dotenv';
import path from 'path';

const {parsed: conf} = dotenv.config();
const {parsed: confProduction} = dotenv.config({
  path: path.resolve(process.cwd(), '.env.production'),
});

console.log(
  Object.fromEntries(Object.entries(confProduction).filter(([, v]) => v)),
);

// console.log({
//   ...conf,
//   // filter null values
//   ...Object.fromEntries(Object.entries(confProduction).filter(([, v]) => v)),
// });

// TODO write .env file

// TODO validate with utils/env.ts else throw error
