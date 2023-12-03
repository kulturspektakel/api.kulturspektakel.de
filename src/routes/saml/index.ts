import {IdentityProvider, ServiceProvider, setSchemaValidator} from 'samlify';
import {add, isPast} from 'date-fns';
import prismaClient from '../../utils/prismaClient';
import requestUrl from '../../utils/requestUrl';
import env from '../../utils/env';
import {ApiError} from '../../utils/errorReporting';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Viewer} from '@prisma/client';
import viewerFromToken from '../../utils/viewerFromToken';
import {Hono, Context as HonoContext} from 'hono';
import {Context} from '../../context';
import {deleteCookie, getCookie} from 'hono/cookie';
import {html} from 'hono/html';

const app = new Hono<{Variables: Context}>();

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
    throw new ApiError(401, 'Unauthorized');
  }

  await sendSAMLResponse(c, {
    email: 'info@kulturspektakel.de',
    displayName: 'Anonymer User',
  });
});

app.get('/login', async (c) => {
  let viewer: Viewer | undefined | null;
  const nonce = getCookie(c, 'nonce');
  const parsedToken = c.get('parsedToken');
  if (nonce) {
    viewer = await viewerFromNonce(nonce);
    deleteCookie(c, 'nonce');
  } else if (parsedToken) {
    viewer = await viewerFromToken(parsedToken);
  }

  if (viewer == null) {
    // no token, redirect to login flow
    return c.html(html`
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <style>
            body {
              background-color: #f9fafb;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                sans-serif;
              color: #999;
            }
            main {
              background-color: white;
              border-radius: 5px;
              border: rgba(0, 0, 0, 0.9);
              box-shadow:
                rgb(255, 255, 255) 0px 0px 0px 0px,
                rgba(17, 24, 39, 0.05) 0px 0px 0px 1px,
                rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
                rgba(0, 0, 0, 0.1) 0px 8px 10px -6px;
              max-width: 280px;
              padding: 25px;
              margin: 15px;
              text-align: center;
              line-height: 135%;
            }
            .logo {
              width: 60px;
              margin-bottom: 20px;
            }
            a {
              display: flex;
              text-decoration: none;
              color: black;
              border: 1px solid #e5e5e5;
              border-radius: 5px;
              padding: 10px;
              justify-content: center;
              font-weight: 600;
              align-items: center;
            }
            hr {
              border: none;
              border-top: 1px dotted #e5e5e5;
              margin-top: 30px;
              margin-bottom: 20px;
            }
            form {
              display: flex;
              gap: 10px;
              margin-top: 10px;
            }
            input {
              flex-grow: 1;
              border: 1px solid #e5e5e5;
              font-size: 1em;
              padding: 10px;
              border-radius: 5px;
            }
            button {
              border-radius: 5px;
              border: none;
              font-size: 1em;
              padding: 10px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <main>
            <svg
              class="logo"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 850 850"
              enable-background="new 0 0 850 850"
              xml:space="preserve"
            >
              <rect fill="#FFFFFF" width="850" height="850" />
              <path
                fill="#E02E2D"
                d="M0,0v850h850V0H0z M661.3,674.5H486.5l-142.4-166v166H203.2V175.5h141.1v163.9l131.1-163.9h168.8v8.5 l-202.4,236l219.5,245.8L661.3,674.5L661.3,674.5z"
              />
            </svg>
            <a
              href="https://crew.kulturspektakel.de/admin/redirect?url=${encodeURIComponent(
                requestUrl(c.req).toString(),
              )}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="height:20px;width:20px;margin-right:12px"
                viewBox="0 0 122.8 122.8"
              >
                <path
                  d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
                  fill="#e01e5a"
                ></path>
                <path
                  d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
                  fill="#36c5f0"
                ></path>
                <path
                  d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
                  fill="#2eb67d"
                ></path>
                <path
                  d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
                  fill="#ecb22e"
                ></path>
              </svg>
              Anmelden mit Slack
            </a>
            <hr />
            Falls du keinen Slack-Account hast, frage jemanden aus der Crew nach
            dem Passwort für das Wiki.
            <form method="post">
              <input type="password" name="password" placeholder="Passwort" />
              <button type="submit">Login</button>
            </form>
          </main>
        </body>
      </html>
    `);
  }

  await sendSAMLResponse(c, viewer);
});

const signingCert = readFileSync(
  join(import.meta.dir, '..', '..', '..', 'artifacts', 'saml.crt'),
);

async function sendSAMLResponse(
  c: HonoContext<{Variables: Context}, any>,
  viewer: {
    displayName: string;
    email: string;
  },
) {
  const url = requestUrl(c.req);
  url.search = '';

  const [firstName, ...lastNames] = viewer.displayName.split(' ');
  console.log('asd', url.toString(), env.SAML_PRIVATE_KEY);

  const idp = IdentityProvider({
    entityID: url.toString(),
    privateKey: env.SAML_PRIVATE_KEY,
    signingCert,
    isAssertionEncrypted: false,
    singleSignOnService: [
      {
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Post',
        Location: url.toString(),
      },
    ],
    singleLogoutService: [
      {
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
        Location: `https://api.kulturspektakel.de/logout`,
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
  console.log('1');

  const parseResult = await idp.parseLoginRequest(sp, 'redirect', c.req);
  console.log('2');
  const {id, assertionConsumerServiceUrl, issueInstant, destination} =
    parseResult.extract.request;

  console.log('3', parseResult);

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

async function viewerFromNonce(nonce: string) {
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
