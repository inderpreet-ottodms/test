import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  IContactViewModel,
  ILoginNewUserModel,
  Iuser
} from '../../../core/models/accountModel';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  appConstants
} from '../../../core/config/constant';

import {
  CookieService
} from 'ngx-cookie-service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ProfileService
} from '../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  AccountService
} from '../../../core/services/account/account.service';
import { BrowserStorageUtil } from '../../../../app/shared/browser.storage.util';
import { IpService } from '../../../../app/v2/shared/ip.service';
declare var window;

@Component({
  selector: 'app-link-in-logging-process',
  templateUrl: './link-in-logging-process.component.html',
  styleUrls: ['./link-in-logging-process.component.scss']
})
export class LinkInLoggingProcessComponent implements OnInit {

  iContactViewModel: IContactViewModel;
  iLoginNewUserModel: ILoginNewUserModel;
  iuser: Iuser;
  countryList: any;
  isLoginResponse: boolean = false;
  @ViewChild('registerForm',{static:false}) form: any;
  registerModel = {
    isExternalRegistration: true,
    firstName: '',
    lastName: '',
    isInvitedUser: false,
    isAdmin: true,
    createdOn: new Date(),
    password: '',
    confirmPass:'',
    isActive: true,
    phoneNo: '1234567890',
    userType: 'buyer',
    company: {
      name: ""
    },
    isBuyer: false,
    isSupplier: false,
    emailId: '',
    address: {
      countryId: '92',
      postalCode: ''
    },
    t: '',
    isLinkedInUser: true,
    userIpAddress: ''
  }

  showRegistration: boolean = false;
  ipAddress: any;
  constructor(private _masterService: MasterService, private route: ActivatedRoute, private router: Router, private cookieService: CookieService, private _toastr: ToastrService, private _profileService: ProfileService, private _rfqService: RfqService, private _accountService: AccountService, private ipService: IpService) {
  }

  ngOnInit() {
    this.getIpAddress();

    this.iuser = {
      accessFailedCount: 0,
      concurrencyStamp: '',
      email: '',
      emailConfirmed: false,
      firstName: '',
      id: '',
      importedCont_id: 0,
      lastName: '',
      lockoutEnabled: false,
      lockoutEnd: '',
      normalizedEmail: '',
      normalizedUserName: '',
      passwordHash: '',
      phoneNumber: '',
      phoneNumberConfirmed: false,
      securityStamp: '',
      twoFactorEnabled: false,
      userName: ''
    };
    this.iLoginNewUserModel = {
      errorMessage: '',
      token: '',
      contactId: 0,
      user: this.iuser,
      contactIdEncrypt: '',
      result: false,
      isRFQCreated: false,
      isBuyer: false,
      isBuyerDashboard: null,
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      applicableRoles: [],
      isPremium: false,
      accountType: '',
      isMqsEnabled: false,
      manufacturingLocation: null
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      comments: '',
      companyId: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactFunction: '',
      contactId: 0,
      isLoginFromVision: false,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      incotermId: 0,
      industry: '',
      industryId: 0,
      isActive: true,
      isAdmin: true,
      isBuyer: true,
      isMailInHtml: true,
      isNotifyByEmail: true,
      languageId: 0,
      lastName: '',
      linkedIn: '',
      modifiedOn: '',
      password: '',
      phoneNo: '',
      recordOriginId: 0,
      result: true,
      roleId: 0,
      showDeltailedRating: true,
      showRfqAwardStat: true,
      title: '',
      tweeter: '',
      userId: '',
      contactPictureFile: '',
      logoOfCompany: '',
      token: '',
      language: null,
      address: null,
      company: null,
      isVarified: false,
      expiration: null,
      currentPassword: '',
      newPassword: '',
      isRFQCreated: false,
      grantType: '',
      refreshToken: '',
      googleImageUrl: '',
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };

    this.route.queryParams.subscribe(params => {
      let code = params['code'];
      let state = params['state']
      this.checkAuthentication(code, state);
    });

    this.getCountryList();
  }
  checkAuthentication(code, state) {
    if(code !== null && code !== undefined && code !== ''){
    this._masterService.getAuthentication(code, state, '').subscribe(
      response => {
        if (!response.isError) {
          this.registerModel.emailId = response.data.linkedInRegisteredUserEmailAddress;
          this.registerModel.t = response.data.t;
          this.registerModel.company.name = (response.data.linkedInRegisteredUserCompanyName !== undefined && response.data.linkedInRegisteredUserCompanyName !== null)?  response.data.linkedInRegisteredUserCompanyName: '';
          if (response.data.isMfgRegisteredUser === false) {
            this.showRegistration = true;
          } else if (response.data.isMfgRegisteredUser === true && response.data.isLinkedInRegisteredUser === true) {
            this.onLoginProcess(response.data.contactViewModel.value);
          } else if (response.data.isMfgRegisteredUser === true && response.data.isLinkedInRegisteredUser === false) {
            this._toastr.warning('Please login with the credential, you are already an MFG user,', 'Warning!');
            this.router.navigateByUrl('/auth/login/simple');
          }
        }
      }
    );
    } else {
      this._toastr.warning('Something went wrong please try again', 'Warning!');
      this.router.navigateByUrl('/auth/login/simple');
    }
  }
  getCountryList() {
    this._masterService.getCountry().subscribe(
      response => {
        this.countryList = response;
      }
    );
  }
  registerUser(data) {
    if(!this.isLoginResponse){
      this.isLoginResponse = true;
    console.log(this.registerModel);
    this.registerModel.isBuyer = (data.userType == 'buyer') ? true : false;
    this.registerModel.isSupplier = (data.userType == 'manufacturing') ? true : false;
    this.registerModel.userIpAddress = this.ipAddress;
    this._accountService.setUserDetails(this.registerModel).subscribe(
      response => {
        if (!response.isError && response.data.result) {
          this.onLoginProcess(response.data.contactViewModel.value);
        } else {
          this._toastr.warning(response.data.errorMessage, 'Warning!');
          // this._toastr.error(response.message, 'Error!');
          this.router.navigateByUrl('/auth/login/simple');
          this.isLoginResponse = false;
        }
      },
      error => {
        this._toastr.warning(error.error.errorMessage, 'Warning!');
        // this._toastr.error('Something went wrong please try again', 'Error!');
        this.router.navigateByUrl('/auth/login/simple');
        this.isLoginResponse = false;
      }
    );
  }
  }

