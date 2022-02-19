import {PrismaClient} from '@prisma/client';
import {add} from 'date-fns';
import fetch from 'node-fetch';
import WebSocket, {EventEmitter} from 'ws';
import {scheduleTask} from '../tasks';
import env from '../utils/env';
import instance from './prismaClient';
const ShareDB = require('@danielbuechele/sharedb/lib/client');

export async function getHeaders(prisma: PrismaClient) {
  const config = await prisma.config.findUnique({
    where: {
      key: 'NuclinoToken',
    },
  });

  if (!config?.value) {
    throw new Error('No Nuclino Token');
  }

  return {
    Cookie: `_ga=GA1.2.2136818352.1517691405; _gid=GA1.2.1271612510.1517691405; app-uid=${env.NUCLINO_APP_ID}; tr_p7tlufngy5={"referrer":"","query":"","variant":"production"}; token=${config.value}`,
    Origin: 'https://app.nuclino.com',
    'X-Requested-With': 'XMLHttpRequest',
  };
}

declare class Connection extends EventEmitter {
  get(collectionName: 'ot_cell', documentID: string): PubSub<Cell>;
  get(collectionName: 'ot_brain', documentID: string): PubSub<Brain>;
  get(collectionName: 'ot_user', documentID: string): PubSub<User>;
}

declare class PubSub<T> extends EventEmitter {
  data: T;
  subscribe(): void;
  unsubscribe(): void;
  subscribed: boolean;
}

let connection = startWatching();
function startWatching(): Promise<Connection> {
  return new Promise(async (resolve) => {
    const headers = await getHeaders(instance);
    const socket = new WebSocket('wss://api.nuclino.com/syncing', {
      headers,
    });

    const c: Connection = new ShareDB.Connection(socket);
    c.on('state', (state) => {
      if (state === 'connected') {
        subscribeBrain(c);
        resolve(c);
      } else if (state === 'disconnected') {
        connection = startWatching();
      }
    });

    // restart every day to renew token
    setTimeout(startWatching, 24 * 60 * 60 * 1000);
  });
}

function subscribeBrain(connection: Connection) {
  console.log('🧠 Subscribing to all Nuclino pages');
  const brain = connection.get('ot_brain', env.NUCLINO_BRAIN_ID);

  const traverse = async (id: string) => {
    if (cells.has(id)) {
      return;
    }
    const cell = await getCell(id);
    await Promise.all(cell.childIds.map(traverse));
    return cell;
  };

  brain.subscribe();
  brain.on('load', async () => {
    await traverse(brain.data.mainCellId);
    console.log(`🧠 Subscribed to ${cells.size} Nuclino pages`);
  });
}

const cells = new Map<string, PubSub<Cell>>();
export async function getCell(id: string): Promise<Cell> {
  return new Promise(async (resolve) => {
    if (cells.has(id)) {
      return resolve(cells.get(id)?.data!);
    }
    const c = await connection;
    const cell = c.get('ot_cell', id);
    cells.set(id, cell);
    cell.subscribe();
    cell.on('op', async () => {
      const user = await getUser(cell.data.lastEditorId);
      await scheduleTask(
        'nuclinoUpdateMessage',
        {
          cellId: id,
          cellTitle: cell.data.title,
          user: [user.firstName, user.lastName].filter(Boolean).join(' '),
        },
        {
          runAt: add(new Date(), {minutes: 2}),
          jobKey: `${id}:${cell.data.lastEditorId}`,
          jobKeyMode: 'replace',
        },
      );
    });
    cell.on('load', () => resolve(cell.data));
  });
}

function getUser(id: string): Promise<User> {
  return new Promise(async (resolve) => {
    const c = await connection;
    const user = c.get('ot_user', id);
    if (user.subscribed) {
      // already subscribed
      return resolve(user.data);
    }
    user.subscribe();
    console.log('getUser', user);
    user.on('load', () => {
      resolve(user.data);
      user.unsubscribe();
    });
  });
}

type Cell = {
  kind: 'LEAF' | 'PARENT';
  title: string;
  fields: {};
  brainId: string;
  sharing: {mode: null; token: string | null};
  childIds: [];
  createdAt: string;
  creatorId: string;
  memberIds: [];
  updatedAt: string;
  activities: [];
  contentMeta: {
    files: [];
    tasks: [];
    linksOut: string[];
    mentions: [];
  };
  followerIds: [];
  lastEditorId: string;
};

type MemberRole = 'MEMBER';

type Brain = {
  kind: 'PUBLIC';
  name: string;
  teamId: string;
  members: [{id: string; role: MemberRole}];
  createdAt: string;
  creatorId: string;
  cellFields: Array<{
    id: string;
    name: 'Member';
    type: 'MULTI_COLLABORATOR';
  }>;
  mainCellId: string;
  defaultView: 'TREE';
  trashCellId: string;
  archiveCellId: string;
  formerMembers: [{id: string; role: MemberRole}];
  pinnedCellIds: string[];
  defaultMemberRole: MemberRole;
};

type User = {
  email: string;
  avatarId: string | null;
  lastName: string;
  createdAt: string;
  firstName: string;
};

export type APIItem = {
  object: string;
  id: string;
  workspaceId: string;
  url: string;
  title: string;
  createdAt: Date;
  createdUserId: string;
  lastUpdatedAt: Date;
  lastUpdatedUserId: string;
  contentMeta: {
    itemIds: string[];
    fileIds: string[];
  };
};

export type APIItemWithContent = APIItem & {content: string};

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

export function search(query: string) {
  return nuclinoAPIRequest<{
    results: Array<APIItem & {highlight: string}>;
  }>(`https://api.nuclino.com/v0/items${env.NUCLINO_BRAIN_ID}&search=${query}`);
}

export function item(id: string) {
  return nuclinoAPIRequest<APIItemWithContent>(
    `https://api.nuclino.com/v0/items/${id}`,
  );
}
