import {builder} from '../pothos/builder';
import {icsCalendarToObject} from 'ts-ics';
import VEvent from '../models/VEvent';
import {startOfDay, isAfter} from 'date-fns';

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
                  isAfter(startOfDay(e.start.date), startOfDay(new Date())),
              )
              // Google Calendar escapes commas in the location field with a backslash
              .map((e) => ({...e, location: e.location?.replace(/\\,/g, ',')}))
              .sort(
                (a, b) => a.start.date.getTime() - b.start.date.getTime(),
              ) ?? [],
        ),
  }),
);
