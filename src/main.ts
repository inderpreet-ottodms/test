import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import "@angular/compiler";
import { SentryService } from "./app/shared/sentry/sentry.service";
import * as moment from "moment";
import { BrowserStorageUtil } from "./app/shared/browser.storage.util";

if (environment.production) {
  enableProdMode();
}

checkLoginTokenExpiry();

async function initializeApp() {
  try {
    let isSentryEnabled = false; // Default value

    try {
      const featureFlagResponse = await fetch(
        environment.APIEndPoint + "FeatureFlag?key=isSentryEnabled"
      );
      const featureFlagText = await featureFlagResponse.text();
      const featureFlag = JSON.parse(featureFlagText);
      isSentryEnabled = featureFlag && featureFlag["isFeatureOn"];
    } catch (error) {
      console.warn("Failed to fetch Sentry feature flag:", error);
    }

    if (isSentryEnabled) {
      console.log("Sentry will be initialized");
      const sentryService = new SentryService();
      sentryService.initSentry(
        environment.Sentry.DSN,
        environment.environmentName,
        environment.Sentry.ReplaysSessionSampleRate,
        environment.Sentry.ReplaysOnErrorSampleRate
      );

      sentryService.setLoggedUserDetails();
    }
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.log(err));
  } catch (error) {
    console.error("Error initializing app:", error);
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.log(err));
  }
}
// Call the async function to start the initialization
initializeApp();

function logoutAndRedirectToLogin() {
  console.log("Logging out and redirecting to login page");
  localStorage.clear();
  sessionStorage.clear();

  const isLoginPage = window.location.pathname.includes("/auth") || window.location.hash.includes("/auth");
  if (!isLoginPage) {
    window.location.href = "/#/auth/login/simple";
  }
}

/*
 * Check if Token is expired or not. If expired then redirect to login page.
 * This code is not added in a service because it needs to be executed
 * before any API call is made to prevent 401 errors.
 */
function checkLoginTokenExpiry() {
  const loginExpiryDate = BrowserStorageUtil.getLoginSessionEndTime();

  if (loginExpiryDate && !isNaN(Number(loginExpiryDate))) {
    const loginExpiryMoment = moment.unix(Number(loginExpiryDate));
    const loginMoment = loginExpiryMoment.clone().subtract(24, "hours");
    const currentMoment = moment();
    const hoursSinceLogin = moment
      .duration(currentMoment.diff(loginMoment))
      .asHours();

    // console.log("--------------------------------");
    // console.log("Login expiry timestamp:", loginExpiryDate);
    // console.log("Login expiry moment:", loginExpiryMoment.format());
    // console.log("Calculated login moment:", loginMoment.format());
    // console.log("Current moment:", currentMoment.format());
    // console.log("Hours since login:", hoursSinceLogin);
    // console.log("--------------------------------");

    if (hoursSinceLogin < 0 || hoursSinceLogin >= 24) {
      console.log(
        "%cLogin was more than 24 hours ago. Redirecting to login page.",
        "color: red; font-size: 16px;"
      );
      logoutAndRedirectToLogin();
    }
  } else  {
    // logoutAndRedirectToLogin();
    localStorage.clear();
    sessionStorage.clear();
  }
}
