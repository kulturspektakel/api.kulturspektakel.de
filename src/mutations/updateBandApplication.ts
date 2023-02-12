import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

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
    resolve: async (_, {bandApplicationId, data}, {parsedToken}) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      return prismaClient.bandApplication.update({
        data: {
          contactedByViewerId: data?.contacted === false ? null : viewerId,
          instagramFollower: data?.instagramFollower,
        },
        where: {
          id: bandApplicationId.id,
        },
      });
    },
  }),
);
