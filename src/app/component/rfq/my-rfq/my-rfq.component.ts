import { Component, OnInit } from '@angular/core';
import { RfqService } from './../../../core/services/rfq/rfq.service';
import { ProductAnalyticService } from './../../../../app/shared/product-analytic/product-analytic';
import {BrowserStorageUtil} from '../../../shared/browser.storage.util';
@Component({
  selector: 'app-my-rfq',
  templateUrl: './my-rfq.component.html',
  styleUrls: ['./my-rfq.component.scss'],
})
export class MyRfqComponent implements OnInit {

  constructor(private _rfqService: RfqService, private productAnalyticService: ProductAnalyticService) { }

  ngOnInit() {
    let buyerRfQCountResult;
    const rfqList$ = this._rfqService.GetBuyerRFQCount(BrowserStorageUtil.getLoogedUserId(), Number(localStorage.getItem('loggedCompanyId')));
    rfqList$.subscribe(
      buyerRfqResult => {
        buyerRfQCountResult = buyerRfqResult;
        this.productAnalyticService.initializPendo(this.productAnalyticService.EDIT_RFQ, undefined, undefined, buyerRfQCountResult.myRFQCount);
      }, error => {
        this.productAnalyticService.initializPendo(this.productAnalyticService.EDIT_RFQ);
        console.log(error);
        console.log('buyerRfQCountResult fetch failed on my rfq page, pendo initialized without that value');
      });

    this._rfqService.set(0, 'editRfqId');
    this._rfqService.set('', 'editRfqName');
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'rfqId');
    localStorage.setItem('detailRfqId', '0');
  }

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }

  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }

  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
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
        }, 1000);
      }
    }
  }
  redirectToCreateRfqPage(){
    //this._rfqService.redirectToNewBuyer('/rfq/editrfq')
    this._rfqService.redirectToNewBuyer("rfq/editrfq");
  }
}
