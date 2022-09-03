import '../models/Area';
import '../models/BandApplication';
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
import '../mutations/createOrder';
import '../mutations/markBandApplicationContacted';
import '../mutations/rateBandApplication';
import '../mutations/updateDeviceProductList';
import '../mutations/upsertProductList';

import '../queries/areas';
import '../queries/cardStatus';
import '../queries/config';
import '../queries/devices';
import '../queries/distanceToKult';
import '../queries/nuclino';
import '../queries/productLists';
import '../queries/transactions';
import '../queries/viewer';

import {builder} from './builder';

export default builder.toSchema({});
