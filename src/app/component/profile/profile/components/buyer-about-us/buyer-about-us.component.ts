import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  AfterViewInit,
  ElementRef
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
  IAddressModel,
  IContactViewModel,
  IProfileViewModel,
  IViewProfileGetPriceAwardPatterView
} from '../../../../../core/models/accountModel';
import {
  SupplierTypeViewModel
} from '../../../../../core/models/globalMaster';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { ChartType, ChartOptions } from 'chart.js';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-buyer-about-us',
  templateUrl: './buyer-about-us.component.html',
  styleUrls: [
    './buyer-about-us.component.scss',
    '../../../../../../assets/icon/icofont/css/icofont.scss'
  ],
})
export class BuyerAboutUsComponent implements OnInit, AfterViewInit  {

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
  currentPhoto: string; iContactViewModel: IContactViewModel;
  currentPhotoTitle: string;
  currentPhotoCaption: string;
  SupplierTypeViewModel: SupplierTypeViewModel;
  activeStatusFilterBtn: number;
  activePriceStatusFilterBtn: number;
  iViewProfileGetPriceAwardPatterView: IViewProfileGetPriceAwardPatterView;
  isFileDownloaded: number;
  iProfileViewModel: IProfileViewModel;
  isMailingAvaible: boolean;
  // pie chart
  pieChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    },
  };
  // data = [{
  //     'rfqCount': 2,
  //     'geographicLocation': 'Asia Pacific',
  //     'rfqPercentage': 28.57
  //   },
  //   {
  //     'rfqCount': 3,
  //     'geographicLocation': 'Mexico',
  //     'rfqPercentage': 42.86
  //   },
  //   {
  //     'rfqCount': 2,
  //     'geographicLocation': 'United States / Canada',
  //     'rfqPercentage': 28.57
  //   }
  // ];


  // // lineChart
  // public lineChartData: Array < any > = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];
  // public lineChartLabels: Array < any > = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // public lineChartType = 'line';

  // linechart2
  dataSource = {
    'chart': {
      'theme': 'zune',
      'caption': 'Price Award Pattern',
      'yaxisname': 'Price (%)',
      'xaxisname': 'Awards',
      'formatNumber': '0',
      // 'subcaption': '[2005-2012]',
      //  'numbersuffix': '%',
      // 'rotatelabels': '1',
      // 'setadaptiveymin': '1',
      'showYAxisValues': '0',
      'showLimits': '1',
      'yAxisMinValue' : '0',
      'yAxisMaxValue': '100',
      'showToolTip':'0'

    },
    data: [ ]
  };
