import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  Http,
  Headers
} from '@angular/http';
import {
  IContactViewModel,
  ILanguageModel,
  ICompanyModel,
  IAddressModel
} from '../../../../../core/models/accountModel';
import {
  environment
} from '../../../../../../environments/environment';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  IManufacturerDashboardViewModel
} from '../../../../../core/models/supplierProfileModel';
import { uploadFileNDA } from '../../../../../../constants/url-constant';
const URL = '';

@Component({
  selector: 'app-edit-header',
  templateUrl: './edit-header.component.html',
  styleUrls: ['./edit-header.component.scss']
})
export class EditHeaderComponent implements OnInit {

  hederPath = '';
  supplierLogoPath = '';
  labelFocus = '';
  isFileUpladed: boolean;
  isFileUpladed1: boolean;
  profileUploadLogoError = '';
  profileUploadBgError = '';
  defaultAwsPath = '';
  iContactViewModel: IContactViewModel;
  iContactViewModel1: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iCompanyModel1: ICompanyModel;
  iAddressModel: IAddressModel;
  iProfileSetModel: IManufacturerDashboardViewModel;
  profileLogoUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  profileBgUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  oldPicture: string;
  oldLogo: string;
  errorLogoMsg: string;
  errorBannerMsg: string;
  phoneNumberlimit: number;
  options: any
  imagename: any;
  showCropModel: boolean = false;
  isButtonClicked: boolean = false;

  @Output () profileChanges = new EventEmitter();


  constructor(private _SupplierService: SupplierService, private _profileService: ProfileService, private _toastr: ToastrService,
    private _Http: Http, private _rfqService: RfqService) {
    this.initContactViewModel();
    this.uploadProfileLogo();
    this.uploadProfileBg();
    this.oldPicture = '';
    this.oldLogo = '';
    this.isFileUpladed = false;
    this.isFileUpladed1 = false;
    this.phoneNumberlimit = 16;

  }

