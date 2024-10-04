import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Headers,
  Http
} from '@angular/http';
import {
  FileUploader
} from 'ng2-file-upload';
import {
  ToastrService
} from 'ngx-toastr';
import { uploadFileNDA } from '../../../../../../constants/url-constant';
import {
  IAboutUsViewModel,
  ICertificationViewModel,
  IEquipmentViewModel,
  ILanguageViewModel,
  IManufacturerDashboardViewModel,
  ISpecialFilesViewModel,
  IcompanyCertificateViewModel
} from '../../../../../core/models/supplierProfileModel';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  CustomValidatorService
} from '../../../../../core/services/validator/custom-validator.service';

import {
  DragulaService
} from 'ng2-dragula';
import {
  ConfirmationService
} from 'primeng/api';
import {
  environment
} from '../../../../../../environments/environment';
import {
  I3dTourViewModel,
  ICompanyModel,
  IContactViewModel,
  ILanguageModel,
  IVideoModel
} from '../../../../../core/models/accountModel';
import {
  EmployeesCountRangeViewModel,
  SupplierTypeViewModel
} from '../../../../../core/models/globalMaster';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
const URL = '';



@Component({
  selector: 'app-edit-about-us',
  templateUrl: './edit-about-us.component.html',
  styleUrls: ['./edit-about-us.component.scss'],
  providers: [ConfirmationService]
})
export class EditAboutUsComponent implements OnInit {

