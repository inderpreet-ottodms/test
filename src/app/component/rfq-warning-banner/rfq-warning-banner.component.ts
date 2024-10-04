import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  ProfileService
} from '../../core/services/profile/profile.service';

@Component({
  selector: 'app-rfq-warning-banner',
  templateUrl: './rfq-warning-banner.component.html',
  styleUrls: ['./rfq-warning-banner.component.scss']
})
export class RfqWarningBannerComponent implements OnInit {
  @Input('page') page: any;
  toShowContactModel: boolean = false;
  awardWarning: boolean = false;
  userType: string = null;
  modalSubscription: any;
  firstName: string = '';
  warningObj = {
    totalRFQs: null,
    totalSuppliersQuoted: null,
    isBuyerAwardWarning: false
  }
  isProfileDetailsFilledOut: boolean = true;
  isProfileDetailsBannerText: any = '';
  // public router: Router;
  constructor(private route: Router, private rfqService: RfqService, private _profileService: ProfileService) {}

  ngOnInit() {
    this.getRfqAwardWarningDetails();

    if (this.page != '' && this.page!=null  && this.page !=undefined) {
      this.getIsProfileFilledOut();
    }

    this.modalSubscription = this.rfqService.getRfqAwardEvent().subscribe(
      response => {
        if (response) {
          this.getRfqAwardWarningDetails();
        }
      }
    );
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  get loggedEmailId() {
    // tslint:disable-next-line:radix
    return (localStorage.getItem('User2'));
  }


  getIsProfileFilledOut() {
    this.rfqService.getIsProfileFilledOut(this.loggedCompanyId, this.loggedEmailId,this.loggedId).subscribe(res => {
        this.isProfileDetailsFilledOut = res.result;
        this.isProfileDetailsBannerText = res.bannerText;
    })
  }
  getRfqAwardWarningDetails() {
    this.userType = localStorage.getItem('Usertype');
    if (this.userType !== null && this.userType !== undefined && this.userType === 'Buyer') {
      this.rfqService.getWarningSetting(this.loggedId).subscribe(
        response => {
          if (!response.isError) {
            let contactDetails = JSON.parse(localStorage.getItem('iContactViewModel'));
            this.firstName = contactDetails.firstName;
            if (response.data.isBuyerAwardWarning === true) {
              this.warningObj = response.data;
              // let IsPremiumEncrypt= localStorage.getItem('IsPremium');
              // let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
              localStorage.setItem("restrictRfq", this._profileService.encrypt(JSON.stringify(true)).toString());
              this.awardWarning = true;
            } else {
              this.awardWarning = false;
              localStorage.setItem("restrictRfq", this._profileService.encrypt(JSON.stringify(false)).toString());
            }
          } else {
            this.awardWarning = false;
            localStorage.setItem("restrictRfq", this._profileService.encrypt(JSON.stringify(false)).toString());
          }
        }
      );

    } else {
      this.awardWarning = false;
    }
  }
  showContactModel() {
    this.toShowContactModel = true;
  }
  ngOnDestroy() {
    if (this.modalSubscription !== null && this.modalSubscription !== undefined) {
      this.modalSubscription.unsubscribe();
    }

  }
  redirectToRfq() {
    this._profileService.redirectToNewBuyer('/rfq/myrfq?filter=toAwarded',"filter=toAwarded");
   /*  this.route.navigate(['/rfq/myrfq'], {
      queryParams: {
        filter: 'toAwarded',
      }
    }); */
  }
   redirectToBuyerProfile() {
     this.route.navigate(['/profile/buyerprofile']);
   }
}
