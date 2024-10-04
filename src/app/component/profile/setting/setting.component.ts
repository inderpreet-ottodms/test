import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';
import {
  HttpClient
} from '@angular/common/http';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Http,
  Headers
} from '@angular/http';
import {
  FileUploader,
  FileUploaderOptions
} from 'ng2-file-upload';
import {
  ISettingsNotificationModel,
  INDAViewModel,
  IPaymentTermModel,
  IPreferrenceModel,
  IPreferredLocationModel
} from '../../../core/models/settingsModel';
import {
  ProfileService
} from '../../../core/services/profile/profile.service';
import {
  CustomValidatorService
} from '../../../core/services/validator/custom-validator.service';
import {
  SettingService
} from '../../../core/services/setting/setting.service';
import {
  ITerritoryClassificationModel,
  ITerritoryClassificationNames
} from '../../../core/models/rfqModel';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  environment
} from '../../../../environments/environment';
import {
  IContactViewModel
} from '../../../core/models/accountModel';
import {
  AccountService
} from '../../../core/services/account/account.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  Router
} from '@angular/router';
import {
  ConfirmationService
} from 'primeng/api';
const uploadOptions: FileUploaderOptions = {
  allowedMimeType: ['application/pdf'],
};
import { uploadFileNDA } from '../../../../constants/url-constant';
function validateOldEmail(control: FormControl) {
  let userEmail = localStorage.getItem('User2');
  let email = control.value;
  if (email && email.toLocaleLowerCase() != userEmail.toLocaleLowerCase()) {
    return null;
  } else {
    return {
      validateEmail: {
        valid: false
      }
    }
  }

}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: [
    './setting.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ],
  providers: [ConfirmationService]
})
export class SettingComponent implements OnInit {
  public uploader: FileUploader = new FileUploader(uploadOptions);
  @ViewChild('fileInput', { read: ElementRef }) fileInput;
  ipreferenceModel: IPreferrenceModel;
  _ipreferenceForm: IPreferrenceModel;
  oldShiing: boolean;
  ipreferredLocationModel: IPreferredLocationModel;
  ipaymentTermModel: IPaymentTermModel;
  iContactViewModel: IContactViewModel;
  onLoadChangePasswordModule: IContactViewModel;
  settingPreferenceForm: FormGroup;
  ipreferredLocationIds = [];
  iPaymentTermModel: IPaymentTermModel[];
  activeTab: number;
  currentTab;
  showDashboard: boolean;
  iSettingsNotificationModel: ISettingsNotificationModel;
  iNDAViewModel: INDAViewModel;
  notificationsForm: FormGroup;
  isRegisterRePasswordError: boolean;
  changePasswordForm: FormGroup;
  changeUsernameForm: FormGroup;
  oappendText: string;
  appendText: string;
  ndaForm: FormGroup;
  isformval: boolean;
  hasError: boolean;
  isNotificationValid: boolean;
  defaultNdaMessage: string;
  customNdaFileName: string;
  disableSettingBtn: boolean;
  ndaFileName: string;
  isFileNotPDF = false;
  isFileSelected = true;
  constManufactLocationCodeColl = ['0', '1', '2', '3', '4', '5', '6', '7'];
  isSupplier: boolean;
  isRoleCount: any;
  isFileAvilable: boolean;
  inviteuser: boolean;
  inviteuser1 = false;
  ITerritoryClassificationModelColl: ITerritoryClassificationModel[];
  iTerritoryClassificationNames: ITerritoryClassificationNames;
  isNDAbutton = true;
  termConditionFileName: string = null;
  termConditionFile: string = null;
  isMQSEnable;
  isLoader: boolean;
  isFileDownloaded: number;
  isPreferenceSubmitted: boolean = false;
  isNotificationSubmitted: boolean = false;
  isPasswordSubmitted: boolean = false;
  isUsernameSubmitted: boolean = false;
  isEmailUpdated: boolean = false;
  oldLocationValue:any='';
  locationId: any = [];
  ratingMailForm: FormGroup;
  items: FormArray;
  constructor(
    private _rfqService: RfqService, private _fb: FormBuilder, private _httpClient: HttpClient, private _profileService: ProfileService,
    private _customValidatorsService: CustomValidatorService, private _toastr: ToastrService, private _settingService: SettingService,
    private _AccountService: AccountService, private _masterService: MasterService, private router: Router, private _Http: Http,
    private confirmationService: ConfirmationService
  ) {
    this.initModels();
    this.initNotificationModels();
    this.initLocationModels();
    this.createForm();
    this.oldShiing = null;

    this.createPreferenceForm();
    this.createNotificationForm();
    const role = localStorage.getItem('Usertype');
    if (role === 'Supplier') {
      this.isSupplier = true;
    } else {
      this.isSupplier = false;
    }
    this.isFileDownloaded = 0;
  }

  ngOnInit() {
    this.ratingMailForm = this._fb.group({
      items: this._fb.array([this.createItem()])
    });
    this.appendText = '...';
    this.isLoader = false;
    this.isMQSEnable = localStorage.getItem('isMqsEnabled');
    if (this.isMQSEnable == 'true') {
      this.currentTab='tab4default';
      this.activeTab = 4;
    } else {
      this.currentTab='tab1default'
      this.activeTab = 1;
    }
    this.getSettingPreference();
    this.initializeModel();
    this.getBuyerLocation();
    this.getNdaInfo();
    this.getNotificationSettings();
    this.checkForms();
    this.getCustomNda();
    this.getTermCondition();



    this.uploader.onAfterAddingFile = (fileItem) => {
      // console.log(fileItem);
      if ((fileItem.file.type === 'application/pdf')) {
        this.isLoader = true;
        this.upload(fileItem._file).subscribe(
          res => {
            const result = JSON.parse(res['_body']);
            // this.logoImage = result.privateFileFileName;
            console.log(result);
            // let fileName = result.fileName;
            // let privateFileFileName = result.privateFileFileName;
            this.setQmsTeamCondition(result.fileName);
          }
        );
      } else {
        this._toastr.warning('Please attached PDF files only', 'Warning!');
        this.isLoader = false;
      }

    };

  }

