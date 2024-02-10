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
  'lager@kulturspektakel.de': {
    channel: SlackChannel.lager,
    reminderInDays: [3],
  },
};

export default async function (
  {
    account,
    messageId,
  }: {
    account: string;
    messageId: string;
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

  const message = await gmail.users.messages.get({
    id: messageId,
    userId: account,
  });

  const threadId = message.data.threadId;

  if (
    !threadId ||
    !message ||
    !message.data.labelIds?.includes('INBOX') ||
    message.data.labelIds?.includes('SENT')
  ) {
    return;
  }

  const thread = await gmail.users.threads.get({
    id: threadId,
    userId: account,
    format: 'full',
  });

  if (thread.data.messages?.at(-1)?.id !== messageId) {
    // new message in thread since
    return;
  }

  const age = ageInDays(message.data);

  await sendMessage({
    channel: GMAIL_REMINDERS[account].channel,
    text: `Folgende E-Mail ist seit ${age} Tag${
      age == 1 ? '' : 'en'
    } unbeantwortet im Posteingang von ${account}. Kann sie bitte jemand beantworten oder sie archivieren, wenn keine Antwort notwendig ist.`,
    attachments: [slackAttachment(message.data, account, 'warning')],
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

export function slackAttachment(
  message: gmail_v1.Schema$Message,
  account: string,
  color?: string,
) {
  const url = `https://mail.google.com/mail/u/${account}/#inbox/${message.threadId}`;

  return {
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
  };
}
