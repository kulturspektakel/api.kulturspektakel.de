import {IdentityProvider, ServiceProvider, setSchemaValidator} from 'samlify';
import {add, isPast} from 'date-fns';
import prismaClient from '../../utils/prismaClient';
import env from '../../utils/env';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Viewer} from '@prisma/client';
import {Hono, Context} from 'hono';
import {html} from 'hono/html';

const app = new Hono();

const replaceTagsByValue = (rawXML: string, tagValues: any): string => {
  Object.keys(tagValues).forEach((t) => {
    rawXML = rawXML.replace(new RegExp(`{${t}}`, 'g'), tagValues[t]);
  });
  return rawXML;
};

export const sp = ServiceProvider({
  entityID: `https://api.nuclino.com/api/sso/${env.NUCLINO_TEAM_ID}/metadata`,
  assertionConsumerService: [
    {
      Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      Location: `https://api.nuclino.com/api/sso/${env.NUCLINO_TEAM_ID}/acs`,
    },
  ],
});

setSchemaValidator({
  validate: (response: string) => {
    // TODO: check if makes sense
    return Promise.resolve('skipped');
  },
});

app.post('/login', async (c) => {
  const body = await c.req.parseBody<{password: string}>();

  if (!body.password || body.password !== env.NUCLINO_ANONYMOUS_PASSWORD) {
    return c.redirect('https://kult.wiki');
  }

  return await sendSAMLResponse(c, {
    email: 'info@kulturspektakel.de',
    displayName: 'Anonymer User',
  });
});

const idp = IdentityProvider({
  entityID: 'https://api.kulturspektakel.de/saml/login',
  privateKey: env.SAML_PRIVATE_KEY,
  signingCert: readFileSync(
    join(import.meta.dir, '..', '..', '..', 'artifacts', 'saml.crt'),
  ),
  isAssertionEncrypted: false,
  singleSignOnService: [
    {
      Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Post',
      Location: 'https://api.kulturspektakel.de/saml/login',
    },
  ],
  singleLogoutService: [
    {
      Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      Location: `https://api.kulturspektakel.de/saml/logout`,
    },
  ],
  nameIDFormat: ['urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'],
  loginResponseTemplate: {
    context:
      '<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="{ID}" Version="2.0" IssueInstant="{IssueInstant}" Destination="{Destination}" InResponseTo="{InResponseTo}"><saml:Issuer>{Issuer}</saml:Issuer><samlp:Status><samlp:StatusCode Value="{StatusCode}"/></samlp:Status><saml:Assertion ID="{AssertionID}" Version="2.0" IssueInstant="{IssueInstant}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"><saml:Issuer>{Issuer}</saml:Issuer><saml:Subject><saml:NameID Format="{NameIDFormat}">{NameID}</saml:NameID><saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml:SubjectConfirmationData NotOnOrAfter="{SubjectConfirmationDataNotOnOrAfter}" Recipient="{SubjectRecipient}" InResponseTo="{InResponseTo}"/></saml:SubjectConfirmation></saml:Subject><saml:Conditions NotBefore="{ConditionsNotBefore}" NotOnOrAfter="{ConditionsNotOnOrAfter}"><saml:AudienceRestriction><saml:Audience>{Audience}</saml:Audience></saml:AudienceRestriction></saml:Conditions>{AttributeStatement}</saml:Assertion></samlp:Response>',
    attributes: [
      {
        name: 'FirstName',
        valueTag: 'firstName',
        nameFormat: 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic',
        valueXsiType: 'xs:string',
      },
      {
        name: 'LastName',
        valueTag: 'lastName',
        nameFormat: 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic',
        valueXsiType: 'xs:string',
      },
    ],
  },
});

app.get('/logout', async (c) => {
  const parseResult = await idp.parseLogoutRequest(sp, 'redirect', {
    body: await c.req.parseBody(),
    query: c.req.query(),
  });

  const response = idp.createLogoutResponse(sp, parseResult, 'redirect', '');
  return c.text(response.context);
});

app.get('/login', async (c) => {
  let viewer: Viewer | undefined | null;
  const nonce = c.req.query('nonce');
  viewer = await viewerFromNonce(nonce);
  if (!nonce || !viewer) {
    return c.redirect('https://kult.wiki');
  }

  return await sendSAMLResponse(c, viewer);
});

async function sendSAMLResponse(
  c: Context,
  viewer: {
    displayName: string;
    email: string;
  },
) {
  const [firstName, ...lastNames] = viewer.displayName.split(' ');

  const parseResult = await idp.parseLoginRequest(sp, 'redirect', {
    body: await c.req.parseBody(),
    query: c.req.query(),
  });

  const {id, assertionConsumerServiceUrl, issueInstant, destination} =
    parseResult.extract.request;

  const response = await idp.createLoginResponse(
    sp,
    parseResult,
    'post',
    {},
    (samlResponse) => {
      const fiveMinutesLater = add(new Date(issueInstant), {minutes: 5});

      return {
        id,
        context: replaceTagsByValue(samlResponse, {
          ID: id,
          AssertionID: idp.entitySetting.generateID!(),
          Destination: destination,
          Audience: sp.entityMeta.getEntityID(),
          SubjectRecipient: destination,
          NameIDFormat: idp.entityMeta.getNameIDFormat()[0],
          Issuer: idp.entityMeta.getEntityID(),
          IssueInstant: issueInstant,
          ConditionsNotBefore: issueInstant,
          ConditionsNotOnOrAfter: fiveMinutesLater.toISOString(),
          SubjectConfirmationDataNotOnOrAfter: fiveMinutesLater.toISOString(),
          AssertionConsumerServiceURL: assertionConsumerServiceUrl,
          EntityID: sp.entityMeta.getEntityID(),
          InResponseTo: id,
          StatusCode: 'urn:oasis:names:tc:SAML:2.0:status:Success',
          NameID: viewer.email,
          attrFirstName: firstName,
          attrLastName: lastNames.join(' '),
        }),
      };
    },
  );

  return c.html(html`
    <form method="post" action="${assertionConsumerServiceUrl}">
      <input type="hidden" name="SAMLResponse" value="${response.context}" />
      <input
        type="hidden"
        name="RelayState"
        value="${c.req.query('RelayState')}"
      />
      <script type="text/javascript">
        (function () {
          document.forms[0].submit();
        })();
      </script>
    </form>
  `);
}

async function viewerFromNonce(nonce?: string) {
  if (!nonce) {
    return;
  }
  try {
    const {createdFor, expiresAt} = await prismaClient.nonce.delete({
      where: {nonce},
      select: {
        createdFor: true,
        expiresAt: true,
      },
    });
    if (!isPast(expiresAt)) {
      return createdFor;
    }
  } catch (e) {}
}

export default app;
