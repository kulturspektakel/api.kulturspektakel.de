import {builder} from '../pothos/builder';

export default builder.prismaNode('Viewer', {
  id: {field: 'id'},
  authScopes: {
    user: true,
  },
  fields: (t) => ({
    displayName: t.exposeString('displayName'),
    email: t.exposeString('email'),
    profilePicture: t.exposeString('profilePicture', {nullable: true}),
  }),
});
