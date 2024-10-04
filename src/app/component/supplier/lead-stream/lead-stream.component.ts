import {
  Component,
  OnInit
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
  ILeadsStreamFilterViewModel,
  ILeadsStreamModel,
  ILeadStreamDashboardRollUpViewModel
} from '../../../core/models/profileModel';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  IMyAccountViewModel
} from '../../../core/models/supplierProfileModel';
import {
  SupplierService
} from '../../../core/services/supplier/supplier.service';
import {
  AccountService
} from '../../../core/services/account/account.service'
import {
  ProfileService
} from '../../../core/services/profile/profile.service';
import {
  appConstants
} from '../../../core/config/constant';
import * as moment from 'moment';
@Component({
  selector: 'app-lead-stream',
  templateUrl: './lead-stream.component.html',
  styleUrls: ['./lead-stream.component.scss'],
  providers: [ConfirmationService]
})
export class LeadStreamComponent implements OnInit {

  selectDays: string;
  pageSize: number;
  currentIndex: number;
  pagesIndex: number[];
  pageNumber: number;
  pageStart: number;
  pages: number;
  totalRow: number;
  isLoader: boolean;
  isAvailable: boolean;
  iLeadsStreamFilterViewModel: ILeadsStreamFilterViewModel;
  iLeadStreamDashboardRollUpViewModel: ILeadStreamDashboardRollUpViewModel;
  ILeadsStreamModel: ILeadsStreamModel[];
  iMyAccountViewModel: IMyAccountViewModel;
  isUpgradeModelVisible: boolean;
  accountUpgradeMessage: string;
  sortBy: number;
  applicationRole: string;
  userRole: string;
  displaydate: any;
  firstDate: any;
  secondDate: any;
  isDatePupupShow: boolean;
  maxDate: Date;
  selectedBox: number;
  profileCount: number = 0;
  messageCount: number = 0;
  internetCount: number = 0;
  websiteCount: number = 0;
  phoneCount: number = 0;
  emailCount: number = 0;
  specialInviteCount: number = 0;
  viewedQuoteCount: number = 0;
  readMessageCount: number = 0;
  allActivityCount: number = 0;
  buyerAwardRfqCount:number = 0;
  communityProfileCount:number = 0;
  communityPhoneCount:number = 0;
  communityEmailCount: number = 0;
  communityRfqCount: number = 0;
  communityWebSiteCount: number = 0;
  profileViewCount: number = 0;
  communityProfileLikeCount: number =0;
  communityPhotos: number =0;
  communityJobs: number =0;
  viewed3DTour: number = 0;
  communityPhotosCount: number = 0;
  communityJobsCount: number = 0;
  viewed3DTourCount: number = 0;
  // tslint:disable-next-line:max-line-length
  showUpgradeAccountModal: boolean;
  

  constructor(private masterService: MasterService, private rfqService: RfqService,
    private supplierService: SupplierService, private toastr: ToastrService,
    private accountService: AccountService, private router: Router, private _profileService: ProfileService) {}

