import {interfaceType, nonNull, objectType} from 'nexus';
import {
  NexusGenAbstractTypeMembers,
  NexusGenEnums,
  NexusGenFieldTypes,
  NexusGenObjects,
} from '../../types/api';
import authorization from '../utils/authorization';
import UnreachableCaseError from '../utils/UnreachableCaseError';
import merge from 'lodash.merge';
import {Order, OrderItem, Prisma} from '@prisma/client';
import {
  add,
  differenceInHours,
  isAfter,
  isBefore,
  startOfDay,
  startOfHour,
} from 'date-fns';
import {UserInputError} from 'apollo-server-express';

type SalesNumberType = NexusGenObjects['SalesNumber'] & {
  _after: Date;
  _before: Date;
  _orderItems: Array<OrderItem & {order: Order}>;
};

export default interfaceType({
  name: 'Billable',
  definition(t) {
    t.nonNull.field('salesNumbers', {
      type: objectType({
        name: 'SalesNumber',
        definition(t) {
          t.nonNull.field('count', {type: 'Int'});
          t.nonNull.field('total', {type: 'Float'});
          t.nonNull.list.nonNull.field('timeSeries', {
            type: objectType({
              name: 'TimeSeries',
              definition(t) {
                t.nonNull.field('time', {
                  type: 'DateTime',
                });
                t.nonNull.field('value', {
                  type: 'Int',
                });
              },
            }),
            args: {
              grouping: 'TimeGrouping',
            },
            resolve: async (
              {_after, _before, _orderItems}: SalesNumberType,
              {grouping}: {grouping: NexusGenEnums['TimeGrouping']},
            ) => {
              const stepHours = grouping === 'Hour' ? 1 : 24;

              if (differenceInHours(_before, _after) / stepHours > 100) {
                throw new UserInputError('Time grouping has too many steps');
              }

              const result = [];
              let time =
                grouping == 'Hour' ? startOfHour(_after) : startOfDay(_after);
              while (!isAfter(time, _before)) {
                result.push(
                  _orderItems.reduce(
                    (acc, cv) => {
                      if (
                        !isBefore(cv.order.createdAt, time) &&
                        isBefore(
                          cv.order.createdAt,
                          add(time, {hours: stepHours}),
                        )
                      ) {
                        acc.value += cv.amount;
                      }
                      return acc;
                    },
                    {
                      time,
                      value: 0,
                    },
                  ),
                );
                time = add(time, {hours: stepHours});
              }

              return result;
            },
          });
        },
      }),
      args: {
        after: nonNull('DateTime'),
        before: nonNull('DateTime'),
      },
      authorize: authorization('user'),
      resolve: async (root, {after, before}, {prisma}, {path}) => {
        if (isAfter(after, before)) {
          throw new UserInputError(
            'Argument "after" needs to be earlier than argument "before"',
          );
        }

        const typename: NexusGenAbstractTypeMembers['Billable'] =
          path.typename as any;
        let where: Prisma.OrderItemWhereInput = {};
        switch (typename) {
          case 'ProductList':
            where = {
              productListId: (root as NexusGenFieldTypes[typeof typename]).id,
            };
            break;
          case 'Product':
          case 'HistoricalProduct':
            where = {
              name: (root as NexusGenFieldTypes[typeof typename]).name,
              productListId: (root as NexusGenFieldTypes[typeof typename])
                .productListId,
            };
            break;
          case 'Device':
            where = {
              order: {
                deviceId: (root as NexusGenFieldTypes[typeof typename]).id,
              },
            };
            break;
          default:
            throw new UnreachableCaseError(typename);
        }

        const orderItems = await prisma.orderItem.findMany({
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
          include: {
            order: true,
          },
        });

        const result: SalesNumberType = {
          count: orderItems.reduce((acc, cv) => acc + cv.amount, 0),
          total:
            orderItems.reduce(
              (acc, cv) => acc + cv.amount * cv.perUnitPrice,
              0,
            ) / 100,
          _orderItems: orderItems,
          _after: after,
          _before: before,
        };

        return result;
      },
    });
  },
  resolveType: (node) =>
    (node as any as {__typename: NexusGenAbstractTypeMembers['Billable']})
      .__typename,
});
