import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

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
    resolve: async (
      _,
      {input: {bandApplicationId, comment}},
      {parsedToken},
    ) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      const res = await prismaClient.bandApplicationComment.create({
        data: {
          bandApplicationId: bandApplicationId.id,
          comment,
          viewerId: viewerId!,
        },
        select: {
          bandApplication: true,
        },
      });

      return res.bandApplication;
    },
  }),
);
