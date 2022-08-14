import {builder} from '../pothos/builder';

export default builder.enumType('TimeGrouping', {
  values: ['Hour', 'Day'] as const,
});
