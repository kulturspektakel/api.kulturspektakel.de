import {enumType, extendType} from 'nexus';
import {DeviceType} from 'nexus-prisma';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('devices', {
      type: 'Device',
      authorize: authorization('user'),
      args: {
        type: enumType(DeviceType),
      },
      resolve: async (_root, {type}, {prisma}) =>
        prisma.device.findMany({
          where: {
            type: type ?? undefined,
          },
          orderBy: [
            {
              id: 'desc',
            },
          ],
        }),
    });
  },
});
