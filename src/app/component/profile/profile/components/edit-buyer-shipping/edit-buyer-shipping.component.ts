import {
  Component,
  OnInit
} from '@angular/core';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';
import {
  IContactViewModel,
  ILanguageModel,
  ICompanyModel,
  IAddressModel,
  ICompanyShippingSiteViewModel,
} from '../../../../../core/models/accountModel';
import {
  ConfirmationService
} from 'primeng/api';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  IShippingAddressesModel,
} from '../../../../../core/models/profileModel';
import {
  IRegionModel,
  ICountryViewModel
} from '../../../../../core/models/globalMaster';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-edit-buyer-shipping',
  templateUrl: './edit-buyer-shipping.component.html',
  styleUrls: ['./edit-buyer-shipping.component.scss'],
  providers: [ConfirmationService]
})
export class EditBuyerShippingComponent implements OnInit {
  iContactViewModel: IContactViewModel;
  iContactViewModel2: IContactViewModel;
  iContactViewModel3: IContactViewModel;
  iShippingAddressesModel: IShippingAddressesModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  shippingForm: FormGroup;
  shippingAddressData: any;
  mailingAddressData: any;
  isShiiping5: boolean;
  iRegionModel: IRegionModel[];
  iRegionModelShipping: IRegionModel[];
  iCountryViewModelColl: ICountryViewModel[];
  iCompanyShippingSiteViewModel: ICompanyShippingSiteViewModel;
  isMailingformOpen = false;
  cuSiteId: number;
  shippingid: any;
  isLoader: boolean;
  isCancel1stStep: boolean;
  isShippingInfoSubmitted: boolean = false;
  constructor(private _SupplierService: SupplierService, private _customValidatorsService: CustomValidatorService,
    private _profileService: ProfileService, private _masterService: MasterService,
    private _toastr: ToastrService, private _fb: FormBuilder,
    private confirmationService: ConfirmationService, private _rfqService: RfqService) {
    this.isLoader = true;
    this.isCancel1stStep = false;
    this.OpenMailingForm();
    this.initModels();
    this.inintShippingAddress();
    this.createShippingForm();
  }

