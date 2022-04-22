import path from 'path';
import {promises as fs} from 'fs';
import {parse} from 'dotenv';

const ENV_PROD_PATH = path.join(__dirname, '..', '.env.production');
const ENV_PATH = path.join(__dirname, '..', '.env');

(async () => {
  const prod = await (
    await fs.readFile(ENV_PROD_PATH)
  )
    .toString()
    .split('\n')
    // filter empty vars
    .filter((l) => !l.endsWith('=""'));

  // adding new line
  prod.unshift('');
  await fs.appendFile(ENV_PATH, prod.join('\n'));

  const conf = await fs.readFile(ENV_PATH);
  process.env = {
    ...process.env,
    ...parse(conf),
  };
  require('../src/utils/env'); // validate env is correct
  await fs.unlink(ENV_PROD_PATH);
  console.log('Merged configs into .env');
})();
