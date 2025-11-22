import {DeviceType} from '../../types/prisma/enums';
import {builder} from '../pothos/builder';

export default builder.enumType('DeviceType', {
  values: Object.values(DeviceType),
});
