import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import {
  IAboutUsViewModel, IEquipmentViewModel, ISpecialFilesViewModel,
  IcompanyCertificateViewModel,
  ICertificationViewModel,
  ILanguageViewModel
} from '../../../../../core/models/supplierProfileModel';

import { CustomValidatorService } from '../../../../../core/services/validator/custom-validator.service';
import { FileUploader } from 'ng2-file-upload';
import { Http, Headers } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { ICompanyModel, IContactViewModel, ILanguageModel } from '../../../../../core/models/accountModel';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { environment } from '../../../../../../environments/environment';
import { MasterService } from '../../../../../core/services/master/master.service';
import { SupplierTypeViewModel, EmployeesCountRangeViewModel, IIndustryBranchesModel } from '../../../../../core/models/globalMaster';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { uploadFileNDA } from '../../../../../../constants/url-constant';
const URL = '';
@Component({
  selector: 'app-edit-buyer-about-us',
  templateUrl: './edit-buyer-about-us.component.html',
  styleUrls: ['./edit-buyer-about-us.component.scss']
})
export class EditBuyerAboutUsComponent implements OnInit {

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
  iAboutUsViewModel: IAboutUsViewModel;
  iEquipmentViewModel: IEquipmentViewModel;
  iCompanyViewModel: ICompanyModel;
  iContactViewModel: IContactViewModel;
  labelFocus: string;
  iSupplierTypeViewModel: SupplierTypeViewModel;

  equipmentForm: FormGroup;
  isEqupimentFormActive: boolean;
  iserror: boolean;
  gallaryItemUploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

  companyDescriptionForm: FormGroup;
  iSpecialFilesViewModel: ISpecialFilesViewModel;
  iSpecialFilesViewModelColl: ISpecialFilesViewModel[];
  isFileUpladed: boolean;
  isFileUpladed1: boolean;
  isFileUpladed2: boolean;
  isFileUpladed3: boolean;
  isFileUpladed4: boolean;
  isFileUpladed5: boolean;
  isLoder: boolean;
  compId: number;
  specialFileCount: number;
  isRenameMode: boolean;
  renameModeObj: ISpecialFilesViewModel;
  defaultAwsPath = '';
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

  certificationForm: FormGroup;
  firstCertificate: number;
  secondCertificate: number;
  thirdCertificate: number;
  fourthCertificate: number;
  fifthCertificate: number;
  secondCertificateDiv: boolean;
  thirdCertificateDiv: boolean;
  fourthCertificateDiv: boolean;
  fifthCertificateDiv: boolean;
  addSecondCertificateDiv: boolean;
  addThirdCertificateDiv: boolean;
  addFouthCerftificateDiv: boolean;
  addFifthCerftificateDiv: boolean;
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
  buyerTypeViewModelColl: IIndustryBranchesModel[];
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

  isCompanyDesError: boolean = false;

  isSupplierTypeValid: boolean;

  isCompanyDesSubmitted: boolean = false;

