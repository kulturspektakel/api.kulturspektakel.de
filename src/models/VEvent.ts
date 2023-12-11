import {VEvent, getEventEndFromDuration} from 'ts-ics';
import {builder} from '../pothos/builder';

export default builder.objectRef<VEvent>('VEvent').implement({
  fields: (t) => ({
    uid: t.exposeString('uid'),
    start: t.field({
      type: 'DateTime',
      resolve: (root) => root.start.date,
    }),
    end: t.field({
      type: 'DateTime',
      resolve: (root) =>
        root.end?.date ??
        getEventEndFromDuration(root.start.date, root.duration!),
    }),
    summary: t.exposeString('summary'),
    location: t.exposeString('location', {nullable: true}),
    url: t.exposeString('url', {nullable: true}),
    comment: t.exposeString('comment', {nullable: true}),
    allDay: t.field({
      type: 'Boolean',
      resolve: (root) => root.start.type === 'DATE',
    }),
  }),
});
