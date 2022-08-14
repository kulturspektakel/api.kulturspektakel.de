import {OrderPayment} from '@prisma/client';
import {builder} from '../pothos/builder';

export default builder.enumType('OrderPayment', {
  values: Object.values(OrderPayment),
});
