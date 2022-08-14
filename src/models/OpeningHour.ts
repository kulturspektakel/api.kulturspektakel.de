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
