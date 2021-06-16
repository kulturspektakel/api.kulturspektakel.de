import {Area} from '@prisma/client';
import {
  add,
  differenceInMinutes,
  endOfDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import {isEqual} from 'date-fns/esm';
import {extendType} from 'nexus';
import {ArgsValue, intArg, nonNull} from 'nexus/dist/core';
import {occupancyIntervals} from '../mutations/requestReservation';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {config} from './config';

export default extendType({
  type: 'Area',
  definition(t) {
    t.nonNull.list.nonNull.field('availability', {
      type: 'TableAvailability',
      args: {
        partySize: nonNull(intArg()),
        day: nonNull('Date'),
      },
      resolve: async (
        parent,
        {partySize, day}: ArgsValue<'Area', 'availableSlots'> & {date: Date},
        {prismaClient},
      ) => {
        const area = await prismaClient.area.findUnique({
          where: {
            id: (parent as Area).id,
          },
          include: {
            areaOpeningHour: {
              where: {
                startTime: {
                  gte: startOfDay(day),
                  lte: endOfDay(day),
                },
              },
            },
          },
        });

        if (!area) {
          throw new Error('Area not found');
        }

        const openingHours = area.areaOpeningHour.map(
          ({startTime, endTime}) => ({startTime, endTime}),
        );

        const tables = await prismaClient.table.findMany({
          where: {
            maxCapacity: {
              gte: partySize,
            },
            minOccupancy: {
              lte: partySize,
            },
            areaId: area.id,
          },
          include: {
            reservations: {
              where: {
                startTime: {
                  gte: startOfDay(day),
                  lte: endOfDay(day),
                },
                status: {
                  not: 'Cleared',
                },
              },
              orderBy: {
                startTime: 'asc',
              },
            },
          },
        });

        const overCapacity = (
          await occupancyIntervals(prismaClient, startOfDay(day), endOfDay(day))
        ).filter(({occupancy}) => occupancy + partySize > config.capacityLimit);

        const availability = subtractIntervals(openingHours, overCapacity);
        return tables
          .flatMap((t) =>
            subtractIntervals(availability, t.reservations).map((i) => ({
              ...i,
              tableType: t.type,
            })),
          )
          .filter(
            ({startTime, endTime}) =>
              isLongEnough(startTime, endTime) && hasEnoughTimeLeft(endTime),
          );
      },
    });
  },
});

type Interval = {startTime: Date; endTime: Date};
function subtractIntervals(a: Interval[], b: Interval[]): Interval[] {
  for (let ib of b) {
    a = a
      .flatMap((ia) => {
        const ias = ia.startTime.getTime();
        const iae = ia.endTime.getTime();
        const ibs = ib.startTime.getTime();
        const ibe = ib.endTime.getTime();

        if (ibe <= ias || ibs >= iae) {
          // no overlap
          return [ia];
        } else if (ibs <= ias && ibe >= iae) {
          // remove entirely
          return [];
        } else if (ibs > ias && ibe < iae) {
          // split
          return [
            {startTime: ia.startTime, endTime: ib.startTime},
            {startTime: ib.endTime, endTime: ia.endTime},
          ];
        } else if (ibe > ias && ibe < iae) {
          // shorten front
          return [{startTime: ib.endTime, endTime: ia.endTime}];
        } else if (ibs < iae) {
          // shorten back
          return [{startTime: ia.startTime, endTime: ib.startTime}];
        }
        throw new UnreachableCaseError('a' as never);
      })
      .filter(Boolean);
  }

  return a;
}

export function hasEnoughTimeLeft(endTime: Date): boolean {
  return !isBefore(endTime, add(new Date(), {minutes: 60}));
}

export function isLongEnough(startTime: Date, endTime: Date): boolean {
  return differenceInMinutes(endTime, startTime) >= 90;
}

export function isTooLong(startTime: Date, endTime: Date): boolean {
  return differenceInMinutes(endTime, startTime) > 60 * 4;
}
