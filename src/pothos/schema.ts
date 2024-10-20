import '../models/Area';
import '../models/Asset';
import '../models/BandApplication';
import '../models/BandApplicationComment';
import '../models/BandPlaying';
import '../models/Card';
import '../models/CardTransaction';
import '../models/CardStatus';
import '../models/Device';
import '../models/DeviceType';
import '../models/Event';
import '../models/Order';
import '../models/OrderItem';
import '../models/Page';
import '../models/PreviouslyPlayed';
import '../models/Product';
import '../models/ProductAdditives';
import '../models/ProductList';
import '../models/SpotifyArtist';
import '../models/VEvent';
import '../models/Viewer';

import '../mutations/addBandApplicationTag';
import '../mutations/createBandApplication';
import '../mutations/createBandApplicationComment';
import '../mutations/createNonceRequest';
import '../mutations/createMembershipApplication';
import '../mutations/createOrder';
import '../mutations/deleteBandApplicationComment';
import '../mutations/markBandApplicationContacted';
import '../mutations/nonceFromRequest';
import '../mutations/rateBandApplication';
import '../mutations/removeBandApplicationTag';
import '../mutations/updateDeviceProductList';
import '../mutations/upsertProductList';
import '../mutations/updateBandApplication';

import '../queries/areas';
import '../queries/bandApplicationTags';
import '../queries/bandPlaying';
import '../queries/cardStatus';
import '../queries/checkDuplicateApplication';
import '../queries/config';
import '../queries/crewCalendar';
import '../queries/devices';
import '../queries/distanceToKult';
import '../queries/findBandPlaying';
import '../queries/events';
import '../queries/news';
import '../queries/nuclino';
import '../queries/productAdditives';
import '../queries/productLists';
import '../queries/spotifyArtist';
import '../queries/transactions';
import '../queries/viewer';

import {builder} from './builder';

export default builder.toSchema({});
