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
import {Order, OrderItem, OrderPayment, Prisma} from '@prisma/client';
import {
  add,
  differenceInHours,
  isAfter,
  isBefore,
  startOfDay,
  startOfHour,
} from 'date-fns';
import {UserInputError} from 'apollo-server-express';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import OrderPaymentEnum from './OrderPayment';
import TimeGrouping from './TimeGrouping';

type OrderItems = Array<OrderItem & {order: Order}>;

class TimeSeries {
  time: Date;
  value: number;

  constructor(time: Date, value: number) {
    this.time = time;
    this.value = value;
  }
}

builder.objectType(TimeSeries, {
  name: 'TimeSeries',
  fields: (t) => ({
    time: t.field({type: 'DateTime', resolve: ({time}) => time}),
    value: t.field({type: 'Int', resolve: ({value}) => value}),
  }),
});

class SalesNumber {
  count: number;
  total: number;
  payment: OrderPayment;
  after: Date;
  before: Date;
  orderItems: OrderItems;

  constructor(payment: any, orderItems: OrderItems, after: Date, before: Date) {
    this.count = orderItems.reduce((acc, cv) => acc + cv.amount, 0);
    this.total =
      orderItems.reduce((acc, cv) => acc + cv.amount * cv.perUnitPrice, 0) /
      100;
    this.payment = payment;
    this.orderItems = orderItems;
    this.after = after;
    this.before = before;
  }
}

builder.objectType(SalesNumber, {
  name: 'SalesNumber',
  fields: (t) => ({
    count: t.field({type: 'Int', resolve: ({count}) => count}),
    total: t.field({type: 'Float', resolve: ({total}) => total}),
    payment: t.field({
      type: OrderPaymentEnum,
      resolve: ({payment}) => payment,
    }),
    timeSeries: t.field({
      type: [TimeSeries],
      args: {
        grouping: t.arg({type: TimeGrouping}),
      },
      resolve: ({before, after, orderItems}, {grouping}) => {
        const stepHours = grouping === 'Hour' ? 1 : 24;

        if (differenceInHours(before, after) / stepHours > 100) {
          throw new UserInputError('Time grouping has too many steps');
        }

        const result: TimeSeries[] = [];
        let time = grouping == 'Hour' ? startOfHour(after) : startOfDay(after);
        while (!isAfter(time, before)) {
          result.push(
            orderItems.reduce((acc, cv) => {
              if (
                !isBefore(cv.order.createdAt, time) &&
                isBefore(cv.order.createdAt, add(time, {hours: stepHours}))
              ) {
                acc.value += cv.amount;
              }
              return acc;
            }, new TimeSeries(time, 0)),
          );
          time = add(time, {hours: stepHours});
        }

        return result;
      },
    }),
  }),
});

export class Billable {
  constructor() {}
}

