import {objectType} from 'nexus';
import {Event} from 'nexus-prisma';
import authorization from '../utils/authorization';
import Node from './Node';

export default objectType({
  name: 'Event',
  definition(t) {
    t.implements(Node);
    t.field(Event.name);
    t.field(Event.start);
    t.field(Event.end);
    t.field(Event.bandApplicationStart);
    t.field(Event.bandApplicationEnd);
    t.field({...Event.bandApplication, authorize: authorization('user')});
  },
});
