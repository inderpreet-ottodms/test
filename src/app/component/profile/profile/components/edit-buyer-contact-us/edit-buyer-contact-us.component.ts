import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { of,Observable  } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import {
  ToastrService
} from 'ngx-toastr';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  initializeMap,
  saveMap
} from '../../../../../../assets/javascript/demo';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';

import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  IProfileViewModel,
  IContactViewModel,
  ICompanyEditViewModel,
  IAddressModel,
  ICompanyShippingSiteViewModel,
  ICompanyModel
} from '../../../../../core/models/accountModel';
import {
  ICountryViewModel,
  IRegionModel
} from '../../../../../core/models/globalMaster';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
@Component({
  selector: 'app-edit-buyer-contact-us',
  templateUrl: './edit-buyer-contact-us.component.html',
  styleUrls: ['./edit-buyer-contact-us.component.scss']
})
export class EditBuyerContactUsComponent implements OnInit {

  iProfileViewModel: IProfileViewModel;
  iContactViewModel: IContactViewModel;
  iCompanyEditViewModel: ICompanyEditViewModel;
  iAddressModel: IAddressModel;
  iCountryColl: ICountryViewModel[];
  iRegionModelColl: IRegionModel[];
  iRegionModel: IRegionModel[];
  iCompanyShippingSiteViewModel: ICompanyShippingSiteViewModel;
  companyProfileForm: FormGroup;
  isLoader: boolean;
  isContactInfoSubmitted: boolean = false;
  searchFailed: boolean = false;
  searching:boolean = false;
  isCompanyDesSubmitted: boolean = false;
  iCompanyViewModel: ICompanyModel;
  companyDescriptionForm: FormGroup;
  isCompanyDesError: boolean;
  constructor(private _SupplierService: SupplierService,
    private _fb: FormBuilder,
    private _customValidatorsService: CustomValidatorService,
    private _profileService: ProfileService,
    private _toastr: ToastrService,
    private _masterService: MasterService,
    private _rfqService: RfqService
  ) {
    this.initModels();
    this.isLoader = true;
    this.isCompanyDesError = false;
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
  }
  initModels() {
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactIdEncrypt: '',
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
      language: null,
      address: this.iAddressModel,
      company: null,
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
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
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

    this.iCompanyEditViewModel = {
      address5: '',
      city: '',
      companyId: 0,
      contactId: 0,
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      facebook: '',
      linkedIn: '',
      phoneNo: '',
      postalCode: '',
      result: false,
      stateId: '',
      streetAddress: '',
      tweeter: '',
      website: ''
    };
    // this.iAddressModel = {
    //   address5: '',
    //   addressId: 0,
    //   addressType: 0,
    //   city: '',
    //   countryId: 0,
    //   country: '',
    //   deptAddress: '',
    //   errorMessage: '',
    //   isActive: false,
    //   postalCode: '',
    //   showInProfile: true,
    //   showOnlyStateCity: true,
    //   state: '',
    //   stateId: 0,
    //   streetAddress: '',
    //   result: false,
    //   companyShippingSiteViewModelList: []
    // };

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

  ngOnInit() {
    this.iRegionModel = [];
    this._masterService.getCountry().subscribe(
      (data2: ICountryViewModel[]) => {
        this.iCountryColl = data2;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );

    this.GetProfileDetails();
    this.createCompanyDescriptionForm();
  }


  onCountrySelection() {
    this.iRegionModel = [];
    this._masterService.getState(this.companyProfileForm.value.countryId).subscribe(
      (data: IRegionModel[]) => {
        this.iRegionModel = data['stateData'];
        this.companyProfileForm.get('stateId').patchValue('');
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    // this.iRegionModel = this.iRegionModelColl.filter(m => m.countryId === this.companyProfileForm.value.countryId);
  }
  getState() {
    this.iRegionModel = [];
    this._masterService.getState(this.companyProfileForm.value.countryId).subscribe(
      (data: IRegionModel[]) => {
        this.iRegionModel = data['stateData'];
        if (this.iCompanyEditViewModel.stateId == 0) {
          this.companyProfileForm.get('stateId').patchValue('');
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    // this.iRegionModel = this.iRegionModelColl.filter(m => m.countryId === this.companyProfileForm.value.countryId);
  }

  createForm() {
    this.inintShippingAddress();
    this.companyProfileForm = this._fb.group({
      streetAddress: [this.iCompanyEditViewModel['streetAddress']],
      deptAddress: [this.iCompanyEditViewModel['deptAddress']],
      countryId: [this.iCompanyEditViewModel['countryId']],
      stateId: [this.iCompanyEditViewModel['stateId'], Validators.required],
      city: [this.iCompanyEditViewModel['city']],
      phoneNo: [this.iCompanyEditViewModel['phoneNo']],
      postalCode: [this.iCompanyEditViewModel['postalCode']],
      website: [this.iCompanyEditViewModel['website']],
      linkedIn: [this.iCompanyEditViewModel['linkedIn']],
      tweeter: [this.iCompanyEditViewModel['tweeter']],
      facebook: [this.iCompanyEditViewModel['facebook']],
      showInProfile: [this.iCompanyEditViewModel['showInProfile']],
      showOnlyStateCity: [this.iCompanyEditViewModel['showOnlyStateCity']]
    });
    this.getState();
    this.isLoader = false;
  }
  getMap() {
    initializeMap('manish nagar,Nagpur');
  }


  onSaveContactInfo() {
    // this.editCompanyDescription();
    if (!this.isContactInfoSubmitted) {
      this.isContactInfoSubmitted = true;

      if (this.companyProfileForm.valid) {
        if (this.iContactViewModel.companyId === null || this.iContactViewModel.companyId === 0) {
          this.isContactInfoSubmitted = false;
          this._toastr.warning('Please update Company details first from Contact Information section', 'Warning!');
        } else {
          this.iAddressModel.addressId = this.iContactViewModel.address.addressId;
          this.iAddressModel.streetAddress = this.companyProfileForm.value.streetAddress;
          this.iAddressModel.deptAddress = this.companyProfileForm.value.deptAddress;
          this.iAddressModel.city = this.companyProfileForm.value.city;
          this.iAddressModel.stateId = this.companyProfileForm.value.stateId;
          this.iAddressModel.countryId = this.companyProfileForm.value.countryId;
          this.iAddressModel.postalCode = this.companyProfileForm.value.postalCode;
          this.iContactViewModel.phoneNo = this.companyProfileForm.value.phoneNo;
          this.iContactViewModel.tweeter = this.companyProfileForm.value.tweeter;
          this.iContactViewModel.website = this.companyProfileForm.value.website;
          this.iContactViewModel.facebook = this.companyProfileForm.value.facebook;
          this.iContactViewModel.linkedIn = this.companyProfileForm.value.linkedIn;
          this.iAddressModel.showInProfile = this.companyProfileForm.value.showInProfile;
          this.iAddressModel.showOnlyStateCity = this.companyProfileForm.value.showOnlyStateCity;
          this.iAddressModel.addressType = 1;
          this.iContactViewModel.contactId = this.loggedId;
          this.iContactViewModel.address = this.iAddressModel;
          if (this.iContactViewModel.address.addressId === 0 || this.iContactViewModel.address.addressId === null) {
            this._profileService
              .addShippingAddress(this.iContactViewModel)
              .subscribe(
                result => {
                  this.iContactViewModel = result;
                  if (this.iContactViewModel.result === true) {
                    if (this.iAddressModel.showInProfile === true) {
                      this.iAddressModel.addressId = this.companyProfileForm.value.addressId;
                      this.iAddressModel.streetAddress = this.companyProfileForm.value.streetAddress;
                      this.iAddressModel.deptAddress = this.companyProfileForm.value.deptAddress;
                      this.iAddressModel.city = this.companyProfileForm.value.city;
                      this.iAddressModel.stateId = this.companyProfileForm.value.stateId;
                      this.iAddressModel.countryId = this.companyProfileForm.value.countryId;
                      this.iAddressModel.postalCode = this.companyProfileForm.value.postalCode;
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

                      this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
                        // tslint:disable-next-line:no-shadowed-variable
                        result => {
                          if (result['result'] === true) {
                            this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
                              result2 => {
                                this.iContactViewModel = result2;
                                if (this.iContactViewModel.result === true) {
                                  // this.loadAddress();
                                  //  this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                                  this._toastr.success(this.iContactViewModel.errorMessage, '');
                                  this._SupplierService.set(true, 'headerUpdated');
                                  this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                                  this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                                  this.closePartDrawer();
                                } else {
                                  this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                                }
                                this.isContactInfoSubmitted = false;
                              },
                              error => {
                                this.isContactInfoSubmitted = false;
                                this._rfqService.handleError(error);
                              },
                              () => {}
                            );
                          }
                        }, error => {
                          this.isContactInfoSubmitted = false;
                          this._rfqService.handleError(error);
                        },
                        () => {}
                      );
                    }
                  } else {
                    this.isContactInfoSubmitted = false;
                    this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                  }
                },
                error => {
                  this.isContactInfoSubmitted = false;
                  this._rfqService.handleError(error);
                },
                () => {}
              );

          } else {
            // console.log('new' , this.iContactViewModel);
            this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
              result => {
                if (result['result'] === true) {
                  this.iAddressModel.addressId = this.iContactViewModel.addressId;
                  this.iAddressModel.streetAddress = this.companyProfileForm.value.streetAddress;
                  this.iAddressModel.deptAddress = this.companyProfileForm.value.deptAddress;
                  this.iAddressModel.city = this.companyProfileForm.value.city;
                  this.iAddressModel.countryId = this.companyProfileForm.value.countryId;
                  this.iAddressModel.stateId = this.companyProfileForm.value.stateId;
                  this.iAddressModel.postalCode = this.companyProfileForm.value.postalCode;
                  this.iAddressModel.addressType = 1;
                  this.iAddressModel.showInProfile = this.companyProfileForm.value.showInProfile;
                  this.iAddressModel.showOnlyStateCity = this.companyProfileForm.value.showOnlyStateCity;
                  this.iContactViewModel.contactId = this.loggedId;
                  this.iContactViewModel.address = this.iAddressModel;
                  this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
                    result2 => {
                      this.iContactViewModel = result2;
                      if (this.iContactViewModel.result === true) {
                        this._toastr.success(this.iContactViewModel.errorMessage, '');
                        this._SupplierService.set(true, 'contactUsDrawerDataSaved');
                        this._SupplierService.set(true, 'headerUpdated');
                        this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                        this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
                        this.closePartDrawer();

                      } else {
                        this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                      }
                      this.isContactInfoSubmitted = false;
                    },
                    error => {
                      this.isContactInfoSubmitted = false;
                      this._rfqService.handleError(error);
                    },
                    () => {}
                  );
                } else {
                  this.isContactInfoSubmitted = false;
                  this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                }
              },
              error => {
                this.isContactInfoSubmitted = false;
                this._rfqService.handleError(error);
              },
              () => {}
            );
          }
          //  }
        }
      } else {
        this.isContactInfoSubmitted = false;
        this._customValidatorsService.validateAllFormFields(this.companyProfileForm);
      }
    }
  }




  onSaveContactInfo1() {
    if (this.companyProfileForm.valid) {
      if (this.iContactViewModel.addressId === 0 || this.iContactViewModel.addressId === null) {
        this._toastr.warning('Please complete your profile and mailing address first from Contact Information section', 'Warning!');
      } else {
        this.iContactViewModel.phoneNo = this.companyProfileForm.value.phoneNo;
        this.iContactViewModel.tweeter = this.companyProfileForm.value.tweeter;
        this.iContactViewModel.website = this.companyProfileForm.value.website;
        this.iContactViewModel.facebook = this.companyProfileForm.value.facebook;
        this.iContactViewModel.linkedIn = this.companyProfileForm.value.linkedIn;
        this.iContactViewModel.contactId = this.loggedId;
        this.iContactViewModel.companyId = this.iContactViewModel.companyId;
        this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
          result => {
            if (result['result'] === true) {
              this.iAddressModel.addressId = this.iContactViewModel.addressId;
              this.iAddressModel.streetAddress = this.companyProfileForm.value.streetAddress;
              this.iAddressModel.deptAddress = this.companyProfileForm.value.deptAddress;
              this.iAddressModel.city = this.companyProfileForm.value.city;
              this.iAddressModel.countryId = this.companyProfileForm.value.countryId;
              this.iAddressModel.stateId = this.companyProfileForm.value.stateId;
              this.iAddressModel.postalCode = this.companyProfileForm.value.postalCode;
              this.iAddressModel.addressType = 1;
              this.iContactViewModel.contactId = this.loggedId;
              this.iContactViewModel.address = this.iAddressModel;
              this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
                result2 => {
                  this.iContactViewModel = result2;
                  if (this.iContactViewModel.result === true) {
                    this._toastr.success(this.iContactViewModel.errorMessage, '');
                    this._SupplierService.set(true, 'contactUsDrawerDataSaved');
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
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      }
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  GetProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        this.iCompanyEditViewModel.phoneNo = this.iContactViewModel.phoneNo;
        this.iCompanyEditViewModel.phoneNo = this.iContactViewModel.phoneNo;
        this.iCompanyEditViewModel.tweeter = this.iContactViewModel.tweeter;
        this.iCompanyEditViewModel.website = this.iContactViewModel.website;
        this.iCompanyEditViewModel.facebook = this.iContactViewModel.facebook;
        this.iCompanyEditViewModel.linkedIn = this.iContactViewModel.linkedIn;
        this.iCompanyEditViewModel.streetAddress = this.iContactViewModel.address.streetAddress;
        this.iCompanyEditViewModel.deptAddress = this.iContactViewModel.address.deptAddress;
        this.iCompanyEditViewModel.city = this.iContactViewModel.address.city;
        this.iCompanyEditViewModel.countryId = this.iContactViewModel.address.countryId;
        this.iCompanyEditViewModel.stateId = this.iContactViewModel.address.stateId;
        this.iCompanyEditViewModel.postalCode = this.iContactViewModel.address.postalCode;

        this.createForm();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.companyProfileForm,
      field
    );
  }

  closePartDrawer(isCancled ? ) {
    if (isCancled) {
      this._SupplierService.set(true, 'editHeaderCancelWarning');
      this._SupplierService.set(true, 'contactUsDrawerDataSaved');
    } else {
      // this.getMap();
      this._SupplierService.set(true, 'contactUsDrawerDataSaved');
      this._SupplierService.set(false, 'buyerProfileSidePanel');
      this._SupplierService.set(false, 'isEditBuyerContactUs');
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
    }
  }
  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != '') {
      // this.iProfileViewModel['phoneNo'] = number.replace(/-/g, '');
      this.companyProfileForm.patchValue({
        'phoneNo': number.replace(/-/g, '')
      });
    }
  }
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

    formatterAddress = (x: {
      streetAddress: string
    }) => x.streetAddress;

    addressSelected(item: any){
      debugger;
      if(item.item!= null){
        if(item.item.countryRegion){
          let countryList = this.iCountryColl.filter(x=> x.countryName.toLowerCase() === item.item.countryRegion.toLowerCase());
          if(countryList.length){
            this.companyProfileForm.patchValue({ countryId: countryList[0].countryId });
            this.companyProfileForm.get('countryId').updateValueAndValidity();
            this.iCompanyEditViewModel.stateId = 0;
            this.getState();
          }
          if(item.item.postalCode){
            this.companyProfileForm.patchValue({ postalCode: item.item.postalCode})
            this.companyProfileForm.get('postalCode').updateValueAndValidity();
          }else{
            this.companyProfileForm.patchValue({ postalCode: ''});
            this.companyProfileForm.get('postalCode').updateValueAndValidity();
          }
          if(item.item.locality){
            this.companyProfileForm.patchValue({ city: item.item.locality})
            this.companyProfileForm.get('city').updateValueAndValidity();
          } else{
            this.companyProfileForm.patchValue({ city: ''})
            this.companyProfileForm.get('city').updateValueAndValidity();
          }
        }
      }
    }
    inputFormatBandListValue(value: any)   {
      debugger;
      if(typeof value === 'object'){
        if(value.streetAddress){
          this.companyProfileForm.patchValue({ streetAddress: value.streetAddress })
            this.companyProfileForm.get('streetAddress').updateValueAndValidity();
          return value.streetAddress
        } else {
          return this.iCompanyEditViewModel.streetAddress;
        }
      } else{
        return value;
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
      if(!this.isCompanyDesSubmitted){
        this.isCompanyDesSubmitted = true;
        if (this.iCompanyViewModel.description !== '' && this.iCompanyViewModel.description !== null) {
          const decLength = this.iCompanyViewModel.description.trim().length;
          if (decLength > 4000) {
            this._toastr.error('Company Description should be less than 4000 Characters', 'Error!');
            this.isCompanyDesSubmitted = false;
          } else {
          this.iCompanyViewModel.companyId = this.iContactViewModel.companyId;
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
    }
}
