import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ICompanyModel,IAddressModel, IContactViewModel,ICompanyShippingSiteViewModel } from './../../../../../core/models/accountModel';
import {
  MasterService
} from './../../../../../core/services/master/master.service';

import {
  ICategory,
  IPostProdProcesses,
  IMaterial,
  IQuantityUnit,
  ILanguageModel,
  ICountryViewModel,
  IRegionModel,
  IMaterialViewModel,
  IPostProductionViewModel,
  ICertificationViewModel
} from '../../../../../core/models/globalMaster';
import {
  IRfqBuyerStatus,
  IRFQViewModel,
  
} from '../../../../../core/models/rfqModel';
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './../../../../../core/services/profile/profile.service';
import { IPartLibraryModelDetails } from './../../../../../core/models/partModel';
import { RfqService } from './../../../../../core/services/rfq/rfq.service';
import { IShippingAddressesModel } from './../../../../../core/models/profileModel';
import {
  CustomValidatorService
} from './../../../../../core/services/validator/custom-validator.service';

@Component({
  selector: 'app-contact-side-panel',
  templateUrl: './contact-side-panel.component.html',
  styleUrls: ['./contact-side-panel.component.scss']
})
export class ContactSidePanelComponent implements OnInit {
  iCountryColl: ICountryViewModel[];
  defaultCountry: any;
  CompanyName: string;
  isShiiping5: boolean;
  cuSiteId: any;
  states: any;
  @Output() drawer_OnClose = new EventEmitter<boolean>();
  isAddShippingBtnClicked: boolean;
  isStateValid: boolean;
  isCountryValid: boolean;
  iCompanyShippingSiteViewModel: ICompanyShippingSiteViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  iDefaultAddressModel: IAddressModel;
  iInfoModelCYP: IContactViewModel;
  iRegionModel: IRegionModel[];
  shippingForm: FormGroup;
  iCountryProfileColl: ICountryViewModel[];
  iContactViewModel: IContactViewModel;
  iContactViewModel2: IContactViewModel;
  iContactViewModel3: IContactViewModel;
  iShippingAddressModelCYP: IContactViewModel;
  irfqViewModel: IRFQViewModel;
  isSidePanel: boolean;
  isPartClicked: boolean;
  addressList: boolean=true;
  isPartsLibrarayClicked: boolean;
  addGenAttachementDiv: boolean;
  dispalyIndividualGrps: boolean;
  isViewStandardNdaClicked: boolean;
  shippingAddressData: any;
  latestAddressId: number;
  addShippingform: boolean;
  isShip2To: boolean;
  checkAddress: any;
  isSaveAddress: boolean;
  iShippingAddressesModel: IShippingAddressesModel;
  partGotFromLibraryColl: any[];
  idForPartGotFromLibraryColl: number[];
  iPartLibraryModelDetailsColl: IPartLibraryModelDetails[];
  mailingAddressData: any;
  iAddressModelCYP: IAddressModel;
  isCompanyPresent = true;
  rfqID: any;
  iRfqBuyerStatus: IRfqBuyerStatus;
  dataSendOnCheckAddress: any;
  constructor(private _profileService: ProfileService,private _masterService: MasterService,private _toastr: ToastrService,private _fb: FormBuilder,private _rfqService: RfqService,    private _customValidatorsService: CustomValidatorService,) {
    this.loggedContactId = parseInt(localStorage.getItem("LoggedId"));
    this.isAddShippingBtnClicked = false;
    this._rfqService.companyname.subscribe(data=>{this.companyInput=data
    });

  }
   
  ngOnInit() {
    this.getAddress();
    this.getCountry();
    this.initContactViewModel()
    this.initRfqModel()
    this.initRfqBuyerStatus()
    this.rfqID = localStorage.getItem('RfqId');
   
  }
 
