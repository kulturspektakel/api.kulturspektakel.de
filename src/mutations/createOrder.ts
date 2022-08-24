import Order from '../models/Order';
import OrderPayment from '../models/OrderPayment';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

const OrderItemInput = builder.inputType('OrderItemInput', {
  fields: (t) => ({
    perUnitPrice: t.int({required: true}),
    name: t.string({required: true}),
    amount: t.int({required: true}),
    productListId: t.int(),
    note: t.string(),
  }),
});

builder.mutationField('createOrder', (t) =>
  t.field({
    type: Order,
    args: {
      products: t.arg({type: [OrderItemInput], required: true}),
      payment: t.arg({type: OrderPayment, required: true}),
      deposit: t.arg.int({required: true}),
      deviceTime: t.arg({type: 'DateTime', required: true}),
    },
    resolve: async (_, {payment, deposit, deviceTime, products}, {token}) => {
      if (token?.type !== 'device') {
        throw new Error('No device authentication');
      }

      return await prismaClient.order.create({
        data: {
          payment,
          deviceId: token.deviceId!,
          deposit,
          createdAt: deviceTime,
          items: {
            createMany: {
              data: products,
            },
          },
        },
      });
    },
  }),
);
