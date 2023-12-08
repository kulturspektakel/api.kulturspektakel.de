import {Prisma} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {DirectusFile, assetUri} from './Asset';

export const ImageSize = builder
  .objectRef<{
    uri: string;
    width: number;
    height: number;
  }>('ImageSize')
  .implement({
    fields: (t) => ({
      uri: t.exposeString('uri'),
      width: t.exposeInt('width'),
      height: t.exposeInt('height'),
    }),
  });

export async function getImageSizes(markdownString: string) {
  const imgRegex =
    /!\[.*?\]\((.*?\/assets\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}))\)/g;
  const matches = markdownString.match(imgRegex) || [];
  const imageIDs = matches.map((match) => match.replace(imgRegex, '$2'));
  if (imageIDs.length === 0) {
    return [];
  }
  const files = await prismaClient.$queryRaw<
    Array<DirectusFile>
  >`SELECT * FROM "directus"."directus_files" WHERE id IN (${Prisma.join(
    imageIDs,
    ',',
    undefined,
    '::uuid',
  )}) AND width IS NOT NULL AND height IS NOT NULL`;

  return files.map((file) => ({
    uri: assetUri(file.id),
    width: file.width!,
    height: file.height!,
  }));
}
