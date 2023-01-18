import {JobHelpers} from 'graphile-worker';
import {getDistanceToKult} from '../queries/distanceToKult';
import prismaClient from '../utils/prismaClient';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const application = await prismaClient.bandApplication.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const data = await getDistanceToKult(application.city, true);

  await prismaClient.bandApplication.update({
    data: {
      ...data,
    },
    where: {
      id,
    },
  });
}
