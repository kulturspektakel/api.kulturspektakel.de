import {ParsedToken} from '../routes/auth';
import prismaClient from './prismaClient';

export default async function viewerIdFromToken(
  parsedToken: ParsedToken | undefined,
): Promise<string | undefined> {
  if (parsedToken == null) {
    return;
  } else if (parsedToken.iss === 'directus') {
    const user = await prismaClient.$queryRaw<
      Array<{
        external_identifier: string;
      }>
    >`select "external_identifier" from "directus"."directus_users" where "id"=${parsedToken.id}::uuid`;
    return user.pop()?.external_identifier;
  } else if (parsedToken.iss == null && parsedToken.type === 'user') {
    return parsedToken.userId;
  }
}
