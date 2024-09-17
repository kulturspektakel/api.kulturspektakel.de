import {Viewer} from '@prisma/client';
import {ParsedToken} from '../routes/auth';
import prismaClient from './prismaClient';
import viewerIdFromToken from './viewerIdFromToken';

const CACHE = new Map<string, Promise<Viewer | null>>();

export default async function viewerFromToken(
  parsedToken: ParsedToken | undefined,
): Promise<Viewer | null> {
  const viewerId = await viewerIdFromToken(parsedToken);
  if (viewerId) {
    if (CACHE.has(viewerId)) {
      return CACHE.get(viewerId) ?? null;
    }
    const promise = prismaClient.viewer.findUnique({
      where: {
        id: viewerId,
      },
    });
    CACHE.set(viewerId, promise);
    return promise;
  }
  return null;
}
