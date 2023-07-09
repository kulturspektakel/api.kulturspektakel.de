import {Router} from '@awaitjs/express';
import {Viewer} from '@prisma/client';
import express, {Request} from 'express';
import env from '../utils/env';
import {createHash} from 'crypto';
import prismaClient from '../utils/prismaClient';
import {sub} from 'date-fns';
import fetch from 'node-fetch';

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

    if (req.body._type === 'location') {
      await prismaClient.viewerLocation.create({
        data: {
          latitude: req.body.lat,
          longitude: req.body.lon,
          viewerId: req._parsedToken.viewerId,
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

export function configUrl(viewer: Viewer) {
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

  return `owntracks:///config?inline=${Buffer.from(
    JSON.stringify(config),
  ).toString('base64')}`;
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
  return 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAFm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iNjQiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iNjQiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI2NCIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjY0IgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjMtMDct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';
  // const response = await fetch(profilePicture);
  // const data = await response.buffer();
  // return data.toString('base64');
}

export default router;