  addItem() {
    this.items = this.ratingMailForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  removeItem(index) {
    this.items = this.ratingMailForm.get('items') as FormArray;
    this.items.removeAt(index);
     //this.getSettingPreference();
  }



  createItem(): FormGroup {
    return this._fb.group({
      email: ['' , Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)],
    });
  }
  setEmailItem(value): FormGroup {
    return this._fb.group({
      email: [value, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)],

    });
  }
  setEmailValue() {
  this.items =  this.ratingMailForm.get('items') as FormArray;
  this._ipreferenceForm.companyRatingPreferencesEmailList.forEach((element,index) => {
    if(index == 0) {
        this.items.controls[0].patchValue({
        'email': element
      });

     } else {
      this.items.push(this.setEmailItem(element));
     }

   });
  }
  getTermCondition() {
    this._settingService.getTermCondition(this.loggedCompanyId, this.loggedId).subscribe(
      res => {
        console.log(res);
        if (!res.isError) {
          if (res.data.termsConditionFileName) {
            this.termConditionFileName = this.getOriginalPartName(res.data.termsConditionFileName);
            this.termConditionFile = res.data.termsConditionFileName;
          }
        }
      }
    );
  }

  setQmsTeamCondition(file) {
    let fileObj = {
      termsConditionFileName: file,
      contactId: this.loggedId,
      companyId: this.loggedCompanyId
    };
    this._settingService.setQmsTeamCondition(fileObj).subscribe(
      res => {
        console.log(res);
        this.getTermCondition();
        this.isLoader = false;
      }
    );
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  initializeModel() {
    this.iTerritoryClassificationNames = {
      territoryClassificationName2: '',
      territoryClassificationName3: '',
      territoryClassificationName4: '',
      territoryClassificationName5: '',
      territoryClassificationName6: '',
      territoryClassificationName7: ''
    };
  }
  
  addClass(id) {
       this.activeTab = id;
    this.isFileSelected = true;
    this.currentTab="tab"+id+"default";
  }

  getCustomNda() {
    this._settingService.getCustomNda().subscribe(
      (data) => {
        this.defaultNdaMessage = data.toString();
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  isRegisterPasswordValid(field: string) {
    if (this._customValidatorsService.isPasswordValid(this.changePasswordForm, field)) {
      this.isRegisterRePasswordError = false;
    } else {
      this.isRegisterRePasswordError = true;
    }
    return this._customValidatorsService.isPasswordValid(this.changePasswordForm, field);
  }
  isRegisterPasswordValid1() {
    return this.isRegisterPasswordValid('newPassword');
  }


  checkForms() {
    const formvalue = JSON.stringify(this.notificationsForm.value);
    const formvalue2 = JSON.stringify(this.iSettingsNotificationModel);
    if (formvalue === formvalue2) {
      return true;
    } else {
      return false;
    }
  }
  initModels() {
    this.iNDAViewModel = {
      contactId: 0,
      ndaContent: '',
      ndaFile: '',
      ndaLevel: 0,
      errorMessage: '',
      fileId: 0,
      ndaId: 0,
      companyId: 0,
      rfqId: 0,
      fileType: '',
      isDefaultNDAdetails: false,
      result: false
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      website: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      addressId: 0,
      isLoginFromVision: false,
      contactIdEncrypt: '',
      comments: '',
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
      token: '',
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
      isVisionUserRequest: false,
      instagram: ''
    };
    this.onLoadChangePasswordModule = {
      isLike: false,
      accountEmail: '',
      website: '',
      addressId: 0,
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      contactIdEncrypt: '',
      comments: '',
      isLoginFromVision: false,
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
      token: '',
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
      isVisionUserRequest: false,
      instagram: ''
    };

    this.ipreferenceModel = {
      contactId: 0,
      isBuyerDashboard: true,
      timeFormat: '12H',
      prereredLocationIds: '',
      // paymentTermId: 'Net15',
      paymentTermId: 'Net30',
      errorMessage: '',
      result: false,
      isbuyerPayshipping: true,
      prefRfqCommunicationMethod: 120,
      companyRatingPreferencesEmailList:[]
    };
    this.ipaymentTermModel = {
      paymenOptionId: 1,
      // paymentOptionName: 'Net15',
      paymentOptionName: 'Net30',
    };
    this.ipreferredLocationModel = {
      isUSManufacturing: false,
      isMexicoManufacturing: false,
      isAsPacManufacturing: false,
      isEarthAll: false,
      isCanadaManufacturing: false,
      isEMEAManufacturing: false,
      isUsaCanadaManufacturing: false,
      buyerDashboard: 'manufacturing',
    };
  }

  initpreferenceModels() {
    this.ipreferenceModel = {
      contactId: 0,
      isBuyerDashboard: null,
      timeFormat: '12H',
      prereredLocationIds: '',
      // paymentTermId: 'Net15',
      paymentTermId: 'Net30',
      errorMessage: '',
      result: false,
      isbuyerPayshipping: null,
      prefRfqCommunicationMethod: 120,
    };
  }

  initLocationModels() {
    this.ipreferredLocationModel = {
      isUSManufacturing: true,
      isMexicoManufacturing: false,
      isAsPacManufacturing: false,
      isCanadaManufacturing: false,
      isEMEAManufacturing: false,
      isUsaCanadaManufacturing: false,
      isEarthAll: false,
      buyerDashboard: 'manufacturing',
    };
  }

  createForm() {
    this.ndaForm = this._fb.group({
      ndaContent: [this.iNDAViewModel['ndaContent'], Validators.required],
      ndaFile: [this.iNDAViewModel['ndaFile']],
      ndaLevel: [this.iNDAViewModel['ndaLevel'], Validators.required]
    });
    this.isFileSelected = true;

    this.changePasswordForm = this._fb.group({
      password: [this.iContactViewModel['password'], Validators.required],
      currentPassword: [this.iContactViewModel['currentPassword'], Validators.required],
      newPassword: [this.iContactViewModel['newPassword'], Validators.required]
    });
    this.onLoadChangePasswordModule.password = this.iContactViewModel['password'];
    this.onLoadChangePasswordModule.currentPassword = this.iContactViewModel['currentPassword'];
    this.onLoadChangePasswordModule.newPassword = this.iContactViewModel['newPassword'];

    this.changeUsernameForm = this._fb.group({
      setting_usernameNew: [null, [Validators.required, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/), validateOldEmail]],
      usernameRe: [null, [Validators.required, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)]]
    }, {
      validator: this.checkPasswords
    });
  }
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.setting_usernameNew.value;
    const confirmPass = group.controls.usernameRe.value;

    return pass === confirmPass ? null : {
      notSame: true
    };
  }
  createPreferenceForm() {
    this.settingPreferenceForm = this._fb.group({
      contactId: [this.iSettingsNotificationModel['contactId']],
      isBuyerDashboard: [this.ipreferenceModel['isBuyerDashboard']],
      timeFormat: [this.ipreferenceModel['timeFormat']],
      prereredLocationIds: [this.ipreferenceModel['prereredLocationIds']],
      paymentTermId: [this.ipreferenceModel['paymentTermId']],
      errorMessage: [this.ipreferenceModel['errorMessage']],
      isAsPacManufacturing: [this.ipreferredLocationModel['isAsPacManufacturing']],
      isMexicoManufacturing: [this.ipreferredLocationModel['isMexicoManufacturing']],
      isUSManufacturing: [this.ipreferredLocationModel['isUSManufacturing']],
      isCanadaManufacturing: [this.ipreferredLocationModel['isCanadaManufacturing']],
      isEMEAManufacturing: [this.ipreferredLocationModel['isEMEAManufacturing']],
      isUsaCanadaManufacturing: [this.ipreferredLocationModel['isUsaCanadaManufacturing']],
      isEarthAll: [this.ipreferredLocationModel['isEarthAll']],
      buyerDashboard: [this.ipreferredLocationModel['buyerDashboard']],
      result: [this.iSettingsNotificationModel['result']],
      isbuyerPayshipping: [this.ipreferenceModel['isbuyerPayshipping']],
      communicationPreference: [this.ipreferenceModel['prefRfqCommunicationMethod']],
    });
  }
  setBuyer() {
    this.ipreferenceModel.isbuyerPayshipping = true;
  }
  setSupplier() {
    this.ipreferenceModel.isbuyerPayshipping = false;
  }
  createNotificationForm() {
    this.notificationsForm = this._fb.group({
      contactId: [this.iSettingsNotificationModel['contactId']],
      isNotifyByEmail: [this.iSettingsNotificationModel['isNotifyByEmail']],
      awardConfirmations: [this.iSettingsNotificationModel['awardConfirmations']],
      newMessages: [this.iSettingsNotificationModel['newMessages']],
      newQuotes: [this.iSettingsNotificationModel['newQuotes']],
      ndAsToApprove: [this.iSettingsNotificationModel['ndAsToApprove']],
      orderStatusUpdates: [this.iSettingsNotificationModel['orderStatusUpdates']],
      ratingsToPerformReceived: [this.iSettingsNotificationModel['ratingsToPerformReceived']],
      isSendDailySummary: [this.iSettingsNotificationModel['isSendDailySummary']],
      isSystemMaintenanceAnnouncements: [this.iSettingsNotificationModel['isSystemMaintenanceAnnouncements']],
      isNewsletter: [this.iSettingsNotificationModel['isNewsletter']],
      isSpecialInvitations: [this.iSettingsNotificationModel['isSpecialInvitations']],
      isSendNotificationsAsHTML: [this.iSettingsNotificationModel['isSendNotificationsAsHTML']],
      errorMessage: [this.iSettingsNotificationModel['errorMessage']],
      result: [this.iSettingsNotificationModel['result']]
    });
  }
  isValueChanged(fromValue) {

    // this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');
      this.settingPreferenceForm.setValue({
        // tslint:disable-next-line:radix
        contactId: parseInt(localStorage.getItem('LoggedId')),
        isBuyerDashboard: this.settingPreferenceForm.value.isBuyerDashboard,
        timeFormat: this.settingPreferenceForm.value.timeFormat,
        prereredLocationIds: this.settingPreferenceForm.value.prereredLocationIds,
        paymentTermId: this.settingPreferenceForm.value.paymentTermId,
        errorMessage: [this.ipreferenceModel['errorMessage']],
        isAsPacManufacturing: this.settingPreferenceForm.value.isAsPacManufacturing,
        isMexicoManufacturing: this.settingPreferenceForm.value.isMexicoManufacturing,
        isUSManufacturing: this.settingPreferenceForm.value.isUSManufacturing,
        isCanadaManufacturing: this.settingPreferenceForm.value.isCanadaManufacturing,
        isEMEAManufacturing: this.settingPreferenceForm.value.isEMEAManufacturing,
        isUsaCanadaManufacturing:  this.settingPreferenceForm.value.isUsaCanadaManufacturing,
        isEarthAll: [this.ipreferredLocationModel['isEarthAll']],
        buyerDashboard: this.settingPreferenceForm.value.buyerDashboard,
        result: [this.iSettingsNotificationModel['result']],
        isbuyerPayshipping: this.settingPreferenceForm.value.isbuyerPayshipping,
        communicationPreference:  this.settingPreferenceForm.value.communicationPreference
      });
    const preferIds = this.generateCommSeptLocations();
    this.ipreferenceModel.prereredLocationIds = preferIds;
    // this.oldLocationValue=preferIds;
    this.disableSettingBtn = false;
    this.checkPreferenceForms();
  }
  checkPreferenceForms() {
    const formCntId = this.settingPreferenceForm.value.contactId;
    const formbuyerDashboard = this.settingPreferenceForm.value.buyerDashboard;
    const formdshboard = this.settingPreferenceForm.value.isBuyerDashboard;
    const formTimeftmt = this.settingPreferenceForm.value.timeFormat;
    const formPreId = this.ipreferenceModel.prereredLocationIds;
    const formresult = this.settingPreferenceForm.value.result;
    const formErrormsg = this.settingPreferenceForm.value.errorMessage;
    const formPayTerm = this.settingPreferenceForm.value.paymentTermId;
    const oldShipping = this.oldShiing;
    const oldCommunication = this.settingPreferenceForm.value.communicationPreference;

    const newbuyerDashboard = this.ipreferredLocationModel.buyerDashboard;
    const newShipping = this.ipreferenceModel.isbuyerPayshipping;
    const modelCntId = this.ipreferenceModel.contactId;
    const modeldshboard = this.ipreferenceModel.isBuyerDashboard;
    const modeltimeftmt = this.ipreferenceModel.timeFormat;
    const modelpreId = this.oldLocationValue;
    const modelResult = this.ipreferenceModel.result;
    const modelErrormsg = this.ipreferenceModel.errorMessage;
    const modelPayTerm = this.ipreferenceModel.paymentTermId;
    const newCommunication = this.ipreferenceModel.prefRfqCommunicationMethod;
    let formEmailData;
    let missing =[];
    if(this.items) {
      formEmailData = this.items.value.map(x=>x.email);
       missing = formEmailData.filter(item => this.ipreferenceModel.companyRatingPreferencesEmailList.indexOf(item) < 0);
    }
    let missingData =[];
    if(this.ipreferenceModel.companyRatingPreferencesEmailList) {
     missingData = this.ipreferenceModel.companyRatingPreferencesEmailList.filter(item =>formEmailData.indexOf(item) < 0);
    }


    if (this.ratingMailForm.valid === false ||(missing.length == 0 &&  missingData.length == 0) && formdshboard === modeldshboard &&
      oldShipping === newShipping && formbuyerDashboard === newbuyerDashboard &&
      formTimeftmt === modeltimeftmt && formPreId === modelpreId && formPayTerm === modelPayTerm && oldCommunication === newCommunication) {
      this.disableSettingBtn = true;
      return true;
    } else {
      this.disableSettingBtn = false;
      return false;
    }
  }
  removeNdaFile(fileToRemove) {
    this._settingService.removeCustomNDAfromRFQ(fileToRemove, this.iNDAViewModel.contactId, this.iNDAViewModel.rfqId).subscribe(
      (res) => {
        if (res.result) {
          this.ndaFileName = '';
          this.isFileAvilable = true;
        } else {
          this._toastr.error(res.errorMessage, 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
    // this.isFileAvilable = true;
    // this.fileInput.nativeElement.value = '';
  }
  upload(fileToUpload: any) {
    const input = new FormData();
    input.append('file', fileToUpload);
    // tslint:disable-next-line: deprecation
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    const url = environment.APIEndPoint + uploadFileNDA;
    return this._Http.post(url, input, {
      headers: headers
    });
  }
  // tslint:disable-next-line: deprecation
  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' +
      localStorage.getItem('Token'));
  }
  checkNDAContent() {
    return this.ndaForm.value.ndaContent !== 'formatText';
  }
  uploadNDAFileChange() {
    this.isFileNotPDF = false;
    const fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
      if (fi.files[0].type === 'application/pdf') {
        //
      } else {
        this.isFileNotPDF = true;
        this.fileInput.nativeElement.value = '';
        // this._toastr.error('Please upload Jpeg or Png image', 'Error!');
      }
    }
  }
  ndaChanged() {
    this.isFileSelected = true;
  }
  onSaveNdaInfo() {

    this.isNDAbutton = false;
    if (this.ndaForm.valid) {
      if (this.ndaForm.value.ndaLevel === 0) {
        this.iNDAViewModel = this.ndaForm.value;
        // tslint:disable-next-line:radix
        this.iNDAViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
        this.iNDAViewModel.ndaFile = '';
        this.iNDAViewModel.ndaContent = this.defaultNdaMessage;
        this._settingService.addNdaSettings(this.iNDAViewModel).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          result => {
            this.iNDAViewModel = result;
            if (this.iNDAViewModel.result === true) {
              this._toastr.success(this.iNDAViewModel.errorMessage, '');
              setTimeout(() => {
                this.isNDAbutton = true;
              }, 3900);
            } else {
              this._toastr.error(this.iNDAViewModel.errorMessage, 'Error!');
              this.isNDAbutton = true;
            }
          },
          error => {
            this._rfqService.handleError(error);
            this.isNDAbutton = true;
          },
          () => {}
        );


      } else {
        if (this.ndaForm.value.ndaContent === 'formatText') {
          let fileToUpload;
          if (this.fileInput !== undefined) {
            const fi = this.fileInput.nativeElement;
            fileToUpload = fi.files[0];
          }
          if (this.fileInput !== undefined && fileToUpload !== undefined) {
            this.isFileSelected = true;
            // const fi = this.fileInput.nativeElement;
            // const fileToUpload = fi.files[0];
            if (fileToUpload === undefined) {
              this.isFileSelected = false;
              this.customNdaFileName = this.ndaFileName;
              // tslint:disable-next-line:radix
              this.iNDAViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
              this.iNDAViewModel.ndaFile = this.customNdaFileName;
              this.iNDAViewModel.ndaContent = '';
              this.iNDAViewModel.ndaLevel = this.ndaForm.value.ndaLevel;
              this._settingService.addNdaSettings(this.iNDAViewModel).subscribe(
                // tslint:disable-next-line:no-shadowed-variable
                result => {

                  this.iNDAViewModel = result;
                  if (this.iNDAViewModel.result === true) {
                    this._toastr.success('Changes saved successfully', '');
                    setTimeout(() => {
                      this.isNDAbutton = true;
                    }, 3900);

                  } else {
                    this._toastr.error(this.iNDAViewModel.errorMessage, 'Error!');
                    this.isNDAbutton = true;
                  }
                },
                error => {
                  this._rfqService.handleError(error);
                  this.isNDAbutton = true;
                },
                () => {}
              );
            } else {
              this.isFileSelected = true;
              this.upload(fileToUpload).subscribe(res => {
                const result = JSON.parse(res['_body']);
                if (result['result'] === true) {
                  this.customNdaFileName = result['fileName'];
                  // tslint:disable-next-line:radix
                  this.iNDAViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
                  this.iNDAViewModel.ndaFile = this.customNdaFileName;
                  this.iNDAViewModel.ndaContent = '';
                  this.iNDAViewModel.ndaLevel = this.ndaForm.value.ndaLevel;
                  this._settingService.addNdaSettings(this.iNDAViewModel).subscribe(
                    // tslint:disable-next-line:no-shadowed-variable
                    result => {

                      this.iNDAViewModel = result;

                      if (this.iNDAViewModel.ndaFile) {
                        this.ndaFileName = this.iNDAViewModel.ndaFile;
                        this.iNDAViewModel.ndaContent = 'formatText';
                        this.isFileAvilable = false;
                        this.ndaForm.setValue({
                          ndaContent: 'formatText',
                          ndaFile: '',
                          ndaLevel: this.iNDAViewModel.ndaLevel
                        });
                      }
                      if (this.iNDAViewModel.result === true) {
                        this._toastr.success('Changes saved successfully', '');
                        setTimeout(() => {
                          this.isNDAbutton = true;
                        }, 3900);
                      }

                    },
                    error => {
                      this._rfqService.handleError(error);
                      this.isNDAbutton = true;
                    },
                    () => {}
                  );
                } else {
                  this._toastr.error(result['errorMessage'], 'Error!');
                }
              });
            }
          } else {
            this.isFileSelected = false;
            this.isNDAbutton = true;
          }
        } else {
          if (this.iNDAViewModel.ndaFile !== '' && this.iNDAViewModel.ndaFile !== null && this.iNDAViewModel.ndaFile !== undefined) {
            const fileToRemove = this.iNDAViewModel.ndaFile;
            this._settingService.removeCustomNDAfromRFQ(fileToRemove, this.iNDAViewModel.contactId, this.iNDAViewModel.rfqId).subscribe(
              (res) => {
                if (res.result) {
                  this.ndaFileName = '';
                  this.isFileAvilable = true;
                  this.iNDAViewModel = this.ndaForm.value;
                  // tslint:disable-next-line:radix
                  this.iNDAViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
                  this.iNDAViewModel.ndaFile = '';
                  this.iNDAViewModel.ndaContent = this.defaultNdaMessage;
                  this._settingService.addNdaSettings(this.iNDAViewModel).subscribe(
                    // tslint:disable-next-line:no-shadowed-variable
                    result => {

                      this.iNDAViewModel = result;
                      if (this.iNDAViewModel.result === true) {

                        this._toastr.success(this.iNDAViewModel.errorMessage, '');

                        // this._toastr.success(this.iNDAViewModel.errorMessage, '');
                        setTimeout(() => {
                          this.isNDAbutton = true;
                        }, 3900);
                      } else {
                        this._toastr.error(this.iNDAViewModel.errorMessage, 'Error!');
                        this.isNDAbutton = true;
                      }
                    },
                    error => {
                      this._rfqService.handleError(error);
                      this.isNDAbutton = true;
                    },
                    () => {}
                  );
                } else {
                  this._toastr.error(res.errorMessage, 'Error!');
                  this.isNDAbutton = true;
                }
              },
              error => {
                this._rfqService.handleError(error);
                this.isNDAbutton = true;
              },
              () => {}
            );
          } else {
            this.iNDAViewModel = this.ndaForm.value;
            // tslint:disable-next-line:radix
            this.iNDAViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
            this.iNDAViewModel.ndaFile = '';
            this.iNDAViewModel.ndaContent = this.defaultNdaMessage;
            this._settingService.addNdaSettings(this.iNDAViewModel).subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              result => {

                this.iNDAViewModel = result;
                if (this.iNDAViewModel.result === true) {

                  this._toastr.success(this.iNDAViewModel.errorMessage, '');

                  setTimeout(() => {
                    this.isNDAbutton = true;
                  }, 3900);
                } else {
                  this._toastr.error(this.iNDAViewModel.errorMessage, 'Error!');
                  this.isNDAbutton = true;
                }
              },
              error => {
                this._rfqService.handleError(error);
                this.isNDAbutton = true;
              },
              () => {}
            );
          }
        }
      }
    } else {
      this._customValidatorsService.validateAllFormFields(this.ndaForm);
    }
  }
  isNoNDASelected(field: string) {
    return this.ndaForm.get(field).value === 0;
  }
  getNdaInfo() {


    const id = this.loggedId;
    this._settingService.getNdaInfo(id).subscribe(
      result => {
        if (result.result === true) {
          this.iNDAViewModel = result;
          // console.log(this.iNDAViewModel);
          // this.iNDAViewModel.ndaLevel = 1;
          if (this.iNDAViewModel.ndaLevel === 0 || this.iNDAViewModel.ndaLevel === null || this.iNDAViewModel.ndaLevel === undefined) {
            this.iNDAViewModel.ndaLevel = 1;
          }
          if (this.iNDAViewModel.ndaContent === null || this.iNDAViewModel.ndaContent === undefined) {
            this.ndaFileName = '';
            this.isFileAvilable = true;
            this.iNDAViewModel.ndaContent = 'formatHTML';
            this.ndaForm.setValue({
              ndaContent: 'formatHTML',
              ndaFile: '',
              ndaLevel: this.iNDAViewModel.ndaLevel
            });
          } else if (this.iNDAViewModel.ndaContent === '') {
            this.ndaFileName = this.iNDAViewModel.ndaFile;
            this.iNDAViewModel.ndaContent = 'formatText';
            this.isFileAvilable = false;
            this.ndaForm.setValue({
              ndaContent: 'formatText',
              ndaFile: '',
              ndaLevel: this.iNDAViewModel.ndaLevel
            });
          } else {
            this.ndaFileName = '';
            this.isFileAvilable = true;
            this.iNDAViewModel.ndaContent = 'formatHTML';
            this.ndaForm.setValue({
              ndaContent: 'formatHTML',
              ndaFile: '',
              ndaLevel: this.iNDAViewModel.ndaLevel
            });
          }
        } else {
          this._toastr.error(this.iNDAViewModel.errorMessage, 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getSettingPreference() {
    let id = null;
    let locationId = null;
    // tslint:disable-next-line:radix
    id = parseInt(localStorage.getItem('LoggedId'));
    this._settingService.getSetting(id).subscribe(
      result => {
        this._ipreferenceForm = result;
        this._ipreferenceForm.prefRfqCommunicationMethod = result.prefRfqCommunicationMethod;
        this.ipreferenceModel.prefRfqCommunicationMethod = result.prefRfqCommunicationMethod;
        this.ipreferenceModel.companyRatingPreferencesEmailList = result.companyRatingPreferencesEmailList;

        if (!!this._ipreferenceForm.paymentTermId) {
          if (this._ipreferenceForm.paymentTermId.toString() === '1') {
            this._ipreferenceForm.paymentTermId = 'Net15';
          } else if (this._ipreferenceForm.paymentTermId.toString() === '2') {
            this._ipreferenceForm.paymentTermId = 'Net30';
          } else if (this._ipreferenceForm.paymentTermId.toString() === '3') {
            this._ipreferenceForm.paymentTermId = 'Net45';
          } else if (this._ipreferenceForm.paymentTermId.toString() === '4') {
            this._ipreferenceForm.paymentTermId = 'Net60';
          }
        } else {
          this._ipreferenceForm.paymentTermId = 'Net30';
        }
        if (this._ipreferenceForm.result) {
          if (this._ipreferenceForm.paymentTermId === null && this._ipreferenceForm.prereredLocationIds === null) {
            this.setDefaultValues();
            this.initpreferenceModels();
            this.initLocationModels();
          } else {
            this.ipreferenceModel = result;
          }
          this.ratingMailForm = this._fb.group({
            items: this._fb.array([this.createItem()])
          });
          this.setEmailValue();

          if (this.ipreferenceModel.isbuyerPayshipping === null) {
            this.ipreferenceModel.isbuyerPayshipping = true;
            this.oldShiing = this.ipreferenceModel.isbuyerPayshipping;
          }
          // console.log('getprefresnce' , this.ipreferenceModel);
          this.isRoleCount = JSON.parse(localStorage.getItem('applicableRoles'));
          if (this.isRoleCount) {
            if (this.isRoleCount.length > 2) {
              this.showDashboard = true;
              if (this.ipreferenceModel.isBuyerDashboard === true) {
                this.ipreferredLocationModel.buyerDashboard = 'sourcing';
              } else if (this.ipreferenceModel.isBuyerDashboard === false) {
                this.ipreferredLocationModel.buyerDashboard = 'manufacturing';
              }
              if (this.ipreferenceModel.isBuyerDashboard === null) {
                this.ipreferredLocationModel.buyerDashboard = 'manufacturing';
                this.ipreferenceModel.isBuyerDashboard === false;
              }
            } else {
              this.showDashboard = false;
            }
          }
          locationId = this.ipreferenceModel.prereredLocationIds;
          this.oldLocationValue=locationId;
          if (locationId !== null && locationId !== '') {
            this.setLocations(locationId);
          }

          if (this.ipreferenceModel.paymentTermId === null) {
            // this.ipreferenceModel.paymentTermId = 'Net15';
            this.ipreferenceModel.paymentTermId = 'Net30';
          }
          if (this.ipreferenceModel.timeFormat === null) {
            this.ipreferenceModel.timeFormat = '12H';
          }

          this.createPreferenceForm();
        } else {
          this.initModels();
          this.createPreferenceForm();
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  setDefaultValues() {
    this.settingPreferenceForm.value.isBuyerDashboard = 'manufacturing';
    this.settingPreferenceForm.value.timeFormat = '12H';
    this.settingPreferenceForm.value.paymenOptionId = '1';
    this.settingPreferenceForm.value.isUSManufacturing = this.constManufactLocationCodeColl[0];
  }
  onChangePassword() {
    if (!this.isPasswordSubmitted) {
      this.isPasswordSubmitted = true;
      if (this.changePasswordForm.valid) {
        // tslint:disable-next-line:radix
        this.iContactViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
        this.iContactViewModel.currentPassword = this.changePasswordForm.value.currentPassword;
        this.iContactViewModel.newPassword = this.changePasswordForm.value.newPassword;
        this.iContactViewModel.emailId = localStorage.getItem('User2');
        this.iContactViewModel.password = this.changePasswordForm.value.newPassword;
        this._AccountService.ChangePassword(this.iContactViewModel).subscribe(
          result => {
            this.iContactViewModel = result;
            if (this.iContactViewModel.result === true) {
              this.changePasswordForm.reset();
              this._toastr.success(this.iContactViewModel.errorMessage, 'Success');
              // this.router.navigate(['dashboard/buyer/default']);
            } else {
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            }
            this.isPasswordSubmitted = false;
          },
          error => {
            this.isPasswordSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this._customValidatorsService.validateAllFormFields(
          this.changePasswordForm
        );
        this.isPasswordSubmitted = false;
      }
    }
  }
  onSavePreferences() {
    console.log('datafinal', );
    if (!this.isPreferenceSubmitted) {
      this.isPreferenceSubmitted = true;
      this.generateCommSeptLocations();
      if (this.settingPreferenceForm.valid) {
        if (this.ipreferenceModel.prereredLocationIds !== '') {
          // tslint:disable-next-line:radix
          this.ipreferenceModel.contactId = parseInt(localStorage.getItem('LoggedId'));
          if (!this.isSupplier) {
            this.ipreferenceModel.timeFormat = this.settingPreferenceForm.value.timeFormat;
            if (this.settingPreferenceForm.value.buyerDashboard === 'sourcing') {
              this.ipreferenceModel.isBuyerDashboard = true;
            } else if (this.settingPreferenceForm.value.buyerDashboard === 'manufacturing') {
              this.ipreferenceModel.isBuyerDashboard = false;
            }
          }
          let preferIds = '';
          preferIds = this.generateCommSeptLocations();
          this.ipreferenceModel.prereredLocationIds = preferIds;
          this.oldLocationValue=  this.ipreferenceModel.prereredLocationIds;
          this.oldShiing = this.ipreferenceModel.isbuyerPayshipping;
          this.ipreferenceModel.paymentTermId = this.settingPreferenceForm.value.paymentTermId;
          this.ipreferenceModel.prefRfqCommunicationMethod = < number > this.settingPreferenceForm.value.communicationPreference;
         this.ipreferenceModel.companyRatingPreferencesEmailList=this.items.value.map(x=>x.email);
          this._settingService.addSettingPreferrence(this.ipreferenceModel).subscribe(
            result => {
              this.ipreferenceModel = result;
              if (this.ipreferenceModel.result === true) {
                this._toastr.success(this.ipreferenceModel.errorMessage, 'Success!');
              this.getSettingPreference();
              } else {
                this._toastr.error(this.ipreferenceModel.errorMessage, 'Error!');
              }
              this.isPreferenceSubmitted = false;
            },
            error => {
              this.isPreferenceSubmitted = false;
              this._rfqService.handleError(error);
            },
            () => {}
          );
        } else {
          this.isPreferenceSubmitted = false;
          this._toastr.warning('Please Select Preferred Manufacturing Location!', 'Warning!');
        }
      } else {
        this._customValidatorsService.validateAllFormFields(
          this.settingPreferenceForm
        );
        this.isPreferenceSubmitted = false;
      }
    }
  }
  checkAllLocation() {


    this.settingPreferenceForm.setValue({
      isMexicoManufacturing: false,
      isUSManufacturing: false,
      isAsPacManufacturing: false,
      isBuyerDashboard: this.settingPreferenceForm.value.isBuyerDashboard,
      buyerDashboard: this.settingPreferenceForm.value.buyerDashboard,
      timeFormat: this.settingPreferenceForm.value.timeFormat,
      isEarthAll: false,
      paymentTermId: this.settingPreferenceForm.value.paymentTermId,
      prereredLocationIds: this.settingPreferenceForm.value.prereredLocationIds,
      errorMessage: '',
      result: false,
      // tslint:disable-next-line:radix
      contactId: parseInt(localStorage.getItem('LoggedId')),
    });

    const preferIds = this.generateCommSeptLocations();
    this.ipreferenceModel.prereredLocationIds = preferIds;
    this.checkPreferenceForms();
  }

  setLocations(locationId) {
    if (locationId.endsWith(',')) {
      locationId = locationId.substring(0, locationId.length - 1);
    }

    if (locationId.indexOf(this.constManufactLocationCodeColl[0]) > -1 &&
      locationId.indexOf(this.constManufactLocationCodeColl[1]) > -1 &&
      locationId.indexOf(this.constManufactLocationCodeColl[2]) > -1 &&
      locationId.indexOf(this.constManufactLocationCodeColl[3]) > -1 &&
      locationId.indexOf(this.constManufactLocationCodeColl[4]) > -1) {
      this.ipreferredLocationModel.isUSManufacturing = true;
      this.ipreferredLocationModel.isAsPacManufacturing = true;
      this.ipreferredLocationModel.isMexicoManufacturing = true;
      this.ipreferredLocationModel.isCanadaManufacturing = true;
      this.ipreferredLocationModel.isEMEAManufacturing = true;
      this.ipreferredLocationModel.isEarthAll = true;
    }
    if (locationId.indexOf(4) > -1) {
      this.ipreferredLocationModel.isUSManufacturing = true;
      this.locationId.push('4');
    } else {
      this.ipreferredLocationModel.isUSManufacturing = false;
    }
    if (locationId.indexOf(6) > -1) {
      this.ipreferredLocationModel.isMexicoManufacturing = true;
      this.locationId.push('6');
    } else {
      this.ipreferredLocationModel.isMexicoManufacturing = false;
    }
    if (locationId.indexOf(3) > -1) {
      this.locationId.push('3');
      this.ipreferredLocationModel.isAsPacManufacturing = true;
    } else {
      this.ipreferredLocationModel.isAsPacManufacturing = false;
    }
    if (locationId.indexOf(2) > -1) {
      this.locationId.push('2');
      this.ipreferredLocationModel.isEMEAManufacturing = true;
    } else {
      this.ipreferredLocationModel.isEMEAManufacturing = false;
    }
    if (locationId.indexOf(5) > -1) {
      this.locationId.push('5');
      this.ipreferredLocationModel.isCanadaManufacturing = true;
    } else {
      this.ipreferredLocationModel.isCanadaManufacturing = false;
    }
    if (locationId.indexOf(7) > -1) {
      this.locationId.push('7');
      this.ipreferredLocationModel.isUsaCanadaManufacturing = true;
    } else {
      this.ipreferredLocationModel.isUsaCanadaManufacturing = false;
    }
  }

  generateCommSeptLocations() {
    let preferIds = '';
    //  this.locationId=[];
    if (this.settingPreferenceForm.value.isUSManufacturing) {

      if(this.locationId.length !=3 && !this.locationId.includes('4') ) {
        preferIds = preferIds.concat(this.constManufactLocationCodeColl[4]);
        this.locationId.push(this.constManufactLocationCodeColl[4]);
      } else if(this.locationId.includes('4'))
      {

      }
      else {
        this.settingPreferenceForm.patchValue({
          isUSManufacturing:false
        })

        this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');

      }
      // this.ipreferenceModel.prereredLocationIds = this.constManufactLocationCodeColl[4];
    } else {
     let index= this.locationId.findIndex(x=>x == '4');
     if(index!=-1) {
      this.locationId.splice(index,1);
     }
    }
    if (this.settingPreferenceForm.value.isMexicoManufacturing) {

      if( this.locationId.length !=3 && !this.locationId.includes('6')) {
        if (preferIds !== '') {
          preferIds = preferIds.concat(',');
        }
        preferIds = preferIds.concat(this.constManufactLocationCodeColl[6]);
        this.locationId.push(this.constManufactLocationCodeColl[6]);
      }  else if(this.locationId.includes('6'))
      {

      }else {
        this.settingPreferenceForm.patchValue({
          isMexicoManufacturing:false
        })

        this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');

      }
      // this.ipreferenceModel.prereredLocationIds = this.constManufactLocationCodeColl[6];
    }else {
      let index= this.locationId.findIndex(x=>x == '6');
      if(index!=-1) {
       this.locationId.splice(index,1);
      }
     }
    if (this.settingPreferenceForm.value.isAsPacManufacturing) {

      if( this.locationId.length !=3 && !this.locationId.includes('3')) {
        if (preferIds !== '') {
          preferIds = preferIds.concat(',');
        }
        preferIds = preferIds.concat(this.constManufactLocationCodeColl[3]);
        this.locationId.push(this.constManufactLocationCodeColl[3]);
      }  else if(this.locationId.includes('3'))
      {

      }else {
        this.settingPreferenceForm.patchValue({
          isAsPacManufacturing:false
        })

        this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');

      }
      // this.ipreferenceModel.prereredLocationIds = this.constManufactLocationCodeColl[3];
    }else {
      let index= this.locationId.findIndex(x=>x == '3');
      if(index!=-1) {
       this.locationId.splice(index,1);
      }
     }
    if (this.settingPreferenceForm.value.isCanadaManufacturing) {

      if(this.locationId.length !=3 && !this.locationId.includes('5')) {
        if (preferIds !== '') {
          preferIds = preferIds.concat(',');
        }
        preferIds = preferIds.concat(this.constManufactLocationCodeColl[5]);
        this.locationId.push(this.constManufactLocationCodeColl[5]);
      } else if(this.locationId.includes('5'))
      {

      } else {
        this.settingPreferenceForm.patchValue({
          isCanadaManufacturing:false
        })
        this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');

      }
      // this.ipreferenceModel.prereredLocationIds = this.constManufactLocationCodeColl[5];
    }else {
      let index= this.locationId.findIndex(x=>x == '5');
      if(index!=-1) {
       this.locationId.splice(index,1);
      }
     }
    if (this.settingPreferenceForm.value.isEMEAManufacturing) {

      if(this.locationId.length !=3 && !this.locationId.includes('2')) {
        this.locationId.push(this.constManufactLocationCodeColl[2]);
        if (preferIds !== '') {
          preferIds = preferIds.concat(',');
        }
        preferIds = preferIds.concat(this.constManufactLocationCodeColl[2]);
      }  else if(this.locationId.includes('2'))
      {

      }else {
        this.settingPreferenceForm.patchValue({
          isEMEAManufacturing:false
        })

        this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');

      }
      // this.ipreferenceModel.prereredLocationIds = this.constManufactLocationCodeColl[2];
    }else {
      let index= this.locationId.findIndex(x=>x == '2');
      if(index!=-1) {
       this.locationId.splice(index,1);
      }
     }
    if (this.settingPreferenceForm.value.isUsaCanadaManufacturing) {

      if(this.locationId.length !=3 && !this.locationId.includes('7')) {
        if (preferIds !== '') {
          preferIds = preferIds.concat(',');
        }
        preferIds = preferIds.concat(this.constManufactLocationCodeColl[7]);
        this.locationId.push(this.constManufactLocationCodeColl[7]);
      }  else if(this.locationId.includes('7'))
      {

      }else {
        this.settingPreferenceForm.patchValue({
          isUsaCanadaManufacturing:false
        })
        this._toastr.warning('You can select up to 3 regions at once.', 'Warning!');

      }
      // this.ipreferenceModel.prereredLocationIds = this.constManufactLocationCodeColl[7];
    }else {
      let index= this.locationId.findIndex(x=>x == '7');
      if(index!=-1) {
       this.locationId.splice(index,1);
      }
     }
     preferIds = this.locationId.toString();
    return preferIds;
  }

  initNotificationModels() {
    this.iSettingsNotificationModel = {
      contactId: 0,
      isNotifyByEmail: true,
      awardConfirmations: 'NotifyInstantly',
      newMessages: 'NotifyInstantly',
      newQuotes: 'NotifyInstantly',
      ndAsToApprove: 'NotifyInstantly',
      orderStatusUpdates: 'NotifyInstantly',
      ratingsToPerformReceived: 'IncludeInDailySummary',
      isSendDailySummary: true,
      isSystemMaintenanceAnnouncements: true,
      isNewsletter: true,
      isSpecialInvitations: true,
      isSendNotificationsAsHTML: true,
      errorMessage: '',
      result: true
    };
  }



  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  onSavenotificationsInfo() {
    if (!this.isNotificationSubmitted) {
      this.isNotificationSubmitted = true;

      this.checkForms();
      if (this.notificationsForm.valid) {
        // tslint:disable-next-line:radix
        this.iSettingsNotificationModel.contactId = parseInt(localStorage.getItem('LoggedId'));
        this.iSettingsNotificationModel.isNotifyByEmail = this.notificationsForm.value.isNotifyByEmail;
        this.iSettingsNotificationModel.awardConfirmations = this.notificationsForm.value.awardConfirmations;
        this.iSettingsNotificationModel.newMessages = this.notificationsForm.value.newMessages;
        this.iSettingsNotificationModel.newQuotes = this.notificationsForm.value.newQuotes;
        this.iSettingsNotificationModel.ndAsToApprove = this.notificationsForm.value.ndAsToApprove;
        this.iSettingsNotificationModel.orderStatusUpdates = this.notificationsForm.value.orderStatusUpdates;
        this.iSettingsNotificationModel.ratingsToPerformReceived = this.notificationsForm.value.ratingsToPerformReceived;
        this.iSettingsNotificationModel.isSendDailySummary = this.notificationsForm.value.isSendDailySummary;
        this.iSettingsNotificationModel.isSystemMaintenanceAnnouncements = this.notificationsForm.value.isSystemMaintenanceAnnouncements;
        this.iSettingsNotificationModel.isNewsletter = this.notificationsForm.value.isNewsletter;
        this.iSettingsNotificationModel.isSpecialInvitations = this.notificationsForm.value.isSpecialInvitations;
        this.iSettingsNotificationModel.isSendNotificationsAsHTML = this.notificationsForm.value.isSendNotificationsAsHTML;

        this._settingService.addNotificationSettings(this.iSettingsNotificationModel).subscribe(
          result => {
            this.iSettingsNotificationModel = result;
            if (this.iSettingsNotificationModel.result === true) {
              this._toastr.success(this.iSettingsNotificationModel.errorMessage, '');
            } else {
              this._toastr.error(this.iSettingsNotificationModel.errorMessage, 'Error!');
            }
            this.isNotificationSubmitted = true;
          },
          error => {
            this.isNotificationSubmitted = true;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this._customValidatorsService.validateAllFormFields(
          this.notificationsForm
        );
        this.isNotificationSubmitted = true;
      }
    }
  }

  getNotificationSettings() {
    const id = this.loggedId;
    this._settingService.getNotificationSettings(id).subscribe(
      result => {
        this.iSettingsNotificationModel = result;
        if (this.iSettingsNotificationModel.isSystemMaintenanceAnnouncements === null) {
          this.iSettingsNotificationModel.isSystemMaintenanceAnnouncements = true;
        }
        if (this.iSettingsNotificationModel.isSendDailySummary === null) {
          this.iSettingsNotificationModel.isSendDailySummary = true;
        }
        if (this.iSettingsNotificationModel.isNewsletter === null) {
          this.iSettingsNotificationModel.isNewsletter = true;
        }

        if (this.iSettingsNotificationModel.isSpecialInvitations === null) {
          this.iSettingsNotificationModel.isSpecialInvitations = true;
        }
        if (this.iSettingsNotificationModel.awardConfirmations === null) {
          this.iSettingsNotificationModel.awardConfirmations = 'NotifyInstantly';
        }
        if (this.iSettingsNotificationModel.newMessages === null) {
          this.iSettingsNotificationModel.newMessages = 'NotifyInstantly';
        }
        if (this.iSettingsNotificationModel.newQuotes === null) {
          this.iSettingsNotificationModel.newQuotes = 'NotifyInstantly';
        }
        if (this.iSettingsNotificationModel.ndAsToApprove === null) {
          this.iSettingsNotificationModel.ndAsToApprove = 'NotifyInstantly';
        }
        if (this.iSettingsNotificationModel.orderStatusUpdates === null) {
          this.iSettingsNotificationModel.orderStatusUpdates = 'NotifyInstantly';
        }
        if (this.iSettingsNotificationModel.ratingsToPerformReceived === null) {
          this.iSettingsNotificationModel.ratingsToPerformReceived = 'NotifyInstantly';
        }
        if (this.iSettingsNotificationModel.newQuotes === null) {
          this.createNotificationForm();
        } else {
          this.createNotificationForm();
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.ndaForm,
      field
    );
  }

  isRegisterCompare(confirtmPassword: string, Password: string) {
    if (this._customValidatorsService.isCompare(this.changePasswordForm,
        confirtmPassword,
        Password)) {
      this.isRegisterRePasswordError = false;
    } else {
      this.isRegisterRePasswordError = true;
    }
    return this._customValidatorsService.isCompare(this.changePasswordForm,
      confirtmPassword,
      Password);
  }

  isChangeFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(
      this.changePasswordForm,
      field
    );
  }
  getOriginalPartName(fileName) {
    this.oappendText = '';
    let fixStr: '';
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        const charactorCount = filenNameArray[0].length;
        if (charactorCount > 60) {
          fixStr = fileName.slice(0, 60);
          this.oappendText = fixStr.concat(this.appendText);
          return this.oappendText;
        } else {
          return filenNameArray[0];
        }
      } else {
        const charactorCount = filenNameArray[1].length;
        if (charactorCount > 60) {
          fixStr = fileName.slice(0, 60);
          this.oappendText = fixStr.concat(this.appendText);
          return this.oappendText;
        } else {
          return filenNameArray[1];
        }

      }
      // return filenNameArray[1];
    }
  }

  disablePasswordSave() {
    if (this.isChangeFieldValid('currentPassword') || this.isRegisterPasswordValid('newPassword') ||
      this.isChangeFieldValid('newPassword') || this.isChangeFieldValid('password') || this.isRegisterCompare('password', 'newPassword')) {
      return true;
    } else {
      if ((this.onLoadChangePasswordModule.password === this.changePasswordForm.value.password) ||
        (this.onLoadChangePasswordModule.newPassword === this.changePasswordForm.value.newPassword) ||
        (this.onLoadChangePasswordModule.currentPassword === this.changePasswordForm.value.currentPassword)) {
        return true;
      } else {
        return false;
      }
    }
  }

  Invite() {
    this.inviteuser = true;
  }


  hideInvite() {
    this.inviteuser = false;
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    ++this.isFileDownloaded;
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      --this.isFileDownloaded;
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
  getBuyerLocation() {
    const datacount = this._rfqService.get('ITerritoryClassificationModelColl');
    if (datacount !== undefined) {
      this.ITerritoryClassificationModelColl = this._rfqService.get('ITerritoryClassificationModelColl');
      this.iTerritoryClassificationNames.territoryClassificationName2 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 2).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName3 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 3).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName4 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 4).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName5 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 5).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName6 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 6).territoryClassificationName;
      this.iTerritoryClassificationNames.territoryClassificationName7 = this.ITerritoryClassificationModelColl
        .find(m => m.territoryClassificationId === 7).territoryClassificationName;
    } else {
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          this._rfqService.set(data2, 'ITerritoryClassificationModelColl');
          this.getBuyerLocation();
        },
        error => () => {},
        () => {}
      );
    }
  }
  onChangeUsername() {
    if (!this.isUsernameSubmitted) {
      this.isUsernameSubmitted = true;
      if (this.changeUsernameForm.valid) {
        // tslint:disable-next-line:radix
        this.iContactViewModel.contactId = parseInt(localStorage.getItem('LoggedId'));
        this.iContactViewModel.currentPassword = this.changePasswordForm.value.currentPassword;
        this.iContactViewModel.newPassword = this.changePasswordForm.value.newPassword;
        this.iContactViewModel.emailId = localStorage.getItem('User2');
        this.iContactViewModel.password = this.changePasswordForm.value.newPassword;
        this._AccountService.ChangePassword(this.iContactViewModel).subscribe(
          result => {
            this.iContactViewModel = result;
            if (this.iContactViewModel.result === true) {
              this.changeUsernameForm.reset();
              this._toastr.success(this.iContactViewModel.errorMessage, 'Success');
              this.router.navigate(['dashboard/buyer/default']);
            } else {
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            }
            this.isUsernameSubmitted = false;
          },
          error => {
            this.isUsernameSubmitted = false;
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this._customValidatorsService.validateAllFormFields(
          this.changeUsernameForm
        );
        this.isUsernameSubmitted = false;
      }
    }
  }
  cancelRfq() {
    this.inviteuser1 = true;
  }
  checkConfirmUser() {
    // tslint:disable-next-line:max-line-length
    // if ( this.changeUsernameForm.controls.username.value && this.changeUsernameForm.controls.usernameRe.value) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
  updateEmail(status) {
    if (!this.isEmailUpdated) {
      this.isEmailUpdated = true;
      if (status) {
        // tslint:disable-next-line:radix
        const userId = localStorage.getItem('userId');
        const userEmail = this.changeUsernameForm.controls.setting_usernameNew.value;
        this._AccountService.updateEmail(userId, userEmail, status, this.loggedId).subscribe(
          result => {
            // console.log(result);
            if (result.result) {
              this._toastr.success(result.errorMessage, 'Success');
              this._toastr.warning('The application is going to logout, Please login again', 'Warning');
              setTimeout(() => {
                this._rfqService.set(0, 'companyId');
                this._rfqService.set(null, 'CompanyName');
                localStorage.clear();
                this.router.navigate(['auth/login/simple']);
              }, 2000);
            } else {
              this._toastr.error(result.errorMessage, 'Error!');
            }
            this.changeUsernameForm.reset();
            this.inviteuser1 = false;
            this.isEmailUpdated = false;
          },
          error => {
            this.isEmailUpdated = false;
            this.changeUsernameForm.reset();
            this._rfqService.handleError(error);
            this.inviteuser1 = false;
          }
        );
      } else {
        this.changeUsernameForm.reset();
        this.inviteuser1 = false;
        this.isEmailUpdated = false;
      }
    }
  }
  removeTermConditionFile() {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want remove this Terms and Conditions file?',
      header: 'Remove',
      icon: null,
      accept: () => {
        this.isLoader = true;
        this._rfqService.removeTermCondition(this.loggedCompanyId, this.loggedId).subscribe(
          res => {
            console.log(res);
            if (!res.isError) {
              this.termConditionFileName = null;
              this.termConditionFile = null;
              this._toastr.success('Term and condition remove successfully', 'Success!');
            } else {
              this._toastr.error(res.message[0], 'Error!');
            }
            this.isLoader = false;
          }
        );
      },
      reject: () => {}
    });
  }
  onChange(file) {
    // const input = document.querySelector('input[type=\'file\']');
    // const file = input.files[0];
    if ((file[0].type === 'application/pdf')) {
      this.isLoader = true;
      this.upload(file[0]).subscribe(
        res => {
          const result = JSON.parse(res['_body']);
          // this.logoImage = result.privateFileFileName;
          console.log(result);
          // let fileName = result.fileName;
          // let privateFileFileName = result.privateFileFileName;
          this.setQmsTeamCondition(result.fileName);
        }
      );
    } else {
      this._toastr.warning('Please attached PDF files only', 'Warning!');
      this.isLoader = false;
    }
  }
  onDashboardBtnClick(setBuyerDashboard) {
    this.ipreferenceModel.isBuyerDashboard = setBuyerDashboard;
  }
  setTimeFormat(timeFormatVal) {
    this.ipreferenceModel.timeFormat = timeFormatVal;
  }
}
