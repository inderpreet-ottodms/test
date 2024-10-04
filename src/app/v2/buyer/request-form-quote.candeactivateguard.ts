import { Injectable }           from '@angular/core';
import { Observable }           from 'rxjs';
import { CanDeactivate,
         ActivatedRouteSnapshot,
         RouterStateSnapshot }  from '@angular/router';
import { RequestFormQuoteComponent } from './request-form-quote.component';


@Injectable({ providedIn: 'root' })
export class RequestFormQuoteCanDeactivateGuard implements CanDeactivate<RequestFormQuoteComponent> {

  canDeactivate(
    component: RequestFormQuoteComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
      nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    
    return component.destroy(nextState.url, currentState.url);
  }
}