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
              productListId: root.id,
            };
            break;
          case 'Product':
          case 'HistoricalProduct':
            where = {
              name: root.name,
              productListId: root.productListId,
            };
            break;
          case 'Device':
            where = {
              order: {
                deviceId: root.id,
              },
            };
            break;
          default:
            throw new UnreachableCaseError(parentType.name);
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
