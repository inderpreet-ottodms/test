import { Component, OnInit } from '@angular/core';
import { IContactViewModel, ILanguageModel, ICompanyModel, IAddressModel } from '../../../core/models/accountModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { ConfirmationService } from 'primeng/api';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ConfirmationService]
})
export class ProfileComponent implements OnInit {
  isProfileActive: boolean;
  isContactUsActive: boolean;
  isAboutUsActive: boolean;
  isRatingActive: boolean;
  // hederPath: string;
  isCencel: boolean;
  msgs: string;
  supplierLogoPath: string;
  defaultAwsPath = '';
  iContactViewModel: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  prevPage = '';
  currentRate = 3;
  constructor(private router: Router, private _SupplierService: SupplierService, private _toastr: ToastrService, private _profileService: ProfileService,
    private confirmationService: ConfirmationService , private _rfqService: RfqService) {
      if (this._SupplierService.get('dashboard')) {
        this.isRatingActive = true;
        this.isProfileActive = false;
        this.isContactUsActive = false;
        this.isAboutUsActive = false;
        this._SupplierService.set(false, 'dashboard') ;
      } else {
        this.isAboutUsActive = true;
        this.isProfileActive = false;
        this.isContactUsActive = false;
        this.isRatingActive = false;
      }
    this.closePartDrawer();
    // this.hederPath = 'assets/infosys-public-services-logo.png';
    this.supplierLogoPath = 'assets/company/avatar-manu-basic.svg';
    this.initContactViewModel();
  }

 ngOnInit() {
   this.getSupplierProfile();
 }
 getMap() {
  // initializeMap('manish nagar,Nagpur');
 }
 openProfile() {
   this.isProfileActive = true;
   this.isContactUsActive = false;
   this.isAboutUsActive = false;
   this.isRatingActive = false;
   this.closePartDrawer();
 }
 openContactUs() {
   this.isProfileActive = false;
   this.isContactUsActive = true;
   this.isAboutUsActive = false;
   this.isRatingActive = false;
   this.closePartDrawer();
 }
 openAboutUs() {
   this.isProfileActive = false;
   this.isContactUsActive = false;
   this.isAboutUsActive = true;
   this.isRatingActive = false;
   this.closePartDrawer();
 }
 openRatings() {
   this.isProfileActive = false;
   this.isContactUsActive = false;
   this.isAboutUsActive = false;
   this.isRatingActive = true;
   this.closePartDrawer();
 }

