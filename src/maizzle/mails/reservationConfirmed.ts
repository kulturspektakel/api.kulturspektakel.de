<!DOCTYPE {{{ page.doctype || 'html' }}}>
<html lang="{{ page.language || 'de' }}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="{{ page.charset || 'utf-8' }}">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <!--[if mso]>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    <style>
      td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
    </style>
  <![endif]-->
  <if condition="page.title">
    <title>{{{ page.title }}}</title>
  </if>
  <if condition="page.googleFonts">
    <link href="/public/https://fonts.googleapis.com/css?family={{ page.googleFonts }}" rel="stylesheet" media="screen">
  </if>
  <if condition="page.css">
    <!-- <style>{{{ page.css }}}</style> -->
  </if>
  
</head>
<body class=" page_bodyClass or-or- -bg-gray-100- ">
  <if condition="page.preheader">
    <div class="hidden">{{{ page.preheader }}}&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &zwnj;
      &#160;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &zwnj;
      &#160;&#847; &#847; &#847; &#847; &#847; </div>
  </if>
  <div role="article" aria-roledescription="email" aria-label="{{{ page.title || '' }}}" lang="{{ page.language || 'de' }}">
    <table class="w-full font-sans" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" class="bg-gray-100">
          <table class="w-600 sm-w-full" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="h-24"></td>
            </tr>
            <tr>
              <td align="center" class="sm-px-24">
                <table class="w-full" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="bg-white text-gray-800 text-base text-left p-48 sm-p-24 leading-24 rounded">
                      
    <h1 class="text-2xl sm-leading-32 text-black font-semibold m-0 mb-24">Reservierung #$number</h1>
    <p class="m-0 mb-24">
      Wir freuen uns, dass du zum Kult kommst. Dein Reservierung ist nun bestätigt.
    </p>

    <table class="table-auto" cellpadding="0" cellspacing="0" role="presentation">
      <tbody>
        <tr>
          <th>Datum</th>
          <td class="py-4 px-8">$day</td>
        </tr>
        <tr>
          <th>Uhrzeit</th>
          <td class="py-4 px-8">$startTime bis $endTime Uhr</td>
        </tr>
        <tr>
          <th>Bereich</th>
          <td class="py-4 px-8">$area</td>
        </tr>
        <tr>
          <th>Gäste</th>
          <td class="py-4 px-8">$partySize Personen</td>
        </tr>
      </tbody>
    </table>
    
    <h4 class="mb-0">
      Wichtige Informationen
    </h4>

    <ul class="mt-1">
      <li>
        Der Zugang zum Festival ist ausschließlich über einen der
        <a href="https://kulturspektakel.de/angebot" class="text-brand underline hover-no-underline">beiden Eingänge</a>

        möglich.
      </li>
      <li>
        Bitte seid pünktlich zum Beginn eurer Reservierung da, sonst
        verfällt sie.
      </li>
      <li>
        Am Einlass werden die Kontaktdaten aller Gäste erfasst -
        entweder via Check-In bei darfichrein.de mit eurem Smartphone
        oder über ein Formular zur Gästeregistrierung
      </li>
      <li>
        Außer auf den Wegen zu den Verkaufsständen und Toiletten
        dürft ihr euch nur an eurem Sitzplatz aufhalten und nicht an
        andere Tische wechseln.
      </li>
      <li>
        Unser Hygienekonzept findet ihr auf <a href="https://kulturspektakel.de/hygiene/" class="text-brand underline hover-no-underline">kulturspektakel.de/hygiene</a>
.
      </li>
    </ul>

    <table class="w-full" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
        <td class="py-24">
            <div class="bg-gray-200 h-px leading-px">&zwnj;</div>
        </td>
    </tr>
</table>

    <p class="m-0 mb-16">Falls du deine Reservierung ändern oder absagen möchtest, klicke bitte hier.</p>
    <div class="leading-full">
    <a href="https://table.kulturspektakel.de/reservation/$token" class="inline-block py-12 px-24 rounded text-base font-semibold text-center no-underline text-white bg-brand hover-bg-brand-dark">
        <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%; mso-text-raise:30px;">&#8202;</i><![endif]-->
        <span style="mso-text-raise: 16px">
      Reservierung ändern
     &rarr;</span>
        <!--[if mso]><i style="letter-spacing: 24px; mso-font-width: -100%;">&#8202;</i><![endif]-->
    </a>
</div>

    
    <p>
      Viele Grüße,<br>
      das Kult-Team
    </p>
  
                    </td>
                  </tr>
                  <tr>
                    <td class="h-36"></td>
                  </tr>
                  <tr>
                    <td class="text-center text-gray-600 text-xs px-24">
                      <img src="/public/logo.png" width="40" alt="Kulturspektakel Gauting">
                      <p class="m-0 mt-6 mb-4 font-semibold">Kulturspektakel Gauting e.V.</p>
                      <p class="m-0 italic">Anschrift: Bahnhofstr. 6, 82131 Gauting</p>
                      <p class="m-0 italic">Festivalgelände: Germeringer Str. 41, Gauting</p>
                      <p class="cursor-default">
                        <a href="https://kulturspektakel.de" class="text-brand no-underline hover-underline">Webseite</a> &bull;
                        <a href="https://facebook.com/kulturspektakel" class="text-brand no-underline hover-underline">Facebook</a> &bull;
                        <a href="https://instagram.com/kulturspektakel" class="text-brand no-underline hover-underline">Instagram</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>

