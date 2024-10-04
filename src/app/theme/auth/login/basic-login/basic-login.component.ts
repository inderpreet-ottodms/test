import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  CookieService
} from 'ngx-cookie-service';
import {
  ToastrService
} from 'ngx-toastr';

import {
  appConstants
} from '../../../../core/config/constant';
import {
  IAddressModel,
  ICompanyModel,
  IContactViewModel,
  ILoginNewUserModel,
  Iuser,
} from '../../../../core/models/accountModel';
import {
  AccountService
} from '../../../../core/services/account/account.service';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import * as moment from 'moment';
import { AppUtil } from '../../../../../app/app.util';
import { BrowserStorageUtil } from '../../../../../app/shared/browser.storage.util';
import {
  environment
} from '../../../../../environments/environment';
import { JwtTokenService } from '../../../../component/SSO/services/jwt-token.service';
import { SupplierService } from '../../../../core/services/supplier/supplier.service';
import { ProductAnalyticService } from '../../../../shared/product-analytic/product-analytic';
import { SentryService } from '../../../../../app/shared/sentry/sentry.service';

declare var window;

@Component({
  selector: 'app-basic-login',
  templateUrl: './basic-login.component.html',
  styleUrls: ['./basic-login.component.scss'],
  providers: [JwtTokenService]
})
export class BasicLoginComponent implements OnInit {

  loginModel: any = {
    username: null,
    password: null,
    isRemember: true
  };
  loading = false;
  isLoginResonse: boolean;
  iContactViewModel: IContactViewModel;
  iCompanyModel: ICompanyModel;
  iAddressModel1: IAddressModel;
  iLoginNewUserModel: ILoginNewUserModel;
  iuser: Iuser;
  errorLoginMessage: string;
  isLoginFailed: boolean;
  cookieuName = '';
  cookieuPassword = '';
  encrypted_text: string;
  vEmail: string;
  vPasswd: string;
  vRole: string;
  vUserId: string;
  isFromVision: boolean;
  @Input() returnUrl: any;
  @Input() forceReload: boolean;
  @Input() logo: string = "assets/Logo_new.png";

  supplierEmail: string = null;
  supplierCompanyId: number = null;
  supplierCompanyName: string = null;
  supplierTerritoryId: number = null;
  registrationURL: string = '';
  profileComplete: any;
  passwordVisible = false;
  constructor(
    private router: Router,
    private _toastr: ToastrService,
    private route: ActivatedRoute,
    private _accountService: AccountService,
    private _ProfileService: ProfileService,
    private supplierService: SupplierService,
    private cookieService: CookieService,
    private _rfqService: RfqService,
    private jwtTokenService: JwtTokenService,
    private productAnalyticService:ProductAnalyticService,
    private sentryService: SentryService ) {
    this.isLoginResonse = false;
    this.registrationURL = environment.RegistrationLink;
  }

  initOfPage() {
    this.initJobPostingModel();
    this.createForm();
    this.encrypted_text = '';
  }

  initJobPostingModel() {
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
    this.iAddressModel1 = {
      address5: '',
      addressId: 0,
      addressType: 1,
      city: '',
      countryId: 0,
      deptAddress: '',
      country: '',
      errorMessage: '',
      isActive: false,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      result: false,
      streetAddress: '',
      companyShippingSiteViewModelList: []
    };
    this.iCompanyModel = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      _3dTourUrl: '',
      employeeCountRange: '',
      employeeCountRangeId: 1,
      errorMessage: '',
      isActive: true,
      name: '',
      companylogo: '',
      services: '',
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: '',
      supplierTypeId: 0
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
      address: this.iAddressModel1,
      company: this.iCompanyModel,
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
  }

