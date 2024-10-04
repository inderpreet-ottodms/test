import {
  Component, OnInit, ViewChild, TemplateRef,
  Input, Output, EventEmitter,
  OnDestroy
} from '@angular/core';
import { FileUploader, FileUploaderOptions} from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { Http, Headers } from '@angular/http';
import { ProfileModel } from '../../../core/models/profileModel';
import { ApiService } from '../../../__Services/api-service/api.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { AccountService } from '../../../core/services/account/account.service';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { ICountryViewModel, IRegionModel } from '../../../core/models/globalMaster';
import { MasterService } from '../../../core/services/master/master.service';
const uploadOptions: FileUploaderOptions = {
    allowedMimeType: ['image/jpeg', 'image/png'],
};
import { uploadFileNDA } from '../../../../constants/url-constant';
import { AppUtil } from '../../../../app/app.util';
import { BrowserStorageUtil } from '../../../../app/shared/browser.storage.util';
@Component({
  selector: 'app-profile-logo',
  templateUrl: './profile-logo.component.html',
  styleUrls: ['./profile-logo.component.scss'],
  providers: [ApiService]
})
export class ProfileLogoComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: true }) editModal: TemplateRef<any>; // Note: TemplateRef

  @Input('companyProfileLogoFilename') companyProfileLogoFilename;
  @Input('companyProfileLogoUrl') companyProfileLogoUrl;
  @Input('companyDescription') companyDescription;
  @Output() modelCloseEvent = new EventEmitter();
  @Output() openCropModelEvent = new EventEmitter();
  showPageDataLoding:boolean=false;
  modelRef: any;
  errorLogoMsg: string;
  errorBannerMsg: string;
  errorDisMsg: string;
  public uploader: FileUploader = new FileUploader(uploadOptions);
  public uploaderBanner: FileUploader = new FileUploader(uploadOptions);
  profileModel: ProfileModel;
  imageSrc: any = '';
  countryList: ICountryViewModel[];
  stateList: IRegionModel[];
  selectedCountryId: number = 0;
  selectedStateId: number = 0;
  address: string="";
  address2: string="";
  city: string="";
  zip: string="";
  previousZip: string="";
  previousCountryId: number=0;

  constructor(private _toastr: ToastrService, private modalService: NgbModal, private _Http: Http, public rest: ApiService, private rfqService: RfqService, private _accountService: AccountService, private _SupplierService: SupplierService, private _masterService: MasterService) { }

  ngOnInit() {
    this.errorLogoMsg = '';
    this.errorBannerMsg = '';
    this.errorDisMsg = '';
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.getHeightWidth(fileItem._file, 1);
    };
    this.uploaderBanner.onAfterAddingFile = (fileItem) => {
      this.getHeightWidth(fileItem._file, 2);
    };
    this.profileModel = {
      companyId: this.loggedCompanyId,
      contactId: BrowserStorageUtil.getLoogedUserId(),
      companyDescription: '',
      companyProfileLogoFilename: '',
      companyProfileLogoUrl: '',
      companyBackgroundImageFilename: '',
      companyBackgroundImageUrl: '',
      address: {
        countryId: 0,
        stateId: 0,
        state: '',
        country: '',
        streetAddress: '',
        deptAddress: '',
        postalCode: '',
        city: '',
        address5: ''
      },
      result: false,
      errorMessage: '',
    };
    this.getCountryList(); 
    this.modelRef = this.modalService.open(this.editModal, {
      backdrop: 'static',
      size: 'lg'
    });
    this.errorBannerMsg = '';
    this.errorLogoMsg = '';
    this.errorDisMsg = '';
    this.getProfileData();
    this.uploader = new FileUploader(uploadOptions);
    this.uploaderBanner = new FileUploader(uploadOptions);
    this.uploader.onAfterAddingFile = (fileItem) => {
      this.getHeightWidth(fileItem._file, 1);
    };
    this.uploaderBanner.onAfterAddingFile = (fileItem) => {
      this.getHeightWidth(fileItem._file, 2);
    };
  }

  getProfileData() {
    this.profileModel = {
      companyId: this.loggedCompanyId,
      contactId: BrowserStorageUtil.getLoogedUserId(),
      companyDescription: '',
      companyProfileLogoFilename: '',
      companyProfileLogoUrl: '',
      companyBackgroundImageFilename: '',
      companyBackgroundImageUrl: '',
      address: {
        countryId: 0,
        stateId: 0,
        state: '',
        country: '',
        streetAddress: '',
        deptAddress: '',
        postalCode: '',
        city: '',
        address5: ''
      },
      result: false,
      errorMessage: '',
    };

    this.rfqService.getUpdateCompanyProfile(this.loggedCompanyId, this.loggedEncryptId).subscribe(
      res => {
        if (!res.isError) {
          this.profileModel.companyProfileLogoUrl = res.data.companyProfileLogoUrl;
          this.profileModel.companyBackgroundImageUrl = res.data.companyBackgroundImageUrl;
          this.profileModel.companyDescription = res.data.companyDescription;
          this.profileModel.address = res.data.address;
          if (res.data.address.countryId != null && res.data.address.countryId != undefined) {
            this.getStateList(res.data.address.countryId);
            this.selectedCountryId = res.data.address.countryId;
            this.previousCountryId = res.data.address.countryId;
          }
          this.address = res.data.address.streetAddress;
          this.address2 = res.data.address.deptAddress;
          this.city = res.data.address.city;
          this.zip = res.data.address.postalCode;
          this.previousZip = res.data.address.postalCode;
          if (this.companyProfileLogoUrl !== null) {
            this.profileModel.companyProfileLogoUrl = this.companyProfileLogoUrl;
          }
          if (this.companyProfileLogoFilename !== null) {
            this.profileModel.companyProfileLogoFilename = this.companyProfileLogoFilename;
          }
          if (this.companyDescription !== null) {
            this.profileModel.companyDescription = this.companyDescription;
          }
          if (res.data.address.stateId != null && res.data.address.stateId != undefined) {
            this.selectedStateId = res.data.address.stateId;
          }
        }
      }
    );
  }

  get loggedCompanyId() {
    return parseInt(BrowserStorageUtil.getCommpanyId());
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  onChange(file, type) {
    this.getHeightWidth(file[0], type);
  }
  getHeightWidth(file, type) {
    this.getBase64(file).then(base64 => {
      const img = new Image();
       img.onload = () => {
         if (type === 1) {
          this.errorLogoMsg = '';
          this.upload(file, '/Upload/UploadFileLogo').subscribe(res => {
            const result = JSON.parse(res['_body']);
            this.profileModel.companyProfileLogoFilename = result.fileName;
            this.profileModel.companyProfileLogoUrl = result.privateFileFileName;
          });
         
        } else if (type === 2) {
          if (img.height > 200 || img.width > 1053) {
            this.errorBannerMsg = 'Your image must be 1053x200 pixels.';
          } else {
            this.errorBannerMsg = '';
            this.upload(file, uploadFileNDA).subscribe(res => {
              const result = JSON.parse(res['_body']);
              this.profileModel.companyBackgroundImageFilename = result.fileName;
              this.profileModel.companyBackgroundImageUrl = result.privateFileFileName;
            });
          }
        }
      };
      img.src = base64 as string;
    });
  }
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
  }
  upload(fileToUpload: any, urlString: string) {
    const input = new FormData();
    input.append('file', fileToUpload);
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + urlString;
    return this._Http.post(url, input, {
      headers: headers
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
  changeText(e) {
    if (e.textValue.length >= 1 && e.textValue.length <= 4000) {
      this.errorDisMsg = '';
    } else if (e.textValue.length > 4000) {
      this.errorDisMsg = 'Company description exceed the character length.';
    } else if (e.textValue.length == 0) {
      this.profileModel.companyDescription = '';
    }
  }

  closeModel(val) {
    if (val === 1) {
      this.modelCloseEvent.emit(1);
      return ;
    } 
    this.setProfileData();
  }
  isValidated() {
    if (
        AppUtil.isEmptyString(this.address) || 
          AppUtil.isEmptyString(this.selectedCountryId) || 
          this.selectedCountryId < 1 ||
            AppUtil.isEmptyString(this.selectedStateId) || 
            this.selectedStateId < 1 ||
              AppUtil.isEmptyString(this.city) || 
              AppUtil.isEmptyString(this.zip) || 
                AppUtil.isEmptyString(this.profileModel.companyDescription)||
                this.profileModel.companyDescription.length > 4000
              ) {
      return true;
    }
    return false;
  }
  setProfileData() {
    if (this.profileModel.companyDescription == null) {
      this.profileModel.companyDescription = '';
    }
    let address:any={};
    address.streetAddress = this.address.trim() ;
    address.deptAddress =  this.address2.trim() ;
    address.countryId =this.selectedCountryId != 0?this.selectedCountryId : this.selectedCountryId;
    address.stateId =this.selectedStateId != 0?this.selectedStateId : 0;
    address.city = this.city.trim() ;
    address.postalCode = this.zip.trim() != ''?this.zip:this.previousZip;  
    this.profileModel.address=address;
    let iProfileSetModel={};
    iProfileSetModel["contactId"]=BrowserStorageUtil.getLoogedUserId();
    iProfileSetModel["isCompanyDescription"] = AppUtil.isNotEmptyString(this.profileModel.companyDescription) ? true : null;
    iProfileSetModel["isCompanyLogo"] = (this.profileModel.companyProfileLogoUrl) ? true : null;
    iProfileSetModel["isCompanyBanner"] = (this.profileModel.companyBackgroundImageUrl) ? true : null;
    iProfileSetModel["isCompanyAddress"] = (this.address && this.selectedCountryId != 0 && this.selectedStateId != 0 && this.city && this.zip) ? true : null;
   this.showPageDataLoding=true;
    this._SupplierService.setProfileDashBoard(iProfileSetModel).subscribe(
      result => {
        this.rfqService.setUpdateCompanyProfile(this.profileModel).subscribe(
          res => {
            this.showPageDataLoding=false;
            if (!res.isError) {
              this._toastr.success('Your profile has been updated successfully.', 'Success!');
              this._accountService.sendMessage('Buyer');
              this.modelCloseEvent.emit(2);
            } else {
              this._toastr.error(res.messages, 'Error!');
            }
          }
        );
      });
  }
  openCropModel() {
    let tempObj = {
      logFileName: null,
      logFileUrl: null,
      description: null
    };
    if (AppUtil.isNotEmptyString(this.profileModel.companyProfileLogoFilename)) {
      tempObj.logFileName = this.profileModel.companyProfileLogoFilename;
    }
    if (AppUtil.isNotEmptyString(this.profileModel.companyProfileLogoUrl)) {
      tempObj.logFileUrl = this.profileModel.companyProfileLogoUrl;
    }
    if (AppUtil.isNotEmptyString(this.profileModel.companyDescription)) {
      tempObj.description = this.profileModel.companyDescription;
    }
    this.openCropModelEvent.emit(tempObj);
    this.modelRef.close();
  }
  getCountryList() {
    this._masterService.getCountry()
      .subscribe((response: ICountryViewModel[]) => {
        this.countryList = response;
      });
  }
  getStateList(countryId) {
    this._masterService.getState(countryId)
      .subscribe((response: any) => {
        this.stateList = response.stateData;
      });
  }
  ngOnDestroy(){
    this.modelRef.close();
  }
}