// data1 = [
//   {
//     // 'label': '2005',
//     'value': '89.45'
//   },
//   {
//     // 'label': '2006',
//     'value': '89.87'
//   },
//   {
//     // 'label': '2007',
//     'value': '89.64'
//   },
//   {
//     // 'label': '2008',
//     'value': '90.13'
//   },
//   {
//     // 'label': '2009',
//     'value': '90.67'
//   },
//   {
//     // 'label': '2010',
//     'value': '90.54'
//   },
//   {
//     // 'label': '2011',
//     'value': '90.75'
//   },
//   {
//     // 'label': '2012',
//     'value': '90.8'
//   }];
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
      // mode 'label', 'value' or 'percentage', default is 'percentage'
      render: 'percentage'
    },

  }];
  // chartOptions = {
  //   responsive: true,
  //   scaleShowVerticalLines: false,
  // }
  // public doughnutChartLabels: string[] = ['2000', '2001', '2002', '2003', '2004', '2005', '2006'];
  // // public doughnutChartData: number[] = [0, 10, 20,30,40,50,60,70,80,90,100];
  // //const labels = Utils.months({count: 7});
  //  data = {
  //   labels: this.doughnutChartLabels,
  //   datasets: [{
  //     label: 'My First Dataset',
  //     data: [65, 59, 80, 81, 56, 55, 40],
  //     fill: false,
  //     borderColor: 'rgb(75, 192, 192)',
  //     tension: 0.1
  //   },
  //   {
  //     label: 'My second Dataset',
  //     data: [65, 59, 80, 81, 56, 55, 40],
  //     fill: false,
  //     borderColor: 'rgb(75, 192, 192)',
  //     tension: 0.1
  //   }]
  // };
  isLoader: boolean;
  ispriceLoader: boolean;
  // iContactViewModel: IContactViewModel;
  iAddressModel: IAddressModel;
  completeAddress: string;
  @ViewChild('lineCanvas',{static:false}) lineCanvas: ElementRef;
  lineChart: any;
  priceAwardData: any;
  noOfDays: number = 90;
  constructor(private _SupplierService: SupplierService, private _masterService: MasterService,
    private _toastr: ToastrService, private _profileService: ProfileService,
     private _ngZone: NgZone, private _rfqService: RfqService) {
    this._options = {};
    this.certificateViewModelList = [];
    this.iAboutUsModelColl = [];
    this.languagesString = '';
    this.currentPhoto = '';
    this.currentPhotoTitle = '';
    this.currentPhotoCaption = '';
    this.isDemographics = true;
    this.activeStatusFilterBtn = 90;
    this.activePriceStatusFilterBtn = 90;
    this._SupplierService.set(false, 'companyPhotosClosedFromInside');
    this.completeAddress = '';

    this.iAddressModel = {
      address5: '',
      addressId: 0,
      addressType: 0,
      city: '',
      countryId: 0,
      deptAddress: '',
      errorMessage: '',
      isActive: false,
      postalCode: '',
      country: '',
      showInProfile: true,
      showOnlyStateCity: true,
      state: '',
      stateId: 0,
      streetAddress: '',
      result: false,
      companyShippingSiteViewModelList: []
    };
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
      _3dTourUrlList:[]
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
      contactIdEncrypt: '',

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
      // address: null,
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
      instagram: '',
      address: this.iAddressModel,
    };

    this.iViewProfileGetPriceAwardPatterView = {
      companyId: 0,
      maxPrice: 0,
      minPrice: 0,
      averagePrice: 0,
      days: 0
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
      companyShippingSiteViewModelList: [],
    };

    // this.pieChartLabels = ['Region Here', 'Region Here', 'Region Here', 'Region Here'];

    this.pieChartColor = [{
      backgroundColor: ['#4a90e2', '#81db6d', '#ffb74e', '#ff5471']
    }];
    this.isLoader = false;
    this.ispriceLoader = false;
    this.GetPriceAwardPattern(this.activePriceStatusFilterBtn);
    this.getRFQCountGeographicLocation(this.activeStatusFilterBtn);

  }
 
  ngOnInit() {
    this.isFileDownloaded = 0;
    this.getProfileDetails();
    this.getProfileDetailsFromContactUS();
   // console.log('IN BUYER ABOUT US COMPONENT NGONINIT')
  }
  ngAfterViewInit(): void {
    console.log("afterinit");
    // this.lineChartMethod();
    // setTimeout(() => {
    //    this.lineChartMethod();
    // }, 1000);
  
  }

  isReadMore = true
  isLoadMore = true;
  photoArray: any = [];
  showText() {
     this.isReadMore = !this.isReadMore;
  }
  loadPhotos() {
    if(this.isLoadMore) {
      this.photoArray.push(this.iAboutUsModel.specialFiles);
      this.photoArray = this.photoArray.filter(val => !this.iAboutUsModel.specialFiles.includes(val))[0];
      this.isLoadMore =!this.isLoadMore;
    } else {
      this.photoArray = this.iAboutUsModel.specialFiles.slice(0, 6); 
      this.isLoadMore =!this.isLoadMore;
    }
  }
  priceArr: any[]=[];
  lineChartMethod() {
    // console.log(this.lineCanvas.nativeElement, 'this.lineCanvas.nativeElement')
    // console.log(this.priceAwardData, 'priceAwardData')
    // console.log(this.priceArr, 'priceArr')
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
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  isShowStateCity: boolean = false;
  getProfileDetails() {
    const id = this.loggedEncryptId;
    const ContactModelFromLocal = JSON.parse(localStorage.getItem('iContactViewModel'));
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        this.isShowStateCity = this.iContactViewModel.address.showOnlyStateCity;
        localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
        localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
        this.getAboutUsDetails();
        this.getCertificateList();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
    // if (ContactModelFromLocal !== null) {
    //   this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    //   this.getAboutUsDetails();
    //   this.getCertificateList();
    // } else {
    //   this._profileService.getProfileDetails(id, this.loggedId).subscribe(
    //     result => {
    //       this.iContactViewModel = result;
    //       this.isShowStateCity = this.iContactViewModel.address.showOnlyStateCity;
    //       console.log(this.isShowStateCity, 'isShowStateCity')
    //       localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
    //       localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
    //       this.getAboutUsDetails();
    //       this.getCertificateList();
    //     },
    //     error => {
    //       this._rfqService.handleError(error);
    //     },
    //     () => {}
    //   );
    // }
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
    if (this.iContactViewModel.companyId !== null && this.iContactViewModel.companyId !== 0) {
      // tslint:disable-next-line:max-line-length
      this._SupplierService.getAboutUsDetails(this.iContactViewModel.companyId, this.iContactViewModel.contactId, true, this.loggedId).subscribe(
        (data: IAboutUsViewModel) => {
          this.iAboutUsModel = data['data'];
          console.log( this.iAboutUsModel, ' this.iAboutUsModel')
          localStorage.setItem('iContactViewModel', JSON.stringify(this.iAboutUsModel));
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
          } else {
            this.iAboutUsModel.specialFiles = [];
          }
          if (this.iAboutUsModel.specialFiles.length > 0 && this.iAboutUsModel.specialFiles !== null ) {
            this.photoArray = this.iAboutUsModel.specialFiles.slice(0, 6) 
            // this.iAboutUsModel.specialFiles.forEach(element => {
            //   this.photoArray.push(element);
            // })
          } else {
            this.photoArray = [];
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }
  }
  setProperDate(d: Date) {
    if (d !== null) {
      const abc = new Date(d);
      return new Date(Date.UTC(abc.getFullYear(),
        abc.getMonth(), abc.getDate()));
    }
  }
  getCertificateList() {
    if (this.iContactViewModel.companyId !== null && this.iContactViewModel.companyId !==
      undefined && this.iContactViewModel.companyId !== 0) {
      this._masterService.getCertificate(this.iContactViewModel.companyId).subscribe(
        (data) => {
          if (data['result'] === true) {
            this.certificateViewModelList = data['data'];
            if (this.certificateViewModelList.length !== 0) {
              this.certificateViewModelList.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
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
    } else {
      this.certificateViewModelList = [];
    }

  }
  isSidePanelOpen() {
    const isOpen = this._SupplierService.get('buyerProfileSidePanel');
    if (isOpen !== null && isOpen !== undefined) {
      return this._SupplierService.get('buyerProfileSidePanel');
    } else {
      return false;
    }
  }
  reloadPageOndrawerClose() {
    //  this.lineChartMethod();
    if (this._SupplierService.get('companyPhotosClosedFromInside')) {
      this._SupplierService.set(false, 'companyPhotosClosedFromInside');
       this.getAboutUsDetails();
       this.GetPriceAwardPattern(90);
    }
    if (this._SupplierService.get('aboutUsDrawerDataSaved')) {
      this._SupplierService.set(false, 'aboutUsDrawerDataSaved');
      this.getAboutUsDetails();
      this.getCertificateList();
      this.GetPriceAwardPattern(90);
    }
    if (this._SupplierService.get('editProfileDrawerDataSaved')) {
      this._SupplierService.set(false, 'editProfileDrawerDataSaved');
          const id = this.loggedEncryptId;
        this._profileService.getProfileDetails(id, this.loggedId).subscribe(
        result => {
          this.iContactViewModel = result;
          this.isShowStateCity = this.iContactViewModel.address.showOnlyStateCity;
          localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
      this.GetPriceAwardPattern(90);
    }
    if (this._SupplierService.get('editProfileDrawerDataSaved')) {
      ('I AM IN BUYER ABOUT US PAGE')
      // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
      // this.loadAddress();
     // this.GetProfileDetailsOriginal();
    }
    // if (this._SupplierService.get('editProfileDrawerDataSaved')) {
    //   this._SupplierService.set(false, 'editProfileDrawerDataSaved');
    //       const id = this.loggedEncryptId;
    //       this._profileService.getProfileDetails(id, this.loggedId).subscribe(
    //     result => {
    //       this.iContactViewModel = result;
    //       localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
    //     },
    //     error => {
    //       this._rfqService.handleError(error);
    //     },
    //     () => {}
    //   );
    //   this.GetPriceAwardPattern(90);
    // }
    if (this._SupplierService.get('editProfileDrawerDataSaved')) {
      ('I AM IN BUYER ABOUT US PAGE')
      // this._SupplierService.set(true, 'editProfileDrawerDataSaved');
      // this.loadAddress();
     // this.GetProfileDetailsOriginal();
    }
  }

  // GetProfileDetailsOriginal() {
  //   const id = this.loggedEncryptId;
  //   this.userCreatedDateString = '';
  //   this._profileService.getProfileDetails(id, this.loggedId).subscribe(
  //     result => {
  //       this.iContactViewModel = result;
  //       localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
  //       if (!!this.iContactViewModel.createdOn && (this.iContactViewModel.createdOn !== '')) {
  //         const tempDate = new Date(this.iContactViewModel.createdOn);
  //         this.userCreatedDateString += 'Member Since ' + this.monthColl[tempDate.getMonth() - 1] + ' ' + tempDate.getFullYear();
  //       }
  //       this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
  //       this.iProfileViewModel.emailId = this.iContactViewModel.emailId;
  //       if (this.iProfileViewModel.emailId === '' || this.iProfileViewModel.emailId === null) {
  //         this.iProfileViewModel.emailId = this.loggedEmailId;
  //       }
  //       this.iProfileViewModel.firstName = this.iContactViewModel.firstName;
  //       this.iProfileViewModel.lastName = this.iContactViewModel.lastName;
  //       this.iProfileViewModel.languageId = this.iContactViewModel.languageId;
  //       this.findLanguage = this.iContactViewModel.language;
  //       this.iProfileViewModel.phoneNo = this.iContactViewModel.phoneNo;
  //       this.iProfileViewModel.title = this.iContactViewModel.title;
  //       this.iProfileViewModel.showDeltailedRating = this.iContactViewModel.showDeltailedRating;
  //       this.iProfileViewModel.showRfqAwardStat = this.iContactViewModel.showRfqAwardStat;
  //       this.iProfileViewModel.industryId = this.iContactViewModel.industryId;
  //       this.iProfileViewModel.industry = this.iContactViewModel.industry;
  //       this.iProfileViewModel.facebook = this.iContactViewModel.facebook;
  //       this.iProfileViewModel.linkedIn = this.iContactViewModel.linkedIn;
  //       this.iProfileViewModel.tweeter = this.iContactViewModel.tweeter;
  //       if (this.iContactViewModel.companyId == null) {
  //         this.iProfileViewModel.companyId = 0;
  //       } else {
  //         this.iProfileViewModel.companyId = this.iContactViewModel.companyId;
  //       }
  //       this.iProfileViewModel.contactId = this.iContactViewModel.contactId;
  //       if (this.iContactViewModel.company != null) {
  //         this.iProfileViewModel.name = this.iContactViewModel.company.name;
  //         this.iProfileViewModel.dunsNumber = this.iContactViewModel.company.dunsNumber;
  //         this.iProfileViewModel.employeeCountRangeId = (
  //           (this.iContactViewModel.company.employeeCountRangeId === 0) ? 0 : this.iContactViewModel.company.employeeCountRangeId
  //         );
  //         this.industryId = this.iProfileViewModel.employeeCountRangeId;
  //         this.countRange = this.iContactViewModel.company.employeeCountRange;
  //         this.iProfileViewModel.description = this.iContactViewModel.company.description;
  //       }
  //       this._SupplierService.set(this.iProfileViewModel, 'profileData');
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     },
  //     () => {}
  //   );
  // }

  // loadAddress() {
  //   const id = this.loggedId;
  //   this._profileService.getAddress(id).subscribe(
  //     (data: IContactViewModel) => {
  //       this.iContactViewModel2 = data;
  //       localStorage.setItem('addressModel', JSON.stringify(this.iContactViewModel2));
  //       this.shippingAddressData = this.iContactViewModel2.address.companyShippingSiteViewModelList;
  //       this.mailingAddressData = this.iContactViewModel2.address;
  //       this.GetProfileDetails();
  //       if (this.mailingAddressData.addressId === 0 || this.mailingAddressData.state === 'Unknown - Do not delete') {
  //         this.isMailingAvaible = false;
  //         // this._toastr.error('You have added 5 shipping address', 'Error!');
  //       } else {
  //         this.isMailingAvaible = true;
  //       }
  //       if (this.shippingAddressData.length === 0) {
  //         this.isShiipingAvailable = false;
  //       }
  //       if (this.shippingAddressData.length >= 5) {
  //         //  this.isShiiping5 = true;
  //         this.isShiipingAvailable = true;
  //         // this._toastr.error('You have added 5 shipping address', 'Error!');
  //       } else {
  //         //  this.isShiiping5 = false;
  //       }
  //       // this.shippingForm.reset();
  //       // this.mailingForm.reset();
  //     },
  //     error => () => {
  //       this._rfqService.handleError(error);
  //     }
  //   );
  // }
  openSidePanel(page) {
    this.isLoadMore = true;
    this.isReadMore = true;
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(this.iContactViewModel.companyId, 'companyId');
    this._SupplierService.set(true, 'buyerProfileSidePanel');
    this._SupplierService.set(true, 'isEditBuyerAboutUs');
    // this._SupplierService.set(false, 'capabilitiesEdit');
    // this._SupplierService.set(false, 'contactUsEdit');
    // this._SupplierService.set(false, 'ratingReply');
    this.getRFQCountGeographicLocation(90);
    this.GetPriceAwardPattern(90);
    if (this.prevPage === 'companyPhotos') {
      this._SupplierService.set(true, 'companyPhotosClosedFromInside');
      this.prevPage = '';
    }
    if (page === 'companyDescription') {
      this._SupplierService.set(this.iContactViewModel.companyId, 'companyId');
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(true, 'companyDescription');
      this._SupplierService.set(true, 'companyPhotos');
      this._SupplierService.set(false, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
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
    }
    if (page === 'companyDemographics') {
      this._SupplierService.set(this.iContactViewModel.companyId, 'companyId');
      this._SupplierService.set(false, 'companyPhotosClosedFromInside');
      this.prevPage = 'companyPhotos';
      this._SupplierService.set(false, 'companyEquipment');
      this._SupplierService.set(false, 'companyDescription');
      this._SupplierService.set(false, 'companyPhotos');
      this._SupplierService.set(true, 'companyDemographics');
      this._SupplierService.set(false, 'companyCertifications');
      this._SupplierService.set(false, 'companyCatagories');
      this._SupplierService.set(false, 'companyFocus');
      this._SupplierService.set(false, 'companyGetInTouch');
      this._SupplierService.set(false, 'companyPhotos');
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
    }
    if (page === 'isProfileEditActive') {
      this._SupplierService.set(true, 'isProfileEditActive');
      this._SupplierService.set(false, 'isEditMailing');
      this._SupplierService.set(false, 'isEditShipping');
      this._SupplierService.set(this.iContactViewModel, 'profileData');
    }
  }

  openDemographicsDetail(demographicsId) {
    this._SupplierService.set(demographicsId, 'demographicsId');
  }

  removeCertificate(tempCertificate) {
    this._SupplierService.RemoveCertificatesforCompany(this.iContactViewModel.companyId, tempCertificate.certificateId).subscribe(
      result => {
        if (result.result) {
          this.getCertificateList();
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
  setStatusFilter(btnState: string) {
    // this.activeStatusFilterBtn = btnState;
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

  getRFQCountGeographicLocation(btnState: number) {
    this.isLoader = true;
    this.activeStatusFilterBtn = btnState;
    this.pieChartLabels = [];
    this.pieChartData = [{
      data: [],
    }];
    if (this.loggedCompanyId !== null && this.loggedCompanyId !== 0  && this.loggedCompanyId !== NaN) {
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
    this.activePriceStatusFilterBtn = btnState;
    this.iViewProfileGetPriceAwardPatterView.companyId = this.loggedCompanyId;
    this.iViewProfileGetPriceAwardPatterView.days = btnState;
   if (this.loggedCompanyId !== null && this.loggedCompanyId !== 0 && this.loggedCompanyId !== NaN) {
    this._profileService.GetPriceAwardPattern(this.iViewProfileGetPriceAwardPatterView).subscribe( res => {
          //  console.log('pricegrap', res);
           this.priceAwardData = res;
          if (res.result === true) {
            this.dataSource.data = [];
            for (let i = 0; res.data.length > i; i++) {
              // console.log(res.data[i].price, 'res.data[i].price.toString()')
              this.priceArr.push(res.data[i].price)        
              this.lineChartMethod();
              // setTimeout(() => {
              //   this.lineChartMethod();
              // }, 1500);
              const obj = {
                value : res.data[i].price.toString(),
                showLabel: '0',
                showValue: '0',
                anchorHoverDip: '0',
                toolText: ''
              };
              this.dataSource.data[i] = obj;
              // this.dataSource.chart.yAxisMinValue = res.minPrice;
              // this.dataSource.chart.yAxisMaxValue = res.maxPrice;
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
// MAP CODE FROM CONTACT US
getProfileDetailsOriginal() {
  const id = this.loggedEncryptId;
  this._profileService.getProfileDetails(id, this.loggedId).subscribe(
    result => {
      this.iContactViewModel = result;
      localStorage.setItem('iContactViewModel', JSON.stringify(this.iContactViewModel));
      localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
      this.completeAddress = this.iContactViewModel.address.streetAddress + ',' +
        this.iContactViewModel.address.deptAddress + ',' +
        this.iContactViewModel.address.city + ',' +
        this.iContactViewModel.address.state;
    },
    error => {
      this._rfqService.handleError(error);
    },
    () => {}
  );
}

getProfileDetailsFromContactUS() {
  const id = this.loggedEncryptId;
    this._profileService.getProfileDetails(id, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        //this._SupplierService.set(this.iContactViewModel, 'profileData');
        localStorage.setItem('profileData', JSON.stringify(this.iContactViewModel));
        this.completeAddress = this.iContactViewModel.address.streetAddress + ',' +
          this.iContactViewModel.address.deptAddress + ',' +
          this.iContactViewModel.address.city + ',' +
          this.iContactViewModel.address.state;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {}
    );
}
mapSource:string = null;
getAddressFormat(mailingAddressData) {
  if(mailingAddressData != null && mailingAddressData != undefined){
  let tempAdd: string;
  tempAdd = '';
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
  this.mapSource = this.getAddressFormatForMap(mailingAddressData);
  if (this.checkEmpty(tempAdd)) {
    return tempAdd;
  } else {
    return 'N/A';
  }
}
}

getAddressFormatForMap(mailingAddressData)
{
  let tempAdd: string;
  tempAdd = '';
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
