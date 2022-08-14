import {builder} from '../pothos/builder';

// export default objectType({
//   name: 'Event',
//   definition(t) {
//     // t.implements(Node);
//     // t.field(Event.id);
//     // t.field(Event.name);
//     // t.field(Event.start);
//     // t.field(Event.end);
//     // t.field(Event.bandApplicationStart);
//     // t.field(Event.bandApplicationEnd);
//     t.field('bandApplication', {
//       type: nonNull(list(nonNull('BandApplication'))),
//       resolve: ({id}, _, {prisma}) =>
//         prisma.bandApplication.findMany({
//           where: {
//             eventId: id,
//           },
//           orderBy: {
//             createdAt: 'asc',
//           },
//         }),
//       authorize: authorization('user'),
//     });
//   },
// });

builder.prismaNode('Event', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    start: t.expose('start', {type: 'DateTime'}),
    end: t.expose('end', {type: 'DateTime'}),

    bandApplicationStart: t.expose('bandApplicationStart', {
      type: 'DateTime',
      nullable: true,
    }),
    bandApplicationEnd: t.expose('bandApplicationEnd', {
      type: 'DateTime',
      nullable: true,
    }),
    bandApplication: t.relation('bandApplication', {
      // TODO auth
      query: () => ({
        orderBy: {
          createdAt: 'asc',
        },
      }),
    }),
  }),
});
