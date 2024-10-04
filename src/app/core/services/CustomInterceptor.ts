
import { catchError, tap } from "rxjs/operators";
import {HttpEvent, HttpHandler, HttpInterceptor,
  HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SentryService } from "../../shared/sentry/sentry.service";


/**
It is also important to tell the http-calls which header to use. “Application/Json” in this case.
We are doing this via an interceptor and the new HttpClientModule.
**/

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(
    public router: Router, private sentryService: SentryService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json')});
      req = req.clone({ headers: req.headers.set('Authorization', 'bearer ' + localStorage.getItem('Token')) });
      req = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') });
      req = req.clone({ headers: req.headers.set('Access-Control-Allow-Methods', '*') });
      req = req.clone({ headers: req.headers.set('Access-Control-Allow-Headers', '*') });
      req = req.clone({ headers: req.headers.set('Allow-Origin-With-Credentials', '*') });
      req = req.clone({ withCredentials: true });
    }
let paymentToken =localStorage.getItem('paymentToken');
if(paymentToken !=null && paymentToken !=undefined)  {

  req = req.clone({ headers: req.headers.set('paymentToken',paymentToken ) });
}

    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // const elapsed = Date.now() - started;
        // console.log(`Request for ${req.urlWithParams} took ${elapsed} ms.`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.log("refreshing token 2 error : ", error);
      switch ((<HttpErrorResponse>error).status) {
        case 400:
          break;
        case 401:
          console.log("-------401 error-----");
          const page = this.router.routerState.snapshot.url;
          if (page === "/leadstream") {
            localStorage.setItem("page", "/leadstream");
          }
          if (page) {
            let isMsg = page.includes("/globalMessage?msgid=");
            if (isMsg) {
              localStorage.setItem("page", page);
            }
          }

          localStorage.clear();
          this.router.navigateByUrl("/auth/login/simple");
          return throwError(() => new Error("Unauthorized request"));
          break;
        default:
          // Capture other types of errors with Sentry
          this.sentryService.captureException(error);
          // Rethrow the error so it can be handled elsewhere if needed
          return throwError(() => error);
          break;
      }
    }));
  }
}
