import {ParsedToken} from '../routes/auth';
import prismaClient from './prismaClient';
import {getViewerFromDirectusId} from '@prisma/client/sql';

export default async function viewerIdFromToken(
  parsedToken: ParsedToken | undefined,
): Promise<string | undefined> {
  if (parsedToken == null) {
    return;
  } else if (parsedToken.iss === 'directus') {
    const [user] = await prismaClient.$queryRawTyped(
      getViewerFromDirectusId(parsedToken.id),
    );
    return user?.external_identifier ?? undefined;
  } else if (parsedToken.iss === 'owntracks') {
    return parsedToken.viewerId;
  }
}
