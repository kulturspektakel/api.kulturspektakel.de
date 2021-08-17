import {objectType} from 'nexus';
import {Viewer} from 'nexus-prisma';
import Node from './Node';

export default objectType({
  name: 'Viewer',
  definition(t) {
    t.field(Viewer.id);
    t.implements(Node);
    t.field(Viewer.displayName);
    t.field(Viewer.email);
    t.field(Viewer.profilePicture);
  },
});
