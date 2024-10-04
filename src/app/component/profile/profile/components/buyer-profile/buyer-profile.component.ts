import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder
} from '@angular/forms';
import {
  Http
} from '@angular/http';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IMailingAddressesModel,
} from '../../../../../core/models/profileModel';
import {
  IContactViewModel,
  ILanguageModel,
  ICompanyModel,
  IAddressModel,
  IProfileViewModel
} from '../../../../../core/models/accountModel';

import {
  IEmployeesCountRangeModel,
  IIndustriesModel,
  ICountryViewModel
} from '../../../../../core/models/globalMaster';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';
import {
  ActivatedRoute
} from '@angular/router';
import {
  HttpClient
} from '@angular/common/http';
import {
  ConfirmationService
} from 'primeng/api';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
@Component({
  selector: 'app-buyer-profile',
  templateUrl: './buyer-profile.component.html',
  styleUrls: ['./buyer-profile.component.scss'],
  providers: [ConfirmationService]
})
export class BuyerProfileComponent implements OnInit {
  personalProfileForm: FormGroup;
  iProfileViewModel: IProfileViewModel;
  // iLanguageModelColl: ILanguageModel[];
  iCountryViewModelColl: ICountryViewModel[];
  // iEmployeesCountRangeModel: IEmployeesCountRangeModel[];
  //  iIndustriesModel: IIndustriesModel[];
  iContactViewModel: IContactViewModel;
  iContactViewModel2: IContactViewModel;
  iMailingAddressesModel: IMailingAddressesModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  defaultOption: '';
  findLanguage: ILanguageModel;
  findIndustry: IIndustriesModel;
  findRang: IEmployeesCountRangeModel;
  countRange: string;
  industryId: number;
  mailingAddressData: any;
  shippingAddressData: any;
  userCreatedDateString = ' ';
  isShiiping5: boolean;
  isMailingAvaible: boolean;
  isShiipingAvailable: boolean;
  isCancel1stStep: boolean;
  monthColl = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  constructor(private _fb: FormBuilder,
    private _httpClient: HttpClient,
    private _customValidatorsService: CustomValidatorService,
    private route: ActivatedRoute,
    private _profileService: ProfileService,
    private _toastr: ToastrService,
    private _masterService: MasterService,
    private _Http: Http,
    private _SupplierService: SupplierService,
    private confirmationService: ConfirmationService, private _rfqService: RfqService) {
    this.initModels();
    this.isCancel1stStep = false;
  }


