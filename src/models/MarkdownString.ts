import {Prisma} from '@prisma/client';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';
import {DirectusPixelImage, PixelImage} from './Asset';
import {SchemaTypes} from '@pothos/core';
import markdownToTxt from 'markdown-to-txt';
import {
  PrismaModelTypes,
  PrismaObjectFieldBuilder,
} from '@pothos/plugin-prisma';

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

export function markdownField<F extends string>(
  t: PrismaObjectFieldBuilder<
    SchemaTypes,
    PrismaModelTypes & {[K in F]: string | null}
  >,
  field: F,
  options?: {nullable?: boolean},
) {
  return t.field({
    type: MarkdownString,
    nullable: options?.nullable,
    resolve: async (root) => {
      let text = root[field];
      if (!text) {
        // We are okay with returning null when nullable is true
        return null as any;
      }
      const markdown = text.replaceAll(
        'https://crew.kulturspektakel.de/assets/',
        'https://files.kulturspektakel.de/',
      );
      const images = await directusImages(markdown);

      return {
        images,
        plainText: markdownToTxt(markdown),
        markdown: markdown,
      };
    },
  });
}

async function directusImages(
  markdownString: string,
): Promise<DirectusPixelImage[]> {
  const imgRegex =
    /!\[.*?\]\((https:\/\/files\.kulturspektakel\.de\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}))\)/g;
  const matches = markdownString.match(imgRegex) || [];
  const imageIDs = matches.map((match) => match.replace(imgRegex, '$2'));
  if (imageIDs.length === 0) {
    return [];
  }
  const files = await prismaClient.$queryRaw<
    Array<DirectusPixelImage>
  >`SELECT * FROM "directus"."directus_files" WHERE id::text IN (${Prisma.join(
    imageIDs,
  )}) AND width IS NOT NULL AND height IS NOT NULL`;

  return files;
}
