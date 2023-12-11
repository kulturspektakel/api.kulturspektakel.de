import {Prisma} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {DirectusPixelImage, PixelImage} from './Asset';
import {SchemaTypes} from '@pothos/core';
import markdownToTxt from 'markdown-to-txt';

const MarkdownString = builder
  .objectRef<{
    images: DirectusPixelImage[];
    plainText: string;
    markdown: string;
  }>('MarkdownString')
  .implement({
    fields: (t) => ({
      images: t.field({
        type: [PixelImage],
        resolve: (root) => root.images,
      }),
      plainText: t.exposeString('plainText'),
      markdown: t.exposeString('markdown'),
    }),
  });

export function markdownField<Types extends SchemaTypes, F extends string>(
  t: PothosSchemaTypes.FieldBuilder<Types, {[K in F]: string | null}, 'Object'>,
  field: F,
  options?: {nullable?: boolean},
) {
  return t.field({
    type: MarkdownString,
    nullable: options?.nullable,
    // @ts-ignore
    resolve: async (root) => {
      const markdown = root[field];
      if (!markdown) {
        return null;
      }
      const images = await directusImages(markdown);

      return {
        images,
        plainText: markdownToTxt(markdown),
        markdown,
      };
    },
  });
}

async function directusImages(
  markdownString: string,
): Promise<DirectusPixelImage[]> {
  const imgRegex =
    /!\[.*?\]\((.*?\/assets\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}))\)/g;
  const matches = markdownString.match(imgRegex) || [];
  const imageIDs = matches.map((match) => match.replace(imgRegex, '$2'));
  if (imageIDs.length === 0) {
    return [];
  }
  const files = await prismaClient.$queryRaw<
    Array<DirectusPixelImage>
  >`SELECT * FROM "directus"."directus_files" WHERE id IN (${Prisma.join(
    imageIDs,
    ',',
    undefined,
    '::uuid',
  )}) AND width IS NOT NULL AND height IS NOT NULL`;

  return files;
}
