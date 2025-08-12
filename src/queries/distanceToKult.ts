import {builder} from '../pothos/builder';
import env from '../utils/env';

builder.queryField('distanceToKult', (t) =>
  t.field({
    type: 'Float',
    nullable: true,
    args: {
      origin: t.arg.string({required: true}),
    },
    resolve: (_root) => 0, // deprecated
  }),
);

export async function getPlace(place: string): Promise<{
  placeId: string;
  latitude: number;
  longitude: number;
} | void> {
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');

  url.searchParams.set('address', place);
  url.searchParams.set('region', 'de');
  url.searchParams.set('key', env.GOOGLE_MAPS_KEY!);
  const response = await fetch(url.toString());
  const data: {
    results: Array<{
      place_id: string;
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };
    }>;
    status: 'OK';
  } = await response.json();

  if (data.results.length) {
    return {
      placeId: data.results[0].place_id,
      latitude: data.results[0].geometry.location.lat,
      longitude: data.results[0].geometry.location.lng,
    };
  }
}

export async function getDistanceToKult(placeId: string) {
  const url = new URL(
    'https://maps.googleapis.com/maps/api/distancematrix/json',
  );

  url.searchParams.set('origins', `place_id:${placeId}`);
  url.searchParams.set(
    'destinations',
    'Germeringer Str. 41, 82131 Gauting, Germany',
  );
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('units', 'metric');
  url.searchParams.set('key', env.GOOGLE_MAPS_KEY!);
  const response = await fetch(url.toString());
  const data: {
    destination_addresses: string[];
    origin_addresses: string[];
    rows: Array<{
      elements: Array<
        | {
            distance: {
              text: string;
              value: number;
            };
            duration: {
              text: string;
              value: number;
            };
            status: 'OK';
          }
        | {
            status: 'NOT_FOUND';
          }
      >;
    }>;
    status: 'OK';
  } = await response.json();

  return (
    data.rows.at(0)?.elements.find((element) => element.status === 'OK')
      ?.distance?.value ?? null
  );
}
