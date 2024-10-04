import { Component, OnInit, Input } from '@angular/core';
import { IPartAwarded } from '../../../../../core/models/rfqModel';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import * as moment from 'moment';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sup-awarded',
  templateUrl: './sup-awarded.component.html',
  styleUrls: ['./sup-awarded.component.scss']
})
export class SupAwardedComponent implements OnInit {
  @Input() rfqId:any;
ipartAwared: IPartAwarded;
  constructor(private supplierService: SupplierService, private _rfqService: RfqService ,
    private _profileService:ProfileService, private router: Router) { }

  ngOnInit() {

    this.supplierService.getSupplierAwardedParts( this.rfqId,  this.loggedId ).subscribe (
      result => {
        // console.log(result);
        if ( result.result ) {
          this.ipartAwared = result.data;
        }
      }
    );
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('supplierRfqDetailId'));
  }
  utcDate (date) {
    return moment.utc(date).toDate();
   }
   openSidePanel1(event, buyerContactId, buyerContactName) {
    event.stopPropagation();
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'messageDrawer');

    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(buyerContactName, 'nameOfBuyer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
    this._rfqService.set(false, 'isPartialQuote');


    this._rfqService.set( buyerContactId, 'selectContactIdsForMEessage');
    this._rfqService.set( this.currentRfqId , 'selectContactRFQId');
  }

  isPremium() {
    let IsPremiumEncrypt= localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false' ) {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
     }
     if (IsPremiumDecrypt === 'true') {
       return true;
     } else {
       return false;
     }
  }
}
