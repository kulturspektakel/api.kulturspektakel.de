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