  ngOnInit() {
    // console.log('shippignid', this._SupplierService.get('shippingAddressId'));
    this.loadAddress();
  }


  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  ismailingFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.shippingForm, field);
  }

  OpenMailingForm() {
    if (!this.isMailingformOpen) {
      this._masterService.getState('0').subscribe(
        (data: IRegionModel[]) => {
          this.iRegionModel = data['stateData'];
          this.iRegionModelShipping = data['stateData'];
          this.isMailingformOpen = true;
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
      this._masterService.getCountry().subscribe(
        (data2: ICountryViewModel[]) => {
          this.iCountryViewModelColl = data2;
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
    }
  }


  inintShippingAddress() {
    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      country: '',
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      isActive: true,
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
  createShippingForm() {

    this.shippingForm = this._fb.group({
      city: [this.iAddressModel['city'], Validators.required],
      deptAddress: [this.iAddressModel['deptAddress']],
      postalCode: [this.iAddressModel['postalCode'], Validators.required],
      countryId: [this.iAddressModel['countryId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      stateId: [this.iAddressModel['stateId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      streetAddress: [this.iAddressModel['streetAddress'], Validators.required],
      companyName: [this.iAddressModel['address5'], Validators.required],
      defaultSite: [this.iAddressModel['isActive']],
      addressId: [this.iAddressModel['addressId']]
    });
  }

  isShippingFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.shippingForm, field);
  }
  loadAddress() {
    const id = this.loggedId;
    this._profileService.getAddress(id).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        this.mailingAddressData = this.iContactViewModel2.address;
        this.GetProfileDetails();
        this.shippingid = this._SupplierService.get('shippingAddressId');
        if (this.shippingid !== 0) {
          this.editShippingAddress(this.shippingid);
        } else {
          this.isLoader = false;
          if (this.shippingAddressData.length >= 3) {
            this.isShiiping5 = true;
            // this._toastr.error('You have added 5 shipping address', 'Error!');
          } else {
            this.isShiiping5 = false;
          }
        }
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

    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {

        this.iContactViewModel = result;
        this.iContactViewModel2.companyId = (this.iContactViewModel.companyId ? this.iContactViewModel.companyId : 0);
      });
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
    this._SupplierService.set(true, 'companyPhotosClosedFromInside');
  }


  onShipCountryChange(id) {
    if (id === 0) {
      this._masterService.getState(this.shippingForm.value.countryId).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModelShipping = data2['stateData'];
          this.shippingForm.controls['stateId'].setValue('');
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
    } else {
      this._masterService.getState(id).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModelShipping = data2['stateData'];
          this.createShippingForm();
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
    }
  }
  editShippingAddress(id: number) {
    const data = this.shippingAddressData;
    if (id) {
      for (const entry of this.shippingAddressData) {
        if (entry.siteId === id) {
          this.isShiiping5 = false;
          this.iShippingAddressesModel = entry;
          this.iAddressModel.city = entry.addresses.city;
          this.iAddressModel.stateId = entry.addresses.stateId;
          this.iAddressModel.countryId = entry.addresses.countryId;
          this.onShipCountryChange(this.iAddressModel.countryId);
          this.iAddressModel.postalCode = entry.addresses.postalCode;
          this.iAddressModel.deptAddress = entry.addresses.deptAddress;
          this.iAddressModel.addressId = entry.addresses.addressId;
          this.iAddressModel.streetAddress = entry.addresses.streetAddress;
          this.iAddressModel.isActive = entry.defaultSite;
          this.cuSiteId = entry.siteId;
          this.iAddressModel.address5 = entry.siteLabel;

        }
        this.isLoader = false;
      }
    }
  }

  resetShippingData() {
    this.isCancel1stStep = true;
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel and not save?',
      header: 'Cancel',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.shippingForm.value.companyName = '';
        this.shippingForm.value.streetAddress = '';
        this.shippingForm.value.deptAddress = '';
        this.shippingForm.value.city = '';
        this.shippingForm.value.state = '';
        this.shippingForm.value.addressId = '';
        this.shippingForm.value.postalCode = null;
        this.shippingForm.value.defaultSite = true;
        this.inintShippingAddress();
        this.createShippingForm();
      },
      reject: () => {}
    });

  }

  initModels() {
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      isLoginFromVision: false,
      npsScore: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
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

    this.iCompanyShippingSiteViewModel = {
      addressId: 0,
      companyName: '',
      compId: 0,
      contId: 0,
      defaultSite: true,
      siteCreationDate: '',
      siteId: 0,
      siteLabel: '',
      addresses: this.iAddressModel
    };
  }

  onSaveShippingInfo() {
    if (!this.isShippingInfoSubmitted) {
      this.isShippingInfoSubmitted = true;

      this.inintShippingAddress();
      if (this.shippingForm.valid) {
        if (this.isShiiping5) {
          this.isShippingInfoSubmitted = false;
          this._toastr.error('You have added 5 shipping address', 'Error!');
        } else {
          if (this.shippingForm.value.stateId !== '') {
            if (this.iContactViewModel.companyId === null) {
              this.iContactViewModel.companyId = 0;
              // this._toastr.error('Please update Company details first', 'Error!');
            }
            this.iAddressModel.addressId = this.shippingForm.value.addressId;
            this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
            this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
            this.iAddressModel.city = this.shippingForm.value.city;
            this.iAddressModel.countryId = this.shippingForm.value.countryId;
            this.iAddressModel.stateId = this.shippingForm.value.stateId;
            this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
            this.iAddressModel.addressType = 2;
            this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
            this.iCompanyShippingSiteViewModel.siteLabel = this.shippingForm.value.companyName;
            this.iCompanyShippingSiteViewModel.companyName = this.iContactViewModel.company.name;
            if (this.shippingForm.value.defaultSite === null) {
              this.shippingForm.value.defaultSite = false;
            }
            this._profileService.getAddress(this.loggedId).subscribe(
              (data: IContactViewModel) => {
                this.iContactViewModel3 = data;
                this.mailingAddressData = this.iContactViewModel3.address;
                this.iAddressModel.addressId = this.shippingForm.value.addressId;
                this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
                this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
                this.iAddressModel.city = this.shippingForm.value.city;
                this.iAddressModel.stateId = this.shippingForm.value.stateId;
                this.iAddressModel.countryId = this.shippingForm.value.countryId;
                this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
                this.iAddressModel.addressType = 1;
                this.iContactViewModel.contactId = this.loggedId;
                this.iContactViewModel.address = this.iAddressModel;
                this.iAddressModel.showOnlyStateCity = false;
                this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
                  result => {
                    this.iContactViewModel = result;
                    if (this.iContactViewModel.result === true) {
                      if (this.mailingAddressData.city === null) {
                        this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                          result => {
                            this.iContactViewModel = result;
                            if (this.iContactViewModel.result === true) {
                              this.loadAddress();
                              this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                              this._SupplierService.set(true, 'editShippingAddress');
                              this.closePartDrawer();
                            } else {
                              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                            }
                            this.isShippingInfoSubmitted = false;
                          })
                      }
                    }
                  })
              })

            if (this.shippingAddressData.length === 0) {
              this.shippingForm.value.defaultSite = true;
            }
            this.iCompanyShippingSiteViewModel.defaultSite = this.shippingForm.value.defaultSite;
            this.iCompanyShippingSiteViewModel.siteCreationDate =
              '2018-07-26T11:29:23.616Z';
            this.iAddressModel.companyShippingSiteViewModelList.push(
              this.iCompanyShippingSiteViewModel
            );
            this.iContactViewModel.contactId = this.loggedId;
            this.iContactViewModel.address = this.iAddressModel;
            if (this.iAddressModel.addressId === 0) {
              this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                result => {
                  this.iContactViewModel = result;
                  if (this.iContactViewModel.result === true) {
                    this.shippingForm.reset();
                    this.loadAddress();
                    this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                    this._SupplierService.set(true, 'editShippingAddress');
                    this.closePartDrawer();
                    this._toastr.success(this.iContactViewModel.errorMessage, '');
                  } else {
                    this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                  }
                  this.isShippingInfoSubmitted = false;
                },
                error => {
                  this.isShippingInfoSubmitted = false;
                  this._rfqService.handleError(error);
                },
                () => {}
              );
            } else {
              this.iAddressModel.addressId = this.shippingForm.value.addressId;
              this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
              this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
              this.iAddressModel.city = this.shippingForm.value.city;
              this.iAddressModel.countryId = this.shippingForm.value.countryId;
              this.iAddressModel.stateId = this.shippingForm.value.stateId;
              this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
              this.iAddressModel.addressType = 2;
              this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
              this.iCompanyShippingSiteViewModel.siteLabel = this.shippingForm.value.companyName;
              this.iCompanyShippingSiteViewModel.siteId = this.cuSiteId;
              this.iCompanyShippingSiteViewModel.defaultSite = this.shippingForm.value.defaultSite;
              this.iCompanyShippingSiteViewModel.siteCreationDate =
                '2018-07-26T11:29:23.616Z';
              this.iAddressModel.companyShippingSiteViewModelList.push(
                this.iCompanyShippingSiteViewModel
              );
              this.iContactViewModel.contactId = this.loggedId;
              this.iContactViewModel.address = this.iAddressModel;
              this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
                result => {
                  this.iContactViewModel = result;
                  if (this.iContactViewModel.result === true) {
                    this.inintShippingAddress();
                    this.createShippingForm();
                    this.loadAddress();
                    this._SupplierService.set(true, 'editShippingAddress');
                    this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                    this.closePartDrawer();
                    this._toastr.success(this.iContactViewModel.errorMessage, '');
                  } else {
                    this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                  }
                  this.isShippingInfoSubmitted = false;
                },
                error => {
                  this.isShippingInfoSubmitted = false;
                  this._rfqService.handleError(error);
                },
                () => {}
              );
            }
          } else {
            this.isShippingInfoSubmitted = false;
            this._toastr.warning('Please select the state', 'Warning');
          }
        }
      } else {
        this.isShippingInfoSubmitted = false;
        this._customValidatorsService.validateAllFormFields(this.shippingForm);
      }
    }
  }

}
