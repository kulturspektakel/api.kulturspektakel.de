import BandApplication from '../models/BandApplication';
import {builder} from '../pothos/builder';
import {ApiError} from '../utils/errorReporting';
import prismaClient from '../utils/prismaClient';
import viewerIdFromToken from '../utils/viewerIdFromToken';

builder.mutationField('deleteBandApplicationComment', (t) =>
  t.field({
    type: BandApplication,
    args: {
      id: t.arg.globalID({required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_, {id: {id}}, {parsedToken}) => {
      const viewerId = await viewerIdFromToken(parsedToken);
      if (viewerId == null) {
        throw new ApiError(401, 'Must be user authenticated');
      }

      const comment =
        await prismaClient.bandApplicationComment.findUniqueOrThrow({
          where: {
            id,
          },
        });

      if (comment.viewerId !== viewerId) {
        throw new ApiError(401, 'Must be user authenticated');
      }

      const res = await prismaClient.bandApplicationComment.delete({
        where: {
          id,
        },
        include: {
          bandApplication: true,
        },
      });

      return res.bandApplication;
    },
  }),
);
