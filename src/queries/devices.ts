import Device from '../models/Device';
import DeviceType from '../models/DeviceType';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('devices', (t) =>
  t.prismaField({
    type: [Device],
    args: {
      type: t.arg({
        type: DeviceType,
      }),
    },
    authScopes: {
      user: true,
    },
    resolve: (query, _root, {type}) =>
      prismaClient.device.findMany({
        ...query,
        where: {
          type: type ?? undefined,
        },
        orderBy: [
          {
            id: 'desc',
          },
        ],
      }),
  }),
);
