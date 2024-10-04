import {
  Component,
  OnInit,
  ViewEncapsulation,
  NgZone,
  HostListener, Output, EventEmitter
} from '@angular/core';
import {
  ToastrService
} from 'ngx-toastr';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  IAboutUsViewModel,
  ICertificationViewModel
} from '../../../../../core/models/supplierProfileModel';
import {
  Subscription
} from 'rxjs';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  IContactViewModel,
  IViewProfileGetPriceAwardPatterView,
  I3dTourViewModel,
  IVideoModel
} from '../../../../../core/models/accountModel';
import {
  SupplierTypeViewModel
} from '../../../../../core/models/globalMaster';
import {
  RfqService
} from '../../../../../core/services/rfq/rfq.service';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  // styleUrls: ['./about-us.component.scss'],
  styleUrls: [
    './about-us.component.scss',
    '../../../../../../assets/icon/icofont/css/icofont.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AboutUsComponent implements OnInit {
  @Output () profileChanges = new EventEmitter();
  certificateViewModelList: ICertificationViewModel[];
  languagesString: string;
  defaultAwsPath = '';
  iAboutUsModelColl: IAboutUsViewModel[];
  iAboutUsModel: IAboutUsViewModel;
  isDemographics: boolean;
  iSupplierTypeViewModel: SupplierTypeViewModel;
  prevPage = '';
  private _subscription: Subscription;
  private _options: Object;
  currentPhoto: string;iContactViewModel: IContactViewModel;
  currentPhotoTitle: string;
  currentPhotoCaption: string;
  SupplierTypeViewModel: SupplierTypeViewModel;
  activeStatusFilterBtn: number;
  activePriceStatusFilterBtn: number;
  iViewProfileGetPriceAwardPatterView: IViewProfileGetPriceAwardPatterView;
  isFileDownloaded: number;
  isVideo: boolean;
  // pie chart
  pieChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    }
  };
  pieChartLabels: any = [];
  pieChartColor: any;
  pieChartData: any = [{
    data: [],
  }];

  // lineChart
  public lineChartData: Array < any > = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  public lineChartLabels: Array < any > = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType = 'line';

  // linechart2
  dataSource = {
    'chart': {
      'caption': 'Price Award Pattern',
      'yaxisname': 'Price',
      'xaxisname': 'Awards',
      // 'subcaption': '[2005-2012]',
      'numbersuffix': '$',
      'rotatelabels': '1',
      'setadaptiveymin': '1',
      'theme': 'gammel'
    },
    data: []
  };
  width = 700;
  height = 400;
  type = 'line';
  dataFormat = 'json';
  isLoader: boolean;
  ispriceLoader: boolean;
  EmailId: string;
  _3DListArray: I3dTourViewModel[];
  _videoList: IVideoModel[];
  isAdmin: boolean;
  constructor(private _SupplierService: SupplierService, private _masterService: MasterService,
    private _toastr: ToastrService, private _profileService: ProfileService,
    private _ngZone: NgZone, private _rfqService: RfqService) {
    this._options = {};
    this.EmailId = localStorage.getItem('User2');
    this.certificateViewModelList = [];
    this.iAboutUsModelColl = [];
    this.languagesString = '';
    this.currentPhoto = '';
    this.currentPhotoTitle = '';
    this.currentPhotoCaption = '';
    this.isDemographics = true;
    this.activeStatusFilterBtn = 90;
    this.activePriceStatusFilterBtn = 90;
    this.isVideo = false;
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
      _3dTourUrl: '',
      name: '',
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
      _3dTourUrlList: [],
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
      comments: '',
      originalContactPictureFile: '',
      originalLogoOfCompany: '',
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
      isVisionUserRequest:false,
      instagram: ''
    };
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
    this._3DListArray = [];
    this._videoList = [];
    this.isLoader = false;
    this.ispriceLoader = false;
    this.GetPriceAwardPattern(this.activePriceStatusFilterBtn);
    this.getRFQCountGeographicLocation(this.activeStatusFilterBtn);
  }

  ngOnInit() {
    this.isFileDownloaded = 0;
    this.getProfileDetailsLocal();

  }
  getProfileDetailsLocal() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (ContactModelFromLocal !== null) {
      this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
      this.getAboutUsDetails();
      this.getCertificateList();
    } else {
      this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          this.isAdmin = this.iContactViewModel.isAdmin;
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
          this.getAboutUsDetails();
          this.getCertificateList();
        },
        error => {
          this._rfqService.handleError(error);
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
        this.getAboutUsDetails();
        this.getCertificateList();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
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

  openPhoto(fileName, isVideo) {
    this.isVideo = isVideo;
    if ( this.isVideo ) {
      this.currentPhoto = this._3DListArray.find(m => m.company3dtourId === fileName)._3dTourUrl;
      this.currentPhotoCaption = this._3DListArray.find(m => m.company3dtourId === fileName).description;
      this.currentPhotoTitle = this._3DListArray.find(m => m.company3dtourId === fileName).title;
    } else {
      this.currentPhoto = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileName;
      this.currentPhotoCaption = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileCaption;
      this.currentPhotoTitle = this.iAboutUsModel.specialFiles.find(m => m.fileName === fileName).fileTitle;
    }

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

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.goToNext();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.goToPrev();
    }
  }

