import {PrismaClient, Reservation} from '@prisma/client';
import {UserInputError} from 'apollo-server-errors';
import {add, isBefore, isEqual} from 'date-fns';
import endOfDay from 'date-fns/endOfDay';
import {extendType, idArg, list, nonNull, stringArg} from 'nexus';
import {ArgsValue} from 'nexus/dist/typegenTypeHelpers';
import confirmReservation from '../maizzle/mails/confirmReservation';
import {
  hasEnoughTimeLeft,
  isLongEnough,
  isTooLong,
} from '../queries/availability';
import {config} from '../queries/config';
import {scheduleTask} from '../tasks';
import isEmail from '../utils/isEmail';
import sendMail from '../utils/sendMail';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.nonNull.field('requestReservation', {
      type: 'Boolean',
      args: {
        primaryEmail: nonNull(stringArg()),
        primaryPerson: nonNull(stringArg()),
        otherPersons: nonNull(list(nonNull(stringArg()))),
        startTime: nonNull('DateTime'),
        endTime: nonNull('DateTime'),
        areaId: nonNull(idArg()),
        tableType: 'TableType',
      },
      resolve: async (
        _,
        {
          primaryEmail,
          primaryPerson,
          startTime,
          endTime,
          otherPersons,
          areaId,
          tableType,
        }: ArgsValue<'Mutation', 'requestReservation'> & {
          startTime: Date;
          endTime: Date;
        },
        {prismaClient},
      ) => {
        primaryPerson = primaryPerson.trim();
        primaryEmail = primaryEmail.trim();
        otherPersons = otherPersons.map((p) => p.trim()).filter(Boolean);
        if (!primaryPerson || !isEmail(primaryEmail)) {
          throw new UserInputError('Ungültige Angabe bei Namen/E-Mail');
        }

        const partySize = otherPersons.length + 1;

        if (isBefore(new Date(), config.reservationStart)) {
          throw new UserInputError('Reservierung noch nicht freigeschalten');
        }
        if (!hasEnoughTimeLeft(endTime)) {
          throw new UserInputError('Nicht mehr genügend Zeit');
        }
        if (!isLongEnough(startTime, endTime)) {
          throw new UserInputError('Reservierungszeitraum ist zu kurz');
        }
        if (isTooLong(startTime, endTime)) {
          throw new UserInputError('Reservierungszeitraum ist zu lange');
        }

        const area = await prismaClient.area.findUnique({
          where: {
            id: areaId,
          },
          include: {
            areaOpeningHour: {
              where: {
                startTime: {
                  lte: startTime,
                },
                endTime: {
                  gte: endTime,
                },
              },
            },
          },
        });

        if (!area) {
          throw new UserInputError('Bereich existiert nicht');
        }
        if (area.areaOpeningHour.length === 0) {
          throw new UserInputError('Außerhalb der Öffnungszeiten');
        }

        await checkOccupancy(prismaClient, startTime, endTime, partySize);

        const table = await prismaClient.table.findFirst({
          where: {
            minOccupancy: {
              lte: partySize,
            },
            maxCapacity: {
              gte: partySize,
            },
            type: tableType ?? undefined,
            areaId,
            reservations: whereHasNoOverlappingReservation(startTime, endTime),
          },
          orderBy: [
            {type: 'asc'}, // prefer TABLE over ISLAND
            {maxCapacity: 'asc'}, // prefer smaller tables
            {displayName: 'asc'}, // prefer smaller table numbers
          ],
          include: {
            reservations: true,
          },
        });

        if (!table) {
          throw new UserInputError('Kein Tisch verfügbar');
        }

        const reservation = await prismaClient.reservation.create({
          data: {
            primaryEmail,
            primaryPerson,
            otherPersons,
            startTime,
            endTime,
            table: {
              connect: {
                id: table.id,
              },
            },
          },
        });

        try {
          await sendReservationRequest(primaryEmail, reservation);
        } catch (e) {
          console.error(e);
          // clear reservation, because it can't be confirmed
          await prismaClient.reservation.delete({
            where: {
              id: reservation.id,
            },
          });
          throw new UserInputError(
            'Bestätigungsmail konnte nicht versendet werden',
          );
        }

        await scheduleTask(
          'clearPendingReservations',
          {id: reservation.id},
          {
            runAt: add(new Date(), {minutes: 30}),
          },
        );

        if (!reservation) {
          throw new UserInputError('Reserierung konnte nicht bestätigt werden');
        }

        return true;
      },
    });
  },
});

export async function checkOccupancy(
  prismaClient: PrismaClient,
  startTime: Date,
  endTime: Date,
  partySize: number,
) {
  if (
    (await occupancyIntervals(prismaClient, startTime, endTime)).some(
      ({occupancy}) => occupancy + partySize > config.capacityLimit,
    )
  ) {
    // not enough area capacity
    throw new UserInputError('Besucherzahllimit für diesen Zeitraum erreicht.');
  }
}

export function whereHasNoOverlappingReservation(
  startTime: Date,
  endTime: Date,
) {
  return {
    every: {
      OR: [
        {
          startTime: {
            gte: endTime,
          },
        },
        {
          endTime: {
            lte: startTime,
          },
        },
      ],
    },
  };
}

async function sendReservationRequest(email: string, reservation: Reservation) {
  return sendMail({
    to: email,
    subject: `Reservierungsanfrage #${reservation.id}`,
    html: confirmReservation({
      day: reservation.startTime.toLocaleDateString('de', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        timeZone: 'Europe/Berlin',
      }),
      startTime: reservation.startTime.toLocaleTimeString('de', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin',
      }),
      token: reservation.token,
      number: String(reservation.id),
    }),
  });
}

type OccupancyInterval = {startTime: Date; endTime: Date; occupancy: number};

export async function occupancyIntervals(
  prismaClient: PrismaClient,
  startTime: Date,
  endTime: Date,
): Promise<OccupancyInterval[]> {
  const reservations = await prismaClient.reservation.findMany({
    where: {
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  const result = reservations
    .flatMap((r) => {
      const persons = Math.max(r.checkedInPersons, r.otherPersons.length + 1);
      return [
        {date: r.startTime, persons},
        {date: r.endTime, persons: -persons},
      ];
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .reduce((acc, {date, persons}) => {
      const lastEntry: OccupancyInterval | undefined = acc[acc.length - 1];

      if (isEqual(lastEntry?.startTime, date)) {
        lastEntry.occupancy += persons;
      } else {
        if (lastEntry) {
          lastEntry.endTime = date;
        }
        acc.push({
          startTime: date,
          endTime: date, // this is wrong, but will be overriden in the next iteration
          occupancy: (lastEntry?.occupancy ?? 0) + persons,
        });
      }

      return acc;
    }, [] as OccupancyInterval[]);

  if (result.length > 0 && result[result.length - 1].occupancy === 0) {
    // this should always be true
    result.pop();
  }
  return result;
}
