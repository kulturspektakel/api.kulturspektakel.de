import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

const BandApplicationCommentInput = builder.inputType(
  'BandApplicationCommentInput',
  {
    fields: (t) => ({
      bandApplicationId: t.globalID({required: true}),
      comment: t.string({required: true}),
    }),
  },
);

builder.mutationField('createBandApplicationComment', (t) =>
  t.field({
    type: BandApplication,
    args: {
      input: t.arg({type: BandApplicationCommentInput, required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_, {input: {bandApplicationId, comment}}, {token}) => {
      const res = await prismaClient.bandApplicationComment.create({
        data: {
          bandApplicationId: bandApplicationId.id,
          comment,
          viewerId: token?.type === 'user' ? token.userId! : '',
        },
        select: {
          bandApplication: true,
        },
      });

      return res.bandApplication;
    },
  }),
);
