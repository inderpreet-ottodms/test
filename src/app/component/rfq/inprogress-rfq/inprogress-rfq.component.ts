import { Component, OnInit } from '@angular/core';
import { RfqService } from './../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-inprogress-rfq',
  templateUrl: './inprogress-rfq.component.html',
  styleUrls: ['./inprogress-rfq.component.scss']
})
export class InprogressRfqComponent implements OnInit {

  public rfqId: any;

  constructor(private _rfqService: RfqService) {}

  ngOnInit() {
    // this.getRfqCount();
    this._rfqService.set(0, 'editRfqId');
    this._rfqService.set('', 'editRfqName');
    localStorage.setItem('EditRfqId', '0');
    localStorage.setItem('EditRfqName', '');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(0, 'rfqId');
  }

  // utility functions

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }

  get loggedId() {
    // tslint:disable-next-line:radix
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
    this._rfqService.redirectToNewBuyer("rfq/editrfq");
  }
}
