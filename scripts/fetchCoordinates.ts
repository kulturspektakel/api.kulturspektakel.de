require('dotenv').config();

import prismaClient from '../src/utils/prismaClient';
import {getDistanceToKult} from '../src/queries/distanceToKult';

(async () => {
  const applications = await prismaClient.bandApplication.findMany({
    where: {
      AND: {
        distance: {
          not: null,
        },
        latitude: null,
      },
    },
  });

  for (const application of applications) {
    const data = await getDistanceToKult(application.city, true);
    console.log(application.bandname, data);
    if (data?.latitude) {
      await prismaClient.bandApplication.update({
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        where: {
          id: application.id,
        },
      });
    }
  }
})();
