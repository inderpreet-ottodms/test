import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  IMagicLeadsViewModel
} from '../../core/models/supplierModel';
import {
  ICountryViewModel,
  IIndustryBranchesModel
} from '../../core/models/globalMaster';
import {
  IcompanyCertificateViewModel, IMyAccountViewModel
} from '../../core/models/supplierProfileModel';
import {
  RfqService
} from '../../core/services/rfq/rfq.service';
import {
  ToastrService
} from 'ngx-toastr';
import {
  Router
} from '@angular/router';
import {
  MasterService
} from '../../core/services/master/master.service';
import {
  ConfirmationService
} from 'primeng/api';
import {
  SupplierService
} from '../../core/services/supplier/supplier.service';
import {
  ProfileService
} from '../../core/services/profile/profile.service';
import {
  AccountService
} from '../../core/services/account/account.service';
import { IFollowContactViewModel } from '../../core/models/settingsModel';
import {
  appConstants
} from '../../core/config/constant';
@Component({
  selector: 'app-magic-lead',
  templateUrl: './magic-lead.component.html',
  styleUrls: ['./magic-lead.component.scss'],
  providers: [ConfirmationService]
})
export class MagicLeadComponent implements OnInit, OnDestroy {

  iSupplierDetails: IMagicLeadsViewModel[];
  iSupplierDetailsTemp: IMagicLeadsViewModel[];
  iSupplierDetailsTemp1: IMagicLeadsViewModel[];
  iFilteredSupplierDetailsColl: IMagicLeadsViewModel[];
  iFilteredbyCountrySuppliers: IMagicLeadsViewModel[];
  isFilteredbyserach: IMagicLeadsViewModel[];
  items: IMagicLeadsViewModel[];
  filteredItems: IMagicLeadsViewModel[];
  iCountryModel: ICountryViewModel[];
  // iIndustryModel: IIndustriesModel[];
  iIndustryModel: IIndustryBranchesModel[];
  iMyAccountViewModel: IMyAccountViewModel;
  iCertificateList: IcompanyCertificateViewModel;
  selectedcountry: string[];
  selectedCertificate: string[];
  selectedIndustry: string[];
  deletedCompanyIds: number[];
  iFollowContactViewModel: IFollowContactViewModel;
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
  showSidePanel: boolean;
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
  pageSize = 50;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 50;
  pagesIndex: Array < number > ;
  applicationRole: any;
  userRole: string;
  isUpgradeBtn: boolean;
  accountUpgradeMessage: string;
  isAccountUpgradereqSent2: boolean;
  /* pagination variables end */
  showUpgradeAccountModal: boolean;

  dummyData: any =[
    {
      companyName: 'ACME, LTD',
      address: '3214 E. Main St. <br /> Salmon, ID 83467 <br /> United States',
      phone:'+1-208-505-5309',
      website:'www.acme.net',
      rating:5
    },
    {
      companyName: 'Bridget\'s Widgets',
      address: '5034 Grove Industrial <br /> Atlanta, GA 30318 <br /> United States',
      phone:'+1-404-867-5309',
      website:'www.bridgewidge.com',
      rating:4
    },
    {
      companyName: 'The Company Co.',
      address: ' 88 Windfield Lane <br /> Harrison, NY 10528 <br /> United States',
      phone:'+1-202-555-5309',
      website:'www.thecompany.co',
      rating:5
    }
  ];
  showFeedbackModel: boolean = false;
  companyName: string ='';
  companyId: number = 0;
  showMagicLeadList: any;
  constructor(private _rfqService: RfqService, private _toastr: ToastrService, private confirmationService: ConfirmationService,
    private router: Router, private mService: MasterService, private sService: SupplierService,
    private _profileService: ProfileService,
    private accountService: AccountService) {
      this._rfqService.set(false, 'showSidePanel');
      this._rfqService.set(false, 'isBuyerMiniProfile');
      this._rfqService.set(false, 'rfqDetailDrawer');

    }