  ngOnInit() {
    this.isLoader = true;
    this.selectedBox = 0;
    this.maxDate = new Date();
    this.rfqService.set(false, 'isBuyerCommpleteProfile');
    this.rfqService.set(false, 'showSidePanel');
    this.selectDays = 'Last30days';
    this.pageSize = 24;
    this.currentIndex = 1;
    this.pageNumber = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.totalRow = 0;
    this.isAvailable = true;
    this.iLeadsStreamFilterViewModel = {
      // tslint:disable-next-line:radix
      companyId: this.loggedCompanyId,
      leadsStreamFilter: this.selectDays,
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: false,
      errorMessage: '',
      interactionType: 0,
      fromDate: '',
      toDate: '',
      result: false
    };
    this.iLeadStreamDashboardRollUpViewModel = {
      companyId: this.loggedCompanyId,
      uptoDays: 30,
      pageSize: 0,
      pageNumber: 0,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: false,
      interactionType: 0,
      dateFrom: '',
      dateTo: '',
      filterBy: ''
    }
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
      pageName: 'lead stream',
      rfqId: 0,
      toAlternateEmailId: ''
    };
    this.displaydate = 'Select Date Range';
    this.ILeadsStreamModel = [];
    this.isUpgradeModelVisible = false;
    this.accountUpgradeMessage = '';
    this.sortBy = 0;
    this.applicationRole = JSON.parse(localStorage.getItem('applicableRoles'));
    this.userRole = localStorage.getItem('Usertype');
    if (this.applicationRole.includes('Seller') && this.userRole === 'Buyer') {
      this.switchToSupplier(localStorage.getItem('userId'), 'Seller');
      // setTimeout(this.checkForSwitch, 1000);
    } else if (this.applicationRole.includes('Seller') && (this.userRole === 'Seller' || this.userRole === 'Supplier')) {
      this.getLeadStream();
    } else if (!this.applicationRole.includes('Seller')) {
      this.toastr.warning('Please login with valid manufacturer.', 'Warning!');
      setTimeout(() => {
        this.router.navigate(['dashboard/buyer/default']);
      }, 500);
    }
    this.getLeadStreamCounts();
    // this.getLeadStream();
    this.showUpgradeAccountModal = false;
  }
  getLeadStreamCounts() {
    this.masterService.getLeadStreamCount(this.iLeadStreamDashboardRollUpViewModel).subscribe(
      data => {
        if (data.result === true) {
          this.profileCount = data.data.profile;
          this.messageCount = data.data.message;
          this.internetCount = data.data.internet;
          this.websiteCount = data.data.website;
          this.phoneCount = data.data.phone;
          this.emailCount = data.data.email;
          this.specialInviteCount = data.data.specialInvite;
          this.viewedQuoteCount = data.data.viewedQuote;
          this.readMessageCount = data.data.readMessage;
          this.buyerAwardRfqCount=data.data.rfqAwarded;
          this.communityProfileCount = data.data.communityProfile;
          this.communityPhoneCount = data.data.communityPhone;
          this.communityEmailCount = data.data.communityEmail;
          this.communityRfqCount = data.data.communityDirectRfq;
          this.communityWebSiteCount = data.data.communityWebsite;
          this.profileViewCount = data.data.inAppProfileView;
          this.communityProfileLikeCount = data.data.communityLikeDislike;
          this.communityPhotos = data.data.communityPhotos;
          this.communityJobs = data.data.communityJobs;
          this.viewed3DTour = data.data.viewed3DTour;
          // tslint:disable-next-line:max-line-length
          this.allActivityCount = this.profileCount + this.messageCount + this.internetCount + this.websiteCount + this.phoneCount + this.emailCount + this.specialInviteCount + this.viewedQuoteCount + this.readMessageCount + this.buyerAwardRfqCount + this.communityProfileCount + this.communityPhoneCount + this.communityEmailCount + this.communityRfqCount + this.communityWebSiteCount + this.profileViewCount + this.communityProfileLikeCount + this.communityPhotos + this.communityJobs + this.viewed3DTour;
        }
      }
    );
  }
  setActive(selectValue) {
    this.selectedBox = selectValue;
    this.sortBy = selectValue;
    this.filterAll();
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
  getLeadStream() {
    // tslint:disable-next-line:max-line-length
    if (localStorage.getItem('leadValue') !== null && localStorage.getItem('leadValue') !== undefined && localStorage.getItem('leadValue') !== '') {
      // tslint:disable-next-line:radix
      this.iLeadsStreamFilterViewModel.interactionType = parseInt(localStorage.getItem('leadValue'));
      // tslint:disable-next-line:radix
      this.selectedBox = parseInt(localStorage.getItem('leadValue'));
      localStorage.removeItem('leadValue');
    }
    // tslint:disable-next-line:radix
    this.iLeadsStreamFilterViewModel.companyId = parseInt(localStorage.getItem('loggedCompanyId')),
      this.ILeadsStreamModel = [];
    this.isLoader = true;
    this.masterService.getLeadRecords(this.iLeadsStreamFilterViewModel).subscribe(
      result => {
        if (result.result) {
          this.ILeadsStreamModel = result.data;
          this.totalRow = result['totalRecords'];
          // window.scrollTo(0, 0);
        }
        this.isLoader = false;
        if (this.ILeadsStreamModel.length) {
          this.isAvailable = true;
        } else {
          this.isAvailable = false;
        }
        this.init();
        window.scrollTo(0, 0);
      },
      error => {
        this.isLoader = false;
        this.isAvailable = false;
        this.init();
      }

    );
  }
  filterAll() {
    let displayFirstDate;
    let displySecondDate;
    if (this.firstDate && this.secondDate) {
      displayFirstDate = this.firstDate.getMonth() + 1 + '/' + this.firstDate.getDate() + '/' + this.firstDate.getFullYear();
      displySecondDate = this.secondDate.getMonth() + 1 + '/' + this.secondDate.getDate() + '/' + this.secondDate.getFullYear();
      this.displaydate = displayFirstDate + '-' + displySecondDate;
      const firstmonth = this.firstDate.getMonth() + 1;
      const secondmonth = this.secondDate.getMonth() + 1;
      this.iLeadsStreamFilterViewModel.fromDate = this.firstDate.getFullYear() + '-' + firstmonth + '-' + this.firstDate.getDate();
      this.iLeadsStreamFilterViewModel.toDate = this.secondDate.getFullYear() + '-' + secondmonth + '-' + this.secondDate.getDate();
      this.iLeadStreamDashboardRollUpViewModel.dateFrom = this.iLeadsStreamFilterViewModel.fromDate;
      this.iLeadStreamDashboardRollUpViewModel.dateTo = this.iLeadsStreamFilterViewModel.toDate;
      this.isDatePupupShow = false;
      this.iLeadStreamDashboardRollUpViewModel.uptoDays = 0;
    } else {
      this.iLeadsStreamFilterViewModel.fromDate = '';
      this.iLeadsStreamFilterViewModel.toDate = '';
      this.iLeadStreamDashboardRollUpViewModel.dateFrom = '';
      this.iLeadStreamDashboardRollUpViewModel.dateTo = '';
      switch (this.selectDays) {
        case 'Last7days':
          this.iLeadStreamDashboardRollUpViewModel.uptoDays = 7;
          break;
        case 'Last30days':
          this.iLeadStreamDashboardRollUpViewModel.uptoDays = 30;
          break;
        case 'Last60days':
          this.iLeadStreamDashboardRollUpViewModel.uptoDays = 60;
          break;
        case 'Last90days':
          this.iLeadStreamDashboardRollUpViewModel.uptoDays = 90;
          break;
        case 'LastYear':
          this.iLeadStreamDashboardRollUpViewModel.uptoDays = 365;
          break;
      }
    }
    this.isDatePupupShow = false;
    this.iLeadsStreamFilterViewModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pages = 3;
    this.iLeadsStreamFilterViewModel.pageSize = this.pageSize;
    this.iLeadsStreamFilterViewModel.leadsStreamFilter = this.selectDays;
    // tslint:disable-next-line:radix
    this.iLeadsStreamFilterViewModel.interactionType = this.sortBy;
    this.getLeadStream();
    this.getLeadStreamCounts();
  }
  isSidePanel() {
    return this.rfqService.get('showSidePanel');
  }
  isBuyerMiniProfile() {
    return this.rfqService.get('isBuyerMiniProfile');
  }
  isMessageRfqPanel() {
    return this.rfqService.get('isBuyerMessage');
  }
  isMessageView() {
    return this.rfqService.get('isBuyerMessageView');
  }

  isBuyerCommpleteProfile() {
    return this.rfqService.get('isBuyerCommpleteProfile');
  }
  goBack() {
    this.rfqService.set(false, 'isBuyerCommpleteProfile');
    this.rfqService.set(false, 'showSidePanel');
    this.rfqService.set(false, 'isBuyerMiniProfile');
  }
  openSidePanel(contactId: string) {
    this.rfqService.set(contactId, 'buyerProfileId');
    this.rfqService.set(false,'rfqDetailDrawer');
    setTimeout(() => {
      this.rfqService.set(true, 'showSidePanel');
      this.rfqService.set(true, 'isBuyerMiniProfile');
    }, 100);
    this.rfqService.set(false, 'isBuyerMessageView');
    this.rfqService.set(false, 'isBuyerMiniProfile');
  }
  /* Pagination */
  fillArray(): any {
    const obj = new Array();
    // tslint:disable-next-line:radix
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  refreshItems() {
    this.pagesIndex = this.fillArray();
  }
  init() {
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
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.iLeadsStreamFilterViewModel.pageNumber = this.currentIndex;
    this.getLeadStream();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iLeadsStreamFilterViewModel.pageNumber = this.currentIndex;
    this.getLeadStream();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.iLeadsStreamFilterViewModel.pageNumber = this.currentIndex;
    this.getLeadStream();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  switchToSupplier(userId, Role) {
    let isLoginFromVision;
    if((sessionStorage.getItem('isLoginFromVision')) == 'true') {
      isLoginFromVision=true;
    } else {
      isLoginFromVision=false;
    }
    this.accountService.swicthContact(userId, Role,isLoginFromVision).subscribe(data => {
        if (data.isGoldPlatinumViaStripe != null && data.isGoldPlatinumViaStripe != undefined && data.isGoldPlatinumViaStripe != '') {
          localStorage.setItem('isStripUser', data.isGoldPlatinumViaStripe);
        } else {
          localStorage.setItem('isStripUser', 'false');
        }
        if (data.isLiveQuoteBetaTried != undefined && data.isLiveQuoteBetaTried != null && data.isLiveQuoteBetaTried != '') {
          localStorage.setItem('isQMSTrailModelShown', data.isLiveQuoteBetaTried);
        } else {
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
        // localStorage.setItem('IsPremium', JSON.stringify(data.contactViewModel.isPremium));
        if (data.contactViewModel.isRFQCreated === true) {
          localStorage.setItem('isNewUser', 'false');
        } else {
          localStorage.setItem('isNewUser', 'true');
        }
        localStorage.removeItem('Usertype');
        localStorage.setItem('Usertype', 'Supplier');
        // localStorage.setItem('IsPremium', JSON.stringify(data.contactViewModel.isPremium));
        let IsPrimiumEncrypt = this._profileService.encrypt(JSON.stringify(data.contactViewModel.isPremium));
        localStorage.setItem('IsPremium', IsPrimiumEncrypt.toString());
        localStorage.setItem('AccountType', data.accountType);
        localStorage.setItem('applicableRoles', JSON.stringify(data.currentUserRole));
        localStorage.setItem('isCapabilitiesFilled', data.contactViewModel.isCapabilitiesFilled.toString());
        localStorage.setItem('isCompanyProfileFilled', data.contactViewModel.isCompanyProfileFilled.toString());
        // this.isLoginResonse = false;
        // this.router.navigateByUrl( this.returnUrl );
        appConstants.settingDefault.decimalValueDefault = data.defaultNoOfDecimalPlaces;
        this.accountService.sendMessage('Supplier');
        this.getLeadStream();
      },
      error => {
        this.rfqService.handleError(error);
      },
      () => {});
  }

  isModelShow() {
    return this.rfqService.get('isModelShow');
  }
  openDateRage() {
    this.isDatePupupShow = true;
    // this.selectSort = '0';
    if (this.displaydate === 'Select Date Range') {
      this.firstDate = null;
      this.secondDate = null;
      // console.log('firstdateopen', this.FirstDate);
    }
  }
  hidePopup() {
    this.isDatePupupShow = false;
  }
  clearDate() {
    this.firstDate = null;
    this.secondDate = null;
    this.displaydate = 'Select Date Range';
  }
  /* This function is called when click on Upgrade Account button to open the upgrade Account modal */
  upgradeClick() {
    this.showUpgradeAccountModal = true;
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
  }
  showMessageDetails(leadStreamId) {
    debugger;
    this.rfqService.set(false, 'showSidePanel');
    this.rfqService.set(false,'rfqDetailDrawer');
    this.rfqService.set(leadStreamId, 'leadStreamId');
    this.rfqService.set(false, 'showLeadMessage');
    this.rfqService.set(false, 'isBuyerMiniProfile');
    this.rfqService.set(false, 'isBuyerMessage');

    setTimeout(() => {
      this.rfqService.set(true, 'showSidePanel');
      this.rfqService.set(true, 'isBuyerMessageView');
    }, 100);

  }
  utcDate(date) {
    return moment.utc(date).toDate();
  }
  isRfqDrawer() {
    return this.rfqService.get('rfqDetailDrawer');
  }
  getCurrentRfqId() {
    return this.rfqService.get('rfqId');
  }
}
