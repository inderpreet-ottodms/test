import {
  Component,
  OnInit,
  Input
} from '@angular/core';
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
  DistributionViewModel,
  DistributionPostModel
} from '../../../../../core/models/rfqModel';
import {
  IFollowContactViewModel
} from '../../../../../core/models/settingsModel';
import {
  SupplierService
} from '../../../../../core/services/supplier/supplier.service';
import {
  IAboutUsViewModel
} from '../../../../../core/models/supplierProfileModel';
import {
  IContactViewModel
} from '../../../../../core/models/accountModel';
import {
  SupplierTypeViewModel
} from '../../../../../core/models/globalMaster';
import {
  truncateSync
} from 'fs';
import { Router } from '@angular/router';
import { appConstants } from '../../../../../core/config/constant';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.scss'],
  providers: [ConfirmationService]
})
export class DistributionComponent implements OnInit {
  @Input('rfqId') rfqId: number;
  currentRate = 3.5;
  isLoader: boolean;
  DistributionViewModelColl: DistributionViewModel[];
  DistributionPostModel: DistributionPostModel;
  isRfqAvailable: boolean;
  items: DistributionViewModel[];
  iSupplierDetails: DistributionViewModel[];
  iSupplierDetailsTemp: DistributionViewModel[];
  iFollowContactViewModel: IFollowContactViewModel;
  iAboutUsModel: IAboutUsViewModel;
  iContactViewModel: IContactViewModel;
  SupplierTypeViewModel: SupplierTypeViewModel;
  isBuyer: boolean;
  selectedBox: number;
  /* pagination variables start */
  pages = 4;
  pageSize = 20;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 50;
  totalRow: number;
  pagesIndex: Array < number > ;
  CurrentRfqId: number;
  chkBoxCountArr: any[] = [];
  selectedRowCount: number;
  selectedAll: boolean;
  isManufacturer: boolean;
  isManufacturingLocation: boolean;
  isStatus: boolean;
  searchFilterValue: string;
  stateFilterValue: string;
  showBlock: number = null;
  /* pagination variables end */
  constructor(private router: Router,private _rfqService: RfqService, private _SupplierService: SupplierService, private _toastr: ToastrService, private confirmationService: ConfirmationService) {
    this.isLoader = true;
    this.isManufacturer = false;
    this.isManufacturingLocation = false;
    this.isStatus = false;
    this.isRfqAvailable = true;
    this.isBuyer = true;
    this.items = [];
    this.iSupplierDetails = [];
    this.iSupplierDetailsTemp = [];
    this.searchFilterValue = '';
    this.stateFilterValue = '';
    this.initModel();
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      rfqId: 0,
      result: true,
      isFollow: null,
      bookType: ''
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
  }
  initModel() {
    this.DistributionPostModel = {
      isOrderByDesc: false,
      more_records: false,
      orderBy: '',
      pageNumber: 1,
      pageSize: 20,
      rfqId: 0,
      searchText: '',
      totalRecords: 0,
      filterBy: ''
    };
  }

  ngOnInit() {
    this.selectedBox = 0;
    this.isRfqAvailable = false;
    this.getManufactureList();
  }

