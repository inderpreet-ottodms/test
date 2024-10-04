import { Component, OnInit } from '@angular/core';
import { RfqService} from './../../../core/services/rfq/rfq.service';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mark-for-quoting',
  templateUrl: './mark-for-quoting.component.html',
  styleUrls: ['./mark-for-quoting.component.scss']
})
export class MarkForQuotingComponent implements OnInit {

   // Variable Declaration
   isRfqAvailable: boolean;
   isInProgRfqAvailable: boolean;
   public rfqId: any;
   isCreateRFQBodyBtnDisabled = false;
   isRFQInProgBodyBtnDisabled = false;
   toggleNoRFQBodyBtn = true;
   // Variable Declaration End

  constructor(private _rfqService: RfqService, private _SupplierService: SupplierService, private _toastr: ToastrService) { }

  ngOnInit() {
    this._rfqService.set(0, 'editRfqId');
    this._rfqService.set('', 'editRfqName');
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'rfqId');
    localStorage.setItem('detailRfqId',  '0');
   // this.getRfqInProgCount();
  }




  // utility functions

  isSidePanel () {
    return this._rfqService.get('showSidePanel');
  }
  getCurrentRfqId () {
    return this._rfqService.get('rfqId');
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  // API Call Function
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  onCreateRFQBodyClick() {
    this.isCreateRFQBodyBtnDisabled = true;
  }
  onRFQInProgBodyClick() {
    this.isRFQInProgBodyBtnDisabled = true;
  }
  drawerClose(val) {
    if (val) {
      let rfq = this._rfqService.get('rfqId');
      if (rfq !== null && rfq !== undefined && rfq !== '' && rfq !== 0) {
        setTimeout(() => {
        const elmnt = document.getElementById(rfq);
        elmnt.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        });
      },1000);
      }
    }
  }
  // utility functions
  // getRfqInProgCount () {
  //   this._rfqService.getRfq(this.loggedId).subscribe(
  //     result => {
  //       if (result.length !== 0) {
  //         this.isInProgRfqAvailable = true;
  //       } else {
  //         this.isInProgRfqAvailable = false;
  //       }
  //     },
  //     error => {
  //       this._toastr.error(error, 'Error!');
  //     },
  //     () => {}
  //   );
  // }
  redirectToCreateRfqPage(){
    this._rfqService.redirectToNewBuyer("/rfq/editrfq");
  }
}
