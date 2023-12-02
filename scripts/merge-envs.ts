import path from 'path';
import {promises as fs} from 'fs';
import {parse} from 'dotenv';

const ENV_PROD_PATH = path.join(__dirname, '..', '.env.production');
const ENV_PATH = path.join(__dirname, '..', '.env');
const ENV_YML = path.join(__dirname, '..', '.env.json');

(async () => {
  const dev = await readEnv(ENV_PATH);
  const prod = await readEnv(ENV_PROD_PATH);
  const config = {...dev, ...prod};
  delete config.PORT;
  await fs.writeFile(ENV_YML, JSON.stringify(config));
  console.log('Merged configs into .env');
})();

async function readEnv(path: string) {
  const config = await (
    await fs.readFile(path)
  )
    .toString()
    .split('\n')
    // filter empty vars
    .filter((l) => !l.endsWith('=""'))
    .join('\n');
  return parse(config);
}