  closeShippingList() {
    this.isSidePanel = false;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.addGenAttachementDiv = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.isViewStandardNdaClicked = false;
  }
  initRfqModel() {
    this.irfqViewModel = {
      rfqId: 0,
      rfqName: '',
      payment_term_id: null,
      contactIdEncrypt: '',
      rfqDescription: '',
      certificateIdList: [],
      certificateList: [],
      rfqStatus: '',
      contactId: 0,
      rfqCreatedOn: '',
      rfqStatusId: 0,
      isSpecialCertificationsByManufacturer: false,
      isSpecialInstructionToManufacturer: false,
      specialInstructionToManufacturer: '',
      importancePrice: 1,
      importanceSpeed: 2,
      importanceQuality: 3,
      quotesNeededBy: null,
      awardDate: null,
      preferredManufacturingLocation: 0,
      isPartialQuotingAllowed: false,
      whoPaysForShipping: 1,
      shipTo: 0,
      isRegisterSupplierQuoteTheRfq: true,
      prefNdaType: 0,
      postProductionProcessId: 0,
      errorMessage: '',
      result: false,
      rfqBuyerStatus: this.iRfqBuyerStatus,
      userType: 0,
      isDefaultPrefferedManufacturingLocation: false,
      rfqGeneralAttachmentsList: [],
      certificationsByManufacturer: '',
      isDefaultNDAdetails: false,
      ndaContent: '',
      ndaTypekey: '',
      preferredMfgLocationIds: [],
      partCount: 0,
      isProfileNDA: false,
      isDefaultWhoPaysForShipping: false,
      rfqThumbnail: '',
      isActive: false,
      isUpdatedFromVision: false,
      isAllPartDetailsFilled: false,
      modifiedBy: this.loggedContactId,
      is_Default_payment_term_id: false,
      SpecialinviteList: [],
      companyId: null,
      ndaFile: '',
      ndaFileId: 0,
      isRfqLike: false,
      isRfqDisLike: false,
      isOnlyDateChanged: false,
      isAwarded: false,
      isShopIQAvailable: false,
      maxDeliveryDate: null,
      deliveryDate: null,
      isDefaultPrefRfqCommunicationMethod: false,
      prefRfqCommunicationMethod: null,
      isStripeSupplier: false,
      isAllowQuoting: false,
      isAwardingEnabled: false,
      rfqPurpose: null,

    };
  }
  initRfqBuyerStatus() {
    this.iRfqBuyerStatus = {
      description: '',
      position: 0,
      rfqBuyerstatusId: 0,
      rfqBuyerstatusLiKey: ''
    };
  }

