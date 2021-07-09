import {Product} from '.prisma/client';
import {extendType, nonNull, list, idArg, inputObjectType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createOrder', {
      type: 'Order',
      args: {
        products: nonNull(
          list(
            nonNull(
              inputObjectType({
                name: 'OrderItemInput',
                definition: (t) => {
                  t.nonNull.field('productId', {type: 'Int'});
                  t.nonNull.field('amount', {type: 'Int'});
                  t.field('note', {type: 'String'});
                },
              }),
            ),
          ),
        ),
        payment: nonNull('OrderPayment'),
      },
      authorize: authorization('device'),
      resolve: async (_, {products, payment}, {prismaClient, token}) => {
        if (token?.type !== 'device') {
          throw new Error('No device authentication');
        }
        const productItems = await prismaClient.product.findMany({
          where: {
            id: {
              in: products.map(({productId}) => productId),
            },
          },
        });

        const productMap = productItems.reduce(
          (acc, cv) => acc.set(cv.id, cv),
          new Map<number, Product>(),
        );

        return await prismaClient.order.create({
          data: {
            payment,
            deviceId: token.deviceId!,
            items: {
              createMany: {
                data: products.map((p) => ({
                  amount: p.amount,
                  name: productMap.get(p.productId)!.name,
                  perUnitPrice: productMap.get(p.productId)!.price,
                  note: p.note,
                })),
              },
            },
          },
        });
      },
    });
  },
});
