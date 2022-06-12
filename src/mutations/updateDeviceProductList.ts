import {extendType, nonNull} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateDeviceProductList', {
      type: 'Device',
      args: {
        productListId: 'Int',
        deviceId: nonNull('ID'),
      },
      authorize: authorization('user'),
      resolve: (_, {productListId, deviceId}, {prisma}) =>
        prisma.device.update({
          where: {
            id: deviceId,
          },
          data: {
            productListId,
          },
        }),
    });
  },
});