  createForm() {
    this.cookieuName = this.cookieService.get('uName');
    this.cookieuPassword = this.cookieService.get('uPassword');
    this.encrypted_text = this.cookieuName;
    if (this.cookieuName !== '' && this.cookieuPassword !== '') {
      this.iContactViewModel.emailId = AppUtil.decrypt(this.cookieuName);
      this.iContactViewModel.password = AppUtil.decrypt(this.cookieuPassword);
    }
  }
  isLoginFromVision() {

  }
  ngOnInit() {
    if (location.hostname == 'mfg.com' ||
      location.hostname == 'https://mfg.com' ||
      location.hostname == 'www.mfg.com' ||
      location.hostname == 'https://www.mfg.com') {
      window.open('https://app.mfg.com', '_self');
    }
    this.route.queryParams.subscribe(params => {
      if (AppUtil.isEmptyString(params['dnr'])) {
        sessionStorage.setItem("materialsReferer", document.referrer);
      }
      let supplierEmail=params['se'];//considering redirected from mfg directory page  
      if(AppUtil.isNotEmptyString(supplierEmail)){
        supplierEmail = window.atob(supplierEmail);
        if(AppUtil.isNotEmptyString(supplierEmail)){
          this.supplierEmail=supplierEmail;
          this.checkSupplierValidation(this.supplierEmail);
        }
      }
      if (params['email'] !== undefined) {
        this.vEmail = window.atob(params['email']);
        this.vPasswd = window.atob(params['passwd']);
        this.vRole = window.atob(params['role']);
        this.vUserId = window.atob(params['userIdB']);
      }
      let tempToken = params['s'];
      if (tempToken != null && tempToken != undefined) {
        let decodeObject = JSON.parse(this.jwtTokenService.extractDataFromJWT(tempToken));
        this.supplierEmail = decodeObject['supplierEmail'];
        if (AppUtil.isNotEmptyString(this.supplierEmail)) {
          this.checkSupplierValidation(this.supplierEmail);
        }
      }
    });

    this.isFromVision = false;
    if (!!this.vEmail && !!this.vPasswd && !!this.vRole && !!this.vUserId) {
      this.isFromVision = true;
    }
    if (!this.isFromVision) {
      if (AppUtil.isUserLoggedIn()) {
        console.log("User is logged in but trying to access login page so redirecting to home page")
        this.router.navigate(['/']);
        return;
      }
    }
    console.log("Is login from vision="+this.isFromVision);
    this.initOfPage();
    localStorage.clear();
    this.productAnalyticService.closeAnalyticSession();
    if (this.returnUrl == null) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;;
    }
    if (this.returnUrl == null) {
      const page = localStorage.getItem('page');
      if (page === '/leadstream') {
        this.returnUrl = '/leadstream';
      }
      if (page) {
        let isMsg = page.includes('/globalMessage?msgid=');
        if (isMsg) {
          this.returnUrl = page;
        }
      }
    }
    if (this.isFromVision) {
      this.iContactViewModel.emailId = this.vEmail;
      this.iContactViewModel.password = this.vPasswd;
      this.loginModel.username = null;
      this.loginModel.password = null;
      this.loginModel.username = this.vEmail;
      this.loginModel.password = this.vPasswd;
      this.onLogin();
    }
  }

  isTermsModelShow() {
    return this._rfqService.get('isTermsModelShow');
  }



  onLogin() {
    if (AppUtil.isEmptyString(this.loginModel.username) ||
      AppUtil.isEmptyString(this.loginModel.password)) {
      console.log("Either user name or password is not provided yet")
      return false;
    }
    sessionStorage.setItem('isLoginFromVision', this.isFromVision.toString());
    localStorage.setItem('isLoginFromVision', this.isFromVision.toString())

    this.isLoginResonse = true;
    this.iContactViewModel.isLoginFromVision = this.isFromVision;
    this.iContactViewModel.emailId = this.loginModel.username;
    this.iContactViewModel.password = btoa(this.loginModel.password);

    this._accountService.getUser(this.iContactViewModel).subscribe(
      authenticateResponse => {
        if (!authenticateResponse.result) {
          this.isLoginFailed = true;
          this.errorLoginMessage = this.iLoginNewUserModel.errorMessage;
          this.isLoginResonse = false;
          // tslint:disable-next-line:max-line-length
          if (this.iLoginNewUserModel.errorMessage === 'Your account has been locked out for 5 minutes due to multiple failed login attempts.') {
            this.router.navigate(['/auth/forgot']);
          }
          return;
        }
        this.iLoginNewUserModel = authenticateResponse;
        const tokenInfo = JSON.parse(this.iLoginNewUserModel.token);
        BrowserStorageUtil.setToken(tokenInfo.auth_token);
        localStorage.setItem('isStripUser', AppUtil.isEmptyString(authenticateResponse.isGoldPlatinumViaStripe) ? 'false' : authenticateResponse.isGoldPlatinumViaStripe);
        appConstants.settingDefault.decimalValueDefault = authenticateResponse.defaultNoOfDecimalPlaces;
        if (this.isFromVision) {
          const tokenInfo = JSON.parse(this.iLoginNewUserModel.token);
          BrowserStorageUtil.setToken(tokenInfo.auth_token);
          BrowserStorageUtil.setRefreshToken( this.iLoginNewUserModel.refreshToken)
          localStorage.setItem('manufacturingLocation', this.iLoginNewUserModel.manufacturingLocation);
          BrowserStorageUtil.setLoginSessionEndTime();
          this.switchAccount(this.vRole, this.vUserId);
          return;
        }

        if ((this.iLoginNewUserModel.isBuyer === true &&
          this.iLoginNewUserModel.isBuyerDashboard === null) ||
          this.iLoginNewUserModel.isBuyerDashboard === true) {
          this._ProfileService.getProfileForLoginDetails(this.iLoginNewUserModel.contactIdEncrypt).subscribe(
            result2 => {
              this.postLoginSetData(authenticateResponse, result2);
              this.sentryService.setLoggedUserDetails();
            });
          return;
        }

        if (this.loginModel.isRemember === true) {
          this.cookieService.set('uName', AppUtil.encrypt(this.loginModel.username));
          this.cookieService.set('uPassword', AppUtil.encrypt(this.loginModel.password));
        } else {
          this.cookieService.deleteAll();
        }
        localStorage.clear();
        localStorage.setItem('isQMSTrailModelShown', AppUtil.isEmptyString(authenticateResponse.isLiveQuoteBetaTried) ? 'false' : authenticateResponse.isLiveQuoteBetaTried);
        localStorage.setItem('manufacturingLocation', this.iLoginNewUserModel.manufacturingLocation);
        localStorage.setItem('User2', this.iLoginNewUserModel.user.userName);
        localStorage.setItem('LoggedId', this.iLoginNewUserModel.contactId.toString());
        localStorage.setItem('LoggedIdEncript', this.iLoginNewUserModel.contactIdEncrypt.toString());
        localStorage.setItem('Usertype', 'Supplier');
        localStorage.setItem('applicableRoles', JSON.stringify(this.iLoginNewUserModel.applicableRoles));
        localStorage.setItem('isCapabilitiesFilled', this.iLoginNewUserModel.isCapabilitiesFilled.toString());
        localStorage.setItem('isCompanyProfileFilled', this.iLoginNewUserModel.isCompanyProfileFilled.toString());
        let IsPrimiumEncrypt = this._ProfileService.encrypt(JSON.stringify(this.iLoginNewUserModel.isPremium));
        BrowserStorageUtil.setToken(tokenInfo.auth_token);
        localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
        localStorage.setItem('AccountType', this.iLoginNewUserModel.accountType);
        localStorage.setItem('StripeCustomerId', authenticateResponse.stripeSubscriptionCustomerId);
        localStorage.setItem('isMqsEnabled', JSON.stringify(this.iLoginNewUserModel.isMqsEnabled));
        BrowserStorageUtil.setRefreshToken(this.iLoginNewUserModel.refreshToken);
        BrowserStorageUtil.setLoginSessionEndTime();
        this._ProfileService.getProfileDetails(this.iLoginNewUserModel.contactIdEncrypt, this.iLoginNewUserModel.contactId).subscribe(
          result2 => {
            this.iContactViewModel = result2;
            this.supplierService.getSupplierPublishProfileStatus(this.iContactViewModel.companyId).subscribe(res => {
              localStorage.setItem('isEmailVerified', this.iContactViewModel.isEmailVerified);
              localStorage.setItem('profileComplete', res.data.isProfileComplete);
              this.profileComplete = res.data.isProfileComplete
            })
            localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
            localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId ? this.iContactViewModel.companyId.toString() : '0');

            this.sentryService.setLoggedUserDetails();

            if (AppUtil.isNotEmptyString(this.iContactViewModel.contactPictureFile)) {
              if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
                localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
              }
            }
            
            const tokenInfo = JSON.parse(this.iLoginNewUserModel.token);
            BrowserStorageUtil.setToken(tokenInfo.auth_token);
            if (this.iLoginNewUserModel.isRFQCreated === false) {
              localStorage.setItem('isNewUser', 'true');
            }
            this.isLoginResonse = false;
            const isCapabilitiesFilled = localStorage.getItem('isCapabilitiesFilled');
            if (this.supplierCompanyName != null && this.supplierCompanyName != undefined && (this.iLoginNewUserModel.applicableRoles.includes('Buyer') || this.iLoginNewUserModel.applicableRoles.includes('Buyer Admin'))) {
              this.switchAccount('Buyer Admin', this.iContactViewModel.userId);
              return;
            } else {
              if (this.returnUrl) {
                this.redirectTo(this.returnUrl);
                return;
              } else {
                if (isCapabilitiesFilled === 'true' && authenticateResponse.isPremium) {
                  this.router.navigate(['dashboard/supplier/ecommerce']);
                } else if (isCapabilitiesFilled === 'false' && authenticateResponse.isPremium) {
                  this.router.navigate(['supplier/supplierMyRfq']);
                } else {
                  this.router.navigate(['dashboard/supplier/ecommerce']);
                }
              }
            }

          },
          error => {
            this.isLoginResonse = false;
            this._rfqService.handleError(error);
          },
          () => { }
        );
      },
      error => {
        this.isLoginResonse = false;
        if (error['statusText'] === 'Unauthorized') {
          this._toastr.error('Session has been expired!', '');
          this.errorLoginMessage = 'Session has been expired!';
          
          localStorage.clear();
          this.router.navigateByUrl('/auth/login/simple');
        } else {
          this.isLoginFailed = true;
          if (!error.error.errorMessage) {
            this.errorLoginMessage = error.message;
          } else {
            this.errorLoginMessage = error.error.errorMessage;
          }
        }
      },
      () => { }
    );

  }

  //code written for M2-4416-sprint 7.4 -AJ-(24-05-2022)
  getSubmittedRFQCount() {
    this.isLoginResonse = true;

    let buyerRfQCountResult;
    const rfqList$ = this._rfqService.GetBuyerRFQCount(BrowserStorageUtil.getLoogedUserId(), Number(localStorage.getItem('loggedCompanyId')));
    rfqList$.subscribe(
      buyerRfqResult => {
        buyerRfQCountResult = buyerRfqResult;
        // Inner subscription block for GetSubmittedRFQCount
        this._ProfileService.GetSubmittedRFQCount(BrowserStorageUtil.getLoogedUserId(), 0).subscribe(submittedRFQCountResult => {
          this.isLoginResonse = false;
          if (submittedRFQCountResult.result == true) {
            if (submittedRFQCountResult.data.rfqCount > 0 || (buyerRfQCountResult != null && buyerRfQCountResult.myRFQCount > 0)) {
              this.router.navigate(['dashboard/buyer/default']);
            } else {
              this._ProfileService.redirectToNewBuyer('getStarted');
            }
          }
        }, error => {
          console.log(error);
        });
      },
      error => {
        console.log(error);
      }
    );
  }
  switchAccount(Role: string, userId) {

    this._accountService.swicthContact(userId, Role, this.isFromVision).subscribe(data => {
      this._ProfileService.getProfileForLoginDetails(data['contactIdEncrypt'].toString()).subscribe(
        result2 => {

          this.iContactViewModel = result2;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          localStorage.setItem('isStripUser', AppUtil.isEmptyString(data.isGoldPlatinumViaStripe) ? 'false' : data.isGoldPlatinumViaStripe);
          localStorage.setItem('isQMSTrailModelShown', AppUtil.isEmptyString(data.isLiveQuoteBetaTried) ? 'false' : data.isLiveQuoteBetaTried);
          localStorage.removeItem('manufacturingLocation');
          localStorage.setItem('manufacturingLocation', data.manufacturingLocation);
          localStorage.setItem('User2', data.user.userName);
          if (AppUtil.isNotEmptyString(this.iContactViewModel.contactPictureFile)) {
            if (localStorage.getItem('userHeaderLogo') !== data.contactViewModel.contactPictureFile) {
              localStorage.setItem('userHeaderLogo', data.contactViewModel.contactPictureFile);
            }
          }
          localStorage.setItem('LoggedId', data.contactViewModel.contactId.toString());
          localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
          localStorage.setItem('loggedCompanyId', data.contactViewModel.companyId.toString());
          localStorage.setItem('LoggedIdEncript', data['contactIdEncrypt'].toString());
          if (data.contactViewModel.isRFQCreated === true) {
            localStorage.setItem('isNewUser', 'false');
          } else {
            localStorage.setItem('isNewUser', 'true');
          }
          if (data.contactViewModel.isBuyer === true) {
            localStorage.setItem('Usertype', 'Buyer');
            localStorage.setItem('isMqsEnabled', 'false');
            localStorage.removeItem('AccountType');
            this.isLoginResonse = false;
            this._accountService.sendMessage('Buyer');
            if (this.supplierCompanyName != null && this.supplierCompanyName != undefined) {
              this.sendToCreateRFQ();
            } else {
              // this.router.navigate(['dashboard/buyer/default']);
              this.getSubmittedRFQCount();
            }
            return;
          } else {
            appConstants.settingDefault.decimalValueDefault = data.defaultNoOfDecimalPlaces;
            localStorage.setItem('Usertype', 'Supplier');
            let IsPrimiumEncrypt = this._ProfileService.encrypt(JSON.stringify(data.contactViewModel.isPremium));
            localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
            localStorage.setItem('AccountType', data.accountType);
            localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
            localStorage.setItem('isCapabilitiesFilled', data.contactViewModel.isCapabilitiesFilled.toString());
            localStorage.setItem('isCompanyProfileFilled', data.contactViewModel.isCompanyProfileFilled.toString());
            this.isLoginResonse = false;
            localStorage.setItem('isMqsEnabled', JSON.stringify(data.isMqsEnabled));
            this.router.navigate(['dashboard/supplier/ecommerce']);
            this._accountService.sendMessage('Supplier');
          }
        });
    },
      error => {
        this._rfqService.handleError(error);
      },
      () => { });
  }

  switchToSupplier(userId, Role) {
    let isLoginFromVision;
    if ((sessionStorage.getItem('isLoginFromVision')) == 'true') {
      isLoginFromVision = true;
    } else {
      isLoginFromVision = false;
    }
    this._accountService.swicthContact(userId, Role, isLoginFromVision).subscribe(data => {
      localStorage.setItem('isStripUser', AppUtil.isEmptyString(data.isGoldPlatinumViaStripe) ? 'false' : data.isGoldPlatinumViaStripe);
      localStorage.setItem('isQMSTrailModelShown', AppUtil.isEmptyString(data.isLiveQuoteBetaTried) ? 'false' : data.isLiveQuoteBetaTried);
      localStorage.setItem('User2', data.user.userName);
      localStorage.removeItem('manufacturingLocation');
      localStorage.setItem('manufacturingLocation', data.manufacturingLocation);
      if (AppUtil.isNotEmptyString(this.iContactViewModel.contactPictureFile)) {
        if (localStorage.getItem('userHeaderLogo') !== data.contactViewModel.contactPictureFile) {
          localStorage.setItem('userHeaderLogo', data.contactViewModel.contactPictureFile);
        }
      }
      localStorage.setItem('LoggedId', data.contactViewModel.contactId.toString());
      localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
      localStorage.setItem('loggedCompanyId', data.contactViewModel.companyId.toString());
      localStorage.setItem('LoggedIdEncript', data['contactIdEncrypt'].toString());
      if (data.contactViewModel.isRFQCreated === true) {
        localStorage.setItem('isNewUser', 'false');
      } else {
        localStorage.setItem('isNewUser', 'true');
      }
      localStorage.setItem('Usertype', 'Supplier');
      localStorage.setItem('isMqsEnabled', JSON.stringify(data.isMqsEnabled));
      let IsPrimiumEncrypt = this._ProfileService.encrypt(JSON.stringify(data.contactViewModel.isPremium));
      localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
      localStorage.setItem('AccountType', data.accountType);
      localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
      localStorage.setItem('isCapabilitiesFilled', data.contactViewModel.isCapabilitiesFilled.toString());
      localStorage.setItem('isCompanyProfileFilled', data.contactViewModel.isCompanyProfileFilled.toString());
      this.isLoginResonse = false;
      appConstants.settingDefault.decimalValueDefault = data.defaultNoOfDecimalPlaces;
      this.redirectTo(this.returnUrl);
      this._accountService.sendMessage('Supplier');
    },
      error => {
        this._rfqService.handleError(error);
      },
      () => { });
  }
  loginWithLinkIn() {
    let returnUrl = environment.AppUrl + 'linkedin';
    this._accountService.getLoginLinkInUrl('1234567', returnUrl).subscribe(
      response => {
        if (!response.isError) {
          window.open(response.data.linkedInOAuthAuthorizationPageRedirectionUrl, '_self');
        }
      }
    );

  }
  sendToCreateRFQ() {

    this._rfqService.getConfigCatData().subscribe(rfqForm2Enabled=>{
      if(rfqForm2Enabled){
        const selectedSupplier=[{
          companyId:this.supplierCompanyId, 
          territoryId:this.supplierTerritoryId,
          cmrfq:1}];
        const queryParams = {
          queryParams:{
            suppliers: this._rfqService.encrypt(JSON.stringify(selectedSupplier))}
          };
        this.router.navigate(["/rfq/buyer"], queryParams );
        return;
      }else{
    let discoverObj = {
      id: this.supplierCompanyId,
      Name: this.supplierCompanyName
    }
    let encryptObj = [];
    encryptObj.push(discoverObj);
    localStorage.setItem('manufactureId', JSON.stringify(encryptObj));
    localStorage.setItem('territoryId', JSON.stringify(this.supplierTerritoryId));
    localStorage.setItem('cmrfq', '1');
    this.router.navigate(['/rfq/editrfq']);}
  });
  }
  checkSupplierValidation(email) {
    this._accountService.getSupplierValidation(email).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.supplierCompanyId = response.data.companyId;
          this.supplierCompanyName = response.data.companyName;
          this.supplierTerritoryId = response.data.supplierTerritoryId;
        }
      }
    );
  }
  openRegistrationLink() {
    window.open(this.registrationURL, '_self');
  }

  loginBuyerTrackMixPanel(data) {
    this.productAnalyticService.mixpanelTracking(this.productAnalyticService.MPE_LOGIN,{
      is_loggedIn: true,
      login_date: new Date(),
      zip: data.address.postalCode,
      page_type: "Dashboard Landing",
      country: data.address.country,
      qualified_buyer: data.isValidatedBuyer,
      rfq_count: localStorage.getItem('submitRfqCount'),
    });
  }

  redirectTo(location) {
    if (this.forceReload) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([location])
      });
    } else {
      this.router.navigateByUrl(this.returnUrl);
    }
  }
  postLoginSetData(authenticateResponse, result2) {
    
    if (this.loginModel.isRemember === true) {
      this.cookieService.set('uName', AppUtil.encrypt(this.loginModel.username));
      this.cookieService.set('uPassword', AppUtil.encrypt(this.loginModel.password));
    } else {
      this.cookieService.deleteAll();
    }
    localStorage.clear();
    this.iContactViewModel = result2;
    const tokenInfo = JSON.parse(this.iLoginNewUserModel.token);
    localStorage.setItem('isMqsEnabled', 'false');
    BrowserStorageUtil.setToken(tokenInfo.auth_token);

    localStorage.setItem('isQMSTrailModelShown', AppUtil.isEmptyString(authenticateResponse.isLiveQuoteBetaTried) ? 'false' : authenticateResponse.isLiveQuoteBetaTried);
    localStorage.setItem('manufacturingLocation', this.iLoginNewUserModel.manufacturingLocation);
    localStorage.setItem('User2', this.iLoginNewUserModel.user.userName);
    localStorage.setItem('LoggedIdEncript', this.iLoginNewUserModel.contactIdEncrypt.toString());
    localStorage.setItem('LoggedId', this.iLoginNewUserModel.contactId.toString());
    localStorage.setItem('Usertype', 'Buyer');
    localStorage.setItem('applicableRoles', JSON.stringify(this.iLoginNewUserModel.applicableRoles));
    BrowserStorageUtil.setRefreshToken(this.iLoginNewUserModel.refreshToken);
    BrowserStorageUtil.setLoginSessionEndTime();
    localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
    localStorage.setItem('isEmailVerified', this.iContactViewModel.isEmailVerified);
    localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId ? this.iContactViewModel.companyId.toString() : '0');
    this.loginBuyerTrackMixPanel(this.iContactViewModel)

    if (AppUtil.isNotEmptyString(this.iContactViewModel.contactPictureFile)) {
      if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
        localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
      }
    }
    if (this.returnUrl && this.iLoginNewUserModel.applicableRoles.includes('Seller')) {
      this.switchToSupplier(this.iContactViewModel.userId, 'SellerAdmin');
      return;
    } else {
      this.isLoginResonse = false;
      if (AppUtil.isNotEmptyString(this.supplierCompanyName)) {
        this.sendToCreateRFQ();
        return;
      } else {
        if (this.iLoginNewUserModel.isRFQCreated === false) {
          localStorage.setItem('isNewUser', 'true');
        }
        if (this.returnUrl) {
          this.redirectTo(this.returnUrl);
          return;
        } else {
          this.getSubmittedRFQCount();
          return;
        }
      }

    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
