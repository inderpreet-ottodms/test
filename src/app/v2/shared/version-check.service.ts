import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class VersionCheckService {
  private versionCheckURL = "/assets/version.json"; // Path to your version file
  private currentVersion: string | null = null;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public initVersionCheck(intervalMs: number) {
    // Retrieve the current version from cookies
    this.currentVersion = this.cookieService.get("appVersion");

    interval(intervalMs)
      .pipe(
        startWith(0),
        switchMap(() => {
          // Append a timestamp to force a fresh request
          const urlWithTimestamp = `${this.versionCheckURL}?t=${new Date().getTime()}`;
          return this.http.get(urlWithTimestamp);
        })
      )
      .subscribe((data: any) => {
        const newVersion = data.version;
        
        // If the cookie doesn't exist, set the version in the cookie
        if (!this.currentVersion && newVersion) {
          console.log('Set version ' + newVersion+ ' without prompt. current version = ' + this.currentVersion)
          this.setCurrentVersionCookie(newVersion);
        }

        // If the new version is different, set the new version in cookies and reload the page
        if (newVersion !== this.currentVersion) {
          console.log(newVersion + ' !== ' + this.currentVersion)
          this.setCurrentVersionCookie(newVersion);
          this.promptUserReload();
        }
      });
  }

  private setCurrentVersionCookie(version: string) {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1); // Set cookie to expire in 1 day.
    this.cookieService.set("appVersion", version, expireDate, "/");
    this.currentVersion = version;
  }

  private promptUserReload() {
    // if (confirm("A new version of the application is available. Reload now?")) {
      window.location.reload();
    // }
  }
}
