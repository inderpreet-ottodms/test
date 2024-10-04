import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, observable } from 'rxjs';

import { IviewedProfileViewModel } from '../../../core/models/profileModel';
import {
  IContactViewModel,
  IAddressModel,
  IViewProfileGetPriceAwardPatterView, EncryptedContactViewModel
} from '../../../core/models/accountModel';
import { DataService } from '../data.service';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Injectable()
export class ProfileService {
  data = {
    "numberOfCategory": 0,
    "isOpenRfqCapabilityModel": false
  };
  private openRfqCapabilityModel = new BehaviorSubject<any>(this.data);
  private openSwitchRfqCapabilityModel = new BehaviorSubject<any>(false);
  private openShowBilling = new BehaviorSubject<any>(false);
  moduleUrl: string;
  rfqForm2Enabled: any;
  churnkeyEnabled:any;

  key: any;
  iv: any;
  EncryptedContactViewModel: EncryptedContactViewModel;
  constructor(private _dataService: DataService,
    private router: Router) {
    this.EncryptedContactViewModel = {
      id: '',
      loggedInId: 0
    };
    this.key = CryptoJS.enc.Utf8.parse('7061737323313233');
    this.iv = CryptoJS.enc.Utf8.parse('7061737323313233');
  }

  setOpenRfqCapabilityModel(flag: any) {
    this.openRfqCapabilityModel.next(flag);
  }

  getOpenRfqCapabilityModel(): Observable<any> {
    return this.openRfqCapabilityModel.asObservable();
  }


  setShowBilling(flag: any) {
    this.openShowBilling.next(flag);
  }

  getShowBilling(): Observable<any> {
    return this.openShowBilling.asObservable();
  }

  setopenSwitchRfqCapabilityModel(flag: any) {
    this.openSwitchRfqCapabilityModel.next(flag);
  }

  getopenSwitchRfqCapabilityModel(): Observable<any> {
    return this.openSwitchRfqCapabilityModel.asObservable();
  }
  getAddress(id: number): Observable<IContactViewModel> {
    this.moduleUrl = 'Contact/GetAddresses?ContactId=';
    return this._dataService.getSingle(this.moduleUrl, id);
  }


  addProfileInfo(iContactViewModel: IContactViewModel): Observable<IContactViewModel> {
    this.moduleUrl = 'Account';
    return this._dataService.add(this.moduleUrl, iContactViewModel);
  }

