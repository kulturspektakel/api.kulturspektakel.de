import {Hono} from 'hono';
import {Context} from '../../context';
import lagerschluessel from './lagerschluessel';
import twofactor from './twofactor';
import owntracks from './owntracks';
import events from './events';
import token from './token';
import interaction from './interaction';

const app = new Hono<{Variables: Context}>();

app.route('/interaction', interaction);
app.route('/token', token);
app.route('/events', events);
app.route('/owntracks', owntracks);
app.route('/twofactor', twofactor);
app.route('/lagerschluessel', lagerschluessel);

export default app;
