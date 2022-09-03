import {builder} from '../pothos/builder';
import {
  APIObjectWithContent,
  item,
  items,
  NuclinoSearchResult as NuclinoSearchResultT,
  user,
  NuclinoUser as NuclinoUserT,
  APIObject,
} from '../utils/nuclino';

const NuclinoUser = builder.objectRef<NuclinoUserT>('NuclinoUser').implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    email: t.exposeString('email'),
  }),
});

const NuclinoPage = builder.objectRef<APIObject>('NuclinoPage').implement({
  fields: (t) => ({
    id: t.exposeString('id'),
    title: t.exposeString('title'),
    lastUpdatedAt: t.field({
      type: 'DateTime',
      resolve: ({lastUpdatedAt}) => new Date(lastUpdatedAt),
    }),
    lastUpdatedUser: t.field({
      type: NuclinoUser,
      resolve: (root) => user(root.lastUpdatedUserId),
    }),
    content: t.field({
      type: 'String',
      resolve: async (root) => {
        if (root.hasOwnProperty('content')) {
          return (root as APIObjectWithContent).content;
        }
        const page = await item(root.id);
        return page.content;
      },
    }),
  }),
});

const NuclinoSearchResult = builder
  .objectRef<NuclinoSearchResultT>('NuclinoSearchResult')
  .implement({
    fields: (t) => ({
      page: t.field({
        type: NuclinoPage,
        resolve: (res) => res,
      }),
      highlight: t.exposeString('highlight'),
    }),
  });

builder.queryField('nuclinoPages', (t) =>
  t.field({
    type: [NuclinoSearchResult],
    args: {
      query: t.arg({type: 'String', required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: async (_root, {query}) => {
      const res = await items({search: query, limit: 20});
      return res.filter((i) => i.object === 'item');
    },
  }),
);

builder.queryField('nuclinoPage', (t) =>
  t.field({
    type: NuclinoPage,
    args: {
      id: t.arg({type: 'String', required: true}),
    },
    authScopes: {
      user: true,
    },
    resolve: (_root, {id}) => item(id),
  }),
);
