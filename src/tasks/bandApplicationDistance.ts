import {JobHelpers} from 'graphile-worker';
import {getDistanceToKult, getPlace} from '../queries/distanceToKult';
import prismaClient from '../utils/prismaClient';

export default async function ({id}: {id: string}, {logger}: JobHelpers) {
  const application = await prismaClient.bandApplication.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const data = await getPlace(application.city);
  if (data) {
    const distance = await getDistanceToKult(data.placeId);
    await prismaClient.bandApplication.update({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        distance,
      },
      where: {
        id,
      },
    });
  }
}
