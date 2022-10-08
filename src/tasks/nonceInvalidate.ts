import prismaClient from '../utils/prismaClient';
import {JobHelpers} from 'graphile-worker';

export default async function ({nonce}: {nonce: string}, {logger}: JobHelpers) {
  prismaClient.nonce.delete({
    where: {
      nonce,
    },
  });
}
