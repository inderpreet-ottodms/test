import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidatorService } from '../../../../../core/services/validator/custom-validator.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../../../../core/services/master/master.service';
import { IProfileViewModel, IContactViewModel, ICompanyEditViewModel, IAddressModel } from '../../../../../core/models/accountModel';
import { ICountryViewModel, IRegionModel } from '../../../../../core/models/globalMaster';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { IManufacturerDashboardViewModel } from '../../../../../core/models/supplierProfileModel';
import { of,Observable } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'app-edit-contact-us',
  templateUrl: './edit-contact-us.component.html',
  styleUrls: ['./edit-contact-us.component.scss']
})
export class EditContactUsComponent implements OnInit {

  iProfileViewModel: IProfileViewModel;
  iContactViewModel: IContactViewModel;
  iCompanyEditViewModel: ICompanyEditViewModel;
  iAddressModel: IAddressModel;
  iCountryColl: ICountryViewModel[];
  iRegionModelColl: IRegionModel[];
  iRegionModel: IRegionModel[];
  companyProfileForm: FormGroup;
  isLoader: boolean;
  phoneNumberlimit: number;
  isButtonClicked: boolean = false;
  iProfileSetModel: IManufacturerDashboardViewModel;
  processData: any;
  processData1: any;
  searching = false;
  searching1 = false;
  searchFailed1 = false;
  searchFailed = false; 
  @Output() profileChanges = new EventEmitter();
  
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
    this.phoneNumberlimit = 17;
  }

  initModels() {
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      comments: '',
      contactIdEncrypt: '',
      companyId: 0,
      contactFunction: '',
      contactId: 0,
      isLoginFromVision: false,
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
      stateId: 0,
      streetAddress: '',
      tweeter: '',
      website: ''
    };
  }

  ngOnInit() {
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      isPublishProfile: null,
      isCompanyAddress: null,
      contactId: this.loggedId
    };
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
  }

  getState(checksource = 1) {
    // this.iRegionModel = [];
    this._masterService.getState(this.companyProfileForm.value.countryId).subscribe(
      (data: IRegionModel[]) => {
        this.iRegionModel = data['stateData'];
        if (checksource) {
          this.companyProfileForm.patchValue({ stateId: 0 });
          this.companyProfileForm.get('stateId').updateValueAndValidity();
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    // this.iRegionModel = this.iRegionModelColl.filter(m => m.countryId === this.companyProfileForm.value.countryId);
  }

  createForm() {
    this.companyProfileForm = this._fb.group({
      streetAddress: [this.iCompanyEditViewModel['streetAddress'], Validators.required],
      deptAddress: [this.iCompanyEditViewModel['deptAddress']],
      countryId: [this.iCompanyEditViewModel['countryId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      stateId: [this.iCompanyEditViewModel['stateId'], Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      city: [this.iCompanyEditViewModel['city'], Validators.required],
      phoneNo: [this.iCompanyEditViewModel['phoneNo'], Validators.required],
      postalCode: [this.iCompanyEditViewModel['postalCode'], Validators.required],
      website: [this.iCompanyEditViewModel['website']],
      linkedIn: [this.iCompanyEditViewModel['linkedIn']],
      tweeter: [this.iCompanyEditViewModel['tweeter']],
      facebook: [this.iCompanyEditViewModel['facebook']]
    });
    this.getState(0);
    this.isLoader = false;
  }
  getMap() {
    // initializeMap('manish nagar,Nagpur');
  }
  onSaveContactInfo() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      if (this.companyProfileForm.valid) {

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
              this.setProfileStatus();
              // tslint:disable-next-line:no-
              if (this.iContactViewModel.addressId === null) {
                this.iAddressModel.addressId = 0;
              } else {
                this.iAddressModel.addressId = this.iContactViewModel.addressId;
              }
              this.iAddressModel.streetAddress = this.companyProfileForm.value.streetAddress;
              this.iAddressModel.deptAddress = this.companyProfileForm.value.deptAddress;
              this.iAddressModel.city = this.companyProfileForm.value.city.locality;
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
                    localStorage.removeItem('iContactViewModel');
                    localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
                    this._toastr.success(this.iContactViewModel.errorMessage, '');
                    this._SupplierService.set(true, 'contactUsDrawerDataSaved');
                    this._SupplierService.set(true, 'headerUpdated');
                    this.closePartDrawer();
                    this.profileChanges.emit(true);
                  } else {
                    this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                  }
                  this.isButtonClicked = false;
                },
                error => {
                  this.isButtonClicked = false;
                  this._rfqService.handleError(error);
                },
                () => { }
              );
            } else {
              this.isButtonClicked = false;
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            }
          },
          error => {
            this.isButtonClicked = false;
            this._rfqService.handleError(error);
          },
          () => {
          }
        );
      }
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  GetProfileDetails() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
      if (this.iContactViewModel.address.countryId == 92) {
        this.phoneNumberlimit = 17;
      }
      this.iContactViewModel.phoneNo = this.iContactViewModel.phoneNo.replace(/[- )(]/g, '');
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
    } else {
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          if (this.iContactViewModel.address.countryId == 92) {
            this.phoneNumberlimit = 17;
          }
          this.iContactViewModel.phoneNo = result.phoneNo.replace(/[- )(]/g, '');
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
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
        () => { }
      );
    }
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

  closePartDrawer(isCancled?) {
    if (isCancled) {
      this._SupplierService.set(true, 'editHeaderCancelWarning');
      this._SupplierService.set(true, 'contactUsDrawerDataSaved');
    } else {
      // this.getMap();
      this._SupplierService.set(true, 'contactUsDrawerDataSaved');
      this._SupplierService.set(false, 'supplierSidePanel');
      this._SupplierService.set(false, 'contactUsEdit');
      this._SupplierService.set(false, 'aboutUsEdit');
      this._SupplierService.set(false, 'capabilitiesEdit');
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
      this.iCompanyEditViewModel['phoneNo'] = number.replace(/-/g, '');
      this.companyProfileForm.patchValue({
        'phoneNo': number.replace(/-/g, '')
      });
    }
  }

  setProfileStatus() {
    this.iProfileSetModel.isCompanyAddress = true;
    this._SupplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }
  //this  function for process dropdown
  processSearch = (text$: Observable < string > ) =>
  text$.pipe(
    debounceTime(200),
    map(term => term === '' ? [] :
      this.processData.filter(v => v.value.toLowerCase().indexOf(term.toLowerCase()) > -1))
  )
  formatterProcess = (x: {
    value: string
  }) => x.value;
  processSearch1 = (text$: Observable < string > ) =>
  text$.pipe(
    debounceTime(200),
    map(result => result === '' ? [] :
      this.processData1.filter(v => v.value.toLowerCase().indexOf(result.toLowerCase()) > -1))
  )
  formatterProcess1 = (x: {
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

    formatterAddress = (x: {
      streetAddress: string
    }) => x.streetAddress;
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
    addressSelected(item: any){
      
      if(item.item!= null){
        if(item.item.countryRegion){
          let countryList = this.iCountryColl.filter(x=> x.countryName.toLowerCase() === item.item.countryRegion.toLowerCase());
          if(countryList.length){
            this.companyProfileForm.patchValue({ countryId: countryList[0].countryId })
            this.companyProfileForm.get('countryId').updateValueAndValidity();
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
    localitySelected(event: any){
      
      console.log('localitySelected', event, this.companyProfileForm)   
    }
    inputFormatBandListValue(value: any)   {
      
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
    inputFormatBandListValue1(value: any) {
      if(typeof value === 'object' && this.companyProfileForm) {
        this.companyProfileForm.patchValue({ city: value.locality })
        this.companyProfileForm.get('city').updateValueAndValidity();
      } else if(typeof value === 'string' && this.companyProfileForm) {
        this.companyProfileForm.patchValue({ city: value })
        this.companyProfileForm.get('city').updateValueAndValidity();
      }
      return typeof value === 'object' ? value.locality : value;
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

}
