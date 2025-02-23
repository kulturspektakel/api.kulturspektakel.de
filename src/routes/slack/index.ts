import {Hono} from 'hono';
import lagerschluessel from './lagerschluessel';
import twofactor from './twofactor';
import owntracks from './owntracks';
import events from './events';
import token from './token';
import interaction from './interaction';
import gmailNotification from './gmailNotification';
import mailingList from './mailingList';

const app = new Hono();

app.route('/interaction', interaction);
app.route('/token', token);
app.route('/events', events);
app.route('/owntracks', owntracks);
app.route('/twofactor', twofactor);
app.route('/lagerschluessel', lagerschluessel);
app.route('/gmail-notification', gmailNotification);
app.route('/mailingliste', mailingList);

export default app;
