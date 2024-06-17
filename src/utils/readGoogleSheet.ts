import env from './env';

export default async function readGoogleSheet<T>(
  sheetId: string,
  sheetName: string,
) {
  const data = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${env.GOOGLE_MAPS_KEY}`,
  );

  const json: {
    range: string;
    majorDimension: string;
    values: string[][];
  } = await data.json();

  return json;
}