  setStatus(stateFilterValue) {
    // debugger;
    this.DistributionPostModel.filterBy = stateFilterValue;
    this.isLoader = true;
    this.filterAll();
  }
  sortByType(tab) {
    switch (tab) {
      case 'isManufacturer': {
        this.isManufacturer = !this.isManufacturer;
        this.DistributionPostModel.orderBy = 'manufacturer';
        this.DistributionPostModel.isOrderByDesc = this.isManufacturer;
        this.getManufactureList();
        break;
      }
      case 'isManufacturingLocation': {
        this.DistributionPostModel.orderBy = 'territory';
        this.isManufacturingLocation = !this.isManufacturingLocation;
        this.DistributionPostModel.isOrderByDesc = this.isManufacturingLocation;
        this.getManufactureList();
        break;
      }
      case 'isStatus': {
        this.DistributionPostModel.orderBy = 'status';
        this.isStatus = !this.isStatus;
        this.DistributionPostModel.isOrderByDesc = this.isStatus;
        this.getManufactureList();
        break;
      }
    }
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName, companyId) {
    event.stopPropagation();
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'messageRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'messageRfq');
      this._rfqService.set(fromContName, 'nameOfBuyer');
      this._rfqService.set(contactId, 'selectContactIdsForMEessage');
      this._rfqService.set(messageRFQId, 'selectContactRFQId');
      this._rfqService.set(companyId, 'selectedCompanyId');
    }, 300);
  }

  openMessageDrawermultiple(contactId) {
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(true, 'messageFromNda');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'messageFromMessage');
    if (this.selectedRowCount > 1) {
      if (!(contactId === '' || contactId === undefined)) {
        this.chkBoxCountArr.push(contactId);
      }
      setTimeout(() => {
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(true, 'messageFromNda');
        this._rfqService.set(this.rfqId, 'selectContactRFQId');
        this._rfqService.set(this.chkBoxCountArr, 'selectContactIdsForMEessage');
      }, 300);
    } else if (this.selectedRowCount == 1 && this.chkBoxCountArr.length == 1) {
      setTimeout(() => {
        this._rfqService.set(true, 'messageRfq');
        this._rfqService.set(true, 'messageFromNda');
        this._rfqService.set(this.chkBoxCountArr[0].companyName, 'nameOfBuyer');
        this._rfqService.set(this.chkBoxCountArr[0].contactId, 'selectContactIdsForMEessage');
        this._rfqService.set(this.rfqId, 'selectContactRFQId');
        this._rfqService.set(this.chkBoxCountArr[0].companyId, 'selectedCompanyId');
      }, 300);
    } else{
      this._rfqService.set(false, 'messageRfq');
      this._rfqService.set(false, 'showSidePanel');
    }
  }

  openSidePanel(contactId, contactName, companyName) {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(0, 'quoteContactId');
    this._rfqService.set(0, 'quoteContactName');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'messageRfq');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(contactName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 300);
  }
  get loggedContactId() {
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }
  removeContact(contactId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove the manufacturer from the RFQ distribution list? They will be blacklisted',

      header: 'Remove manufacturer',
      icon: null,
      accept: () => {
        this.remove(contactId);
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
  }
  remove(id) {
    this.iFollowContactViewModel.contactId = this.loggedContactId;
    this.iFollowContactViewModel.companyIdList[0] = id;
    this.iFollowContactViewModel.bookType = appConstants.blacklistedBookType;
    this.iFollowContactViewModel.isFollow = true;
    this.iFollowContactViewModel.isFollow = true;
    this.iFollowContactViewModel.rfqId = this.rfqId;
    this._SupplierService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if (result) {
          this._toastr.success(result.errorMessage, '');
          this.getManufactureList();
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );

  }

  get currentRfqId() {
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  searchByKey(event) {
    if (event.keyCode === 13) {
      this.filterAll();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.filterAll();
    }
  }
  removeTextValue() {
    if (this.searchFilterValue) {
      this.searchFilterValue = '';
    }
    this.filterAll();
  }
  getManufactureList() {
    this.DistributionPostModel.rfqId = this.rfqId;
    this.DistributionPostModel.searchText = this.searchFilterValue;
    this.isLoader = true;
    this._rfqService.GetDistributionList(this.DistributionPostModel).subscribe(
      result => {
        if (result['result']) {
          this.iSupplierDetails = result['data'];
          this.totalRow = result['totalRecords'];
          if (this.iSupplierDetails.length !== 0) {
            this.iSupplierDetailsTemp = this.iSupplierDetails;
            this.isLoader = false;
            this.isRfqAvailable = false;
          } else {
            this.iSupplierDetailsTemp = [];
            this.isLoader = false;
            this.isRfqAvailable = true;
          }
          this.init();
          window.scrollTo(0, 0);
        } else {
          this.isLoader = false;
          this.isRfqAvailable = true;
          this.iSupplierDetails = [];
          this.totalRow = 0;
          window.scrollTo(0, 0);
        }

      },
      error => {
        this.isLoader = false;
        this.isRfqAvailable = true;
        this.iSupplierDetails = [];
        this.totalRow = 0;
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  toFirst() {
    this.selectedAll = false;
    this.selectAll();
    this.pageStart = 1;
    this.currentIndex = 1;
    this.DistributionPostModel.pageNumber = this.currentIndex;
    this.getManufactureList();
  }
  toLast() {
    this.selectedAll = false;
    this.selectAll();
    this.currentIndex = this.pageNumber;
    this.pageStart = this.currentIndex - this.pages + 1;
    this.DistributionPostModel.pageNumber = this.currentIndex;
    this.getManufactureList();
  }

  isDistributionMsg() {
    if (this._rfqService.get('isdistrubtion')) {
      this._rfqService.set(false, 'isdistrubtion');
      this.selectedAll = false;
      this.selectAll();
    }
  }
  // Previous button code
  prevPage() {
    this.selectedAll = false;
    this.selectAll();
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.DistributionPostModel.pageNumber = this.currentIndex;
    this.getManufactureList();
  }

  // Next Button Code
  nextPage() {
    this.selectedAll = false;
    this.selectAll();
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.DistributionPostModel.pageNumber = this.currentIndex;
    this.getManufactureList();
  }
  init() {
    this.pageNumber = parseInt('' + (this.totalRow / this.pageSize));
    if (this.totalRow % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.DistributionPostModel.pageNumber = this.currentIndex;
    this.selectedAll = false;
    this.selectAll();
    this.getManufactureList();
  }

  refreshItems() {
    this.items = this.iSupplierDetailsTemp.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    this.pagesIndex = this.fillArray();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  arrayColumn(array, columnName) {
    return array.map(function (value, index) {
      return value[columnName];
    });
  }
  filterAll() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this.currentIndex = 1;
    this.pages = 4;
    this.DistributionPostModel.pageSize = this.pageSize;
    this.DistributionPostModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.getManufactureList();
  }

  get loggedId() {
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }
  getAboutUrl(companyId, loggedId) {
    this._SupplierService.getAboutUsDetails(companyId, this.iContactViewModel.contactId, this.isBuyer, this.loggedId).subscribe(
      result => {
        this.iAboutUsModel = result['data'];
        if (result['result']) {
          window.open('#/Public/profile/' + this.iAboutUsModel.companyURL, '_blank');
        }
      }
    );
  }

  selectAll() {
    this.chkBoxCountArr = [];
    this.selectedRowCount = 0;;
    for (let i = 0; i < this.iSupplierDetailsTemp.length; i++) {
      this.iSupplierDetailsTemp[i].isSelected = this.selectedAll;
      this.chkBoxCountArr = this.iSupplierDetailsTemp.filter(x => x.isSelected === true);
      this.selectedRowCount = this.chkBoxCountArr.length;
    }
    if (this._rfqService.get('messageRfq') == true) {
      this.openMessageDrawermultiple('');
    }
  }
  readMore(e, companyUrl, contactId, communityUrl) {
    e.stopPropagation();
    localStorage.setItem('ViewSupplierProfileId', contactId.toString());
    // window.open('#/Public/profile/' + companyUrl, '_blank');
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/source'], { queryParams: {page: communityUrl }})
    );
     
    window.open("#"+ url, '_blank');

    //window.open(communityUrl, '_blank');
  }
  handleError(error) {
    if (error.status === 0) {
      this._toastr.error('Please check internet connection', 'Error!');
    } else if (error.status === 400) {
      this._toastr.error(JSON.stringify(error.error), 'Error!');
    }
  }

  checkIfAllSelected() {
    this.chkBoxCountArr = this.iSupplierDetailsTemp.filter(x => x.isSelected === true);
    this.selectedRowCount = this.chkBoxCountArr.length;
    this.selectedAll = this.iSupplierDetailsTemp.every(function (
      item: any
    ) {
      return item.selected === true;
    });
    if (this._rfqService.get('messageRfq') == true) {
      this.openMessageDrawermultiple('');
    }
  }

  toggle(val) {
    if (this.showBlock === null || this.showBlock !== val) {
      this.showBlock = val;
    } else {
      this.showBlock = null;
    }

  }
  openProfileEvent(event) {
    // debugger;
    this.openSidePanel(event.contactIdEncrypt, event.companyName, event.companyName);
  }
  openMessageDrawerEvent(event) {
    // debugger;
    this.openMessageDrawer(event.event, event.contactId, event.rfqId, event.fromContName, event.companyId)
  }
}
