import { Component, OnInit } from '@angular/core';
import { RfqService} from './../../../core/services/rfq/rfq.service';
import {  IRFQViewModel, IBuyerQuotesViewModel } from '../../../core/models/rfqModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-quote',
  templateUrl: './my-quote.component.html',
  styleUrls: ['./my-quote.component.scss']
})
export class MyQuoteComponent implements OnInit {

  // Variable Declaration
  isRfqAvailable: boolean;
  isInProgRfqAvailable: boolean;
  public rfqId: any;
  iRFQViewModelColl: IRFQViewModel[];
  isCreateRFQBodyBtnDisabled = false;
  isRFQInProgBodyBtnDisabled = false;
  toggleNoRFQBodyBtn = true;
  // Variable Declaration End

  constructor(private _rfqService: RfqService, private _toastr: ToastrService) { }

  ngOnInit() {
    // this.getMyRfqCount();
    // this.getRfqInProgCount();
    this._rfqService.set(0, 'editRfqId');
    this._rfqService.set('', 'editRfqName');
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'rfqId');
    localStorage.setItem('detailRfqId',  '0');
  }
   changeInProg(flag) {
    if (flag === true) {
      this.toggleNoRFQBodyBtn = false;
    } else {
      this.toggleNoRFQBodyBtn = true;
    }
  }
  changeCrRFQ(flag) {
    if (flag === true) {
      this.toggleNoRFQBodyBtn = true;
    } else {
      this.toggleNoRFQBodyBtn = true;
    }
  }
  // utility functions

  isSidePanel () {
    return this._rfqService.get('showSidePanel');
  }
  getCurrentRfqId () {
    return this._rfqService.get('rfqId');
  }
  isSupplierProfileDrawer () {
    return this._rfqService.get('supplierProfileDrawer');
  }
  isMessageDrawer () {
    return this._rfqService.get('messageRfq');
  }
  isMessageRfqPanel () {
    return this._rfqService.get('messageRfq');
  }


  isTransferRfqPanel () {
    return this._rfqService.get('transferRfq');
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
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
  moveToCreatRfq(){  
    this._rfqService.redirectToNewBuyer('/rfq/editrfq');
  } 
}
