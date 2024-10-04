import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  ICertificationViewModel,
  IAboutUsViewModel,
  IFocusOverViewModel
} from '../../../../core/models/supplierProfileModel';
import {
  SupplierTypeViewModel,
  IMaterialViewModel
} from '../../../../core/models/globalMaster';
import {
  IContactViewModel,
  ILanguageModel,
  ICompanyModel,
  IAddressModel,
  IEmailModel
} from '../../../../core/models/accountModel';
import {
  SupplierService
} from '../../../../core/services/supplier/supplier.service';
import {
  MasterService
} from '../../../../core/services/master/master.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';
import {
  ICustomProcessViewModel,
  IRatingResponseViewModel,
  ITempNPSDataModel,
  NDAApproveContactsRFQsList
} from '../../../../core/models/rfqModel';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import {
  ConfirmationService
} from 'primeng/api';
import {
  IFollowContactViewModel
} from '../../../../core/models/settingsModel';
import {
  IMessagesViewModel
} from '../../../../core/models/rfqModel';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  CustomValidatorService
} from '../../../../core/services/validator/custom-validator.service';
import {
  isArray
} from 'util';
import {
  environment
} from '../../../../../environments/environment';
import {
  Http,
  Headers
} from '@angular/http';
import {
  AccountService
} from '../../../../core/services/account/account.service';
import * as moment from 'moment';
import { uploadFileNDA } from '../../../../../constants/url-constant';
import { appConstants } from '../../../../core/config/constant';
@Component({
  selector: 'app-supplier-view-profile',
  templateUrl: './supplier-view-profile.component.html',
  styleUrls: ['./supplier-view-profile.component.scss'],
  providers: [ConfirmationService]
})
export class SupplierViewProfileComponent implements OnInit, OnDestroy {

  isAboutUsActive: boolean;
  isCabalitiesActive: boolean;
  isContactUsActive: boolean;
  isRatingActive: boolean;
  hederPath: string;
  currentRfqid: number;
  isCencel: boolean;
  msgs: string;
  uploadingInProg: boolean;
  supplierLogoPath: string;
  defaultAwsPath = '';
  iContactViewModel: IContactViewModel;
  iLanguageModel: ILanguageModel;
  iCompanyModel: ICompanyModel;
  iAddressModel: IAddressModel;
  @ViewChild('messageAttachment',{static:false}) messageAttachment;
  // about us
  certificateViewModelList: ICertificationViewModel[];
  languagesString: string;
  iAboutUsModelColl: IAboutUsViewModel[];
  iAboutUsModel: IAboutUsViewModel;
  isDemographics: boolean;
  iSupplierTypeViewModel: SupplierTypeViewModel;
  currentPhoto: string;
  currentPhotoTitle: string;
  currentPhotoCaption: string;
  SupplierTypeViewModel: SupplierTypeViewModel;
  completeAddress: string;
  // capa

  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  iMaterialViewModelColl: IMaterialViewModel[];
  iFocusOverViewModel: IFocusOverViewModel;
  iFollowContactViewModel: IFollowContactViewModel;

  // rat

