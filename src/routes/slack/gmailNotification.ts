import {Hono} from 'hono';
import {google} from 'googleapis';
import env from '../../utils/env';
import {scheduleTask} from '../../tasks';
import {add, isBefore, sub} from 'date-fns';
import prismaClient from '../../utils/prismaClient';
import {
  GMAIL_REMINDERS,
  getHeaderField,
  slackAttachment,
} from '../../tasks/gmailReminder';
import {sendMessage} from '../../utils/slack';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.json<{
    emailAddress: string;
    historyId: number;
  }>();

  const account = body.emailAddress;

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

  const {data} = await gmail.users.threads.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 1,
  });

  const threadId = data.threads?.at(0)?.id;
  if (!threadId) {
    return c.text('ok', 200);
  }

  const thread = await gmail.users.threads.get({
    userId: 'me',
    id: threadId,
  });

  const message = thread.data.messages?.at(-1);

  if (
    !message ||
    message.labelIds?.includes('SENT') ||
    message.labelIds?.includes('DRAFT') ||
    getHeaderField(message, 'from') === account
  ) {
    return c.text('ok', 200);
  }

  const p = await prismaClient.gmailReminders.findUnique({
    where: {
      messageId: message.id!,
    },
  });

  if (
    p != null ||
    (message.internalDate &&
      isBefore(
        new Date(parseInt(message.internalDate, 10)),
        sub(new Date(), {minutes: 5}),
      ))
  ) {
    // message is older than 5 minutes
    return c.text('ok', 200);
  }

  await Promise.allSettled([
    sendMessage({
      channel: GMAIL_REMINDERS[account].channel,
      text: `Neue E-Mail für ${account}`,
      attachments: [slackAttachment(message, account)],
    }),
    prismaClient.gmailReminders.create({
      data: {
        messageId: message.id!,
        account,
      },
    }),
    ...GMAIL_REMINDERS[account]?.reminderInDays.map((days) =>
      scheduleTask(
        'gmailReminder',
        {
          account: account,
          messageId: message.id!,
        },
        {
          maxAttempts: 1,
          runAt: add(new Date(), {days}),
        },
      ),
    ),
  ]);

  return c.text('ok', 200);
});

export default app;
