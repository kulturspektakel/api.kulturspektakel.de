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
import '../models/PreviouslyPlayed';
import '../models/Product';
import '../models/ProductList';
import '../models/Viewer';

import '../mutations/createBandApplication';
import '../mutations/createBandApplicationComment';
import '../mutations/deleteBandApplicationComment';
import '../mutations/createOrder';
import '../mutations/markBandApplicationContacted';
import '../mutations/rateBandApplication';
import '../mutations/updateDeviceProductList';
import '../mutations/upsertProductList';
import '../mutations/updateBandApplication';

import '../queries/areas';
import '../queries/bandPlaying';
import '../queries/cardStatus';
import '../queries/checkDuplicateApplication';
import '../queries/config';
import '../queries/devices';
import '../queries/distanceToKult';
import '../queries/findBandPlaying';
import '../queries/events';
import '../queries/news';
import '../queries/nuclino';
import '../queries/productLists';
import '../queries/transactions';
import '../queries/viewer';

import {builder} from './builder';

export default builder.toSchema({});
