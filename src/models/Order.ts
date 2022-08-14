import {objectType} from 'nexus';
import {builder} from '../pothos/builder';
import {config} from '../queries/config';

builder.prismaObject('Order', {
  id: {field: 'id'},
  fields: (t) => ({}),
});

export default objectType({
  name: 'Order',
  definition(t) {
    t.field(Order.id);
    t.field(Order.payment);
    t.field(Order.deposit);
    t.field(Order.createdAt);
    t.field(Order.deviceId);
    t.nonNull.list.nonNull.field('items', {
      type: 'OrderItem',
      resolve: (parent, _, {prisma}) =>
        prisma.orderItem.findMany({
          where: {
            orderId: parent.id,
          },
        }),
    });
    t.field('total', {
      type: 'Int',
      resolve: async (parent, _, {prisma}) => {
        const order = await prisma.order.findUnique({
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
          ) +
          order.deposit * config.depositValue
        );
      },
    });
  },
});
