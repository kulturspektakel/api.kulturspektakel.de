import {PreviouslyPlayed} from '../../types/prisma/enums';
import {builder} from '../pothos/builder';
import './BandApplicationRating';

export default builder.enumType('PreviouslyPlayed', {
  values: Object.values(PreviouslyPlayed),
});
