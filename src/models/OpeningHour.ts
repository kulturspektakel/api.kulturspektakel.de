import {builder} from '../pothos/builder';

export default builder
  .objectRef<{
    startTime: Date;
    endTime: Date;
  }>('OpeningHour')
  .implement({
    fields: (t) => ({
      startTime: t.field({
        type: 'DateTime',
        resolve: ({startTime}) => startTime,
      }),
      endTime: t.field({
        type: 'DateTime',
        resolve: ({endTime}) => endTime,
      }),
    }),
  });

// export default objectType({
//   name: 'OpeningHour',
//   definition(t) {
//     t.nonNull.field('startTime', {
//       type: 'DateTime',
//     });

//     t.nonNull.field('endTime', {
//       type: 'DateTime',
//     });
//   },
// });
