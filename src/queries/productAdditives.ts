import DeviceType from '../models/DeviceType';
import ProductAdditives from '../models/ProductAdditives';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('productAdditives', (t) =>
  t.prismaField({
    type: [ProductAdditives],
    args: {
      type: t.arg({
        type: DeviceType,
      }),
    },
    resolve: () =>
      prismaClient.productAdditives.findMany({
        orderBy: [
          {
            id: 'asc',
          },
        ],
      }),
  }),
);
