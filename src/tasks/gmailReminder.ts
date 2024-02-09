import {sendMessage, SlackChannel} from '../utils/slack';
import {JobHelpers} from 'graphile-worker';
import {differenceInDays} from 'date-fns';
import {gmail_v1, google} from 'googleapis';
import env from '../utils/env';

export const GMAIL_REMINDERS: Record<
  string,
  {
    channel: SlackChannel;
    reminderInDays: number[];
  }
> = {
  'booking@kulturspektakel.de': {
    channel: SlackChannel.booking,
    reminderInDays: [3],
  },
  'info@kulturspektakel.de': {
    channel: SlackChannel.vorstand,
    reminderInDays: [3],
  },
};

export default async function (
  {
    account,
    threadId,
  }: {
    account: string;
    threadId: string;
  },
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

  const notification = await mailNotification(
    gmail,
    threadId,
    account,
    'warning',
  );
  if (!notification) {
    return;
  }

  await sendMessage({
    channel: GMAIL_REMINDERS[account].channel,
    text: `Folgende E-Mail ist seit ${ageInDays(
      notification.message,
    )} Tage unbeantwortet im Posteingang von ${account}. Kann sie bitte jemand beantworten oder sie archivieren, wenn keine Antwort notwendig ist.`,
    attachments: notification.attachments,
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

export async function mailNotification(
  gmail: gmail_v1.Gmail,
  threadId: string,
  account: string,
  color?: 'warning' | 'error' | 'success',
) {
  const res = await gmail.users.threads.get({
    id: threadId,
    userId: account,
    format: 'full',
  });
  const message = res.data.messages?.pop();

  if (!message) {
    return;
  }

  if (
    !message.labelIds?.includes('INBOX') ||
    message.labelIds?.includes('SENT')
  ) {
    return;
  }

  const url = `https://mail.google.com/mail/u/${account}/#inbox/${message.threadId}`;

  return {
    message,
    attachments: [
      {
        author_name: getHeaderField(message, 'from'),
        callback_id: message.threadId,
        fallback: url,
        title: getHeaderField(message, 'subject'),
        text: message.snippet,
        color,
        ts: Math.round(parseInternalDate(message).getTime() / 1000),
        actions: [
          {
            type: 'button',
            text: 'Öffnen',
            url,
          },
        ],
      },
    ],
  };
}
