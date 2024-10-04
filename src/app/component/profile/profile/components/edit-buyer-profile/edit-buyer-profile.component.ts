import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ToastrService
} from 'ngx-toastr';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
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
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';


@Component({
  selector: 'app-edit-buyer-profile',
  templateUrl: './edit-buyer-profile.component.html',
  styleUrls: ['./edit-buyer-profile.component.scss']
})
export class EditBuyerProfileComponent implements OnInit {
  isLoader: boolean;
  isPersonalError: boolean;
  personalProfileForm: FormGroup;
  iProfileViewModel: IProfileViewModel;
  iLanguageModelColl: ILanguageModel[];
  iCountryViewModelColl: ICountryViewModel[];
  iEmployeesCountRangeModel: IEmployeesCountRangeModel[];
  iIndustriesModel: IIndustriesModel[];
  iContactViewModel: IContactViewModel;
  iContactViewModel2: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  defaultOption: '';
  userCreatedDateString = ' ';
  userId: string;
  mailingAddressData: any;
  shippingAddressData: any;
  isIndustryError = true;
  monthColl = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  isContactInfoSubmitted: boolean = false;
  contactDetails: any;
  constructor(private _fb: FormBuilder,
    private _customValidatorsService: CustomValidatorService,
    private _profileService: ProfileService,
    private _toastr: ToastrService,
    private _masterService: MasterService,
    private _SupplierService: SupplierService,
    private _rfqService: RfqService) {
    this.isLoader = true;
    this.initModels();
    this.fillDropdown();
  }

  ngOnInit() {
    // this.loadAddress();
    if (this._SupplierService.get('profileData')) {
      this.iProfileViewModel = JSON.parse(localStorage.getItem('profileData'));
      this.contactDetails = JSON.parse(localStorage.getItem('profileData'));
      // console.log(this.contactDetails, 'this.contactDetail')
    }
    this.getProfileDetails();
    this.createForm();
  }
 
  getProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
    result => {
      this.iProfileViewModel = result;
      this.contactDetails = result;
    },
    error => {
      this._rfqService.handleError(error);
    },
    () => {}
  );
  }
  closePartDrawer() {
    this._SupplierService.set(false, 'isProfileEditActive');
    this._SupplierService.set(false, 'buyerProfileSidePanel');
    this._SupplierService.set(false, 'buyerProfileSidePanel');
    this._SupplierService.set(false, 'isEditBuyerContactUs');
    this._SupplierService.set(false, 'isEditMailing');
    this._SupplierService.set(false, 'isEditShipping');
    this._SupplierService.set(false, 'isMailingEditActive');
    this._SupplierService.set(false, 'isShippingEditActive');
    this._SupplierService.set(false, 'isEditBuyerAboutUs');
    this._SupplierService.set(false, 'isProfileEditActive');
    this._SupplierService.set(false, 'isRatingReply');
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(false, 'companyEquipment');
    this._SupplierService.set(false, 'companyDescription');
    this._SupplierService.set(false, 'companyPhotos');
    this._SupplierService.set(false, 'companyDemographics');
    this._SupplierService.set(false, 'companyCertifications');
    this._SupplierService.set(false, 'companyFocus');
    this._SupplierService.set(false, 'companyGetInTouch');
    this._SupplierService.set(false, 'companyGetInTouch');
    this._SupplierService.set(true, 'companyPhotosClosedFromInside');
  }


  isPhoneNoValid(field: string) {
    return this._customValidatorsService.isPhoneNoValid(
      this.personalProfileForm,
      field
    );
  }

  onIndustryChange() {
    if (this.personalProfileForm.value.industryId === 'Select Industry Type' || this.personalProfileForm.value.industryId === '0') {
      this.iProfileViewModel.industryId = 0;
      this.isIndustryError = false;
    } else {
      this.iProfileViewModel.industryId = this.personalProfileForm.value.industryId;
      this.isIndustryError = true;
    }
    if (this.iProfileViewModel['industryId'] === 0) {
      this.personalProfileForm.controls['industryId'].setValue(this.defaultOption, {
        onlySelf: true
      });
    }
  }
  isEmailPValid(field: string) {
    if (
      this._customValidatorsService.isEmailValid(
        this.personalProfileForm,
        field
      )
    ) {
      this.isPersonalError = false;
    } else {
      this.isPersonalError = true;
    }
    return this._customValidatorsService.isEmailValid(
      this.personalProfileForm,
      field
    );
  }
  isMobileNoValid(field: any) {
    if (
      this._customValidatorsService.isMobilePValid(
        this.personalProfileForm,
        field
      )
    ) {
      this.isPersonalError = false;
    } else {
      this.isPersonalError = true;
    }
    return this._customValidatorsService.isMobilePValid(
      this.personalProfileForm,
      field
    );
  }

  createForm() {
    // console.log('ran', this.iProfileViewModel) ;
    if (this.iLanguageModelColl !== undefined) {
      if (this.iProfileViewModel.languageId === 0) {
        const data = this.iLanguageModelColl.find(m => m.languageName === 'English');
        this.iProfileViewModel.languageId = data.languageId;
      }
    }
    this.personalProfileForm = this._fb.group({
      // firstName: [this.iProfileViewModel['firstName'], Validators.required],
      // lastName: [this.iProfileViewModel['lastName'], Validators.required],
      // title: [this.iProfileViewModel['title']],
      // languageId: [this.iProfileViewModel['languageId'], Validators.required],
      phoneNo: [this.iProfileViewModel['phoneNo'], Validators.required],
      emailId: [this.iProfileViewModel['emailId'], Validators.required],
      website: [this.iProfileViewModel['website'], Validators.required],
      // name: [this.iProfileViewModel['name'], Validators.required],
      // dunsNumber: [this.iProfileViewModel['dunsNumber']],
      // showDeltailedRating: [this.iProfileViewModel['showDeltailedRating']],
      // showRfqAwardStat: [this.iProfileViewModel['showRfqAwardStat']],
      // industryId: [this.iProfileViewModel['industryId']],
      // employeeCountRangeId: [this.iProfileViewModel['employeeCountRangeId']],
      // description: [this.iProfileViewModel['description'], Validators.required],
      linkedIn: [this.iProfileViewModel['linkedIn']],
      tweeter: [this.iProfileViewModel['tweeter']],
      facebook: [this.iProfileViewModel['facebook']],
      instagram: [this.iProfileViewModel['instagram']]
    });
    // if (this.iProfileViewModel['industryId'] === 0) {
    //   this.personalProfileForm.controls['industryId'].setValue(this.defaultOption, {
    //     onlySelf: true
    //   });
    // }
    console.log('form', this.personalProfileForm.controls)
    this.isLoader = false;
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
      employeeCountRangeId: 0,
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
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      isLoginFromVision: false,
      contactIdEncrypt: '',
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
      isVisionUserRequest: false,
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
      _3dTourUrl: '',
      employeeCountRangeId: 0,
      employeeCountRange: '',
      errorMessage: '',
      isActive: true,
      name: '',
      companylogo: '',
      services: '',
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: '',
      supplierTypeId: 0,
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

  fillDropdown() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelColl = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );

    this._masterService.getIndustryType().subscribe(
      (data: IIndustriesModel[]) => {
        this.iIndustriesModel = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._masterService.getEmployeesCountRange().subscribe(
      (data: IEmployeesCountRangeModel[]) => {
        this.iEmployeesCountRangeModel = data;
        this.iEmployeesCountRangeModel.splice(0, 1);
        // console.log('range',  this.iEmployeesCountRangeModel);
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.personalProfileForm,
      field
    );
  }

  get loggedEmailId() {
    // tslint:disable-next-line:radix
    return (localStorage.getItem('User2'));
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  loadAddress() {
    const id = this.loggedId;
    this._profileService.getAddress(id).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        // this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;

        // this.mailingAddressData = this.iContactViewModel2.address;
        this.GetProfileDetails();


        // if (this.mailingAddressData.addressId === 0) {
        //   this.isMailingAvaible = false;
        //  // this._toastr.error('You have added 5 shipping address', 'Error!');
        // } else {
        //   this.isMailingAvaible = true;
        // }

        // if (this.shippingAddressData.length >= 5 ) {
        //   this.isShiiping5 = true;
        //  // this._toastr.error('You have added 5 shipping address', 'Error!');
        // } else {
        //   this.isShiiping5 = false;
        // }
        // this.shippingForm.reset();
        // this.mailingForm.reset();
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
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
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
        if (!!this.iContactViewModel.createdOn && (this.iContactViewModel.createdOn !== '')) {
          const tempDate = new Date(this.iContactViewModel.createdOn);
          this.userCreatedDateString += 'Member Since ' + this.monthColl[tempDate.getMonth() - 1] + ' ' + tempDate.getFullYear();
        }
        this.iContactViewModel.companyId = (this.iContactViewModel.companyId ? this.iContactViewModel.companyId : 0);
        //  if (this.iContactViewModel.result === true) {
        this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
        this.iProfileViewModel.emailId = this.iContactViewModel.emailId;
        if (this.iProfileViewModel.emailId === '' || this.iProfileViewModel.emailId === null) {
          this.iProfileViewModel.emailId = this.loggedEmailId;
        }
        this.iProfileViewModel.firstName = this.iContactViewModel.firstName;
        this.iProfileViewModel.lastName = this.iContactViewModel.lastName;
        this.iProfileViewModel.languageId = this.iContactViewModel.languageId;
        this.iProfileViewModel.phoneNo = this.iContactViewModel.phoneNo;
        this.iProfileViewModel.title = this.iContactViewModel.title;
        this.iProfileViewModel.showDeltailedRating = this.iContactViewModel.showDeltailedRating;
        this.iProfileViewModel.showRfqAwardStat = this.iContactViewModel.showRfqAwardStat;
        this.iProfileViewModel.industryId = this.iContactViewModel.industryId;
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
          this.iProfileViewModel.description = this.iContactViewModel.company.description;
        }
        this.userId = this.iContactViewModel.userId;
        this.createForm();
        // } else {
        //   this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
        // }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }


  onSaveContactInfo() {
    console.log('onSaveContactInfo')
    if (!this.isContactInfoSubmitted) {
      this.isContactInfoSubmitted = true;
      if (this.personalProfileForm.valid && this.isPersonalError && this.isIndustryError) {
        this.iContactViewModel.emailId = this.personalProfileForm.value.emailId;
        this.iContactViewModel.firstName = this.contactDetails.firstName;
        this.iContactViewModel.lastName = this.contactDetails.lastName;
        this.iContactViewModel.title = this.contactDetails.title;
        this.iContactViewModel.languageId = this.contactDetails.languageId;
        this.iContactViewModel.phoneNo = this.personalProfileForm.value.phoneNo;
        this.iContactViewModel.industryId = this.contactDetails.industryId;
        this.iContactViewModel.linkedIn = this.personalProfileForm.value.linkedIn;
        this.iContactViewModel.linkedIn = this.personalProfileForm.value.linkedIn;
        this.iContactViewModel.tweeter = this.personalProfileForm.value.tweeter;
        this.iContactViewModel.facebook = this.personalProfileForm.value.facebook;
        this.iContactViewModel.website = this.personalProfileForm.value.website;
        this.iContactViewModel.userId = localStorage.getItem('LoggedId');
        this.iContactViewModel.contactPictureFile = this.iContactViewModel.contactPictureFile;
        this.iContactViewModel.logoOfCompany = this.iContactViewModel.logoOfCompany;
        this.iContactViewModel.showRfqAwardStat = this.personalProfileForm.value.showRfqAwardStat;
        this.iContactViewModel.contactId = this.iProfileViewModel.contactId;
        this.iContactViewModel.showDeltailedRating = this.personalProfileForm.value.showDeltailedRating;
        // this.iContactViewModel.contactPictureFile = this.uploadedAvtarName;
        //  this.iContactViewModel.logoOfCompany = this.uploadedBannerName;
        this.iContactViewModel.contactId = this.iProfileViewModel.contactId;
        // tslint:disable-next-line:radix
        this.iCompanyModel.companyId = this.iProfileViewModel.companyId;
        this.iCompanyModel.description = this.personalProfileForm.value.description;
        this.iCompanyModel.dunsNumber = this.contactDetails.company.dunsNumber;
        this.iCompanyModel.employeeCountRangeId = this.personalProfileForm.value.employeeCountRangeId;
        this.iCompanyModel.name = this.personalProfileForm.value.name;
        this.iContactViewModel.companyId = this.iProfileViewModel.companyId;
        this.iContactViewModel.company = this.iCompanyModel;
        this.iContactViewModel.instagram = this.personalProfileForm.value.instagram;
        this.iContactViewModel.company.name = this.contactDetails.company.name;
        this.iContactViewModel.company.description = this.contactDetails.company.description;
        if (this.iContactViewModel.companyId === 0) {
          this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
            result => {
              this.iContactViewModel = result;
              console.log(this.iContactViewModel, 'UPDATED SOCIAL LINK VALUES')
              if (this.iContactViewModel.result === true) {
                this._rfqService.set(true, 'isprofile');
                this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
                this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
                localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId.toString());
                localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
                this.GetProfileDetails();
                this._toastr.success(this.iContactViewModel.errorMessage, '');
                this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                this.closePartDrawer();
                this.isContactInfoSubmitted = false;
                // window.location.reload();
              } else {
                this.isContactInfoSubmitted = false;
                this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                // console.log(this.iContactViewModel.errorMessage);
              }
            },
            error => {
              this.isContactInfoSubmitted = false;
              this._rfqService.handleError(error);
            },
            () => {}
          );
        } else {
          this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
            result => {
              this.iContactViewModel = result;
              localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
              if (this.iContactViewModel.result === true) {
                this._toastr.success(this.iContactViewModel.errorMessage, '');
                this._rfqService.set(true, 'isprofile');
                this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
                this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
                this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                this.closePartDrawer();
                this.isContactInfoSubmitted = false;
              } else {
                this.isContactInfoSubmitted = false;
                this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                // console.log(this.iContactViewModel.errorMessage);
              }
            },
            error => {
              this.isContactInfoSubmitted = false;
              this._rfqService.handleError(error);
            },
            () => {}
          );
        }

      } else {
        this.isContactInfoSubmitted = false;
        this._customValidatorsService.validateAllFormFields(
          this.personalProfileForm
        );
      }
    }
  }


  saveData() {
    if (this.personalProfileForm.valid && this.isPersonalError && this.isIndustryError) {
      this.iContactViewModel.emailId = this.personalProfileForm.value.emailId;
      this.iContactViewModel.firstName = this.personalProfileForm.value.firstName;
      this.iContactViewModel.lastName = this.personalProfileForm.value.lastName;
      this.iContactViewModel.title = this.personalProfileForm.value.title;
      this.iContactViewModel.languageId = this.personalProfileForm.value.languageId;
      this.iContactViewModel.phoneNo = this.personalProfileForm.value.phoneNo;
      this.iContactViewModel.industryId = this.personalProfileForm.value.industryId;
      this.iContactViewModel.linkedIn = this.personalProfileForm.value.linkedIn;
      this.iContactViewModel.linkedIn = this.personalProfileForm.value.linkedIn;
      this.iContactViewModel.tweeter = this.personalProfileForm.value.tweeter;
      this.iContactViewModel.facebook = this.personalProfileForm.value.facebook;
      this.iContactViewModel.userId = localStorage.getItem('LoggedId');
      this.iContactViewModel.contactPictureFile = this.iContactViewModel.contactPictureFile;
      this.iContactViewModel.logoOfCompany = this.iContactViewModel.logoOfCompany;
      this.iContactViewModel.showRfqAwardStat = this.personalProfileForm.value.showRfqAwardStat;
      this.iContactViewModel.contactId = this.iProfileViewModel.contactId;
      this.iContactViewModel.showDeltailedRating = this.personalProfileForm.value.showDeltailedRating;
      // this.iContactViewModel.contactPictureFile = this.uploadedAvtarName;
      //  this.iContactViewModel.logoOfCompany = this.uploadedBannerName;
      this.iContactViewModel.contactId = this.iProfileViewModel.contactId;
      // tslint:disable-next-line:radix
      this.iCompanyModel.companyId = this.iProfileViewModel.companyId;
      this.iCompanyModel.description = this.personalProfileForm.value.description;
      this.iCompanyModel.dunsNumber = this.personalProfileForm.value.dunsNumber;
      this.iCompanyModel.employeeCountRangeId = this.personalProfileForm.value.employeeCountRangeId;
      this.iCompanyModel.name = this.personalProfileForm.value.name;
      this.iContactViewModel.companyId = this.iProfileViewModel.companyId;
      this.iContactViewModel.company = this.iCompanyModel;

      if (this.iContactViewModel.companyId === 0) {
        this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
          result => {
            this.iContactViewModel = result;
            if (this.iContactViewModel.result === true) {
              this._rfqService.set(true, 'isprofile');
              this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
              this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
              localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId.toString());
              this.GetProfileDetails();
              this._toastr.success(this.iContactViewModel.errorMessage, '');
              this._SupplierService.set(true, 'editProfileDrawerDataSaved');
              this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
              this.closePartDrawer();
              // window.location.reload();
            } else {
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
              // console.log(this.iContactViewModel.errorMessage);
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
          result => {


            this.iContactViewModel = result;
            if (this.iContactViewModel.result === true) {
              this._toastr.success(this.iContactViewModel.errorMessage, '');
              this._rfqService.set(true, 'isprofile');
              this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
              this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
              this._SupplierService.set(true, 'editProfileDrawerDataSaved');
              this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
              this.closePartDrawer();
            } else {
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
              // console.log(this.iContactViewModel.errorMessage);
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }

    } else {
      this._customValidatorsService.validateAllFormFields(
        this.personalProfileForm
      );
    }
  }
  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != '') {
      this.iProfileViewModel['phoneNo'] = number.replace(/-/g, '');
      this.personalProfileForm.patchValue({
        'phoneNo': number.replace(/-/g, '')
      });
    }
  }
}
