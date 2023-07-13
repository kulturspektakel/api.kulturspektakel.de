import {Router} from '@awaitjs/express';
import {Viewer} from '@prisma/client';
import express, {Request} from 'express';
import env from '../utils/env';
import {createHash} from 'crypto';
import prismaClient from '../utils/prismaClient';
import {sub} from 'date-fns';
import jimp from 'jimp';
import viewerIdFromToken from '../utils/viewerIdFromToken';

const router = Router({});

enum LocatorPriority {
  NoPower = 0, // best accuracy possible with zero additional power consumption (Android)
  LowPower = 1, // city level accuracy (Android)
  BalancedPower = 2, // block level accuracy based on Wifi/Cell (Android)
  HighPower = 3, // most accurate accuracy based on GPS (Android)
}

enum Mode {
  MQTT = 0, // (iOS, Android)
  HTTP = 3, // (iOS, Android)
}

enum Monitoring {
  Quiet = -1,
  Manual = 0,
  Significant = 1,
  Move = 2,
}

enum MqttProtocolLevel {
  MQTT_3 = 3, // 3 (default)
  MQTT_3_1_1 = 4, // 3.1.1
  MQTT_5 = 5, // 5 (iOS only)
}

type ConfigurationMessage = {
  _type: 'configuration';
  // Respond to reportLocation cmd message (iOS,Android/boolean)
  allowRemoteLocation: boolean;
  //  disable TLS certificate checks insecure (iOS/boolean)
  allowinvalidcerts: boolean;
  // Use username and password for endpoint authentication (iOS,Android/boolean)
  auth: boolean;
  // Autostart the app on device boot (Android/boolean)
  autostartOnBoot: boolean;
  // MQTT endpoint clean session (iOS,Android/boolean)
  cleanSession: boolean;
  // client id to use for MQTT connect. Defaults to "user deviceId" (iOS,Android/string)
  clientId: string;
  // Name of the client pkcs12 file (iOS/string)
  clientpkcs: string;
  // Respond to cmd messages (iOS,Android/boolean)
  cmd: boolean;
  // id of the device used for pubTopicBase and clientId construction. Defaults to the os name of the device (iOS,Android/string)
  deviceId: string;
  // battery level below which to downgrade monitoring from move mode (iOS/integer/percent/optional)
  downgrade?: number;
  // Add extended data attributes to location messages (iOS,Android/boolean)
  extendedData: boolean;
  // MQTT endpoint host (iOS,Android/string)
  host: string;
  // Location accuracy below which reports are supressed (iOS,Android/integer/meters)
  ignoreInaccurateLocations: number;
  // Number of days after which location updates are assumed stale (iOS,Android/integer/days)
  ignoreStaleLocations: number;
  // MQTT endpoint keepalive (iOS,Android/integer/seconds)
  keepalive: number;
  // maximum distance between location source updates (iOS,Android/integer/meters)
  locatorDisplacement: number;
  // maximum interval between location source updates (iOS,Android/integer/seconds)
  locatorInterval: number;
  // source/power setting for location updates (Android/integer/)
  locatorPriority: LocatorPriority;
  // Locks settings screen on device for editing (iOS/boolean)
  locked: boolean;
  // Number of notifications to store historically. Zero (0) means no notifications are stored and history tab is hidden. Defaults to zero. (iOS/integer)
  maxHistory: number;
  // Endpoint protocol mode (iOS,Android/integer)
  mode: Mode;
  //Location reporting mode (iOS,Android/integer)
  monitoring: Monitoring;
  // MQTT broker protocol level (iOS,Android/integer)
  mqttProtocolLevel: MqttProtocolLevel;
  //Show last reported location in ongoing notification (Android/boolean)
  notificationLocation: boolean;
  //API key for alternate Geocoding provider. See https://opencagedata.com/ for details. (Android/string)
  opencageApiKey: string;
  // Passphrase of the client pkcs12 file (iOS/string)
  passphrase: string;
  // Endpoint password (iOS,Android/string)
  password: string;
  // Interval in which location messages of with t:p are reported (Android/integer)
  ping: number;
  // MQTT endpoint port (iOS,Android/integer)
  port: number;
  // Number of locations to keep and display (iOS/integer)
  positions: number;
  // MQTT topic base to which the app publishes; %u is replaced by the user name, %d by device (iOS,Android/string)
  pubTopicBase: string;
  // MQTT retain flag for reported messages (iOS,Android/boolean)
  pubRetain: boolean;
  // MQTT QoS level for reported messages (iOS,Android/integer)
  pubQos: number;
  // Beacon ranging (iOS/boolean)
  ranging: boolean;
  // Allow remote configuration by sending a setConfiguration cmd message (Android/boolean)
  remoteConfiguration: boolean;
  // Blank separated list of certificate file names in DER format (iOS/string)
  servercer: string;
  // subscribe to subTopic via MQTT (iOS,Android/boolean)
  sub: boolean;
  // A whitespace separated list of MQTT topics to which the app subscribes if sub is true (defaults see topics) (iOS,Android/string)
  subTopic: string;
  // (iOS,Android/boolean)
  subQos: boolean;
  // Two digit Tracker ID used to display short name and default face of a user (iOS,Android/string)
  tid: string;
  // MQTT endpoint TLS connection (iOS,Android/boolean)
  tls: boolean;
  // Passphrase of the client pkcs12 file (Android/string)
  tlsClientCrtPassword: string;
  // HTTP endpoint URL to which messages are POSTed (iOS,Android/string)
  url: string;
  // Endpoint username (iOS,Android/string)
  username: string;
  // willRetain: ?,
  // willTopic: ?,
  // willQos: ?,
  // Array of waypoint messages (iOS,Android/array)
  waypoints: Array<Waypoint>;
};

