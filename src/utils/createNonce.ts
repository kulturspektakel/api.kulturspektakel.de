import {add} from 'date-fns';
import prismaClient from './prismaClient';
import {ApiError} from './errorReporting';
import {NonceRequestStatus} from '../../types/prisma/enums';

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
  // Nonces are validated against `expiresAt`; expired rows are no longer
  // garbage-collected here (the nonceInvalidate worker task was removed).
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

  // Validated against `expiresAt`; expired rows are no longer
  // garbage-collected here (the nonceRequestInvalidate worker task was removed).
  return nonceRequest.id;
}
