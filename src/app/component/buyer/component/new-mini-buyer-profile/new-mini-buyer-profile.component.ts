import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ICertificationViewModel,
  IAboutUsViewModel
} from '../../../../core/models/supplierProfileModel';
import {
  SupplierTypeViewModel
} from '../../../../core/models/globalMaster';
import {
  IContactViewModel
} from '../../../../core/models/accountModel';
import {
  SupplierService
} from '../../../../core/services/supplier/supplier.service';
import {
  RfqService
} from '../../../../core/services/rfq/rfq.service';
import {
  ProfileService
} from '../../../../core/services/profile/profile.service';
import {
  IviewedProfileViewModel
} from '../../../../core/models/profileModel';
import {
  IFollowContactViewModel
} from '../../../../core/models/settingsModel';
import {
  ISupplierDetailsViewModel
} from '../../../../core/models/supplierModel';
import {
  IRatingResponseViewModel
} from '../../../../core/models/rfqModel';

import { AppUtil } from '../../../../../app/app.util';

@Component({
  selector: 'new-app-mini-buyer-profile',
  templateUrl: './new-mini-buyer-profile.component.html',
  styleUrls: ['./new-mini-buyer-profile.component.scss']
})

export class NewMiniBuyerProfileComponent implements OnInit, OnDestroy {

  @Output() drawer_OnClose = new EventEmitter < any > ();
  @Input()
  selectedRFQ:any={};
  certificateViewModelList: ICertificationViewModel[]=[];
  languagesString: string="";
  defaultAwsPath = '';
  defaultPath = 'assets/';
  iAboutUsModelColl: IAboutUsViewModel[]=[];
  iAboutUsModel: IAboutUsViewModel;
  iSupplierTypeViewModel: SupplierTypeViewModel;
  SupplierTypeViewModel: SupplierTypeViewModel;
  iContactViewModel: IContactViewModel;
  iviewedProfileViewModel: IviewedProfileViewModel;
  currentContactName: string;
  contactlogo: string="";
  currentRfqid: number;
  iFollowContactViewModel: IFollowContactViewModel;
  iSupplierDetails: ISupplierDetailsViewModel[];
  isAddratingDisabled: boolean=false;;
  radio1: number=0;
  isNPSPupupShow: boolean=false;
  iRatingResponseViewModel: IRatingResponseViewModel;
  isloader: boolean=true;
  showFeedbackModel: boolean = false;
  companyName: string = '';
  companyId: number = 0;
  isFollowerSubmitted: boolean = false;
  accountType: string;
  showFollowedButton: boolean = false;
  showFollowunFollowBtnSideDrawer: boolean;
  showViewFullProfileSideDrawer: boolean;
  showOpenRfqsSideDrawer: boolean;
  showMessageBtnSideDrawer: boolean;
  showPhoneNoSideDrawer: boolean;
  showEmailSideDrawer: boolean;
  constructor(private _SupplierService: SupplierService, private _toastr: ToastrService, private _rfqService: RfqService, private _profileService: ProfileService, private sService: SupplierService, private router: Router) {
    
  }
  initModels() {
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      rfqId: 0,
      result: true,
      bookType: '',
      isFollow: false
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
      isBuyer: null,
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
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
      addressId: 0,
      comments: '',
      companyId: 0,
      contactIdEncrypt: '',
      isLoginFromVision: false,
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
    this.iRatingResponseViewModel = {
      responseId: 0,
      fromId: 0,
      toId: 0,
      parentId: 0,
      contactName: '',
      imageURL: '',
      createdDate: '2018-12-13T07:52:13.433Z',
      score: '',
      comment: '',
      isLegacyRating: false,
      messageId: 0,
      isNotNowClicked: false,
      errorMessage: '',
      result: false,
      rfqId: 0
    };
    
  }

  ngOnInit() {
    this.initModels();
    if (AppUtil.isNotEmptyString( localStorage.getItem('isMyRfqPage'))) {
      this.setProfileStatus();
    }
    this.getProfileDetails();
  }
  
