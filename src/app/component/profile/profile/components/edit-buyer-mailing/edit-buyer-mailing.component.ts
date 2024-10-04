import {
  Component,
  OnInit
} from '@angular/core';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IRegionModel,
  ICountryViewModel
} from '../../../../../core/models/globalMaster';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import {
  IContactViewModel,
  ILanguageModel,
  ICompanyModel,
  IAddressModel,
  ICompanyShippingSiteViewModel
} from '../../../../../core/models/accountModel';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {of ,Observable  } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import { IProfileViewModel, ICompanyEditViewModel } from '../../../../../core/models/accountModel';

@Component({
  selector: 'app-edit-buyer-mailing',
  templateUrl: './edit-buyer-mailing.component.html',
  styleUrls: ['./edit-buyer-mailing.component.scss']
})
export class EditBuyerMailingComponent implements OnInit {
  isMailingformOpen = false;
  searching1 = false;
  searchFailed1 = false;
  iCountryViewModelColl: ICountryViewModel[];
  iRegionModel: IRegionModel[];
  iRegionModelShipping: IRegionModel[];
  mailingForm: FormGroup;
  processData: any;
  searching = false;
  searchFailed = false; 
  iCompanyEditViewModel: ICompanyEditViewModel;
  iAddressModel: IAddressModel;
  mailingAddressData: any;
  iContactViewModel: IContactViewModel;
  iContactViewModel2: IContactViewModel;
  iContactViewModel3: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iCompanyShippingSiteViewModel: ICompanyShippingSiteViewModel;
  isMailingAvaible: boolean;
  shippingAddressData: any;
  isShiiping5: boolean;
  isLoader: boolean;
  MailingAddressId: any;
  isMailInfoSubmitted: boolean = false;
  iCompanyViewModel: ICompanyModel;
  companyDescriptionForm: FormGroup;
  isCompanyDesSubmitted: boolean = false;
  isCompanyDesError: boolean;
  constructor(private _SupplierService: SupplierService,
    private _masterService: MasterService, private _customValidatorsService: CustomValidatorService,
    private _toastr: ToastrService, private _fb: FormBuilder, private _profileService: ProfileService, private _rfqService: RfqService) {
    this.isLoader = true;
    this.initModels();
    this.createForm();
    this.OpenMailingForm();
    this.isCompanyDesError = false;
  }

  ngOnInit() {
    this.loadAddress();
  }


