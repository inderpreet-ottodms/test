import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  IQMSQuoteListFilterViewModel,
  IQMSQuoteListViewModel,
  IQMSStatus,
  QMSActivityStatusModel,
  Quoter,
  QMSEmailStatus,
  QMSProbabilityStatus
} from '../../../core/models/qmsModel';
import {
  QmsService
} from '../../../core/services/qms/qms.service';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  ConfirmationService
} from 'primeng/api';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  ProfileService
} from '../../../core/services/profile/profile.service';

@Component({
  selector: 'app-common-qms',
  templateUrl: './common-qms.component.html',
  styleUrls: ['./common-qms.component.scss'],
  providers: [ConfirmationService]
})
export class CommonQmsComponent implements OnInit {

  @Input() QmsType: any;
  pageSize: number;
  currentIndex: number;
  pagesIndex: number[];
  pageNumber: number;
  pageStart: number;
  pages: number;
  totalRow: number;
  sortsStatusFilterValue: any;
  sortsAllStatusFilterValue: any;
  sortProFilterValue: any;
  sortCompanyFilterValue: any;
  sortQuoterFilterValue: any;
  searchFilterValue: string;
  toggleQms: boolean;
  toggleCompanyName: boolean;
  toggleContactName: boolean;
  toggleProcess: boolean;
  toggleProbability: boolean;
  toggleStatus: boolean;
  toggleExpireDate: boolean;
  toggleQuoteName: boolean;
  togglequoter:boolean;
  isMyQoutsAvailable: boolean;
  isLoader: boolean;
  activeStatusFilterBtn: string;
  iQMSQuoteListFilterViewModel: IQMSQuoteListFilterViewModel;
  iQMSQuoteListViewModel: IQMSQuoteListViewModel[];
  quoterList:Quoter[];
  items: IQMSQuoteListViewModel[];
  filteredItems: IQMSQuoteListViewModel[];
  reverse: boolean;
  qmsAllStatus: IQMSStatus[];
  emailAllStatus: QMSEmailStatus[];
  probabilityAll: QMSProbabilityStatus[];
  contactCompanyList: any[];
  isEmilPdfPreview: boolean;
  quoteId: number;
  mqsContactIdEncrypt: string;
  mqsQuoteId: number;
  customerMsgModel: any;
  userDetails: any;
  isDownload: number;
  qmsActivityStatusModel: QMSActivityStatusModel;
  constructor(private _qmsService: QmsService, private _masterService: MasterService,
    private confirmationService: ConfirmationService, private _rfqService: RfqService, private _ProfileService: ProfileService,
    private _toastr: ToastrService, private router: Router) {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isCompanyDrawer');
    this._qmsService.set(false, 'isQuoteReviewDrawer');
    this.qmsAllStatus = [];
    this.emailAllStatus = [];
    this.probabilityAll = [];
    this.contactCompanyList = [];
    this.isEmilPdfPreview = false;
    this.mqsContactIdEncrypt = '';
    this.mqsQuoteId = 0;
    this.activeStatusFilterBtn = 'all';
  }

  ngOnInit() {
    this.pageSize = 24;
    this.currentIndex = 1;
    this.pageNumber = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.totalRow = 0;
    this.sortCompanyFilterValue = 0;
    this.sortQuoterFilterValue=0;
    this.sortProFilterValue = 0;
    this.sortsAllStatusFilterValue = 1;
    this.sortsStatusFilterValue = 0;
    this.searchFilterValue = '';
    this.toggleQms = false;
    this.toggleCompanyName = false;
    this.toggleContactName = false;
    this.toggleExpireDate = false;
    this.toggleQuoteName = false;
    this.toggleProbability = false;
    this.toggleProcess = false;
    this.toggleStatus = false;
    this.togglequoter=false;
    this.isLoader = true;
    this.isMyQoutsAvailable = true;
    this.reverse = true;
    this.qmsActivityStatusModel = {
      "qmsQuoteId": 0,
      "qmsQuoteActivityid": 0,
      "supplierId": this.loggedId
    }
    this.userDetails = JSON.parse(localStorage.getItem('iContactViewModel'));
    this.initModel();
    this.getQMSQuoteList();
    this.emailStatus();
    this.probabilityStatus();
    this.qouteStatus();
    this.getQuoterList();
    this.getMQSContactsList();
  }

