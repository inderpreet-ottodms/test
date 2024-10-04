import {
  Component,
  OnInit
} from '@angular/core';
import {
  AwardingModuleViewModel
} from '../../../../core/models/rfqModel';
import {
  BuyerService
} from '../../../../core/services/buyer/buyer.service';
import {
  Router
} from '@angular/router';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';

@Component({
  selector: 'app-award-rfq',
  templateUrl: './award-rfq.component.html',
  styleUrls: ['./award-rfq.component.scss'],
  providers: [BuyerService]
})
export class AwardRfqComponent implements OnInit {
  awardingModuleViewList: AwardingModuleViewModel[] = [];
  isAllRfqAwarded: boolean = false;
  isNoRfqToAward: boolean = false;
  loader: boolean = false;
  rfqId: number;
  rfqIdList: number[];
  showRegionalModel: boolean = false;
  constructor(private _buyerService: BuyerService, private router: Router, private _profileService: ProfileService) {}

  ngOnInit() {
    this.getDashAwardModuleList();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  getDashAwardModuleList() {
    this.loader = true;
    this._buyerService.getDashAwardModule(this.loggedId).subscribe(res => {
      this.isAllRfqAwarded = res.isAllRfqAwarded;
      this.isNoRfqToAward = res.isNoRfqToAward;
      if (res.responseModel.isError == false && res.responseModel.data != null && res.responseModel.data.length != 0) {
        this.awardingModuleViewList = res.responseModel.data;
        this.loader = false;
      } else {
        this.awardingModuleViewList = [];
        this.loader = false;
      }
    }, error => {
      this.loader = false;
      this.awardingModuleViewList = [];
    })
  }

  goToRfqDetail(id, rfqList, toRedirect) {

    if( toRedirect || rfqList.length === 1){
      let isQuoteEncypt = this._profileService.encrypt(JSON.stringify(true));
      const encryptedRfqID = this._profileService.encrypt(id);
      this.router.navigate(['/rfq/rfqdetail'], {
        queryParams: {
          rfqId: encryptedRfqID,
          qt: isQuoteEncypt
        }
      });
    } else {
      localStorage.setItem('detailRfqId', id);
      this.rfqIdList = rfqList;
      this.showRegionalModel = true;
    }
  }
  noThanksDashAwardModule(rfqId) {
    this._buyerService.noThanksDashAwardModule(rfqId).subscribe(res => {
      if (res.isError == false) {
        this.getDashAwardModuleList();
      }
    })
  }
}