  constructor(private _SupplierService: SupplierService, private _masterService: MasterService,
    private _fb: FormBuilder, private _toastr: ToastrService, private _profileService: ProfileService,
    private _customValidatorsService: CustomValidatorService, private _Http: Http, private _rfqService: RfqService) {
    this.deleteEquipmentCount = 0;
    this.iserror = true;
    this.uploadGallaryItem1();
    this.uploadGallaryItem2();
    this.uploadGallaryItem3();
    this.uploadGallaryItem4();
    this.uploadGallaryItem5();
    this.isLoder = true;
    this.isEqupimentFormActive = true;
    this.iEquipmentViewModel = {
      createDate: new Date(),
      equipmentId: 0,
      equipmentText: '',
      statusId: 0,
      tagSourceId: false,
      updateDate: new Date(),
      isDeleted: false
    };
    this.iAboutUsViewModel = {
      cageCode: '',
      companyId: 0,
      createdDate: new Date(),
      companyType: '',
      _3dTourUrl: '',
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
      _3dTourUrlList:[]
    };
    this.iCompanyViewModel = {
      companyId: 0,
      description: '',
      _3dTourUrl: '',
      dunsNumber: '',
      employeeCountRangeId: 1,
      employeeCountRange: '',
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
      contactIdEncrypt: '',
      comments: '',
      originalContactPictureFile: '',
        originalLogoOfCompany: '',
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
      isVisionUserRequest:false,
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
      name: '',
      _3dTourUrl: '',
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
      isFollowing: false ,
      companyURL: '',
      manufacturingLocation: '',
      isBuyer: false,
      _3dTourUrlList:[]
    };



    this.iCertificationViewModelColl = [];

    this.certificateViewModelList = [];
    this.iCertificationViewModelCollbycompany = [];
    this.firstCertificate = 0;
    this.secondCertificate = 0;
    this.thirdCertificate = 0;
    this.fourthCertificate = 0;
    this.fifthCertificate = 0;
    this.secondCertificateDiv = false;
    this.thirdCertificateDiv = false;
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.addSecondCertificateDiv = true;
    this.addThirdCertificateDiv = false;
    this.addFouthCerftificateDiv = false;
    this.addFifthCerftificateDiv = false;
    this.firstCertificate = 0;
    this.secondCertificate = 0;
    this.thirdCertificate = 0;
    this.fourthCertificate = 0;
    this.fifthCertificate = 0;
    this.secondCertificateDiv = false;
    this.thirdCertificateDiv = false;
    this.fourthCertificateDiv = false;
    this.fifthCertificateDiv = false;
    this.addSecondCertificateDiv = true;
    this.addThirdCertificateDiv = true;
    this.addFouthCerftificateDiv = true;
    this.addFifthCerftificateDiv = true;
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

  }
  keyUp(event: any) {
    const pattern = /^[a-z0-9]+$/i;
    const inputChar = this.iAboutUsModel.cageCode;
   const isSuccess = pattern.test(inputChar);
    if (!isSuccess) {
      // invalid character, prevent input
      this.iAboutUsModel.cageCode = '';
      event.preventDefault();
    }
}


onlyNumber(event: any) {
  const pattern = /^[0-9]+$/i;
  const inputChar = this.iAboutUsModel.dunsNumber;
 const isSuccess = pattern.test(inputChar);
  if (!isSuccess) {
    // invalid character, prevent input
    this.iAboutUsModel.dunsNumber = this.iAboutUsModel.dunsNumber.slice(0, -1);
    this.iserror = false;
    // event.preventDefault();
  } else {
    this.iserror = true;
  }


  // const regex = new RegExp("/^[0-9]+$/i");
  // const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  //   if (!regex.test(key)) {
  //      event.preventDefault();
  //      return false;
  //   }
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
  uploadGallaryItem1() {

    this.certificateUploader1.onAfterAddingFile = (fileItem) => {
      this.isFileUpladed1 = true;
      if ((fileItem.file.type === 'application/pdf')) {
        const file = fileItem._file;
        this.upload(file)
          .subscribe(res => {
            const result = JSON.parse(res['_body']);
            const fNmae = result['fileName'];
            // this.certificateAttacghmentFileName1 = fileItem._file.name;
            this.certificateAttacghmentFileName1 = fNmae;
            this.isFileUpladed1 = false;
          }, error => {
            this.isFileUpladed1 = false;
            this._rfqService.handleError(error);
          }, () => {
          });
        fileItem.withCredentials = false;
      } else {
        this.isFileUpladed1 = false;
        this._toastr.error('Please upload Pdf files only', 'Error!');
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
          }, () => {
          });
        fileItem.withCredentials = false;
      } else {
        this.isFileUpladed2 = false;
        this._toastr.error('Please upload Pdf files only', 'Error!');
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
          }, () => {
          });
        fileItem.withCredentials = false;
      } else {
        this.isFileUpladed3 = false;
        this._toastr.error('Please upload Pdf files only', 'Error!');
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
          }, () => {
          });
        fileItem.withCredentials = false;
      } else {
        this.isFileUpladed4 = false;
        this._toastr.error('Please upload Pdf files only', 'Error!');
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
          }, () => {
          });
        fileItem.withCredentials = false;
      } else {
        this.isFileUpladed5 = false;
        this._toastr.error('Please upload Pdf files only', 'Error!');
      }
    };
  }

  setProperDate(d: Date) {
    if (d !== null) {
      const  abc = new Date(d);
      return new Date(Date.UTC(abc.getFullYear(),
      abc.getMonth(), abc.getDate()));
    }
  }
  ngOnInit() {
    this.createCompanyDescriptionForm();
    this.initequipmentForm();
    this.getProfileDetails();
    this.getLanguages();
    // this.getCompanytypes();
    this.GetCompanyTypesForBuyers();
    this.getEmployeeRange();
    this.initSpecialFilesViewModel();
    this.initRenameModeObjModel();
    this.getCertificateList();
    this.getCertificateListbycompanyid();
    this.CertificationselectedItems = [];
    this.CertificationselectedItems2 = [];
    this.CertificationselectedItems3 = [];
    this.CertificationselectedItems4 = [];
    this.CertificationselectedItems5 = [];
  }
  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  checkIfLabelNeeded(labelName: string) {
    return this.renameModeObj[labelName] !== '';
  }
  createCompanyDescriptionForm() {
    this.iCompanyViewModel.description = this._SupplierService.get('companyDescriptionValue');
    this.companyDescriptionForm = this._fb.group({
      description: [this.iCompanyViewModel['description'], Validators.required]
    });
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.companyDescriptionForm,
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
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.getLanguages();
        resolve(null);
      }, 1000);
    });
    return promise;
  }
  getProfileDetails() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
      this.doAsyncTask().then(()=>{
        this.getAllSpecialFiles(this.compId);
      });
    } else {
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          this.doAsyncTask().then(()=>{
            this.getAllSpecialFiles(this.compId);
          });
        },
        error => {
          this._rfqService.handleError(error);
          this.isLoder = false;
        },
        () => { }
      );
    }
  }
  editCompanyDescription() {
    if(!this.isCompanyDesSubmitted){
      this.isCompanyDesSubmitted = true;
      if (this.iCompanyViewModel.description !== '' && this.iCompanyViewModel.description !== null) {
        const decLength = this.iCompanyViewModel.description.trim().length;
        if (decLength > 4000) {
          this._toastr.error('Company Description should be less than 4000 Characters', 'Error!');
          this.isCompanyDesSubmitted = false;
        } else {
        this.iCompanyViewModel.companyId = this.iContactViewModel.companyId;
        this._SupplierService.editCompanyDescription(this.iCompanyViewModel).subscribe(
          result => {
            this.iCompanyViewModel = result['data'];
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], 'Success!');
              this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
              localStorage.setItem('isCompanyProfileFilled', 'true');
              this.closePartDrawer();
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
            this.isCompanyDesSubmitted = false;
          },
          error => {
            this.isCompanyDesSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
    } else {
      this.isCompanyDesError = true;
      this.isCompanyDesSubmitted = false;
    }
  }
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
    const control = <FormArray>this.equipmentForm.controls['equipments'];
    if (this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 0) {
      this.iAboutUsModel.equipments.forEach(x => {
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
      });
    } else {
      // tslint:disable-next-line:max-line-length
      (<FormArray>this.equipmentForm.controls['equipments']).push(
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
    const control = <FormArray>this.equipmentForm.controls['equipments'];
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

  deleteQuantity(index) {
    const control = <FormArray>this.equipmentForm.controls['equipments'];
    if (control.controls[index].value.equipmentId === 0) {
      control.removeAt(index);
    } else {
      this.iAboutUsModel.equipments[index].isDeleted = true;
      // control.controls[index].value.isDeleted = true;
      this.deleteEquipmentCount = this.deleteEquipmentCount + 1;
    }
    if ((control.controls.length - this.deleteEquipmentCount) === 0) {
      this.addNewQuantity();
    }
  }
  validateQuantityList(): boolean {
    const quantityArr = <FormArray>this.equipmentForm.controls['equipments'];
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

  isCountFive() {
    let eleCount = this.equipmentForm.value.equipments.length;
    for (let i = 0; this.equipmentForm.value.equipments.length; i++) {
      if (this.iAboutUsModel.equipments[i].isDeleted === true) {
        eleCount = eleCount - 1;
      }
    }
    return eleCount > 4;
  }

  saveEquipment() {
    const isEquipmentValid = this.validateQuantityList();
    if (isEquipmentValid) {
      this.iAboutUsViewModel.equipments = this.equipmentForm.value.equipments;
      for (let i = 0; i < this.iAboutUsModel.equipments.length; i++) {
        if (this.iAboutUsModel.equipments[i].isDeleted === true) {
          this.iAboutUsViewModel.equipments[i].isDeleted = true;
        }
      }
      if (this.iContactViewModel.companyId === null || this.iContactViewModel.companyId === 0) {
        this._toastr.warning('Please update Company details first from Contact Information section', 'Warning!');
      } else {
        this.iAboutUsViewModel.companyId = this.iContactViewModel.companyId;
        this.iAboutUsViewModel.contactId = this.iContactViewModel.contactId;

        this._SupplierService.addSupplierEquipment(this.iAboutUsViewModel).subscribe(
          result => {
            // this.iAboutUsViewModel = result;
            if (result['result'] === true) {
              this._toastr.success(result['errorMessage'], '');
              this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
              this.closePartDrawer();
            } else {
              this._toastr.error(result['errorMessage'], 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
    } else {
      this._customValidatorsService.validateAllFormFields(this.equipmentForm);
    }
  }

  iscompanyEquipment() {
    return this._SupplierService.get('companyEquipment');
  }
  iscompanyDescription() {
    return this._SupplierService.get('companyDescription');
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
  closePartDrawer(isCancled?) {
    if (isCancled) {
      this._SupplierService.set(true, 'editHeaderCancelWarning');
    } else {
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
      if (fileItem.file.size > (500 * 1024 * 1024)) {
        this._toastr.error('Please select file with file size upto 500MB', 'Error!');
      } else {
        if ((fileItem.file.type === 'image/jpeg') || (fileItem.file.type === 'image/jpg')
          || (fileItem.file.type === 'image/png') || (fileItem.file.type === 'video/mp4')
          || (fileItem.file.type === 'video/x-m4v')) {
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
                  this.specialFileCount++;
                  this.getAllSpecialFiles(this.iContactViewModel.companyId);
                } else {
                  // console.log('Error: ', result2.errorMessage);
                  this._toastr.error(result2.errorMessage, 'Error!');
                  this.isFileUpladed = false;
                }
              }, error => {
                this._rfqService.handleError(error);
                this.isFileUpladed = false;
              }, () => {
              });
            }, error => {
              this._rfqService.handleError(error);
              this.isFileUpladed = false;
            }, () => {
            });
          fileItem.withCredentials = false;
          this.isFileUpladed = true;
        } else {
          this._toastr.error('Please jpg, png, mp4 and mov file only', 'Error!');
        }
      }
    };
  }

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
    } else if (!this.renameModeObj.fileTitle || (this.renameModeObj.fileTitle === '') || !this.renameModeObj.fileCaption
      || (this.renameModeObj.fileCaption === '')) {
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
        this.getAllSpecialFiles(this.iContactViewModel.companyId);
      } else {
        this._toastr.error(result2.errorMessage, 'Error!');
        this.isFileUpladed = false;
      }
    }, error => {
      this._rfqService.handleError(error);
      this.isFileUpladed = false;
    }, () => {
    });
  }

  // filterDeleted() {
  //   return this.iAboutUsViewModel.specialFiles.filter(x => x.isDeleted === false);
  // }

  deleteImage(imgFileIndex) {
    const tempObj = this.iAboutUsModel.specialFiles[imgFileIndex];
    tempObj.isDeleted = true;
    tempObj.fileName = tempObj.s3FileName;
    this._SupplierService.addSpecialFile(tempObj).subscribe(result2 => {
      if (result2.result === true) {
        this.specialFileCount++;
        this.clearFileRenameDrawer();
        this.getAllSpecialFiles(this.iContactViewModel.companyId);
      } else {
        // console.log('Error: ', result2.errorMessage);
        this._toastr.error(result2.errorMessage, 'Error!');
        this.isFileUpladed = false;
      }
    }, error => {
      this._rfqService.handleError(error);
      this.isFileUpladed = false;
    }, () => {
    });
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
      s3FileName : item.s3FileName
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
    if (this.iAboutUsViewModel.specialFiles.length >= 18) {
      this._toastr.error('Maximum files are uploaded', 'Error!');
    } else {
      this.uploadAnother = true;
    }
  }

  getAllSpecialFiles(compId) {
    const contactId = this.loggedId;
    if (this.iContactViewModel.companyId !== null && this.iContactViewModel.companyId !== 0) {
      // tslint:disable-next-line:max-line-length
      this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.iContactViewModel.contactId, this.iContactViewModel.isBuyer, this.loggedId).subscribe(
        result2 => {
          this.isFileUpladed = true;
          if (result2.result === true) {
            this.iAboutUsModel = result2['data'];
            //  console.log('abouyus',  this.iAboutUsModel);
            if(this.iAboutUsModel.specialFiles === null ) {
              this.iAboutUsModel.specialFiles = [];
            }
            this.isFileUpladed = false;
            if (this.iAboutUsModel.equipments === null) {
              this.iAboutUsModel.equipments = [];
            }
            if (this.iAboutUsModel.description === '' || this.iAboutUsModel.description === null ||
              this.iAboutUsModel.description === undefined) {
              this.iAboutUsModel.description = '';
            }
            if (!!this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 5) {
              this.iAboutUsModel.equipments = this.iAboutUsModel.equipments.slice(-5);
            }
            if (this.iAboutUsModel.languages === null) {
              this.iAboutUsModel.languages = [];
            }
            this.initequipmentForm();
            if (this.iAboutUsModel.languages !== null && this.iAboutUsModel.languages.length > 5) {
              this.iAboutUsModel.languages = this.iAboutUsModel.languages.slice(0, 5);
            }

            setTimeout(()=>{
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
              // console.log(this.iSupplierTypeViewModel.supplierTypeId, 'iSupplierTypeViewModel.supplierTypeId')
            }
            if (!!this.iAboutUsModel.specialFiles) {
              this.uploadAnother = false;
              // this.iAboutUsModel.specialFiles.forEach(element => {
              //   if (!!element.fileName && element.fileName.length > 0) {
              //     element.fileName = this.defaultAwsPath + element.fileName;
              //   }
              // });
              //this.iAboutUsModel.specialFiles = this.iAboutUsModel.specialFiles.slice(0, 6);
              // for (let i = 0; i < this.iAboutUsModel.specialFiles.length; i++) {
              //   const src = this.iAboutUsModel.specialFiles[i].fileName;
              //   const caption = 'Image ' + i + ' caption here';
              //   const thumb = this.iAboutUsModel.specialFiles[i].fileName;
              //   const album = {
              //     src: src,
              //     caption: caption,
              //     thumb: thumb
              //   };
              // //  this.albums.push(album);
              // }
            }
            this.isLoder = false;
          }
        }, error => {
          this._rfqService.handleError(error);
          this.isLoder = false;
        }, () => { }
      );
    }
  }

  getFileUrl(fileName) {
    return this.defaultAwsPath + fileName;
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
    //   || (!!this.renameModeObj.fileCaption && (this.renameModeObj.fileCaption !== ''))) {
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
      () => { }
    );

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
      () => { }
    );
    }
  }


  onPostCertificationProcess1(item: any) {
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
     if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems = [];
    } else if ( isExist2 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0) {
        this.iCertificationViewModelColl.values = item.certificateId;
      }  else {
        this._toastr.error('This certificate is already selected', 'Error!');
        this.CertificationselectedItems = [];
      }
  }
  onPostCertificationProcess2(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems2 = [];
    } else if (isExist1 === 0 && isExist3 === 0 && isExist4 === 0 && isExist5 === 0 ) {
         this.iCertificationViewModelColl.values = item.certificateId;
      } else {
        this._toastr.error('This certificate is already selected', 'Error!');
        this.CertificationselectedItems2 = [];
      }

  }
  onPostCertificationProcess3(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
   const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
   if (isExistinCompany1 !== 0) {
    this._toastr.error('This certificate is already Saved', 'Error!');
    this.CertificationselectedItems3 = [];
  } else if (isExist1 === 0 && isExist2 === 0  && isExist4 === 0 && isExist5 === 0 ) {
        this.iCertificationViewModelColl.values = item.certificateId;
      } else {
        this.CertificationselectedItems3 = [];
        this._toastr.error('This certificate is already selected', 'Error!');
      }
  //  this.iCertificationViewModelColl.values = item.certificateId;
  }
  onPostCertificationProcess4(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist5 = this.CertificationselectedItems5.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems4 = [];
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist5 === 0 ) {
        this.iCertificationViewModelColl.values = item.certificateId;
      } else {
        this._toastr.error('This certificate is already selected', 'Error!');
        this.CertificationselectedItems4 = [];
      }
  //  this.iCertificationViewModelColl.values = item.certificateId;
  }
  onPostCertificationProcess5(item: any) {
    const isExist1 = this.CertificationselectedItems.filter(m => m.certificateId === item.certificateId).length;
    const isExist2 = this.CertificationselectedItems2.filter(m => m.certificateId === item.certificateId).length;
    const isExist3 = this.CertificationselectedItems3.filter(m => m.certificateId === item.certificateId).length;
    const isExist4 = this.CertificationselectedItems4.filter(m => m.certificateId === item.certificateId).length;
    const isExistinCompany1 = this.iCertificationViewModelCollbycompany.filter(m => m.certificateId === item.certificateId).length;
    if (isExistinCompany1 !== 0) {
      this._toastr.error('This certificate is already Saved', 'Error!');
      this.CertificationselectedItems5 = [];
    } else if (isExist1 === 0 && isExist2 === 0 && isExist3 === 0 && isExist4 === 0) {
        this.iCertificationViewModelColl.values = item.certificateId;
      } else {
        this._toastr.error('This certificate is already selected', 'Error!');
        this.CertificationselectedItems5 = [];
      }
   // this.iCertificationViewModelColl.values = item.certificateId;
  }
  addSecondCertficate() {
    this.secondCertificateDiv = true;
    this.addSecondCertificateDiv = false;
    this.addThirdCertificateDiv = true;
    this.addFouthCerftificateDiv = true;
    this.addFifthCerftificateDiv = true;
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





  saveCetifications() {
    if (this.iContactViewModel.companyId === null || this.iContactViewModel.companyId === 0) {
      this._toastr.warning('Please update Company details first from Contact Information section', 'Warning!');
    } else {
      this.icompanyCertificateViewModelColl = [];
      this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
      this.icompanyCertificateViewModel.creationDate = this.setProperDate(this.certificateDate1);
      this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems[0].certificateId;
      this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName1;
      this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
      this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
      this.closePartDrawer();
      if (this.secondCertificateDiv) {
        this.initCertificateModel();
        this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
        this.icompanyCertificateViewModel.creationDate = this.setProperDate(this.certificateDate2);
        this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems2[0].certificateId;
        this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName2;
        this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
        this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
            }
      if (this.thirdCertificateDiv) {
        this.initCertificateModel();
        this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
        this.icompanyCertificateViewModel.creationDate = this.setProperDate(this.certificateDate3);
        this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems3[0].certificateId;
        this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName3;
        this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
        this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
      }
      if (this.fourthCertificateDiv) {
        this.initCertificateModel();
        this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
        this.icompanyCertificateViewModel.creationDate = this.setProperDate(this.certificateDate4);
        this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems4[0].certificateId;
        this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName4;
        this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
        this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
      }
      if (this.fifthCertificateDiv) {
        this.initCertificateModel();
        this.icompanyCertificateViewModel.companyId = this.iContactViewModel.companyId;
        this.icompanyCertificateViewModel.creationDate = this.setProperDate(this.certificateDate5);
        this.icompanyCertificateViewModel.certificatesId = this.CertificationselectedItems5[0].certificateId;
        this.icompanyCertificateViewModel.fileName = this.certificateAttacghmentFileName5;
        this.icompanyCertificateViewModel.creationContactId = this.iContactViewModel.contactId;
        this.icompanyCertificateViewModelColl.push(this.icompanyCertificateViewModel);
      }

      this._SupplierService.insertCertificates(this.icompanyCertificateViewModelColl).subscribe(
        result => {
          this.icompanyCertificateViewModel = result['data'];
          if (result['result'] === true) {
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
        () => { }
      );
    }

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


  // getCompanytypes() {
  //   this._masterService.getCompanyTypes().subscribe(
  //     (data: SupplierTypeViewModel[]) => {
  //       this.supplierTypeViewModelColl = data['data'];
  //     },
  //     error => () => {
  //       this._rfqService.handleError(error);
  //     }
  //   );
  // }
  GetCompanyTypesForBuyers() {
    this._masterService.GetCompanyTypesForBuyers().subscribe(
      (data: IIndustryBranchesModel[]) => {
        this.buyerTypeViewModelColl = data['data'];
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
    if (this.iContactViewModel.companyId === null || this.iContactViewModel.companyId === 0) {
      this._toastr.warning('Please update Company details first from Contact Information section', 'Warning!');
    } else {
      if (!this.isDemographicDetailsBtnClicked) {
        this.isDemographicDetailsBtnClicked = true;
        // tslint:disable-next-line:radix
        const id = parseInt(localStorage.getItem('LoggedId'));
        this.iAboutUsModel.contactId = id;
        this.iAboutUsModel.companyId = this.iContactViewModel.companyId;
        // this.iAboutUsModel.supplierType = this.supplierTypeViewModel;
        this.iAboutUsModel.supplierType = this.iSupplierTypeViewModel;
        this.iAboutUsModel.isBuyer = true;
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
        }

        this._SupplierService.updateCompanyDemographics(this.iAboutUsModel).subscribe(
          result => {
            this.iAboutUsModel = result;
            if (this.iAboutUsModel.result) {
              this._toastr.success(this.iAboutUsModel.errorMessage, 'Success');
              this._SupplierService.set(true, 'aboutUsDrawerDataSaved');
              this.closePartDrawer();
            } else {
              this._toastr.error(this.iAboutUsModel.errorMessage, 'Error');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      }
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
      this.secondLanguageId = 0;
      this.addSecondLanguageDiv = true;
      this.secondLanguage = '';
  }
  deleteThirdLanguage() {
      this.thirdLanguageDiv = false;
      this.thirdLanguageId = 0;
      this.addThirdLanguageDiv = true;
      this.thirdLanguage = '';
  }

  deleteFourthLanguage() {
      this.fourthLanguageDiv = false;
      this.fourthLanguageId = 0;
      this.addFourthLanguageDiv = false;
      this.fourthLanguage = '';

  }
  deleteFifthLanguage() {
    this.fifthLanguageDiv = false;
    this.fifthLanguageId = 0;
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
    if (this.CertificationselectedItems.length && this.CertificationselectedItems[0].certificateId && this.certificateDate1
      && (this.certificateAttacghmentFileName1 !== '')) {
      if (!this.secondCertificateDiv && !this.thirdCertificateDiv && !this.fourthCertificateDiv && !this.fifthCertificateDiv) {
        isCertificatesReady = true;
      } else {
        if (this.secondCertificateDiv) {
          if (this.CertificationselectedItems2.length && this.CertificationselectedItems2[0].certificateId && this.certificateDate2
            && (this.certificateAttacghmentFileName2 !== '')) {
            isCertificatesReady = true;
          }
        }
        if (this.thirdCertificateDiv) {
          if (this.CertificationselectedItems3.length && this.CertificationselectedItems3[0].certificateId && this.certificateDate3
            && (this.certificateAttacghmentFileName3 !== '')) {
            isCertificatesReady = true;
          }
        }
        if (this.fourthCertificateDiv) {
          if (this.CertificationselectedItems4.length && this.CertificationselectedItems4[0].certificateId && this.certificateDate4
            && (this.certificateAttacghmentFileName4 !== '')) {
            isCertificatesReady = true;
          }
        }
        if (this.fifthCertificateDiv) {
          if (this.CertificationselectedItems5.length && this.CertificationselectedItems5[0].certificateId && this.certificateDate5
            && (this.certificateAttacghmentFileName5 !== '')) {
            isCertificatesReady = true;
          }
        }
      }
    }
    return isCertificatesReady;
  }
  getOriginalFineName (fileName) {
    if (fileName !== null) {
      const filenNameArray = (fileName).split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }


   blockSpecialChar(e){
        let k;
        document.all ? k = e.keyCode : k = e.which;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
        }
}
