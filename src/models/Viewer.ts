import {objectType} from 'nexus';
import {Viewer} from 'nexus-prisma';

export default objectType({
  name: 'Viewer',
  definition(t) {
    t.field(Viewer.id);
    t.field(Viewer.displayName);
    t.field(Viewer.email);
    t.field(Viewer.profilePicture);
  },
});
