import prismaClient from '../src/utils/prismaClient';
import fs from 'fs';
import {join} from 'path';
import {OrderPayment} from '@prisma/client';

const dir = '/Users/danielbuechele/Dropbox (Personal)/Schrake iPad/';
(async () => {
  const files = await fs.promises.readdir(dir);

  for (const file of files) {
    const data = await fs.promises.readFile(join(dir, file));
    await insert(data.toString('utf-8'));
  }
})();

async function insert(a: string) {
  a = a.replace(/kultButler\.OrderItemInput\(graphQLMap:/g, '');
  a = a.replace(/Optional\((["ÄÖÜäöüßA-Za-z0-9-\.\s:]+)\)/g, (_, b) => b);
  a = a.replace(/Optional\((["ÄÖÜäöüßA-Za-z0-9-\.\s:]+)\)/g, (_, b) => b);
  a = a.replace(/Optional\(/g, '');
  a = a.replace(/\)/g, '');
  a = a.replace(/nil/g, 'null');
  a = a.replace(/\[/g, '{');
  a = a.replace(/\]/g, '}');
  a = a.replace(/kultButler\.OrderPayment\.([A-Za-z])+/, (a) => `"${a}"`);
  a = a.replace('}}}', '}]}');
  a = a.replace('"products": {', '"products": [');
  a = a.replace('"products": [}', '"products": []');
  a = a.replace('}}', '}]');

  try {
    const b: {
      payment: string;
      deposit: number;
      clientId: string;
      deviceTime: string;
      products: Array<{
        amount: number;
        perUnitPrice: number;
        productListId: number;
        note: string | null;
        name: string;
      }>;
    } = JSON.parse(a);

    console.log(b.clientId);
    return prismaClient.order.create({
      data: {
        deviceTime: b.deviceTime,
        clientId: b.clientId,
        payment: pay(b.payment),
        device: {
          connect: {
            id: 'import',
          },
        },
        items: {
          createMany: {
            data: b.products,
          },
        },
      },
    });
  } catch (e) {
    console.error(a);
  }
}

function pay(p: string): OrderPayment {
  switch (p) {
    case 'kultButler.OrderPayment.cash':
      return OrderPayment.CASH;
    case 'kultButler.OrderPayment.bon':
      return OrderPayment.BON;
    case 'kultButler.OrderPayment.sumUp':
      return OrderPayment.SUM_UP;
    case 'kultButler.OrderPayment.voucher':
      return OrderPayment.VOUCHER;
    case 'kultButler.OrderPayment.freeCrew':
      return OrderPayment.FREE_CREW;
    case 'kultButler.OrderPayment.freeBand':
      return OrderPayment.FREE_BAND;
    default:
      throw new Error(p);
  }
}
