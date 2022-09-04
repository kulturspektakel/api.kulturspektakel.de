import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.mutationField('markBandApplicationContacted', (t) =>
  t.field({
    type: BandApplication,
    args: {
      bandApplicationId: t.arg.globalID({required: true}),
      contacted: t.arg.boolean({required: true}),
    },
    resolve: async (_, {bandApplicationId, contacted}, {token}) =>
      prismaClient.bandApplication.update({
        data: {
          contactedByViewerId:
            contacted && token?.type === 'user' ? token.userId : null,
        },
        where: {
          id: bandApplicationId.id,
        },
      }),
  }),
);
