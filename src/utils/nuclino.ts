import fetch from 'node-fetch';
import env from '../utils/env';
import querystring from 'querystring';

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
  const res = await fetch(url, {
    headers: {
      Authorization: env.NUCLINO_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  const data: APIResponse<T> = await res.json();
  if (data.status !== 'success') {
    throw new Error(data.message);
  }
  return data.data;
}

export type NuclinoSearchResult = APIObject & {highlight: string};

export async function items(params: {
  search?: string;
  limit?: number;
  after?: string;
}) {
  const r = await nuclinoAPIRequest<{
    results: Array<NuclinoSearchResult>;
  }>(
    `https://api.nuclino.com/v0/items/?${querystring.stringify({
      // filter non null values
      ...Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      workspaceId: env.NUCLINO_WORKSPACE_ID,
    })}`,
  );
  return r.results;
}

export function item(id: string) {
  return nuclinoAPIRequest<APIObjectWithContent>(
    `https://api.nuclino.com/v0/items/${id}`,
  );
}

export type NuclinoUser = {
  object: 'user';
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | undefined;
};

export function user(id: string) {
  return nuclinoAPIRequest<NuclinoUser>(
    `https://api.nuclino.com/v0/users/${id}`,
  );
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
