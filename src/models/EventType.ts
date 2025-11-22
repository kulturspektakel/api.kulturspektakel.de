import {EventType} from '../../types/prisma/enums';
import {builder} from '../pothos/builder';

export default builder.enumType('EventType', {
  values: Object.values(EventType),
});
