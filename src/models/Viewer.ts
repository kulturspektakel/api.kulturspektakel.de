import {builder} from '../pothos/builder';

builder.prismaNode('Viewer', {
  id: {field: 'id'},
  fields: (t) => ({
    displayName: t.exposeString('displayName'),
    email: t.exposeString('email'),
    profilePicture: t.exposeString('profilePicture'),
  }),
});
