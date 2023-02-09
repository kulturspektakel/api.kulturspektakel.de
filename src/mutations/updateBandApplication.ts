import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

const BandApplicationUpdateInput = builder.inputType(
  'BandApplicationUpdateInput',
  {
    fields: (t) => ({
      contacted: t.boolean(),
      instagramFollower: t.int(),
    }),
  },
);

builder.mutationField('updateBandApplication', (t) =>
  t.field({
    type: BandApplication,
    args: {
      bandApplicationId: t.arg.globalID({required: true}),
      data: t.arg({type: BandApplicationUpdateInput}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_, {bandApplicationId, data}, {token}) =>
      prismaClient.bandApplication.update({
        data: {
          contactedByViewerId:
            data?.contacted === false
              ? null
              : data?.contacted === true && token?.type === 'user'
              ? token.userId
              : undefined,
          instagramFollower: data?.instagramFollower,
        },
        where: {
          id: bandApplicationId.id,
        },
      }),
  }),
);
