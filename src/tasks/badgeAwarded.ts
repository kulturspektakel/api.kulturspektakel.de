import prismaClient from '../utils/prismaClient';
import {sendMessage} from '../utils/slack';

export default async function ({orderId}: {orderId: number}) {
  const order = await prismaClient.order.findUnique({
    where: {id: orderId},
    include: {
      crewCard: {
        include: {
          viewer: true,
        },
      },
    },
  });
  if (!order || !order.crewCardId || !order.crewCard?.viewer) {
    return;
  }

  const data: Array<{
    key: string;
    name: string;
    description: string;
    crewOnly: boolean;
    awardedAt: string;
    svg: string;
  }> = await fetch('https://www.kulturspektakel.de/api/badges', {
    method: 'POST',
    body: JSON.stringify({
      orderId,
    }),
  }).then((res) => res.json());

  for (const badge of data) {
    await sendMessage({
      channel: order.crewCard.viewer.id as any,
      text: `🎖️ Gratulation, du hast den ${badge.name} Badge erhalten! Scanne deine CrewCard mit deinem Handy um deinen Badge zu sehen.`,
    });
  }
}
