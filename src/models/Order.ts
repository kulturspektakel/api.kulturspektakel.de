import {builder} from '../pothos/builder';
import {config} from '../queries/config';
import prismaClient from '../utils/prismaClient';
import OrderPayment from './OrderPayment';

export default builder.prismaObject('Order', {
  fields: (t) => ({
    id: t.exposeInt('id'),
    payment: t.expose('payment', {type: OrderPayment}),
    deposit: t.field({
      type: 'Int',
      resolve: ({deposit}) => -deposit,
    }),
    createdAt: t.expose('createdAt', {type: 'DateTime'}),
    deviceId: t.exposeID('deviceId', {nullable: true}),
    items: t.relation('items'),
    total: t.field({
      type: 'Int',
      resolve: async (parent) => {
        const order = await prismaClient.order.findUnique({
          where: {id: parent.id},
          include: {
            items: true,
          },
        });
        if (!order) {
          throw new Error('Could not find order');
        }
        return (
          order.items.reduce(
            (acc, cv) => acc + cv.amount * cv.perUnitPrice,
            0,
          ) -
          order.deposit * config.depositValue
        );
      },
    }),
  }),
});
