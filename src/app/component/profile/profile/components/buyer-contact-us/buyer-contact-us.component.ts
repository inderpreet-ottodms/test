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
  IContactViewModel,
  IAddressModel
} from '../../../../../core/models/accountModel';
import {
  ToastrService
} from 'ngx-toastr';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-buyer-contact-us',
  templateUrl: './buyer-contact-us.component.html',
  styleUrls: ['./buyer-contact-us.component.scss']
})
export class BuyerContactUsComponent implements OnInit {

  iContactViewModel: IContactViewModel;

  iAddressModel: IAddressModel;
  completeAddress: string;
  constructor(private _SupplierService: SupplierService,
    private _profileService: ProfileService,
    private _toastr: ToastrService, private _rfqService: RfqService) {
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
      comments: '',
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      companyId: 0,
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
      isVisionUserRequest:false,
      instagram: ''
    };

  }

  ngOnInit() {
    // this.getMap();
    this.getProfileDetails();
  }
  getMap() {
    // initializeMap('trimurti nagar,maharashtra,Nagpur');
  }
  isSidePanelOpen() {
    const isOpen = this._SupplierService.get('buyerProfileSidePanel');
    if (isOpen !== null && isOpen !== undefined) {
      return this._SupplierService.get('buyerProfileSidePanel');
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
      this.getProfileDetailsOriginal();
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  getProfileDetailsOriginal() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this.completeAddress = this.iContactViewModel.address.streetAddress + ',' +
          this.iContactViewModel.address.deptAddress + ',' +
          this.iContactViewModel.address.city + ',' +
          this.iContactViewModel.address.state;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getProfileDetails() {
    const id = this.loggedEncryptId;
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          this.completeAddress = this.iContactViewModel.address.streetAddress + ',' +
            this.iContactViewModel.address.deptAddress + ',' +
            this.iContactViewModel.address.city + ',' +
            this.iContactViewModel.address.state;
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
  }
  openSidePanel(page) {
    this._SupplierService.set(false, 'headerEdit');
    // initializeMap(this.completeAddress);
    this._SupplierService.set(true, 'buyerProfileSidePanel');
    if (page === 'isEditBuyerContactUs') {
      this._SupplierService.set(true, 'isEditBuyerContactUs');
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
  mapSource:string = null;
  getAddressFormat(mailingAddressData) {
    if(mailingAddressData != null && mailingAddressData != undefined){
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
    this.mapSource = this.getAddressFormatForMap(mailingAddressData);
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
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

  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      if (val.trim() === '') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

}