  onLoginProcess(result) {
    this.iLoginNewUserModel = result;
    let isUserLogin = false;
    if (result.totalLoginCount === null || result.totalLoginCount === undefined) {
      isUserLogin = true;
    }
    if (result.isGoldPlatinumViaStripe != null && result.isGoldPlatinumViaStripe != undefined && result.isGoldPlatinumViaStripe != '') {
      localStorage.setItem('isStripUser', result.isGoldPlatinumViaStripe);
    } else {
      localStorage.setItem('isStripUser', 'false');
    }
    if (this.iLoginNewUserModel.result === true) {
      appConstants.settingDefault.decimalValueDefault = result.defaultNoOfDecimalPlaces;
      this.cookieService.deleteAll();
      localStorage.clear();
      localStorage.setItem('manufacturingLocation', this.iLoginNewUserModel.manufacturingLocation);
      localStorage.setItem('User2', this.iLoginNewUserModel.user.userName);
      localStorage.setItem('LoggedId', this.iLoginNewUserModel.contactId.toString());
      localStorage.setItem('LoggedIdEncript', this.iLoginNewUserModel.contactIdEncrypt.toString());
      localStorage.setItem('applicableRoles', JSON.stringify(this.iLoginNewUserModel.applicableRoles));
      BrowserStorageUtil.setRefreshToken(this.iLoginNewUserModel.refreshToken)
      const tokenInfo = JSON.parse(this.iLoginNewUserModel.token);
      BrowserStorageUtil.setToken(tokenInfo.auth_token);
      if ((this.iLoginNewUserModel.isBuyer === true && this.iLoginNewUserModel.isBuyerDashboard === null) || this.iLoginNewUserModel.isBuyerDashboard === true) {

        if (result.isLiveQuoteBetaTried !== null && result.isLiveQuoteBetaTried !== undefined && result.isLiveQuoteBetaTried !== '') {
          localStorage.setItem('isQMSTrailModelShown', result.isLiveQuoteBetaTried);
        } else {
          localStorage.setItem('isQMSTrailModelShown', 'false');
        }
        localStorage.setItem('Usertype', 'Buyer');
        localStorage.setItem('isMqsEnabled', 'false');

        this._profileService.getProfileForLoginDetails(this.iLoginNewUserModel.contactIdEncrypt).subscribe(
          result2 => {
            this.iContactViewModel = result2;

            if (this.iContactViewModel.companyId) {
              localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId.toString());
              localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
            } else {
              localStorage.setItem('loggedCompanyId', '0');
            }
            if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
              if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
                localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
              }
            }
            if (this.iLoginNewUserModel.isRFQCreated === false) {
              localStorage.setItem('isNewUser', 'true');
            }
            this.router.navigate(['dashboard/buyer/default']);
          });
      } else {
        if (result.isLiveQuoteBetaTried !== null && result.isLiveQuoteBetaTried !== undefined && result.isLiveQuoteBetaTried !== '') {
          localStorage.setItem('isQMSTrailModelShown', result.isLiveQuoteBetaTried);
        } else {
          localStorage.setItem('isQMSTrailModelShown', 'false');
        }
        localStorage.setItem('Usertype', 'Supplier');
        localStorage.setItem('isCapabilitiesFilled', this.iLoginNewUserModel.isCapabilitiesFilled.toString());
        localStorage.setItem('isCompanyProfileFilled', this.iLoginNewUserModel.isCompanyProfileFilled.toString());
        let IsPrimiumEncrypt = this._profileService.encrypt(JSON.stringify(this.iLoginNewUserModel.isPremium));
        localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
        localStorage.setItem('AccountType', this.iLoginNewUserModel.accountType);
        localStorage.setItem('isMqsEnabled', JSON.stringify(this.iLoginNewUserModel.isMqsEnabled));

        this._profileService.getProfileDetails(this.iLoginNewUserModel.contactIdEncrypt, this.iLoginNewUserModel.contactId).subscribe(
          result2 => {
            this.iContactViewModel = result2;
            localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
            if (this.iContactViewModel.companyId) {
              localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId.toString());
            } else {
              localStorage.setItem('loggedCompanyId', '0');
            }
            if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
              if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
                localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
              }
            }
            const tokenInfo = JSON.parse(this.iLoginNewUserModel.token);
            BrowserStorageUtil.setToken(tokenInfo.auth_token);
            if (this.iLoginNewUserModel.isRFQCreated === false) {
              localStorage.setItem('isNewUser', 'true');
            }
            this.router.navigate(['dashboard/supplier/ecommerce']);
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }
    } else {
      this._toastr.error(this.iLoginNewUserModel.errorMessage, 'Error!');
      if (this.iLoginNewUserModel.errorMessage === 'Your account has been locked out for 5 minutes due to multiple failed login attempts.') {
        this.router.navigate(['/auth/forgot']);
      }
    }
  }
  comparePassword(){
    if(this.registerModel.password !== this.registerModel.confirmPass){
      return true;
    }else{
      return false;
    }
  }

  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }
}
