import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule, ErrorHandler, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { MenuItems } from './shared/menu-items/menu-items';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { DeactivateGuardGuard } from './shared/decativeguard/deactivate-guard.guard';
import { ValidateComponent } from './component/extra-pages/validate/validate.component';
import { Router } from "@angular/router";
import * as Sentry from "@sentry/angular"
import { environment } from './../environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    BreadcrumbsComponent,
    ValidateComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    SharedModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [MenuItems, AuthGuard, CookieService, DeactivateGuardGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: environment.Sentry.showDialog,
      }),
    }, {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
// useClass: PathLocationStrategy
