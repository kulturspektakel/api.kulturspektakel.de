import prismaClient from '../utils/prismaClient';
import {sub} from 'date-fns';
import {JobHelpers} from 'graphile-worker';

export default async function (_: unknown, {logger}: JobHelpers) {
  const batch = await prismaClient.reservation.deleteMany({
    where: {
      status: 'Pending',
      createdAt: {
        lte: sub(new Date(), {minutes: 30}),
      },
    },
  });
  logger.info(`Removed ${batch.count} reservations`);
}