type Waypoint = {
  // Name of the waypoint that is included in the sent transition message, copied into the location message inregions array when a current position is within a region. (iOS,Android,string/required)
  desc: string;
  // Timestamp of creation of region, copied into the wtst element of the transition message (iOS,Android/integer/epoch/required)
  tst: number;
  // region ID, created automatically, copied into the location payload inrids array (iOS/string)
  rid?: number;
} & (
  | {
      // UUID of the BLE Beacon (iOS/string/optional)
      uuid: string;
      // Major number of the BLE Beacon (iOS/integer/optional)
      major: number;
      // Minor number of the BLE Beacon_(iOS/integer/optional)_
      minor: number;
      // region ID, created automatically, copied into the location payload inrids array (iOS/string)
    }
  | {
      // Latitude (iOS,Android/float/meters/optional)
      lat: number;
      // Longitude (iOS,Android/float/meters/optional)
      lon: number;
      // Radius around the latitude and longitude coordinates (iOS,Android/integer/meters/optional)
      rad: number;
    }
  | {}
);

enum BatteryStatus {
  Unknown = 0,
  Unplugged = 1,
  Charging = 2,
  Full = 3,
}

type LocationMessage = {
  _type: 'location';
  // Accuracy of the reported location in meters without unit (iOS,Android/integer/meters/optional)
  acc?: number;
  // Altitude measured above sea level (iOS,Android/integer/meters/optional)
  alt?: number;
  // Device battery level (iOS,Android/integer/percent/optional)
  batt?: number;
  // Battery Status 0=unknown, 1=unplugged, 2=charging, 3=full (iOS, Android)
  bs: BatteryStatus;
  // Course over ground (iOS/integer/degree/optional)
  cog?: number;
  // latitude (iOS,Android/float/degree/required)
  lat: number;
  // longitude (iOS,Android/float/degree/required)
  lon: number;
  // radius around the region when entering/leaving (iOS/integer/meters/optional)
  rad?: number;
  // trigger for the location report (iOS,Android/string/optional)
  t?: Trigger;
  // Tracker ID used to display the initials of a user (iOS,Android/string/optional) required for http mode
  tid: string;
  //  UNIX epoch timestamp in seconds of the location fix (iOS,Android/integer/epoch/required)
  tst: number;
  //  vertical accuracy of the alt element (iOS/integer/meters/optional)
  vac?: number;
  //  velocity (iOS,Android/integer/kmh/optional)
  vel?: number;
  //  barometric pressure (iOS/float/kPa/optional/extended data)
  p?: number;
  //  point of interest name (iOS/string/optional)
  poi?: string;
  //  Internet connectivity status (route to host) when the message is created (iOS,Android/string/optional/extended data)
  conn?: Connectivity;
  // name of the tag (iOS/string/optional)
  tag?: string;
  // (only in HTTP payloads) contains the original publish topic (e.g. owntracks/jane/phone). (iOS,Android >= 2.4,string)
  topic?: string;
  // contains a list of regions the device is currently in (e.g. ["Home","Garage"]). Might be empty. (iOS,Android/list of strings/optional)
  inregions?: Array<string>;
  // contains a list of region IDs the device is currently in (e.g. ["6da9cf","3defa7"]). Might be empty. (iOS,Android/list of strings/optional)
  inrids?: Array<string>;
  //if available, is the unique name of the WLAN. (iOS,string/optional)
  SSID?: string;
  // if available, identifies the access point. (iOS,string/optional)
  BSSID?: string;
  // identifies the time at which the message is constructed (vs. tst which is the timestamp of the GPS fix) (iOS,Android)
  created_at: number;
  // identifies the monitoring mode at which the message is constructed (significant=1, move=2) (iOS/integer/optional)
  m?: MonitoringMode;
};

type WaypointsMessage = {
  _type: 'waypoints';
  _creator?: string;
  waypoints: Array<Waypoint>;
};

type WaypointMessage = {_type: 'waypoint'} & Waypoint;