  ngOnInit() {
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      contactId: this.loggedId,
      isCompanyAddress: null,
      isPublishProfile: null
    };
    this.getSupplierProfile();
  }

  initContactViewModel() {
    this.iCompanyModel = {
      companyId: 0,
      description: '',
      employeeCountRange: '',
      _3dTourUrl: '',
      dunsNumber: '',
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
    this.iCompanyModel1 = {
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
      isLoginFromVision: false,
      token: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
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
    this.iContactViewModel1 = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      isLoginFromVision: false,
      contactIdEncrypt: '',
      comments: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
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
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };
  }
  uploadProfileLogo() {
    this.profileLogoUploader.onAfterAddingFile = (fileItem) => {
      ;
      if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg') ||
        (fileItem.file.type === 'image/png')) {
        this.getHeightWidth(fileItem._file, 1);
      } else {
        this.profileUploadLogoError = 'Your image must be 150x150 pixels, and a PNG or JPG file only.';
      }
    };
  }

  uploadProfileBg() {
    this.profileBgUploader.onAfterAddingFile = (fileItem) => {
      ;
      if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg') ||
        (fileItem.file.type === 'image/png')) {
        this.getHeightWidth(fileItem._file, 2);
      } else {
        this.profileUploadBgError = 'Your image must be 1053x200 pixels, and a PNG or JPG file only.';
      }
    };
  }

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
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  getSupplierProfile() {
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
      if (this.iContactViewModel.address.countryId == 92) {
        this.phoneNumberlimit = 10;
      }
      this.iContactViewModel.phoneNo = this.iContactViewModel.phoneNo.replace(/[- )(]/g, '');
      this.oldLogo = this.iContactViewModel.logoOfCompany;
      this.oldPicture = this.iContactViewModel.contactPictureFile;
      this.iContactViewModel1.company.name = (!!this.iContactViewModel.company) ? this.iContactViewModel.company.name : '';
      this.iContactViewModel1.contactPictureFile = this.iContactViewModel.contactPictureFile;
      this.iContactViewModel1.logoOfCompany = this.iContactViewModel.logoOfCompany;
      this.iContactViewModel1.phoneNo = this.iContactViewModel.phoneNo;

      if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
        this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
      }
      if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
        this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
      }
    } else {
      this.getProfileDetails();
    }
  }

  getProfileDetails() {
    this._profileService.getProfileDetails(this.loggedEncryptId, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        if (this.iContactViewModel.address.countryId == 92) {
          this.phoneNumberlimit = 10;
        }
        this.iContactViewModel.phoneNo = result.phoneNo.replace(/[- )(]/g, '');
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this.oldLogo = this.iContactViewModel.logoOfCompany;
        this.oldPicture = this.iContactViewModel.contactPictureFile;
        this.iContactViewModel1.company.name = (!!result.company) ? result.company.name : '';
        this.iContactViewModel1.contactPictureFile = this.iContactViewModel.contactPictureFile;
        this.iContactViewModel1.logoOfCompany = this.iContactViewModel.logoOfCompany;
        this.iContactViewModel1.phoneNo = this.iContactViewModel.phoneNo;

        if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
          this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
        }
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
    if ((this.iContactViewModel1.contactPictureFile !== this.iContactViewModel.contactPictureFile) ||
      (this.iContactViewModel1.logoOfCompany !== this.iContactViewModel.logoOfCompany) ||
      (this.iContactViewModel1.phoneNo !== this.iContactViewModel.phoneNo) ||
      (!!this.iContactViewModel.company && this.iContactViewModel1.company.name !== this.iContactViewModel.company.name)) {
      if (this.iContactViewModel.phoneNo === '' || this.iContactViewModel.company.name === '') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  saveHeader() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      this.iContactViewModel.contactPictureFile = this.iContactViewModel.originalContactPictureFile;
      this.iContactViewModel.logoOfCompany = this.iContactViewModel.originalLogoOfCompany;
      this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
        result => {
          if (result.result === true) {
            this._SupplierService.set(true, 'contactUsDrawerDataSaved');
            this._SupplierService.set(true, 'headerUpdated');
            this.closeHeaderDrawer();
            this.profileChanges.emit(true);
          } else {
            this._toastr.error(result.errorMessage, 'Error!');
            // console.log(result.errorMessage);
          }
          this.setProfileStatus();
          this.isButtonClicked = false;
        },
        error => {
          this.isButtonClicked = false;
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  setProfileStatus() {
    if (this.iContactViewModel.contactPictureFile) {
      this.iProfileSetModel.isCompanyLogo = true;
    }
    if (this.iContactViewModel.logoOfCompany) {
      this.iProfileSetModel.isCompanyBanner = true;
    }
    this._SupplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }
  closeHeaderDrawer() {
    this._SupplierService.set(false, 'supplierSidePanel');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');
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

  closeEditHeader() {
    this._SupplierService.set(true, 'editHeaderCancelWarning');
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  getHeightWidth(file, type) {
    console.log('logo file', file);
    // debugger;
    this.getBase64(file).then(base64 => {
      // debugger;
      const img = new Image();
      img.onload = () => {
        if (type === 1) {
          this.errorLogoMsg = '';
          this.UploadFileLogo(file).subscribe(res => {
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
          }, () => {});
          this.isFileUpladed = true;
          this.profileUploadLogoError = '';
        } else if (type === 2) {
          if (img.height > 10000 || img.width > 10053) {
            this.errorBannerMsg = 'Your image must be 1053x200 pixels.';

          } else {
            this.errorBannerMsg = '';
            this.upload(file)
              .subscribe(res => {
                const result = JSON.parse(res['_body']);
                this.iContactViewModel.logoOfCompany = result['fileName'];
                this.iContactViewModel.originalLogoOfCompany = result['fileName'];
                if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
                  this.hederPath = result['privateFileFileName'];
                }
                this.isFileUpladed1 = false;
              }, error => {
                this._rfqService.handleError(error);
                this.isFileUpladed1 = false;
              }, () => {});
            this.isFileUpladed1 = true;
            this.profileUploadBgError = '';
          }
        }
      };
      // debugger;
      img.src = base64 as string;
    });
  }
  onPaste(event) {
    let number = event.target.value;
    if (number != undefined && number != null && number != '') {
      this.iContactViewModel['phoneNo'] = number.replace(/[- )(]/g, '');
    }
  }
  openCropModel() {
    this.showCropModel = true;
  }
  closeCropModel(e) {
    if (e) {
      this.getProfileDetails();
      this._SupplierService.set(true, 'contactUsDrawerDataSaved');
      this._SupplierService.set(true, 'headerUpdated');
      this.profileChanges.emit(true);
    }
    this.showCropModel = false;
  }
}
