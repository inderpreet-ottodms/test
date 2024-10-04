import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { EditRfqComponent } from '../../component/rfq/edit-rfq/edit-rfq.component';
import { RfqService } from '../../core/services/rfq/rfq.service';
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable()
export class DeactivateGuardGuard implements CanDeactivate<CanComponentDeactivate>  {
  constructor( private _rfqService :RfqService){

  }
  canDeactivate(component:CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
 if(component.canDeactivate){
  this._rfqService.getiisRedirect().subscribe(res=>{
    if(res['text'] == true) {

      return  true;
    } else {
      return  false;
    }
  })
   return  component.canDeactivate();

} else {
  return true;
}


}
}
