import fetch from 'node-fetch';
import env from '../utils/env';
import querystring from 'querystring';

const workspaceId = 'ac8f47db-4d08-41d1-b245-34058883e72c';

export type APIObject = {
  id: string;
  workspaceId: string;
  url: string;
  title: string;
  createdAt: Date;
  createdUserId: string;
  lastUpdatedAt: string;
  lastUpdatedUserId: string;
} & (
  | {
      object: 'item';
      contentMeta: {
        itemIds: string[];
        fileIds: string[];
      };
    }
  | {
      object: 'cluster';
      childIds: string[];
    }
);

export type APIObjectWithContent = APIObject & {content: string};

type APIResponse<T> =
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'fail';
      message: string;
    }
  | {
      status: 'error';
      message: string;
    };

async function nuclinoAPIRequest<T>(url: string) {
  const res: APIResponse<T> = await fetch(url, {
    headers: {
      Authorization: env.NUCLINO_API_KEY,
    },
  }).then((res) => res.json());

  if (res.status !== 'success') {
    throw new Error(res.message);
  }
  return res.data;
}

export async function items(params: {
  search?: string;
  limit?: number;
  after?: string;
}) {
  const r = await nuclinoAPIRequest<{
    results: Array<APIObject & {highlight: string}>;
  }>(
    `https://api.nuclino.com/v0/items/?${querystring.stringify({
      // filter non null values
      ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      workspaceId,
    })}`,
  );
  return r.results;
}

export function item(id: string) {
  return nuclinoAPIRequest<APIObjectWithContent>(
    `https://api.nuclino.com/v0/items/${id}`,
  );
}

export function user(id: string) {
  return nuclinoAPIRequest<{
    object: 'user';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | undefined;
  }>(`https://api.nuclino.com/v0/users/${id}`);
}

export async function allItems() {
  const results: Array<APIObject> = [];
  let after = undefined;
  while (true) {
    const page = await items({after, limit: 100});
    results.push(...page);
    if (page.length !== 100) {
      break;
    }
    after = results[results.length - 1].id;
  }
  return results;
}
