import {builder} from '../pothos/builder';

export default builder.prismaObject('AreaOpeningHour', {
  name: 'OpeningHour',
  fields: (t) => ({
    startTime: t.expose('startTime', {
      type: 'DateTime',
    }),
    endTime: t.expose('endTime', {
      type: 'DateTime',
    }),
  }),
});