  updateProfileInfo(iContactViewModel: IContactViewModel): Observable<IContactViewModel> {
    this.moduleUrl = 'Contact';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iContactViewModel);
  }

  addShippingAddress(iIContactViewModel: IContactViewModel): Observable<IContactViewModel> {
    this.moduleUrl = 'Contact/InsertProfileAddress';
    return this._dataService.add(this.moduleUrl, iIContactViewModel);
  }


  UpdateAddress(iShippingAddressesModel: IContactViewModel): Observable<IContactViewModel> {
    this.moduleUrl = 'Contact/UpdateAddressProfile';
    return this._dataService.UpdateWithoutId(this.moduleUrl, iShippingAddressesModel);
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return localStorage.getItem('LoggedIdEncript');
  }
  getProfileDetails(id: any, loggedId: any): Observable<any> {
    this.EncryptedContactViewModel.id = id;
    this.EncryptedContactViewModel.loggedInId = loggedId;
    this.moduleUrl = 'Contact/GetContactById';
    return this._dataService.add(this.moduleUrl, this.EncryptedContactViewModel);
  }
  getProfileForLoginDetails(id: any): Observable<any> {
    this.EncryptedContactViewModel.id = id;
    this.moduleUrl = 'Contact/GetContactById';
    return this._dataService.add(this.moduleUrl, this.EncryptedContactViewModel);
  }
  deleteShippingAddess(id: any): Observable<IAddressModel> {
    this.moduleUrl = 'Contact/DeleteShippingAddress?addressId=' + id + '';
    return this._dataService.deletePost(this.moduleUrl, '');
  }
  GetCompanySourcingAdvisor(companyId: number): Observable<any> {
    this.moduleUrl = 'Contact/GetCompanySourcingAdvisor?CompanyId=' + companyId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  setViewProfile(iviewedProfileViewModel: IviewedProfileViewModel): Observable<IviewedProfileViewModel> {
    this.moduleUrl = 'Contact/SetViewProfileByManufacturer';
    return this._dataService.add(this.moduleUrl, iviewedProfileViewModel);
  }
  GetRFQCountGeographicLocation(companyId: number, days: number): Observable<any> {
    this.moduleUrl = 'Contact/GetRFQCountGeographicLocation?companyId=' + companyId + '&days=' + days;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  GetSubmittedRFQCount(contactId: number, rfqId: number): Observable<any> {
    this.moduleUrl = 'Contact/GetSubmittedRFQCount?contactId=' + contactId + '&rfqId=' + rfqId;
    return this._dataService.getAll(this.moduleUrl, '');
  }

  GetStepId(contactId: number): Observable<any> {
    this.moduleUrl = 'Contact/GetSubmittedRFQCount?contactId=' + contactId;
    return this._dataService.getAll(this.moduleUrl, '');
  }
  GetPriceAwardPattern(iViewProfileGetPriceAwardPatterView: IViewProfileGetPriceAwardPatterView): Observable<any> {

    this.moduleUrl = 'Contact/GetPriceAwardPattern';
    return this._dataService.add(this.moduleUrl, iViewProfileGetPriceAwardPatterView);
  }

  GetCompanyProfile(companyName: string, scontactId: number, isBuyer: boolean, LoggedInId: number): Observable<any> {
    this.moduleUrl = 'Public/GetCompanyProfile?CompanyURL=' + companyName +
      '&IsBuyer=' + isBuyer + '&ContactId=' + scontactId + '&LoggedInId=' + LoggedInId;
    return this._dataService.getSingle(this.moduleUrl, '');
  }

  getPaymentToken(loggedInId: string): Observable<any> {
    this.moduleUrl = 'ManufacturerType?id=' + loggedInId;
    return this._dataService.getSingle(this.moduleUrl, '');
  }
  getAccountType() {
    if (localStorage.getItem('AccountType') === 'Basic') {
      return 1;
    } else {
      return 2;
    }
  }

  // Get product Stripe capability
  getStripeProductsCapability(): Observable<any> {
    this.moduleUrl = 'GrowthPackage/GetGrowthPackageProductCapabilities';
    return this._dataService.getAll(this.moduleUrl, '');
  }
  // Save subscribe capability
  stripeHostedPaymentPage(requestData): Observable<any> {
    this.moduleUrl = 'StripeHostedPaymentPages';
    return this._dataService.add(this.moduleUrl, requestData);
  }
  // open starter page subscribe capability
  starterStripeHostedPaymentPage(requestData): Observable<any> {
    this.moduleUrl = 'StripeStarterTrialHostedPaymentPages';
    return this._dataService.add(this.moduleUrl, requestData);
  }

  // UpDate PaymentPage Status
  updatePaymentPage(requestData): Observable<any> {
    this.moduleUrl = 'StripeHostedPaymentPages/UpdateStripeHostedPaymentPageSuccessStatus';
    return this._dataService.add(this.moduleUrl, requestData);
  }


  encrypt(input: any) {
    // console.log("input-------------->",input)
    if (input !== null) {
      const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), this.key, {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // console.log("encrypted",encrypted)
      return encrypted;
    }
  }
  decrypt(input: any) {
    if (input !== null) {
      const decrypted = CryptoJS.AES.decrypt(input, this.key, {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      const orstr = decrypted.toString(CryptoJS.enc.Utf8);
      return orstr;
    }
  }

  getConfigCatData(): Observable<any> {
    return new Observable((observer) => {
      if (this.rfqForm2Enabled !== undefined) {
        observer.next(this.rfqForm2Enabled);
        return;
      }
      this._dataService.getAll("FeatureFlag?key=isNewBuyerFormEnabled&email=" + localStorage.getItem('User2')).
        subscribe(
          configCatData => {
            this.rfqForm2Enabled = Boolean(configCatData["isFeatureOn"]);
            observer.next(this.rfqForm2Enabled);
          },
          error => {
            observer.next(this.rfqForm2Enabled);
          });
    });
  }
  getStripePriceData(): Observable<any> {
    this.moduleUrl = 'StripeCustomerPortal/GetStripePrice';
    return this._dataService.getAll(this.moduleUrl, '');
  }
  redirectToNewBuyer(url, parameter = "") {
    if (this.rfqForm2Enabled !== undefined) {
      if(this.rfqForm2Enabled){
        if(parameter){
        parameter="?"+parameter
      }
      url="rfq/buyer"+parameter;
    }
    this.router.navigateByUrl(url);
      return;
    }
    this._dataService.getAll("FeatureFlag?key=isNewBuyerFormEnabled&email=" + localStorage.getItem('User2')).
      subscribe(
        configCatData => {
          this.rfqForm2Enabled = Boolean(configCatData["isFeatureOn"]);;
          if (this.rfqForm2Enabled) {
            if(this.rfqForm2Enabled){
              if(parameter){
              parameter="?"+parameter
            }
            url="rfq/buyer"+parameter;
          }
        }
          this.router.navigateByUrl(url);
          return;
        },
        error => {
        });
  }
  getMFGChurnkey(): Observable<any> {
    return new Observable((observer) => {
      if (this.churnkeyEnabled !== undefined) {
        observer.next(this.churnkeyEnabled);
        return;
      }
      this._dataService.getAll("FeatureFlag?key=mfg_churnkey&email=" + localStorage.getItem('User2')).
        subscribe(
          configCatData => {
            this.churnkeyEnabled = Boolean(configCatData["isFeatureOn"]);
            observer.next(this.churnkeyEnabled);
          },
          error => {
            observer.next(this.churnkeyEnabled);
          });
    });
  }
  
}
