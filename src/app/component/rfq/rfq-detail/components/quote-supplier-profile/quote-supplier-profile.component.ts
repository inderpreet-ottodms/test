import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';
import {
  ICertificationViewModel,
  IAboutUsViewModel
} from '../../../../../core/models/supplierProfileModel';
import {
  SupplierTypeViewModel
} from '../../../../../core/models/globalMaster';
import {
  IContactViewModel
} from '../../../../../core/models/accountModel';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  ILeadUserViewModel,
  IviewedProfileViewModel
} from '../../../../../core/models/profileModel';
import {
  IFollowContactViewModel
} from '../../../../../core/models/settingsModel';
import {
  ISupplierDetailsViewModel, LikeUnlikeManufacturerRequestModel
} from '../../../../../core/models/supplierModel';
import {
  BuyerService
} from '../../../../../core/services/buyer/buyer.service';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-quote-supplier-profile',
  templateUrl: './quote-supplier-profile.component.html',
  styleUrls: ['./quote-supplier-profile.component.scss',
    '../../../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class QuoteSupplierProfileComponent implements OnInit, OnDestroy {
  @Output() drawer_OnClose = new EventEmitter < boolean > ();
  isApi: boolean;
  certificateViewModelList: ICertificationViewModel[];
  languagesString: string;
  defaultAwsPath = '';
  defaultPath = 'assets/';
  iAboutUsModelColl: IAboutUsViewModel[];
  iAboutUsModel: IAboutUsViewModel;
  iSupplierTypeViewModel: SupplierTypeViewModel;
  SupplierTypeViewModel: SupplierTypeViewModel;
  iContactViewModel: IContactViewModel;
  iviewedProfileViewModel: IviewedProfileViewModel;
  currentContactId: number;
  currentContactName: string;
  currentCompanyId: number;
  contactlogo: string;
  currentRfqid: number;
  iFollowContactViewModel: IFollowContactViewModel;
  iSupplierDetails: ISupplierDetailsViewModel[];
  companyName: string;
  isAddratingDisabled: boolean;
  isNPSPupupShow: boolean;
  isFollowClick: boolean = false;
  likeUnlikeManufacturerRequestModel: LikeUnlikeManufacturerRequestModel;
  buyerEmail: string = '';
  constructor(private router: Router,private _SupplierService: SupplierService, private _masterService: MasterService,
    private _toastr: ToastrService, private _rfqService: RfqService, private _profileService: ProfileService,
    private sService: SupplierService, private _buyerService: BuyerService) {
    this.certificateViewModelList = [];
    this.isAddratingDisabled = false;
    this.isNPSPupupShow = false;
    this.contactlogo = '';
    this.iAboutUsModelColl = [];
    this.isApi = true;
    this.languagesString = '';
    this.currentContactId = this._rfqService.get('quoteContactId');
    this.currentContactName = this._rfqService.get('quoteContactName');
    this.companyName = this._rfqService.get('quoteCompanyName');
    this.buyerEmail = localStorage.getItem('User2');
    this.currentRfqid = this.currentRfqId;

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
    this.iSupplierTypeViewModel = {
      blockUsersiteSelection: false,
      industryId: 0,
      supplierTypeId: 0,
      supplierTypeName: '',
      supplierTypeNameEn: ''
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
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      comments: '',
      contactIdEncrypt: '',
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
    this.iviewedProfileViewModel = {
      viewProfileId: 0,
      contactId: 0,
      companyIdProfile: 0,
      profileViewedDate: null,
      contactIdProfile: 0,
      errorMessage: '',
      result: false
    };
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      result: true,
      rfqId: 0,
      bookType: '',
      isFollow: false
    };
  }

  ngOnInit() {
    if (this.currentContactId !== 0) {
      this.getProfileDetails();
    } else {
      this.currentCompanyId = this._rfqService.get('supplierCompanyId');
      this.getAboutUsDetails();
      this.getCertificateList();
      this.isViewProfile();
    }
    setTimeout(() => {
      this.setLeadStream();
    }, 1000);
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

  get currentRfqId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  readMore() {
    localStorage.setItem('ViewSupplierProfileId', this.iContactViewModel.contactId.toString());
    localStorage.setItem('ViewSupplierProfileName', this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName);     
    // window.open(this.iAboutUsModel.communityCompanyProfileUrl, '_blank');     
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/source'], { queryParams: {page: this.iContactViewModel.profileDetailUrl}})
    );
 
    window.open("#"+ url, '_blank');
  }

  getProfileDetails() {
    this.currentContactId = this._rfqService.get('quoteContactId');
    this.currentContactName = this._rfqService.get('quoteContactName');
    this.companyName = this._rfqService.get('quoteCompanyName');
    this._profileService.getProfileDetails(this.currentContactId, this.loggedId).subscribe(
      result => {
        this.isAddratingDisabled = result.isRatingSpanComplete;
        this.iContactViewModel = result;
        localStorage.setItem('buplicProfileSupplierId', this.iContactViewModel.contactId.toString());
        this.isApi = false;
        if (!!this.iContactViewModel.contactPictureFile && this.iContactViewModel.contactPictureFile !== '') {
          this.contactlogo = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
        } else {
          this.contactlogo = '';
        }
        this.currentCompanyId = this.iContactViewModel.companyId;
        this.getAboutUsDetails();
        this.getCertificateList();
        this.isViewProfile();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  getAboutUsDetails() {
    const contactId = this.currentContactId;
    const companyId = this.currentCompanyId;
    this._SupplierService.getAboutUsDetails(companyId, this.iContactViewModel.contactId, false, this.loggedId).subscribe(
      (data: IAboutUsViewModel) => {
        this.iAboutUsModel = data['data'];
        if (this.iAboutUsModel.supplierType === null) {
          this.iAboutUsModel.supplierType = this.SupplierTypeViewModel;
        }
        if (this.iAboutUsModel.description === '' || this.iAboutUsModel.description === null ||
          this.iAboutUsModel.description === undefined) {
          this.iAboutUsModel.description = '';
        }
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

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  getCertificateList() {
    this._masterService.getCertificate(this.currentCompanyId).subscribe(
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
  closeSupplierProfileDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(true, 'ManuViewDrawerDataSaved');
    this._rfqService.set(true, 'ismyrfqdataback');
    this._rfqService.set(null, 'quoteContactId');
    this._rfqService.set(null, 'checkFocus');
    this._buyerService.setProfileEvent(true);
    this.drawer_OnClose.emit(true);
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
      event.stopPropagation();
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMessage');
      this._rfqService.set(true, 'messageRfq');
      this._rfqService.set(fromContName, 'nameOfBuyer');
      this._rfqService.set(contactId, 'selectContactIdsForMEessage');
      this._rfqService.set(messageRFQId, 'selectContactRFQId');
      this._rfqService.set(false, 'supplierProfileDrawer');
      this._rfqService.set(false, 'messageThreadDrawer');
    }
  }
  ngOnDestroy() {
    // this.closeSupplierProfileDrawer();
  }

  checkPartChange() {
    const currentPartId = this._rfqService.get('quoteContactId');
    if (this.currentContactId !== currentPartId) {
      this.currentContactId = this._rfqService.get('quoteContactId');
      this.currentContactName = this._rfqService.get('quoteContactName');
      this.getProfileDetails();
    }
  }

  isViewProfile() {
    this.iviewedProfileViewModel.contactId = this.loggedId;
    this.iviewedProfileViewModel.companyIdProfile = this.currentCompanyId;
    this._profileService.setViewProfile(this.iviewedProfileViewModel).subscribe(
      result => {
        // console.log('resultview', result);
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  setFollow(manufactureId) {
    if (!this.isFollowClick) {
      this.isFollowClick = true;
      this.iFollowContactViewModel.contactId = this.loggedId;
      this.iFollowContactViewModel.companyIdList[0] = manufactureId;
      this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
      this.iFollowContactViewModel.isFollow = true;
      this.sService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.iAboutUsModel.isFollowing = true;
            this._rfqService.set(true, 'followUnFollowChange');
            this.isFollowClick = false;
          }
        },
        error => {
          this.isFollowClick = false;
          this._rfqService.handleError(error);
        }
      );
    }
  }
  unFollow(manufactureId) {
    if (!this.isFollowClick) {
      this.isFollowClick = true;
      this.iFollowContactViewModel.contactId = this.loggedId;
      this.iFollowContactViewModel.companyIdList[0] = manufactureId;
      this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
      this.iFollowContactViewModel.isFollow = false;
      this.sService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.iAboutUsModel.isFollowing = false;
            this._rfqService.set(true, 'followUnFollowChange');
            this.isFollowClick = false;
          }
        },
        error => {
          this.isFollowClick = false;
          this._rfqService.handleError(error);
        }
      );
    }
  }

  showRatingModel() {
    this.isNPSPupupShow = true;
    this._rfqService.set(true, 'isModelShow');
    this._rfqService.set(this.iContactViewModel.contactId, 'isFormcotactId');
    this._rfqService.set(this.iContactViewModel.company.name, 'ComapnyName');
    this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'manufacturerName');
    this._rfqService.set(this.iContactViewModel.contactPictureFile, 'contactPictureFile');
  }

  isminiDrawerData() {
    if (this._rfqService.get('isminiDrawerData') === true) {
      this.isApi = true;
      this._rfqService.set(false, 'isminiDrawerData');
      this.getProfileDetails();
    }
  }
  setLeadStream() {
    let isLoginFromVision = sessionStorage.getItem('isLoginFromVision');
    let iLeadUserViewModel: ILeadUserViewModel = {
      leadInteractionType: 'InAppProfileView',
      contactId: this.loggedId,
      companyId: this.currentCompanyId,
      ipAddress: '',
      leadId: 0,
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      emailSubject: '',
      emailMessage: '',
      companyName: '',
      errorMessage: '',
      result: false,
      isVisionUser: (isLoginFromVision == 'true') ? true : false
    }
    this._masterService.setSetLeadUser(iLeadUserViewModel).subscribe(
      response => {
        if (response.result) {}
      });
  }

  unLikeSupplier(companyId) {
    this.likeUnlikeManufacturerRequestModel = new LikeUnlikeManufacturerRequestModel();
    this.likeUnlikeManufacturerRequestModel = {
      buyerContactId: this.loggedId,
      supplierCompanyId: companyId,
      buyerEmail: this.buyerEmail,
      supplierEmail: this.iContactViewModel.accountEmail,
      isLike: false,
      buyerIpAddress: ''
    }
    this._buyerService.likeunLikeCommunityManufacturer(this.likeUnlikeManufacturerRequestModel).subscribe(
      result => {
       this._toastr.success('You successfully unliked the supplier', 'success!');
       this.iContactViewModel.isLike = false;
      }, error => {
      console.log(error, 'error');
    });
  }
  likeSupplier(companyId) {
    this.likeUnlikeManufacturerRequestModel = new LikeUnlikeManufacturerRequestModel();
    this.likeUnlikeManufacturerRequestModel = {
      buyerContactId: this.loggedId,
      supplierCompanyId: companyId,
      buyerEmail: this.buyerEmail,
      supplierEmail:  this.iContactViewModel.accountEmail,
      isLike: true,
      buyerIpAddress: ''
    }
    this._buyerService.likeunLikeCommunityManufacturer(this.likeUnlikeManufacturerRequestModel).subscribe(
      result => {
       this._toastr.success('You successfully liked the supplier', 'success!');
       this.iContactViewModel.isLike = true;
      }, error => {
      console.log(error, 'error');
    });
  }
}
