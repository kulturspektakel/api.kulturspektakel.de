import {interfaceType} from 'nexus';
import {NexusGenAbstractTypeMembers} from '../../types/api';

export default interfaceType({
  name: 'Node',
  resolveType: (node) =>
    ((node as any) as {__typename: NexusGenAbstractTypeMembers['Node']})
      .__typename,
  definition(t) {
    t.nonNull.id('id', {
      description: 'Unique identifier for the resource',
      resolve: (node) => (node as any).id,
    });
  },
});
