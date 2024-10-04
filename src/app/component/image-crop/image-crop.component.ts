import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  ElementRef
} from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {
  ImageCroppedEvent,
  ImageTransform
} from 'ngx-image-cropper';
import {
  FileUploader,
  FileUploaderOptions
} from 'ng2-file-upload';
import {
  environment
} from '../../../environments/environment';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  Http,
  Headers
} from '@angular/http';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IContactViewModel,
  ILanguageModel,
  IAddressModel,
  ICompanyModel
} from '../../core/models/accountModel';
import {
  ProfileService
} from '../../core/services/profile/profile.service';
import {
  IManufacturerDashboardViewModel
} from '../../core/models/supplierProfileModel';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';

import { uploadFileNDA } from '../../../constants/url-constant';
const uploadOptions: FileUploaderOptions = {
  allowedMimeType: ['image/jpeg', 'image/png'],
};

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent implements OnInit {

  @ViewChild('content',{static: true}) editModal: TemplateRef < any > ;
  @Output() closeModelEvent = new EventEmitter();
  tempModel: any;
  options: any;
  iContactViewModel: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iAddressModel: IAddressModel;
  iCompanyModel: ICompanyModel;
  isLoader: boolean = false;
  iProfileSetModel: IManufacturerDashboardViewModel;
  public uploaderBanner: FileUploader = new FileUploader(uploadOptions);
  imageFile: any;
  imageBase64: any = "";
  transform: ImageTransform = {};
  canvasRotation = 0;
  scale = 1;

  constructor(private modalService: NgbModal, private _Http: Http, private _rfqService: RfqService, private _profileService: ProfileService, private _SupplierService: SupplierService, private _toastr: ToastrService, ) {}

  ngOnInit() {
    this.openModal();
    this.transform = {
      flipH: false,
      flipV: false,
    }
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
    this.getSupplierProfile();
    this.uploaderBanner.onAfterAddingFile = (fileItem) => {
      this.getBase64(fileItem._file).then(base64 => {
        this.imageBase64 = base64 as string;
      });

    };
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    // console.log("event", event);
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.imageFile = "";
    // show cropper
  }
  loadImageFailed() {
    console.log('Load failed');
}
  openModal() {
    this.tempModel = this.modalService.open(this.editModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  closeCropModel(type) {
    this.isLoader = true;
    if (type === 1) {
      var file = this.dataURLtoFile(this.croppedImage, 'a.png');
      this.upload(file)
        .subscribe(res => {
          const result = JSON.parse(res['_body']);
          this.iContactViewModel.logoOfCompany = result['fileName'];
          this.iContactViewModel.originalLogoOfCompany = result['fileName'];
          this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
            result => {
              if (result.result === true) {
                this.setProfileStatus();
                this.closeModelEvent.emit(true);
                this.tempModel.close();
                this._toastr.success("Background image uploaded", 'Success!');
              } else {
                this._toastr.error(result.errorMessage, 'Error!');
              }
              this.isLoader = false;

            }
          );
        }, error => {
          this._rfqService.handleError(error);
          this.isLoader = false;
        }, () => {
          this.isLoader = false;
        });
    } else {
      this.closeModelEvent.emit(false);
      this.isLoader = false;
      this.tempModel.close();
    }
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime
    });
  }
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
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
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  getSupplierProfile() {
    this._profileService.getProfileDetails(this.loggedEncryptId, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  setProfileStatus() {
    if (this.iContactViewModel.logoOfCompany) {
      this.iProfileSetModel.isCompanyBanner = true;
    }
    this._SupplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          // console.log(result);
        }
      }
    );
  }

  resetCrop() {
    this.scale = 1;
    this.canvasRotation = 0;
    this.transform = {
      flipH:false,
      flipV:false,
      scale:1,
      rotate:0
    };
  }
  clear(){
    this.croppedImage = '';
    this.imageBase64 = '';
    this.imageChangedEvent = null;   
  }
  rotateLeft() {
    // // debugger;
    this.canvasRotation--;
    this.flipAfterRotate();
  }
  rotateRight() {
    // // debugger;
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }
  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }
}
