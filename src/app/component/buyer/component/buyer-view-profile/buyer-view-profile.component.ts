import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  NgZone,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import {
  IContactViewModel,
  ILanguageModel,
  ICompanyModel,
  IAddressModel,
  IProfileViewModel,
  IEmailModel,
  IViewProfileGetPriceAwardPatterView
} from '../../../../core/models/accountModel';
import {
  IMaterialViewModel,
  IEmployeesCountRangeModel,
  IIndustriesModel,
  ICountryViewModel
} from '../../../../core/models/globalMaster';
import {
  ToastrService
} from 'ngx-toastr';
import {
  SupplierService
} from '../../../../core/services/supplier/supplier.service';
import {
  MasterService
} from '../../../../core/services/master/master.service';
import {
  IAboutUsViewModel,
  ICertificationViewModel,
  IMyAccountViewModel,
  IndustryFocusList
} from '../../../../core/models/supplierProfileModel';
import {
  ITempNPSDataModel,
  IRatingResponseViewModel,
  NDAApproveContactsRFQsList
} from '../../../../core/models/rfqModel';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';
import {
  ICustomProcessViewModel
} from '../../../../core/models/rfqModel';
import {
  CustomValidatorService
} from '../../../../core/services/validator/custom-validator.service';
import {
  IFocusOverViewModel
} from '../../../../core/models/supplierProfileModel';

import {
  ConfirmationService
} from 'primeng/api';
import {
  SupplierTypeViewModel
} from '../../../../core/models/globalMaster';
import {
  IFollowContactViewModel
} from '../../../../core/models/settingsModel';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  AccountService
} from '../../../../core/services/account/account.service';
import {
  IMessagesViewModel
} from '../../../../core/models/rfqModel';
import {
  environment
} from '../../../../../environments/environment';
import {
  Http,
  Headers
} from '@angular/http';
import {
  isArray
} from 'util';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as Chart from 'chart.js';
import { uploadFileNDA } from '../../../../../constants/url-constant';
import { appConstants } from '../../../../core/config/constant';
declare var Quill: any;

