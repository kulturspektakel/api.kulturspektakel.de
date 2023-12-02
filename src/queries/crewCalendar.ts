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
        'https://calendar.google.com/calendar/ical/kulturspektakel.de_r2rcls69e282dtq2dq19keu7o4%40group.calendar.google.com/private-df072e4d5a0624624d47d3af04deb9de/basic.ics',
      )
        .then((res) => res.text())
        .then(
          (text) =>
            icsCalendarToObject(text).events?.filter(
              (e) =>
                includePastEvents ||
                e.start.date.getTime() > new Date().getTime(),
            ) ?? [],
        ),
  }),
);
