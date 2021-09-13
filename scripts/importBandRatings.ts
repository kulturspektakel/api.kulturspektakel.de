import prisma from '../src/utils/prismaClient';
type Message = {
  type: string;
  subtype: string;
  text: string;
  ts: string;
  username: string;
  icons: {
    emoji: string;
  };
  bot_id: string;
  thread_ts: string;
  reply_count: number;
  reply_users_count: number;
  latest_reply: string;
  reply_users: string[];
  replies: Array<{
    user: string;
    ts: string;
  }>;
  is_locked: boolean;
  subscribed: boolean;
  reactions: Array<{
    name: string;
    users: string[];
    count: number;
  }>;
};

import fs from 'fs';
import {trim} from 'lodash';

const RATING_MAP = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
]);

const USERS = new Set([
  'U03QDMULG',
  'USURXH10V',
  'U0DG5D887',
  'U3SLK2RB4',
  'U5P798AR0',
  'USJKUC8AD',
  'U03F9G7QW',
  'U1R7L4U07',
  'U03KSMQAJ',
  'U03FBBWJL',
  'U69RBMHFS',
  'U16BRTEEQ',
  'U03EN9JM6',
  'U1KH718G2',
  'U06BPQSHX',
  'U8KU23JG7',
  'U029AD7M0GG',
  'USURMQS8Y',
  'U04FA25LV',
  'U0WF7MQ8L',
  'U03R7FW8V',
  'U062WGV54',
  'U029NSDUAEL',
  'U1U1CKTK5',
  'U5VGXJN5B',
  'UF91Q8ZUH',
  'USQCS4RNX',
  'U0XJ57MJ8',
  'U03MRLV8S',
  'UK08B012T',
  'U029T6KRBHN',
  'U1QEWA7JA',
  'U03MCNXJT',
  'U3S986XNZ',
  'U03EKSJKH',
  'U026TE4PEV7',
  'U040N630N',
]);

(async () => {
  const messages: Message[] = JSON.parse(
    (
      await fs.promises.readFile(
        '/Users/danielbuechele/Downloads/Kulturspektakel Slack export Aug 1 2017 - Apr 1 2020/bandbewerbungen/combined.json',
      )
    ).toString('utf-8'),
  );

  for (let message of messages) {
    let bandname = null;
    if (message.username === 'Bandbewerbung') {
      bandname = message.text
        .split('\n')[0]
        .trim()
        .replace(/^\*/g, '')
        .replace(/\*$/g, '');
    } else if (
      message.text.startsWith('Bewerbung von') &&
      message.subtype === 'bot_message'
    ) {
      bandname = message.text.replace(/^Bewerbung von "/, '').slice(0, -1);
    }

    if (bandname) {
      bandname = bandname.trim().replace(/&amp;/g, '&');
      const apps = await prisma.bandApplication.findMany({
        where: {
          bandname,
        },
        include: {
          bandApplicationRating: true,
        },
      });
      if (apps.length === 0) {
        console.log(`🔴 ${bandname}`); // 🟢
        continue;
      }

      if (message.reactions) {
        console.log(`🟢 ${bandname}`); //
        for (let reaction of message.reactions) {
          if (reaction.name === 'envelope_with_arrow') {
            await prisma.bandApplication.update({
              data: {
                contactedByViewerId: reaction.users[0],
              },
              where: {id: apps[0].id},
            });
          } else if (new Set(RATING_MAP.keys()).has(reaction.name)) {
            for (let app of apps) {
              try {
                await prisma.bandApplicationRating.createMany({
                  data: reaction.users
                    .filter((u) => USERS.has(u))
                    .map((u) => ({
                      bandApplicationId: app.id,
                      rating: RATING_MAP.get(reaction.name) ?? 0,
                      viewerId: u,
                    })),
                });
                break;
              } catch (e) {}
            }
          }
        }
      }
    }
  }
})();
