import { Component, OnInit, OnDestroy } from '@angular/core';
import { RfqService } from './../../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ICountryViewModel,  IIndustryBranchesModel } from '../../../../../core/models/globalMaster';
import { MasterService } from '../../../../../core/services/master/master.service';
import { IcompanyCertificateViewModel } from '../../../../../core/models/supplierProfileModel';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { IManufacturerContactsViewModel, IManufacturerContactListViewModel } from '../../../../../core/models/supplierModel';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { IFollowContactViewModel } from '../../../../../core/models/settingsModel';
import { appConstants } from '../../../../../core/config/constant';

@Component({
  selector: 'app-follwed-buyer-contact-list',
  templateUrl: './follwed-buyer-contact-list.component.html',
  styleUrls: ['./follwed-buyer-contact-list.component.scss'],
  providers: [ConfirmationService]
})
export class FollwedBuyerContactListComponent implements OnInit, OnDestroy {
  // Model Instance
  iSupplierDetails: IManufacturerContactsViewModel[];
  iSupplierDetailsTemp: IManufacturerContactsViewModel[];
  iSupplierDetailsTemp1: IManufacturerContactsViewModel[];
  iFilteredSupplierDetailsColl: IManufacturerContactsViewModel[];
  iFilteredbyCountrySuppliers: IManufacturerContactsViewModel[];
  isFilteredbyserach: IManufacturerContactsViewModel[];
  items: IManufacturerContactsViewModel[];
  filteredItems: IManufacturerContactsViewModel[];
  iCountryModel: ICountryViewModel[];
  // iIndustryModel: IIndustriesModel[];
  iIndustryModel: IIndustryBranchesModel[];
  iCertificateList: IcompanyCertificateViewModel;
  iManufacturerContactListViewModel: IManufacturerContactListViewModel;
  iFollowContactViewModel: IFollowContactViewModel;
  selectedcountry: string[];
  selectedCertificate: string[];
  selectedIndustry: string[];
  deletedCompanyIds: number[];
  msgs: string;
  // Model Instance End

  // variable Declarations
  public rfqId: any;
  materialsettings = {};
  certificatesettings = {};
  countrySettings = {};
  industrySettings = {};
  isDelete: boolean;
  isCencel: boolean;
  isTilesView: boolean;
  isGridView: boolean;
  toggleManufacturer: boolean;
  isCancel1stStep: boolean;
  searchFilterValue: string;
  manufactureFilterValue: string;
  countryFilterValue: string;

  isLoader: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  activeStatusFilterBtn: string;
  isCreateRFQBodyBtnDisabled: boolean;
  isRFQInProgBodyBtnDisabled: boolean;
  toggleNoRFQBodyBtn = true;
  defaultAwsPath = '';
  expanded = false;
  isBuyer: boolean;
  isBlacklisted: boolean;

  /* pagination variables start */
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  pagesIndex: Array<number>;
  /* pagination variables end */
  currentRate = 3.5;
  totalRow: any;
  // variable Declarations ends

