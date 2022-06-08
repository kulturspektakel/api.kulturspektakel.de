import {extendType} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('updateDeviceProductList', {
      type: 'Device',
      args: {
        productListId: 'Int',
        deviceId: 'ID',
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
