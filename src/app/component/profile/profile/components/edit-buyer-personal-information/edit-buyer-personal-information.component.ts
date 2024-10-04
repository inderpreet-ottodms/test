import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IAddressModel, ICompanyModel, IContactViewModel, ILanguageModel } from '../../../../../core/models/accountModel';
import { MasterService } from '../../../../../core/services/master/master.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { CustomValidatorService } from '../../../../../core/services/validator/custom-validator.service';

@Component({
  selector: 'app-edit-buyer-personal-information',
  templateUrl: './edit-buyer-personal-information.component.html',
  styleUrls: ['./edit-buyer-personal-information.component.scss']
})
export class EditBuyerPersonalInformationComponent implements OnInit {
  personalInfoForm: FormGroup;
  isLoader: boolean;
  iContactViewModel: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  iLanguageModelColl: ILanguageModel[];
  isContactInfoSubmitted: boolean = false;
  constructor(private _SupplierService: SupplierService,
    private _fb: FormBuilder,
    private _profileService: ProfileService,
    private _rfqService: RfqService,
    private _customValidatorsService: CustomValidatorService,
    private _masterService: MasterService,
    private _toastr: ToastrService) { 
      this.isLoader = true;
      this.initModels();
      this.fillDropdown();
  }

  ngOnInit() {
    this.GetProfileDetails();
  }
  initModels() {
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
  createForm() {
    if (this.iLanguageModelColl !== undefined) {
      if (this.iContactViewModel.languageId === 0) {
        const data = this.iLanguageModelColl.find(m => m.languageName === 'English');
        this.iContactViewModel.languageId = data.languageId;
      }
    }
    this.personalInfoForm = this._fb.group({
       firstName: [this.iContactViewModel['firstName'], Validators.required],
      lastName: [this.iContactViewModel['lastName'], Validators.required],
      title: [this.iContactViewModel['title']],
      languageId: [this.iContactViewModel['languageId'], Validators.required],
    });
    this.isLoader = false;
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.personalInfoForm,
      field
    );
  }
  contactDetails: any;
  GetProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        this.contactDetails = result;
        this.createForm();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
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

  }

  onSaveContactInfo() {
    console.log('onSaveContactInfo')
    if (!this.isContactInfoSubmitted) {
      this.isContactInfoSubmitted = true;
      if (this.personalInfoForm.valid) {
        // this.iContactViewModel.emailId = this.personalInfoForm.value.emailId;
        this.iContactViewModel.firstName = this.personalInfoForm.value.firstName;
        this.iContactViewModel.lastName = this.personalInfoForm.value.lastName;
        this.iContactViewModel.title = this.personalInfoForm.value.title;
        this.iContactViewModel.languageId = this.personalInfoForm.value.languageId;
        this.iContactViewModel.phoneNo = this.contactDetails.phoneNo;
        this.iContactViewModel.industryId = this.contactDetails.industryId;
        this.iContactViewModel.linkedIn = this.contactDetails.linkedIn;
        this.iContactViewModel.linkedIn = this.contactDetails.linkedIn;
        this.iContactViewModel.tweeter = this.contactDetails.tweeter;
        this.iContactViewModel.facebook = this.contactDetails.facebook;
        this.iContactViewModel.website = this.contactDetails.website;
        this.iContactViewModel.instagram = this.contactDetails.instagram;
        this.iContactViewModel.userId = localStorage.getItem('LoggedId');
        this.iContactViewModel.contactPictureFile = this.contactDetails.contactPictureFile;
        this.iContactViewModel.logoOfCompany = this.contactDetails.logoOfCompany;
        this.iContactViewModel.showRfqAwardStat = this.contactDetails.showRfqAwardStat;
        this.iContactViewModel.contactId = this.contactDetails.contactId;
        this.iContactViewModel.showDeltailedRating =this.contactDetails.showDeltailedRating;
        // this.iContactViewModel.contactId = this.contactDetails.company.contactId;
        // tslint:disable-next-line:radix
        this.iCompanyModel.companyId = this.contactDetails.company.companyId;
        this.iCompanyModel.description = this.contactDetails.company.description;
        this.iCompanyModel.dunsNumber = this.contactDetails.company.dunsNumber;
        this.iCompanyModel.employeeCountRangeId = this.contactDetails.company.employeeCountRangeId;
        this.iCompanyModel.name = this.contactDetails.company.name;
        this.iContactViewModel.companyId = this.contactDetails.company.companyId;
        this.iContactViewModel.company.name = this.contactDetails.company.name;
        console.log(this.iContactViewModel, 'UPDATED PERSONAL INFORMATION  VALUES')
        if (this.iContactViewModel.companyId === 0) {
          this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
            result => {
              this.iContactViewModel = result;
              if (this.iContactViewModel.result === true) {
                this._rfqService.set(true, 'isprofile');
                this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
                this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
                localStorage.setItem('loggedCompanyId', this.iContactViewModel.companyId.toString());
                localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
                this.GetProfileDetails();
                this._toastr.success(this.iContactViewModel.errorMessage, '');
                // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                this._SupplierService.set(true, 'editShippingAddress');
                this._SupplierService.set(true, 'editPersonalInfo');
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
                // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                // this._SupplierService.get('editShippingAddress')
                this._SupplierService.set(true, 'editShippingAddress');
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
          this.personalInfoForm
        );
      }
    }
  }

  closePartDrawer() {
    this._SupplierService.set(false, 'isEditShipping');
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
    this._SupplierService.set(false, 'isEditPersonalInformation');
    this._SupplierService.set(false, 'companyPhotosClosedFromInside');
    this._SupplierService.set(true, 'editPersonalInfo');
  }
}
