import { Injectable } from "@angular/core";
import * as Sentry from "@sentry/angular";
import { BrowserStorageUtil } from "../browser.storage.util";
import { environment } from "../../../environments/environment";
import packageJson from '../../../../package.json';

@Injectable({
  providedIn: "root",
})
export class SentryService {
  private isLocalhost(): boolean {
    return (!environment.production && (location.hostname.includes("localhost") || environment.environmentName == 'dev'));
  }
  constructor() {}

  /**
   * Initialize Sentry with the given DSN and other options.
   * @param dsn - Your Sentry DSN.
   * @param environment - The environment name (e.g., 'production', 'development').
   */
  initSentry(
    dsn: string,
    environmentName: string,
    replaysSessionSampleRate: number,
    replaysOnErrorSampleRate: number
  ) {
    if (this.isLocalhost()) {
      return false;
    }
    Sentry.init({
      dsn: dsn,
      release: 'MFG-UI@' + packageJson.version,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      environment: environmentName,
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      replaysSessionSampleRate: replaysSessionSampleRate, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: replaysOnErrorSampleRate, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  }

  /**
   * Set a tag to be sent with all events.
   * @param key - The tag key.
   * @param value - The tag value.
   */
  setTag(key: string, value: string) {
    if (this.isLocalhost()) {
      return false;
    }
    Sentry.setTag(key, value);
  }

  /**
   * Set the user information to be sent with all events.
   * @param user - The user object with id, email, and other info.
   */
  setUser(user: { id: string; email?: string; [key: string]: any }) {
    if (this.isLocalhost()) {
      return false;
    }
    Sentry.setUser(user);
  }

  /**
   * Capture Logged in user details from Localstorage and set it in Sentry.
   */
  setLoggedUserDetails() {
    if (this.isLocalhost()) {
      return false;
    }
    if (BrowserStorageUtil.getLoogedUserId()) {
      this.setTag("user_id", BrowserStorageUtil.getLoogedUserId().toString());
      this.setTag("user_email", BrowserStorageUtil.getLoogedUserEmail());
      this.setTag("user_companyId", BrowserStorageUtil.getCommpanyId());
      this.setUser({
        id: BrowserStorageUtil.getLoogedUserId().toString(),
        email: BrowserStorageUtil.getLoogedUserEmail(),
        companyId: BrowserStorageUtil.getCommpanyId(),
      });
    }
  }

  /**
   * Capture an exception and send it to Sentry.
   * @param exception - The exception to be captured.
   */
  captureException(exception: any) {
    if (this.isLocalhost()) {
      return false;
    }
    Sentry.captureException(exception);
  }

  /**
   * Capture a message and send it to Sentry.
   * @param message - The message to be captured.
   */
  captureMessage(message: string) {
    if (this.isLocalhost()) {
      return false;
    }
    Sentry.captureMessage(message);
  }
}