  initModel() {
    this.iQMSQuoteListFilterViewModel = {
      qmsSupplierId: 0,
      qmsType: this.QmsType,
      maxPageSize: 24,
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      filterBy: '',
      filterCompany: 0,
      filterProbability: 0,
      filterStatus: 0,
      filterQuoter:0
    }

  }


  getConcateValue(data) {
    return "<strong>" + data.companyname + "</strong>" + "-" + data.firstname + "  " + data.lastname;
  }
  qouteStatus() {
    this._masterService.GetQMSStatus('QUOTE_STATUS').subscribe(res => {
      if (res['result'] === true) {
        this.qmsAllStatus = res['data'];
      } else {
        this.qmsAllStatus = [];
      }

    })
  }

  emailStatus() {
    this._qmsService.GetQMSQuoteStatus(this.loggedCompanyId,this.loggedId).subscribe(res => {
      if (res['isError'] === false) {
        this.emailAllStatus = res['data'].data;
      } else {
        this.emailAllStatus = [];
      }
    })
  }

  probabilityStatus() {
    this._qmsService.GetQMSProbability(this.loggedCompanyId,this.loggedId).subscribe(res => {
      if (res['isError'] === false) {
        this.probabilityAll = res['data'].data;
      } else {
        this.probabilityAll = [];
      }
    })
  }

  getMQSContactsList() {
    this._qmsService.GetQMSCustomer(this.loggedId).subscribe(result => {

      this.contactCompanyList = result['data'];
    })
  }
  getQuoterList() {
    if(this.QmsType === 8) {
      this._qmsService.getQuoterList(this.loggedCompanyId).subscribe(result => {

        this.quoterList = result['data'];
      })
    }

  }
  getQMSQuoteList() {
    this.reverse = this.iQMSQuoteListFilterViewModel.isOrderByDesc;
    this.items = [];
    this.isLoader = true;
    this.iQMSQuoteListFilterViewModel.qmsSupplierId = this.loggedId;;
    this._qmsService.getQMSQuoteList(this.iQMSQuoteListFilterViewModel).subscribe(result => {
      if (result['result'] === true) {
        this.iQMSQuoteListViewModel = result['data'];
        this.totalRow = result['totalRecords'];
        this.items = result['data'];
        window.scrollTo(0, 0);
        if (this.iQMSQuoteListViewModel.length !== 0) {
          this.isLoader = false;
          this.isMyQoutsAvailable = true;
        } else {
          this.totalRow = 0;
          this.isLoader = false;
          this.isMyQoutsAvailable = false;
          this.items = [];
        }
        this.init();
      } else {
        this.isLoader = false;
        this.isMyQoutsAvailable = false;
        this.items = [];
      }
    }, error => {
      this.isLoader = false;
      this.isMyQoutsAvailable = false;
      this.items = [];
    });
  }
  filterAll() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isCompanyDrawer');
    this._qmsService.set(false, 'isQuoteReviewDrawer');
    if (this.searchFilterValue) {
      this.iQMSQuoteListFilterViewModel.searchText = this.searchFilterValue;
    } else {
      this.iQMSQuoteListFilterViewModel.searchText = '';
    }
    if (this.sortsStatusFilterValue != 0) {
      this.iQMSQuoteListFilterViewModel.filterStatus = this.sortsStatusFilterValue;
    } else {
      this.iQMSQuoteListFilterViewModel.filterStatus = 0;
    }

    if (this.sortProFilterValue != 0) {
      this.iQMSQuoteListFilterViewModel.filterProbability = this.sortProFilterValue;
    } else {
      this.iQMSQuoteListFilterViewModel.filterProbability = 0;
    }

    if (this.sortCompanyFilterValue != 0) {
      this.iQMSQuoteListFilterViewModel.filterCompany = this.sortCompanyFilterValue;
    } else {
      this.iQMSQuoteListFilterViewModel.filterCompany = 0;
    }
    if (this.sortQuoterFilterValue != 0) {
      this.iQMSQuoteListFilterViewModel.filterQuoter = this.sortQuoterFilterValue;
    } else {
      this.iQMSQuoteListFilterViewModel.filterQuoter = 0;
    }

