import {builder} from '../pothos/builder';
import {icsCalendarToObject} from 'ts-ics';
import VEvent from '../models/VEvent';

builder.queryField('crewCalendar', (t) =>
  t.field({
    type: [VEvent],
    args: {
      includePastEvents: t.arg.boolean(),
    },
    resolve: (_, {includePastEvents}) =>
      fetch(
        'https://calendar.google.com/calendar/ical/c_d5cfc52054d3dae0761245fee799a7c2c61691fb62554f30ea652adcca183304%40group.calendar.google.com/public/basic.ics',
      )
        .then((res) => res.text())
        .then(
          (text) =>
            icsCalendarToObject(text)
              .events?.filter(
                (e) =>
                  includePastEvents ||
                  e.start.date.getTime() > new Date().getTime(),
              )
              .sort(
                (a, b) => a.start.date.getTime() - b.start.date.getTime(),
              ) ?? [],
        ),
  }),
);
