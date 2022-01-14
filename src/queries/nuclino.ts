import {extendType, nonNull, objectType} from 'nexus';
import authorization from '../utils/authorization';
import {markdown, getCell, search} from '../utils/nuclino';

const NuclinoPage = objectType({
  name: 'NuclinoPage',
  definition(t) {
    t.nonNull.field('id', {type: 'ID'});
    t.nonNull.field('title', {type: 'String'});
    t.nonNull.field('updatedAt', {type: 'DateTime'});
    t.nonNull.field('content', {
      type: 'String',
      resolve: ({id}, _args, {prisma}) => markdown(prisma, id),
    });
  },
});

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('nuclinoPages', {
      type: objectType({
        name: 'NuclinoSearchResult',
        definition(t) {
          t.nonNull.field('page', {
            type: NuclinoPage,
            resolve: async ({id}) => {
              const page = await getCell(id);
              return {...page, id};
            },
          });
          t.nonNull.field('highlight', {type: 'String'});
        },
      }),
      args: {
        query: nonNull('String'),
      },
      authorize: authorization('user'),
      resolve: async (_root, {query}, {prisma}) => search(prisma, query),
    });

    t.field('nuclinoPage', {
      type: NuclinoPage,
      args: {
        id: nonNull('ID'),
      },
      authorize: authorization('user'),
      resolve: async (_root, {id}) => {
        const page = await getCell(id);
        return {...page, id};
      },
    });
  },
});
