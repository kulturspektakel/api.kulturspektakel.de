import {Hono} from 'hono';
import {google} from 'googleapis';
import env from '../../utils/env';
import {scheduleTask} from '../../tasks';
import {add} from 'date-fns';
import prismaClient from '../../utils/prismaClient';
import {GMAIL_REMINDERS, mailNotification} from '../../tasks/gmailReminder';
import {sendMessage} from '../../utils/slack';

const app = new Hono();

app.post('/', async (c) => {
  const body = await c.req.json<{
    emailAddress: string;
    historyId: number;
  }>();

  const account = body.emailAddress;

  const h = await prismaClient.gmailHistory.findUnique({
    where: {
      account: account,
    },
  });

  let historyId = h?.historyId;
  if (!historyId || historyId < body.historyId - 50) {
    historyId = body.historyId - 10;
  }
  await prismaClient.gmailHistory.upsert({
    where: {
      account: account,
    },
    create: {
      account: account,
      historyId: body.historyId,
    },
    update: {
      historyId: body.historyId,
      lastUpdate: new Date(),
    },
  });

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

  const {data} = await gmail.users.history.list(
    {
      userId: 'me',
      startHistoryId: String(historyId),
      historyTypes: ['messageAdded'],
    },
    {},
  );

  const last = data.history?.findLast(
    (h) => h.messagesAdded && h.messagesAdded?.length > 0,
  );

  const threadId = last?.messagesAdded?.at(0)?.message?.threadId;
  if (!threadId) {
    return c.text('ok', 200);
  }

  const notification = await mailNotification(gmail, threadId, account);

  if (notification) {
    await sendMessage({
      channel: GMAIL_REMINDERS[account].channel,
      text: `Neue E-Mail für ${account}}`,
      attachments: notification.attachments,
    });
  }

  await Promise.allSettled(
    GMAIL_REMINDERS[account]?.reminderInDays.map((days) =>
      scheduleTask(
        'gmailReminder',
        {
          account: account,
          threadId,
        },
        {
          maxAttempts: 1,
          runAt: add(new Date(), {days}),
        },
      ),
    ),
  );

  return c.text('ok', 200);
});

export default app;
