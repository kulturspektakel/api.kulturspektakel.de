import {google} from 'googleapis';
import env from './env';

export default async function addToMailingList(email: string) {
  const client = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/admin.directory.group.member'],
  });

  await client.authorize();

  const admin = google.admin({
    auth: client,
    version: 'directory_v1',
  });

  let added = true;
  console.log(email);

  await admin.members
    .insert({
      groupKey: '04du1wux1n28nki',
      requestBody: {
        email,
      },
    })
    .catch((e) => {
      if (e.code == 409) {
        // Member already exists
        added = false;
        return;
      }
      console.error(e);
      throw new Error(`Cloud not add ${email}`);
    });

  return added;
}
