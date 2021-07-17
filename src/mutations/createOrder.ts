import {extendType, nonNull, list, inputObjectType} from 'nexus';
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
                  t.nonNull.field('perUnitPrice', {type: 'Int'});
                  t.nonNull.field('name', {type: 'String'});
                  t.nonNull.field('amount', {type: 'Int'});
                  t.field('listId', {type: 'Int'});
                  t.field('note', {type: 'String'});
                },
              }),
            ),
          ),
        ),
        payment: nonNull('OrderPayment'),
        clientId: 'String',
        deposit: nonNull('Int'),
        deviceTime: nonNull('DateTime'),
      },
      authorize: authorization('device'),
      resolve: async (
        _,
        {products, payment, deposit, deviceTime, clientId},
        {prismaClient, token},
      ) => {
        if (token?.type !== 'device') {
          throw new Error('No device authentication');
        }

        return await prismaClient.order.create({
          data: {
            payment,
            deviceId: token.deviceId!,
            tokens: deposit,
            deviceTime,
            clientId,
            items: {
              createMany: {
                data: products,
              },
            },
          },
        });
      },
    });
  },
});
