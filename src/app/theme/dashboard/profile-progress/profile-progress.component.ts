import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  Router
} from '@angular/router';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { IBasicManufacturerViewModel } from '../../../core/models/profileModel';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { EncryptedContactViewModel } from '../../../core/models/accountModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { IMyAccountViewModel } from '../../../core/models/supplierProfileModel';
import { environment } from "../../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { IpService } from '../../../../app/v2/shared/ip.service';
@Component({
  selector: 'app-profile-progress',
  templateUrl: './profile-progress.component.html',
  styleUrls: ['./profile-progress.component.scss']
})
export class ProfileProgressComponent implements OnInit {

  iBasicManufacturerViewModel: IBasicManufacturerViewModel;
  isStartBtnSet: boolean;
  toShowEdit: boolean;
  toShowProfileModel: boolean;
  btnArray= [
    {text:'Get Started',code:'company_profile'},
    {text:'Set Capabilities',code:'set_capabilities'},
    {text:'Publish Now',code:'publish_now'},
    {text:'Learn More',code:'learn_more'}
  ];
  userAccountType: string;
  isCustomer:boolean=false;
  encryptedContactViewModel: EncryptedContactViewModel;
  showCropModel: boolean = false;
  companyProfileLogoFilename: any = null;
  companyProfileLogoUrl: any = null;
  companyDescription: any = null;
  iMyAccountViewModel: IMyAccountViewModel;
  @Output() profileChangeEvent = new EventEmitter<boolean>();
  isLoader: boolean = false;
  isEmailVerified: string;
  isEligibleForGrowthPackage: any;
  isStarterPackageTaken: any;
  isGrowthPackageTaken: any;
  isStarterPackage: any;
  isGrowthPackage: any;
  ipAddress: string;
  browser: string;
  os: string;
  href: any;

  constructor(private http: HttpClient,private router: Router, private _rfqService: RfqService, private _profileService: ProfileService,private _SupplierService: SupplierService, private ipService: IpService) { 
  }  
  async getIpAddress() {
    this.ipAddress = await this.ipService.getIp();
  }

