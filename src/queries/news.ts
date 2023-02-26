import News from '../models/News';
import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

builder.queryField('news', (t) =>
  t.prismaConnection({
    type: News,
    nodeNullable: false,
    nullable: false,
    cursor: 'slug',
    resolve: (query, _parent, args) =>
      prismaClient.news.findMany({
        ...query,
        orderBy: {createdAt: args.last != null ? 'asc' : 'desc'},
      }),
    totalCount: prismaClient.news.count,
  }),
);
