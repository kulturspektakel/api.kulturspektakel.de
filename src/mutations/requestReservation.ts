import {Reservation} from '@prisma/client';
import {UserInputError} from 'apollo-server-errors';
import {extendType, idArg, list, nonNull, stringArg} from 'nexus';
import {ArgsValue} from 'nexus/dist/typegenTypeHelpers';
import confirmReservation from '../maizzle/mails/confirmReservation';
import {
  hasEnoughTimeLeft,
  isLongEnough,
  isTooLong,
} from '../queries/availability';
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

        const reservations = await prismaClient.reservation.findMany({
          where: {
            table: {
              areaId,
            },
            startTime: {
              lte: endTime,
            },
            endTime: {
              gte: startTime,
            },
            status: {
              not: 'Cleared',
            },
          },
          orderBy: {
            startTime: 'asc',
          },
        });

        if (
          occupancyIntervals(reservations).some(
            ({occupancy}) => occupancy + partySize > area.maxCapacity,
          )
        ) {
          // not enough area capacity
          throw new UserInputError(
            'Besucherzahllimit für diesen Zeitraum erreicht.',
          );
        }

        const table = await prismaClient.table.findFirst({
          where: {
            minOccupancy: {
              lte: partySize,
            },
            maxCapacity: {
              gte: partySize,
            },
            areaId,
            reservations: {
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
            },
          },
          orderBy: {
            maxCapacity: 'asc',
          },
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
          await sendMail({
            to: primaryEmail,
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

        if (!reservation) {
          throw new UserInputError('Reserierung konnte nicht bestätigt werden');
        }

        return true;
      },
    });
  },
});

type OccupancyInterval = {startTime: Date; endTime: Date; occupancy: number};

export function occupancyIntervals(
  reservations: Reservation[],
): OccupancyInterval[] {
  const dateGroups = reservations
    .flatMap((r) => [
      {date: r.startTime.getTime(), persons: r.otherPersons.length + 1},
      {date: r.endTime.getTime(), persons: -r.otherPersons.length - 1},
    ])
    .reduce(
      (acc, cv) => acc.set(cv.date, (acc.get(cv.date) ?? 0) + cv.persons),
      new Map<number, number>(),
    );

  const dates = Array.from(dateGroups).sort(([a], [b]) => a - b);

  const result: OccupancyInterval[] = [];
  for (let i = 0; i < dates.length - 1; i++) {
    result.push({
      startTime: new Date(dates[i][0]),
      endTime: new Date(dates[i + 1][0]),
      occupancy: dates[i][1],
    });
  }

  return result;
}
