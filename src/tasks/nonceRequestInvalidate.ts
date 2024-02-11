import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';

export default async function (
  {nonceRequest}: {nonceRequest: string},
  {logger}: JobHelpers,
) {
  prismaClient.nonceRequest
    .delete({
      where: {
        id: nonceRequest,
      },
    })
    .catch(() => null);
}
