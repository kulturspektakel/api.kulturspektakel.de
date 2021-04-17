import {objectType} from 'nexus';

export default objectType({
  name: 'Order',
  definition(t) {
    t.model.id();
    t.model.payment();
    t.model.tokens();
    t.field('total', {
      type: 'Int',
      resolve: async (parent, _, {prismaClient}) => {
        const order = await prismaClient.order.findUnique({
          where: {id: parent.id},
          include: {
            items: true,
          },
        });
        if (!order) {
          throw new Error('Could not find order');
        }
        return order.items.reduce(
          (acc, cv) => acc + cv.amount * cv.perUnitPrice,
          0,
        );
      },
    });
  },
});
