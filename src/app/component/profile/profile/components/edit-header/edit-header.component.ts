import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import {FileUploader} from 'ng2-file-upload';
import { Http, Headers } from '@angular/http';
import { IContactViewModel, ILanguageModel, ICompanyModel, IAddressModel } from '../../../../../core/models/accountModel';
import { environment } from '../../../../../../environments/environment';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { MasterService } from '../../../../../core/services/master/master.service';
import { IIndustryBranchesModel } from '../../../../../core/models/globalMaster';
import { uploadFileNDA } from '../../../../../../constants/url-constant';
const URL = '';
@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnInit {

  // hederPath = '';
  supplierLogoPath = '';
  labelFocus = '';
  isFileUpladed: boolean;
  // isFileUpladed1: boolean;
  profileUploadLogoError = '';
  profileUploadBgError = '';
  defaultAwsPath = '';
  iContactViewModel: IContactViewModel;
  iContactViewModel1: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iCompanyModel1: ICompanyModel;
  iAddressModel: IAddressModel;
  buyerTypeViewModelColl: IIndustryBranchesModel[];
  profileLogoUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  unamePattern = '^[0-9_-]{8,15}$';
  constructor(private _SupplierService: SupplierService, private _profileService: ProfileService, private _toastr: ToastrService,
    private _Http: Http, private _rfqService: RfqService, private _masterService: MasterService) {
    this.initContactViewModel();
    this.uploadProfileLogo();
    // this.uploadProfileBg();
    this.isFileUpladed = false;
    // this.isFileUpladed1 = false;
  }

  ngOnInit() {
    this.getSupplierProfile();
    this.GetCompanyTypesForBuyers();
  }

  initContactViewModel() {
    this.iCompanyModel = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      employeeCountRangeId : 1,
      errorMessage: '',
      isActive: true,
      _3dTourUrl: '',
      name: '',
      companylogo: '',
      employeeCountRange: '',
      services: '',
      companyToleranceId: 0,
      salesStatusId: 0,
      supplierType: '',
      supplierTypeId: 0
    };
    this.iCompanyModel1 = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      employeeCountRangeId : 1,
      employeeCountRange: '',
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
    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      comments: '',
      contactIdEncrypt: '',
      originalContactPictureFile: '',
        originalLogoOfCompany: '',
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
      website: '',
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0 ,
      currentUserRole : [],
      noOfStars: 0,
      isVisionUserRequest:false,
      instagram: ''
    };
    this.iContactViewModel1 = {
      isLike: false,
      accountEmail: '',
      website: '',
      isLoginFromVision: false,
      addressId: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
        originalLogoOfCompany: '',
      comments: '',
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
      company: this.iCompanyModel1,
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

  uploadProfileLogo() {
    this.profileLogoUploader.onAfterAddingFile = (fileItem) => {
        if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg')
          || (fileItem.file.type === 'image/png')) {
          const file = fileItem._file;
          this.UploadFileLogo(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            this.iContactViewModel.contactPictureFile = result['fileName'];
            this.iContactViewModel.originalContactPictureFile = result['fileName'];
            if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
              this.supplierLogoPath = result['privateFileFileName'];
              this.isFileUpladed = false;
            }
          }, error => {
            this._rfqService.handleError(error);
            this.isFileUpladed = false;
          }, () => {
          });
          fileItem.withCredentials = false;
          this.isFileUpladed = true;
          this.profileUploadLogoError = '';
        } else {
          this.profileUploadLogoError = 'Your image must be 150x150 pixels, and a PNG or JPG file only.';
        }
    };
  }

  // uploadProfileBg() {
  //   this.profileBgUploader.onAfterAddingFile = (fileItem) => {
  //     if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg')
  //       || (fileItem.file.type === 'image/png')) {
  //       const file = fileItem._file;
  //       this.upload(file)
  //       .subscribe(res => {
  //         const result = JSON.parse(res['_body']);
  //         this.iContactViewModel.logoOfCompany = result['fileName'];
  //         if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
  //           this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
  //         }
  //         this.isFileUpladed1 = false;
  //       }, error => {
  //         console.log('Error: ', error);
  //         this._toastr.error(error.message, 'Error!');
  //         this.isFileUpladed1 = false;
  //       }, () => {
  //       });
  //       fileItem.withCredentials = false;
  //       this.isFileUpladed1 = true;
  //       this.profileUploadBgError = '';
  //     } else {
  //       this.profileUploadBgError = 'Your image must be 1053x200 pixels, and a PNG or JPG file only.';
  //     }
  //   };
  // }

  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }
  UploadFileLogo(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + '/Upload/UploadFileLogo';
    return this._Http.post(url, input, {
      headers: headers
    });
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  setFocus(flag: string) {
    this.labelFocus = flag;
  }

  checkIfCompanyNameLabelNeeded() {
    return !!this.iContactViewModel.company.name && this.iContactViewModel.company.name !== '';
  }

  checkIfPhoneLabelNeeded() {
    return !!this.iContactViewModel.phoneNo && this.iContactViewModel.phoneNo !== '';
  }

  checkIfCompanyTypeLabelNeeded() {
    return !!this.iContactViewModel.company.supplierType  && this.iContactViewModel.company.supplierType  !== '';
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  supplierTypeId: number = 0;
  getSupplierProfile() {
    const id = this.loggedEncryptId;
      this._profileService.getProfileDetails(id,this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          console.log(this.iContactViewModel.company.supplierTypeId, 'this.iContactViewModel 111');
          this.iContactViewModel1.company.name = (!!result.company) ? result.company.name : '' ;
          this.iContactViewModel1.contactPictureFile = this.iContactViewModel.contactPictureFile;
          this.iContactViewModel.phoneNo = this.iContactViewModel.phoneNo.replace(/[- )(]/g, '');
          this.iContactViewModel1.phoneNo = this.iContactViewModel.phoneNo;
          this.supplierTypeId = this.iContactViewModel.company.supplierTypeId;
           console.log(this.supplierTypeId, 'this.supplierTypeId');
          if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
            this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );

  }

  isNotAllowHeaderSave() {
    if ( ( this.iContactViewModel1.contactPictureFile !== this.iContactViewModel.contactPictureFile) ||
      // (this.iContactViewModel1.logoOfCompany !== this.iContactViewModel.logoOfCompany) ||
      (this.iContactViewModel1.phoneNo !== this.iContactViewModel.phoneNo) ||
      (!!this.iContactViewModel.company && this.iContactViewModel1.company.name !== this.iContactViewModel.company.name) ) {
        if (this.iContactViewModel.phoneNo === '' || this.iContactViewModel.company.name === '') {
          return true;
        } else {
          return false;
        }
    } else {
      return true;
    }
  }
  companyType(compType) {
    this.iContactViewModel.company.supplierTypeId = compType;  
    this.buyerTypeViewModelColl.forEach(element => {
      if(element.industryBranchesId ==  this.iContactViewModel.company.supplierTypeId) {
        this.iContactViewModel.company.supplierType = element.industryBranchesNameEn; 
      }
    }); 
  }
  saveHeader() {
    this.iContactViewModel.contactPictureFile = this.iContactViewModel.originalContactPictureFile; 
    console.log(this.iContactViewModel, 'this.iContactViewModel')
    this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
      result => {
        // console.log('header' , this.iContactViewModel);
        if (result.result === true) {
          this._SupplierService.set(true, 'headerUpdated');
          this._SupplierService.set(true, 'editProfileDrawerDataSaved');
          this._SupplierService.set(true, 'editHeaderDrawerDataSaved');
          this._SupplierService.set(true, 'contactUsDrawerDataSaved');
          this.closeHeaderDrawer();
          // window.location.reload();
        } else {
          this._toastr.error(result.errorMessage, 'Error!');
          // console.log(result.errorMessage);
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  closeHeaderDrawer () {
    this._SupplierService.set(false, 'buyerProfileSidePanel');
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(false, 'editHeaderCancelWarning');
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

  closeEditHeader () {
    this._SupplierService.set(true, 'editHeaderCancelWarning');
 // this.closeHeaderDrawer();
  }

  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != '') {
      this.iContactViewModel.phoneNo = number.replace(/[- )(]/g, '');
      // this.companyProfileForm.patchValue({
      //   'phoneNo': number.replace(/-/g, '')
      // });
    }
  }

  GetCompanyTypesForBuyers() {
    this._masterService.GetCompanyTypesForBuyers().subscribe(
      (data: IIndustryBranchesModel[]) => {
        this.buyerTypeViewModelColl = data['data'];
        console.log(this.buyerTypeViewModelColl, 'buyerTypeViewModelColl')
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
}