  model: any;
  certificateUploader1: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader2: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader3: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader4: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader5: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader6: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader7: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader8: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader9: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });
  certificateUploader10: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  equipmentUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  iAboutUsViewModel: IAboutUsViewModel;
  iEquipmentViewModel: IEquipmentViewModel;
  iCompanyViewModel: ICompanyModel;
  iContactViewModel: IContactViewModel;
  labelFocus: string;
  iSupplierTypeViewModel: SupplierTypeViewModel;
  isCompanyDesError: boolean;
  equipmentForm: FormGroup;
  isEqupimentFormActive: boolean;

  gallaryItemUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  companyDescriptionForm: FormGroup;
  companyVideoForm: FormGroup;
  companyVideoForm1: FormGroup;
  iSpecialFilesViewModel: ISpecialFilesViewModel;
  iSpecialFilesViewModelColl: ISpecialFilesViewModel[];
  isFileUpladed: boolean;
  isFileUpladed1: boolean;
  isFileUpladed2: boolean;
  isFileUpladed3: boolean;
  isFileUpladed4: boolean;
  isFileUpladed5: boolean;
  isFileUpladed6: boolean;
  isFileUpladed7: boolean;
  isFileUpladed8: boolean;
  isFileUpladed9: boolean;
  isFileUpladed10: boolean;
  isLoder: boolean;
  compId: number;
  specialFileCount: number;
  isRenameMode: boolean;
  renameModeObj: ISpecialFilesViewModel;
  defaultAwsPath = 'https://s3.us-east-2.amazonaws.com/mfg.mp2020/';
  uploadAnother: boolean;

  certificateViewModelList: ICertificationViewModel[];
  iCertificationViewModelColl: ICertificationViewModel[];
  iCertificationViewModelCollbycompany: ICertificationViewModel[];
  certificatesettings = {};
  CertificationselectedItems = [];
  CertificationselectedItems2 = [];
  CertificationselectedItems3 = [];
  CertificationselectedItems4 = [];
  CertificationselectedItems5 = [];
  CertificationselectedItems6 = [];
  CertificationselectedItems7 = [];
  CertificationselectedItems8 = [];
  CertificationselectedItems9 = [];
  CertificationselectedItems10 = [];

  certificationForm: FormGroup;
  firstCertificate: number;
  secondCertificate: number;
  thirdCertificate: number;
  fourthCertificate: number;
  fifthCertificate: number;
  sixthCertificate: number;
  seventhCertificate: number;
  eightCertificate: number;
  ninethCertificate: number;
  tenthCertificate: number;
  secondCertificateDiv: boolean;
  thirdCertificateDiv: boolean;
  fourthCertificateDiv: boolean;
  fifthCertificateDiv: boolean;
  sixthCertificateDiv: boolean;
  seventhCertificateDiv: boolean;
  eightCertificateDiv: boolean;
  ninethCertificateDiv: boolean;
  tenthCertificateDiv: boolean;
  addSecondCertificateDiv: boolean;
  addThirdCertificateDiv: boolean;
  addFouthCerftificateDiv: boolean;
  addFifthCerftificateDiv: boolean;
  addSixthCerftificateDiv: boolean;
  addSeventhCerftificateDiv: boolean;
  addEightCerftificateDiv: boolean;
  addNinethCerftificateDiv: boolean;
  addTenthCerftificateDiv: boolean;
  hasBaseDropZoneOver = false;

  certificateId1: number;
  certificateDate1: Date;
  certificateAttacghmentFileName1: string;

  certificateId2: number;
  certificateDate2: Date;
  certificateAttacghmentFileName2: string;
  certificateId3: number;
  certificateDate3: Date;
  certificateAttacghmentFileName3: string;
  certificateId4: number;
  certificateDate4: Date;
  certificateAttacghmentFileName4: string;
  certificateId5: number;
  certificateDate5: Date;
  certificateAttacghmentFileName5: string;

  certificateId6: number;
  certificateDate6: Date;
  certificateAttacghmentFileName6: string;
  certificateId7: number;
  certificateDate7: Date;
  certificateAttacghmentFileName7: string;
  certificateId8: number;
  certificateDate8: Date;
  certificateAttacghmentFileName8: string;
  certificateId9: number;
  certificateDate9: Date;
  certificateAttacghmentFileName9: string;

  certificateId10: number;
  certificateDate10: Date;
  certificateAttacghmentFileName10: string;

  isITARCertificate1Selected: boolean;
  isITARCertificate2Selected: boolean;
  isITARCertificate3Selected: boolean;
  isITARCertificate4Selected: boolean;
  isITARCertificate5Selected: boolean;
  isITARCertificate6Selected: boolean;
  isITARCertificate7Selected: boolean;
  isITARCertificate8Selected: boolean;
  isITARCertificate9Selected: boolean;
  isITARCertificate10Selected: boolean;

  icompanyCertificateViewModel: IcompanyCertificateViewModel;
  icompanyCertificateViewModelColl: IcompanyCertificateViewModel[];



  iLanguageViewModel: ILanguageViewModel;
  iLanguageViewModelColl: ILanguageViewModel[];
  iAboutUsModelColl: IAboutUsViewModel[];
  iAboutUsModel: IAboutUsViewModel;
  iLanguageModel: ILanguageModel;
  iLanguageModelColl: ILanguageModel[];
  iLanguageModelSecondLangColl: ILanguageModel[];
  iLanguageModelThirdLangColl: ILanguageModel[];
  iLanguageModelFourthLangColl: ILanguageModel[];
  iLanguageModelFifthLangColl: ILanguageModel[];
  supplierTypeViewModel: SupplierTypeViewModel;
  supplierTypeViewModelColl: SupplierTypeViewModel[];
  employeesCountRangeViewModel: EmployeesCountRangeViewModel;
  employeesCountRangeViewModelColl: EmployeesCountRangeViewModel[];
  deleteEquipmentCount = 0;


  addSecondLanguageDiv: boolean;
  addThirdLanguageDiv: boolean;
  addFourthLanguageDiv: boolean;
  addFifthLanguageDiv: boolean;

  secondLanguageDiv: boolean;
  thirdLanguageDiv: boolean;
  fourthLanguageDiv: boolean;
  fifthLanguageDiv: boolean;

  isDemographicDetailsBtnClicked: boolean;

  firstLanguage: string;
  secondLanguage: string;
  thirdLanguage: string;
  fourthLanguage: string;
  fifthLanguage: string;

  firstLanguageId: number;
  secondLanguageId: number;
  thirdLanguageId: number;
  fourthLanguageId: number;
  fifthLanguageId: number;

  selectedLanguageId: number[];

  // form declaration
  demographicsForm: FormGroup;

  isSupplierTypeValid: boolean;
  EmailId: string;
  maxPhotoLimit: number;
  iserror: boolean;

  _3dTourUrl: FormArray;
  _videosUrl: FormArray;
  i3dTourViewModel: I3dTourViewModel;
  _3dtourIndex: any;
  _3dtourIndex1: any;
  iProfileSetModel: IManufacturerDashboardViewModel;
  photoIds: number[];
  _videoList: IVideoModel[];
  tempVideoModelList: IVideoModel[] = [];

  equipmentFile: any = [];
  toShowEquipmentFile: boolean = false;

  isButtonClicked: boolean = false;

  @Output () profileChanges = new EventEmitter();
  status: any= false;
  onlySpace: boolean = false;

  constructor(
    private _SupplierService: SupplierService,
    private _masterService: MasterService,
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _profileService: ProfileService,
    private _customValidatorsService: CustomValidatorService,
    private _rfqService: RfqService,
    private _Http: Http,
    private confirmationService: ConfirmationService,
    private dragulaService: DragulaService
  ) {

    this.EmailId = localStorage.getItem('User2');
    this.deleteEquipmentCount = 0;
    this.isLoder = true;
    this.iserror = true;
    this.isCompanyDesError = false;
    this.uploadGallaryItem1();
    this.uploadGallaryItem2();
    this.uploadGallaryItem3();
    this.uploadGallaryItem4();
    this.uploadGallaryItem5();
    this.uploadGallaryItem6();
    this.uploadGallaryItem7();
    this.uploadGallaryItem8();
    this.uploadGallaryItem9();
    this.uploadGallaryItem10();
    this.uploadEquipmentFile();
    this.isEqupimentFormActive = true;
    this.iEquipmentViewModel = {
      createDate: new Date(),
      equipmentId: 0,
      equipmentText: '',
      statusId: 0,
      tagSourceId: false,
      updateDate: new Date(),
      isDeleted: false,
      isFile: false
    };
    this.iAboutUsViewModel = {
      cageCode: '',
      _3dTourUrl: '',
      companyId: 0,
      createdDate: new Date(),
      companyType: '',
      description: '',
      dunsNumber: '',
      employeeCountRangeId: 0,
      equipments: [],
      errorMessage: '',
      languages: [],
      name: '',
      result: false,
      specialFiles: [],
      contactId: 0,
      supplierType: this.supplierTypeViewModel,
      employeeCountRange: '',
      isBlackListed: false,
      isFollowing: false,
      companyURL: '',
      manufacturingLocation: '',
      isBuyer: false,
      _3dTourUrlList: [],
    };
    this.iCompanyViewModel = {
      companyId: 0,
      description: '',
      dunsNumber: '',
      employeeCountRange: '',
      _3dTourUrl: '',
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
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      comments: '',
      isLoginFromVision: false,
      contactIdEncrypt: '',
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
      expiration: null,
      currentPassword: '',
      newPassword: '',
      isRFQCreated: false,
      grantType: '',
      refreshToken: '',
      googleImageUrl: '',
      isVarified: false,
      isCapabilitiesFilled: false,
      isCompanyProfileFilled: false,
      npsScore: 0,
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };
    this.uploadGallaryItem();
    this.isFileUpladed = false;
    this.iSpecialFilesViewModelColl = [];
    this.compId = this._SupplierService.get('companyId');
    this.specialFileCount = 0;
    this.isRenameMode = false;
    this.uploadAnother = false;
    this.labelFocus = 'no';
    this.iSupplierTypeViewModel = {
      blockUsersiteSelection: false,
      industryId: 0,
      supplierTypeId: 0,
      supplierTypeName: '',
      supplierTypeNameEn: ''
    };
    this.iAboutUsModel = {
      equipments: [],
      specialFiles: [],
      companyId: 0,
      _3dTourUrl: '',
      name: '',
      description: '',
      dunsNumber: '',
      employeeCountRangeId: 0,
      createdDate: null,
      cageCode: '',
      companyType: '',
      languages: [],
      errorMessage: '',
      result: false,
      contactId: 0,
      supplierType: this.iSupplierTypeViewModel,
      employeeCountRange: '',
      isBlackListed: false,
      isFollowing: false,
      companyURL: '',
      manufacturingLocation: '',
      isBuyer: false,
      _3dTourUrlList: [],
    };



    this.iCertificationViewModelColl = [];

    this.certificateViewModelList = [];
    this.iCertificationViewModelCollbycompany = [];
    this.firstCertificate = 0;
    this.secondCertificate = 0;
    this.thirdCertificate = 0;
    this.fourthCertificate = 0;
    this.fifthCertificate = 0;

    this.sixthCertificate = 0;
    this.seventhCertificate = 0;
    this.eightCertificate = 0;
    this.ninethCertificate = 0;
    this.tenthCertificate = 0;

    this.secondCertificateDiv = false;
    this.thirdCertificateDiv = false;
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.sixthCertificateDiv = false;
    this.seventhCertificateDiv = false;
    this.eightCertificateDiv = false;
    this.ninethCertificateDiv = false;
    this.tenthCertificateDiv = false;

    this.addSecondCertificateDiv = true;
    this.addThirdCertificateDiv = false;
    this.addFouthCerftificateDiv = false;
    this.addFifthCerftificateDiv = false;
    this.addSixthCerftificateDiv = false;
    this.addSeventhCerftificateDiv = false;
    this.addEightCerftificateDiv = false;
    this.addNinethCerftificateDiv = false;
    this.addTenthCerftificateDiv = false;

    this.firstCertificate = 0;
    this.secondCertificate = 0;
    this.thirdCertificate = 0;
    this.fourthCertificate = 0;
    this.fifthCertificate = 0;
    this.sixthCertificate = 0;
    this.seventhCertificate = 0;
    this.eightCertificate = 0;
    this.ninethCertificate = 0;
    this.tenthCertificate = 0;

    this.secondCertificateDiv = false;
    this.thirdCertificateDiv = false;
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.sixthCertificateDiv = false;
    this.seventhCertificateDiv = false;
    this.eightCertificateDiv = false;
    this.ninethCertificateDiv = false;
    this.tenthCertificateDiv = false;

    this.addSecondCertificateDiv = true;
    this.addThirdCertificateDiv = true;
    this.addFouthCerftificateDiv = true;
    this.addFifthCerftificateDiv = true;
    this.addSixthCerftificateDiv = true;
    this.addSeventhCerftificateDiv = true;
    this.addEightCerftificateDiv = true;
    this.addNinethCerftificateDiv = true;
    this.addTenthCerftificateDiv = true;
    this.isFileUpladed = false;

    this.certificateDate1 = null;
    this.certificateId1 = 0;
    this.certificateAttacghmentFileName1 = '';
    this.certificateDate2 = null;
    this.certificateId2 = 0;
    this.certificateAttacghmentFileName2 = '';
    this.certificateDate3 = null;
    this.certificateId3 = 0;
    this.certificateAttacghmentFileName3 = '';
    this.certificateDate4 = null;
    this.certificateId4 = 0;
    this.certificateAttacghmentFileName4 = '';
    this.certificateDate5 = null;
    this.certificateId5 = 0;
    this.certificateAttacghmentFileName5 = '';

    this.certificateDate6 = null;
    this.certificateId6 = 0;
    this.certificateAttacghmentFileName6 = '';
    this.certificateDate7 = null;
    this.certificateId7 = 0;
    this.certificateAttacghmentFileName7 = '';
    this.certificateDate8 = null;
    this.certificateId8 = 0;
    this.certificateAttacghmentFileName8 = '';
    this.certificateDate9 = null;
    this.certificateId9 = 0;
    this.certificateAttacghmentFileName9 = '';
    this.certificateDate10 = null;
    this.certificateId10 = 0;
    this.certificateAttacghmentFileName10 = '';

    this.isITARCertificate1Selected = false;
    this.isITARCertificate2Selected = false;
    this.isITARCertificate3Selected = false;
    this.isITARCertificate4Selected = false;
    this.isITARCertificate5Selected = false;
    this.isITARCertificate6Selected = false;
    this.isITARCertificate7Selected = false;
    this.isITARCertificate8Selected = false;
    this.isITARCertificate9Selected = false;
    this.isITARCertificate10Selected = false;

    this.initCertificateModel();


    this.supplierTypeViewModel = {
      supplierTypeId: 0,
      supplierTypeName: '',
      supplierTypeNameEn: '',
      industryId: 0,
      blockUsersiteSelection: false
    };
    this.iLanguageViewModel = {
      languageId: 0,
      languageName: '',
      languageAbr: '',
      charset: '',
      localeCode: '',
      hide: false,
      translated: false,
      errorMessage: '',
      result: false
    };

    this.iLanguageViewModelColl = [];


    this.addSecondLanguageDiv = true;
    this.addThirdLanguageDiv = false;
    this.addFourthLanguageDiv = false;
    this.addFifthLanguageDiv = false;

    this.secondLanguageDiv = false;
    this.thirdLanguageDiv = false;
    this.fourthLanguageDiv = false;
    this.fifthLanguageDiv = false;

    this.isDemographicDetailsBtnClicked = false;

    this.firstLanguageId = 0;
    this.secondLanguageId = 0;
    this.thirdLanguageId = 0;
    this.fourthLanguageId = 0;
    this.fifthLanguageId = 0;

    this.selectedLanguageId = [];
    this.isSupplierTypeValid = false;
    this.i3dTourViewModel = {
      company3dtourId: null,
      companyId: this.loggedCompanyId,
      _3dTourUrl: '',
      title: '',
      description: '',
      isDeleted: false,
      errorMessage: '',
      result: false,
    };

    // dragulaService.drop.subscribe((value: any[]) => {
    //   this.onDropModel(value.slice(1));
    // });
  }

  private onDropModel(args: any): void {
    let [el, target, source] = args;
    let elem = target.children;
    this.photoIds = [];
    for (let index = 0; index < elem.length; index++) {
      this.photoIds.push(elem[index].dataset.messageId);
    }
    this.setPhotoSequence();
    console.log(target);

  }

  initCertificateModel() {
    this.icompanyCertificateViewModel = {
      auditor: '',
      certificatesId: 0,
      companyCertificatesId: 0,
      companyId: 1274068,
      creationContactId: 0,
      creationDate: null,
      endDate: null,
      errorMessage: '',
      fileId: 0,
      fileName: '',
      modifiedDate: null,
      modifiedStatusBuyerDate: null,
      recordOriginId: 0,
      refNumber: 0,
      renewDate: null,
      renewReminderDate: null,
      renewReminderSentDate: null,
      result: false,
      reviewed: false,
      reviewedContactId: 0,
      reviewedDate: null,
      startDate: null,
      statusBuyerFlag: 0,
      statusBuyerModifiedBy: 0,
      statusId: 0
    };
  }
  uploadEquipmentFile() {

    this.equipmentUploader.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed1 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            let result = JSON.parse(res['_body']);
            let fileName = result['fileName'];
            let tempObj: IEquipmentViewModel = {
              createDate: new Date(),
              equipmentId: 0,
              equipmentText: fileName,
              statusId: 0,
              tagSourceId: false,
              updateDate: new Date(),
              isDeleted: false,
              isFile: true
            };
            // this.iAboutUsViewModel.equipments.push(tempObj);
            this.equipmentFile.push(tempObj);
            // this.certificateAttacghmentFileName1 = fNmae;
            this.isFileUpladed1 = false;
          }, error => {
            this.isFileUpladed1 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed1 = false;
      }
    };
  }
  uploadGallaryItem1() {

    this.certificateUploader1.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed1 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName1 = fNmae;
            this.isFileUpladed1 = false;
          }, error => {
            this.isFileUpladed1 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed1 = false;
      }
    };
  }
  uploadGallaryItem2() {

    this.certificateUploader2.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed2 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName2 = fNmae;
            this.isFileUpladed2 = false;
          }, error => {
            this.isFileUpladed2 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed2 = false;
      }
    };
  }
  uploadGallaryItem3() {

    this.certificateUploader3.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed3 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName3 = fNmae;
            this.isFileUpladed3 = false;
          }, error => {
            this.isFileUpladed3 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed3 = false;
      }
    };
  }
  uploadGallaryItem4() {

    this.certificateUploader4.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed4 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName4 = fNmae;
            this.isFileUpladed4 = false;
          }, error => {
            this.isFileUpladed4 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed4 = false;
      }
    };
  }
  uploadGallaryItem5() {

    this.certificateUploader5.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed5 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName5 = fNmae;
            this.isFileUpladed5 = false;
          }, error => {
            this.isFileUpladed5 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed5 = false;
      }
    };
  }
  uploadGallaryItem6() {

    this.certificateUploader6.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed6 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName6 = fNmae;
            this.isFileUpladed6 = false;
          }, error => {
            this.isFileUpladed6 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed6 = false;
      }
    };
  }
  uploadGallaryItem7() {

    this.certificateUploader7.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed7 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName7 = fNmae;
            this.isFileUpladed7 = false;
          }, error => {
            this.isFileUpladed7 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed7 = false;
      }
    };
  }
  uploadGallaryItem8() {

    this.certificateUploader8.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed8 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName8 = fNmae;
            this.isFileUpladed8 = false;
          }, error => {
            this.isFileUpladed8 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed8 = false;
      }
    };
  }
  uploadGallaryItem9() {

    this.certificateUploader9.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed9 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName9 = fNmae;
            this.isFileUpladed9 = false;
          }, error => {
            this.isFileUpladed9 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed9 = false;
      }
    };
  }
  uploadGallaryItem10() {

    this.certificateUploader10.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed10 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            this.certificateAttacghmentFileName10 = fNmae;
            this.isFileUpladed10 = false;
          }, error => {
            this.isFileUpladed10 = false;
            this._rfqService.handleError(error);
          }, () => {});
        fileItem.withCredentials = false;
      } else {
        this._toastr.error('Please attached PDF files only', 'Error!');
        this.isFileUpladed10 = false;
      }
    };
  }

  ngOnInit() {
    this.photoIds = [];
    this.iProfileSetModel = {
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: null,
      isCompanyCapabilities: null,
      isPublishProfile: null,
      isCompanyAddress: null,
      contactId: this.loggedId
    };
    this.delete3Dtour();
    this.delete3Dtour1();
    switch (this.isPremium()) {
      case 1:
        this.maxPhotoLimit = 6;
        break;

      case 2:
        this.maxPhotoLimit = 15;
        break;
    }
    this.getProfileDetailsLocally();
    if (this.iscompanyDescription()) {
      this.createCompanyDescriptionForm();
    }
    if (this.iscompanyVideos()) {
      this.createcompanyVideoForm();
    }
    if (this.iscompanyVideos1()) {
      this.createcompanyVideoForm1();
    }

    if (this.iscompanyDemographics()) {
      this.getLanguages();
      this.getCompanytypes();
      this.getEmployeeRange();
    }
    if (this.iscompanyCertifications()) {
      this.getCertificateList();
      this.getCertificateListbycompanyid();
    }
    if (this.iscompanyEquipment()) {
      this.getAllSpecialFiles(this.compId);
    }

    this.initSpecialFilesViewModel();
    this.initRenameModeObjModel();
    this.CertificationselectedItems = [];
    this.CertificationselectedItems2 = [];
    this.CertificationselectedItems3 = [];
    this.CertificationselectedItems4 = [];
    this.CertificationselectedItems5 = [];
    this.CertificationselectedItems6 = [];
    this.CertificationselectedItems7 = [];
    this.CertificationselectedItems8 = [];
    this.CertificationselectedItems9 = [];
    this.CertificationselectedItems10 = [];
    this.createcompanyVideoForm();
    this.createcompanyVideoForm1();
  }
  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  checkIfLabelNeeded(labelName: string) {
    return this.renameModeObj[labelName] !== '';
  }
  createCompanyDescriptionForm() {
    ;
    this.model = {
      editorData: '<p>Hello, world!</p>'
    };
    this.iCompanyViewModel.description = this._SupplierService.get('companyDescriptionValue');
    this.companyDescriptionForm = this._fb.group({
      description: [this.iCompanyViewModel.description, Validators.required]
    });
  }
  createcompanyVideoForm() {
    this.iAboutUsModel._3dTourUrlList = this._SupplierService.get('company_3dTourUrl');
    this.companyVideoForm = this._fb.group({
      _3dTourUrl: this._fb.array([]),
    });
    if (this.iAboutUsModel._3dTourUrlList.length) {
      for (let index = 0; index < this.iAboutUsModel._3dTourUrlList.length; index++) {
        this._3dTourUrl = this.companyVideoForm.get('_3dTourUrl') as FormArray;
        // tslint:disable-next-line:max-line-length
        this._3dTourUrl.push(this.setItem(this.iAboutUsModel._3dTourUrlList[index].title, this.iAboutUsModel._3dTourUrlList[index]._3dTourUrl, this.iAboutUsModel._3dTourUrlList[index].description, this.iAboutUsModel._3dTourUrlList[index].company3dtourId));
      }
    } else {
      this.companyVideoForm = this._fb.group({
        _3dTourUrl: this._fb.array([this.createItem()]), //[this.iAboutUsModel._3dTourUrl, Validators.required]
      });
    }
  }
  createcompanyVideoForm1(){
    this._videoList = this._SupplierService.get('videoList');
    this.companyVideoForm1 = this._fb.group({
      _videosUrl: this._fb.array([]),
    });
    if (this._videoList && this._videoList.length) {
      for (let index = 0; index < this._videoList.length; index++) {
        this._videosUrl = this.companyVideoForm1.get('_videosUrl') as FormArray;
        // tslint:disable-next-line:max-line-length
        this._videosUrl.push(this.setItem1(this._videoList[index].title, this._videoList[index].videoLink, this._videoList[index].description, this._videoList[index].id, this._videoList[index].companyId));
      }
    } else {
      this.companyVideoForm1 = this._fb.group({
        _videosUrl: this._fb.array([this.createItem1()]), //[this.iAboutUsModel._3dTourUrl, Validators.required]
      });
    }
  }
  createItem(): FormGroup {
    return this._fb.group({
      company3dtourId: [null],
      title: [null],
      url: [null, Validators.required],
      discription: [null]
    });
  }
  createItem1(): FormGroup {
    return this._fb.group({
      company3dtourId1: [null],
      title1: [null],
      url1: [null, Validators.required],
      discription1: [null]
    });
  }
  add() {
    this._3dTourUrl = this.companyVideoForm.get('_3dTourUrl') as FormArray;
    this._3dTourUrl.push(this.createItem());
  }
  add1() {
    this._videosUrl = this.companyVideoForm1.get('_videosUrl') as FormArray;
    this._videosUrl.push(this.createItem1());
  }
  setItem(title, _3dTourUrl, discription, company3dtourId): FormGroup {
    return this._fb.group({
      company3dtourId: [company3dtourId],
      title: [title],
      url: [_3dTourUrl, Validators.required],
      discription: [discription]
    });
  }
  setItem1(title, videoLink, discription, id, companyId): FormGroup {
    return this._fb.group({
      company3dtourId1: [id],
      title1: [title],
      url1: [videoLink, Validators.required],
      discription1: [discription],
      companyId: [companyId]
    });
  }


  isValidMatterportUrl()
  {           
    for (let index = 0; index < this.companyVideoForm.get('_3dTourUrl').value.length; index++) {      
       var isMatterportUrl = this.companyVideoForm.get('_3dTourUrl').value[index].url.includes('matterport');
       if(!isMatterportUrl)
       {
          return false;
       } 
    }        
    return true;
  }
  removeQuantity(index) {
    this._3dTourUrl = this.companyVideoForm.get('_3dTourUrl') as FormArray;
    this._3dtourIndex = index;
    if (this._3dTourUrl.value[this._3dtourIndex].company3dtourId) {
      localStorage.setItem('toDelete3dTour', this._3dTourUrl.value[this._3dtourIndex].company3dtourId);
      this._SupplierService.set(true, 'is3DDelete');
    } else {
      // this._SupplierService.set(false, 'is3DDelete');
      this._3dTourUrl.removeAt(this._3dtourIndex);
    }
  }
  removeQuantity1(index) {
    this._videosUrl = this.companyVideoForm1.get('_videosUrl') as FormArray;
    this._3dtourIndex1 = index;
    if (this._videosUrl.value[this._3dtourIndex1].company3dtourId1) {
      localStorage.setItem('toDelete3dTour1', this._videosUrl.value[this._3dtourIndex1].company3dtourId1);
      this._SupplierService.set(true, 'is3DDelete1');
    } else {
      this._videosUrl.removeAt(this._3dtourIndex1);
    }
  }
  delete3Dtour() {
    this._rfqService.get3DtourDelete().subscribe(res => {
      if (res['text'] === true) {
        this._SupplierService.set(false, 'is3DDelete');
        // this._3dTourUrl = this.companyVideoForm.get('_3dTourUrl') as FormArray;
        const toDeleteTourId = localStorage.getItem('toDelete3dTour');
        if (toDeleteTourId) {

          this._SupplierService.delete3DTour(toDeleteTourId).subscribe(res => {
            // this._3dTourUrl.removeAt(this._3dtourIndex);
            localStorage.removeItem('toDelete3dTour');
            this.closePartDrawer();
          });
        }
      }
    });
  }
  delete3Dtour1() {
    this._rfqService.get3DtourDelete1().subscribe(res => {
      if (res['text'] === true) {
        this._SupplierService.set(false, 'is3DDelete1');
        //this._videosUrl = this.companyVideoForm1.get('_videosUrl') as FormArray;
        //console.log('delete this...', this._videosUrl.value[0].company3dtourId1);
        const toDeleteTourId = localStorage.getItem('toDelete3dTour1');
        //debugger;
        if (toDeleteTourId) {

          this._SupplierService.deleteVideos(toDeleteTourId).subscribe(res => {
            // this._3dTourUrl.removeAt(this._3dtourIndex);
            localStorage.removeItem('toDelete3dTour1');
            this.closePartDrawer();
          });
        }
      }
    });
  }

  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.companyDescriptionForm,
      field
    );
  }
  isVideoFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.companyVideoForm,
      field
    );
  }

  get loggedId() {

    // tslint:disable-next-line:radix
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }

  doAsyncTask() {
    const promise = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        this.getLanguages();
        resolve();
      }, 1000);
    });
    return promise;
  }
  getProfileDetailsLocally() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
      this.doAsyncTask().then(() => {
        this.getAllSpecialFiles(this.compId);
      });
    } else {
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          this.doAsyncTask().then(() => {
            this.getAllSpecialFiles(this.compId);
          });
        },
        error => {
          this._rfqService.handleError(error);
          this.isLoder = false;
        },
        () => {}
      );
    }
  }
  getProfileDetails() {
    const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        this.getAllSpecialFiles(this.compId);
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  editCompanyVideo() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      if (this.companyVideoForm.valid) {
        let tempVideoModelArray: I3dTourViewModel[] = [];
        let tempVideoModel: I3dTourViewModel = {
          company3dtourId: 0,
          companyId: this.loggedCompanyId,
          _3dTourUrl: '',
          title: '',
          description: '',
          isDeleted: false,
          errorMessage: '',
          result: false,
        };
        const temp = this.companyVideoForm.get('_3dTourUrl') as FormArray;
        for (let index = 0; index < temp.length; index++) {
          tempVideoModel = {
            company3dtourId: 0,
            companyId: this.loggedCompanyId,
            _3dTourUrl: '',
            title: '',
            description: '',
            isDeleted: false,
            errorMessage: '',
            result: false,
          };
          tempVideoModel.company3dtourId = (temp.value[index].company3dtourId) ? temp.value[index].company3dtourId : 0;
          tempVideoModel._3dTourUrl = temp.value[index].url;
          tempVideoModel.title = temp.value[index].title;
          tempVideoModel.description = temp.value[index].discription;
          tempVideoModelArray.push(tempVideoModel);
        }
        this._SupplierService.editCompany3DTourUrl(tempVideoModelArray).subscribe(
          result => {
            this.iCompanyViewModel = result['data'];
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], 'Success!');
              this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
              this._SupplierService.set(true, 'editCompanyDescription');
              this._SupplierService.set(true, 'companyVideos');
              localStorage.setItem('isCompanyProfileFilled', 'true');
              this.closePartDrawer();
              this.profileChanges.emit(true);
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
            this.isButtonClicked = false;
          },
          error => {
            this.isButtonClicked = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this.isButtonClicked = false;
        this._customValidatorsService.validateAllFormFields(this.companyDescriptionForm);
      }
    }
  }
  editCompanyVideo1() {
    console.log('111');
    if (!this.isButtonClicked) {
      console.log('222');
      this.isButtonClicked = true;
      if (this.companyVideoForm1.valid) {
        this.tempVideoModelList = [];
        const temp1 = this.companyVideoForm1.get('_videosUrl') as FormArray;
        console.log('obj from form', temp1)
        const data = this.checkDuplicate(temp1.value);
        if(data) {
          this._toastr.error('URL must be unique', 'Error!');
         
          console.log("companyvideo", this.companyVideoForm1.valid);
          this.isButtonClicked = false;
           } else{
            for (let index = 0; index < temp1.value.length; index++) {
              this.tempVideoModelList.push({
                videoLink: temp1.value[index].url1,
                title: temp1.value[index].title1,
                description: temp1.value[index].discription1,
                contactId: this.iContactViewModel.contactId,
                id: temp1.value[index].company3dtourId1 ? temp1.value[index].company3dtourId1 : 0,
                companyId: this.iContactViewModel.companyId
              });
            }
            this._SupplierService.setVideos(this.tempVideoModelList).subscribe(
              result => {
                this.iCompanyViewModel = result['data'];
                if (result['result'] === true) {
                  this._toastr.success(result['errorMessage'], 'Success!');
                  this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
                  this._SupplierService.set(true, 'editCompanyDescription');
                  this._SupplierService.set(true, 'companyVideos1');
                  localStorage.setItem('isCompanyProfileFilled', 'true');
                  this.closePartDrawer();
                  this.profileChanges.emit(true);
                } else {
                  this._toastr.error(result['errorMessage'], 'Error!');
                }
                this.isButtonClicked = false;
              },
              error => {
                this.isButtonClicked = false;
                this._rfqService.handleError(error);
              },
              () => {}
            );
           }
        console.log("data", data);
    
      } else {
        // this.isButtonClicked = false;
        this._customValidatorsService.validateAllFormFields(this.companyDescriptionForm);
      }
    }
  }
  checkDuplicate(arrayData) {
    console.log('3333333');
    this.status = arrayData.some((user) => {
      let counter = 0;
      for (const iterator of arrayData) {
        if (iterator.url1 === user.url1) {
          counter += 1;
        }
      }
      return counter > 1;
    })
    if (this.status === true) {
        return true;
          } else {
            return false;
          }
    }
  editCompanyDescription() {
    const stringValue= this.iCompanyViewModel.description.replace(/<[^>]*>/g, '\n');
    const isWhitespaceString = stringValue.replace(/\s/g, '').length;
    if(isWhitespaceString === 0){
      this.onlySpace = true;
    }else{
      this.onlySpace = false;
    }
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      if (this.iCompanyViewModel.description !== '' && this.iCompanyViewModel.description !== null && !this.onlySpace) {
        let countString = this.iCompanyViewModel.description.trim();
        const decLength = countString.replace(/<[^>]*>/g, '').length;
        // console.log(countString.replace(/<[^>]*>/g, ''));
        if (decLength > 4000) {
          this.isButtonClicked = false;
          this._toastr.error('Company Description should be less than 4000 Characters', 'Error!');
        } else {
          this.iCompanyViewModel.companyId = this.iContactViewModel.companyId;
          this._SupplierService.editCompanyDescription(this.iCompanyViewModel).subscribe(
            result => {
              this.iCompanyViewModel = result['data'];
              if (result['result'] === true) {
                this._toastr.success(result['errorMessage'], 'Success!');
                this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
                this._SupplierService.set(true, 'editCompanyDescription');
                localStorage.setItem('isCompanyProfileFilled', 'true');
                this.closePartDrawer();
                this.profileChanges.emit(true);
              } else {
                this._toastr.error(result['errorMessage'], 'Error!');
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
      } else {
        this.isCompanyDesError = true;
        this.isButtonClicked = false;
      }
    }
  }

  setProfileStatus() {
    this.iProfileSetModel.isCompanyDescription = true;
    this._SupplierService.setProfileDashBoard(this.iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }

  initequipmentForm() {
    this.deleteEquipmentCount = 0;
    this.equipmentForm = this._fb.group({
      equipments: this._fb.array([])
    });
    this.patchPartDetails();
  }
  patchQuantities(equipmentId, equipmentText, tagSourceId, createDate, updateDate, statusId, isDeleted) {
    return this._fb.group({
      equipmentId: [equipmentId],
      tagSourceId: [tagSourceId],
      equipmentText: [equipmentText, [Validators.required]],
      createDate: [createDate],
      updateDate: [updateDate],
      statusId: [statusId],
      isDeleted: [isDeleted],
    });
  }

  patchPartDetails() {
    const control = < FormArray > this.equipmentForm.controls['equipments'];
    if (this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 0) {
      this.iAboutUsModel.equipments.forEach(x => {
        if (x.isFile != true) {
          control.push(
            this.patchQuantities(
              x.equipmentId,
              x.equipmentText,
              x.tagSourceId,
              x.createDate,
              x.updateDate,
              x.statusId,
              x.isDeleted
            )
          );
        } else {
          this.equipmentFile[0] = {
            createDate: x.createDate,
            equipmentId: x.equipmentId,
            equipmentText: x.equipmentText,
            statusId: x.statusId,
            tagSourceId: x.tagSourceId,
            updateDate: x.updateDate,
            isDeleted: x.isDeleted,
            isFile: x.isFile
          }
        }
      });
    } else {
      // tslint:disable-next-line:max-line-length
      ( < FormArray > this.equipmentForm.controls['equipments']).push(
        this._fb.group({
          createDate: [new Date()],
          equipmentId: [0],
          equipmentText: ['', [Validators.required]],
          statusId: [0],
          tagSourceId: [0],
          updateDate: [new Date()],
          isDeleted: [false]
        })
      );
    }
    this.isEqupimentFormActive = false;

  }

  addNewQuantity() {
    const control = < FormArray > this.equipmentForm.controls['equipments'];
    control.push(
      this._fb.group({
        createDate: [new Date()],
        equipmentId: [0],
        equipmentText: ['', [Validators.required]],
        statusId: [0],
        tagSourceId: [0],
        updateDate: [new Date()],
        isDeleted: [false]
      })
    );
  }

  deleteQuantity(index, id) {
    const control = < FormArray > this.equipmentForm.controls['equipments'];
    if (control.controls[index].value.equipmentId === 0) {
      control.removeAt(index);
    } else {
      control.removeAt(index);
      const dataindex = this.iAboutUsModel.equipments.findIndex(x => x.equipmentId === id);
      this.iAboutUsModel.equipments[dataindex].isDeleted = true;
      // control.controls[index].value.isDeleted = true;
      // this.deleteEquipmentCount = this.deleteEquipmentCount + 1;
    }
    // if ((control.controls.length - this.deleteEquipmentCount) === 0) {
    //   this.addNewQuantity();
    // }
    if (control.controls.length === 0) {
      this.addNewQuantity();
    }
  }
  validateQuantityList(): boolean {
    const quantityArr = < FormArray > this.equipmentForm.controls['equipments'];
    if (quantityArr.controls) {
      for (let i = 0; i < quantityArr.controls.length; i++) {
        const obj = quantityArr.controls[i].value;
        if (obj.partQty <= 0) {
          return false;
        }
      }
      return true;
    }
  }

  saveEquipment() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;

      const isEquipmentValid = this.validateQuantityList();
      if (isEquipmentValid || this.equipmentFile.length) {
        this.iAboutUsViewModel.equipments = this.equipmentForm.value.equipments.filter(x => x.equipmentText != '');
        for (let i = 0; i < this.iAboutUsModel.equipments.length; i++) {
          if (this.iAboutUsModel.equipments[i].isDeleted === true) {
            this.iAboutUsViewModel.equipments.push(this.iAboutUsModel.equipments[i]);
          }
        }
        if (this.equipmentFile.length) {
          this.iAboutUsViewModel.equipments.push(this.equipmentFile[0]);
        }

        this.iAboutUsViewModel.companyId = this.iContactViewModel.companyId;
        this.iAboutUsViewModel.contactId = this.iContactViewModel.contactId;;
        this._SupplierService.addSupplierEquipment(this.iAboutUsViewModel).subscribe(
          result => {
            if (result['result'] === true) {
              debugger
              this._toastr.success(result['errorMessage'], '');
              this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
              this._SupplierService.set(true, 'saveEquipment');
              this.closePartDrawer();
              this.profileChanges.emit(true);
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
            this.isButtonClicked = false;
          },
          error => {
            this.isButtonClicked = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this.isButtonClicked = false;
        this._customValidatorsService.validateAllFormFields(this.equipmentForm);
      }
    }
  }

  iscompanyEquipment() {
    return this._SupplierService.get('companyEquipment');
  }
  iscompanyDescription() {
    return this._SupplierService.get('companyDescription');
  }
  iscompanyVideos() {
    return this._SupplierService.get('companyVideos');
  }
  iscompanyVideos1() {
    return this._SupplierService.get('companyVideos1');
  }
  iscompanyPhotos() {
    return this._SupplierService.get('companyPhotos');
  }
  iscompanyDemographics() {
    return this._SupplierService.get('companyDemographics');
  }
  iscompanyCertifications() {
    return this._SupplierService.get('companyCertifications');
  }
  iscontactInformation() {
    return this._SupplierService.get('contactInformation');
  }
  closePartDrawer(isCancled ? ) {
    if (isCancled) {
      this._SupplierService.set(true, 'editHeaderCancelWarning');

    } else {
      this._SupplierService.set(false, 'supplierSidePanel');
      this._SupplierService.set(false, 'contactUsEdit');
      this._SupplierService.set(false, 'aboutUsEdit');
      this._SupplierService.set(false, 'capabilitiesEdit');
      this._SupplierService.set(false, 'contactInformation');
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
  }

  initRenameModeObjModel() {
    this.renameModeObj = {
      fileId: 0,
      fileName: '',
      contId: 0,
      compId: 0,
      isDeleted: false,
      filetypeId: 2,
      creationDate: '',
      importedLocation: '',
      parentFileId: 0,
      legacyFileId: 0,
      fileTitle: '',
      fileCaption: '',
      s3FileName: ''
    };
  }
  initSpecialFilesViewModel() {
    this.iSpecialFilesViewModel = {
      fileId: 0,
      fileName: '',
      contId: 0,
      compId: 0,
      isDeleted: false,
      filetypeId: 2,
      creationDate: null,
      importedLocation: '',
      parentFileId: 0,
      legacyFileId: 0,
      fileTitle: '',
      fileCaption: '',
      s3FileName: ''
    };
  }

  uploadGallaryItem() {
    this.gallaryItemUploader.onAfterAddingFile = (fileItem) => {
      const files = this.gallaryItemUploader.queue;
        if ((this.gallaryItemUploader.queue.length + this.iAboutUsModel.specialFiles.length ) >= 15) {
            this._toastr.warning('Maximum 15 files can be attached!', 'Warning!');
            this.gallaryItemUploader.queue = [];
            return;
      }
      
      if (fileItem.file.size > (3 * 1024 * 1024)) {
        this._toastr.error('Please select file with file size upto 3 MB', 'Error !');
      } else {
        if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg') ||
          (fileItem.file.type === 'image/png') || (fileItem.file.type === 'video/mp4') ||
          (fileItem.file.type === 'video/x-m4v')) {
          const file = fileItem._file;        
          this.upload(file)
            .subscribe(res => {
              const result = JSON.parse(res['_body']);
              const fNmae = result['fileName'];
              this.initSpecialFilesViewModel();
              this.iSpecialFilesViewModel.fileName = fNmae;
              // tslint:disable-next-line:radix
              this.iSpecialFilesViewModel.contId = parseInt(localStorage.getItem('LoggedId'));
              this.iSpecialFilesViewModel.compId = this.compId;
              this.iSpecialFilesViewModel.creationDate = (new Date()).toISOString();
              this._SupplierService.addSpecialFile(this.iSpecialFilesViewModel).subscribe(result2 => {
                if (result2.result === true) {
                  // this.photoIds = [];
                  // result2['data'].forEach(element => { this.photoIds.push(element.fileId) } );
                  // this.setPhotoSequence();
                  this.specialFileCount++;
                  if (result2.errorMessage) {
                    this._toastr.warning(result2.errorMessage, 'Warning!');
                  }
                  this.getAllSpecialFiles(this.iContactViewModel.companyId);
                  this.profileChanges.emit(true);
                } else {
                  // console.log('Error: ', result2.errorMessage);
                  this._toastr.error(result2.errorMessage, 'Error!');

                  this.isFileUpladed = false;
                }
              }, error => {
                this._rfqService.handleError(error);
                this.isFileUpladed = false;
              }, () => {});
            }, error => {
              this._rfqService.handleError(error);
              this.isFileUpladed = false;
            }, () => {});
          fileItem.withCredentials = false;
          this.isFileUpladed = true;
        } else {
          this._toastr.error('Please jpg, png, mp4 and mov file only', 'Error!');
        }
      }
    };
  }
// isDisabledSpecialFileCancel
  isDisabledSpecialFileCancel() {
    if (!this.renameModeObj) {
      return true;
    } else if (!this.renameModeObj.fileName) {
      return true;
    } else {
      return false;
    }
  }
  isDisabledSpecialFilesave() {
    if (!this.renameModeObj) {
      return true;
    } else if (!this.renameModeObj.fileTitle || (this.renameModeObj.fileTitle === '') || !this.renameModeObj.fileCaption ||
      (this.renameModeObj.fileCaption === '')) {
      return true;
    } else {
      return false;
    }
  }
  saveSpecialFile() {
    this.isFileUpladed = true;
    this.renameModeObj.creationDate = (new Date()).toISOString();
    this.renameModeObj.fileName = this.renameModeObj.s3FileName;
    this._SupplierService.addSpecialFile(this.renameModeObj).subscribe(result2 => {
      if (result2.result === true) {

        this.specialFileCount++;
        this.clearFileRenameDrawer();
        this._SupplierService.set(true, 'companyPhotosClosedFromInside');
        this.getAllSpecialFiles(this.iContactViewModel.companyId);
        this.profileChanges.emit(true);
      } else {
        this._toastr.error(result2.errorMessage, 'Error!');
        this.isFileUpladed = false;
      }
    }, error => {
      this._rfqService.handleError(error);
      this.isFileUpladed = false;
    }, () => {});
  }


  deleteImage(imgFileIndex) {
    const tempObj = this.iAboutUsModel.specialFiles[imgFileIndex];
    tempObj.isDeleted = true;
    tempObj.fileName = tempObj.s3FileName;
    const tempPhotoId = this.iAboutUsModel.specialFiles[imgFileIndex].fileId;
    this._SupplierService.addSpecialFile(tempObj).subscribe(result2 => {
      if (result2.result === true) {
        this.specialFileCount++;
        this.clearFileRenameDrawer();
        this.getAllSpecialFiles(this.iContactViewModel.companyId);
        let index = this.photoIds.findIndex(x => x === tempPhotoId);
        if (index !== -1) {
          this.photoIds.splice(index, 1);
          this.setPhotoSequence();
        }
        this.profileChanges.emit(true);
      } else {
        // console.log('Error: ', result2.errorMessage);
        this._toastr.error(result2.errorMessage, 'Error!');
        this.isFileUpladed = false;
      }
    }, error => {
      this._rfqService.handleError(error);
      this.isFileUpladed = false;
    }, () => {});
  }

  enableRenameMode(item) {
    this.isRenameMode = true;
    this.initRenameModeObjModel();
    this.renameModeObj = {
      fileId: item.fileId,
      fileName: item.fileName,
      contId: item.contId,
      compId: item.compId,
      isDeleted: item.isDeleted,
      filetypeId: item.filetypeId,
      creationDate: item.creationDate,
      importedLocation: item.importedLocation,
      parentFileId: item.parentFileId,
      legacyFileId: item.legacyFileId,
      fileTitle: item.fileTitle,
      fileCaption: item.fileCaption,
      s3FileName: item.s3FileName
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

  getOriginalFileName(fileName) {
    let returnName = '';
    const filenNameArray = fileName.split('_S3_');
    if (filenNameArray.length === 1) {
      returnName = filenNameArray[0];
    } else {
      returnName = filenNameArray[1];
    }
    if (returnName.length > 10) {
      return returnName.slice(0, 10).concat('...');
    } else {
      return returnName;
    }
  }

  enableUploader() {
    if (this.iAboutUsModel.specialFiles.length > 14) {
      this._toastr.error('Maximum files are uploaded', 'Error!');
      this.uploadAnother = false;
    } else {
      this.uploadAnother = true;
    }
  }

  getAllSpecialFiles(compId) {
    this.isFileUpladed = true;
    const contactId = this.loggedId;
    // tslint:disable-next-line:max-line-length
    this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.iContactViewModel.contactId, this.iContactViewModel.isBuyer, this.loggedId).subscribe(
      result2 => {
        this._SupplierService.getVideosList(this.iContactViewModel.companyId).subscribe(
          res => {
            if (result2.result === true) {
              this.iAboutUsModel = result2['data'];
              this._videoList = res.data;
              this.isFileUpladed = false;
              if (this.iAboutUsModel.equipments === null) {
                this.iAboutUsModel.equipments = [];
              }
              if (this.iAboutUsModel.specialFiles === null) {
                this.iAboutUsModel.specialFiles = [];
              }
              if (this.iAboutUsModel.description === '' || this.iAboutUsModel.description === null ||
                this.iAboutUsModel.description === undefined) {
                this.iAboutUsModel.description = '';
              }
              if (!!this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 20) {
                this.iAboutUsModel.equipments = this.iAboutUsModel.equipments.slice(-20);
              }
              if (this.iAboutUsModel.languages === null) {
                this.iAboutUsModel.languages = [];
              }
              if (this.iAboutUsModel.equipments != null && this.iAboutUsModel.equipments.length) {
                let temp = this.iAboutUsModel.equipments.filter(x => x.isFile === true)
                if (temp.length) {
                  this.equipmentFile.push(temp.pop());
                }
              }
              this.initequipmentForm();
              if (this.iAboutUsModel.languages !== null && this.iAboutUsModel.languages.length > 20) {
                this.iAboutUsModel.languages = this.iAboutUsModel.languages.slice(0, 20);
              }
              setTimeout(() => {
                for (let index = 0; index < this.iAboutUsModel.languages.length; index++) {
                  if (index === 0) {
                    this.firstLanguageId = this.iAboutUsModel.languages[0].languageId;
                  }
                  if (index === 1) {
                    this.secondLanguageDiv = true;
                    this.addSecondLanguageDiv = false;
                    this.iLanguageModelSecondLangColl = this.iLanguageModelColl;
                    this.secondLanguageId = this.iAboutUsModel.languages[1].languageId;
                    this.addThirdLanguageDiv = true;
                  }
                  if (index === 2) {
                    this.thirdLanguageDiv = true;
                    this.addThirdLanguageDiv = false;
                    this.iLanguageModelThirdLangColl = this.iLanguageModelColl;
                    this.thirdLanguageId = this.iAboutUsModel.languages[2].languageId;
                    this.addThirdLanguageDiv = false;
                    this.addFourthLanguageDiv = true;
                  }
                  if (index === 3) {
                    this.fourthLanguageDiv = true;
                    this.addFourthLanguageDiv = false;
                    this.iLanguageModelFourthLangColl = this.iLanguageModelColl;
                    this.fourthLanguageId = this.iAboutUsModel.languages[3].languageId;
                    this.addThirdLanguageDiv = false;
                    this.addFourthLanguageDiv = false;
                    this.addFifthLanguageDiv = true;
                  }
                  if (index === 4) {
                    this.fifthLanguageDiv = true;
                    this.addFifthLanguageDiv = false;
                    this.iLanguageModelFifthLangColl = this.iLanguageModelColl;
                    this.fifthLanguageId = this.iAboutUsModel.languages[4].languageId;
                    this.addThirdLanguageDiv = false;
                    this.addFourthLanguageDiv = false;
                    this.addFifthLanguageDiv = false;
                  }
                }
              }, 1000);
              if (this.iAboutUsModel.supplierType !== null) {
                this.iSupplierTypeViewModel.supplierTypeId = this.iAboutUsModel.supplierType.supplierTypeId;
              }
              if (!!this.iAboutUsModel.specialFiles) {
                this.uploadAnother = false;
                // this.iAboutUsModel.specialFiles = this.iAboutUsModel.specialFiles.slice(0, 6);
              }
              this.photoIds = [];
              if (this.iAboutUsModel.specialFiles !== null && this.iAboutUsModel.specialFiles !== undefined) {
                for (let index = 0; index < this.iAboutUsModel.specialFiles.length; index++) {
                  this.photoIds.push(this.iAboutUsModel.specialFiles[index].fileId);
                }
              }

              this.isLoder = false;
            }
          })
      }, error => {
        this._rfqService.handleError(error);
        this.isLoder = false;
      }, () => {}
    );
  }

  getFileUrl(fileName) {
    return fileName;
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
  }

  clearFileRenameDrawer() {
    this.isRenameMode = false;
    this.initRenameModeObjModel();
  }

  closeFileRenameDrawer() {
    this.isRenameMode = false;
    // if ((!!this.renameModeObj.fileTitle && (this.renameModeObj.fileTitle !== ''))
    //   || ( !!this.renameModeObj.fileCaption && (this.renameModeObj.fileCaption !== '')) ) {
    //   swal({
    //     title: 'You have unsaved information. Are you sure you want to Cancel?',
    //     text: '',
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes',
    //     cancelButtonText: 'No',
    //     allowOutsideClick: false
    //   }).then((result) => {
    //     if (result.value) {
    //       this.clearFileRenameDrawer();
    //     } else {
    //     }
    //   });
    // } else {
    //   this.clearFileRenameDrawer();
    // }
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    const Id = localStorage.getItem('loggedCompanyId');
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('loggedCompanyId'));
    } else {
      return 0;
    }
  }

  getCertificateListbycompanyid() {
    if (this.loggedCompanyId !== null && this.loggedCompanyId !==
      undefined && this.loggedCompanyId !== 0) {
      this._masterService.getCertificate(this.loggedCompanyId).subscribe(
        result => {
          if (result['result'] !== false) {
            this.iCertificationViewModelCollbycompany = result['data'];
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }


  getCertificateList() {
    this._masterService.getCertificate(null).subscribe(
      result => {
        this.iCertificationViewModelColl = result['data'];

        this.certificatesettings = {
          singleSelection: true,
          text: 'certification',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search certification',
          enableSearchFilter: true,
          labelKey: 'certificateCode',
          primaryKey: 'certificateId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 200,
          showCheckbox: false
        };
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );

  }
  checkIfCertificatateExist(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      return true;
    } else {
      return false;
    }
  }

  onPostCertificationProcess1(item: any) {
    console.log('item', item);
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems = [];
      return;
    } else if (isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems = [];
      return;
    }
    this.isITARCertificate1Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate1Selected = true;
      this.certificateAttacghmentFileName1 = '';
    }
  }
  onPostCertificationProcess2(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems2 = [];
      return;
    } else if (isExist1 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems2 = [];
      return;
    }
    this.isITARCertificate2Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate2Selected = true;
      this.certificateAttacghmentFileName2 = '';
    }
  }
  onPostCertificationProcess3(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems3 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this.CertificationselectedItems3 = [];
      this._toastr.error('This certificate is already selected', 'Error!');
      return;
    }
    this.isITARCertificate3Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate3Selected = true;
      this.certificateAttacghmentFileName3 = '';
    }
  }
  onPostCertificationProcess4(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems4 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems4 = [];
      return;
    }
    this.isITARCertificate4Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate4Selected = true;
      this.certificateAttacghmentFileName4 = '';
    }
  }
  onPostCertificationProcess5(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems5 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems5 = [];
      return;
    }
    this.isITARCertificate5Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate5Selected = true;
      this.certificateAttacghmentFileName5 = '';
    }
  }
  onPostCertificationProcess6(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems6 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist7 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems6 = [];
      return;
    }
    this.isITARCertificate6Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate6Selected = true;
      this.certificateAttacghmentFileName6 = '';
    }
  }
  onPostCertificationProcess7(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;

    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems7 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist8 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems7 = [];
      return;
    }
    this.isITARCertificate7Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate7Selected = true;
      this.certificateAttacghmentFileName7 = '';
    }
  }
  onPostCertificationProcess8(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems8 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist9 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems8 = [];
      return;
    }
    this.isITARCertificate8Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate8Selected = true;
      this.certificateAttacghmentFileName8 = '';
    }
  }
  onPostCertificationProcess9(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist10 = this.CertificationselectedItems10.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems9 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist10 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems9 = [];
      return;
    }
    this.isITARCertificate9Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate9Selected = true;
      this.certificateAttacghmentFileName9 = '';
    }
  }
  onPostCertificationProcess10(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExist6 = this.CertificationselectedItems6.filter(m => m.certificateId === item.certificateId).length;
    const isExist7 = this.CertificationselectedItems7.filter(m => m.certificateId === item.certificateId).length;
    const isExist8 = this.CertificationselectedItems8.filter(m => m.certificateId === item.certificateId).length;
    const isExist9 = this.CertificationselectedItems9.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems10 = [];
      return;
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 &&
      isExist6 === 0 && isExist7 === 0 && isExist8 === 0 && isExist9 === 0) {
      this.iCertificationViewModelColl.values = item.certificateId;
    } else {
      this._toastr.error('This certificate is already selected', 'Error!');
      this.CertificationselectedItems10 = [];
      return;
    }
    this.isITARCertificate10Selected = false;
    if (item.certificateCode == 'ITAR') {
      this.isITARCertificate10Selected = true;
      this.certificateAttacghmentFileName10 = '';
    }
  }

  addSecondCertficate() {
    this.secondCertificateDiv = true;
    this.addSecondCertificateDiv = false;
    this.addThirdCertificateDiv = true;
    this.addFouthCerftificateDiv = true;
    this.addFifthCerftificateDiv = true;
    this.addSixthCerftificateDiv = true;
    this.addSeventhCerftificateDiv = true;
    this.addEightCerftificateDiv = true;
    this.addNinethCerftificateDiv = true;
    this.addTenthCerftificateDiv = true;
  }
  addThirdCertificate() {
    this.thirdCertificateDiv = true;
    this.addThirdCertificateDiv = false;
    this.addFouthCerftificateDiv = true;
    this.addFifthCerftificateDiv = true;
  }
  addFourthCertificate() {
    this.fourthCertificateDiv = true;
    this.addFouthCerftificateDiv = false;
    this.addFifthCerftificateDiv = true;
  }
  addFifthCertificate() {
    this.fifthCertificateDiv = true;
    this.addFifthCerftificateDiv = false;
  }

  addSixthCertificate() {
    this.sixthCertificateDiv = true;
    this.addSixthCerftificateDiv = false;
  }
  addSeventhCertificate() {
    this.seventhCertificateDiv = true;
    this.addSeventhCerftificateDiv = false;
  }
  addEightCertificate() {
    this.eightCertificateDiv = true;
    this.addEightCerftificateDiv = false;
  }
  addNinethCertificate() {
    this.ninethCertificateDiv = true;
    this.addNinethCerftificateDiv = false;
  }
  addTenthCertificate() {
    this.tenthCertificateDiv = true;
    this.addTenthCerftificateDiv = false;
  }
  deleteSecondCertficate() {
    this.secondCertificateDiv = false;
    this.thirdCertificateDiv = false;
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.addSecondCertificateDiv = true;
    this.addThirdCertificateDiv = false;
    this.addFouthCerftificateDiv = false;
    this.addFifthCerftificateDiv = false;
  }

  deleteThirdCertficate() {
    this.thirdCertificateDiv = false;
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.addThirdCertificateDiv = true;
    this.addFouthCerftificateDiv = false;
    this.addFifthCerftificateDiv = false;
  }

  deleteFourthCertificate() {
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.addFouthCerftificateDiv = true;
    this.addFifthCerftificateDiv = false;
  }
  deleteFifthCertificate() {
    this.fifthCertificateDiv = false;
    this.addFifthCerftificateDiv = true;
  }
  deleteSixthCertificate() {
    this.sixthCertificateDiv = false;
    this.addSixthCerftificateDiv = true;
  }
  deleteSeventhCertificate() {
    this.seventhCertificateDiv = false;
    this.addSeventhCerftificateDiv = true;
  }
  deleteEightCertificate() {
    this.eightCertificateDiv = false;
    this.addEightCerftificateDiv = true;
  }
  deleteNinethCertificate() {
    this.ninethCertificateDiv = false;
    this.addNinethCerftificateDiv = true;
  }
  deleteTenthCertificate() {
    this.tenthCertificateDiv = false;
    this.addTenthCerftificateDiv = true;
  }
  deleteFileRemove1() {
    this.certificateAttacghmentFileName1 = '';

  }
  deleteFileRemove2() {
    this.certificateAttacghmentFileName2 = '';

  }
  deleteFileRemove3() {
    this.certificateAttacghmentFileName3 = '';

  }
  deleteFileRemove4() {
    this.certificateAttacghmentFileName4 = '';

  }
  deleteFileRemove5() {
    this.certificateAttacghmentFileName5 = '';

  }
  deleteFileRemove6() {
    this.certificateAttacghmentFileName6 = '';

  }
  deleteFileRemove7() {
    this.certificateAttacghmentFileName7 = '';

  }
  deleteFileRemove8() {
    this.certificateAttacghmentFileName8 = '';

  }
  deleteFileRemove9() {
    this.certificateAttacghmentFileName9 = '';

  }
  deleteFileRemove10() {
    this.certificateAttacghmentFileName10 = '';

  }





  saveCetifications() {
    this.icompanyCertificateViewModelColl = [];
    this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
    this.icompanyCertificateViewModel.creationDate = this.certificateDate1;
    this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems[0].certificateId;
    this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName1;
    this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;

    this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    
    if (this.secondCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate2;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems2[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName2;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.thirdCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate3;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems3[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName3;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.fourthCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate4;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems4[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName4;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.fifthCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate5;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems5[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName5;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.sixthCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate6;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems6[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName6;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.seventhCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate7;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems7[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName7;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.eightCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate8;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems8[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName8;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.ninethCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate9;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems9[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName9;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }
    if (this.tenthCertificateDiv) {
      this.initCertificateModel();
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.certificateDate10;
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems10[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName10;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
    }

    this._SupplierService.insertCertificates(this.icompanyCertificateViewModelColl).subscribe(
      result => {
        this.icompanyCertificateViewModel = result['data'];
        if (result['result'] === true) {
          this.profileChanges.emit(true);
          this._toastr.success(result['errorMessage'], 'Success!');
          this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
          this.closePartDrawer();
        } else {
          this._toastr.error(result['errorMessage'], 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getLanguages() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelColl = data;
        if (this.iAboutUsModel.languages.length === 0) {
          // tslint:disable-next-line:no-shadowed-variable
          const data = this.iLanguageModelColl.find(m => m.languageName === 'English');
          this.firstLanguageId = data.languageId;
        }
        for (let i = 0, len = this.iLanguageModelColl.length; i < len; i++) {
          for (let j = 0, len2 = this.selectedLanguageId.length; j < len2; j++) {
            if (this.iLanguageModelColl[i].languageId === +this.selectedLanguageId[j]) {
              this.iLanguageModelColl.splice(i, 1);
              len2 = this.iLanguageModelColl.length;
            }
          }
        }

      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getSecondLanguageDropDown() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelSecondLangColl = data;
        for (let i = 0, len = this.iLanguageModelSecondLangColl.length; i < len; i++) {
          for (let j = 0, len2 = this.selectedLanguageId.length; j < len2; j++) {
            if (this.iLanguageModelSecondLangColl[i] !== undefined) {
              if (this.iLanguageModelSecondLangColl[i].languageId === +this.selectedLanguageId[j]) {
                this.iLanguageModelSecondLangColl.splice(i, 1);
                len2 = this.iLanguageModelSecondLangColl.length;
              }
            }
          }
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getThirdLanguageDropDown() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelThirdLangColl = data;

        for (let i = 0, len = this.iLanguageModelThirdLangColl.length; i < len; i++) {
          for (let j = 0, len2 = this.selectedLanguageId.length; j < len2; j++) {
            if (this.iLanguageModelThirdLangColl[i] !== undefined) {
              if (this.iLanguageModelThirdLangColl[i].languageId === +this.selectedLanguageId[j]) {
                this.iLanguageModelThirdLangColl.splice(i, 1);
                len2 = this.iLanguageModelThirdLangColl.length;
              }
            }

          }
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getFourthLanguageDropDown() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelFourthLangColl = data;

        for (let i = 0, len = this.iLanguageModelFourthLangColl.length; i < len; i++) {
          for (let j = 0, len2 = this.selectedLanguageId.length; j < len2; j++) {
            if (this.iLanguageModelFourthLangColl[i] !== undefined) {
              if (this.iLanguageModelFourthLangColl[i].languageId === +this.selectedLanguageId[j]) {
                this.iLanguageModelFourthLangColl.splice(i, 1);
                len2 = this.iLanguageModelFourthLangColl.length;
              }
            }

          }
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getFifthLanguageDropDown() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelFifthLangColl = data;

        for (let i = 0, len = this.iLanguageModelFifthLangColl.length; i < len; i++) {
          for (let j = 0, len2 = this.selectedLanguageId.length; j < len2; j++) {
            if (this.iLanguageModelFifthLangColl[i] !== undefined) {
              if (this.iLanguageModelFifthLangColl[i].languageId === +this.selectedLanguageId[j]) {
                this.iLanguageModelFifthLangColl.splice(i, 1);
                len2 = this.iLanguageModelFifthLangColl.length;
              }
            }

          }
        }
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }


  getCompanytypes() {
    this._masterService.getCompanyTypes().subscribe(
      (data: SupplierTypeViewModel[]) => {
        this.supplierTypeViewModelColl = data['data'];
        // console.log('actualdata' , this.supplierTypeViewModelColl );
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  getEmployeeRange() {
    this._masterService.getEmployeeRange().subscribe(
      (data: EmployeesCountRangeViewModel[]) => {
        this.employeesCountRangeViewModelColl = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }

  addSecondLanguage() {
    this.getSecondLanguageDropDown();

    if (this.firstLanguageId === 0) {
      this.getLanguages();
    }

    if (this.thirdLanguageId === 0) {
      this.getThirdLanguageDropDown();
    }

    if (this.fourthLanguageId === 0) {
      this.getFourthLanguageDropDown();
    }

    if (this.fifthLanguageId === 0) {
      this.getFifthLanguageDropDown();
    }
    this.secondLanguageDiv = true;
    this.addSecondLanguageDiv = false;
    this.addThirdLanguageDiv = true;
  }
  addThirdLanguage() {
    this.getThirdLanguageDropDown();

    if (this.firstLanguageId === 0) {
      this.getLanguages();
    }

    if (this.secondLanguageId === 0) {
      this.getSecondLanguageDropDown();
    }

    if (this.fourthLanguageId === 0) {
      this.getFourthLanguageDropDown();
    }

    if (this.fifthLanguageId === 0) {
      this.getFifthLanguageDropDown();
    }
    this.getFourthLanguageDropDown();
    this.getFifthLanguageDropDown();

    this.thirdLanguageDiv = true;
    this.addThirdLanguageDiv = false;
    this.addFourthLanguageDiv = true;
  }

  addFourthLanguage() {

    this.getFourthLanguageDropDown();

    if (this.firstLanguageId === 0) {
      this.getLanguages();
    }

    if (this.secondLanguageId === 0) {
      this.getSecondLanguageDropDown();
    }

    if (this.thirdLanguageId === 0) {
      this.getThirdLanguageDropDown();
    }

    if (this.fifthLanguageId === 0) {
      this.getFifthLanguageDropDown();
    }

    this.fourthLanguageDiv = true;
    this.addFourthLanguageDiv = false;
    this.addFifthLanguageDiv = true;
  }

  addFifthLanguage() {

    this.getFifthLanguageDropDown();

    if (this.firstLanguageId === 0) {
      this.getLanguages();
    }

    if (this.secondLanguageId === 0) {
      this.getSecondLanguageDropDown();
    }

    if (this.thirdLanguageId === 0) {
      this.getThirdLanguageDropDown();
    }

    if (this.fourthLanguageId === 0) {
      this.getFourthLanguageDropDown();
    }

    this.fifthLanguageDiv = true;
    this.addFifthLanguageDiv = false;
  }

  saveDemographicDetails() {
    if (!this.isDemographicDetailsBtnClicked) {
      this.isDemographicDetailsBtnClicked = true;
      // tslint:disable-next-line:radix
      const id = parseInt(localStorage.getItem('LoggedId'));
      this.iAboutUsModel.contactId = id;
      this.iAboutUsModel.companyId = this.iContactViewModel.companyId;
      // this.iAboutUsModel.supplierType = this.supplierTypeViewModel;
      this.iAboutUsModel.supplierType = this.iSupplierTypeViewModel;
      this.iAboutUsModel.isBuyer = false;
      this.iLanguageViewModel.languageId = this.firstLanguageId;
      this.iAboutUsModel.languages = [];
      this.iAboutUsModel.languages.push(this.iLanguageViewModel);
      this.resetLanguageViewModel();

      if (this.secondLanguageDiv === true) {
        this.iLanguageViewModel.languageId = this.secondLanguageId;
        this.iAboutUsModel.languages.push(this.iLanguageViewModel);
        this.resetLanguageViewModel();
      }

      if (this.thirdLanguageDiv === true) {
        this.iLanguageViewModel.languageId = this.thirdLanguageId;
        this.iAboutUsModel.languages.push(this.iLanguageViewModel);
        this.resetLanguageViewModel();
      }

      if (this.fourthLanguageDiv === true) {
        this.iLanguageViewModel.languageId = this.fourthLanguageId;
        this.iAboutUsModel.languages.push(this.iLanguageViewModel);
        this.resetLanguageViewModel();
      }

      if (this.fifthLanguageDiv === true) {
        this.iLanguageViewModel.languageId = this.fifthLanguageId;
        this.iAboutUsModel.languages.push(this.iLanguageViewModel);
        this.resetLanguageViewModel();
      };
      this._SupplierService.updateCompanyDemographics(this.iAboutUsModel).subscribe(
        result => {
          this.iAboutUsModel = result;
          if (this.iAboutUsModel.result) {
            this._toastr.success(this.iAboutUsModel.errorMessage, 'Success');
            this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
            this.closePartDrawer();
            this.profileChanges.emit(true);
          } else {
            this._toastr.error(this.iAboutUsModel.errorMessage, 'Error');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );

    }

  }

  resetLanguageViewModel() {
    this.iLanguageViewModel = {
      languageId: 0,
      languageName: '',
      languageAbr: '',
      charset: '',
      localeCode: '',
      hide: false,
      translated: false,
      errorMessage: '',
      result: false
    };
  }

  deleteSecondLanguage() {
    this.secondLanguageDiv = false;
    this.addSecondLanguageDiv = true;
    this.secondLanguage = '';
  }
  deleteThirdLanguage() {
    this.thirdLanguageDiv = false;
    this.addThirdLanguageDiv = true;
    this.thirdLanguage = '';

  }

  deleteFourthLanguage() {
    this.fourthLanguageDiv = false;
    this.addFourthLanguageDiv = true;
    this.fourthLanguage = '';
  }
  deleteFifthLanguage() {
    this.fifthLanguageDiv = false;
    this.addFifthLanguageDiv = true;
    this.fifthLanguage = '';
  }

  getSelectedLanguages($event, languageId) {
    this.selectedLanguageId.push(languageId);

    if (this.firstLanguageId === 0) {
      this.getLanguages();
    }

    if (this.secondLanguageId === 0) {
      this.getSecondLanguageDropDown();
    }

    if (this.thirdLanguageId === 0) {
      this.getThirdLanguageDropDown();
    }

    if (this.fourthLanguageId === 0) {
      this.getFourthLanguageDropDown();
    }

    if (this.fifthLanguageId === 0) {
      this.getFifthLanguageDropDown();
    }

  }

  isCertificatesReady() {
    let isCertificatesReady = false;
    if (this.CertificationselectedItems.length && this.CertificationselectedItems[0].certificateId && this.certificateDate1 &&
      (this.certificateAttacghmentFileName1 !== '' || this.isITARCertificate1Selected == true)) {
      if (!this.secondCertificateDiv && !this.thirdCertificateDiv && !this.fourthCertificateDiv && !this.fifthCertificateDiv) {
        isCertificatesReady = true;
      } else {
        if (this.secondCertificateDiv) {
          if (this.CertificationselectedItems2.length && this.CertificationselectedItems2[0].certificateId && this.certificateDate2 &&
            (this.certificateAttacghmentFileName2 !== '' || this.isITARCertificate2Selected == true)) {
            isCertificatesReady = true;
          }
        }

        if (this.thirdCertificateDiv) {
          if (this.CertificationselectedItems3.length && this.CertificationselectedItems3[0].certificateId && this.certificateDate3 &&
            (this.certificateAttacghmentFileName3 !== '' || this.isITARCertificate3Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.fourthCertificateDiv) {
          if (this.CertificationselectedItems4.length && this.CertificationselectedItems4[0].certificateId && this.certificateDate4 &&
            (this.certificateAttacghmentFileName4 !== '' || this.isITARCertificate4Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.fifthCertificateDiv) {
          if (this.CertificationselectedItems5.length && this.CertificationselectedItems5[0].certificateId && this.certificateDate5 &&
            (this.certificateAttacghmentFileName5 !== '' || this.isITARCertificate5Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.sixthCertificateDiv) {
          if (this.CertificationselectedItems6.length && this.CertificationselectedItems6[0].certificateId && this.certificateDate6 &&
            (this.certificateAttacghmentFileName6 !== '' || this.isITARCertificate6Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.seventhCertificateDiv) {
          if (this.CertificationselectedItems7.length && this.CertificationselectedItems7[0].certificateId && this.certificateDate7 &&
            (this.certificateAttacghmentFileName7 !== '' || this.isITARCertificate7Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.eightCertificateDiv) {
          if (this.CertificationselectedItems8.length && this.CertificationselectedItems8[0].certificateId && this.certificateDate8 &&
            (this.certificateAttacghmentFileName8 !== '' || this.isITARCertificate8Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.ninethCertificateDiv) {
          if (this.CertificationselectedItems9.length && this.CertificationselectedItems9[0].certificateId && this.certificateDate9 &&
            (this.certificateAttacghmentFileName9 !== '' || this.isITARCertificate9Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
        if (this.tenthCertificateDiv) {
          if (this.CertificationselectedItems10.length && this.CertificationselectedItems10[0].certificateId && this.certificateDate10 &&
            (this.certificateAttacghmentFileName10 !== '' || this.isITARCertificate10Selected == true)) {
            isCertificatesReady = true;
          } else {
            isCertificatesReady = false;
          }
        }
      }
    }
    return isCertificatesReady;
  }

  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
            // if (fileName) {
            //   const filenNameArray = fileName.split('_S3_');
            //   if (filenNameArray.length === 1) {
            //     fileName = filenNameArray[0];
            //   } else {
            //     fileName = filenNameArray[1];
            //   }
            // }
            link.download = fileName;
          }
          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
      }
    });
  }


  onSaveContactInfo() {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      this._profileService.updateProfileInfo(this.iContactViewModel).subscribe(
        result => {
          this.iContactViewModel = result;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          if (this.iContactViewModel.result === true) {
            this._toastr.success(this.iContactViewModel.errorMessage, '');
            this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
            this.closePartDrawer();
            this.profileChanges.emit(true);
          } else {
            this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            // console.log(this.iContactViewModel.errorMessage);
          }
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

  getOriginalFineName(fileName) {
    if (fileName !== null) {
      const filenNameArray = (fileName).split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }
  isPremium() {
    // if (JSON.parse(localStorage.getItem('IsPremium'))) {
    //   return true;
    // } else {
    //   return false;
    // }
    return this._profileService.getAccountType();
  }


  onlyNumber(event: any) {
    const pattern = /^[0-9]+$/i;
    const inputChar = this.iAboutUsModel.dunsNumber;
    const isSuccess = pattern.test(inputChar);
    if (!isSuccess) {
      // invalid character, prevent input
      // this.iAboutUsModel.dunsNumber = '';
      this.iAboutUsModel.dunsNumber = this.iAboutUsModel.dunsNumber.slice(0, -1);
      this.iserror = false;
      // event.preventDefault();
    } else {
      this.iserror = true;
    }
  }

  setPhotoSequence() {
    console.log(this.photoIds);
    const photoObj = {
      fileIds: this.photoIds,
    };
    this._SupplierService.setPhotoSequence(photoObj).subscribe(response => {
      if (response.isError) {
        this._toastr.error(response.message, 'Error !');
      }
    });
  }
  removeEquipmentFile() {
    this.equipmentFile = [];
    let index = this.iAboutUsModel.equipments.findIndex(x => x.isFile == true && x.isDeleted == false);
    if (index !== -1) {
      this.iAboutUsModel.equipments[index].isDeleted = true;
    }
  }
}
