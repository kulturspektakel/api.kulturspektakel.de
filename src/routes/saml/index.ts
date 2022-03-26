import {Router} from '@awaitjs/express';
import {IdentityProvider, ServiceProvider, setSchemaValidator} from 'samlify';
import express, {Request, Response} from 'express';
import {add} from 'date-fns';
import {ParsedToken} from '../auth';
import prismaClient from '../../utils/prismaClient';
import requestUrl from '../../utils/requestUrl';
import env from '../../utils/env';
import {ApiError} from '../../utils/errorReporting';

const router = Router({});

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

router.postAsync(
  '/login',
  // @ts-ignore postAsync is not typed correctly
  express.urlencoded(),
  async (
    req: Request<
      any,
      any,
      {password: string},
      {SAMLRequest?: string; RelayState?: string}
    >,
    res,
  ) => {
    if (
      !req.body.password ||
      req.body.password !== env.NUCLINO_ANONYMOUS_PASSWORD
    ) {
      throw new ApiError(401, 'Unauthorized');
    }

    await sendSAMLResponse(req, res, {
      email: 'info@kulturspektakel.de',
      firstName: 'Anonymer',
      lastName: 'User',
    });
  },
);

router.getAsync(
  '/login',
  async (
    req: Request<any, any, any, {SAMLRequest?: string; RelayState?: string}>,
    res,
  ) => {
    const token: ParsedToken | null = (req as any)._token;
    if (!token || token.type != 'user') {
      // no token, redirect to login flow
      res.send(`
        <a href="/auth?state=${encodeURIComponent(
          requestUrl(req).toString(),
        )}" style="align-items:center;color:#000;background-color:#fff;border:1px solid #ddd;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:16px;font-weight:600;height:48px;justify-content:center;text-decoration:none;width:256px"><svg xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;margin-right:12px" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>Anmelden mit Slack</a>
        <br />
          oder anonym einloggen:
        <form method="post">
          <input type="password" name="password" placeholder="Passwort" />
          <button type="submit">Login</button>
        </form>
      `);
      return;
    }

    const viewer = await prismaClient.viewer.findUnique({
      where: {
        id: token.userId,
      },
    });

    if (!viewer) {
      throw new Error(`Could not find viewer ${token.userId}`);
    }

    const [firstName, ...lastNames] = viewer.displayName.split(' ');

    await sendSAMLResponse(req, res, {
      firstName,
      lastName: lastNames.join(' '),
      email: viewer.email,
    });
  },
);

async function sendSAMLResponse(
  req: Request,
  res: Response,
  user: {
    firstName: string;
    lastName: string;
    email: string;
  },
) {
  const url = requestUrl(req);
  url.search = '';

  const idp = IdentityProvider({
    entityID: url.toString(),
    privateKey: env.SAML_PRIVATE_KEY,
    signingCert: env.SAML_CERT,
    isAssertionEncrypted: false,
    singleSignOnService: [
      {
        Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Post',
        Location: url.toString(),
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

  const parseResult = await idp.parseLoginRequest(sp, 'redirect', req);
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
          NameID: user.email,
          attrFirstName: user.firstName,
          attrLastName: user.lastName,
        }),
      };
    },
  );

  res.send(`
    <form method="post" action="${assertionConsumerServiceUrl}">
      <input type="hidden" name="SAMLResponse" value="${response.context}" />
      <input type="hidden" name="RelayState" value="${req.query.RelayState}" />
      <script type="text/javascript">(function(){document.forms[0].submit();})();</script>
    </form>
  `);
}

export default router;
