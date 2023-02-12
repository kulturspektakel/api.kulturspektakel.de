import {EventType} from '@prisma/client';
import {builder} from '../pothos/builder';

export default builder.enumType('EventType', {
  values: Object.values(EventType),
});