  constructor(private _SupplierService: SupplierService, private _rfqService: RfqService, private _toastr: ToastrService, private confirmationService: ConfirmationService,
    private router: Router, private mService: MasterService, private sService: SupplierService,
    private _profileService: ProfileService) {
    this.isDelete = false;
    this.isCencel = false;
    this.isTilesView = false;
    this.isGridView = true;
    this.isRfqAvailable = false;
    this.isCancel1stStep = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.toggleManufacturer = false;
    this.manufactureFilterValue = '';
    this.searchFilterValue = '';
    this.countryFilterValue = '0';
    this.activeStatusFilterBtn = 'All';
    this.msgs = '';
    this.isCreateRFQBodyBtnDisabled = false;
    this.isRFQInProgBodyBtnDisabled = false;
    this.iCountryModel = [];
    this.iIndustryModel = [];
    this.selectedcountry = [];
    this.selectedIndustry = [];
    this.deletedCompanyIds = [];
    this.isBuyer = false;
    this.isBlacklisted = false;
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
      filterBy: ''
    };
    this.iFollowContactViewModel = {
      contactId: 0,
      rfqId: 0,
      companyIdList: [],
      errorMessage: '',
      result: true,
      isFollow: null,
      bookType: ''
    };
  }

  ngOnInit() {
    this.getCountryList();
    this.getIndustryList();
    // this.getManufacturerContactsList();
    this.setStatusFilter('All');
    //this.initManufacturerContactList();

  }



  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  // get loggedId() {
  //   // tslint:disable-next-line:radix
  //   return parseInt(localStorage.getItem('LoggedId'));
  // }

  getManufacturerContactsList() {
    //console.log(this.loggedId);
    this.iManufacturerContactListViewModel.contactId = this.loggedId;
    this.iManufacturerContactListViewModel.isbuyer = this.isBuyer;
    this.iManufacturerContactListViewModel.isBlacklisted = this.isBlacklisted;
    this.iManufacturerContactListViewModel.isLikedManufacturers = false;
    this.iManufacturerContactListViewModel.pageSize = this.pageSize;
    this.searchFilterValue = this.iManufacturerContactListViewModel.searchText;
    // this.iManufacturerContactListViewModel.pageNumber = this.pageNumber;
    this.isLoader = true;
    this.sService.getManufacturerContactsList(this.iManufacturerContactListViewModel).subscribe(
      result => {
        if (result['result'] === true) {
          this.iSupplierDetails = result['data'];
          this.items = result['data'];
          this.totalRow = result['totalRec'];
          if (this.iSupplierDetails.length !== 0) {
            this.totalRfq = this.iSupplierDetails.length;
            this.iSupplierDetailsTemp = this.iSupplierDetails;
            if (this.isBlacklisted === false) {
              this.iSupplierDetailsTemp1 = this.iSupplierDetailsTemp;
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
          // this.items = [];
        }
      },
      error => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  searchFilter(event) {
    //  console.log('filter', event );
    if (event) {
      this.iFilteredSupplierDetailsColl = this.iSupplierDetailsTemp.filter(
        data => data.companyId === Number(event));
    } else {
      this.iFilteredSupplierDetailsColl = this.iSupplierDetailsTemp;
    }
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
        };
      }
    );
  }

  getIndustryList() {
    this.mService.GetIndustryBranches().subscribe(result => {
      this.iIndustryModel = result['data'];
      this.industrySettings = {
        singleSelection: false,
        text: 'All Industry',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Search Industry',
        enableSearchFilter: true,
        labelKey: 'industryBranchesName',
        primaryKey: 'industryBranchesId',
        noDataLabel: 'No Data Available',
        selectGroup: false,
        badgeShowLimit: 1,
        maxHeight: 200,
        showCheckbox: true,
        classes: 'myBoldClass',
      };
    },
      error => {
        this._rfqService.handleError(error);
      },
      () => {
      });
  }
  setStatusFilter(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.selectedcountry = [];
    this.selectedCertificate = [];
    this.selectedIndustry = [];
    // this.selectedProcesses = [];
    this.isLoader = true;
    this.filterAll();
  }

  filterAll() {
    // this.isLoader = true;
    this.currentIndex = 1;
    this.pages = 3;
    this.iFilteredSupplierDetailsColl = [];
    // if (this.iSupplierDetailsTemp.length !== 0) {
    this.isLoader = true;
    if (this.searchFilterValue) {
      this.iManufacturerContactListViewModel.searchText = this.searchFilterValue;
    } else {
      this.iManufacturerContactListViewModel.searchText = '';
    }
    if (this.activeStatusFilterBtn === 'All') {
      this.isBlacklisted = false;
      this.isLoader = true;
      this.getManufacturerContactsList();
    } else if (this.activeStatusFilterBtn === 'Blacklisted') {
      this.isBlacklisted = true;
      this.isLoader = true;
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

      // this.init();
    }    // }

    this.iManufacturerContactListViewModel.pageSize = this.pageSize;
    this.iManufacturerContactListViewModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.getManufacturerContactsList();
  }
  filterDropdown() {
    if (this.selectedcountry.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
      let filteredRecords: IManufacturerContactsViewModel[] = [];
      for (let i = 0; i < this.selectedcountry.length; i++) {
        // console.log('inforcountry', this.selectedcountry);
        this.iFilteredbyCountrySuppliers = this.iFilteredSupplierDetailsColl.filter
          // tslint:disable-next-line:triple-equals
          (x => x.address.countryId == (this.selectedcountry[i]['countryId']));
        filteredRecords = filteredRecords.concat(this.iFilteredbyCountrySuppliers);
        // this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.concat(this.iFilteredbyCountrySuppliers);
      }
      this.iFilteredSupplierDetailsColl = filteredRecords;
    }

    if (this.searchFilterValue !== '' && this.iFilteredSupplierDetailsColl.length !== 0) {
      this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(
        x => x.companyName.toLowerCase().includes(this.searchFilterValue.toLowerCase()));
    }

    if (this.selectedIndustry.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
      // console.log('iFilteredSupplierDetailsColl ', this.iFilteredSupplierDetailsColl);
      const filteredRecords: IManufacturerContactsViewModel[] = [];
      this.iFilteredSupplierDetailsColl.filter((x) => {
        let isMatched = false;
        if (x.industryBranchIds !== null) {
          for (let j = 0; j < x.industryBranchIds.length; j++) {
            for (let i = 0; i < this.selectedIndustry.length; i++) {
              if (x.industryBranchIds[j] === (this.selectedIndustry[i]['industryBranchesId'])) {
                isMatched = true;
              }
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
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.totalRow / this.pageSize));
    if (this.totalRow % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  ChangeinputLength() {
    this.pageSize = this.inputLength;
    this.init();
  }
  refreshItems() { // iFilteredRFQViewModelColl
    this.filteredItems = this.iFilteredSupplierDetailsColl;
    // tslint:disable-next-line:max-line-length
    if (this.searchFilterValue) {
      this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    } else {
      this.items = this.iSupplierDetails;
    }
    this.pagesIndex = this.fillArray();
    window.scrollTo(0, 0);
  }
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    // this.refreshItems();
    this.getManufacturerContactsList();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }

    // this.refreshItems();
    this.iManufacturerContactListViewModel.pageNumber = this.currentIndex;
    this.getManufacturerContactsList();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    // this.refreshItems();
    this.iManufacturerContactListViewModel.pageNumber = this.currentIndex;
    this.getManufacturerContactsList();


    // this.currentIndex = index;
    // this.isupplierRfqFilterViewModel.pageNumber = this.currentIndex;
    // this.getRfqList();
  }
  // Pagination Function ends
  // API Call Function

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }


  changeInProg(flag) {
    if (flag === true) {
      this.toggleNoRFQBodyBtn = false;
    } else {
      this.toggleNoRFQBodyBtn = true;
    }
  }
  changeCrRFQ(flag) {
    if (flag === true) {
      this.toggleNoRFQBodyBtn = true;
    } else {
      this.toggleNoRFQBodyBtn = true;
    }
  }
  onCreateRFQBodyClick() {
    this.isCreateRFQBodyBtnDisabled = true;
  }
  onRFQInProgBodyClick() {
    this.isRFQInProgBodyBtnDisabled = true;
  }

  // API Call Function End

  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  // openBuyerDrawer(contactId, folId) {
  //   this._rfqService.set(true, 'showSidePanel');
  //   this._rfqService.set(true, 'isBuyerMiniProfile');
  //   // this._rfqService.set(fromContName, 'nameOfBuyer');
  //   this._rfqService.set(contactId, 'buyerProfileId');
  //   this._rfqService.set(false, 'isBuyerMessage');
  //   this._rfqService.set(folId, 'tilefocusId');
  //   setTimeout(() => {
  //     const elmnt = document.getElementById(folId);
  //     elmnt.scrollIntoView({behavior: 'auto', block: 'center', inline: 'nearest'});
  //   }, 1000);
  // }
  openBuyerDrawer(contactId, folId) {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(true, 'isBuyerMiniProfile');
    // this._rfqService.set(fromContName, 'nameOfBuyer');
    this._rfqService.set(contactId, 'buyerProfileId');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(folId, 'tilefocusId');
    // this._rfqService.setisBuyerNameClicked('true');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMiniProfile');
      const elmnt = document.getElementById(folId);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 1000);
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    event.stopPropagation();
    this._rfqService.set(false, 'isBuyerMessage');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'isBuyerMessage');
      this._rfqService.set(false, 'isBuyerMiniProfile');
      this._rfqService.set(contactId, 'selectContactIdsForMEessage');
      this._rfqService.set(messageRFQId, 'selectContactRFQId');
      this._rfqService.set(fromContName, 'nameOfBuyer');
      this._rfqService.set(contactId, 'tilefocusId');
    }, 100);
    setTimeout(() => {
      const elmnt = document.getElementById(contactId);
      elmnt.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    }, 1000);
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
  detailRfq(id, Name) {
    // localStorage.setItem('detailRfqId', id);
    // localStorage.setItem('detailRfqId',  id);
    // this.router.navigate(['/rfq/rfqdetail']);
  }
  editRfq(id, Name) {
    localStorage.setItem('EditRfqId', id);
    localStorage.setItem('EditRfqName', Name);
    this._rfqService.set(id, 'editRfqId');
    this._rfqService.set(Name, 'editRfqName');
    this.router.navigate(['/rfq/editrfq']);
  }
  removeContact(companyId) {
    this.isCancel1stStep = true;
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to remove this contact from your list?',
      header: 'Remove Contact',
      icon: null,
      accept: () => {
        this.msgs = 'true';
        //  this.deletedCompanyIds.push(companyId);
        //  this.iFilteredSupplierDetailsColl =  this.iFilteredSupplierDetailsColl.filter(x => x.companyId !== (companyId));
        //  if (this.iFilteredSupplierDetailsColl.length === 0) {
        //   this.isLoader = false;
        //   this.isRfqAvailable = true;
        // } else {
        //   this.isLoader = false;
        //   this.isRfqAvailable = false;
        // }
        //  this.init();

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
    this.isCancel1stStep = true;
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
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
    this._rfqService.set(false, 'isBuyerMiniProfile');
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
  searchByKey(event) {
    // console.log(event, event.keyCode);
    if (event.keyCode === 13) {
      this.filterAll();
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
  currentContact() {
    return this._rfqService.get('tilefocusId');
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

  isPremium() {
    let IsPremiumEncrypt = localStorage.getItem('IsPremium');
    let IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
    if (IsPremiumDecrypt !== 'true' && IsPremiumDecrypt !== 'false') {
      localStorage.clear();
      this.router.navigate(['auth/login/simple']);
      return;
    }
    if (IsPremiumDecrypt === 'true') {
      return true;
    } else {
      return false;
    }
  }
}