    //  this.iQMSQuoteListFilterViewModel.qmsType = this.sortsAllStatusFilterValue;
    if (this.activeStatusFilterBtn === 'all' && (this.QmsType == 1 || this.QmsType == 8)) {
      this.iQMSQuoteListFilterViewModel.qmsType = this.sortsAllStatusFilterValue;
    } else if (this.activeStatusFilterBtn === 'archived' && this.QmsType == 1) {
      this.iQMSQuoteListFilterViewModel.qmsType = 7;
    } else if (this.activeStatusFilterBtn === 'archived' && this.QmsType == 8) {
      this.iQMSQuoteListFilterViewModel.qmsType = 9;
    }else {
      this.iQMSQuoteListFilterViewModel.qmsType = this.QmsType;
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.iQMSQuoteListFilterViewModel.pageNumber = 1;
    this.iQMSQuoteListFilterViewModel.pageSize = this.pageSize;
    this.getQMSQuoteList();
  }

  toggleColumn(tab) {
    switch (tab) {

      case 'quote_id': {
        if (this.toggleQms) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'quote_id';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'quote_id';
        }
        this.toggleQms = !this.toggleQms;
        break;
      }
      case 'quoteName': {
        if (this.toggleQuoteName) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'qms_quote_name ';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'qms_quote_name ';
        }
        this.toggleQuoteName = !this.toggleQuoteName;
        break;
      }
      case 'Date': {
        if (this.toggleExpireDate) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'Date';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'Date';
        }
        this.toggleExpireDate = !this.toggleExpireDate;
        break;
      }
      case 'company': {
        if (this.toggleCompanyName) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'company';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'company';
        }
        this.toggleCompanyName = !this.toggleCompanyName;
        break;
      }
      case 'contact': {
        if (this.toggleContactName) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'contact';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'contact';
        }
        this.toggleContactName = !this.toggleContactName;
        break;
      }

      case 'process': {
        if (this.toggleProcess) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'process';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'process';
        }
        this.toggleProcess = !this.toggleProcess;
        break;
      }

      case 'quote_status': {
        if (this.toggleStatus) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'quote_status';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'quote_status';
        }
        this.toggleStatus = !this.toggleStatus;
        break;
      }

      case 'probalility': {
        if (this.toggleProbability) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'probalility';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'probalility';
        }
        this.toggleProbability = !this.toggleProbability;
        break;
      }

      case 'quoteName': {
        if (this.togglequoter) {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = false;
          this.iQMSQuoteListFilterViewModel.orderBy = 'quoter';
        } else {
          this.iQMSQuoteListFilterViewModel.isOrderByDesc = true;
          this.iQMSQuoteListFilterViewModel.orderBy = 'quoter';
        }
        this.togglequoter = !this.togglequoter;
        break;
      }
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.iQMSQuoteListFilterViewModel.pageNumber = 1;
    this.getQMSQuoteList();
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
    if (this.searchFilterValue !== '') {
      this.searchFilterValue = '';
    }
    this.filterAll();
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
    this.iQMSQuoteListFilterViewModel.pageNumber = this.currentIndex;
    this.getQMSQuoteList();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iQMSQuoteListFilterViewModel.pageNumber = this.currentIndex;
    this.getQMSQuoteList();
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.iQMSQuoteListFilterViewModel.pageNumber = this.currentIndex;
    this.getQMSQuoteList();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }

  isSidePanel() {
    return this._qmsService.get('showSidePanel');
  }

  isCompanyDrawer() {
    return this._qmsService.get('isCompanyDrawer');
  }
  isQuoteReviewDrawer() {
    return this._qmsService.get('isQuoteReviewDrawer');
  }

  openQuoteReviewDrawer(quoteId, event) {
    event.stopPropagation();
    this.mqsQuoteId = quoteId;
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isCompanyDrawer');
    this._qmsService.set(false, 'isDraftPage');
    if (this.iQMSQuoteListFilterViewModel.qmsType == 4 || this.activeStatusFilterBtn === 'archived') {
      this._qmsService.set(true, 'disableProbability');
    } else {
      this._qmsService.set(false, 'disableProbability');
    }
    setTimeout(() => {
      this._qmsService.set(false, 'isCompanyDrawer');
      this._qmsService.set(true, 'showSidePanel');
      this._qmsService.set(true, 'isQuoteReviewDrawer');
    }, 100);

  }

  openCompanyDrawer(qmsCompanyIdEncrypt, event) {
    event.stopPropagation();
    this.mqsContactIdEncrypt = qmsCompanyIdEncrypt;
    this._qmsService.set(false, 'isQuoteReviewDrawer');
    this._qmsService.set(true, 'showSidePanel');
    setTimeout(() => {
      this._qmsService.set(true, 'showSidePanel');
      this._qmsService.set(true, 'isCompanyDrawer');
    }, 100);

  }

  callPdf(quoteId) {
    this.quoteId = quoteId;
    this.isDownload = 1;
    this.isLoader = true;
    this.isEmilPdfPreview = true;

  }
  isPdfDownload() {
    if (localStorage.getItem('isPdfDownload') === 'false') {
      localStorage.removeItem('isPdfDownload');
      this.isEmilPdfPreview = false;
      this.isLoader = false;
      this.getQMSQuoteList();
    }
  }

  DeleteQMS(qmsId) {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this QMS?',
      header: 'Delete QMS',
      icon: null,
      accept: () => {
        this._qmsService.DeleteQMSQuote(qmsId).subscribe(
          result => {
            if (result['result'] === true) {
              this._toastr.success(result.errorMessage, '');
              this.filterAll();
            } else {
              this._toastr.error(result.errorMessage, 'Error!');
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
  openEditQms(qmsQuoteId) {
    localStorage.setItem('qmsQuoteId', qmsQuoteId);
    localStorage.setItem('qmspage', 'myQms');
    this.router.navigate(['/qms/createquotes']);
  }
  reloadPageOnQuotedrawerClose() {
    if (this._qmsService.get('quoteReviewDrawerClosed')) {
      this._qmsService.set(false, 'quoteReviewDrawerClosed');
      this.getQMSQuoteList();
    }
  }
  openQMSDetailsPage(qmsQuoteId, qmsId, event) {
    event.stopPropagation();
    // localStorage.setItem( 'qmsQuote' , qmsQuoteId);
    localStorage.setItem('qmsId', qmsId);
    this._qmsService.set(qmsId, 'qmsId');
    // let qmsQuoteEncypt = this._ProfileService.encrypt(qmsQuoteId);
    // console.log('encypt', qmsQuoteEncypt);
    this.router.navigate(['/qms/qmsdetail', qmsQuoteId]);
  }
  setStatusFilter(btnStatus) {
    this.activeStatusFilterBtn = btnStatus;
    this.sortsAllStatusFilterValue = '1';
    this.filterAll();
  }
  getMsgDrawerFlag($event) {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
  }
  isMessageDrawer() {
    return this._qmsService.get('isMessageDrawer');
  }
  /* This function is used to mail the manufacturer */
  callSelfEmailPdf(qmsQuoteId, quoteId, quoteName) {
    // // debugger;
    const receiverName = this.userDetails.firstName + this.userDetails.lastName;
    const isCustomer = false;
    this.isEmilPdfPreview = true;
    this.quoteId = qmsQuoteId;
    this.isLoader = true;
    this.isDownload = 2;
    this.sendEmailPdf(this.userDetails.emailId, receiverName, isCustomer, qmsQuoteId, quoteId, quoteName);
  }
  /* This function is used to mail the customer */
  callCustomerEmailPdf(emailId, receiverName, qmsQuoteId, quoteId, quoteName) {
    const isCustomer = true;
    this.isEmilPdfPreview = true;
    this.quoteId = qmsQuoteId;
    this.isLoader = true;
    this.isDownload = 2;
    this.sendEmailPdf(emailId, receiverName, isCustomer, qmsQuoteId, quoteId, quoteName);
  }
  sendEmailPdf(emailId, receiverName, isCustomer, qmsQuoteId, quoteId, quoteName) {

    setTimeout(() => {
      const pdfData = document.getElementById('contentToConvert').innerHTML;
      const pdfContent = pdfData.substring(1, pdfData.length - 1);
      this.customerMsgModel = {
        qmsQuoteId: qmsQuoteId,
        quoteId: quoteId,
        qmsQuoteName: quoteName,
        supplierContactId: this.userDetails.contactId,
        supplierCompanyId: this.userDetails.companyId,
        qmsContactId: 0,
        replyToEmailId: this.userDetails.emailId,
        quotePdfHtml: pdfContent,
        toEmailId: emailId,
        receiverName: receiverName,
        isCustomer: isCustomer
      }
      this.isEmilPdfPreview = false;
      this._qmsService.set(true, 'showSidePanel');
      this._qmsService.set(true, 'isMessageDrawer');
      this.isLoader = false;
    }, 3000);

  }
}