enum Trigger {
  Ping = 'p', // ping issued randomly by background task (iOS,Android)
  Circular = 'c', // circular region enter/leave event (iOS,Android)
  Beacon = 'b', // beacon region enter/leave event (iOS)
  Response = 'r', // response to a reportLocation cmd message (iOS,Android)
  Manuarl = 'u', // manual publish requested by the user (iOS,Android)
  Timer = 't', // timer based publish in move move (iOS)
  SystemUpdate = 'v', // updated by Settings/Privacy/Locations Services/System Services/Frequent Locations monitoring (iOS)
}

enum MonitoringMode {
  Significant = 1,
  Move = 2,
}

enum Connectivity {
  Wifi = 'w', // phone is connected to a WiFi connection (iOS,Android)
  Offline = 'o', // phone is offline (iOS,Android)
  Cellular = 'm', // mobile data (iOS,Android)
}

type CardMessage = {
  _type: 'card';
  name: string;
  tid: string;
  face: string;
};

router.get('/config', (req: Request<any, any, any, {config: string}>, res) =>
  res.redirect(`owntracks:///config?inline=${req.query.config}`),
);

router.postAsync(
  '/',
  // @ts-ignore postAsync is not typed correctly
  express.json(),
  async (
    req: Request<
      any,
      any,
      WaypointMessage | WaypointsMessage | LocationMessage
    >,
    res,
  ) => {
    if (req._parsedToken?.iss !== 'owntracks') {
      return res.status(401);
    }

    const viewerId = await viewerIdFromToken(req._parsedToken);
    if (!viewerId) {
      return res.status(401);
    }

    if (req.body._type === 'location') {
      await prismaClient.viewerLocation.create({
        data: {
          latitude: req.body.lat,
          longitude: req.body.lon,
          viewerId,
          createdAt: new Date(req.body.tst * 1000),
          payload: req.body,
        },
      });
    }

    const where = {
      createdAt: {
        gt: sub(new Date(), {hours: 5}),
      },
    };
    const viewers = await prismaClient.viewer.findMany({
      include: {
        ViewerLocation: {
          where,
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      where: {
        ViewerLocation: {
          some: where,
        },
      },
    });

    const data = viewers.flatMap(async (viewer) => {
      const face = await faceBase64(viewer);

      const card: CardMessage = {
        _type: 'card',
        name: viewer.displayName,
        tid: tid(viewer),
        face,
      };
      if (viewer.id == viewerId) {
        // don't send own location
        return [card];
      }

      const location: LocationMessage = {
        _type: 'location',
        tid: tid(viewer),
        lat: viewer.ViewerLocation[0].latitude,
        lon: viewer.ViewerLocation[0].longitude,
        tst: Math.floor(viewer.ViewerLocation[0].createdAt.getTime() / 1000),
        topic: `owntracks/${viewer.id}`,
        created_at: Math.floor(
          viewer.ViewerLocation[0].createdAt.getTime() / 1000,
        ),
        bs: BatteryStatus.Unknown,
      };
      return [card, location];
    });

    return res.json(
      (await Promise.all(data)).flat(),
      // {
      //   _type: 'cmd',
      //   action: 'setConfiguration',
      //   configuration: {
      //     _type: 'configuration',
      //     mode: Mode.HTTP,
      //     url: 'https://faa7-2a01-4b00-8704-3d00-3198-70b-2cfd-5c90.ngrok-free.app/owntracks',
      //     monitoring: Monitoring.Move,
      //     auth: true,
      //     username: 'U03EKSJKH',
      //     password: 'test',
      //     tid: 'DX',
      //     cmd: true, // allow sending commands
      //   },
      // },
    );
  },
);

export function configString(viewer: Viewer) {
  const config: Partial<ConfigurationMessage> = {
    _type: 'configuration',
    mode: Mode.HTTP,
    url: 'https://api.kulturspektakel.de/owntracks',
    monitoring: Monitoring.Significant,
    auth: true,
    username: viewer.id,
    password: ownTracksPassword(viewer.id),
    tid: tid(viewer),
    cmd: true, // allow sending commands
  };

  return Buffer.from(JSON.stringify(config)).toString('base64');
}

export function ownTracksPassword(viewerId: string): string {
  return createHash('sha1')
    .update(`${viewerId}${env.JWT_SECRET}`)
    .digest('hex');
}

function tid(viewer: Viewer): string {
  return viewer.displayName
    .toLocaleUpperCase()
    .split(' ')
    .slice(0, 2)
    .map((a) => a.charAt(0))
    .join('');
}

async function faceBase64({profilePicture}: Viewer): Promise<string> {
  if (!profilePicture) {
    return '';
  }
  const jpg = await jimp.read(profilePicture);
  const png = await jpg.resize(100, 100).getBufferAsync(jimp.MIME_PNG);
  return png.toString('base64');
}

export default router;