  clickOutside() {
    this.closeBuyerProfileDrawer();
  }
  setProfileStatus() {
    localStorage.removeItem('isMyRfqPage');
   const iProfileSetModel= {
      contactId: this.loggedId,
      isCompanyDescription: null,
      isCompanyLogo: null,
      isCompanyBanner: null,
      isVisitMyRFQ: true,
      isCompanyCapabilities: null,
      isCompanyAddress:null,
      isPublishProfile: null
    };
    this._SupplierService.setProfileDashBoard(iProfileSetModel).subscribe(
      result => {
        if (result) {
          console.log(result);
        }
      }
    );
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'isBuyerMiniProfile');
  }
  get currentRfqId() {
    return parseInt(localStorage.getItem('detailRfqId'));
  }

  getProfileDetails() {
    this._profileService.getProfileDetails(this.selectedRFQ.contactIdEncrypt, this.loggedId).subscribe(
      result => {
        this.isAddratingDisabled = result.isRatingSpanComplete;
        this.iContactViewModel = result;
        this.checkMiniProfileFeature();
        this.isloader = false;
        if (!!this.iContactViewModel.contactPictureFile && this.iContactViewModel.contactPictureFile !== '') {
          this.contactlogo = this.defaultAwsPath + this.iContactViewModel.contactPictureFile;
        } else {
          this.contactlogo = '';
        }
        this.getAboutUsDetails();
        this.isViewProfile();
      },
      error => {
        this.isloader = false;
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  getAboutUsDetails() {
    this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.loggedId, this.iContactViewModel.isBuyer, this.loggedId).subscribe(
      (data: IAboutUsViewModel) => {
        this.iAboutUsModel = data['data'];
        if (this.iAboutUsModel.supplierType === null) {
          this.iAboutUsModel.supplierType = this.SupplierTypeViewModel;
        }
        if (this.iAboutUsModel.description === '' || this.iAboutUsModel.description === null ||
          this.iAboutUsModel.description === undefined) {
          this.iAboutUsModel.description = '';
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
        this.isloader = false;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  closeBuyerProfileDrawer() {
    this.drawer_OnClose.emit({drawerClose:true});
  }
  openMessageDrawer(event, contactId, messageRFQId) {
   // this._rfqService.set(true, 'isMessageDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'isBuyerMessage');
    this._rfqService.set(true, 'messageRfqForFollowedBuyer');
    this._rfqService.set(this.iContactViewModel.contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'supplierProfileDrawer');
    this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'nameOfBuyer');
  }
  readMore(buyerCompanyId) {
     this.drawer_OnClose.emit({showBuyerCommpleteProfile:true});
    localStorage.setItem('buyerCompanyId', buyerCompanyId);
    this._rfqService.set(true, 'isBuyerCommpleteProfile');
    this._rfqService.set(this.iContactViewModel.companyId, 'buyerCurrentProfileCompanyId');
    this._rfqService.set(this.iContactViewModel.contactId, 'buyerOCurrentProfileContactId');
    this._rfqService.set(this.iContactViewModel.contactIdEncrypt, 'buyerCurrentProfileContactId');
    this._rfqService.set(this.iContactViewModel.contactIdEncrypt, 'buyerCurrentProfileEncriptContactId');
    this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'nameOfBuyer');
  }
  get loggedId() {
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }
  isViewProfile() {
    this.iviewedProfileViewModel.contactId = this.loggedId;
    this.iviewedProfileViewModel.companyIdProfile = this.iContactViewModel.companyId;
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
  
    if (!this.isFollowerSubmitted) {
      this.isFollowerSubmitted = true;

      this.iFollowContactViewModel.contactId = this.loggedId;
      this.iFollowContactViewModel.companyIdList[0] = manufactureId;
      this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
      this.iFollowContactViewModel.isFollow = true;
      this.sService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.iAboutUsModel.isFollowing = true;
            this.drawer_OnClose.emit({relodeRfqData:true});
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
  unFollow(manufactureId) {
    if (!this.isFollowerSubmitted) {
      this.isFollowerSubmitted = true;
      this.iFollowContactViewModel.contactId = this.loggedId;
      this.iFollowContactViewModel.companyIdList[0] = manufactureId;
      this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
      this.iFollowContactViewModel.isFollow = false;
      this.sService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.iAboutUsModel.isFollowing = false;
            this.drawer_OnClose.emit({relodeRfqData:true});
            // this._rfqService.set(true, 'followUnFollowChange');
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
  isAllowd() {
    return this.radio1 === 0;
  }
  showRatingModel() {
    this.isNPSPupupShow = true;
    this._rfqService.set(true, 'isModelShow');
    this._rfqService.set(this.iContactViewModel.contactId, 'isFormcotactId');
    this._rfqService.set(this.iContactViewModel.company.name, 'ComapnyName');
    this._rfqService.set(this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName, 'manufacturerName');
    this._rfqService.set(this.iContactViewModel.contactPictureFile, 'contactPictureFile');
  }

  closeNPSPopup() {
    this.iRatingResponseViewModel.isNotNowClicked = true;
    this.iRatingResponseViewModel.score = '';
    this.submitResponse();
  }
  submitResponse() {
    this._SupplierService.AddNPSResponse(this.iRatingResponseViewModel).subscribe(
      result => {
        if (result.result === true) {
          if (this.iRatingResponseViewModel.score === '') {
            this.isNPSPupupShow = false;
            this.radio1 = 0;
          } else {
            this._toastr.success(result.errorMessage, 'Success!');
            this.isNPSPupupShow = false;
            this.radio1 = 0;
          }
        } else {
          this._toastr.error(result.errorMessage, 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }

  openFeedbackModel(compName, compId) {
    this.companyName = compName;
    this.companyId = compId;
    this.showFeedbackModel = true;
  }
  reloadProfile(event) {
    if (event) {
      this.getProfileDetails();
    }
  }

  checkMiniProfileFeature(){
    this._SupplierService.getTileAvailability(this.loggedId, parseInt(localStorage.getItem('loggedCompanyId'))).subscribe(
      (result) => {
        this.showFollowunFollowBtnSideDrawer = result[0].showFollowunFollowBtnSideDrawer;
        this.showViewFullProfileSideDrawer =result[0].showViewFullProfileSideDrawer;
        this.showOpenRfqsSideDrawer = result[0].showOpenRfqsSideDrawer;
        this.showMessageBtnSideDrawer = result[0].showMessageBtnSideDrawer;
        this.showPhoneNoSideDrawer = result[0].showPhoneNoSideDrawer;
        this.showEmailSideDrawer = result[0].showEmailSideDrawer;
      },
      (error) => {
        console.log("err", error);
      }
    );
  }  
}