  addDefaultShipping() {
    // console.log("this.checkAddress",this.checkAddress)
    // console.log("this.iContactViewModel2",this.iContactViewModel2)
    // console.log("dataSendOnCheckAddress",this.dataSendOnCheckAddress)
    this._rfqService.setContactModel(this.dataSendOnCheckAddress)
    this._rfqService.set(false, "showSidePanel");
    // this.iContactViewModel =this.dataSendOnCheckAddress;
   
    if (this.iContactViewModel2 !== undefined) {
      if (
        this.irfqViewModel.shipTo !== 0 &&
        this.irfqViewModel.shipTo !== null
      ) {
        this.shippingAddressData =
          this.iContactViewModel2.address.companyShippingSiteViewModelList;
        for (const entry of this.shippingAddressData) {
          if (this.latestAddressId !== 0) {
            if (entry.siteId === this.latestAddressId) {
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress =
                entry.addresses.deptAddress;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.streetAddress =
                entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.iDefaultAddressModel.result = true;
              this.irfqViewModel.shipTo = entry.siteId;
              this.isSidePanel = false;
              this.addShippingform = false;
              this.isPartClicked = false;
              this.addressList = false;
              this.isPartsLibrarayClicked = false;
              this.isShip2To = false;
            }
          } else {
            if (entry.siteId === this.irfqViewModel.shipTo) {
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress =
                entry.addresses.deptAddress;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.streetAddress =
                entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.iDefaultAddressModel.result = true;
              this.irfqViewModel.shipTo = entry.siteId;
              this.isSidePanel = false;
              this.addShippingform = false;
              this.isPartClicked = false;
              this.addressList = false;
              this.isPartsLibrarayClicked = false;
              this.isShip2To = false;
            }
          }
        }
      } else {
        this.shippingAddressData =
          this.iContactViewModel2.address.companyShippingSiteViewModelList;
        for (const entry of this.shippingAddressData) {
          if (entry.defaultSite === true) {
            this.iDefaultAddressModel.city = entry.addresses.city;
            this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
            this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
            this.iDefaultAddressModel.country = entry.addresses.country;
            this.iDefaultAddressModel.state = entry.addresses.state;
            this.iDefaultAddressModel.streetAddress =
              entry.addresses.streetAddress;
            this.iDefaultAddressModel.address5 = entry.siteLabel;
            this.iDefaultAddressModel.addressType = entry.siteId;
            this.iDefaultAddressModel.result = true;
            this.irfqViewModel.shipTo = entry.siteId;
            this.isSidePanel = false;
            this.addShippingform = false;
            this.isPartClicked = false;
            this.addressList = false;
            this.isPartsLibrarayClicked = false;
            this.isShip2To = false;
          }
        }
      }
    }
  }
  makeShippingDefault(address,id, e) {
    // console.log("address",address)
    this.dataSendOnCheckAddress = address;
    
    this.checkAddress = e;
    if(this.iContactViewModel2 != undefined){

      this.shippingAddressData =
        this.iContactViewModel2.address.companyShippingSiteViewModelList;
    }
    for (const entry of this.shippingAddressData) {
      if (entry.siteId === id) {
        entry.city = entry.addresses.city;
        entry.deptAddress = entry.addresses.deptAddress;
        entry.postalCode = entry.addresses.postalCode;
        entry.state = entry.addresses.state;
        entry.streetAddress = entry.addresses.streetAddress;
        entry.address5 = entry.siteLabel;
        entry.addressType = entry.siteId;
        entry.defaultSite = true;
        this.irfqViewModel.shipTo = id;
      } else {
        entry.city = entry.addresses.city;
        entry.deptAddress = entry.addresses.deptAddress;
        entry.postalCode = entry.addresses.postalCode;
        entry.state = entry.addresses.state;
        entry.streetAddress = entry.addresses.streetAddress;
        entry.address5 = entry.siteLabel;
        entry.addressType = entry.siteId;
        entry.defaultSite = false;
      }
    }
  }
  editShippingAddress(id: number) {
    this.isSaveAddress = false;
    const data = this.shippingAddressData;
    this.getCountry();
    if (id) {
 
      for (const entry of this.shippingAddressData) {
        if (entry.siteId === id) {
          this.iShippingAddressesModel = entry;
          this.iAddressModel.city = entry.addresses.city;
          this.iAddressModel.stateId = entry.addresses.stateId;
          this.iAddressModel.countryId = entry.addresses.countryId;
          this.iAddressModel.postalCode = entry.addresses.postalCode;
          this.iAddressModel.deptAddress = entry.addresses.deptAddress;
          this.iAddressModel.addressId = entry.addresses.addressId;
          this.iAddressModel.streetAddress = entry.addresses.streetAddress;
          this.iAddressModel.isActive = entry.defaultSite;
          this.iAddressModel.state = entry.companyName;
          this.cuSiteId = entry.siteId;
          this.iAddressModel.address5 = entry.siteLabel;
          this.createShippingForm();
          this.isSidePanel = true;
          this.isShiiping5 = false;
          this.addShippingform = true;
          this.isPartClicked = false;
          this.addressList = false;
          this.isPartsLibrarayClicked = false;
          this.onCountryChange(id);
        }
      }
    }
  }
  getCountry() {
    // if (this.iCountryColl.length === 0) {
      this._masterService.getCountry().subscribe(
        (data2: ICountryViewModel[]) => {
          this.iCountryColl = data2;
          this.defaultCountry = this.iCountryColl.find(
            (m) => m.countryName === "USA"
          );
          this.iCountryProfileColl = data2;
        },
        (error) => () => {
          this._toastr.error(error, "Error!");
        }
      );
    // }
  }
  createShippingForm() {
    if (this.CompanyName !== "" && this.CompanyName !== undefined) {
      this.iAddressModel.state = this.CompanyName;
    }

    this.shippingForm = this._fb.group({
      city: [this.iAddressModel["city"], Validators.required],
      deptAddress: [this.iAddressModel["deptAddress"]],
      postalCode: [this.iAddressModel["postalCode"], Validators.required],
      stateId: [this.iAddressModel["stateId"], Validators.required],
      countryId: [this.iAddressModel["countryId"], Validators.required],
      streetAddress: [this.iAddressModel["streetAddress"], Validators.required],
      siteLabel: [this.iAddressModel["address5"], Validators.required],
      defaultSite: [this.iAddressModel["isActive"]],
      addressId: [this.iAddressModel["addressId"]],
      // companyName: [this.iAddressModel["state"], Validators.required],
      companyName:this.companyInput
    });
  }
  onCountryChange(id) {
    if (id === 0) {
      this._masterService.getState(this.shippingForm.value.countryId).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModel = data2["stateData"];
          this.shippingForm.controls["stateId"].setValue("");
        },
        (error) => () => {
          this._toastr.error(error, "Error!");
        }
      );
    } else {
      this._masterService.getState(this.shippingForm.value.countryId).subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        (data2: IRegionModel[]) => {
          this.iRegionModel = [];
          this.iRegionModel = data2["stateData"];
          // this.shippingForm.controls['stateId'].setValue('');
        },
        (error) => () => {
          this._toastr.error(error, "Error!");
        }
      );
    }
  }
  loggedContactId: number;
  getAddress() {
    this._profileService.getAddress(this.loggedContactId).subscribe(
      (data: any) => {
        // console.log("data.address",data.address)
        if (data.address.companyShippingSiteViewModelList[0].defaultSite){
          this.checkAddress = true;
        }else{
          this.checkAddress= false;
        }
        this.shippingAddressData =
          data.address.companyShippingSiteViewModelList;
            
      if (this.shippingAddressData.length >= 5) {
        this.isShiiping5 = true;
      } else {
        this.isShiiping5 = false;
      }
      },
      (error) => () => {
        this._toastr.error(error, "Error!");
      }
    );
  }
  getAddressFormat(mailingAddressData) {
    let tempAdd: string;
    tempAdd = "";
    if (this.checkEmpty(mailingAddressData.address5)) {
      tempAdd += mailingAddressData.address5 + ", ";
    }

    if (this.checkEmpty(mailingAddressData.address5)) {
      tempAdd += "<br />";
    }
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ", ";
    } else {
      return "N/A";
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ", ";
    }
    // tslint:disable-next-line:max-line-length
    if (
      this.checkEmpty(mailingAddressData.city) &&
      this.checkEmpty(mailingAddressData.state) &&
      this.checkEmpty(mailingAddressData.postalCode)
    ) {
      tempAdd += "<br />";
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ", ";
    }
    if (this.checkEmpty(mailingAddressData.state)) {
      tempAdd += mailingAddressData.state + ", ";
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country)) {
      tempAdd += "<br />" + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return "N/A";
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== "") {
      return true;
    } else {
      return false;
    }
  }
  initShippingAddress() {
    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      deptAddress: '',
      country: '',
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
    this.partGotFromLibraryColl = [];
    this.idForPartGotFromLibraryColl = [];
    this.iPartLibraryModelDetailsColl = [];
  }
  companyInput:string;
  openShippingAddressForm() {
    this.isSidePanel = true;
    this.addShippingform = true;
    this.isPartClicked = false;
    this.addressList = false;
    this.isPartsLibrarayClicked = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.addGenAttachementDiv = false;
    this.dispalyIndividualGrps = false;
    this.initShippingAddress();
    this.createShippingForm();
    this.isViewStandardNdaClicked = false;
    this.isSaveAddress = false;
    this.getState();
    this.getCountry();
   
  }
 
  getState(){
    this._masterService.getState('0').subscribe(
      (data: any) => {
        this.states = data['stateData'];
      },
      error => () => {
        this._rfqService.handleError(error);
      },
  )
 

}
closeContactDrawer() {
  this._rfqService.set(false, "showSidePanel");
  this._rfqService.set(false, "transferRfq");
  this._rfqService.set(true, "messageSentFromRfq");
  this._rfqService.set(false, "messageRfq");
  this._rfqService.set("", "selectContactIdsForMEessage");
  this._rfqService.set("", "selectContactRFQId");
  this._rfqService.set("", "nameOfBuyer");
  this.drawer_OnClose.emit(true);
}
closeAddShippingForm(){
  this.addShippingform = false;
  this.addressList=true;
  
}
isShippingFieldValid(field: string) {
  return this._customValidatorsService.isFieldValid(this.shippingForm, field);
}
inintShippingAddress() {
  this.iAddressModel = {
    address5: '',
    addressId: 0,
    addressType: 0,
    country: '',
    city: '',
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
 initContactViewModel() {
    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true,
      ihde: false
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
      country: '',
      city: '',
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
    this.iDefaultAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      country: '',
      city: '',
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
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      originalContactPictureFile: '',
      contactIdEncrypt: '',
      originalLogoOfCompany: '',
      companyId: 0,
      contactFunction: '',
      contactId: 0,
      createdOn: '',
      isLoginFromVision: false,
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
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };

  }
initRfqPartQuantityViewModel() {
    
  
    this.iShippingAddressModelCYP = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      contactIdEncrypt: '',
      companyId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactFunction: '',
      isLoginFromVision: false,
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
      address: this.iAddressModelCYP,
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
      npsScore: 0,
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
      translated: true,
      ihde: false
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
    this.iDefaultAddressModel = {
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
  this.inintShippingAddress();
  // if (!this.isAddShippingBtnClicked) {
    this.isSaveAddress = true;
    this.isAddShippingBtnClicked = true;
    // && this.isStateValid && this.isCountryValid
  //  console.log("this.shippingForm",this.shippingForm);
   
    if (this.shippingForm.valid ) {
      // console.log("inside valid this.isShiiping5",this.isShiiping5)
      // console.log("this.shippingForm.value",this.shippingForm.value)
      if (this.isShiiping5) {
        this._toastr.error('You have added 5 shipping address', 'Error!');
      } 
      else {

        if (this.shippingForm.value.addressId === null) {
          this.shippingForm.value.addressId = 0;
        }
        this.iAddressModel.addressId = this.shippingForm.value.addressId;
        this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
        this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
        this.iAddressModel.city = this.shippingForm.value.city;
        this.iAddressModel.stateId = this.shippingForm.value.stateId;
        this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
        this.iAddressModel.addressType = 2;
        this.iAddressModel.countryId = this.shippingForm.value.countryId;
        this.iAddressModel.addressType = 2;
        this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
        this.iCompanyShippingSiteViewModel.siteLabel = this.shippingForm.value.siteLabel;
        this.iCompanyShippingSiteViewModel.companyName = this.shippingForm.value.companyName;
        if (this.shippingForm.value.defaultSite === null) {
          this.shippingForm.value.defaultSite = false;
        }
        this._profileService.getAddress(this.loggedContactId).subscribe(
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
            this.iContactViewModel.contactId = this.loggedContactId;
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
                        this.isSidePanel = true;
                        this.isPartClicked = false;
                        if (this.iContactViewModel.result === true) {
                          this.loadAddress();
                          // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
                          // this.closePartDrawer();
                        } else {
                          this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                        }
                      })
                  }
                }
              })
              this._rfqService.setContactModel(this.iAddressModel)
          })
        this.iCompanyShippingSiteViewModel.defaultSite = this.shippingForm.value.defaultSite;
        this.iCompanyShippingSiteViewModel.siteCreationDate =
          '2018-07-26T11:29:23.616Z';
        this.iAddressModel.companyShippingSiteViewModelList.push(
          this.iCompanyShippingSiteViewModel
        );
        this.iContactViewModel.contactId = this.loggedContactId;
        this.iContactViewModel.address = this.iAddressModel;
        this.irfqViewModel.rfqId = this.rfqID;
        if (this.iAddressModel.addressId === 0) {
          this._profileService.addShippingAddress(this.iContactViewModel).subscribe(
            result => {
              this.iContactViewModel = result;
              this.iInfoModelCYP = result;
              if (this.iContactViewModel.result === true) {
                this.latestAddressId = this.iContactViewModel.address.companyShippingSiteViewModelList[0].siteId;
                this.isAddShippingBtnClicked = false;
                this.isSaveAddress = false;
                this.shippingForm.reset();
                this.loadAddress();
                this.addShippingform = false;
                this.addressList = true;
                this._rfqService.set(true, "showSidePanel");
                
                this._toastr.success(this.iContactViewModel.errorMessage, '');
              } else {
                this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
                this.isSaveAddress = false;
              }
            },
            error => {
              this.handleError(error);
            },
            () => {}
          );
        } else {
          this.iAddressModel.addressId = this.shippingForm.value.addressId;
          this.iAddressModel.streetAddress = this.shippingForm.value.streetAddress;
          this.iAddressModel.deptAddress = this.shippingForm.value.deptAddress;
          this.iAddressModel.city = this.shippingForm.value.city;
          this.iAddressModel.stateId = this.shippingForm.value.stateId;
          this.iAddressModel.countryId = this.shippingForm.value.countryId;
          this.iAddressModel.postalCode = this.shippingForm.value.postalCode;
          this.iAddressModel.addressType = 2;
          this.iCompanyShippingSiteViewModel.compId = this.iContactViewModel.companyId;
          this.iCompanyShippingSiteViewModel.siteLabel = this.shippingForm.value.siteLabel;
          this.iCompanyShippingSiteViewModel.companyName = this.shippingForm.value.companyName;
          this.iCompanyShippingSiteViewModel.siteId = this.cuSiteId;
          this.iCompanyShippingSiteViewModel.defaultSite = this.shippingForm.value.defaultSite;
          this.iCompanyShippingSiteViewModel.siteCreationDate =
            '2018-07-26T11:29:23.616Z';
          this.iAddressModel.companyShippingSiteViewModelList.push(
            this.iCompanyShippingSiteViewModel
          );
          this.iContactViewModel.contactId = this.loggedContactId;
          this.iContactViewModel.address = this.iAddressModel;
          this._profileService.UpdateAddress(this.iContactViewModel).subscribe(
            result => {
              this.iContactViewModel = result;
              this._rfqService.setContactModel(this.iAddressModel);
              this.iInfoModelCYP = result;
              this.isSidePanel = true;
              this.isPartClicked = false;
              if (this.iContactViewModel.result === true) {
                this.isAddShippingBtnClicked = false;
                this.shippingForm.reset();
                this.addShippingform = false;
                this.addressList = true;
                 this.loadAddress();
                this._rfqService.set(true, "showSidePanel");
                this._toastr.success(this.iContactViewModel.errorMessage, '');
              } else {
                this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
              }
            },
            error => {
              this.handleError(error);
            },
            () => {}
          );
        }
      }
    } else {
      this._customValidatorsService.validateAllFormFields(this.shippingForm);
    }
  // }

}
handleError(error) {
  if (error.status === 0) {
    this._toastr.warning('Please check connection', 'Warning!');
  } else if (error.status === 400) {
    this._toastr.warning(JSON.stringify(error.error), 'Warning!');
  } else if (error.status === 401) {
    // if (this.statusModalReference !== null && this.statusModalReference !== undefined) {
    //   this.statusModalReference.close();
    // }
    this._toastr.warning('Your session is expired. Please login again to continue.', 'Warning!');
  }
}
loadAddress() {
  const id = this.loggedContactId;
  this._profileService.getAddress(id).subscribe(
    (data: IContactViewModel) => {
      this.iContactViewModel2 = data;
      localStorage.setItem('addressModel', JSON.stringify(this.iContactViewModel2));
      this.iShippingAddressModelCYP = data;
      // this.addDefaultShipping();
      this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
      for (const entry of this.shippingAddressData) {
        // remove Commented
        if (this.irfqViewModel.shipTo !== 0) {
          if (entry.companyName !== '') {
            this.isCompanyPresent = false;
            this.CompanyName = entry.companyName;
          }
          if (this.latestAddressId !== 0) {
            if (entry.addressId === this.latestAddressId) {
              this.iDefaultAddressModel.result = true;
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.irfqViewModel.shipTo = this.latestAddressId;
              this.isShip2To = false;
            }
          } else {
            if (entry.siteId === this.irfqViewModel.shipTo) {
              this.iDefaultAddressModel.result = true;
              this.iDefaultAddressModel.city = entry.addresses.city;
              this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
              this.iDefaultAddressModel.country = entry.addresses.country;
              this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
              this.iDefaultAddressModel.state = entry.addresses.state;
              this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
              this.iDefaultAddressModel.address5 = entry.siteLabel;
              this.iDefaultAddressModel.addressType = entry.siteId;
              this.isShip2To = false;
            }
          }

        } else {
          if (entry.companyName !== '') {
            this.isCompanyPresent = false;
            this.CompanyName = entry.companyName;
          }
          if (entry.defaultSite === true) {
            if (entry.companyName !== '') {
              this.isCompanyPresent = false;
              this.CompanyName = entry.companyName;
            }
            this.iDefaultAddressModel.result = true;
            this.iDefaultAddressModel.city = entry.addresses.city;
            this.iDefaultAddressModel.deptAddress = entry.addresses.deptAddress;
            this.iDefaultAddressModel.postalCode = entry.addresses.postalCode;
            this.iDefaultAddressModel.state = entry.addresses.state;
            this.iDefaultAddressModel.country = entry.addresses.country;
            this.iDefaultAddressModel.streetAddress = entry.addresses.streetAddress;
            this.iDefaultAddressModel.address5 = entry.siteLabel;
            this.iDefaultAddressModel.addressType = entry.siteId;
            this.isShip2To = false;
          }
        }
        if (entry.defaultSite) {
          this.checkAddress = true;
        }
      }
      // console.log("this.shippingAddressData.length",this.shippingAddressData.length);
      
      if (this.shippingAddressData.length >= 5) {
        this.isShiiping5 = true;
      } else {
        this.isShiiping5 = false;
      }
    },
    error => () => {
      this._toastr.error(error, 'Error!');
    }
  );
}

}
