import 'zone.js/dist/zone-error';
export const environment = {
  version: '9.1.0',
  production: false,
  environmentName: "dev",
  APIEndPoint: 'https://devappapi.mfg.com/api/',
  HubEndPoint: 'https://qaappapi.mfg.com/',
  AppUrl: 'https://devapp.mfg.com/',
  SSOUrl: 'https://dev.mfg.com/sso/index.php',
  RedirectionToCommunityPages: 'https://dev.mfg.com/',
  RegistrationLink: 'https://dev.mfg.com/registration/',
  RedirectToMaterialPage: 'https://devmaterials.mfg.com/sso/index.php',
  stripePk: 'pk_test_51LONVIGWEpBLxDePtxLdQhseTkUDCUraiqwfqwv0CIYDyh0B4HwWXsKmISdEGMpnsVkdVdxiGcJbgRNI6aPBgw8d002YY8F0AD',
  RedirectToCommunityQuote: 'https://dev.mfg.com/materials-quote-request/',
  ScheduleDemoUrl: 'https://go.mfg.com/meetings/mfgteam/demo',
  ScheduleDemoBuyerUrl: 'https://go.mfg.com/meetings/mfgteam/buyer-demo',
  InteractiveDemoUrl: 'https://app.teamwalnut.com/player/?demoId=259c667c-9601-49fa-a77e-c405641637e8&screenId=ff3f4e7a-448a-42da-a0c3-f9e47c6d128e&showGuide=true&showGuidesToolbar=true&showHotspots=true&source=app',
  GettingStartedGuideURL: 'https://7872785.fs1.hubspotusercontent-na1.net/hubfs/7872785/Getting%20Started%20With%20MFG%202024.pdf',
  MaterialQuoteRequestFormId: 'b4f20342-e6b7-4038-84a0-0f980f164d11',
  MaterialQuoteRequestPortalIdId: '20881509',
  Sentry: {
    DSN: 'https://df15c8ac92dc2fa40ba1456f93d1992a@o4507262598316032.ingest.us.sentry.io/4507466806657024',
    ReplaysSessionSampleRate: 0,
    ReplaysOnErrorSampleRate:0,
    showDialog: false
  }
};
