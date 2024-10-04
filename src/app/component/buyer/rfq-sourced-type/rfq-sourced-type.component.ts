import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BuyerRfqSourcedInfoFilterRequest, BuyerRfqSourcedInfoFilterResponse
} from '../../../core/models/rfqModel';
import { ProfileService } from '../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-rfq-sourced-type',
  templateUrl: './rfq-sourced-type.component.html',
  styleUrls: ['./rfq-sourced-type.component.scss']
})
export class RfqSourcedTypeComponent implements OnInit {
  buyerRfqSourcedInfoFilterRequest: BuyerRfqSourcedInfoFilterRequest;
  buyerRfqSourcedInfoFilterResponse: BuyerRfqSourcedInfoFilterResponse[];
  @Input('buyerContactId') buyerContactId: any;
  constructor(private _rfqService: RfqService,private router:Router, private _ProfileService: ProfileService) {}

  ngOnInit() {
    this.buyerRfqSourcedInfoFilterResponse=[];
    this.getBuyerRFQSourcedList();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  getBuyerRFQSourcedList() {
    this.buyerRfqSourcedInfoFilterRequest = new BuyerRfqSourcedInfoFilterRequest();
    this.buyerRfqSourcedInfoFilterRequest.supplierId = this.loggedId;
    this.buyerRfqSourcedInfoFilterRequest.supplierCompanyId = this.loggedCompanyId;
    this.buyerRfqSourcedInfoFilterRequest.buyerId = this.buyerContactId;

    this._rfqService.getBuyerRFQSourcedList(this.buyerRfqSourcedInfoFilterRequest).subscribe(res => {
      if (res['isError'] == false && res['data'].length > 0) {
        this.buyerRfqSourcedInfoFilterResponse = res['data'];
      } else {
        this.buyerRfqSourcedInfoFilterResponse=[];
      }
    })

  }
goToRfqDetail(RFQId) {
  const encryptedRfqID = this._ProfileService.encrypt(RFQId);
  this.router.navigate(['/supplier/supplierRfqDetails'] ,{queryParams:{rfqId:encryptedRfqID}});
}
opensideDrawerData(RFQId) {
  this._rfqService.set(RFQId, 'currentSupRfqDetailId');
  this._rfqService.set(RFQId, 'rfqId');
  this._rfqService.set(false, 'isBuyerMessage');
  this._rfqService.set(false, 'isBuyerMiniProfile');
  this._rfqService.set(true, 'showSidePanel');
  this._rfqService.set(true, 'rfqDetailDrawer');

  this._rfqService.setCurrentOpenRfqId(RFQId);
  setTimeout(() => {
    const elmnt = document.getElementById(RFQId);
    elmnt.scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'nearest'
    });
  }, 1000);

}
}
