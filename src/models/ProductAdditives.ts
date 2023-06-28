import {builder} from '../pothos/builder';

export default builder.prismaObject('ProductAdditives', {
  fields: (t) => ({
    id: t.exposeID('id'),
    displayName: t.exposeString('displayName'),
  }),
});
