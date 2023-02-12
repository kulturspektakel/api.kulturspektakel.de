import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

builder.mutationField('markBandApplicationContacted', (t) =>
  t.field({
    type: BandApplication,
    args: {
      bandApplicationId: t.arg.globalID({required: true}),
      contacted: t.arg.boolean({required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_, {bandApplicationId, contacted}, {parsedToken}) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      return prismaClient.bandApplication.update({
        data: {
          contactedByViewerId: contacted ? viewerId : null,
        },
        where: {
          id: bandApplicationId.id,
        },
      });
    },
  }),
);
