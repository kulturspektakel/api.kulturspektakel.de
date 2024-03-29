import Device from '../models/Device';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.mutationField('updateDeviceProductList', (t) =>
  t.field({
    authScopes: {user: true},
    type: Device,
    args: {
      productListId: t.arg.globalID({required: true}),
      deviceId: t.arg.globalID({required: true}),
    },
    resolve: async (_, {productListId, deviceId}) =>
      prismaClient.device.update({
        where: {
          id: deviceId.id,
        },
        data: {
          productListId: parseInt(productListId?.id, 10),
        },
      }),
  }),
);