  pages = 3;
  pageSize = 10;
  pageNumber = 0;
  currentIndex = 1;
  items: IRatingResponseViewModel[];
  activeItems: boolean[];
  activeItemIndex: boolean;
  tempResponse: IRatingResponseViewModel;
  responseArray: IRatingResponseViewModel[];
  pagesIndex: Array < number > ;
  pageStart = 1;
  iTempNPSDataModel: ITempNPSDataModel;
  enableMeterFields = [false, false, false, false, false, false, false];
  isLoader: boolean;
  currentContactId: any;
  responseStartNumber = 1;
  responseEndNumber = 10;
  isBlacklist: boolean;
  messageForm: FormGroup;
  selectedIds: any;
  result: any;
  contactIds = [];
  contactIdCount = '';
  // tslint:disable-next-line:radix
  from_id = parseInt(localStorage.getItem('LoggedId'));
  successOrFailureMsg = '';
  messageSuccessStatus = false;
  messageFailureStatus = false;
  iRfqMessageViewModelColl: IMessagesViewModel;
  labelFocus: any;
  appendText: string;
  isSent: boolean;
  EmailForm: FormGroup;
  iEmailModel: IEmailModel;
  isApi: boolean;
  ndaApproveContactsRFQsList: NDAApproveContactsRFQsList;
  isFollowerSubmitted: boolean = false;
  constructor(private _SupplierService: SupplierService, private _masterService: MasterService,
    private _toastr: ToastrService, private _profileService: ProfileService, private _rfqService: RfqService, private confirmationService: ConfirmationService, private _AccountService: AccountService,
    private _fb: FormBuilder, private _customValidatorsService: CustomValidatorService, private _Http: Http) {
    this.currentContactId = this._rfqService.get('ViewSupplierProfileId');
    this.certificateViewModelList = [];
    this.iAboutUsModelColl = [];
    this.isApi = true;
    this.iCustomProcessViewModelColl = [];
    this.iMaterialViewModelColl = [];
    this.languagesString = '';
    this.currentPhoto = '';
    this.currentPhotoTitle = '';
    this.currentPhotoCaption = '';
    this.completeAddress = '';
    this.isDemographics = true;
    this.appendText = '...';
    this.items = [];
    this.activeItems = [];
    this.responseArray = [];
    this.uploadingInProg = false;
    this.isAboutUsActive = true;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = false;
    this.isBlacklist = false;
    this.isSent = false;
    this.iSupplierTypeViewModel = {
      blockUsersiteSelection: false,
      industryId: 0,
      supplierTypeId: 0,
      supplierTypeName: '',
      supplierTypeNameEn: ''
    };
    this.iAboutUsModel = {
      companyId: 0,
      contactId: 0,
      name: '',
      _3dTourUrl: '',
      description: '',
      dunsNumber: '',
      employeeCountRangeId: 0,
      equipments: [],
      specialFiles: [],
      createdDate: null,
      cageCode: '',
      companyType: '',
      languages: [],
      errorMessage: '',
      result: false,
      supplierType: this.SupplierTypeViewModel,
      employeeCountRange: '',
      isBlackListed: false,
      isFollowing: false,
      companyURL: '',
      manufacturingLocation: '',
      isBuyer: false,
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
      website: '',
      addressId: 0,
      contactIdEncrypt: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
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
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      result: true,
      rfqId: 0,
      isFollow: null,
      bookType: ''
    };
    this.messageViewInitModel();
    this.createMsgForm();
    this.initEmailModel();
    this.createForm();
    this.getSelectedId();
    this.currentRfqid = this.currentRfqId;
    const tempName = this._rfqService.get('ViewSupplierProfileName');
    if (!!tempName) {
      tempName.trim();
    }
    if (this.contactIds.length === 1 && (!!tempName) && (tempName !== '')) {
      this.contactIdCount = tempName;
    } else {
      this.contactIdCount = this.contactIds.length + ' Recipients';
    }
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
  messageViewInitModel() {
    this.iRfqMessageViewModelColl = {
      messageId: 0,
      rfqId: 0,
      messageTypeId: 0,
      messageHierarchy: 0,
      pageName: '',
      originalMessageSubject: '',
      toContactIdEncrypt: '',
      fromContactIdEncrypt: '',
      messageSubject: '',
      messageDescr: '',
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
      messageTypeValue: '',
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
  onAboutUs() {
    this.isAboutUsActive = true;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = false;
  }
  onCabalities() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = true;
    this.isContactUsActive = false;
    this.isRatingActive = false;
  }
  onContact() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = false;
    this.isContactUsActive = true;
    this.isRatingActive = false;
    // initializeMap(this.completeAddress);
  }
  onRatingUs() {
    this.isAboutUsActive = false;
    this.isCabalitiesActive = false;
    this.isContactUsActive = false;
    this.isRatingActive = true;
  }

  ngOnInit() {
    this.getProfileDetails();
    this.getResponseList();
    this.getNPSRatings();
    this.getSupplierProfile();

  }
  getSupplierProfile() {
    const id = this.currentContactId;
    this._profileService.getProfileDetails(id, this.loggedContactId).subscribe(
      result => {
        this.iContactViewModel = result;
        this.isApi = true;
        // this.iContactViewModel.npsScore = (!this.iContactViewModel.npsScore) ? 0 : this.iContactViewModel.npsScore;
        if (!!this.iContactViewModel.logoOfCompany && (this.iContactViewModel.logoOfCompany !== '')) {
          this.hederPath = this.defaultAwsPath + this.iContactViewModel.logoOfCompany;
        }
        if (!!this.iContactViewModel.contactPictureFile && (this.iContactViewModel.contactPictureFile !== '')) {
          this.supplierLogoPath = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
        } else {
          this.supplierLogoPath = this.defaultAwsPath + 'user.png';
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  isSidePanelOpen() {
    return false;
  }
  getProfileDetails() {
    // const id = 848545;
    const id = this.currentContactId;
    this._profileService.getProfileDetails(id, this.loggedContactId).subscribe(
      result => {
        this.iContactViewModel = result;
        this.getAboutUsDetails();
        this.getCertificateList();
        this.getParentMaterialofCompany();
        this.getCapabilities();
        this.getFocusOverview();
        this.completeAddress = this.iContactViewModel.address.streetAddress + ',' +
          this.iContactViewModel.address.deptAddress + ',' +
          this.iContactViewModel.address.city + ',' +
          this.iContactViewModel.address.state;
        // initializeMap(this.completeAddress);
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getCapabilities() {
    this._SupplierService.getCapabilities(this.iContactViewModel.companyId, false).subscribe(
      result => {
        if (result['result'] === true) {
          this.iCustomProcessViewModelColl = result['data'];
        } else {
          this.iCustomProcessViewModelColl = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
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
      () => {}
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
      () => {}
    );

  }
  // isSidePanel () {
  //   return false;
  // }
  get loggedId() {
    // tslint:disable-next-line:radix
    return this.currentContactId;
  }

  openPhoto(fileName) {
    this.currentPhoto = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileName;
    this.currentPhotoCaption = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileCaption;
    this.currentPhotoTitle = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileTitle;
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



  getAboutUsDetails() {
    const contactId = this.loggedId;
    this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.iContactViewModel.contactId,
      this.iContactViewModel.isBuyer, this.loggedContactId).subscribe(
      (data: IAboutUsViewModel) => {
        this.iAboutUsModel = data['data'];
        if (this.iAboutUsModel.supplierType === null) {
          this.iAboutUsModel.supplierType = this.SupplierTypeViewModel;
        }
        if (this.iAboutUsModel.description === '' || this.iAboutUsModel.description === null ||
          this.iAboutUsModel.description === undefined) {
          this.iAboutUsModel.description = '';
        }
        // if (this.iAboutUsModel.dunsNumber === '') {
        //   this.isDemographics = true;
        // } else {
        //   this.isDemographics = false;
        // }
        if (!!this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 5) {
          this.iAboutUsModel.equipments = this.iAboutUsModel.equipments.slice(-5);
        }
        if (!this.iAboutUsModel.equipments) {
          this.iAboutUsModel.equipments = [];
        }
        if (!!this.iAboutUsModel.languages && this.iAboutUsModel.languages.length > 5) {
          this.iAboutUsModel.languages = this.iAboutUsModel.languages.slice(0, 5);
        }
        if (!this.iAboutUsModel.languages) {
          this.iAboutUsModel.languages = [];
        }
        this.languagesString = '';
        if (this.iAboutUsModel.languages !== null) {
          this.iAboutUsModel.languages.forEach(element => {
            if (this.languagesString !== '') {
              this.languagesString = this.languagesString + ',';
            }
            this.languagesString = this.languagesString + element.languageName;
          });
        }
        if (!!this.iAboutUsModel.specialFiles) {
          this.iAboutUsModel.specialFiles.forEach(element => {
            if (!!element.fileName && element.fileName.length > 0) {
              element.fileName = this.defaultAwsPath + element.fileName;
            }
          });
          this.iAboutUsModel.specialFiles = this.iAboutUsModel.specialFiles.slice(0, 6);
          for (let i = 0; i < this.iAboutUsModel.specialFiles.length; i++) {
            const src = this.iAboutUsModel.specialFiles[i].fileName;
            const caption = 'Image ' + i + ' caption here';
            const thumb = this.iAboutUsModel.specialFiles[i].fileName;
            const album = {
              src: src,
              caption: caption,
              thumb: thumb
            };

          }
        } else {
          this.iAboutUsModel.specialFiles = [];
        }
        this.isBlacklist = this.iAboutUsModel.isBlackListed;
        if (this.iAboutUsModel.isBlackListed !== null ||
          this.iAboutUsModel.isBlackListed !== undefined) {
          this.isBlacklist = this.iAboutUsModel.isBlackListed;
          // console.log('blacklist', this.isBlacklist);
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getCertificateList() {
    this._masterService.getCertificate(this.iContactViewModel.companyId).subscribe(
      (data) => {
        if (data['result'] === true) {
          this.certificateViewModelList = data['data'];
          if (this.certificateViewModelList.length > 10) {
            this.certificateViewModelList = this.certificateViewModelList.slice(0, 5);
          }
        } else {}
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }


  getPercentageClass(percentCount: number) {
    const myStyles = {
      'width': '' + percentCount + '%'
    };
    return myStyles;
  }

  getNPSRatings() {
    this.isLoader = true;
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
      () => {}
    );
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

  getResponseList() {
    this.isLoader = true;
    const contactID = this.loggedCompanyId;
    if (contactID !== null && contactID !== undefined) {
      this._SupplierService.GetNPSResponses(contactID).subscribe(
        result => {
          this.isLoader = false;
          if (result.result) {
            this.responseArray = result.data;
            if (this.responseArray.length !== 0) {
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
        () => {}
      );
    }

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

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }

  formatDate(stringDate: string) {
    const itemDate = new Date(stringDate);
    return '' + (itemDate.getMonth() + 1) + '/' + itemDate.getDate() + '/' + itemDate.getFullYear();
  }

  formatScore(stringScore: string) {
    // tslint:disable-next-line:radix
    return parseInt(stringScore);
  }

  responseLogo(fileUrl: string) {
    if (!!fileUrl && (fileUrl.length > 0)) {
      return this.defaultAwsPath + fileUrl;
    } else {
      return 'assets/supplier/chat1.jpg';
    }
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
      return 'assets/company/avatar-manu-basic.svg';
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

  resetActiveItems() {
    for (let iTest = 0; iTest < this.activeItems.length; iTest++) {
      this.activeItems[iTest] = false;
    }
  }
  get loggedCompanyId() {
    return this.iContactViewModel.companyId;
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
          // console.log( result.errorMessage );
          this.isBlacklist = true;
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
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
          // console.log( result.errorMessage );
          this.isBlacklist = false;
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'B-rfq-d-is-SupProfile');
  }
  createMsgForm() {
    this.messageForm = this._fb.group({
      subject: [this.iRfqMessageViewModelColl['messageSubject'], Validators.required],
      message: [this.iRfqMessageViewModelColl['messageDescr'], Validators.required],
    });
  }
  get currentRfqId() {
    // tslint:disable-next-line:radix
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
    this.selectedIds = this._rfqService.get('ViewSupplierProfileId');
    if (isArray(this.currentContactId)) {
      for (let i = 0; i < this.currentContactId.length; i++) {
        this.contactIds.push(this.currentContactId[i]);
      }
    } else {
      this.contactIds.push(this.currentContactId);
    }
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
  openMessageDrawer(event, contactId, messageRFQId) {
    this.messageViewInitModel();
    this.createMsgForm();
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(true, 'showSidePanelbuyerprofile');
    this._rfqService.set(true, 'isBuyerMessage1');
    this._rfqService.set(this.iContactViewModel.contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'supplierProfileDrawer');

  }
  isFieldValid1(field: string) {
    return this._customValidatorsService.isFieldValid(this.messageForm, field);
  }
  isFieldValid(field: string) {
    return this._customValidatorsService.isFieldValid(this.EmailForm, field);
  }
  setFollow(companyId) {
    if (!this.isFollowerSubmitted) {
      this.isFollowerSubmitted = true;
      this.iFollowContactViewModel.contactId = this.loggedId;
      this.iFollowContactViewModel.companyIdList[0] = companyId;
      this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
      this.iFollowContactViewModel.isFollow = true;
      this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.iAboutUsModel.isFollowing = true;
            // console.log( result.errorMessage );
            // this.getManufactureList();
          }
          this.isFollowerSubmitted = false;
        },
        error => {
          this.isFollowerSubmitted = false;
          this._rfqService.handleError(error);
        }
      );
    }
  }
  unFollow(companyId) {
    if (!this.isFollowerSubmitted) {
      this.isFollowerSubmitted = true;
      this.iFollowContactViewModel.contactId = this.loggedId;
      this.iFollowContactViewModel.companyIdList[0] = companyId;
      this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
      this.iFollowContactViewModel.isFollow = false;
      this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.iAboutUsModel.isFollowing = false;
            // console.log( result.errorMessage );
            // this.getManufactureList();
          }
          this.isFollowerSubmitted = false;
        },
        error => {
          this.isFollowerSubmitted = false;
          this._rfqService.handleError(error);
        }
      );
    }
  }


  onMessageSend() {
    this.messageViewInitModel();
    if (this.messageForm.valid) {
      this.iRfqMessageViewModelColl.toContactIds = this.contactIds;
      this.iRfqMessageViewModelColl.fromCont = this.from_id;
      this.iRfqMessageViewModelColl.messageDate = moment.utc(new Date()).toDate();
      this.iRfqMessageViewModelColl.pageName = 'component\buyer\component\supplier-view-profile\supplier-view-profile.component.ts';
      // tslint:disable-next-line:radix
      this.iRfqMessageViewModelColl.rfqId = (parseInt(localStorage.getItem('supplierRfqDetailId')));
      this.iRfqMessageViewModelColl.messageSubject = this.messageForm.value.subject;
      this.iRfqMessageViewModelColl.messageDescr = this.messageForm.value.message;
      localStorage.setItem('pagename', 'buyer\component\supplier-view-profile\supplier-view-profile.component.ts');
      this._rfqService.sendMessages(this.iRfqMessageViewModelColl).subscribe(
        result => {

          // this.iRfqMessageViewModelColl = result;
          if (result.result === true) {
            this.iRfqMessageViewModelColl = result;
            this.messageSuccessStatus = true;
            this.successOrFailureMsg = result.errorMessage;
            this._toastr.success(this.successOrFailureMsg, '');
            this.closePartDrawer();
            // this.resetErrorStatus('messageSuccessStatus');
            this._rfqService.set(true, 'messageSentFromRfq');
          } else {
            this.messageFailureStatus = true;
            // this.successOrFailureMsg = result.errorMessage;
            // this.resetErrorStatus('messageFailureStatus');
            this._toastr.error(result.errorMessage, 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    } else {
      this._customValidatorsService.validateAllFormFields(this.messageForm);
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
  resetBtn() {
    const subject = this.messageForm.value.subject;
    const message = this.messageForm.value.message;
    if (subject === '' || message === '') {
      return true;
    } else {
      return false;
    }
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
      () => {}
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
    let oappendText = '';
    let fixStr: '';
    if (fileName) {
      const filenNameArray = fileName.split('_S3_');
      if (filenNameArray.length === 1) {
        const charactorCount = filenNameArray[0].length;
        if (charactorCount > 29) {
          fixStr = fileName.slice(0, 29);
          oappendText = fixStr.concat(this.appendText);
        } else {
          return filenNameArray[0];
        }
      } else {
        const charactorCount = filenNameArray[1].length;
        if (charactorCount > 29) {
          fixStr = fileName.slice(0, 29);
          oappendText = fixStr.concat(this.appendText);
          return oappendText;
        } else {
          return filenNameArray[1];
        }

      }
      // return filenNameArray[1];
    }
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
              this._toastr.success('Message Sent Succefully', 'Success!');
            } else {
              this._toastr.error(this.iContactViewModel.errorMessage, 'Error!');
            }
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => {}
        );
      } else {
        this._customValidatorsService.validateAllFormFields(this.EmailForm);
      }
    }

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

}
