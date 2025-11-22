import {OrderPayment} from '../../types/prisma/enums';
import {builder} from '../pothos/builder';

export default builder.enumType('OrderPayment', {
  values: Object.values(OrderPayment),
});
