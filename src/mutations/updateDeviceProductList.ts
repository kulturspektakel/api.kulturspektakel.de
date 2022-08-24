import Device from '../models/Device';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.mutationField('updateDeviceProductList', (t) =>
  t.field({
    type: Device,
    args: {
      productListId: t.arg.int(),
      deviceId: t.arg.string({required: true}),
    },
    resolve: async (_, {productListId, deviceId}, {token}) =>
      prismaClient.device.update({
        where: {
          id: deviceId,
        },
        data: {
          productListId,
        },
      }),
  }),
);