  initModels() {
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      npsScore: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactIdEncrypt: '',
      comments: '',
      companyId: 0,
      isLoginFromVision: false,
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
      employeeCountRangeId: 1,
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

  createForm() {
    this.inintShippingAddress();;
    if (this.iAddressModel.streetAddress !== '' && this.iAddressModel.streetAddress !== null) {
      this.iAddressModel.showInProfile = false;
    }
    this.mailingForm = this._fb.group({
      city: [this.iAddressModel['city'], Validators.required],
      deptAddress: [this.iAddressModel['deptAddress']],
      postalCode: [this.iAddressModel['postalCode'], Validators.required],
      countryId: [this.iAddressModel['countryId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      stateId: [this.iAddressModel['stateId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      streetAddress: [this.iAddressModel['streetAddress'], Validators.required],
      showInProfile: [this.iAddressModel['showInProfile']],
      showOnlyStateCity: [this.iAddressModel['showOnlyStateCity']],
    });
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
    this.iCompanyViewModel = {
      companyId: 0,
      description: '',
      _3dTourUrl: '',
      dunsNumber: '',
      employeeCountRangeId: 1,
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
  }
  ismailingFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.mailingForm, field);
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
        // console.log('contact', this.iContactViewModel2);
        this.mailingAddressData = this.iContactViewModel2.address;
        // console.log('mailingaddress',   this.mailingAddressData);
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        this.createmailingForm();
        this.GetProfileDetails();
        this.MailingAddressId = this._SupplierService.get('MailingAddressId');
        if (this.mailingAddressData.addressId === 0 || this.mailingAddressData.state === 'Unknown - Do not delete') {
          this.isMailingAvaible = false;
          this.isLoader = false;
          // this._toastr.error('You have added 5 shipping address', 'Error!');
        } else {
          this.isMailingAvaible = true;
          if (this.MailingAddressId !== '0') {
            this.editMailingAddress();
          }
        }

        if (this.shippingAddressData.length >= 5) {
          this.isShiiping5 = true;
          // this._toastr.error('You have added 5 shipping address', 'Error!');
        } else {
          this.isShiiping5 = false;
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
  compDescription:string = '';
  oldCompDescription: string = '';
  GetProfileDetails() {
    const id = this.loggedEncryptId;

    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {

        this.iContactViewModel = result;
        this.iContactViewModel.company.description = this.iContactViewModel.company.description;
        this.compDescription = this.iContactViewModel.company.description;   
        this.oldCompDescription = this.iContactViewModel.company.description;
        // console.log(this.iContactViewModel, 'this.iContactViewModel from byer-mailing component')
        this.iContactViewModel2.companyId = (this.iContactViewModel.companyId ? this.iContactViewModel.companyId : 0);
      });
  }

  onMailCountryChange(id) {
    if (id === 0) {
      this._masterService.getState(this.mailingForm.value.countryId).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModel = data2['stateData'];
          this.mailingForm.controls['stateId'].setValue('');
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
          this.iRegionModel = data2['stateData'];
          this.createmailingForm();
        },
        error => () => {
          this._rfqService.handleError(error);
        }
      );
    }
  }

  editMailingAddress() {
    this.iAddressModel.city = this.mailingAddressData.city;
    this.iAddressModel.stateId = this.mailingAddressData.stateId;
    this.iAddressModel.countryId = this.mailingAddressData.countryId;
    this.onMailCountryChange(this.iAddressModel.countryId);
    this.iAddressModel.postalCode = this.mailingAddressData.postalCode;
    this.iAddressModel.deptAddress = this.mailingAddressData.deptAddress;
    this.iAddressModel.addressId = this.mailingAddressData.addressId;
    this.iAddressModel.streetAddress = this.mailingAddressData.streetAddress;
    this.iAddressModel.showInProfile = this.mailingAddressData.showInProfile;
    this.iAddressModel.showOnlyStateCity = this.mailingAddressData.showOnlyStateCity;
    this.isLoader = false;
  }

  get loggedEmailId() {
    // tslint:disable-next-line:radix
    return (localStorage.getItem('User2'));
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


  createmailingForm() {
    if (this.iAddressModel.streetAddress !== '' && this.iAddressModel.streetAddress !== null) {
      this.iAddressModel.showInProfile = false;
    }
    this.mailingForm = this._fb.group({
      city: [this.iAddressModel['city'], Validators.required],
      deptAddress: [this.iAddressModel['deptAddress']],
      postalCode: [this.iAddressModel['postalCode'], Validators.required],
      countryId: [this.iAddressModel['countryId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      stateId: [this.iAddressModel['stateId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      streetAddress: [this.iAddressModel['streetAddress'], Validators.required],
      showInProfile: [this.iAddressModel['showInProfile']],
      showOnlyStateCity: [this.iAddressModel['showOnlyStateCity']],
    });
  }
  
  companyDescriptionApi() {
    // if(this.compDescription !== this.iContactViewModel.company.description) {
      console.log(this.compDescription, 'this.compDescription')
      this.iCompanyViewModel.description = this.compDescription;
    // }
    console.log(this.iCompanyViewModel, 'this.iCompanyViewModel')
    this._SupplierService.editCompanyDescription(this.iCompanyViewModel).subscribe(
      result => {
        this.iCompanyViewModel = result['data'];
        if (result['result'] === true) {
          this._toastr.success(result['errorMessage'], 'Success!');
          this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
          localStorage.setItem('isCompanyProfileFilled', 'true');
          this.closePartDrawer();
        } else {
          this._toastr.error(result['errorMessage'], 'Error!');
        }
        this.isCompanyDesSubmitted = false;
      },
      error => {
        this.isCompanyDesSubmitted = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  onSaveMailingInfo() { 
    // this.companyDescriptionApi();
    this.editCompanyDescription();
    if (!this.isMailInfoSubmitted) {
      this.isMailInfoSubmitted = true;
      if (this.mailingForm.valid) {
        if (this.iContactViewModel2.companyId === null || this.iContactViewModel2.companyId === 0) {
          this._toastr.warning('Please update Company details first from Contact Information section', 'Warning!');
          this.isMailInfoSubmitted = false;
        } else {
          this.iAddressModel.addressId = this.iContactViewModel2.address.addressId;
          this.iAddressModel.streetAddress = this.mailingForm.value.streetAddress;
          this.iAddressModel.deptAddress = this.mailingForm.value.deptAddress;
          this.iAddressModel.city = this.mailingForm.value.city.locality;
          this.iAddressModel.stateId = this.mailingForm.value.stateId;
          this.iAddressModel.countryId = this.mailingForm.value.countryId;
          this.iAddressModel.postalCode = this.mailingForm.value.postalCode;
          this.iAddressModel.showInProfile = this.mailingForm.value.showInProfile;
          this.iAddressModel.showOnlyStateCity = this.mailingForm.value.showOnlyStateCity;
          this.iAddressModel.addressType = 1;
          this.iContactViewModel.contactId = this.loggedId;
          this.iContactViewModel.address = this.iAddressModel;
          this.iContactViewModel.company.description = this.compDescription;
          if (this.iContactViewModel2.address.addressId === 0) {
            this._profileService
              .addShippingAddress(this.iContactViewModel)
              .subscribe(
                result => {
                  this.iContactViewModel = result;
                  if (this.iContactViewModel.result === true) {
                    if (this.mailingForm.value.showInProfile === true) {
                      this.iAddressModel.addressId = this.mailingForm.value.addressId;
                      this.iAddressModel.streetAddress = this.mailingForm.value.streetAddress;
                      this.iAddressModel.deptAddress = this.mailingForm.value.deptAddress;
                      this.iAddressModel.city = this.mailingForm.value.city;
                      this.iAddressModel.stateId = this.mailingForm.value.stateId;
                      this.iAddressModel.countryId = this.mailingForm.value.countryId;
                      this.iAddressModel.postalCode = this.mailingForm.value.postalCode;
                      this.iAddressModel.addressType = 2;
                      this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
                      this.iCompanyShippingSiteViewModel.siteLabel = '';
                      this.iCompanyShippingSiteViewModel.companyName = '';
                      this.iCompanyShippingSiteViewModel.defaultSite = true;
                      this.iCompanyShippingSiteViewModel.siteCreationDate =
                        '2018-07-26T11:29:23.616Z';
                      this.iAddressModel.companyShippingSiteViewModelList.push(
                        this.iCompanyShippingSiteViewModel
                      );
                      this.iContactViewModel.contactId = this.loggedId;
                      this.iContactViewModel.address = this.iAddressModel;
                      this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                        result2 => {
                          this.iContactViewModel = result2;
                          if (this.iContactViewModel.result === true) {
                            this.loadAddress();
                            this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                            // this._SupplierService.set(true, 'headerUpdated');
                            // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                            // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                            this._SupplierService.set(true, 'editShippingAddress');
                            this.closePartDrawer();
                          } else {
                            this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                          }
                        },
                        error => {
                          this._rfqService.handleError(error);
                        },
                        () => {}
                      );
                    } else {
                      this.iAddressModel.showInProfile = this.mailingForm.value.showInProfile;
                      this.loadAddress();
                      this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                      // this._SupplierService.set(true, 'headerUpdated');
                      // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                      // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                      // this._SupplierService.set(true, 'companyDescription');
                      this._SupplierService.set(true, 'editShippingAddress');
                      this.mailingForm.reset();
                      this.closePartDrawer();
                      this._toastr.success(this.iContactViewModel.errorMessage, '');
                    }
                    this.isMailInfoSubmitted = false;
                  } else {
                    this.isMailInfoSubmitted = false;
                    this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                  }
                },
                error => {
                  this.isMailInfoSubmitted = false;
                  this._rfqService.handleError(error);
                },
                () => {}
              );
          } else {
            const id = this.loggedId;
            this._profileService.getAddress(id).subscribe(
              (data: IContactViewModel) => {
                this.iContactViewModel3 = data;
                this.mailingAddressData = this.iContactViewModel3.address;
                this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
                  result => {
                    this.iContactViewModel = result;
                    if (this.iContactViewModel.result === true) {
                      // tslint:disable-next-line:max-line-length
                      if (this.mailingAddressData.city === null && this.mailingAddressData.companyShippingSiteViewModelList.length < 3) {
                        // if (this.mailingForm.value.showInProfile === true) {
                        this.iAddressModel.addressId = this.mailingForm.value.addressId;
                        this.iAddressModel.streetAddress = this.mailingForm.value.streetAddress;
                        this.iAddressModel.deptAddress = this.mailingForm.value.deptAddress;
                        this.iAddressModel.city = this.mailingForm.value.city;
                        this.iAddressModel.stateId = this.mailingForm.value.stateId;
                        this.iAddressModel.countryId = this.mailingForm.value.countryId;
                        this.iAddressModel.postalCode = this.mailingForm.value.postalCode;
                        this.iAddressModel.addressType = 2;
                        this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
                        this.iCompanyShippingSiteViewModel.siteLabel = '';
                        this.iCompanyShippingSiteViewModel.companyName = '';
                        this.iCompanyShippingSiteViewModel.defaultSite = true;
                        this.iCompanyShippingSiteViewModel.siteCreationDate =
                          '2018-07-26T11:29:23.616Z';
                        this.iAddressModel.companyShippingSiteViewModelList.push(
                          this.iCompanyShippingSiteViewModel
                        );
                        this.iContactViewModel.contactId = this.loggedId;
                        this.iContactViewModel.address = this.iAddressModel;
                        this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                          result2 => {
                            this.iContactViewModel = result2;
                            if (this.iContactViewModel.result === true) {
                              this.loadAddress();
                              this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                              // this._SupplierService.set(true, 'headerUpdated');
                              // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                              // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                              // this._SupplierService.set(true, 'companyDescription');
                              this._SupplierService.set(true, 'editShippingAddress');
                              this.closePartDrawer();
                            } else {
                              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                            }
                          },
                          error => {
                            this._rfqService.handleError(error);
                          },
                          () => {}
                        );
                      } else if (this.mailingAddressData.city != null && this.mailingForm.value.showInProfile === true && this.mailingAddressData.companyShippingSiteViewModelList.length < 3) {
                        this.iAddressModel.addressId = this.mailingForm.value.addressId;
                        this.iAddressModel.streetAddress = this.mailingForm.value.streetAddress;
                        this.iAddressModel.deptAddress = this.mailingForm.value.deptAddress;
                        this.iAddressModel.city = this.mailingForm.value.city;
                        this.iAddressModel.stateId = this.mailingForm.value.stateId;
                        this.iAddressModel.countryId = this.mailingForm.value.countryId;
                        this.iAddressModel.postalCode = this.mailingForm.value.postalCode;
                        this.iAddressModel.addressType = 2;
                        this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
                        this.iCompanyShippingSiteViewModel.siteLabel = '';
                        this.iCompanyShippingSiteViewModel.companyName = '';
                        this.iCompanyShippingSiteViewModel.defaultSite = true;
                        this.iCompanyShippingSiteViewModel.siteCreationDate =
                          '2018-07-26T11:29:23.616Z';
                        this.iAddressModel.companyShippingSiteViewModelList.push(
                          this.iCompanyShippingSiteViewModel
                        );
                        this.iContactViewModel.contactId = this.loggedId;
                        this.iContactViewModel.address = this.iAddressModel;
                        this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                          result2 => {
                            this.iContactViewModel = result2;
                            if (this.iContactViewModel.result === true) {
                              this.loadAddress();
                              this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                              // this._SupplierService.set(true, 'headerUpdated');
                              // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                              // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                              // this._SupplierService.set(true, 'companyDescription');
                              this._SupplierService.set(true, 'editShippingAddress');
                              this.closePartDrawer();
                            } else {
                              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                            }
                          },
                          error => {
                            this._rfqService.handleError(error);
                          },
                          () => {}
                        );
                      } else {
                        this.loadAddress();
                        this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                        // this._SupplierService.set(true, 'headerUpdated');
                        // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                        // this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                        // this._SupplierService.set(true, 'companyDescription');
                        this._SupplierService.set(true, 'editShippingAddress');
                        this.mailingForm.reset();
                        this.closePartDrawer();
                        this._toastr.success(this.iContactViewModel.errorMessage, '');
                      }
                    } else {
                      this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                    }
                    this.isMailInfoSubmitted = false;
                  },
                  error => {
                    this.isMailInfoSubmitted = false;
                    this._rfqService.handleError(error);
                  },
                  () => {}
                );
              })
          }
        }
      } else {
        this.isMailInfoSubmitted = false;
        this._customValidatorsService.validateAllFormFields(this.mailingForm);
      }
    }
  }
  getState(checksource = 1) {
    // this.iRegionModel = [];
    this._masterService.getState(this.mailingForm.value.countryId).subscribe(
      (data: IRegionModel[]) => {
        this.iRegionModel = data['stateData'];
        if (checksource) {
          this.mailingForm.patchValue({ stateId: 0 });
          this.mailingForm.get('stateId').updateValueAndValidity();
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    // this.iRegionModel = this.iRegionModelColl.filter(m => m.countryId === this.companyProfileForm.value.countryId);
  }

  processSearch = (text$: Observable < string > ) =>
  text$.pipe(
    debounceTime(200),
    map(term => term === '' ? [] :
      this.processData.filter(v => v.value.toLowerCase().indexOf(term.toLowerCase()) > -1))
  )
  formatterProcess = (x: {
    value: string
  }) => x.value;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),

      switchMap(term => term.length < 2 ? []
        :
        this._SupplierService.search(term).pipe(
          map(response => response['data'].filter(x=> x.streetAddress != null || x.streetAddress != '')),
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
    addressSelected(item: any){

      if(item.item!= null){
        if(item.item.countryRegion){
          let countryList = this.iCountryViewModelColl.filter(x=> x.countryName.toLowerCase() === item.item.countryRegion.toLowerCase());
          if(countryList.length){
            this.mailingForm.patchValue({ countryId: countryList[0].countryId })
            this.mailingForm.get('countryId').updateValueAndValidity();
            this.getState();
          }
          if(item.item.postalCode){
            this.mailingForm.patchValue({ postalCode: item.item.postalCode})
            this.mailingForm.get('postalCode').updateValueAndValidity();
          }else{
            this.mailingForm.patchValue({ postalCode: ''});
            this.mailingForm.get('postalCode').updateValueAndValidity();
          }
          if(item.item.locality){
            this.mailingForm.patchValue({ city: item.item.locality})
            this.mailingForm.get('city').updateValueAndValidity();
          } else{
            this.mailingForm.patchValue({ city: ''})
            this.mailingForm.get('city').updateValueAndValidity();
          }
        }
      }
    }
  formattedAddress(address){
    let str = ' ';
    if(address.streetAddress){
      str+= address.streetAddress+' ';
    } 
    if(address.locality){
      str+= address.locality+' ';
    }
    if(address.adminDistrict){
      str+= address.adminDistrict+' ';
    }
    if(address.countryRegion){
      str+= address.countryRegion+' ';
    }
    if(address.postalCode){
      str+= address.postalCode;
    }
    return str;
  }
  inputFormatBandListValue(value: any)   {
    if(typeof value === 'object'){
      if(value.streetAddress){
        this.mailingForm.patchValue({ streetAddress: value.streetAddress })
          this.mailingForm.get('streetAddress').updateValueAndValidity();
        return value.streetAddress
      } else {
        return this.iAddressModel.streetAddress;
      }
    } else{
      return value;
    }   
  }
 
  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching1 = true),

      switchMap(result => result.length < 2 ? []
        :
        this._SupplierService.search(result).pipe(
          map(response => response['data'].filter(x=> x.city != null || x.city != '')),
          tap(() => this.searchFailed1 = false),
          catchError(() => {
            this.searchFailed1 = true;
            return of([]);
          }))
      ),
      tap(() => this.searching1 = false)
    )
    formatterCity = (x: {
      city: string
    }) => x.city;
  
    inputFormatBandListValue1(value: any) {
      if(typeof value === 'object' && this.mailingForm) {
        this.mailingForm.patchValue({ city: value.locality })
        this.mailingForm.get('city').updateValueAndValidity();
      } else if(typeof value === 'string' && this.mailingForm) {
        this.mailingForm.patchValue({ city: value })
        this.mailingForm.get('city').updateValueAndValidity();
      }
      return typeof value === 'object' ? value.locality : value;
    }
    localitySelected(event: any){

      console.log('localitySelected', event, this.mailingForm)

    }
  closePartDrawer() {
    this._SupplierService.set(false, 'isEditMailing');
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

  createCompanyDescriptionForm() {
    this.iCompanyViewModel.description = this._SupplierService.get('companyDescriptionValue');
    this.companyDescriptionForm = this._fb.group({
      description: [this.iCompanyViewModel['description'], Validators.required]
    });
  }
  isFieldValid1(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.companyDescriptionForm,
      field
    );
  }

  editCompanyDescription() {
    // if(!this.isCompanyDesSubmitted){
    //   this.isCompanyDesSubmitted = true;
      if (this.oldCompDescription !== this.compDescription || this.compDescription !== '' && this.compDescription   !== null) {
        const decLength = this.iCompanyViewModel.description.trim().length;
        if (decLength > 4000) {
          this._toastr.error('Company Description should be less than 4000 Characters', 'Error!');
          this.isCompanyDesSubmitted = false;
        } else {
        this.iCompanyViewModel.companyId = this.iContactViewModel.companyId;
        this.iCompanyViewModel.description = this.compDescription;
        this._SupplierService.editCompanyDescription(this.iCompanyViewModel).subscribe(
          result => {
            this.iCompanyViewModel = result['data'];
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], 'Success!');
              this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
              localStorage.setItem('isCompanyProfileFilled', 'true');
              this.closePartDrawer();
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
            this.isCompanyDesSubmitted = false;
          },
          error => {
            this.isCompanyDesSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
    } else {
      this.isCompanyDesError = true;
      this.isCompanyDesSubmitted = false;
    }
  }
  // }
}
