import {builder} from '../pothos/builder';

builder.prismaNode('Product', {
  id: {field: 'id'},
  fields: (t) => ({
    name: t.exposeString('name'),
    genre: t.exposeString('genre'),
    startTime: t.expose('startTime', {type: 'DateTime'}),
    endTime: t.expose('endTime', {type: 'DateTime'}),
    description: t.exposeString('description', {nullable: true}),
  }),
});

// export default objectType({
//   name: 'Band',
//   definition(t) {
//     t.nonNull.field('id', {
//       type: 'ID',
//     });
//     t.nonNull.field('name', {
//       type: 'String',
//     });
//     t.field('genre', {
//       type: 'String',
//     });
//     t.nonNull.field('startTime', {
//       type: 'DateTime',
//     });
//     t.nonNull.field('endTime', {
//       type: 'DateTime',
//     });
//     t.field('description', {
//       type: 'String',
//     });
//   },
// });
