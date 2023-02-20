import {builder} from '../pothos/builder';
import prismaClient from '../utils/prismaClient';

const ObfuscatedBandApplication = builder
  .objectRef<{
    obfuscatedEmail: string;
    applicationTime: Date;
  }>('ObfuscatedBandApplication')
  .implement({
    fields: (t) => ({
      obfuscatedEmail: t.exposeString('obfuscatedEmail'),
      applicationTime: t.field({
        type: 'DateTime',
        resolve: ({applicationTime}) => applicationTime,
      }),
    }),
  });

builder.queryField('checkDuplicateApplication', (t) =>
  t.field({
    type: ObfuscatedBandApplication,
    nullable: true,
    args: {
      bandname: t.arg.string({required: true}),
      eventId: t.arg.string({required: true}),
    },
    resolve: async (_root, {bandname, eventId}) => {
      const application = await prismaClient.bandApplication.findFirst({
        where: {
          bandname: {
            equals: bandname,
            mode: 'insensitive',
          },
          eventId,
        },
      });

      if (application == null) {
        return null;
      }

      return {
        obfuscatedEmail: application.email
          .split('@')
          .map((s, i) => {
            let tld = '';
            if (i === 1 && s.indexOf('.') > -1) {
              tld = '.' + s.split('.').pop();
            }
            return s.charAt(0) + '***' + tld;
          })
          .join('@'),
        applicationTime: application.createdAt,
      };
    },
  }),
);
