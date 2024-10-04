// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import 'zone.js/dist/zone-error';
export const environment = {
  production: false,

  version: '8.7.2',
  // Build triggred
  //  UAT

  APIEndPoint: 'https://uatapi.mfg.com/api/',
  HubEndPoint: 'https://uatapi.mfg.com/',
  AppUrl: 'https://uatapp.mfg.com/',
  SSOUrl: 'https://staging.mfg.com/sso/index.php',
  RedirectionToCommunityPages: 'https://staging.mfg.com/',
  RegistrationLink: 'https://staging.mfg.com/registration/',
  RedirectToMaterialPage: 'https://stagingmaterials.mfg.com/sso/index.php',
  stripePk: 'pk_test_51LONVIGWEpBLxDePtxLdQhseTkUDCUraiqwfqwv0CIYDyh0B4HwWXsKmISdEGMpnsVkdVdxiGcJbgRNI6aPBgw8d002YY8F0AD'
};

