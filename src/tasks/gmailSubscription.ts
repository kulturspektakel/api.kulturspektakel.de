import {JobHelpers} from 'graphile-worker';
import {google} from 'googleapis';
import env from '../utils/env';

export default async function (
  {account}: {account: string},
  {logger}: JobHelpers,
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

  await gmail.users.watch({
    userId: 'me',
    requestBody: {
      labelIds: ['INBOX'],
      topicName: 'projects/gmail-reminder-api/topics/mail-reminder',
    },
  });
}
