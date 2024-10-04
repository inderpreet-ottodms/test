import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ConfirmationService
} from 'primeng/api';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
import {
  ICustomProcessViewModel,
  BuyerChildProcessViewModel
} from '../../../../../core/models/rfqModel';
import {
  ICountryViewModel,
  ICertificationViewModel
} from '../../../../../core/models/globalMaster';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  IManufacturerContactsViewModel,IManufacturerContactListViewModel, LikeUnlikeManufacturerRequestModel,
} from '../../../../../core/models/supplierModel';
import {
  SupplierTypeViewModel
} from '../../../../../core/models/globalMaster';
import {
  IAboutUsViewModel
} from '../../../../../core/models/supplierProfileModel';
import {
  ProfileService
} from '../../../../../core/services/profile/profile.service';
import {
  IContactViewModel
} from '../../../../../core/models/accountModel';
import {
  IFollowContactViewModel
} from '../../../../../core/models/settingsModel';
import { BuyerService } from '../../../../../core/services/buyer/buyer.service';
import { appConstants } from '../../../../../core/config/constant';

@Component({
  selector: 'app-buyer-contact-list',
  templateUrl: './buyer-contact-list.component.html',
  styleUrls: ['./buyer-contact-list.component.scss'],
  providers: [ConfirmationService]
})
export class BuyerContactListComponent implements OnInit, OnDestroy {

  // Model Instance
  iSupplierDetails: IManufacturerContactsViewModel[];
  iSupplierDetailsTemp: IManufacturerContactsViewModel[];
  iSupplierDetailsTemp1: IManufacturerContactsViewModel[];
  iFilteredSupplierDetailsColl: IManufacturerContactsViewModel[];
  iFilteredbyCountrySuppliers: IManufacturerContactsViewModel[];
  items: IManufacturerContactsViewModel[];
  filteredItems: IManufacturerContactsViewModel[];
  iCountryModel: ICountryViewModel[];
  iCertificateList: ICertificationViewModel[];
  iCustomProcessViewModelColl: ICustomProcessViewModel[];
  childProcessSettings: any;
  selectedcountry: string[];
  selectedCertificate: string[];
  selectedProcesses: any;
  selectedChildProcessItems: any;
  iCustomChildProcessViewModelColl: any = [];
  msgs: string;
  isBuyer: boolean;
  isBlacklisted: boolean;
  iFollowContactViewModel: IFollowContactViewModel;
  isLikedManufacturers: boolean;
  iManufacturerContactListViewModel: IManufacturerContactListViewModel;
  sortFilterValue: string;


  // Model Instance End

  // variable Declarations
  public rfqId: any;
  processsettings = {};
  certificatesettings = {};
  countrySettings = {};

  isTilesView: boolean;
  isGridView: boolean;
  toggleManufacturer: boolean;
  searchFilterValue: string;
  deletedCompanyIds: number[];

  isLoader: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  totalCount: number;
  activeStatusFilterBtn: string;

  /* pagination variables start */
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  pagesIndex: Array<number>;
  /* pagination variables end */
  iAboutUsModel: IAboutUsViewModel;
  SupplierTypeViewModel: SupplierTypeViewModel;
  iContactViewModel: IContactViewModel;
  // variable Declarations ends

