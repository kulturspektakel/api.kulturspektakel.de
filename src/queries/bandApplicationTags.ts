import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('bandApplicationTags', (t) =>
  t.stringList({
    nullable: false,
    authScopes: {user: true},
    resolve: async () => {
      const data = await prismaClient.bandApplicationTag.groupBy({
        by: ['tag'],
        _count: {
          tag: true,
        },
        orderBy: {
          _count: {
            tag: 'desc',
          },
        },
      });

      return data.map((tag) => tag.tag);
    },
  }),
);