  isSidePanelOpen() {
    const isOpen = this._SupplierService.get('buyerProfileSidePanel');
    if (isOpen !== null && isOpen !== undefined) {
      return this._SupplierService.get('buyerProfileSidePanel');
    } else {
      return false;
    }
  }
  ngOnInit() {
    this.loadAddress();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  isValidForm() {
    return this.isShiiping5;
  }
  loadAddress() {
    const id = this.loggedId;
    this._profileService.getAddress(id).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        localStorage.setItem('addressModel', JSON.stringify(this.iContactViewModel2));
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        this.mailingAddressData = this.iContactViewModel2.address;
        this.GetProfileDetails();
        if (this.mailingAddressData.addressId === 0 || this.mailingAddressData.state === 'Unknown - Do not delete') {
          this.isMailingAvaible = false;
          // this._toastr.error('You have added 5 shipping address', 'Error!');
        } else {
          this.isMailingAvaible = true;
        }
        if (this.shippingAddressData.length === 0) {
          this.isShiipingAvailable = false;
        }
        if (this.shippingAddressData.length >= 5) {
          //  this.isShiiping5 = true;
          this.isShiipingAvailable = true;
          // this._toastr.error('You have added 5 shipping address', 'Error!');
        } else {
          //  this.isShiiping5 = false;
        }
        // this.shippingForm.reset();
        // this.mailingForm.reset();
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  get loggedEmailId() {
    // tslint:disable-next-line:radix
    return (localStorage.getItem('User2'));
  }


  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  GetProfileDetails() {
    const id = this.loggedEncryptId;
    this.userCreatedDateString = '';

      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          if (!!this.iContactViewModel.createdOn && (this.iContactViewModel.createdOn !== '')) {
            const tempDate = new Date(this.iContactViewModel.createdOn);
            this.userCreatedDateString += 'Member Since ' + this.monthColl[tempDate.getMonth() - 1] + ' ' + tempDate.getFullYear();
          }
          this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
          this.iProfileViewModel.emailId = this.iContactViewModel.emailId;
          if (this.iProfileViewModel.emailId === '' || this.iProfileViewModel.emailId === null) {
            this.iProfileViewModel.emailId = this.loggedEmailId;
          }
          this.iProfileViewModel.firstName = this.iContactViewModel.firstName;
          this.iProfileViewModel.lastName = this.iContactViewModel.lastName;
          this.iProfileViewModel.languageId = this.iContactViewModel.languageId;
          this.findLanguage = this.iContactViewModel.language;
          this.iProfileViewModel.phoneNo = this.iContactViewModel.phoneNo;
          this.iProfileViewModel.title = this.iContactViewModel.title;
          this.iProfileViewModel.showDeltailedRating = this.iContactViewModel.showDeltailedRating;
          this.iProfileViewModel.showRfqAwardStat = this.iContactViewModel.showRfqAwardStat;
          this.iProfileViewModel.industryId = this.iContactViewModel.industryId;
          this.iProfileViewModel.industry = this.iContactViewModel.industry;
          this.iProfileViewModel.facebook = this.iContactViewModel.facebook;
          this.iProfileViewModel.linkedIn = this.iContactViewModel.linkedIn;
          this.iProfileViewModel.tweeter = this.iContactViewModel.tweeter;
          if (this.iContactViewModel.companyId == null) {
            this.iProfileViewModel.companyId = 0;
          } else {
            this.iProfileViewModel.companyId = this.iContactViewModel.companyId;
          }
          this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
          if (this.iContactViewModel.company != null) {
            this.iProfileViewModel.name = this.iContactViewModel.company.name;
            this.iProfileViewModel.dunsNumber = this.iContactViewModel.company.dunsNumber;
            this.iProfileViewModel.employeeCountRangeId = (
              (this.iContactViewModel.company.employeeCountRangeId === 0) ? 0 : this.iContactViewModel.company.employeeCountRangeId
            );
            this.industryId = this.iProfileViewModel.employeeCountRangeId;
            this.countRange = this.iContactViewModel.company.employeeCountRange;
            this.iProfileViewModel.description = this.iContactViewModel.company.description;
          }
          this._SupplierService.set(this.iProfileViewModel, 'profileData');
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );

  }
  GetProfileDetailsOriginal() {
    const id = this.loggedEncryptId;
    this.userCreatedDateString = '';
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        if (!!this.iContactViewModel.createdOn && (this.iContactViewModel.createdOn !== '')) {
          const tempDate = new Date(this.iContactViewModel.createdOn);
          this.userCreatedDateString += 'Member Since ' + this.monthColl[tempDate.getMonth() - 1] + ' ' + tempDate.getFullYear();
        }
        this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
        this.iProfileViewModel.emailId = this.iContactViewModel.emailId;
        if (this.iProfileViewModel.emailId === '' || this.iProfileViewModel.emailId === null) {
          this.iProfileViewModel.emailId = this.loggedEmailId;
        }
        this.iProfileViewModel.firstName = this.iContactViewModel.firstName;
        this.iProfileViewModel.lastName = this.iContactViewModel.lastName;
        this.iProfileViewModel.languageId = this.iContactViewModel.languageId;
        this.findLanguage = this.iContactViewModel.language;
        this.iProfileViewModel.phoneNo = this.iContactViewModel.phoneNo;
        this.iProfileViewModel.title = this.iContactViewModel.title;
        this.iProfileViewModel.showDeltailedRating = this.iContactViewModel.showDeltailedRating;
        this.iProfileViewModel.showRfqAwardStat = this.iContactViewModel.showRfqAwardStat;
        this.iProfileViewModel.industryId = this.iContactViewModel.industryId;
        this.iProfileViewModel.industry = this.iContactViewModel.industry;
        this.iProfileViewModel.facebook = this.iContactViewModel.facebook;
        this.iProfileViewModel.linkedIn = this.iContactViewModel.linkedIn;
        this.iProfileViewModel.tweeter = this.iContactViewModel.tweeter;
        if (this.iContactViewModel.companyId == null) {
          this.iProfileViewModel.companyId = 0;
        } else {
          this.iProfileViewModel.companyId = this.iContactViewModel.companyId;
        }
        this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
        if (this.iContactViewModel.company != null) {
          this.iProfileViewModel.name = this.iContactViewModel.company.name;
          this.iProfileViewModel.dunsNumber = this.iContactViewModel.company.dunsNumber;
          this.iProfileViewModel.employeeCountRangeId = (
            (this.iContactViewModel.company.employeeCountRangeId === 0) ? 0 : this.iContactViewModel.company.employeeCountRangeId
          );
          this.industryId = this.iProfileViewModel.employeeCountRangeId;
          this.countRange = this.iContactViewModel.company.employeeCountRange;
          this.iProfileViewModel.description = this.iContactViewModel.company.description;
        }
        this._SupplierService.set(this.iProfileViewModel, 'profileData');
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  initModels() {

    this.iProfileViewModel = {
      addressId: 0,
      comments: '',
      companyId: 0,
      contactFunction: '',
      contactId: 0,
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
      employeeCountRangeId: 1,
      description: '',
      name: '',
      dunsNumber: '',
      instagram: ''
    };

    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      npsScore: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      isLoginFromVision: false,
      comments: '',
      companyId: 0,
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      emailId: '',
      errorMessage: '',
      facebook: '',
      firstName: '',
      token: '',
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
      language: this.iLanguageModel,
      address: this.iAddressModel,
      company: this.iCompanyModel,
      isVarified: false,
      expiration: null,
      currentPassword: '',
      newPassword: '',
      isRFQCreated: false,
      grantType: '',
      refreshToken: '',
      googleImageUrl: '',
      website: '',
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest:false,
      instagram: ''
    };

    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true
    };

    this.iCompanyModel = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      employeeCountRangeId: 1,
      _3dTourUrl: '',
      employeeCountRange: '',
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

    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      country: '',
      deptAddress: '',
      errorMessage: '',
      isActive: false,
      postalCode: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };

  }

  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.personalProfileForm,
      field
    );
  }

  openSidePanel(page: string, shippingorMailingAddressId: number) {
    // console.log('id', shippingorMailingAddressId);
    this._SupplierService.set(true, 'buyerProfileSidePanel');
    
    if (page === 'isProfileEditActive') {
      this._SupplierService.set(true, 'isProfileEditActive');
      this._SupplierService.set(false, 'isEditMailing');
      this._SupplierService.set(false, 'isEditShipping');
      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
    }

    if (page === 'isEditMailing') {
      if (shippingorMailingAddressId) {
        this._SupplierService.set(shippingorMailingAddressId, 'MailingAddressId');
      }
      this._SupplierService.set(true, 'isEditMailing');
      this._SupplierService.set(false, 'isProfileEditActive');
      this._SupplierService.set(false, 'isEditShipping');
      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
    }


    if (page === 'isEditShipping') {
      this._SupplierService.set(shippingorMailingAddressId, 'shippingAddressId');
      this._SupplierService.set(true, 'isEditShipping');
      this._SupplierService.set(false, 'isProfileEditActive');
      this._SupplierService.set(false, 'isEditMailing');
      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
    }

      if (page === 'isEditBuyerContactUs') {
       this._SupplierService.set(true, 'isEditBuyerContactUs');
       this._SupplierService.set(true, 'editProfileDrawerDataSaved');
      //  this._SupplierService.set(false, 'isProfileEditActive');
      //  this._SupplierService.set(false, 'isEditMailing');
     }
     
     if (page === 'isEditPersonalInformation') {
      //  console.log('in if condition')
      this._SupplierService.set(true, 'isEditPersonalInformation');
      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
     //  this._SupplierService.set(false, 'isProfileEditActive');
     //  this._SupplierService.set(false, 'isEditMailing');
    }
  }

  reloadPageOndrawerClose() {
    if (this._SupplierService.get('editShippingAddress')) {
      this._SupplierService.set(false, 'editShippingAddress');
      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
      this.loadAddress();
      this.GetProfileDetailsOriginal();
    }
    if (this._SupplierService.get('editPersonalInfo')) {
      this._SupplierService.set(false, 'editPersonalInfo');
      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
      // this.loadAddress();
      this.GetProfileDetailsOriginal();
    }
  }




  deleteShippingAddress(item) {
    this.isCancel1stStep = true;
    this.confirmationService.confirm({
      message: 'Are you sure want to delete.?',
      header: 'Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._profileService.deleteShippingAddess(item).subscribe(
          (data: IAddressModel) => {
            if (data.result === true) {
              this.loadAddress();
              this._toastr.success('', 'Address has been deleted');
            } else {
              this._toastr.warning('Address can not be deletd as already in used!!','Warning!');
            }
          },
          error => () => {
            this._rfqService.handleError(error);
          }
        );
      },
      reject: () => {}
    });
  }
  getAddressFormat(mailingAddressData) {
    let tempAdd: string;
    tempAdd = '';
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += '<br />';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state)) {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country)) {
      tempAdd += '<br />' + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      return true;
    } else {
      return false;
    }
  }
}
