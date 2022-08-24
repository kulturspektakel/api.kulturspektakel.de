import '../models/Area';
import '../models/BandApplication';
import '../models/BandPlaying';
import '../models/CardTransaction';
import '../models/Device';
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

import '../queries/config';
import '../queries/distanceToKult';
import '../queries/viewer';

import {builder} from './builder';

export default builder.toSchema({});