  ngOnInit() {
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
    this.isUpgradeBtn = false;
    this.isAccountUpgradereqSent2 = false;
    this.iFollowContactViewModel = {
      contactId: 0,
      companyIdList: [],
      errorMessage: '',
      rfqId: 0,
      result: true,
      bookType: '',
      isFollow: false
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
      pageName: 'Page Title',
      rfqId: 0,
      toAlternateEmailId:''
    };
    this.applicationRole = JSON.parse(localStorage.getItem('applicableRoles'));
    this.userRole = localStorage.getItem('Usertype');
    if (this.applicationRole.includes('Seller') && this.userRole === 'Buyer') {
      this.switchToSupplier(localStorage.getItem('userId'), 'Seller');
      // setTimeout(this.checkForSwitch, 1000);
    } else if (this.applicationRole.includes('Seller') && (this.userRole === 'Seller' || this.userRole === 'Supplier')) {
      // this.setStatusFilter('All');
      this.checkOfSupplierLocation();
    } else if (!this.applicationRole.includes('Seller')) {
      this._toastr.warning('Please login with valid manufacturer.', 'Warning!');
      setTimeout(() => {
        this.router.navigate(['dashboard/buyer/default']);
      }, 500);
    }
   // this.getCountryList();
   // this.getIndustryList();
    this.showUpgradeAccountModal = false;
    this.getSupplierPackageInfo();
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  checkOfSupplierLocation() {
    let region = null;
    const userDetailsLocation = localStorage.getItem('manufacturingLocation');
    // tslint:disable-next-line:max-line-length
    if (userDetailsLocation !== null && userDetailsLocation !== undefined && userDetailsLocation !== '') {
      if (userDetailsLocation === 'US' || userDetailsLocation === 'Canada' || userDetailsLocation === 'USA & Canada') {
        region = userDetailsLocation;
      } else {
        region = null;
      }
    } else {
      region = null;
    }
    if (region) {
      this.setStatusFilter('All');
    } else {
      this._toastr.warning('Please login with valid manufacturer.', 'Warning!');
      setTimeout(() => {
        this.router.navigate(['dashboard/supplier/ecommerce']);
      }, 500);
    }
  }
  switchToSupplier(userId, Role) {
    let isLoginFromVision;
    if((sessionStorage.getItem('isLoginFromVision')) == 'true') {
      isLoginFromVision=true;
    } else {
      isLoginFromVision=false;
    }
    this.accountService.swicthContact(userId, Role,isLoginFromVision).subscribe(data => {
      if(data.isGoldPlatinumViaStripe != null && data.isGoldPlatinumViaStripe != undefined && data.isGoldPlatinumViaStripe != ''){
        localStorage.setItem('isStripUser', data.isGoldPlatinumViaStripe);
      }else{
        localStorage.setItem('isStripUser', 'false');
      }
        if(data.isLiveQuoteBetaTried != undefined && data.isLiveQuoteBetaTried != null && data.isLiveQuoteBetaTried != ''){
          localStorage.setItem('isQMSTrailModelShown', data.isLiveQuoteBetaTried);
        } else{
          localStorage.setItem('isQMSTrailModelShown', 'false');
        }
        localStorage.setItem('User2', data.user.userName);
        localStorage.removeItem('manufacturingLocation');
        localStorage.setItem('manufacturingLocation', data.manufacturingLocation);
        if (!!data.contactViewModel.contactPictureFile && (data.contactViewModel.contactPictureFile !== '')) {
          if (localStorage.getItem('userHeaderLogo') !== data.contactViewModel.contactPictureFile) {
            localStorage.setItem('userHeaderLogo', data.contactViewModel.contactPictureFile);
          }
        }
        localStorage.setItem('LoggedId', data.contactViewModel.contactId.toString());
        localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
        localStorage.setItem('loggedCompanyId', data.contactViewModel.companyId.toString());
        localStorage.setItem('LoggedIdEncript', data['contactIdEncrypt'].toString());

        if (data.contactViewModel.isRFQCreated === true) {
          localStorage.setItem('isNewUser', 'false');
        } else {
          localStorage.setItem('isNewUser', 'true');
        }
        localStorage.removeItem('Usertype');
        localStorage.setItem('Usertype', 'Supplier');
        const IsPrimiumEncrypt = this._profileService.encrypt(JSON.stringify(data.contactViewModel.isPremium));
        localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
        localStorage.setItem('AccountType', data.accountType);
        localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
        localStorage.setItem('isCapabilitiesFilled', data.contactViewModel.isCapabilitiesFilled.toString());
        localStorage.setItem('isCompanyProfileFilled', data.contactViewModel.isCompanyProfileFilled.toString());
        appConstants.settingDefault.decimalValueDefault= data.defaultNoOfDecimalPlaces;
        this.accountService.sendMessage('Supplier');
        // this.setStatusFilter('All');
        this.checkOfSupplierLocation();
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => {});
  }
  getManufacturerContactsList() {
    this.sService.getMagicLeadList( this.loggedCompanyId, this.loggedId).subscribe(
      result => {
        if (result['result'] === true) {
          this.iSupplierDetails = result['data'];
          if (this.iSupplierDetails.length !== 0) {
            this.totalRfq = this.iSupplierDetails.length;
            this.iSupplierDetailsTemp = this.iSupplierDetails;
            if (this.isBlacklisted === false) {
              this.iSupplierDetailsTemp1 = this.iSupplierDetailsTemp;
            }
            if (this.deletedCompanyIds.length !== 0) {
              let filterDeletedRecords: IMagicLeadsViewModel[] = [];
              filterDeletedRecords = this.iSupplierDetailsTemp;
              for (let i = 0; i < this.deletedCompanyIds.length; i++) {
                filterDeletedRecords = filterDeletedRecords.filter(x => x.buyerCompanyId !== (this.deletedCompanyIds[i]));
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
      () => {}
    );
  }

  searchFilter(event) {
    //  console.log('filter', event );
    if (event) {
      this.iFilteredSupplierDetailsColl = this.iSupplierDetailsTemp.filter(
        data => data.buyerCompanyId === Number(event));
    } else {
      this.iFilteredSupplierDetailsColl = this.iSupplierDetailsTemp;
    }
  }
  sortOnContactName() {
    if (this.toggleManufacturer) {
      this.iSupplierDetailsTemp.sort((a, b) => a.buyerCompany.localeCompare(b.buyerCompany));
    } else {
      this.iSupplierDetailsTemp.sort((a, b) => b.buyerCompany.localeCompare(a.buyerCompany));
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
      () => {});
  }
  setStatusFilter(btnState: string) {
    this.activeStatusFilterBtn = btnState;
    this.selectedcountry = [];
    this.selectedCertificate = [];
    this.selectedIndustry = [];
    // this.selectedProcesses = [];
    this.filterAll();
  }

  filterAll() {
    // this.isLoader = true;

    this.iFilteredSupplierDetailsColl = [];
    // if (this.iSupplierDetailsTemp.length !== 0) {
    this.isLoader = true;
    if (this.activeStatusFilterBtn === 'All') {
      this.isBlacklisted = false;
      this.getManufacturerContactsList();
    } else if (this.activeStatusFilterBtn === 'Blacklisted') {
      this.isBlacklisted = true;
      this.getManufacturerContactsList();
    } else if (this.activeStatusFilterBtn === 'Archived') {
      let filteredRecords: IMagicLeadsViewModel[] = [];
      let filterDeletedRecords: IMagicLeadsViewModel[] = [];
      for (let i = 0; i < this.deletedCompanyIds.length; i++) {
        filterDeletedRecords = this.iSupplierDetailsTemp1.filter(x => x.buyerCompanyId === (this.deletedCompanyIds[i]));
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
    } // }
  }
  filterDropdown() {
    if (this.selectedcountry.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
      let filteredRecords: IMagicLeadsViewModel[] = [];
      for (let i = 0; i < this.selectedcountry.length; i++) {
        // console.log('inforcountry', this.selectedcountry);
        this.iFilteredbyCountrySuppliers = this.iFilteredSupplierDetailsColl.filter
        // tslint:disable-next-line:triple-equals
        (x => x.countryId == (this.selectedcountry[i]['countryId']));
        filteredRecords = filteredRecords.concat(this.iFilteredbyCountrySuppliers);
        // this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.concat(this.iFilteredbyCountrySuppliers);
      }
      this.iFilteredSupplierDetailsColl = filteredRecords;
    }

    if (this.searchFilterValue !== '' && this.iFilteredSupplierDetailsColl.length !== 0) {
      this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(
        x => x.buyerCompany.toLowerCase().includes(this.searchFilterValue.toLowerCase()));
    }

    // if (this.selectedIndustry.length !== 0 && this.iFilteredSupplierDetailsColl.length !== 0) {
    //   // console.log('iFilteredSupplierDetailsColl ', this.iFilteredSupplierDetailsColl);
    //   const filteredRecords: IMagicLeadsViewModel[] = [];
    //   this.iFilteredSupplierDetailsColl.filter((x) => {
    //     let isMatched = false;
    //     if (x.industryBranchIds !== null) {
    //       for (let j = 0; j < x.industryBranchIds.length; j++) {
    //         for (let i = 0; i < this.selectedIndustry.length; i++) {
    //           if (x.industryBranchIds[j] === (this.selectedIndustry[i]['industryBranchesId'])) {
    //             isMatched = true;
    //           }
    //         }
    //       }
    //     }

    //     if (isMatched) {
    //       filteredRecords.push(x);
    //     }
    //   });
    //   this.iFilteredSupplierDetailsColl = filteredRecords;
    // }

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
    this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.iFilteredSupplierDetailsColl.length / this.pageSize));
    if (this.iFilteredSupplierDetailsColl.length % this.pageSize !== 0) {
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
    this.items = this.filteredItems.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
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
  openBuyerDrawer(contactId, folId) {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(true, 'isBuyerMiniProfile');
    // this._rfqService.set(fromContName, 'nameOfBuyer');
    this._rfqService.set(contactId, 'buyerProfileId');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(folId, 'tilefocusId');
    this._rfqService.setisBuyerNameClicked('true');
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
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'selectContactRFQId');
    this._rfqService.set(fromContName, 'nameOfBuyer');
    this._rfqService.set(contactId, 'tilefocusId');
  },100);
    setTimeout(() => {
      const elmnt = document.getElementById(contactId);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
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
        this.deletedCompanyIds.push(companyId);
        this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(x => x.buyerCompanyId !== (companyId));
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
        this.iFilteredSupplierDetailsColl = this.iFilteredSupplierDetailsColl.filter(x => x.buyerCompanyId !== (companyId));
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
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
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
    const IsPremiumEncrypt = localStorage.getItem('IsPremium');
    const IsPremiumDecrypt = this._profileService.decrypt(IsPremiumEncrypt);
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
  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }

  goBack() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(0, 'buyerCurrentProfileCompanyId');
    this._rfqService.set(0, 'buyerCurrentProfileContactId');
  }
  isModelShow() {
    return this._rfqService.get('isModelShow');
  }
  isBuyerprofileDrawer() {
    return this._rfqService.get('isBuyerMiniProfile');
  }
  isMessageDrawer() {
    return this._rfqService.get('isBuyerMessage');
  }
  isRfqDrawer() {
    return this._rfqService.get('rfqDetailDrawer');
  }
  getCurrentRfqId() {
    return this._rfqService.get('rfqId');
  }
  setFollow(manufactureId ) {
    this.iFollowContactViewModel.contactId = this.loggedId;
    this.iFollowContactViewModel.companyIdList[0] = manufactureId ;
    this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
    this.iFollowContactViewModel.isFollow = true;
    this.sService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if ( result ) {
          this._toastr.success(result.errorMessage, '');
         // this.items.isFollowing = true;
          this._rfqService.set(true, 'followUnFollowChange');
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
  }
  unFollow(manufactureId) {
    this.iFollowContactViewModel.contactId = this.loggedId;
    this.iFollowContactViewModel.companyIdList[0] = manufactureId ;
    this.iFollowContactViewModel.bookType = 'BOOK_BOOKTYPE_HOTLIST';
    this.iFollowContactViewModel.isFollow = false;
    this.sService.setFollowBlacklistContact(this.iFollowContactViewModel).subscribe(
      result => {
        if ( result ) {
          this._toastr.success(result.errorMessage, '');
         // this.items.isFollowing = false;
          this._rfqService.set(true, 'followUnFollowChange');
        }
      },
      error => {
        this._rfqService.handleError(error);
      }
    );
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
  /* This function is called when click on Upgrade to quote button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  openFeedbackModel(compName, compId){
    this.companyName = compName;
    this.companyId = compId;
    this.showFeedbackModel = true;
  }

  getSupplierPackageInfo() {
    const contactId = this.loggedId;
    const companyId = this.loggedCompanyId;
    this.sService.getTileAvailability(contactId, companyId).subscribe(
      (result) => {
        if (result) {
          this.showMagicLeadList = result[0].showMagicLeadList;
        }
      },
      (error) => {
        console.log("err", error);
      },
      () => { }

    );
  }

}

