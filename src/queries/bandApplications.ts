import {extendType, nonNull} from 'nexus';
import authorization from '../utils/authorization';

export default extendType({
  type: 'Query',
  definition: (t) => {
    t.nonNull.list.nonNull.field('bandApplications', {
      type: 'BandApplication',
      args: {
        eventYear: nonNull('Int'),
      },
      authorize: authorization('user'),
      resolve: (_root, {eventYear}, {prisma}) =>
        prisma.bandApplication.findMany({
          where: {
            eventYear,
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),
    });
  },
});
