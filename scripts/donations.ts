import prismaClient from '../src/utils/prismaClient';
import sendMail from '../src/utils/sendMail';

async function main() {
  const donations = await prismaClient.donation.findMany({
    where: {
      source: {
        notIn: ['Other', 'Membership'],
      },
      amount: {
        gte: 2500,
      },
      email: {
        not: null,
      },
      sentConfirmationAt: {
        equals: null,
      },
    },
  });

  for (let donation of donations) {
    console.log(`Sending email to ${donation.email}`);
    await sendMail(
      'donation',
      'Kulturspektakel Gauting <info@kulturspektakel.de>',
      {
        link: `https://www.kulturspektakel.de/spenden/quittung/${donation.id}`,
      },
      {
        to: donation.email!,
      },
    );

    await prismaClient.donation.update({
      where: {
        id: donation.id,
      },
      data: {
        sentConfirmationAt: new Date(),
      },
    });
  }
}

await main();