  processIdList = [];
  likeUnlikeManufacturerRequestModel: LikeUnlikeManufacturerRequestModel;
  buyerEmail: string = '';
  constructor(private _SupplierService: SupplierService, private _rfqService: RfqService, private _toastr: ToastrService,
    private confirmationService: ConfirmationService, private router: Router,
    private mService: MasterService, private sService: SupplierService,
     private _profileService: ProfileService,private bService: BuyerService) {
      this.isLikedManufacturers = false;
    this.isTilesView = true;
    this.isGridView = false;
    this.isRfqAvailable = false;
    this.toggleManufacturer = false;
    this.searchFilterValue = '';
    this.activeStatusFilterBtn = 'LikedManuf';
    this.msgs = '';
    this.isBuyer = true;
    this.isBlacklisted = false;
    this.selectedcountry = [];
    this.selectedCertificate = [];
    this.selectedProcesses = [];
    this.deletedCompanyIds = [];
    this.iCountryModel = [];
    this.iCertificateList = [];
    this.iCustomProcessViewModelColl = [];
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
      _3dTourUrlList: [],
      communityCompanyProfileUrl:'',
      profileDetailUrl:''
    };
    this.SupplierTypeViewModel = {
      blockUsersiteSelection: false,
      industryId: 0,
      supplierTypeId: 0,
      supplierTypeName: '',
      supplierTypeNameEn: ''
    };
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      rfqId: 0,
      errorMessage: '',
      result: true,
      isFollow: null,
      bookType: ''
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
      companyId: 0,
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
    this.iManufacturerContactListViewModel = {
      contactId: 0,
      isbuyer: false,
      isBlacklisted: false,
      isLikedManufacturers: false,
      maxPageSize: 0,
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      filterBy:''
    };
  }

  ngOnInit() {
this.buyerEmail = localStorage.getItem('User2');
    this.childProcessSettings = {
      singleSelection: false,
      text: 'Select Process Technique',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      labelKey: 'childDisciplineName',
      primaryKey: 'childDisciplineId',
      noDataLabel: 'No Data Available',
      selectGroup: true,
      badgeShowLimit: 5,
      maxHeight: 150,
      showCheckbox: true,
      classes: 'myBoldClass',
      disabled: true
    };
    this.getProcess();
    this.getCountryList();
    this.getCertificateList();
    this.setStatusFilter('LikedManuf');
  }

  get loggedCompanyId() {
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  getManufacturerContactsList() {
    this.isLoader = true;
    //this.iManufacturerContactListViewModel.searchText = this.messageSearchText;
    this.iManufacturerContactListViewModel.contactId = this.loggedId;
    this.iManufacturerContactListViewModel.isbuyer = this.isBuyer;
    this.iManufacturerContactListViewModel.isBlacklisted = this.isBlacklisted;
    this.iManufacturerContactListViewModel.isLikedManufacturers = this.isLikedManufacturers;

    this.sService.getManufacturerContactsList(this.iManufacturerContactListViewModel).subscribe(
      result => {
        if (result['result'] === true) {
          this.iSupplierDetails = result['data'];
          this.totalCount = result['totalRec'];          
          window.scrollTo(0, 0);
          if (this.iSupplierDetails.length !== 0) {
            this.totalRfq = this.iSupplierDetails.length;
            this.iSupplierDetailsTemp = this.iSupplierDetails;
            if (this.isBlacklisted === false) {
              this.iSupplierDetailsTemp1 = this.iSupplierDetails;
            }
            if (this.deletedCompanyIds.length !== 0) {
              let filterDeletedRecords: IManufacturerContactsViewModel[] = [];
              filterDeletedRecords = this.iSupplierDetailsTemp;
              for (let i = 0; i < this.deletedCompanyIds.length; i++) {
                filterDeletedRecords = filterDeletedRecords.filter(x => x.companyId !== (this.deletedCompanyIds[i]));
              }
              this.iFilteredSupplierDetailsColl = filterDeletedRecords;
            } else {
              this.iFilteredSupplierDetailsColl = this.iSupplierDetailsTemp;
            }
            this.filterDropdown();
          } else {
            this.totalRfq = this.iSupplierDetails.length;
            this.iSupplierDetailsTemp = null;
            this.isLoader = false;
            this.isRfqAvailable = true;
          }
        } else {
          this.totalRfq = 0;
          this.isLoader = false;
          this.iSupplierDetailsTemp = null;
          this.isRfqAvailable = true;
        }
      },
      error => {
        this.isLoader = false;
        this.handleError(error);
      },
      () => { }
    );
  }
  sortOnContactName() {
    if (this.toggleManufacturer) {
      this.iSupplierDetailsTemp.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else {
      this.iSupplierDetailsTemp.sort((a, b) => b.companyName.localeCompare(a.companyName));
    }
    this.toggleManufacturer = !this.toggleManufacturer;
  }
  getCountryList() {
    this.mService.getCountry().subscribe(
      result => {
        this.iCountryModel = result;
        this.countrySettings = {
          singleSelection: false,
          fixedTitle: true,
          text: 'All Countries',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Country',
          enableSearchFilter: true,
          labelKey: 'countryName',
          primaryKey: 'countryId',
          noDataLabel: 'No Data Available',
          selectGroup: false,
          badgeShowLimit: 1,
          maxHeight: 200,
          showCheckbox: true,
          classes: 'myBoldClass',
          enableCheckAll: false
        };
      }
    );
  }

  getCertificateList() {
    this.mService.getCertificate(null).subscribe(
      result => {
        this.iCertificateList = result['data'];
        this.certificatesettings = {
          singleSelection: false,
          text: 'All Certifications',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Certification',
          enableSearchFilter: true,
          groupBy: 'description',
          labelKey: 'certificateCode',
          primaryKey: 'certificateId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 1,
          maxHeight: 200,
          showCheckbox: true,
          classes: 'myBoldClass',
          enableCheckAll: false
        };
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }
  getProcess() {
    this._rfqService.getBuyerParentProcesses().subscribe(
      result => {
        this.iCustomProcessViewModelColl = result['data'].filter(x => x.parentDisciplineName !== 'Let MFG choose or select process');
        this.processsettings = {
          singleSelection: false,
          text: 'Manufacturing Process',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Fields',
          enableSearchFilter: true,
          labelKey: 'parentDisciplineName',
          primaryKey: 'parentDisciplineId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 1,
          maxHeight: 200,
          showCheckbox: true,
          classes: 'myBoldClass',
          enableCheckAll: true
        };
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }

  onParentProcessSelect(item) {
    this.processIdList.push(item.parentDisciplineId);
    this.getSupplierChildProcesses();
  }

  onParentProcessSelectAll(items) {
    items.forEach(element => {
      this.processIdList.push(element.parentDisciplineId);
    });
    this.getSupplierChildProcesses();
  }

  onParentProcessDeSelect(item) {
    let tempProcess = this.iCustomChildProcessViewModelColl.filter(x => x.parentDisciplineId === item.parentDisciplineId);
    if (tempProcess.length !== 0) {
      tempProcess.forEach(element => {
        let index = this.processIdList.indexOf(element.childDisciplineId);
        if (index !== -1) {
          this.processIdList.splice(index, 1);
        }
      });
    }
    const index: number = this.processIdList.indexOf(item.parentDisciplineId);
    if (index !== -1) {
      this.processIdList.splice(index, 1);
    }
    this.getSupplierChildProcesses();
  }

  onParentProcessDeSelectAll(items) {
    this.processIdList = [];
    this.getSupplierChildProcesses();
  }

  onChildProcessSelect(item) {
    let tempProcess = this.iCustomChildProcessViewModelColl.filter(x => x.isSelected === false);
    tempProcess.forEach(element => {
      let index = this.processIdList.indexOf(element.childDisciplineId);
      if (index !== -1) {
        this.processIdList.splice(index, 1);
      }
    });
    this.iCustomChildProcessViewModelColl.forEach(element => {
      if (element.childDisciplineId == item.childDisciplineId) {
        element.isSelected = true;
      }
    });
    this.processIdList.push(item.childDisciplineId);
    this.filterAll();
  }

  onChildProcessSelectAll(items) {
    let tempProcess = this.iCustomChildProcessViewModelColl.filter(x => x.isSelected === true);
    tempProcess.forEach(element => {
      let index = this.processIdList.indexOf(element.childDisciplineId);
      if (index !== -1) {
        this.processIdList.splice(index, 1);
      }
    });
    this.iCustomChildProcessViewModelColl.forEach(element => {
      element.isSelected = true;
    });
    items.forEach(element => {
      this.processIdList.push(element.childDisciplineId);
    });
    this.filterAll();
  }

  onChildProcessDeSelect(item) {
    this.iCustomChildProcessViewModelColl.forEach(element => {
      if (element.childDisciplineId == item.childDisciplineId) {
        element.isSelected = false;
      }
    });
    const index: number = this.processIdList.indexOf(item.childDisciplineId);
    if (index !== -1) {
      this.processIdList.splice(index, 1);
    }
    let tempProcess = this.iCustomChildProcessViewModelColl.filter(x => x.isSelected === true);
    if (tempProcess.length === 0) {
      this.iCustomChildProcessViewModelColl.forEach(element => {
        this.processIdList.push(element.childDisciplineId);
        element.isSelected = false;
      });
    }
    this.filterAll();
  }

  onChildProcessDeSelectAll(items) {
    this.processIdList = [];
    this.selectedProcesses.forEach(element => {
      this.processIdList.push(element.parentDisciplineId);
    });
    this.iCustomChildProcessViewModelColl.forEach(element => {
      this.processIdList.push(element.childDisciplineId);
      element.isSelected = false;
    });
    this.filterAll();
  }

  getSupplierChildProcesses() {
    let supplierChildProcessViewModel = new BuyerChildProcessViewModel();
    if (this.processIdList.length > 0) {
      supplierChildProcessViewModel.parentCategoryIdList = this.processIdList;
    } else {
      supplierChildProcessViewModel.parentCategoryIdList = [];
    }
    this._rfqService.getBuyerChildProcesses(supplierChildProcessViewModel).subscribe(res => {
      if (res['result'] == true) {
        this.iCustomChildProcessViewModelColl = res['data'];
        this.childProcessSettings = {
          singleSelection: false,
          text: 'Select Process Technique',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Fields',
          enableSearchFilter: true,
          labelKey: 'childDisciplineName',
          primaryKey: 'childDisciplineId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 150,
          showCheckbox: true,
          classes: 'myBoldClass',
          disabled: false
        };
        this.iCustomChildProcessViewModelColl.forEach(element => {
          this.processIdList.push(element.childDisciplineId);
          element.isSelected = false;
        });
      } else {
        this.selectedChildProcessItems = [];
        this.iCustomChildProcessViewModelColl = [];
        this.childProcessSettings = {
          singleSelection: false,
          text: 'Select Process Technique',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          searchPlaceholderText: 'Search Fields',
          enableSearchFilter: true,
          labelKey: 'childDisciplineName',
          primaryKey: 'childDisciplineId',
          noDataLabel: 'No Data Available',
          selectGroup: true,
          badgeShowLimit: 5,
          maxHeight: 150,
          showCheckbox: true,
          classes: 'myBoldClass',
          disabled: true
        };
      }
      this.filterAll();
    }, error => {
      this.selectedChildProcessItems = [];
      this.iCustomChildProcessViewModelColl = [];
      this.childProcessSettings = {
        singleSelection: false,
        text: 'Select Process Technique',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Search Fields',
        enableSearchFilter: true,
        labelKey: 'childDisciplineName',
        primaryKey: 'childDisciplineId',
        noDataLabel: 'No Data Available',
        selectGroup: true,
        badgeShowLimit: 5,
        maxHeight: 150,
        showCheckbox: true,
        classes: 'myBoldClass',
        disabled: true
      };
      this.filterAll();
    })
  }

  setStatusFilter(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.selectedcountry = [];
    this.selectedCertificate = [];
    this.selectedProcesses = [];
    this.filterAll();
  }

  filterAll() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this.isLoader = true;
    this.iFilteredSupplierDetailsColl = [];
    this.isLoader = true;
    
    if (this.activeStatusFilterBtn === 'All') {
      this.isBlacklisted = false;
      this.isLikedManufacturers = false;
      this.getManufacturerContactsList();
    } else if (this.activeStatusFilterBtn === 'Blacklisted') {
      this.isBlacklisted = true;
      this.isLikedManufacturers = false;
      this.getManufacturerContactsList();
    } else if (this.activeStatusFilterBtn === 'LikedManuf') {
      this.isBlacklisted = false;
      this.isLikedManufacturers = true;
      this.getManufacturerContactsList();
    } else if (this.activeStatusFilterBtn === 'Archived') {
      let filteredRecords: IManufacturerContactsViewModel[] = [];
      let filterDeletedRecords: IManufacturerContactsViewModel[] = [];
      for (let i = 0; i < this.deletedCompanyIds.length; i++) {
        filterDeletedRecords = this.iSupplierDetailsTemp1.filter(x => x.companyId === (this.deletedCompanyIds[i]));
        filteredRecords = filteredRecords.concat(filterDeletedRecords);
      }
      this.iFilteredSupplierDetailsColl = filteredRecords;
      this.filterDropdown();
      if (this.iFilteredSupplierDetailsColl.length === 0) {
        this.isLoader = false;
        this.isRfqAvailable = true;
      } else {
        this.isLoader = false;
        this.isRfqAvailable = false;
      }
      this.init();
    }
  }
  filterDropdown() {
    if (this.selectedcountry.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
      let filteredRecords: IManufacturerContactsViewModel[] = [];
      for (let i = 0; i < this.selectedcountry.length; i++) {
        this.iFilteredbyCountrySuppliers = this.iFilteredSupplierDetailsColl.filter
          (x => x.address.countryId == (this.selectedcountry[i]['countryId']));
        filteredRecords = filteredRecords.concat(this.iFilteredbyCountrySuppliers);
      }
      this.iFilteredSupplierDetailsColl = filteredRecords;
    }
    if (this.processIdList.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
      const filteredRecords: IManufacturerContactsViewModel[] = [];
      this.iFilteredSupplierDetailsColl.filter((x) => {
        let isMatched = false;
        for (let j = 0; j < x.processesIds.length; j++) {
          if (this.processIdList.includes(x.processesIds[j])) {
            isMatched = true;
          }
        }
        if (isMatched) {
          filteredRecords.push(x);
        }
      });
      this.iFilteredSupplierDetailsColl = filteredRecords;
    }

    if (this.searchFilterValue !== '' && this.iFilteredSupplierDetailsColl.length !== 0) {
      this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(
        x => x.companyName.toLowerCase().includes(this.searchFilterValue.toLowerCase()));
    }

    if (this.selectedCertificate.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
      const filteredRecords: IManufacturerContactsViewModel[] = [];
      this.iFilteredSupplierDetailsColl.filter((x) => {
        let isMatched = false;
        for (let j = 0; j < x.certificateIds.length; j++) {
          for (let i = 0; i < this.selectedCertificate.length; i++) {
            if (x.certificateIds[j] === (this.selectedCertificate[i]['certificateId'])) {
              isMatched = true;
            }
          }
        }
        if (isMatched) {
          filteredRecords.push(x);
        }
      });
      this.iFilteredSupplierDetailsColl = filteredRecords;
    }
    if (this.iFilteredSupplierDetailsColl.length === 0) {
      this.isLoader = false;
      this.isRfqAvailable = true;
    } else {
      this.isLoader = false;
      this.isRfqAvailable = false;
    }
    this.init();
  }

  // Pagination Function Starts
  init() {
    // this.currentIndex = 1;
    // this.pageStart = 1;
    // this.pages = 3;
    // this.pageNumber = parseInt('' + (this.iFilteredSupplierDetailsColl.length / this.pageSize));
    // if (this.iFilteredSupplierDetailsColl.length % this.pageSize !== 0) {
    //   this.pageNumber++;
    // }
    // if (this.pageNumber < this.pages) {
    //   this.pages = this.pageNumber;
    // }
    console.log(this.totalCount,'this.totalCount');
    console.log(this.pageSize,'this.pageSize');
    this.pageNumber = parseInt('' + (this.totalCount / this.pageSize));
    
    if (this.totalCount % this.pageSize !== 0) {
      this.pageNumber++;
    }
    console.log(this.pageNumber,'this.pageNumber');
    // if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    //}
    this.refreshItems();
  }

  fillArray(): any {
    const obj = new Array();
    this.pages = (this.pages > 3) ? 3 : this.pages;
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  ChangeinputLength() {
    if (this.searchFilterValue) {
      this.iManufacturerContactListViewModel.searchText = this.searchFilterValue;
    } else {
      this.iManufacturerContactListViewModel.searchText = '';
    }
    if (this.sortFilterValue === '2') {
      this.iManufacturerContactListViewModel.isOrderByDesc = false;
    } else {
      this.iManufacturerContactListViewModel.isOrderByDesc = true;
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.iManufacturerContactListViewModel.pageNumber = 1;
    this.iManufacturerContactListViewModel.pageSize = this.pageSize;
    this.getManufacturerContactsList();

    // this.pageSize = this.inputLength;
    // this.init();
  }
  refreshItems() {
    this.filteredItems = this.iFilteredSupplierDetailsColl;
    //this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    this.items = this.filteredItems;
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
    this.iManufacturerContactListViewModel.pageNumber = this.currentIndex;
    this.getManufacturerContactsList();
    //this.refreshItems();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iManufacturerContactListViewModel.pageNumber = this.currentIndex;
    this.getManufacturerContactsList();
    //this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;     
    this.iManufacturerContactListViewModel.pageNumber = this.currentIndex;
    this.getManufacturerContactsList();
    //this.refreshItems();
  }
  // Pagination Function ends
  // API Call Function

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

  // API Call Function End

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  /*  Third parameter is for scroll purpose when drawer open   */
  openMenufacturerDrawer(contactId, contactName, followcontactId, companyName) {
    this._rfqService.set(false, 'messageRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(companyName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 1000);
    setTimeout(() => {
      const elmnt = document.getElementById(followcontactId);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 2000);
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName, encryptId) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
      event.stopPropagation();
      this._rfqService.set(false, 'messageRfq');
      setTimeout(() => {
        this._rfqService.set(true, 'showSidePanel');
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(false, 'supplierProfileDrawer');
        this._rfqService.set(contactId, 'selectContactIdsForMEessage');
        this._rfqService.set(messageRFQId, 'selectContactRFQId');
        this._rfqService.set(fromContName, 'nameOfBuyer');
        this._rfqService.set(encryptId, 'quoteContactId');
      }, 100);
      setTimeout(() => {
        const elmnt = document.getElementById(contactId);
        elmnt.scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'nearest'
        });
      }, 1000);
    }
  }
  isReadyToAward(objAwardDate: Date) {
    const tempCurrDate = (new Date()).toISOString();
    const tempAwardDate = (new Date(objAwardDate)).toISOString();
    return tempAwardDate < tempCurrDate;
  }
  openGridView() {
    this.isTilesView = false;
    this.isGridView = true;
  }
  openTilesView() {
    this.isTilesView = true;
    this.isGridView = false;
  }
  editRfq(id, Name) {
    localStorage.setItem('EditRfqId', id);
    localStorage.setItem('EditRfqName', Name);
    this._rfqService.set(id, 'editRfqId');
    this._rfqService.set(Name, 'editRfqName');
    this.router.navigate(['/rfq/editrfq']);
  }
 
  removeContact(companyId) {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to remove this contact from your list?',
      header: 'Remove Contact',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        // this.deletedCompanyIds.push(companyId);
        // this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(x => x.companyId !== (companyId));
        // if (this.iFilteredSupplierDetailsColl.length === 0) {
        //   this.isLoader = false;
        //   this.isRfqAvailable = true;
        // } else {
        //   this.isLoader = false;
        //   this.isRfqAvailable = false;
        // }
        // this.init();
        this.iFollowContactViewModel.contactId = this.loggedId;
        this.iFollowContactViewModel.companyIdList[0] = companyId;
        this.iFollowContactViewModel.bookType = appConstants.blacklistedBookType;
        this.iFollowContactViewModel.isFollow = false;
        this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
        result => {
          if (result) {
            this._toastr.success(result.errorMessage, '');
            this.filterAll();
            console.log(result.errorMessage);
          }
        },
      error => {
        this._rfqService.handleError(error);
      }
    );
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }
  removeArchivedContact(companyId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this contact from Archived list?',
      header: 'Remove Contact',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        const index = this.deletedCompanyIds.indexOf(companyId);
        if (index > -1) {
          this.deletedCompanyIds.splice(index, 1);
        }
        this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(x => x.companyId !== (companyId));
        if (this.iFilteredSupplierDetailsColl.length === 0) {
          this.isLoader = false;
          this.isRfqAvailable = true;
        } else {
          this.isLoader = false;
          this.isRfqAvailable = false;
        }
        this.init();
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });

  }

  ngOnDestroy() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'supplierProfileDrawer');
  }
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = '';
    }
    this.filterAll();
  }

  onSearch() {
    if (this.searchFilterValue) {
      this.filterAll();
    }
  }

  getAboutUrl(companyId, loggedId) {
    this.sService.getAboutUsDetails(companyId, this.iContactViewModel.contactId, this.isBuyer, this.loggedId).subscribe(
      result => {
        this.iAboutUsModel = result['data'];
        if (result['result']) {
          // window.open('#/Public/profile/' + this.iAboutUsModel.companyURL, '_blank');
          const url = this.router.serializeUrl(
            this.router.createUrlTree(['/source'], { queryParams: {page: this.iAboutUsModel.profileDetailUrl}})
          );
       
          window.open("#"+ url, '_blank');

          //window.open( this.iAboutUsModel.communityCompanyProfileUrl, '_blank');

        }
      }
    );
  }
  readMore(e, companyId, loggedId, encContId) {
    e.stopPropagation();
    this._profileService.getProfileDetails(encContId, this.loggedId).subscribe(
      result => {
        this.iContactViewModel = result;
        localStorage.setItem('ViewSupplierProfileId', this.iContactViewModel.contactId.toString());
        localStorage.setItem('ViewSupplierProfileName', this.iContactViewModel.firstName + ' ' + this.iContactViewModel.lastName);
        this.getAboutUrl(companyId, loggedId);
      },
      error => {
        this.handleError(error);
      },
      () => { }
    );
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.filterAll();
    }
  }

  handleError(error) {
    if (error.status === 0) {
      this._toastr.error('Please check internet connection', 'Error!');
    } else if (error.status === 400) {
      this._toastr.error(JSON.stringify(error.error), 'Error!');
    }
  }
  checkSearch(val) {
    if (!val) {
      this.filterAll();
    }
  }
  checkIfFollowUnFollowChange() {
    if (this._rfqService.get('followUnFollowChange')) {
      this._rfqService.set(false, 'followUnFollowChange');
      this.getManufacturerContactsList();
    }
  }

  currentRfq() {
    return this._rfqService.get('quoteContactId');
  }
  getAddressFormat(mailingAddressData) {
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
    if (this.checkEmpty(tempAdd)) {
      return tempAdd;
    } else {
      return 'N/A';
    }
  }
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      return true;
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

  unlikeContact(companyId,supplierEmail) {
    this.likeUnlikeManufacturerRequestModel = new LikeUnlikeManufacturerRequestModel();
    this.likeUnlikeManufacturerRequestModel = {
      buyerContactId: this.loggedId,
      supplierCompanyId: companyId,
      buyerEmail: this.buyerEmail,
      supplierEmail: supplierEmail,
      isLike: false,
      buyerIpAddress: ''
    }
    this.bService.likeunLikeCommunityManufacturer(this.likeUnlikeManufacturerRequestModel).subscribe(
      result => {
       this.isLikedManufacturers = true;
       this._toastr.success('You successfully unliked the supplier', 'success!');
       this.getManufacturerContactsList();
      }, error => {
      console.log(error, 'error');
    });
  }
}
