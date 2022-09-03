import Device from '../models/Device';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.mutationField('updateDeviceProductList', (t) =>
  t.field({
    type: Device,
    args: {
      productListId: t.arg.int(),
      deviceId: t.arg.id({required: true}),
    },
    resolve: async (_, {productListId, deviceId}, {token}) =>
      prismaClient.device.update({
        where: {
          id: String(deviceId),
        },
        data: {
          productListId,
        },
      }),
  }),
);
