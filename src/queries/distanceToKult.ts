import {builder} from '../pothos/builder';
import env from '../utils/env';

type Point = {
  type: 'Point';
  coordinates: [number, number];
};

type BingApiResponse = {
  authenticationResultCode: string;
  brandLogoUri: string;
  copyright: string;
  resourceSets: {
    estimatedTotal: number;
    resources: {
      __type: '';
      bbox: number[];
      id: string;
      distanceUnit: string;
      durationUnit: string;
      entitiesAlongRoute: any[];
      routeLegs: {
        actualEnd: Point;
        actualStart: Point;
      }[];
      trafficCongestion: string;
      trafficDataUsed: string;
      travelDistance: number;
      travelDuration: number;
      travelDurationTraffic: number;
      travelMode: string;
    }[];
  }[];
  statusCode: number;
  statusDescription: string;
  traceId: string;
};

builder.queryField('distanceToKult', (t) =>
  t.field({
    type: 'Float',
    nullable: true,
    args: {
      origin: t.arg.string({required: true}),
    },
    resolve: (_root, {origin}) =>
      getDistanceToKult(origin).then((n) => n?.distance),
  }),
);

type Res<T> = ({distance: number} & T) | null;
export async function getDistanceToKult(
  origin: string,
  coordinates: true,
): Promise<Res<{latitude: number; longitude: number}>>;
export async function getDistanceToKult(
  origin: string,
  coordinates?: boolean,
): Promise<Res<{}>>;
export async function getDistanceToKult(origin: string, coordinates?: boolean) {
  const data: BingApiResponse = await fetch(
    `http://dev.virtualearth.net/REST/v1/Routes?waypoint.1=${encodeURIComponent(
      origin,
    )}&waypoint.2=Germeringer%20Str.%2041,%2082131%20Gauting%20&key=${
      env.BING_MAPS_KEY
    }%20&routeAttributes=${
      coordinates ? 'excludeItinerary' : 'routeSummariesOnly'
    }`,
  ).then((res) => res.json());

  if (
    data.statusCode == 200 &&
    data.resourceSets.length > 0 &&
    data.resourceSets[0].resources.length > 0
  ) {
    const res = data.resourceSets[0].resources[0];
    const distance = res.travelDistance;

    if (coordinates && res.routeLegs.length > 0) {
      const [latitude, longitude] = res.routeLegs[0].actualStart.coordinates;
      return {distance, latitude, longitude};
    } else {
      return {distance};
    }
  }

  return null;
}
