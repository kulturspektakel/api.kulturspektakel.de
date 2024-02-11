import {NonceRequestStatus} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import createNonce from '../utils/createNonce';

builder.mutationField('nonceFromRequest', (t) =>
  t.field({
    type: 'String',
    nullable: true,
    args: {
      nonceRequestId: t.arg({type: 'String', required: true}),
    },
    resolve: async (_, {nonceRequestId}) => {
      const request = await prismaClient.nonceRequest
        .delete({
          where: {
            id: nonceRequestId,
            status: NonceRequestStatus.Approved,
            expiresAt: {
              gt: new Date(),
            },
          },
        })
        .catch(() => null);

      if (!request) {
        return null;
      }

      return createNonce(request.createdForId);
    },
  }),
);
