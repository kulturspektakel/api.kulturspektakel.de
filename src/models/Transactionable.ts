import {interfaceType, list, nonNull, objectType} from 'nexus';
import {NexusGenAbstractTypeMembers} from '../../types/api';
import authorization from '../utils/authorization';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import {Device, Prisma} from '@prisma/client';
import {isAfter} from 'date-fns';
import {UserInputError} from 'apollo-server-express';

export default interfaceType({
  name: 'Transactionable',
  definition(t) {
    t.nonNull.field('transactions', {
      type: objectType({
        name: 'CardTransactionConnection',
        definition(t) {
          t.field('balanceTotal', {
            type: nonNull('Int'),
            description: 'This includes money made from deposit',
          });
          t.field('depositIn', {
            type: nonNull('Int'),
          });
          t.field('depositOut', {
            type: nonNull('Int'),
          });
          t.field('uniqueCards', {
            type: nonNull('Int'),
          });
          t.field('totalCount', {
            type: nonNull('Int'),
          });
          t.field('data', {
            type: nonNull(list(nonNull('CardTransaction'))),
          });
        },
      }),
      args: {
        limit: 'Int',
        after: 'DateTime',
        before: 'DateTime',
        type: 'CardTransactionType',
      },
      authorize: authorization('user'),
      resolve: async (root, {limit, after, before, type}, {prisma}, {path}) => {
        if (isAfter(after, before)) {
          throw new UserInputError(
            'Argument "after" needs to be earlier than argument "before"',
          );
        }

        const typename: NexusGenAbstractTypeMembers['Transactionable'] =
          path.typename as any;
        let where: Prisma.CardTransactionWhereInput = {};
        switch (typename) {
          case 'Device':
            where = {
              deviceId: (root as Device).id,
            };
            break;
          case 'Card':
            console.log(root);
            where = {
              cardId: (root as any).id,
            };
            break;
          case 'Query':
            break;
          default:
            throw new UnreachableCaseError(typename);
        }

        const data = await prisma.cardTransaction.findMany({
          where: {
            ...where,
            deviceTime: {
              gt: after,
              lt: before,
            },
            transactionType: type ?? undefined,
          },
          orderBy: {
            deviceTime: 'desc',
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
    });
  },
  resolveType: (node) =>
    (
      node as any as {
        __typename: NexusGenAbstractTypeMembers['Transactionable'];
      }
    ).__typename,
});
