import {extendType, nonNull} from 'nexus';
import fetch from 'node-fetch';
import env from '../utils/env';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('distanceToKult', {
      type: 'Float',
      args: {
        origin: nonNull('String'),
      },
      resolve: (_root, {origin}) => getDistanceToKult(origin),
    });
  },
});

export async function getDistanceToKult(
  origin: string,
): Promise<number | null> {
  const data: {
    authenticationResultCode: string;
    brandLogoUri: string;
    copyright: string;
    resourceSets: Array<{
      estimatedTotal: number;
      resources: Array<{
        __type: string;
        id: string;
        distanceUnit: string;
        durationUnit: string;
        price: number;
        travelDistance: number;
        travelDuration: number;
        travelDurationTraffic: number;
      }>;
    }>;
    statusCode: number;
    statusDescription: string;
    traceId: string;
  } = await fetch(
    `http://dev.virtualearth.net/REST/v1/Routes?waypoint.1=${encodeURIComponent(
      origin,
    )}&waypoint.2=Germeringer%20Str.%2041,%2082131%20Gauting%20&key=${
      env.BING_MAPS_KEY
    }%20&routeAttributes=routeSummariesOnly`,
  ).then((res) => res.json());

  if (
    data.statusCode == 200 &&
    data.resourceSets.length > 0 &&
    data.resourceSets[0].resources.length > 0
  ) {
    return data.resourceSets[0].resources[0].travelDistance;
  }

  return null;
}
