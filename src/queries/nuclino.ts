import {extendType, nonNull, objectType} from 'nexus';
import authorization from '../utils/authorization';
import {APIObjectWithContent, item, items} from '../utils/nuclino';

const NuclinoPage = objectType({
  name: 'NuclinoPage',
  definition(t) {
    t.nonNull.field('id', {type: 'ID'});
    t.nonNull.field('title', {type: 'String'});
    t.nonNull.field('lastUpdatedAt', {type: 'DateTime'});
    t.nonNull.field('content', {
      type: 'String',
      resolve: async (root) => {
        if (root.hasOwnProperty('content')) {
          return (root as APIObjectWithContent).content;
        }
        const page = await item(root.id);
        return page.content;
      },
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
          });
          t.nonNull.field('highlight', {type: 'String'});
        },
      }),
      args: {
        query: nonNull('String'),
      },
      authorize: authorization('user'),
      resolve: async (_root, {query}) => {
        const res = await items({search: query, limit: 20});
        return res
          .filter((i) => i.object === 'item')
          .map(({highlight, ...page}) => ({
            highlight,
            page,
          }));
      },
    });

    t.field('nuclinoPage', {
      type: NuclinoPage,
      args: {
        id: nonNull('ID'),
      },
      authorize: authorization('user'),
      resolve: async (_root, {id}) => item(id),
    });
  },
});
