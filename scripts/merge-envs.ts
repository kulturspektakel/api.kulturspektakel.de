import path from 'path';
import {promises as fs} from 'fs';
import {parse} from '@dotenvx/dotenvx';

const ENV_PATH = path.join(__dirname, '..', '.env');
const ENV_YML = path.join(__dirname, '..', '.env.json');

(async () => {
  const config = await readEnv(ENV_PATH);
  delete config.PORT;
  await fs.writeFile(ENV_YML, JSON.stringify(config));
  console.log('Created .env.json');
})();

async function readEnv(path: string) {
  const config = (await fs.readFile(path))
    .toString()
    .split('\n')
    // filter empty vars
    .filter((l) => !l.endsWith('=""'))
    .join('\n');
  return parse(config);
}