@Component({
  selector: 'app-buyer-view-profile',
  templateUrl: './buyer-view-profile.component.html',
  styleUrls: ['./buyer-view-profile.component.scss'],
  providers: [ConfirmationService],
})
export class BuyerViewProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  propagateChange = (_: any) => { };
  propagateTouched = () => { };
  companyName: any;
  companyId: number = 0;
  showFeedbackModel: boolean = false;
  public value: string;
  isApiRes: boolean;
  iEmailModel: IEmailModel;
  EmailForm: FormGroup;
  certificateViewModelList: ICertificationViewModel[];
  languagesString: string;
  defaultAwsPath = '';
  iAboutUsModelColl: IAboutUsViewModel[];
  iAboutUsModel: IAboutUsViewModel;
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iContactViewModel: IContactViewModel;
  iMaterialViewModelColl: IMaterialViewModel[];
  iFocusOverViewModel: IFocusOverViewModel;
  isAboutUsActive: boolean;
  isCabalitiesActive: boolean;
  isContactUsActive: boolean;
  isRatingActive: boolean;
  isDemographics: boolean;
  @ViewChild('lineCanvas', { static: false }) lineCanvas: ElementRef;
  lineChart: any;
  priceAwardData: any;
  /********* rating tab var start *****************/

  pages = 3;
  pageSize = 10;
  pageNumber = 0;
  currentIndex = 1;
  items: IRatingResponseViewModel[];
  activeItems: boolean[];
  activeItemIndex: boolean;
  tempResponse: IRatingResponseViewModel;
  responseArray: IRatingResponseViewModel[];
  pagesIndex: Array<number>;
  pageStart = 1;
  completeAddress: string;
  iTempNPSDataModel: ITempNPSDataModel;
  enableMeterFields = [false, false, false, false, false, false, false];
  isLoader: boolean;
  responseStartNumber = 1;
  responseEndNumber = 10;
  currentPhoto: string;
  currentPhotoTitle: string;
  currentPhotoCaption: string;
  supplierLogoPath: string;
  isAboutUs: boolean;
  isProfile: boolean;

  /*********  rating tab var end *****************/



  iProfileViewModel: IProfileViewModel;
  iLanguageModelColl: ILanguageModel[];
  iCountryViewModelColl: ICountryViewModel[];
  iEmployeesCountRangeModel: IEmployeesCountRangeModel[];
  iIndustriesModel: IIndustriesModel[];
  iContactViewModel2: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  defaultOption: '';
  findLanguage: ILanguageModel;
  findIndustry: IIndustriesModel;
  findRang: IEmployeesCountRangeModel;
  industryId: number;
  mailingAddressData: any;
  shippingAddressData: any;
  userCreatedDateString = ' ';
  isShiiping5: boolean;
  isMailingAvaible: boolean;
  isCancel1stStep: boolean;
  isBlacklist: boolean;
  SupplierTypeViewModel: SupplierTypeViewModel;
  monthColl = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  iFollowContactViewModel: IFollowContactViewModel;
  isSent: boolean;
  currentContactId: any;
  currentRfqid: number;
  accountRfqId: number;
  iMyAccountViewModel: IMyAccountViewModel;
  isUpgradeBtn: boolean;
  isAccountUpgradereqSent: boolean;
  accountUpgradeMessage: string;
  selectedIds: any;
  messageForm: FormGroup;
  result: any;
  contactIds = [];
  contactIdCount = '';
  iRfqMessageViewModelColl: IMessagesViewModel;
  appendText: string;
  @ViewChild('messageAttachment', { static: false }) messageAttachment;
  successOrFailureMsg = '';
  messageSuccessStatus = false;
  messageFailureStatus = false;
  from_id = parseInt(localStorage.getItem('LoggedId'));
  labelFocus: any;
  uploadingInProg: boolean;
  activeStatusFilterBtn: number;
  activePriceStatusFilterBtn: number;
  isFileDownloaded: number;
  isNPSPupupShow: boolean;
  iViewProfileGetPriceAwardPatterView: IViewProfileGetPriceAwardPatterView;
  // pie chart
  pieChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    },
  };


  // linechart2
  dataSource = {
    'chart': {
      'caption': 'Price Award Pattern',
      'yaxisname': 'Price (%)',
      'xaxisname': 'Awards',
      'formatNumber': '0',
      'showYAxisValues': '0',
      'showLimits': '1',
      'yAxisMinValue': '0',
      'yAxisMaxValue': '100',
      'showToolTip': '0'
    },
    data: []
  };

  width = 700;
  height = 400;
  type = 'line';
  dataFormat = 'json';
  pieChartLabels: any = [];
  pieChartColor: any;
  pieChartData: any = [{
    data: [],
    fill: true,
    pieceLabel: {
      render: 'percentage'
    },

  }];
  ispriceLoader: boolean;
  isAddratingDisabled: boolean;
  avgNoOfStars: number;
  total1StarRatingPer: number;
  total2StarRatingPer: number;
  total3StarRatingPer: number;
  total4StarRatingPer: number;
  total5StarRatingPer: number;
  totalReviews: number;
  showUpgradeAccountModal: boolean;
  ndaApproveContactsRFQsList: NDAApproveContactsRFQsList;
  industryFocusList: IndustryFocusList;
  constructor(private _SupplierService: SupplierService, private _rfqService: RfqService,
    private _masterService: MasterService, private _AccountService: AccountService,
    private _fb: FormBuilder, private _customValidatorsService: CustomValidatorService,
    private confirmationService: ConfirmationService, private _profileService: ProfileService,
    private _toastr: ToastrService, private _Http: Http, private _ngZone: NgZone, private router: Router) {
    this.certificateViewModelList = [];
    this.isAddratingDisabled = false;
    this.iAboutUsModelColl = [];
    this.isSent = false;
    this.isNPSPupupShow = false;
    this.isApiRes = true;
    this.languagesString = '';
    this.completeAddress = '';
    this.isAboutUs = true;
    this.iLanguageModelColl = [];
    this.isAboutUsActive = true;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = false;
    this.currentPhoto = '';
    this.currentPhotoTitle = '';
    this.currentPhotoCaption = '';
    this.isDemographics = true;
    this.iEmployeesCountRangeModel = [];
    this.supplierLogoPath = 'assets/company/avatar-manu-basic.svg';
    this.items = [];
    this.activeItems = [];
    this.responseArray = [];
    this.activeStatusFilterBtn = 90;
    this.activePriceStatusFilterBtn = 90;
    this.iIndustriesModel = [];
    this.iFollowContactViewModel = {
      contactId: 0,
      rfqId: 0,
      companyIdList: [],
      errorMessage: '',
      result: true,
      isFollow: null,
      bookType: ''
    };
    this.isProfile = true;
    this.isBlacklist = false;
    this.initModels();
    this.fillDropdown();
    this.initEmailModel();
    this.createForm();
    this.messageViewInitModel();
    this.createMsgForm();
    this.currentContactId = this._rfqService.get('buyerProfileId');
    this.currentRfqid = this.currentRfqId;
    // message

    this.uploadingInProg = false;
    this.appendText = '...';

    this.getSelectedId();
    const tempName = this._rfqService.get('nameOfBuyer');
    if (!!tempName) {
      tempName.trim();
    }
    if (this.contactIds.length === 1 && (!!tempName) && (tempName !== '')) {
      this.contactIdCount = tempName;
    } else {
      this.contactIdCount = this.contactIds.length + ' Recipients';
    }
    this.iViewProfileGetPriceAwardPatterView = {
      companyId: 0,
      maxPrice: 0,
      minPrice: 0,
      averagePrice: 0,
      days: 0
    };

    this.pieChartColor = [{
      backgroundColor: ['#4a90e2', '#81db6d', '#ffb74e', '#ff5471']
    }];
    this.isLoader = false;
    this.ispriceLoader = false;

    var fontSizeStyle = Quill.import('attributors/style/size');
    fontSizeStyle.whitelist = ['2em', '1.5em', '0.5em'];
    Quill.register(fontSizeStyle, true);
  }
  writeValue(value: any) {
    this.value = value;
  }
  errorDisMsg: string;
  changeText(e) {
    if (e.textValue.length >= 1 && e.textValue.length <= 1000) {
      this.errorDisMsg = '';
    } else if (e.textValue.length > 1000) {
      this.errorDisMsg = 'Exceed the character length.';
    }
    this.propagateChange(e.htmlValue);
  }
  initEmailModel() {
    this.iEmailModel = {
      companyId: 0,
      companyName: '',
      contactEmailId: '',
      contactId: 0,
      email: '',
      errorMessage: '',
      externalEnquiries: 0,
      firstName: '',
      lastName: '',
      messageBody: '',
      messageDate: new Date(),
      messageSubject: '',
      phone: '',
      result: false,
      messageFileNames: []
    };
  }
  messageViewInitModel() {
    this.iRfqMessageViewModelColl = {
      messageId: 0,
      rfqId: 0,
      originalMessageSubject: '',
      toContactIdEncrypt: '',
      fromContactIdEncrypt: '',
      messageTypeId: 5,
      messageHierarchy: 0,
      messageSubject: '',
      messageDescr: '',
      pageName: '',
      messageDate: null,
      fromCont: 0,
      toCont: 0,
      messageRead: false,
      messageSent: false,
      readDate: null,
      messageStatusIdRecipient: 0,
      messageStatusIdAuthor: 0,
      expirationDate: null,
      trash: false,
      trashDate: null,
      fromTrash: false,
      fromTrashDate: null,
      errorMessage: '',
      result: false,
      isSelected: false,
      toContactIds: [],
      messageStatus: '',
      supplierProfileUrl: '',
      buyerProfileUrl: '',
      sendEmail: false,
      messageStatusId: 0,
      messageTypeValue: 'rfqFreeMessage',
      fromContName: '',
      toContName: '',
      messageFileNames: [],
      isNDAToApproveAll: false,
      toRFQIds: [],
      companyId: 0,
      companyName: '',
      companyUrl: '',
      companylogo: '',
      toContactCompanyUrl: '',
      toContactCompanylogo: '',
      toCompanyName: '',
      nDAApproveContactsRFQsLists: [],
      toCompanyId: 0,
      isNotification: false
    };

    this.ndaApproveContactsRFQsList = {
      contactId: 0,
      rfqId: 0
    }
  }
  createForm() {
    this.EmailForm = this._fb.group({
      firstName: [this.iEmailModel.firstName, Validators.required],
      lastName: [this.iEmailModel.lastName],
      companyName: [this.iEmailModel.companyName],
      email: [this.iEmailModel.email, Validators.compose([Validators.required, Validators.email])],
      phone: [this.iEmailModel.phone, Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]*$')])],
      messageSubject: [this.iEmailModel.messageSubject, Validators.required],
      messageBody: [this.iEmailModel.messageBody, Validators.required]
    });
  }
  createMsgForm() {
    this.messageForm = this._fb.group({
      subject: [this.iRfqMessageViewModelColl['messageSubject'], Validators.required],
      message: [this.iRfqMessageViewModelColl['messageDescr'], Validators.required],
    });
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.EmailForm, field);
  }
  onEmail() {
    if (!this.isSent) {
      this.isSent = true;
      if (this.EmailForm.valid) {
        this.iEmailModel.firstName = this.EmailForm.value.firstName;
        this.iEmailModel.lastName = this.EmailForm.value.lastName;
        this.iEmailModel.email = this.EmailForm.value.email;
        this.iEmailModel.phone = this.EmailForm.value.phone;
        this.iEmailModel.messageBody = this.EmailForm.value.messageBody;
        this.iEmailModel.messageSubject = this.EmailForm.value.messageSubject;
        this.iEmailModel.companyName = this.EmailForm.value.companyName;
        this.iEmailModel.contactId = this.iContactViewModel.contactId;
        this.iEmailModel.companyId = this.iContactViewModel.companyId;
        this._AccountService.emailUs(this.iEmailModel).subscribe(
          result => {
            this.iEmailModel = result;
            if (this.iContactViewModel.result === true) {
              this.initEmailModel();
              this.isSent = false;
              this.EmailForm.reset();
              this._toastr.success('Message Sent Successfully', 'Success!');
            } else {
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
      } else {
        this._customValidatorsService.validateAllFormFields(this.EmailForm);
      }
    }

  }

  fillDropdown() {
    this._masterService.getLanguages().subscribe(
      (data: ILanguageModel[]) => {
        this.iLanguageModelColl = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );

    this._masterService.getIndustryType().subscribe(
      (data: IIndustriesModel[]) => {
        this.iIndustriesModel = data;
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
    this._masterService.getEmployeesCountRange().subscribe(
      (data: IEmployeesCountRangeModel[]) => {
        this.iEmployeesCountRangeModel = data;
        this.iEmployeesCountRangeModel.splice(0, 1);
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }


  initModels() {
    this.iTempNPSDataModel = {
      nps: 0,
      promoter: 0,
      passives: 0,
      detractors: 0,
      promotersCount: 0,
      passivesCount: 0,
      petractorsCount: 0,
      totalResponses: 0,
      result: false
    };
    this.iProfileViewModel = {
      addressId: 0,
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
      employeeCountRangeId: 1,
      description: '',
      name: '',
      dunsNumber: '',
      instagram: ''
    };
    this.iAboutUsModel = {
      equipments: [],
      specialFiles: [],
      companyId: 0,
      name: '',
      description: '',
      _3dTourUrl: '',
      dunsNumber: '',
      employeeCountRangeId: 0,
      createdDate: null,
      cageCode: '',
      companyType: '',
      languages: [],
      errorMessage: '',
      result: false,
      contactId: 0,
      supplierType: this.SupplierTypeViewModel,
      employeeCountRange: '',
      isBlackListed: false,
      isFollowing: false,
      companyURL: '',
      manufacturingLocation: '',
      isBuyer: null,
      _3dTourUrlList: []
    };
    this.SupplierTypeViewModel = {
      blockUsersiteSelection: false,
      industryId: 0,
      supplierTypeId: 0,
      supplierTypeName: '',
      supplierTypeNameEn: ''
    };
    this.iContactViewModel = {
      isLike: false,
      accountEmail: '',
      addressId: 0,
      npsScore: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      comments: '',
      companyId: 0,
      contactFunction: '',
      isLoginFromVision: false,
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
      currentUserRole: [],
      noOfStars: 0,
      isVisionUserRequest: false,
      instagram: ''
    };

    this.iLanguageModel = {
      charset: '',
      languageAbr: '',
      languageId: 0,
      languageName: '',
      localeCode: '',
      translated: true
    };

    this.iCompanyModel = {
      companyId: 0,
      description: '',
      _3dTourUrl: '',
      dunsNumber: '',
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
      countryId: 0,
      country: '',
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
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: '',
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
      pageName: 'Buyer public view',
      rfqId: 0,
      toAlternateEmailId: ''
    };
  }
  get loggedId() {
    return this.iContactViewModel.contactId;
  }
  get loggedCompanyId() {
    return this.iContactViewModel.contactId;
  }
  get loggedEncrId() {
    return this._rfqService.get('buyerCurrentProfileEncriptContactId');
  }
  getCapabilities() {
    this._SupplierService.getCapabilities(this.iContactViewModel.companyId, false).subscribe(
      result => {
        this.iCustomProcessViewModelColl = result['data'];
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  getParentMaterialofCompany() {
    this._SupplierService.getParentMaterialofCompany(this.iContactViewModel.companyId).subscribe(
      result => {
        this.iMaterialViewModelColl = result['data'];
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  getFocusOverview() {
    this._SupplierService.getFocusOverview(this.iContactViewModel.companyId).subscribe(
      result => {
        this.iFocusOverViewModel = result['data'];
        this.iFocusOverViewModel.tolerance = 'Loose (+/- .00)';
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );

  }
  openPhoto(fileName) {
    this.currentPhoto = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileName;
    this.currentPhotoCaption = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileCaption;
    this.currentPhotoTitle = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileTitle;
  }
  formatDate(stringDate: string) {
    const itemDate = new Date(stringDate);
    return '' + (itemDate.getMonth() + 1) + '/' + itemDate.getDate() + '/' + itemDate.getFullYear();
  }

  formatScore(stringScore: string) {
    // tslint:disable-next-line:radix
    return parseInt(stringScore);
  }

  reloadResponses() {
    if (this._SupplierService.get('closedRatingReply')) {
      this._SupplierService.set(false, 'closedRatingReply');
      this.resetActiveItems();
    }
    if (this._SupplierService.get('responseReplyIsSent')) {
      this._SupplierService.set(false, 'responseReplyIsSent');
      this.resetActiveItems();
      this.getResponseList();
    }
  }
  replyLogo(fileUrl: string) {
    if (!!fileUrl && (fileUrl.length > 0)) {
      return this.defaultAwsPath + fileUrl;
    } else {
      return 'assets/company/avatar-manu-basic-circle.svg';
    }
  }
  goToNext() {
    const current = this.iAboutUsModel.specialFiles.find(m => m.fileName === this.currentPhoto);
    const index = this.iAboutUsModel.specialFiles.indexOf(current);
    let nextItem = '';
    if (index < this.iAboutUsModel.specialFiles.length - 1) {
      nextItem = this.iAboutUsModel.specialFiles[index + 1].fileName;
      this.currentPhoto = nextItem;
      this.currentPhotoCaption = this.iAboutUsModel.specialFiles[index + 1].fileCaption;
      this.currentPhotoTitle = this.iAboutUsModel.specialFiles[index + 1].fileTitle;
    }
  }

  goToPrev() {
    const current = this.iAboutUsModel.specialFiles.find(m => m.fileName === this.currentPhoto);
    const index = this.iAboutUsModel.specialFiles.indexOf(current);
    let nextItem = '';
    if (index !== 0) {
      nextItem = this.iAboutUsModel.specialFiles[index - 1].fileName;
      this.currentPhoto = nextItem;
      this.currentPhotoCaption = this.iAboutUsModel.specialFiles[index - 1].fileCaption;
      this.currentPhotoTitle = this.iAboutUsModel.specialFiles[index - 1].fileTitle;
    }
  }
  isReplyAllow(parentId, nextItemIndex) {
    if (!parentId) {
      if (!this.items[nextItemIndex] || !this.items[nextItemIndex].parentId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  get loggedContactId() {
    // tslint:disable-next-line:radix
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }
  setBlacklist() {
    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = this.iContactViewModel.companyId;
    this.iFollowContactViewModel.bookType = appConstants.blacklistedBookType;
    this.iFollowContactViewModel.isFollow = true;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          console.log(result.errorMessage);
          this.isBlacklist = true;
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  resetActiveItems() {
    for (let iTest = 0; iTest < this.activeItems.length; iTest++) {
      this.activeItems[iTest] = false;
    }
  }
  responseLogo(fileUrl: string) {
    if (!!fileUrl && (fileUrl.length > 0)) {
      return this.defaultAwsPath + fileUrl;
    } else {
      return 'assets/company/avatar-manu-basic-circle.svg';
    }
  }
  getPercentageClass(percentCount: number) {
    const myStyles = {
      'width': '' + percentCount + '%'
    };
    return myStyles;
  }
  ngOnInit() {
    this.isFileDownloaded = 0;
    this.getProfileDetails();
    this.showUpgradeAccountModal = false;
    this.accountRfqId = this._rfqService.get('accountRFQId');
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.GetPriceAwardPattern(this.activePriceStatusFilterBtn);
    }, 5000);

  }
  loadAddress() {
    this._profileService.getAddress(this.iContactViewModel.contactId).subscribe(
      (data: IContactViewModel) => {
        this.iContactViewModel2 = data;
        this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
        this.mailingAddressData = this.iContactViewModel2.address;
        if (this.mailingAddressData.addressId === 0 || this.mailingAddressData.state === 'Unknown - Do not delete') {
          this.isMailingAvaible = false;
        } else {
          this.isMailingAvaible = true;
        }

        if (this.shippingAddressData.length >= 5) {
          this.isShiiping5 = true;
        } else {
          this.isShiiping5 = false;
        }
        
      },
      error => () => {
        this._rfqService.handleError(error);
      }
    );
  }
  get loggedEmailId() {
    return (localStorage.getItem('User2'));
  }

  removeContact() {
      this.isCancel1stStep = true;
      this.confirmationService.confirm({
      message: 'Are you sure you want to remove this file?',
      header: '',
      icon: null,
      accept: () => {

      },
      reject: () => { }
    });
  }

  getProfileDetails() {
    const id = this._rfqService.get('buyerCurrentProfileContactId');
    this.userCreatedDateString = '';
    this._profileService.getProfileDetails(id, this.loggedContactId).subscribe(
      result => {
        this.isApiRes = false;
        this.isAddratingDisabled = result.isRatingSpanComplete;
        this.iContactViewModel = result;
        this.getResponseList();
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
        }
        if (!!this.iContactViewModel.createdOn && (this.iContactViewModel.createdOn !== '')) {
          const tempDate = new Date(this.iContactViewModel.createdOn);
          this.userCreatedDateString += 'Member Since ' + this.monthColl[tempDate.getMonth() - 1] + ' ' + tempDate.getFullYear();
        }

        this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
        this.iProfileViewModel.emailId = this.iContactViewModel.emailId;
        this.iProfileViewModel.firstName = this.iContactViewModel.firstName;
        this.iProfileViewModel.lastName = this.iContactViewModel.lastName;
        this.iProfileViewModel.languageId = this.iContactViewModel.languageId;
        if (this.iLanguageModelColl.length !== 0) {
          this.findLanguage = this.iLanguageModelColl.find(data => data.languageId === this.iProfileViewModel.languageId);
        } else {
          this._masterService.getLanguages().subscribe(
            (data: ILanguageModel[]) => {
              this.iLanguageModelColl = data;
              this.findLanguage = this.iLanguageModelColl.find(data => data.languageId === this.iProfileViewModel.languageId);
            },
            error => () => {
              this._rfqService.handleError(error);
            }
          );
        }

        this.iProfileViewModel.phoneNo = this.iContactViewModel.phoneNo;
        this.iProfileViewModel.title = this.iContactViewModel.title;
        this.iProfileViewModel.showDeltailedRating = this.iContactViewModel.showDeltailedRating;
        this.iProfileViewModel.showRfqAwardStat = this.iContactViewModel.showRfqAwardStat;
        this.iProfileViewModel.industryId = this.iContactViewModel.industryId;
        this.findIndustry = this.iIndustriesModel.find(data => data.industryId === this.iProfileViewModel.industryId);
        this.iProfileViewModel.facebook = this.iContactViewModel.facebook;
        this.iProfileViewModel.linkedIn = this.iContactViewModel.linkedIn;
        this.iProfileViewModel.tweeter = this.iContactViewModel.tweeter;
        if (this.iContactViewModel.companyId == null) {
          this.iProfileViewModel.companyId = 0;
        } else {
          this.iProfileViewModel.companyId = this.iContactViewModel.companyId;
        }
        this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
        if (this.iContactViewModel.company != null) {
          this.iProfileViewModel.name = this.iContactViewModel.company.name;
          this.iProfileViewModel.dunsNumber = this.iContactViewModel.company.dunsNumber;
          this.iProfileViewModel.employeeCountRangeId = (
            (this.iContactViewModel.company.employeeCountRangeId === 0) ? 1 : this.iContactViewModel.company.employeeCountRangeId
          );
          this.industryId = this.iProfileViewModel.employeeCountRangeId;

          this.iProfileViewModel.description = this.iContactViewModel.company.description;
        }
        if (this.iEmployeesCountRangeModel.length !== 0) {
          this.findRang = this.iEmployeesCountRangeModel.find(data => data.employeeCountRangeId === this.industryId);
        } else {
          this._masterService.getEmployeesCountRange().subscribe(
            (data: IEmployeesCountRangeModel[]) => {
              this.iEmployeesCountRangeModel = data;
              this.iEmployeesCountRangeModel.splice(0, 1);
              this.findRang = this.iEmployeesCountRangeModel.find(data => data.employeeCountRangeId === this.industryId);
            },
            error => () => {
              this._rfqService.handleError(error);
            }
          );
        }

        this._SupplierService.set(this.iProfileViewModel, 'profileData');
        this.isProfile = false;
        this.getAboutUsDetails();
        this.getCertificateList();
        this.getCapabilities();
        this.getParentMaterialofCompany();
        this.getFocusOverview();
        this.loadAddress();
        this.getNPSRatings();
        this.getRFQCountGeographicLocation(this.activeStatusFilterBtn);
        this.completeAddress = this.iContactViewModel.address.streetAddress + ',' +
        this.iContactViewModel.address.deptAddress + ',' +
        this.iContactViewModel.address.city + ',' +
        this.iContactViewModel.address.state;

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }



  checkForLastImage() {
    if (this.iAboutUsModel.specialFiles !== null) {
      const current = this.iAboutUsModel.specialFiles.find(m => m.fileName === this.currentPhoto);
      const index = this.iAboutUsModel.specialFiles.indexOf(current);
      if (index < this.iAboutUsModel.specialFiles.length - 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkForFirstImage() {
    if (this.iAboutUsModel.specialFiles !== null) {
      const current = this.iAboutUsModel.specialFiles.find(m => m.fileName === this.currentPhoto);
      const index = this.iAboutUsModel.specialFiles.indexOf(current);
      if (index === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  getResponseList() {
    this.isLoader = false;
    const contactID = this.iContactViewModel.companyId;
    if (contactID !== null && contactID !== undefined) {
      this._SupplierService.GetNPSResponses(contactID).subscribe(
        result => {
          this.isLoader = false;
          if (result.result) {
            this.responseArray = result.data.ratingResponseList;
            this.avgNoOfStars = (result.data.avgNoOfStars) ? result.data.avgNoOfStars : 0;
            this.total1StarRatingPer = (result.data.total1StarRatingPer) ? result.data.total1StarRatingPer : 0;
            this.total2StarRatingPer = (result.data.total2StarRatingPer) ? result.data.total2StarRatingPer : 0;
            this.total3StarRatingPer = (result.data.total3StarRatingPer) ? result.data.total3StarRatingPer : 0;
            this.total4StarRatingPer = (result.data.total4StarRatingPer) ? result.data.total4StarRatingPer : 0;
            this.total5StarRatingPer = (result.data.total5StarRatingPer) ? result.data.total5StarRatingPer : 0;
            this.totalReviews = (result.data.totalReviews) ? result.data.totalReviews : 0;
            if (this.responseArray !== null && this.responseArray.length !== 0) {
              this.isLoader = false;
              this.initPagination();
            } else {
              this.isLoader = false;
              this.items = [];
              this.activeItems = [];
            }
          }
        },
        error => {
          this.isLoader = false;
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }

  }

  initPagination() {
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.responseArray.length / this.pageSize));
    if (this.responseArray.length % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }
  refreshItems() {
    this.responseStartNumber = (this.currentIndex - 1) * this.pageSize;
    this.responseEndNumber = (this.currentIndex) * this.pageSize;
    if (this.responseArray[this.responseStartNumber].parentId) {
      ++this.responseStartNumber;
    }
    if (!!this.responseArray[this.responseEndNumber]) {
      if (this.responseArray[this.responseEndNumber].parentId) {
        ++this.responseEndNumber;
      }
    }
    this.items = this.responseArray.slice(this.responseStartNumber, this.responseEndNumber);
    this.activeItems = [];
    for (let iTest = 0; iTest < this.items.length; iTest++) {
      this.activeItems.push(false);
    }
    this.pagesIndex = this.fillArray();
  }
  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  getNPSRatings() {
    this.isLoader = false;
    const contactID = this.loggedId;
    this._SupplierService.getNPSRatings(this.iContactViewModel.contactId).subscribe(
      result => {
        this.isLoader = false;
        this.iTempNPSDataModel = result;
        if (!!this.iTempNPSDataModel.nps) {
          this.enableMeterFields[0] = !(this.iTempNPSDataModel.nps < (-99));
          this.enableMeterFields[1] = !(this.iTempNPSDataModel.nps < (-56));
          this.enableMeterFields[2] = !(this.iTempNPSDataModel.nps < (-28));
          this.enableMeterFields[3] = !(this.iTempNPSDataModel.nps < (0));
          this.enableMeterFields[4] = !(this.iTempNPSDataModel.nps < (28));
          this.enableMeterFields[5] = !(this.iTempNPSDataModel.nps < (56));
          this.enableMeterFields[6] = !(this.iTempNPSDataModel.nps < (99));
        } else {
          this.enableMeterFields = [false, false, false, false, false, false, false];
        }
      },
      error => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.refreshItems();
  }
  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }

    this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.refreshItems();
  }
  openAboutUs() {
    this.isAboutUsActive = true;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = false;
  }
  openCapabilities() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = true;
    this.isContactUsActive = false;
    this.isRatingActive = false;
  }
  openContactUs() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = false;
    this.isContactUsActive = true;
    this.isRatingActive = false;
  }
  openRatings() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = true;
  }

  initIFocusOverViewModel() {
    this.iFocusOverViewModel = {
      industryFocusList: null,
      tolerance: ''
    };
    this.industryFocusList = {
      industryFocus: '',
      industryFocusId: 0
    }
  }
  initializeModel() {
    this.initIFocusOverViewModel();
  }


  getAboutUsDetails() {
    const contactId = this.loggedId;
    // tslint:disable-next-line:max-line-length
    this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.iContactViewModel.contactId, this.iContactViewModel.isBuyer, this.loggedContactId).subscribe(
      (data: IAboutUsViewModel) => {
        this.iAboutUsModel = data['data'];
        this.photoArray = this.iAboutUsModel.specialFiles
        if (!!this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 5) {
          this.iAboutUsModel.equipments = this.iAboutUsModel.equipments.slice(0, 5);
        } else {
          this.iAboutUsModel.equipments = [];
        }
        if (!!this.iAboutUsModel.languages && this.iAboutUsModel.languages.length > 5) {
          this.iAboutUsModel.languages = this.iAboutUsModel.languages.slice(0, 5);
        }
        this.languagesString = '';
        if (this.iAboutUsModel.languages !== null && this.iAboutUsModel.languages !== undefined) {
          this.iAboutUsModel.languages.forEach(element => {
            if (this.languagesString !== '') {
              this.languagesString = this.languagesString + ',';
            }
            this.languagesString = this.languagesString + element.languageName;
          });
        }
        if (this.photoArray !== null && this.photoArray.length > 0) {
          this.photoArray = this.photoArray.slice(0, 6);
        } else {
          this.photoArray = [];
        }
        if (this.iAboutUsModel.specialFiles !== null) {
          this.iAboutUsModel.specialFiles.forEach(element => {
            if (!!element.fileName && element.fileName.length > 0) {
              element.fileName = this.defaultAwsPath + element.fileName;
            }
          });
        }
        this.isAboutUs = false;
        if (this.iAboutUsModel.isBlackListed !== null ||
          this.iAboutUsModel.isBlackListed !== undefined) {
          this.isBlacklist = this.iAboutUsModel.isBlackListed;
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  getCertificateList() {
    this._masterService.getCertificate(this.iContactViewModel.companyId).subscribe(
      (data) => {
        if (data['result'] === true) {
          this.certificateViewModelList = data['data'];
          if (this.certificateViewModelList.length !== 0) {
            this.certificateViewModelList.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
            this.certificateViewModelList = this.certificateViewModelList.slice(0, 5);
          }
        } else { }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  removeBlacklistUser() {
    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = this.iContactViewModel.companyId;
    this.iFollowContactViewModel.bookType = appConstants.blacklistedBookType;
    this.iFollowContactViewModel.isFollow = false;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          this.isBlacklist = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  setFollow(companyId) {
    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = companyId;
    this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
    this.iFollowContactViewModel.isFollow = true;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          this.iAboutUsModel.isFollowing = true;

        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  unFollow(companyId) {
    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = companyId;
    this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
    this.iFollowContactViewModel.isFollow = false;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          this.iAboutUsModel.isFollowing = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  openMessageDrawer(event, contactId, messageRFQId) {
    this.messageViewInitModel();
    this.createMsgForm();
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(true, 'showSidePanelbuyerprofile');
    this._rfqService.set(true, 'isBuyerMessage1');
    this._rfqService.set(this.iContactViewModel.contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'supplierProfileDrawer');

  }
  get currentRfqId() {
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  isBuyerMessage() {
    return this._rfqService.get('isBuyerMessage1');
  }
  isSidePanel() {
    return this._rfqService.get('showSidePanelbuyerprofile');
  }


  // message
  getSelectedId() {
    this.contactIds = [];
    this.selectedIds = this._rfqService.get('selectContactIdsForMEessage');
    if (isArray(this.currentContactId)) {
      for (let i = 0; i < this.currentContactId.length; i++) {
        this.contactIds.push(this.currentContactId[i]);
      }
    } else {
      this.contactIds.push(this.currentContactId);
    }
  }
  ngOnDestroy() {
    // this.closePartDrawer();
  }
  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'showSidePanelbuyerprofile');
    this._rfqService.set(false, 'isBuyerMessage1');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set('', 'selectContactIdsForMEessage');
    this._rfqService.set('', 'selectContactRFQId');
    this._rfqService.set('', 'nameOfBuyer');
  }
  isFieldValid1(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }

  onMessageSend() {

    if (this.messageForm.valid) {
      this.contactIds = [];
      this.contactIds.push(this.iContactViewModel.contactId);
      this.iRfqMessageViewModelColl.toContactIds = this.contactIds;
      this.iRfqMessageViewModelColl.fromCont = this.from_id;
      this.iRfqMessageViewModelColl.pageName = 'component\buyer\component\buyer-view-profile\buyer-view-profile.component.ts';
      this.iRfqMessageViewModelColl.messageDate = moment.utc(new Date()).toDate();
      // tslint:disable-next-line:radix
      this.iRfqMessageViewModelColl.rfqId = 0; // (parseInt(localStorage.getItem('supplierRfqDetailId')));
      this.iRfqMessageViewModelColl.messageSubject = this.messageForm.value.subject;
      this.iRfqMessageViewModelColl.messageDescr = this.messageForm.value.message;
      localStorage.setItem('pagename', 'buyer\component\\buyer-view-profile\\buyer-view-profile.component.ts');
      this._rfqService.sendMessages(this.iRfqMessageViewModelColl).subscribe(
        result => {
          if (result.result === true) {
            this.iRfqMessageViewModelColl = result;
            this.messageSuccessStatus = true;
            this.successOrFailureMsg = result.errorMessage;
            this._toastr.success(this.successOrFailureMsg, '');
            this.messageViewInitModel();
            this.closePartDrawer();
            this._rfqService.set(true, 'messageSentFromRfq');
          } else {
            this.messageFailureStatus = true;
            this._toastr.error(result.errorMessage, 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
      this._customValidatorsService.validateAllFormFields(this.messageForm);
    }
  }
  resetBtn() {
    const subject = this.messageForm.value.subject;
    const message = this.messageForm.value.message;
    if (subject === '' || message === '') {
      return true;
    } else {
      return false;
    }
  }
  checkMessageField(field: string) {
    return this.messageForm.value[field] === '';
  }
  setFocus(flag: string) {
    this.labelFocus = flag;
  }
  resetErrorStatus(status: string) {
    setTimeout(() => {
      if (status === 'messageSuccessStatus') {
        this.messageSuccessStatus = false;
      } else {
        this.messageFailureStatus = false;
      }
      this.closePartDrawer();
    }, 6000);
  }

  onFileSelect(file) {
    this.uploadingInProg = true;
    this.upload(this.messageAttachment.nativeElement.files[0]).subscribe(
      (res) => {
        this.uploadingInProg = false;
        const result1 = JSON.parse(res['_body']);
        this.iRfqMessageViewModelColl.messageFileNames = [result1['fileName']];
      },
      error => {
        this.uploadingInProg = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
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

  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'bearer ' + localStorage.getItem('Token'));
  }

  getFileUrl(fileUrl: string) {
    return this.defaultAwsPath + fileUrl;
  }

  getOriginalPartName(fileName) {
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        return filenNameArray[0];
      }
      return filenNameArray[1];
    }
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
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
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

  setStatusFilter(btnState: string) {
    // this.activeStatusFilterBtn = btnState;
  }


  getRFQCountGeographicLocation(btnState: number) {
    this.isLoader = false;
    this.activeStatusFilterBtn = btnState;
    this.pieChartData = [{
      data: [],
    }];
    if (this.iContactViewModel.companyId !== null && this.iContactViewModel.companyId !== 0) {
      this._profileService.GetRFQCountGeographicLocation(this.iContactViewModel.companyId, this.activeStatusFilterBtn).subscribe(res => {
        if (res.result === true) {
          for (let i = 0; res.data.length > i; i++) {
            this._ngZone.run(() => {
              this.pieChartData[0].data[i] = res.data[i].rfqPercentage;
              this.pieChartLabels[i] = res.data[i].geographicLocation + ' (' + res.data[i].rfqCount + ')';
            });
          }
          this.isLoader = false;
        } else {
          this.isLoader = false;
          this.pieChartData = [{
            data: [],
          }];
        }
      }, error => {
        this._rfqService.handleError(error);
        this.isLoader = false;
      });
    } else {
      this.isLoader = false;
      this.pieChartData = [{
        data: [],
      }];
    }
  }

  GetPriceAwardPattern(btnState: number) {
    this.priceArr = [];
    this.ispriceLoader = true;
    let buyerCompanyID = parseInt(localStorage.getItem('buyerCompanyId'));
    this.activePriceStatusFilterBtn = btnState;
    this.iViewProfileGetPriceAwardPatterView.companyId = buyerCompanyID;
    this.iViewProfileGetPriceAwardPatterView.days = btnState;
    if (buyerCompanyID !== null && buyerCompanyID !== 0) {
      this._profileService.GetPriceAwardPattern(this.iViewProfileGetPriceAwardPatterView).subscribe(res => {
        if (res.result === true) {
          this.dataSource.data = [];
          for (let i = 0; res.data.length > i; i++) {
            this.priceArr.push(res.data[i].price);
            this.lineChartMethod();
            const obj = {
              value: res.data[i].price.toString(),
              showLabel: '0',
              showValue: '0',
              anchorHoverDip: '0',
              toolText: ''
            };
            this.dataSource.data[i] = obj;
            this.ispriceLoader = false;
          }
        } else {
          this.ispriceLoader = false;
          this.dataSource.data = [];
        }
      }, error => {
        this._rfqService.handleError(error);
        this.ispriceLoader = false;
      });
    } else {
      this.ispriceLoader = false;
      this.dataSource.data = [];
    }
  }

  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }
  }
  get loggedcontactId() {
    // tslint:disable-next-line:radix
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }
  get loggedcompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  websiteClick(website) {
    if (website !== null) {
      const websitepattern = '^(http[s]?:\/\/)';
      if (!website.match(websitepattern)) {
        website = 'https://' + website;
      }
      window.open(website, '_blank');
    }
  }
  mapSource: string = "";
  getAddressFormat(mailingAddressData,updateMapSource=true) {
    let tempAdd: string = '';
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += '<br />';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state)) {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country)) {
      tempAdd += '<br />' + mailingAddressData.country;
    }
    if(updateMapSource){
      this.mapSource = this.getAddressFormatForMap(mailingAddressData);
    }    
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  getAddressFormatForMap(mailingAddressData) {
    let tempAdd: string = '';
    if (this.checkEmpty(mailingAddressData.streetAddress)) {
      tempAdd += mailingAddressData.streetAddress + ', ';
    } else {
      return 'N/A';
    }
    if (this.checkEmpty(mailingAddressData.deptAddress)) {
      tempAdd += mailingAddressData.deptAddress + ', ';
    }
    // tslint:disable-next-line:max-line-length
    if (this.checkEmpty(mailingAddressData.city) && this.checkEmpty(mailingAddressData.state) && this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += ',';
    }
    if (this.checkEmpty(mailingAddressData.city)) {
      tempAdd += mailingAddressData.city + ', ';
    }
    if (this.checkEmpty(mailingAddressData.state) && mailingAddressData.state !== 'Unknown - Do not delete') {
      tempAdd += mailingAddressData.state + ', ';
    }
    if (this.checkEmpty(mailingAddressData.postalCode)) {
      tempAdd += mailingAddressData.postalCode;
    }
    if (this.checkEmpty(mailingAddressData.country) && mailingAddressData.country !== 'Unknown') {
      tempAdd += ',' + mailingAddressData.country;
    }
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      if (val.trim() === '') {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  isModelShow() {
    return this._rfqService.get('isModelShow');
  }
  showRatingModel() {
    this.isNPSPupupShow = true;
    this._rfqService.set(true, 'isModelShow');
    this._rfqService.set(this.iContactViewModel.contactId, 'isFormcotactId');
    this._rfqService.set(this.iContactViewModel.company.name, 'ComapnyName');
    this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'manufacturerName');
    this._rfqService.set(this.iContactViewModel.contactPictureFile, 'contactPictureFile');
  }

  IsNpsdataback() {
    if (this._rfqService.get('isSupplierPublicProfile') === true) {
      this._rfqService.set(false, 'isSupplierPublicProfile');
      this.getProfileDetails();
    }
  }
  getBarClass(rate) {
    if (rate) {
      return 'percentage percentage-' + Math.round(rate);
    } else {
      return 'bar';
    }
  }
  /* This function is called when click on Upgrade Account button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  removeSavedAttachFile(filename, index: any) {
    if (this.iRfqMessageViewModelColl.messageFileNames) {
      this.iRfqMessageViewModelColl.messageFileNames.splice(index, 1);
      this._toastr.success('File remove successfully', 'success!');
    }
  }
  openFeedbackModel(compName) {
    this.companyName = compName;
    this.companyId = this.iContactViewModel.companyId;
    this.showFeedbackModel = true;
  }

  isReadMore = true;
  isLoadMore = true;
  photoArray: any = [];
  showText1() {
    this.isReadMore = !this.isReadMore;
  }
  loadPhotos() {
    if (this.isLoadMore) {
      this.photoArray.push(this.iAboutUsModel.specialFiles);
      this.photoArray = this.photoArray.filter(val => !this.iAboutUsModel.specialFiles.includes(val))[0];
      this.isLoadMore = !this.isLoadMore;
    } else {
      this.photoArray = this.iAboutUsModel.specialFiles.slice(0, 6);
      this.isLoadMore = !this.isLoadMore;
    }
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  priceArr: any[] = [100];
  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      options: {
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Price (%)'
            }
          }],
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Awards'
            }
          }]
        }
      },
      type: 'line',
      data: {
        labels: ['', '', '', '', '', '', '', '', '', '', ''],
        datasets: [
          {
            label: 'Price Award Pattern',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.priceArr,
            spanGaps: false,
          }
        ]
      }

    });
  }

  openSidePanel(itemIndex) {
    this.activeItemIndex = itemIndex;
    this.resetActiveItems();
    this.tempResponse = {
      responseId: this.items[itemIndex].responseId,
      fromId: this.items[itemIndex].fromId,
      toId: this.items[itemIndex].toId,
      parentId: this.items[itemIndex].responseId,
      contactName: this.items[itemIndex].contactName,
      imageURL: this.items[itemIndex].imageURL,
      createdDate: this.items[itemIndex].createdDate,
      score: this.items[itemIndex].score,
      comment: this.items[itemIndex].comment,
      isLegacyRating: this.items[itemIndex].isLegacyRating,
      errorMessage: this.items[itemIndex].errorMessage,
      messageId: 0,
      isNotNowClicked: false,
      result: this.items[itemIndex].result,
      rfqId: 0
    };
    this._SupplierService.set(this.tempResponse, 'tempParentResponse');
    this.activeItems[itemIndex] = true;
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(true, 'buyerProfileSidePanel');
    this._SupplierService.set(true, 'isRatingReply');
  }
}
