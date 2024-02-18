import {
  CardTransaction as CardTransactionT,
  Device,
  Prisma,
} from '@prisma/client';
import {isAfter} from 'date-fns';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import CardTransaction, {CardTransactionType} from './CardTransaction';
import {GraphQLError} from 'graphql';

export class Transactionable {}

const CardTransactionConnection = builder
  .objectRef<{
    balanceTotal: number;
    depositIn: number;
    depositOut: number;
    uniqueCards: number;
    totalCount: number;
    data: Array<CardTransactionT & {deviceLog: {deviceTime: Date}}>;
  }>('CardTransactionConnection')
  .implement({
    fields: (t) => ({
      balanceTotal: t.exposeInt('balanceTotal', {
        description: 'This includes money made from deposit',
      }),
      depositIn: t.exposeInt('depositIn'),
      depositOut: t.exposeInt('depositOut'),
      uniqueCards: t.exposeInt('uniqueCards'),
      totalCount: t.exposeInt('totalCount'),
      data: t.expose('data', {type: [CardTransaction]}),
    }),
  });

builder.interfaceType(Transactionable, {
  name: 'Transactionable',
  fields: (t) => ({
    transactions: t.field({
      type: CardTransactionConnection,
      authScopes: {
        user: true,
      },
      args: {
        limit: t.arg({type: 'Int'}),
        after: t.arg({type: 'DateTime'}),
        before: t.arg({type: 'DateTime'}),
        type: t.arg({type: CardTransactionType}),
      },
      resolve: async (root, {limit, after, before, type}, _, {parentType}) => {
        if (after && before && isAfter(after, before)) {
          throw new GraphQLError(
            'Argument "after" needs to be earlier than argument "before"',
          );
        }

        let where: Prisma.CardTransactionWhereInput = {};
        if (parentType.name === 'Device') {
          where = {
            deviceLog: {
              deviceId: (root as Device).id,
            },
          };
        } else if (parentType.name === 'Card') {
          where = {
            cardId: (root as any).id,
          };
        }

        const data = await prismaClient.cardTransaction.findMany({
          where: {
            ...where,
            deviceLog: {
              deviceTime: {
                gt: after ?? undefined,
                lt: before ?? undefined,
              },
            },
            transactionType: type ?? undefined,
          },
          include: {
            deviceLog: {
              select: {
                deviceTime: true,
              },
            },
          },
          orderBy: {
            deviceLog: {
              deviceTime: 'desc',
            },
          },
          take: limit ?? undefined,
        });

        return {
          totalCount: data.length,
          balanceTotal: data.reduce(
            (acc, cv) => acc + (cv.balanceAfter - cv.balanceBefore),
            0,
          ),
          depositIn: data.reduce(
            (acc, cv) => acc + Math.max(0, cv.depositBefore - cv.depositAfter),
            0,
          ),
          depositOut: data.reduce(
            (acc, cv) => acc + Math.max(0, cv.depositAfter - cv.depositBefore),
            0,
          ),
          uniqueCards: new Set(data.map((d) => d.cardId)).size,
          data,
        };
      },
    }),
  }),
});
