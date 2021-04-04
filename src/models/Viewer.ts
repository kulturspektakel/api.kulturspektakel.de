import {objectType} from 'nexus';

export default objectType({
  name: 'Viewer',
  definition(t) {
    t.model.displayName();
    t.model.email();
    t.model.profilePicture();
  },
});
