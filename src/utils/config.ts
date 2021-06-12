import prismaClient from './prismaClient';
import {ConfigKey} from '@prisma/client';

const intValues = [
  // add values that should be parsed as int here
  ConfigKey.CAPACITY_LIMIT,
] as const;

type Key = keyof typeof ConfigKey;
type IntKey = typeof intValues[number];
type StringKey = Exclude<Key, IntKey>;

type Config = {
  [key in StringKey]: string;
} &
  {
    [key in IntKey]: number;
  };

let data: Config | null = null;
let updateInterval = null;

export async function initConfig() {
  const configs = await prismaClient.config.findMany({});

  data = Object.values(ConfigKey).reduce((acc, key) => {
    const c = configs.find((c) => c.key === key);
    if (c == null) {
      throw new Error(`Config value for key ${key} not set in database`);
    }
    acc[key] = key ? parseInt(c.value, 10) : c.value;
    return acc;
  }, {} as any);

  // update regularly to get new config values without restarting the application
  updateInterval = setInterval(initConfig, 60000);
}

export function getConfig(key: Key) {
  if (data == null) {
    throw new Error('Config not initialized');
  }
  return data[key];
}
