import {createHash} from 'crypto';
import {TextEncoder} from 'util';
import env from './env';

type CardPaylaod = {
  cardId: string;
  balance: number;
  deposit: number;
  counter?: number;
};

export function parsePayload(payload: string): CardPaylaod {
  return payload.length === 23
    ? parseUltralightPayload(payload)
    : parseClassicPayload(payload);
}

export function parseClassicPayload(payload: string): CardPaylaod {
  // 5A556BAE/570005c8fa54848
  const match = payload.match(/([0-9A-F]{8})\/(\d{4})(\d{1})([0-9a-f]{10})/);
  if (match?.length === 5) {
    const data = {
      cardId: match[1],
      balance: parseInt(match[2], 10),
      deposit: parseInt(match[3], 10),
    };

    const hash = createHash('sha1')
      .update(
        `${data.balance}${data.deposit}${data.cardId}${env.CONTACTLESS_SALT}`,
      )
      .digest('hex')
      .substring(0, 10);

    if (hash === match[4]) {
      return data;
    } else {
      throw new Error('Invalid signature');
    }
  }
  throw new Error('Invalid payload');
}

export function parseUltralightPayload(payload: string): CardPaylaod {
  // U5XVlgH+QAIAACoSZ0gXXKQ
  if (payload.length !== 23) {
    throw new Error('Wrong payload length');
  }
  const payloadBuffer = Buffer.from(payload, 'base64');

  const counter = payloadBuffer.slice(7, 9);
  const deposit = payloadBuffer.slice(9, 10);
  const balance = payloadBuffer.slice(10, 12);
  const cardID = payloadBuffer.slice(0, 7);
  const signature = payloadBuffer.slice(12);

  const buffer = new Uint8Array([
    ...cardID,
    ...counter,
    ...deposit,
    ...balance,
    ...new TextEncoder().encode(env.CONTACTLESS_SALT),
  ]);
  const hash = createHash('sha1').update(buffer).digest().subarray(0, 5);

  if (Buffer.compare(signature, hash) === 0) {
    return {
      cardId: Array.from(cardID)
        .map((x) => x.toString(16).padStart(2, '0').toUpperCase())
        .join(''),
      balance: balance.readUInt16LE(),
      deposit: deposit.readUInt8(),
      counter: counter.readUInt16LE(),
    };
  }
  throw new Error('Invalid signature');
}
