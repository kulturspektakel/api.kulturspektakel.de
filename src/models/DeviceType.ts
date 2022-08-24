import {DeviceType} from '@prisma/client';
import {builder} from '../pothos/builder';

export default builder.enumType('DeviceType', {
  values: Object.values(DeviceType),
});
