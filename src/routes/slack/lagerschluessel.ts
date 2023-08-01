import express, {Request} from 'express';
import {Router} from '@awaitjs/express';
import {SlackSlashCommandRequest} from './token';
import fetch from 'node-fetch';
import env from '../../utils/env';
import prismaClient from '../../utils/prismaClient';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

const router = Router({});

router.postAsync(
  '/lagerschluessel/update',
  // @ts-ignore postAsync is not typed correctly
  express.json(),
  async (
    req: Request<
      any,
      any,
      {
        positionType: string;
        verticalAccuracy: number;
        longitude: number;
        floorLevel: number;
        isInaccurate: boolean;
        isOld: boolean;
        horizontalAccuracy: number;
        latitude: number;
        timeStamp: number;
        altitude: number;
        locationFinished: boolean;
      }
    >,
    res,
  ) => {
    console.log(req.body);
    const timeStamp = new Date(req.body.timeStamp);
    await prismaClient.itemLocation.upsert({
      where: {
        timeStamp,
      },
      create: {
        timeStamp,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        payload: req.body,
      },
      update: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
    });
    res.sendStatus(200);
  },
);

router.postAsync(
  '/lagerschluessel',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (req: SlackSlashCommandRequest, res) => {
    const {latitude, longitude, timeStamp} =
      await prismaClient.itemLocation.findFirstOrThrow({
        orderBy: {
          timeStamp: 'desc',
        },
      });
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const image_url = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${env.GOOGLE_MAPS_KEY}&language=de`;

    const apiRequest = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env.GOOGLE_MAPS_KEY}`,
    );

    const data = await apiRequest.json();
    const address =
      data.results.at(0)?.formatted_address ?? 'Unbekannte Position';

    res.status(200).json({
      text: 'Lagerschlüssel Position',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Der Lagerschlüssel wurde zuletzt vor ${ago(
              timeStamp,
            )} Minuten in <${mapLink}|${address}> gesehen.`,
          },
        },
        {
          type: 'image',
          title: {
            type: 'plain_text',
            text: address,
            emoji: true,
          },
          image_url,
          alt_text: 'Karte mit Position des Lagerschlüssels',
        },
      ],
    });
  },
);

function ago(d: Date) {
  const minutes = differenceInMinutes(new Date(), d);
  if (minutes < 60) {
    return `${minutes} Minuten`;
  }
  const hours = differenceInHours(new Date(), d);
  if (hours < 24) {
    return `${hours} Stunden`;
  }
  const days = differenceInDays(new Date(), d);
  return `${days} Tage`;
}

export default router;
