import { Component, OnInit } from '@angular/core';

import { RfqService } from '../../../core/services/rfq/rfq.service';
@Component({
  selector: 'app-nda-to-approve',
  templateUrl: './nda-to-approve.component.html',
  styleUrls: ['./nda-to-approve.component.scss']
})
export class NdaToApproveComponent implements OnInit {



  // Variable Declarations Ends
  constructor(
    private _rfqService: RfqService
  ) {

  }
  isSidePanel () {
    return this._rfqService.get('showSidePanel');
  }
  isMessageRfqPanel() {
    return this._rfqService.get('messageRfq');
  }
  isSupplierProfileDrawer() {
    return this._rfqService.get('supplierProfileDrawer');
  }
  ngOnInit() {
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

}
