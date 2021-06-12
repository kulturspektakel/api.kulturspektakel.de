import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';

export default async function ({id}: {id: number}, {logger}: JobHelpers) {
  const batch = await prismaClient.reservation.deleteMany({
    where: {
      id,
      status: 'Pending',
    },
  });
  logger.info(`Removed ${batch.count} reservations`);
}
