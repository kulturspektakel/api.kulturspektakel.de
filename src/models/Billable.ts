import {interfaceType, objectType} from 'nexus';
import {NexusGenAbstractTypeMembers, NexusGenObjects} from '../../types/api';
import authorization from '../utils/authorization';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import merge from 'lodash.merge';
import {Prisma} from '@prisma/client';

export default interfaceType({
  name: 'Billable',
  definition(t) {
    t.nonNull.field('salesNumbers', {
      type: objectType({
        name: 'SalesNumber',
        definition(t) {
          t.nonNull.field('count', {type: 'Int'});
          t.nonNull.field('total', {type: 'Float'});
        },
      }),
      args: {
        after: 'DateTime',
        before: 'DateTime',
      },
      authorize: authorization('user'),
      resolve: async (root, {after, before}, {prismaClient}, {path}) => {
        const typename: NexusGenAbstractTypeMembers['Billable'] = path.typename as any;
        let where: Prisma.OrderItemWhereInput = {};
        switch (typename) {
          case 'ProductList':
            where = {
              listId: (root as NexusGenObjects[typeof typename]).id,
            };
            break;
          case 'Product':
          case 'HistoricalProduct':
            where = {
              name: (root as NexusGenObjects[typeof typename]).name,
            };
            break;
          case 'Device':
            where = {
              order: {
                deviceId: (root as NexusGenObjects[typeof typename]).id,
              },
            };
            break;
          default:
            throw new UnreachableCaseError(typename);
        }

        const orderItems = await prismaClient.orderItem.aggregate({
          _count: true,
          _sum: {
            perUnitPrice: true,
          },
          where: merge(
            {
              order: {
                deviceTime: {
                  gte: after,
                  lte: before,
                },
              },
            },
            where,
          ),
        });

        return {
          count: orderItems._count,
          total: (orderItems._sum.perUnitPrice ?? 0) / 100,
        };
      },
    });
  },
  resolveType: (node) =>
    ((node as any) as {__typename: NexusGenAbstractTypeMembers['Billable']})
      .__typename,
});
