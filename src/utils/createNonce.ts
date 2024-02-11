import {add} from 'date-fns';
import {scheduleTask} from '../tasks';
import prismaClient from './prismaClient';
import {ApiError} from './errorReporting';
import {NonceRequestStatus} from '@prisma/client';

const NONCE_LIFETIME_MINUTES = 5;

export default async function createNonce(createdForId?: string | null) {
  if (!createdForId) {
    throw new ApiError(400, 'Failed to create nonce');
  }
  const expiresAt = add(new Date(), {minutes: NONCE_LIFETIME_MINUTES});
  const data = await prismaClient.nonce.create({
    data: {
      expiresAt,
      createdForId,
    },
  });
  await scheduleTask(
    'nonceInvalidate',
    {nonce: data.nonce},
    {
      runAt: expiresAt,
      maxAttempts: 1,
    },
  );
  return data.nonce;
}

export async function createNonceRequest(userId: string) {
  const expiresAt = add(new Date(), {minutes: NONCE_LIFETIME_MINUTES});
  const nonceRequest = await prismaClient.nonceRequest.create({
    data: {
      expiresAt,
      status: NonceRequestStatus.Pending,
      createdFor: {
        connect: {
          id: userId,
        },
      },
    },
  });

  await scheduleTask(
    'nonceRequestInvalidate',
    {nonceRequest: nonceRequest.id},
    {
      runAt: expiresAt,
      maxAttempts: 1,
    },
  );

  return nonceRequest.id;
}
