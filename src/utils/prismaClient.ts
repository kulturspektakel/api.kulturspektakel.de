import {PrismaClient} from '../../types/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import env from './env';

const instance = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_URL,
  }),
});

export default instance;
