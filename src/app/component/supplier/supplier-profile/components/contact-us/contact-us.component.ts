import { Component, OnInit, Input } from '@angular/core';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { IContactViewModel, IAddressModel } from '../../../../../core/models/accountModel';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  iContactViewModel: IContactViewModel;
  iAddressModel: IAddressModel;
  completeAddress: string;
  constructor(private _SupplierService: SupplierService,
     private _profileService: ProfileService,
      private _toastr: ToastrService, private _rfqService: RfqService) {
        this._SupplierService.set(false, 'contactUsDrawerDataSaved');
        this.completeAddress = '';
      this.iAddressModel = {
        address5: '',
        addressId: 0,
        addressType: 0,
        city: '',
        countryId: 0,
        deptAddress: '',
        errorMessage: '',
        isActive: false,
        postalCode: '',
        country: '',
        showInProfile: true,
        showOnlyStateCity: true,
        state: '',
        stateId: 0,
        streetAddress: '',
        result: false,
        companyShippingSiteViewModelList: []
      };
      this.iContactViewModel = {
        isLike: false,
        accountEmail: '',
        website: '',
        addressId: 0,
        originalContactPictureFile: '',
        originalLogoOfCompany: '',
        contactIdEncrypt: '',
        comments: '',
        isLoginFromVision: false,
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
        npsScore: 0 ,
        currentUserRole : [],
        noOfStars: 0,
        isVisionUserRequest:false,
        instagram: ''
      };
    }

  ngOnInit() {
   // this.getMap();
    this.getProfileDetailsLocally();
  }
  getMap() {
   // initializeMap('trimurti nagar,maharashtra,Nagpur');
  }
  isSidePanelOpen () {
    const isOpen =  this._SupplierService.get('supplierSidePanel');
     if (isOpen !== null && isOpen !== undefined)  {
       return  this._SupplierService.get('supplierSidePanel');
     } else {
       return false;
     }
   }
   get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  reloadPageOndrawerClose() {
    if (this._SupplierService.get('contactUsDrawerDataSaved')) {
      this._SupplierService.set(false, 'contactUsDrawerDataSaved');
      this.getProfileDetails();
      this.mapSource = null;
      this.getProfileDetailsLocally();
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  mapSource:string;
  getProfileDetailsLocally() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
          this.completeAddress = this.iContactViewModel.address.streetAddress + ','
           + this.iContactViewModel.address.deptAddress + ','
          + this.iContactViewModel.address.city + ','
          + this.iContactViewModel.address.state;
          this._SupplierService.set(this.completeAddress, 'CompleteAddress');
          //alert(this.getAddressFormatForMap(this.iContactViewModel.address));
          this.mapSource = this.getAddressFormatForMap(this.iContactViewModel.address);
    } else {
      this._profileService.getProfileDetails(id,this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          this.completeAddress = this.iContactViewModel.address.streetAddress + ','
           + this.iContactViewModel.address.deptAddress + ','
          + this.iContactViewModel.address.city + ','
          + this.iContactViewModel.address.state;
          this._SupplierService.set(this.completeAddress, 'CompleteAddress');
          this.mapSource = this.getAddressFormatForMap(this.iContactViewModel.address);
         // initializeMap(this.completeAddress);
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }

  }
  getAddressFormatForMap(mailingAddressData)
  {
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
      tempAdd += ',';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state) && mailingAddressData.state !== 'Unknown - Do not delete') {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country) && mailingAddressData.country !== 'Unknown') {
      tempAdd += ',' + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }

   getProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id,this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this.completeAddress = this.iContactViewModel.address.streetAddress + ','
         + this.iContactViewModel.address.deptAddress + ','
        + this.iContactViewModel.address.city + ','
        + this.iContactViewModel.address.state;
        this._SupplierService.set(this.completeAddress, 'CompleteAddress');
       // initializeMap(this.completeAddress);
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
   openSidePanel(page) {
    this._SupplierService.set(false, 'headerEdit');
  //  initializeMap(this.completeAddress);
    this._SupplierService.set(true, 'supplierSidePanel');
    this._SupplierService.set(true, 'contactUsEdit');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');
    this._SupplierService.set(false, 'ratingReply');
    if (page === 'companyDescription') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(true, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyEquipment') {
      this._SupplierService.set(true, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyPhotos') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(true, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyDemographics') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(true, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyCertifications') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(true, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
    }
    if (page === 'companyGetInTouch') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(true, 'companyGetInTouch');
    }

  }
  websiteClick(website) {
    if (website !== null) {
      const websitepattern = '^(http[s]?:\/\/)';
      if (!website.match(websitepattern)) {
        website = 'https://' + website;
      }
      window.open(website, '_blank');
    }
  }
  checkEmpty(val) {
    if ( val !== null && val !== undefined && val !== '') {
      if (val.trim() === '') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  isPremium() {
    // if (JSON.parse(localStorage.getItem('IsPremium'))) {
    //   return true;
    // } else {
    //   return false;
    // }
    return  this._profileService.getAccountType();
  }
  getAddressFormat( mailingAddressData ) {
    let tempAdd: string;
    tempAdd = '';
    if ( this.checkEmpty(mailingAddressData.streetAddress) ) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if ( this.checkEmpty(mailingAddressData.deptAddress) ) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if ( this.checkEmpty( mailingAddressData.city ) && this.checkEmpty( mailingAddressData.state ) && this.checkEmpty( mailingAddressData.postalCode )) {
      tempAdd += '<br />';
    }
    if ( this.checkEmpty( mailingAddressData.city )) {
      tempAdd +=  mailingAddressData.city + ', ';
    }
    if ( this.checkEmpty( mailingAddressData.state )) {
      tempAdd +=  mailingAddressData.state + ', ';
    }
    if ( this.checkEmpty( mailingAddressData.postalCode )) {
      tempAdd +=  mailingAddressData.postalCode;
    }
    if ( this.checkEmpty( mailingAddressData.country ) ) {
      tempAdd += '<br />' + mailingAddressData.country;
    }
    if ( this.checkEmpty(tempAdd) ){
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
}
