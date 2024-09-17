import {ParsedToken} from '../routes/auth';
import prismaClient from './prismaClient';

const CACHE = new Map<string, Promise<string | undefined>>();

export default async function viewerIdFromToken(
  parsedToken: ParsedToken | undefined,
): Promise<string | undefined> {
  if (parsedToken == null) {
    return;
  } else if (parsedToken.iss === 'directus') {
    if (CACHE.has(parsedToken.id)) {
      return CACHE.get(parsedToken.id);
    }
    const promise = prismaClient.$queryRaw<
      Array<{
        external_identifier: string;
      }>
    >`select "external_identifier" from "directus"."directus_users" where "id"=${parsedToken.id}::uuid`.then(
      (d) => d.pop()?.external_identifier,
    );
    CACHE.set(parsedToken.id, promise);
    return promise;
  } else if (parsedToken.iss === 'owntracks') {
    return parsedToken.viewerId;
  }
}
