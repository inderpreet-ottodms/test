import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ProductAnalyticService } from '../../../../app/shared/product-analytic/product-analytic';
import { appConstants } from '../../../core/config/constant';
import { IContactViewModel, ILoginNewUserModel, Iuser } from '../../../core/models/accountModel';
import { AccountService } from '../../../core/services/account/account.service';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { BrowserStorageUtil } from '../../../../app/shared/browser.storage.util';


@Component({
  selector: 'app-get-logging',
  templateUrl: './get-logging.component.html',
  styleUrls: ['./get-logging.component.scss']
})
export class GetLoggingComponent implements OnInit {

  iContactViewModel: IContactViewModel;
  iLoginNewUserModel: ILoginNewUserModel;
  iuser: Iuser;

  constructor(private _toastr: ToastrService, private router: Router, private route: ActivatedRoute, private _accountService: AccountService, private _ProfileService: ProfileService, private cookieService: CookieService, private _rfqService: RfqService, private productAnalyticService:ProductAnalyticService) {}
  ngOnInit() {
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
      let token = params['token'];
      let supplierEmailInUrl= params['se'];
      if (token !== undefined && token !== null) {
        this._accountService.getDecryptContactLoginInfo(token).subscribe(
          response => {
            if (response.statusCode === 200) {
              this.onLoginProcess(response.value,supplierEmailInUrl);
            } else {
              this._toastr.error(response.value.errorMessage, 'Error!');
              this.router.navigateByUrl('/auth/login/simple');
            }
          },
          error => {
            this._toastr.error(error.error.messages, 'Error!');
            this.router.navigateByUrl('/auth/login/simple');
          }
        );
      } else {
        this._toastr.error('Invalid Token', 'Error!');
        this.router.navigateByUrl('/auth/login/simple');
      }
    });
  }


  onLoginProcess(result,supplierEmailInUrl) {
    this.iLoginNewUserModel = result;
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

        this._ProfileService.getProfileForLoginDetails(this.iLoginNewUserModel.contactIdEncrypt).subscribe(
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
        
            this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
              if (rfqForm2Enabled) {
                if (supplierEmailInUrl) {
                  this.redirectToCreateRFQ(atob(supplierEmailInUrl));
                } else {
                  this.router.navigate(['rfq/buyer']);
                }
              } else {
                this.router.navigate(['getStarted']);
              }
            });
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
        let IsPrimiumEncrypt = this._ProfileService.encrypt(JSON.stringify(this.iLoginNewUserModel.isPremium));
        localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
        localStorage.setItem('AccountType', this.iLoginNewUserModel.accountType);
        localStorage.setItem('isMqsEnabled', JSON.stringify(this.iLoginNewUserModel.isMqsEnabled));
        this._ProfileService.getProfileDetails(this.iLoginNewUserModel.contactIdEncrypt, this.iLoginNewUserModel.contactId).subscribe(
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
            setTimeout(()=>{
              this.router.navigate(['dashboard/supplier/ecommerce']);
            },1000)
           
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
  redirectToCreateRFQ(email) {
    this._accountService.getSupplierValidation(email).subscribe(
      response => {
        if (response.statusCode == 200) {
          if (response.data.companyId) {
            const selectedSupplier = [{
              companyId: response.data.companyId,
              territoryId:response.data.supplierTerritoryId,
              cmrfq: 1
            }];
            console.log("selectedSupplier", selectedSupplier);
            const queryParams = {
              queryParams: {
                suppliers: this._rfqService.encrypt(JSON.stringify(selectedSupplier))
              }
            };
            this.router.navigate(["/rfq/buyer"], queryParams);
            return;
          }
          this.router.navigate(["/rfq/buyer"]);
        }
      }
    );
  }
}
