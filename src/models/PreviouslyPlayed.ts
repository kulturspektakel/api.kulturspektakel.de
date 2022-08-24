import {PreviouslyPlayed as PreviouslyPlayedValues} from '@prisma/client';
import {builder} from '../pothos/builder';
import './BandApplicationRating';

export default builder.enumType('PreviouslyPlayed', {
  values: Object.values(PreviouslyPlayedValues),
});