//getAboutUsDetails
  getAboutUsDetails() {
    const contactId = this.loggedId;
    this.isAdmin = this.iContactViewModel.isAdmin;
    // tslint:disable-next-line:max-line-length
    this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.iContactViewModel.contactId, false, this.loggedId).subscribe(
      (data: IAboutUsViewModel) => {
        this._SupplierService.getVideosList(this.iContactViewModel.companyId).subscribe(
          (res: any) => {
            this._videoList = res.data;
            this._SupplierService.set(res.data, 'videoList');
            console.log('get videos....', res.data);
            this._3DListArray = [];
            this.iAboutUsModel = data['data'];
            this.iAboutUsModel._3dTourUrlList = data['data']._3dTourUrlList;
            if (this.iAboutUsModel._3dTourUrlList) {
              for (let index = 0; index < this.iAboutUsModel._3dTourUrlList.length; index++ ) {
                let temp = {
                  company3dtourId: null,
                  companyId: this.loggedCompanyId,
                  _3dTourUrl: '',
                  title: '',
                  description: '',
                  isDeleted: false,
                  errorMessage: '',
                  result: false,
                }
                temp._3dTourUrl = this.iAboutUsModel._3dTourUrlList[index]._3dTourUrl;
                temp.company3dtourId = this.iAboutUsModel._3dTourUrlList[index].company3dtourId;
                temp.companyId = this.iAboutUsModel._3dTourUrlList[index].companyId;
                temp.description = this.iAboutUsModel._3dTourUrlList[index].description;
                temp.errorMessage = this.iAboutUsModel._3dTourUrlList[index].errorMessage;
                temp.isDeleted = this.iAboutUsModel._3dTourUrlList[index].isDeleted;
                temp.result = this.iAboutUsModel._3dTourUrlList[index].result;
                temp.title = this.iAboutUsModel._3dTourUrlList[index].title;
                this._3DListArray.push(temp);
              };
            }
            const userType = localStorage.getItem('Usertype');
            this._SupplierService.set(this._3DListArray, 'company_3dTourUrl');
            if ( this._3DListArray.length ) {
              this._SupplierService.set(this._3DListArray.length, 'is3dtour');
            } else {
              this._SupplierService.set(null, 'is3dtour');
            }
            if (userType === 'Supplier') {
              localStorage.setItem('publicCompanyUrl', this.iAboutUsModel.companyURL);
            }
            if (this.iAboutUsModel.companyType) {
              this.isDemographics = true;
            } else {
              this.isDemographics = false;
            }
            if (this.iAboutUsModel.supplierType === null) {
              this.iAboutUsModel.supplierType = this.SupplierTypeViewModel;
            }
            if (this.iAboutUsModel.description === '' || this.iAboutUsModel.description === null ||
              this.iAboutUsModel.description === undefined) {
              this.iAboutUsModel.description = '';
            }
            if(this.iAboutUsModel.equipments != null && this.iAboutUsModel.equipments != undefined && this.iAboutUsModel.equipments.length){
              this.iAboutUsModel.equipments.sort((a) =>{
                return a.isFile ? -1 : 1 // `true` values first
              });
            }
            if (!!this.iAboutUsModel.equipments && this.iAboutUsModel.equipments.length > 20) {
              this.iAboutUsModel.equipments = this.iAboutUsModel.equipments.slice(-20);
            }
            if (!this.iAboutUsModel.equipments) {
              this.iAboutUsModel.equipments = [];
            }
            if (!!this.iAboutUsModel.languages && this.iAboutUsModel.languages.length > 20) {
              this.iAboutUsModel.languages = this.iAboutUsModel.languages.slice(0, 20);
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
            } else {
              this.iAboutUsModel.specialFiles = [];
            }
          })
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
        } else {
          this.certificateViewModelList = [];
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  isSidePanelOpen() {
    const isOpen = this._SupplierService.get('supplierSidePanel');
    if (isOpen !== null && isOpen !== undefined) {
      return this._SupplierService.get('supplierSidePanel');
    } else {
      return false;
    }
  }
  reloadPageOndrawerClose() {
    if (this._SupplierService.get('companyPhotosClosedFromInside')) {
      this._SupplierService.set(false, 'companyPhotosClosedFromInside');
      this.getProfileDetails();
      this.getAboutUsDetails();
    }
    if (this._SupplierService.get('aboutUsDrawerDataSaved')) {
      this._SupplierService.set(false, 'aboutUsDrawerDataSaved');
      if (this._SupplierService.get('editCompanyDescription')) {
        this._SupplierService.set(false, 'editCompanyDescription');
        this.getAboutUsDetails();
      } else {
        this.getProfileDetails();
        this.getCertificateList();
      };
      if (this._SupplierService.get('saveEquipment')) {
        this._SupplierService.set(false, 'saveEquipment');
        this.getAboutUsDetails();
      }
    }
  }
  openSidePanel(page) {
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(this.iContactViewModel.companyId, 'companyId');
    this._SupplierService.set(true, 'supplierSidePanel');
    this._SupplierService.set(true, 'aboutUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(false, 'ratingReply');
    if (this.prevPage === 'companyPhotos') {
      this._SupplierService.set(true, 'companyPhotosClosedFromInside');
      this.prevPage = '';
    }
    if (page === 'contactInformation') {
      this._SupplierService.set(true, 'contactInformation');
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
    }
    if (page === 'companyDescription') {
      this._SupplierService.set(this.iContactViewModel.companyId, 'companyId');
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(true, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
      this._SupplierService.set(this.iAboutUsModel.description, 'companyDescriptionValue');
    }
    if (page === 'companyEquipment') {
      this._SupplierService.set(true, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
    }
    if (page === 'companyPhotos') {
      this._SupplierService.set(this.iContactViewModel.companyId, 'companyId');
      this._SupplierService.set(false, 'companyPhotosClosedFromInside');
      this.prevPage = 'companyPhotos';
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(true, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
    }
    if (page === 'companyDemographics') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(true, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
    }
    if (page === 'companyCertifications') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(true, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
    }
    if (page === 'companyVideos') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(true, 'companyVideos');
      this._SupplierService.set(false, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
    }
    if (page === 'companyVideos1') {
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyVideos');
      this._SupplierService.set(true, 'companyVideos1');
      this._SupplierService.set(false, 'contactInformation');
    }

  }

  openDemographicsDetail(demographicsId) {
    this._SupplierService.set(demographicsId, 'demographicsId');
  }

  removeCertificate(tempCertificate) {
    this._SupplierService.RemoveCertificatesforCompany(this.iContactViewModel.companyId, tempCertificate.certificateId).subscribe(
      result => {
        if (result.result) {
          this._toastr.success(result.errorMessage, 'Success');
          this.getCertificateList();
          this.profileChanges.emit(true);
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
  // setStatusFilter (btnState: string) {
  //   this.activeStatusFilterBtn = btnState;
  // }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  stopVideo() {
    this.currentPhoto = '';
  }
  getRFQCountGeographicLocation(btnState: number) {
    this.isLoader = true;
    this.activeStatusFilterBtn = btnState;
    this.pieChartData = [{
      data: [],
    }];
    this._profileService.GetRFQCountGeographicLocation(this.loggedCompanyId, this.activeStatusFilterBtn).subscribe(res => {
      // console.log('grocount', res);
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
      }
    }, error => {
      this._rfqService.handleError(error);
      this.isLoader = false;
      console.log(error);
    });
  }

  GetPriceAwardPattern(btnState: number) {
    this.ispriceLoader = true;
    this.activePriceStatusFilterBtn = btnState;
    this.iViewProfileGetPriceAwardPatterView.companyId = this.loggedCompanyId;
    this.iViewProfileGetPriceAwardPatterView.days = btnState;
    this._profileService.GetPriceAwardPattern(this.iViewProfileGetPriceAwardPatterView).subscribe(res => {
      // console.log('pricegrap', res);
      if (res.result === true) {
        this.dataSource.data = [];
        for (let i = 0; res.data.length > i; i++) {
          const obj = {
            value: res.data[i].price.toString(),
          };
          this.dataSource.data[i] = obj;
          this.ispriceLoader = false;
        }
      } else {
        this.ispriceLoader = false;
      }
    }, error => {
      this._rfqService.handleError(error);
      this.ispriceLoader = false;
      console.log(error);
    });
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

  isPremium() {
    // if (JSON.parse(localStorage.getItem('IsPremium'))) {
    //   return true;
    // } else {
    //   return false;
    // }
    return this._profileService.getAccountType();
  }
  getOriginalFileName(fileName) {
    if (fileName !== null) {
      const filenNameArray = (fileName).split('_S3_');
      return filenNameArray[1];
    } else {
      return '';
    }
  }
}
