import BandApplicationComment from '../models/BandApplicationComment';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.mutationField('createBandApplicationComment', (t) =>
  t.field({
    type: BandApplicationComment,
    args: {
      bandApplicationId: t.arg.globalID({required: true}),
      comment: t.arg.string({required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_, {bandApplicationId, comment}, {token}) =>
      prismaClient.bandApplicationComment.create({
        data: {
          bandApplicationId: bandApplicationId.id,
          comment,
          viewerId: token?.type === 'user' ? token.userId! : '',
        },
      }),
  }),
);