builder.interfaceType(Billable, {
  name: 'Billable',
  fields: (t) => ({
    salesNumbers: t.field({
      // TODO auth
      type: [SalesNumber],
      args: {
        after: t.arg({type: 'DateTime', required: true}),
        before: t.arg({type: 'DateTime', required: true}),
      },
      resolve: async (root, {after, before}, ctx, {parentType}) => {
        if (isAfter(after, before)) {
          throw new UserInputError(
            'Argument "after" needs to be earlier than argument "before"',
          );
        }

        let where: Prisma.OrderItemWhereInput = {};
        switch (parentType.name) {
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

        const orderItems = await prismaClient.orderItem.findMany({
          where: merge<Prisma.OrderItemWhereInput, Prisma.OrderItemWhereInput>(
            {
              order: {
                createdAt: {
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

        const payments = orderItems.reduce(
          (acc, cv) => acc.add(cv.order.payment),
          new Set<OrderPayment>(),
        );

        const results = [];
        for (const payment of payments) {
          const filteredOrderItems = orderItems.filter(
            (o) => o.order.payment === payment,
          );

          const result = new SalesNumber(
            payment,
            filteredOrderItems,
            after,
            before,
          );

          results.push(result);
        }

        return results;
      },
    }),
  }),
});

// export default interfaceType({
//   name: 'Billable',
//   definition(t) {
//     t.nonNull.list.field('salesNumbers', {
//       type: objectType({
//         name: 'SalesNumber',
//         definition(t) {
//           t.nonNull.field('count', {type: 'Int'});
//           t.nonNull.field('total', {type: 'Float'});
//           t.nonNull.field('payment', {type: 'OrderPayment'});
//           t.nonNull.list.nonNull.field('timeSeries', {
//             type: objectType({
//               name: 'TimeSeries',
//               definition(t) {
//                 t.nonNull.field('time', {
//                   type: 'DateTime',
//                 });
//                 t.nonNull.field('value', {
//                   type: 'Int',
//                 });
//               },
//             }),
//             args: {
//               grouping: 'TimeGrouping',
//             },
//             resolve: async (
//               {_after, _before, _orderItems}: SalesNumberType,
//               {grouping}: {grouping: NexusGenEnums['TimeGrouping']},
//             ) => {
//               const stepHours = grouping === 'Hour' ? 1 : 24;

//               if (differenceInHours(_before, _after) / stepHours > 100) {
//                 throw new UserInputError('Time grouping has too many steps');
//               }

//               const result = [];
//               let time =
//                 grouping == 'Hour' ? startOfHour(_after) : startOfDay(_after);
//               while (!isAfter(time, _before)) {
//                 result.push(
//                   _orderItems.reduce(
//                     (acc, cv) => {
//                       if (
//                         !isBefore(cv.order.createdAt, time) &&
//                         isBefore(
//                           cv.order.createdAt,
//                           add(time, {hours: stepHours}),
//                         )
//                       ) {
//                         acc.value += cv.amount;
//                       }
//                       return acc;
//                     },
//                     {
//                       time,
//                       value: 0,
//                     },
//                   ),
//                 );
//                 time = add(time, {hours: stepHours});
//               }

//               return result;
//             },
//           });
//         },
//       }),
//       args: {
//         after: nonNull('DateTime'),
//         before: nonNull('DateTime'),
//       },
//       authorize: authorization('user'),
//       resolve: async (root, {after, before}, {prisma}, {path}) => {
//         if (isAfter(after, before)) {
//           throw new UserInputError(
//             'Argument "after" needs to be earlier than argument "before"',
//           );
//         }

//         const typename: NexusGenAbstractTypeMembers['Billable'] =
//           path.typename as any;
//         let where: Prisma.OrderItemWhereInput = {};
//         switch (typename) {
//           case 'ProductList':
//             where = {
//               productListId: (root as NexusGenFieldTypes[typeof typename]).id,
//             };
//             break;
//           case 'Product':
//           case 'HistoricalProduct':
//             where = {
//               name: (root as NexusGenFieldTypes[typeof typename]).name,
//               productListId: (root as NexusGenFieldTypes[typeof typename])
//                 .productListId,
//             };
//             break;
//           case 'Device':
//             where = {
//               order: {
//                 deviceId: (root as NexusGenFieldTypes[typeof typename]).id,
//               },
//             };
//             break;
//           default:
//             throw new UnreachableCaseError(typename);
//         }

//         const orderItems = await prisma.orderItem.findMany({
//           where: merge<Prisma.OrderItemWhereInput, Prisma.OrderItemWhereInput>(
//             {
//               order: {
//                 createdAt: {
//                   gte: after,
//                   lte: before,
//                 },
//               },
//             },
//             where,
//           ),
//           include: {
//             order: true,
//           },
//         });

//         const payments = orderItems.reduce(
//           (acc, cv) => acc.add(cv.order.payment),
//           new Set<OrderPayment>(),
//         );

//         const results = [];
//         for (const payment of payments) {
//           const _orderItems = orderItems.filter(
//             (o) => o.order.payment === payment,
//           );

//           const result: SalesNumberType = {
//             count: _orderItems.reduce((acc, cv) => acc + cv.amount, 0),
//             total:
//               _orderItems.reduce(
//                 (acc, cv) => acc + cv.amount * cv.perUnitPrice,
//                 0,
//               ) / 100,
//             payment,
//             _orderItems,
//             _after: after,
//             _before: before,
//           };

//           results.push(result);
//         }

//         return results;
//       },
//     });
//   },
//   resolveType: (node) =>
//     (node as any as {__typename: NexusGenAbstractTypeMembers['Billable']})
//       .__typename,
// });
