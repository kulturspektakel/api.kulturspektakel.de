import {enumType} from 'nexus';
import {OrderPayment} from '@prisma/client';

export default enumType({
  name: 'OrderPayment',
  members: Object.values(OrderPayment),
});