 closePartDrawer () {
   this._SupplierService.set(false, 'isProfileEditActive');
   this._SupplierService.set(false, 'isMailingEditActive');
   this._SupplierService.set(false, 'isShippingEditActive');
   this._SupplierService.set(false, 'isRatingEditActive');
   this._SupplierService.set(false, 'buyerProfileSidePanel');
   this._SupplierService.set(false, 'headerEdit');
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
openHeader() {
  this.closeSidedrawer();
  this._SupplierService.set(true, 'headerEdit');
  this._SupplierService.set(true, 'buyerProfileSidePanel');
  this._SupplierService.set(true, 'editProfileDrawerDataSaved');
}
closeSidedrawer () {
  this._SupplierService.set(false, 'isRatingEditActive');
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



isSidePanel () {
  return this._SupplierService.get('buyerProfileSidePanel');
}
isProfileEditActive() {
  return this._SupplierService.get('isProfileEditActive');
}
isEditMailing() {
  return this._SupplierService.get('isEditMailing');
}

isEditShipping() {
  return this._SupplierService.get('isEditShipping');
}

isEditBuyerContactUs() {
  return this._SupplierService.get('isEditBuyerContactUs');
}
isEditBuyerAboutUs() {
  return this._SupplierService.get('isEditBuyerAboutUs');
}

isMailingEditActive() {
  return this._SupplierService.get('isMailingEditActive');
}
isShippingEditActive() {
  return this._SupplierService.get('isShippingEditActive');
}
isRatingReply() {
  return this._SupplierService.get('isRatingReply');
}
isHeaderEdit() {
  return this._SupplierService.get('headerEdit');
}
isEditPersonalInformation() {
  return this._SupplierService.get('isEditPersonalInformation');
}
 initContactViewModel() {
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
     token: '',
     companyId: 0,
     contactFunction: '',
     contactId: 0,
     createdOn: '',
     emailId: '',
     errorMessage: '',
     facebook: '',
     firstName: '',
     incotermId: 0,
     industry: '',
     industryId: 0,
     isActive: true,
     isAdmin: true,
     isBuyer: true,
     isMailInHtml: true,
     isNotifyByEmail: true,
     languageId: 0,
     lastName : '',
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
     isCapabilitiesFilled: false,
     isCompanyProfileFilled: false,
     npsScore: 0 ,
     currentUserRole : [],
     noOfStars: 0,
     isVisionUserRequest:false,
     instagram: ''
   };
   this.iCompanyModel = {
     companyId: 0,
     description: '',
     employeeCountRange: '',
     dunsNumber: '',
     employeeCountRangeId : 1,
     _3dTourUrl: '',
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
     deptAddress: '',
     country: '',
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
   this.iLanguageModel = {
     charset: '',
     languageAbr: '',
     languageId: 0,
     languageName: '',
     localeCode: '',
     translated: true
   };
 }

 get loggedId() {
   // tslint:disable-next-line:radix
   return parseInt(localStorage.getItem('LoggedId'));
 }


 isHeaderUpdated() {
   if (this._SupplierService.get('headerUpdated') === true) {
     this._SupplierService.set(false, 'headerUpdated');
     this.getSupplierProfileOriginal();
   }
 }
 get loggedEncryptId() {
  return localStorage.getItem('LoggedIdEncript');
}
getSupplierProfileOriginal() {
  const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id,this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
        this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
            localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
          }
        }
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );

}
  getSupplierProfile() {
    const id = this.loggedEncryptId;
      this._profileService.getProfileDetails(id,this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          console.log(result, 'result')
          this._rfqService.set(this.iContactViewModel.companyId, 'companyId');
          this._rfqService.set(this.iContactViewModel.company.name, 'CompanyName');
          if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
            if (localStorage.getItem('userHeaderLogo') !== this.iContactViewModel.contactPictureFile) {
              localStorage.setItem('userHeaderLogo', this.iContactViewModel.contactPictureFile);
            }
          }
          if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
            this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );

  }

 openEditHeaderWarning() {

   this.isCencel = this._SupplierService.get('editHeaderCancelWarning');
   if (this.isCencel === true) {
     this.closeEditHeader();
   }
 }

 closeEditHeader () {
  this.confirmationService.confirm({
    // tslint:disable-next-line:max-line-length
    message: 'You have unsaved information. Are you sure you want to Cancel?',
    header: 'Cancel Changes',
    icon: null,
    accept: () => {
        this.msgs = 'true';
        this.closeHeaderDrawer();
    },
    reject: () => {
       this.msgs = 'false';
       this._SupplierService.set(false, 'editHeaderCancelWarning');
    }
});
}
reloadPageOnContactdrawerClose() {
  if (this._SupplierService.get('editHeaderDrawerDataSaved')) {
    this._SupplierService.set(false, 'editHeaderDrawerDataSaved');
    this.getSupplierProfileOriginal();
  }
  if (this._SupplierService.get('editPersonalInfo')) {
    this._SupplierService.set(false, 'editPersonalInfo');
    this.getSupplierProfileOriginal();
  }
}
// this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
 closeHeaderDrawer () {
  this._SupplierService.set(false, 'buyerProfileSidePanel');
  this._SupplierService.set(false, 'headerEdit');
  this._SupplierService.set(false, 'editHeaderCancelWarning');
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
}

isreloadDashboardComp() {
  let willDoLaterPath = parseInt(localStorage.getItem('willDoLater'));
  let submitRfqCount = parseInt(localStorage.getItem('submitRfqCount'));
  console.log(willDoLaterPath, 'willDoLaterPath')
  if(willDoLaterPath === 0 &&  submitRfqCount === 0){
    this._profileService.getConfigCatData().subscribe(result=>{
      if (result){
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/rfq/buyer']);
        });
      }else{
        this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
          this.router.navigate(['getStarted']);
        });
      }
    });
  }else if(willDoLaterPath === 0 &&  submitRfqCount >= 1) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/buyer/default']);
    });
  } else if(willDoLaterPath === 1 &&  submitRfqCount >= 1) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/buyer/default']);
    });
  } else if(willDoLaterPath === 1 &&  submitRfqCount === 0) {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(['dashboard/buyer/default']);
    });
  }
  }
}
