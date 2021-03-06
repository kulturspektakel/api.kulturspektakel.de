import prismaClient from '../utils/prismaClient';
import {createEvent, DateArray, EventAttributes} from 'ics';
import {PrismaClient} from '@prisma/client';
import {differenceInMinutes} from 'date-fns';
import {Router} from '@awaitjs/express';
import {ApiError} from '../utils/errorReporting';

export async function getIcs(
  prismaClient: PrismaClient,
  token: string,
): Promise<string> {
  const reservation = await prismaClient.reservation.findUnique({
    where: {
      token,
    },
    include: {
      table: {
        include: {
          area: true,
        },
      },
    },
  });
  if (!reservation) {
    throw new ApiError(404, 'Reservation not found');
  }

  const start: DateArray = [
    reservation.startTime.getUTCFullYear(),
    reservation.startTime.getUTCMonth() + 1,
    reservation.startTime.getUTCDate(),
    reservation.startTime.getUTCHours(),
    reservation.startTime.getUTCMinutes(),
  ];

  const event: EventAttributes = {
    start,
    startInputType: 'utc',
    duration: {
      minutes: differenceInMinutes(reservation.endTime, reservation.startTime),
    },
    title: `Kulturspektakel Reservierung`,
    description: `für ${reservation.otherPersons.length + 1} Personen`,
    location: reservation.table.area.displayName,
    url: `https://table.kulturspektakel.de/reservation/${reservation.token}`,
    geo: {
      lat: reservation.table.area.latitude,
      lon: reservation.table.area.longitude,
    },
    status: 'CONFIRMED',
    // @ts-ignore
    busyStatus: 'BUSY',
    uid: String(reservation.id),
    sequence: Math.round(new Date().getTime() / 1000),
  };

  return new Promise((resolve, reject) => {
    createEvent(event, (error, value) => {
      if (error) {
        return reject(error);
      }
      resolve(value);
    });
  });
}

const router = Router({});

router.getAsync<{token: string}>('/:token', async (req, res) => {
  const {token} = req.params;
  const cal = await getIcs(prismaClient, token);

  res
    .set({
      'Content-type': 'text/calendar',
      'Content-disposition': `attachment; filename=reservation.ics`,
    })
    .send(cal);
});

export default router;
