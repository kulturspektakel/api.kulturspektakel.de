import prismaClient from './prismaClient';
import {fetchUser} from './slack';
import {sub} from 'date-fns';

export async function upsertViewer(viewerId: string, context?: string) {
  if (viewerId.length === 36) {
    console.log(`UUID detected ${viewerId}: ${context}`);
  }
  let viewer = await prismaClient.viewer.findUnique({
    where: {
      id: viewerId,
    },
  });

  const daysAgo = sub(new Date(), {days: 30});
  if (viewer && viewer.updatedAt < daysAgo) {
    return viewer;
  }

  const slackUser = await fetchUser(viewerId);
  if (!slackUser) {
    throw new Error('User not found');
  }
  const userData = {
    displayName: slackUser.profile.real_name,
    profilePicture: slackUser.profile.image_192,
    email: slackUser.profile.email,
  };

  viewer = await prismaClient.viewer.upsert({
    create: {
      id: slackUser.id,
      ...userData,
    },
    update: userData,
    where: {
      id: slackUser.id,
    },
  });

  if (!viewer) {
    throw new Error('Viewer not found');
  }

  return viewer;
}
