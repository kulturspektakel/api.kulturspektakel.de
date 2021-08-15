import {objectType} from 'nexus';
import {BandApplication} from 'nexus-prisma';
import {URL} from 'url';
import Node from './Node';

export default objectType({
  name: 'BandApplication',
  definition(t) {
    t.field(BandApplication.id);
    t.implements(Node);
    t.field(BandApplication.bandname);
    t.field(BandApplication.genre);
    t.field(BandApplication.genreCategory);
    t.field(BandApplication.facebook);
    t.field(BandApplication.facebookLikes);
    t.field(BandApplication.description);
    t.field(BandApplication.contactName);
    t.field(BandApplication.contactPhone);
    t.field(BandApplication.email);
    t.field(BandApplication.city);
    t.field(BandApplication.demo);
    /*
    t.nonNull.field('embeddableDemo', {
      type: 'String',
      resolve: ({demo}) => {
        try {
          const url = new URL(demo);
          const domain = url.hostname
            .toLowerCase()
            .split('.')
            .slice(-2)
            .join('.');
          const firstPath = url.pathname.split('/')[1];
          switch (domain) {
            case 'youtube.com':
              switch (firstPath) {
                case 'watch':
                case 'channel':
                case 'c':
                case 'user':
                default:
                // probably a vanity URL
              }
              break;
            case 'youtu.be':
              break;
            case 'bandcamp.com':
              const match = url.hostname.match(/([^.]+)\.bandcamp\.com/i);
              if (match && match?.length > 1) {
              }
              // <iframe style="border: 0; width: 400px; height: 241px;" src="https://bandcamp.com/EmbeddedPlayer/album=2867773323/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/" seamless></iframe>
              break;
            case 'soundcloud.com':
              const username = firstPath;
              break;
            case 'spotify.com':
              break;
          }
        } catch (e) {
          return null;
        }
        return null;
      },
    });
    */
  },
});