  ngOnInit() {
    this.browser = window.navigator.userAgent;
    this.os = window.navigator.appVersion
    this.href = this.router.url;
    this.getIpAddress();
    // this.isEmailVerified =localStorage.getItem('isEmailVerified');
    const submitModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    // console.log(submitModel,"submitModel");
    this.href = this.router.url;
    this.isEmailVerified = submitModel.isEmailVerified
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: 'Basic',
      membership: '',
      price: 0,
      paymentMethod: '',
      paymentFrequency: '',
      paymentAmount: 0,
      startDate: '0001-01-01T00:00:00',
      endDate: '0001-01-01T00:00:00',
      autoRenewal: false,
      errorMessage: '',
      result: false,
      pageName: 'Page Title',
      rfqId: 0,
      toAlternateEmailId: ''
    };
    this.encryptedContactViewModel = {
      id: '',
      loggedInId: 0
    };
    this.isStartBtnSet = false;
    this.toShowProfileModel = false;
    this.toShowEdit = false;
    this.userAccountType = localStorage.getItem('AccountType');
    this.iBasicManufacturerViewModel = {
      capabilityId: 0,
      overallPercentage: 0,
      accountSetUpSteps: [],
      isCompanyDescription: false,
      isCompanyLogo: false,
      isCompanyBanner: false,
      isCompanyCapabilities: false,
      isVisitMyRFQ: false,
      contactId: 0,
      isCompanyAddress: false,
      isPublishProfile:null,
      isProfileComplete : false
    };
    this.getProfileList();
    this.getMfGPackageAvailability()
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  getProfileList() {
    this.isLoader = true;
    this._rfqService.getProfileList(this.loggedCompanyId, this.loggedId).subscribe(
      res => {
        // console.log( res );
        if ( !res.isError ) {
          this.iBasicManufacturerViewModel = res.data;
          let accountType = localStorage.getItem('AccountType');
          if(accountType != 'Basic' && accountType != 'Silver') {
            this.iBasicManufacturerViewModel.accountSetUpSteps.pop();
          }
          // let tempBasic = JSON.stringify(res.data);
          for (let list of this.iBasicManufacturerViewModel.accountSetUpSteps) {
            //console.log(num);
            list.showBtn = false;
            list.disabledBtn = false;
            if ( list.status ) {
              list.showEdit = true;
            } else {
              list.showEdit = false;
            }
            if (list.id == 1) {
              list.helpText = 'Add company\'s logo, description and business address.';
            }
            if (list.id == 3) {
              list.helpText = 'Join the Manufacturer Directory.';
              if(( this.iBasicManufacturerViewModel.isProfileComplete == false || this.iBasicManufacturerViewModel.isProfileComplete == null ) && this.iBasicManufacturerViewModel.isPublishProfile == null){
                list.disabledBtn = true;
              }else{
                list.disabledBtn = false;
              // list.helpText = 'View your first RFQ.';
            }
            }

           }
          let index = this.iBasicManufacturerViewModel.accountSetUpSteps.findIndex( x => x.status === false);
          if ( index > -1) {
           this.iBasicManufacturerViewModel.accountSetUpSteps[index].showBtn = true;
          }
          if ( this.iBasicManufacturerViewModel.isCompanyDescription && this.iBasicManufacturerViewModel.isCompanyAddress) {
            this.iBasicManufacturerViewModel.accountSetUpSteps[0].showEdit = true;
          } else {
            this.iBasicManufacturerViewModel.accountSetUpSteps[0].showEdit = false;
          }
        }
        this.isLoader = false;
      },
      error=>{
        this.isLoader = false;
      }
    );
  }
  getProfileFun( val, isEdit ) {

    switch ( val ) {
      case 1: {
              this.toShowProfileModel = true;
              break;
      }
      case 2: {
              this._rfqService.set(true, 'showCapabilityModel');
              break;
      }
      case 3: {
             this.profileChangeEvent.emit(true);
              break;
      }
      case 4: {
                if( this.isEligibleForGrowthPackage === 1 && this.isGrowthPackageTaken === 0 && ( this.isStarterPackageTaken === true || this.isStarterPackageTaken == false)){
                  this.isStarterPackage = true;
                  this.isGrowthPackage = false;
                  localStorage.setItem("isStarterPackage", this.isStarterPackage);
                  localStorage.setItem("isGrowthPackage", this.isGrowthPackage);
                                this.router.navigate(['/packages']);
                }else{
                  this._rfqService.set(true, 'showUpgradModel');
                }
                this.mixPanelTracking("learnMoreProfileComplete")
              break;
      }
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  getSearchFilter() {
    this._rfqService.GetSavedSearchByContact(this.loggedId).subscribe(
      result => {
        if (result.result) {
           let lastItem = [];
           lastItem.push( result.data.pop() );
          this._rfqService.set(lastItem, 'updateSerchModel');
          // console.log('selecteditem' , this.selectedItems);
          this.router.navigate(['/supplier/savedsearch']);
        }
      });
  }
  getNameClass( itemOne , itemTwo, index ) {
    //
    const btnIndex = this.iBasicManufacturerViewModel.accountSetUpSteps.findIndex( x => x.showBtn === true);

    if ( this.checkEmpty(itemTwo) ) {
      if ( itemOne.status ) {
        return 'f-w-100';
      } else if ( (!itemOne.status && !itemTwo.status) || ( btnIndex !== index ) ) {
        return 'gray-color';
      }
    } else {
      if ( itemOne.status ) {
        return 'f-w-100';
      }
    }
    if ( this._rfqService.get('ismyrfqdataback') ) {
      this._rfqService.set(false, 'ismyrfqdataback');
      this.getProfileList();
    }
  }
  checkEmpty( val ) {
    return ( val !== undefined && val !== null && val !== '' ) ? true : false;
  }
  closeModel(e) {
    if ( e === 2) {
      this.getProfileList();
    }
    this.companyProfileLogoFilename = null;
    this.companyProfileLogoUrl = null;
    this.companyDescription = null;
    this.toShowProfileModel = false;
  }
  openCropModel(e){
    this.showCropModel = true;
    this.toShowProfileModel = false;
    if( e.logFileName !== null ){
      this.companyProfileLogoFilename = e.logFileName;
    }
    if( e.logFileUrl !== null ){
      this.companyProfileLogoUrl = e.logFileUrl;
    }
    if( e.description !== null ){
      this.companyDescription = e.description;
    }
  }
  closeCropModel(){
    this.toShowProfileModel = true;
    this.showCropModel = false;
    if( this.companyProfileLogoFilename !== null ){
      this.companyProfileLogoFilename = this.companyProfileLogoFilename;
    }
    if( this.companyProfileLogoUrl !== null ){
      this.companyProfileLogoUrl = this.companyProfileLogoUrl;
    }
    if( this.companyDescription !== null ){
      this.companyDescription = this.companyDescription;
    }
  }

  setSupplierUpgraderequest() {
    this.iMyAccountViewModel.contactId = this.loggedId;
    this.iMyAccountViewModel.companyId = this.loggedCompanyId;

    this._SupplierService.setSupplierUpgraderequest(this.iMyAccountViewModel).subscribe(
      result => {
        
      },
      error => {

      },
      () => {}
    );
  }

  getMfGPackageAvailability(){
  this._SupplierService.getTileAvailability(this.loggedId, this.loggedCompanyId).subscribe(
    (result) => {
      if (result) {
        this.isEligibleForGrowthPackage = result[0].isEligibleForGrowthPackage;
        this.isStarterPackageTaken = result[0].isStarterPackageTaken;
        this.isGrowthPackageTaken= result[0].isGrowthPackageTaken;     
      }
    },
    (error) => {
      console.log("err", error);
    },
    () => {}
  );
}

openGetStartedGuide(){
  window.open(environment.GettingStartedGuideURL)
}

mixPanelTracking(ev) {
      const submitModel = JSON.parse(localStorage.getItem("iContactViewModel"));
      var reqData = {
        "email": localStorage.getItem("User2"),
        "event": ev,
        "host": environment.AppUrl,
        "path": this.href,
        "ip": this.ipAddress,
        "browser": this.browser,
        "os": this.os,
        "supplierName": submitModel.firstName + " " + submitModel.lastName,
       }
      this._rfqService.mixPanelStarter(reqData).subscribe((result: any) => {
        console.log(result);
      });
    }
}
