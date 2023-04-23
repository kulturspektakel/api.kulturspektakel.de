import {Viewer} from '@prisma/client';
import {ParsedToken} from '../routes/auth';
import prismaClient from './prismaClient';
import viewerIdFromToken from './viewerIdFromToken';

export default async function viewerFromToken(
  parsedToken: ParsedToken | undefined,
): Promise<Viewer | null> {
  const viewerId = await viewerIdFromToken(parsedToken);
  if (viewerId) {
    return await prismaClient.viewer.findUnique({
      where: {
        id: viewerId,
      },
    });
  }
  return null;
}
