import { Component, OnInit } from '@angular/core';
import { RfqService } from './../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-buyer-contact',
  templateUrl: './buyer-contact.component.html',
  styleUrls: ['./buyer-contact.component.scss']
})
export class BuyerContactComponent implements OnInit {

  public rfqId: any;

  constructor(private _rfqService: RfqService) { }

  ngOnInit() {
    this._rfqService.set(0, 'editRfqId');
    this._rfqService.set('', 'editRfqName');
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'rfqId');
    localStorage.setItem('detailRfqId', '0');
    this._rfqService.set(false, 'B-rfq-d-is-SupProfile');
  }

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  isSupplierProfileDrawer() {
    return this._rfqService.get('supplierProfileDrawer');
  }
  isMessageDrawer() {
    return this._rfqService.get('messageRfq');
  }
  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }

  goBack() {
    this._rfqService.set(0, 'ViewSupplierProfileId');
    this._rfqService.set(' ', 'ViewSupplierProfileName');
    this._rfqService.set(false, 'B-rfq-d-is-SupProfile');
  }
  isModelShow() {
    return this._rfqService.get('isModelShow');
  }
}
