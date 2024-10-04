import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ProfileService
} from '../../core/services/profile/profile.service';

import {
  EncryptedContactViewModel
} from '../../core/models/accountModel';

import { SupplierService } from '../../core/services/supplier/supplier.service';
import { IMyAccountViewModel } from '../../core/models/supplierProfileModel';
@Component({
  selector: 'app-upgrade-account-btn',
  templateUrl: './upgrade-account-btn.component.html',
  styleUrls: ['./upgrade-account-btn.component.scss'],
})
export class UpgradeAccountBtnComponent implements OnInit {

  showUpgradeAccountModal: boolean = false;
  toShowContactModel: boolean = false;
  userAccountType: string;
  @Input() quoteRFQ;
  @Input() RfqId;
  @Input() btnClass;
  btnText: string;
  btnTitle: string;
  isCustomerModelOpen: boolean = false;
  isLoader: boolean = false;
  isBtnShow:boolean=false;
  encryptedContactViewModel: EncryptedContactViewModel;
  iMyAccountViewModel: IMyAccountViewModel;
  isStarterPackage: any;
  isGrowthPackage: any;
  constructor(private _profileService: ProfileService, private router: Router, private _toastr: ToastrService,private _SupplierService: SupplierService,) {
  }

  ngOnInit() {

      this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: 'Basic',
      membership: '',
      price: 0,
      paymentMethod: '',
      paymentFrequency: '',
      paymentAmount: 0,
      startDate: '0001-01-01T00:00:00',
      endDate: '0001-01-01T00:00:00',
      autoRenewal: false,
      errorMessage: '',
      result: false,
      pageName: 'Page Title',
      rfqId: 0,
      toAlternateEmailId: ''
    };

    this.encryptedContactViewModel = {
      id: '',
      loggedInId: 0
    };
    this.checkAccountType();
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  /**
   * Checks account type
   *  Check the user account type.
   */
  checkAccountType() {
    this.userAccountType = localStorage.getItem('AccountType');
    if (this.userAccountType == 'Basic' && this.quoteRFQ == false) {
      this.btnText = 'Upgrade Your Account';
      this.btnTitle = 'upgrade_your_account';
    } else if (this.userAccountType === 'Basic' && this.quoteRFQ == true) {
      this.btnText = 'Upgrade to Quote';
      this.btnTitle = 'upgrade_to_quote';
    } else if (this.userAccountType == 'Silver') {
      this.btnText = 'Upgrade Your Account';
      this.btnTitle = 'upgrade_your_account';
    } else {
      this.btnText = 'Upgrade Your Account';
      this.btnTitle = 'upgrade_your_account';
    }

  }
  /**
   * Gets logged encrypt id
   *  @returns logged in encrypted id.
   */
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  upgradeClick() {
    console.log("inside here could be issue---------->")
    
    localStorage.setItem('urlToRedirect', this.router.url);
    let userLocation = localStorage.getItem('manufacturingLocation');
    const isEligible = localStorage.getItem('isEligible');
    if(isEligible === 'true' && this.userAccountType == 'Basic' && (this.btnText === "Upgrade to Quote" || this.btnText == 'Upgrade Your Account') && (userLocation === 'Mexico' || userLocation === 'US' || userLocation === 'Canada')) {
      this.router.navigate(['/packages']);
    }
    if(this.userAccountType === 'Starter'){
      this.router.navigate(['/packages']);
      this.isStarterPackage = true;
      this.isGrowthPackage = false;
      localStorage.setItem("isStarterPackage", this.isStarterPackage);
      localStorage.setItem("isGrowthPackage", this.isGrowthPackage);
    }
    if (!(this.userAccountType == 'Basic' && userLocation == 'US')) {
      this.showUpgradeAccountModal = true;
    }
  }
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }

  openSaleModel() {
    this.toShowContactModel = true;
    this.showUpgradeAccountModal = false;
  }
  /**
   * Gets btn class
   * @returns  text to display on button
   */
  getBtnClass() {
    if (this.btnClass != null && this.btnClass != undefined) {
      return 'upgrade-account-btn';
    } else {
      return 'upgrade-quote-btn';
    }
  }
  sendEmailForEcommerce(){
    let userDetails =  JSON.parse(localStorage.getItem('iContactViewModel'));
    let temp ={
      userName: userDetails.firstName+' '+userDetails.lastName,
      contactId: this.loggedId,
      companyId: this.loggedCompanyId,
      companyName: userDetails.company.name,
    }

  }


  setSupplierUpgraderequest() {
    this.iMyAccountViewModel.contactId = this.loggedId;
    this.iMyAccountViewModel.companyId = this.loggedCompanyId;
    this.iMyAccountViewModel.rfqId = this.RfqId;
    this._SupplierService.setSupplierUpgraderequest(this.iMyAccountViewModel).subscribe(
      result => {
        if (result['result'] === true) {

          }
      },
      error => {

      },
      () => {}
    );
  }
}
