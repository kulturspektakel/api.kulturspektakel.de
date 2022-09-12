import {sendMessage, SlackChannel} from '../utils/slack';
import {JobHelpers} from 'graphile-worker';
import {differenceInDays} from 'date-fns';
import notEmpty from '../utils/notEmpty';
import {gmail_v1, google} from 'googleapis';
import env from '../utils/env';

type ReminderArgs = {
  account: string;
  channel: SlackChannel;
  afterDays: number[];
};

export const booking: ReminderArgs = {
  account: 'booking@kulturspektakel.de',
  channel: SlackChannel.booking,
  afterDays: [2, 5],
};

export const info: ReminderArgs = {
  account: 'info@kulturspektakel.de',
  channel: SlackChannel.vorstand,
  afterDays: [2, 5],
};

export default async function (
  {account, channel, afterDays}: ReminderArgs,
  {}: JobHelpers,
) {
  const client = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    subject: account,
  });

  await client.authorize();

  const gmail = google.gmail({
    auth: client,
    version: 'v1',
  });

  const res = await gmail.users.threads.list({
    userId: account,
    labelIds: ['INBOX'],
  });

  const todos: Array<Promise<gmail_v1.Schema$Message | null>> =
    res.data.threads?.map(
      (thread) =>
        new Promise(async (resolve) => {
          const res = await gmail.users.threads.get({
            id: thread.id!,
            userId: account,
            format: 'full',
          });
          const lastMessage = res.data.messages?.pop();

          if (!lastMessage) {
            return resolve(null);
          }

          if (lastMessage.labelIds?.includes('SENT')) {
            return resolve(null);
          }

          const days = ageInDays(lastMessage);
          if (!afterDays.includes(days)) {
            return resolve(null);
          }

          return resolve(lastMessage ?? null);
        }),
    ) ?? [];

  const messages = await Promise.all(todos);

  let days = null;
  const attachments = messages.filter(notEmpty).map((lastMessage) => {
    days = ageInDays(lastMessage);
    const url = `https://mail.google.com/mail/u/${account}/#inbox/${lastMessage.threadId}`;

    return {
      author_name: getHeaderField(lastMessage, 'from'),
      callback_id: lastMessage.threadId,
      fallback: url,
      title: getHeaderField(lastMessage, 'subject'),
      text: lastMessage.snippet,
      color: afterDays[0] === days ? 'warning' : 'danger',
      ts: Math.round(parseInternalDate(lastMessage).getTime() / 1000),
      actions: [
        {
          type: 'button',
          text: 'Öffnen',
          url,
        },
      ],
    };
  });

  if (attachments.length === 0) {
    return;
  }

  await sendMessage({
    channel,
    text: `${
      attachments.length === 1
        ? `Folgende E-Mail ist seit ${days} Tag${days === 1 ? '' : 'en'}`
        : `Folgende ${attachments.length} E-Mails sind`
    } unbeantwortet im Posteingang von ${account}. Kann sie bitte jemand beantworten oder sie archivieren, wenn keine Antwort notwendig ist.`,
    attachments,
  });
}

function parseInternalDate(message: gmail_v1.Schema$Message): Date {
  return new Date(parseInt(message.internalDate ?? '0', 10));
}

function ageInDays(message: gmail_v1.Schema$Message): number {
  return differenceInDays(new Date(), parseInternalDate(message));
}

function getHeaderField(message: gmail_v1.Schema$Message, field: string) {
  const header = message.payload?.headers?.find(
    ({name}) => name?.toLowerCase() === field.toLowerCase(),
  );
  return header?.value ?? null;
}
