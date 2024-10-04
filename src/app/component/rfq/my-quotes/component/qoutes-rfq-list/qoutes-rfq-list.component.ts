import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  ToastrService
} from 'ngx-toastr';
import {
  IQuantityUnit
} from '../../../../../core/models/globalMaster';
import {
  AwardingModelQuoteDetailsRequestViewModel,
  BuyerMyQuotesRequestViewModel,
  BuyerMyQuotesResponseViewModel,
  DownloadAllFilesViewModel,
  IFeedbackBuyerViewModel,
  IFeedbackSaveViewModel,
  IRFQPartQuantityQuote,
  IRFQPartQuantityQuoteContainer,
  ITerritoryClassificationModel,
  LocalAwardedManufractureList,
  LocalAwardedPartsQuantityList,
  NPartArray
} from '../../../../../core/models/rfqModel';
import {
  MasterService
} from '../../../../../core/services/master/master.service';
import { ProfileService } from '../../../../../core/services/profile/profile.service';
import { ProductAnalyticService } from '../../../../../shared/product-analytic/product-analytic';
import {
  RfqService
} from './../../../../../core/services/rfq/rfq.service';
declare var window;
@Component({
  selector: 'app-qoutes-rfq-list',
  templateUrl: './qoutes-rfq-list.component.html',
  styleUrls: ['./qoutes-rfq-list.component.scss']
})
export class QoutesRfqListComponent implements OnInit, OnDestroy {

  @Input('rfqId') rfqId: number;
  isGridView: boolean;
  searchFilterValue: string;
  allStatusFilterValue: string;
  cloneRfqName: string;
  sortFilterValue: string;
  allLocationFilterValue: string;
  isLoader: boolean;
  isLoader2: boolean;
  isRfqAvailable: boolean;
  totalRfq: number;
  activeStatusFilterBtn: string;
  isCreateRFQBodyBtnDisabled: boolean;
  isRFQInProgBodyBtnDisabled: boolean;
  toggleNoRFQBodyBtn = true;
  toggle1: boolean;
  toggle2: boolean;
  toggle3: boolean;
  toggle4: boolean;
  toggle5: boolean;
  toggle6: boolean;
  toggle7: boolean;
  // Variable Declarations Ends
  iBuyerQuotesListColl: BuyerMyQuotesResponseViewModel[];
  items: BuyerMyQuotesResponseViewModel[];
  iBuyerQuotesViewModel: BuyerMyQuotesRequestViewModel;
  iLocationColl: ITerritoryClassificationModel[] = [];
  feedbackQuantity: IFeedbackBuyerViewModel[];
  /* pagination variables start */
  pages = 3;
  pageSize = 24;
  pageNumber = 0;
  currentIndex = 1;
  pageStart = 1;
  inputLength = 24;
  totalRow: number;
  pagesIndex: Array < number > ;
  currentOpenQuoteId: number;
  currentOpenQuoteisRfqResubmitted: boolean;
  currentOpenContactId: number;
  isRecAvailable: boolean;
  message: string;
  messageAttachment: string[];
  iRFQPartQuantityQuoteColl: IRFQPartQuantityQuote[];
  isLoader1: boolean;
  highestQtyPresent: number;
  iRFQPartQuantityQuoteContainerColl: IRFQPartQuantityQuoteContainer[];
  Downloadallfiles: DownloadAllFilesViewModel;
  temp: string[];
  NPartArrayColl: NPartArray[];
  isAward: boolean;
  isAwardDone: boolean;
  quoteReferenceNumber: any;
  iQuantityUnitColl: IQuantityUnit[] = [];
  supplierPaymentTerm: string = '';
  checkedAll:boolean=false;
  /* pagination variables end */
  id: any;
  name: any;
  showAwardAllPopup: boolean = false;
  singleAwardModal: boolean = false;
  partId: any;
  manId: any;
  
  constructor(private _rfqService: RfqService, private _toastr: ToastrService, private router: Router,
    private _masterService: MasterService, private _ProfileService: ProfileService,private productAnalyticService:ProductAnalyticService) {
    this.allStatusFilterValue = '0';
    this.sortFilterValue = 'Recent';
    this.allLocationFilterValue = '0';
    this.activeStatusFilterBtn = 'All';
    this.isLoader2 = false;
    this.iBuyerQuotesListColl = [];
    this.toggle1 = false;
    this.toggle2 = false;
    this.toggle3 = false;
    this.toggle4 = false;
    this.toggle5 = false;
    this.toggle6 = false;
    this.toggle7 = false;
    this.iBuyerQuotesViewModel = new BuyerMyQuotesRequestViewModel();
    this.currentOpenQuoteId = 0;
    this.currentOpenQuoteisRfqResubmitted = false;
    this.currentOpenContactId = 0;
    this.isRecAvailable = false;
    this.message = '';
    this.messageAttachment = [];
    this.iRFQPartQuantityQuoteColl = [];
    this.isLoader1 = false;
    this.iLocationColl = [];
    this.highestQtyPresent = 1;
    this.iRFQPartQuantityQuoteContainerColl = [];
    this.temp = [];
    this.feedbackQuantity = [];
  }

  ngOnInit() {
    this._rfqService.stringSubject.subscribe(
      data => 
      {
        this.getBuyerQuotingList();
      }
    );
  
    this.isAward = false;
    this.NPartArrayColl = [];
    this.LocalAwardedManufractureListColl = [];
    this.isAwardDone = false;
    this.selectedFeedback();
    this.getBuyerQuotingList();
    this.getLocation();
    if (this.isRfqAvailable) {
      this.init();
    }
    this.getQuantity();
  }


  getLocation() {
    if (this.iLocationColl.length == 0) {
      this._masterService.GetTerritoryClassification().subscribe(
        (data2: ITerritoryClassificationModel[]) => {
          if (data2) {
            let index = data2.findIndex(x => x.territoryClassificationId == 0);
            data2.splice(index, 1);
            this.iLocationColl = data2;
          }
        },
        error => () => {
          this._rfqService.handleError(error);
        },
        () => {}
      );
    }


  }
  get currentRfqId() {
    return parseInt(localStorage.getItem('detailRfqId'));
  }
  get LoggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  getBuyerQuotingList() {
    this.isLoader2 = true;
    this.iBuyerQuotesListColl = [];
    this.iBuyerQuotesViewModel.buyerContactId = this.LoggedId
    this._rfqService.GetBuyerMyQuotingList(this.iBuyerQuotesViewModel).subscribe(
      result => {
        if (result['isError'] === false) {
          this.iBuyerQuotesListColl = result['data'];
          this.totalRow = result['totalRecords'];
          this.triggerPendo();
          window.scrollTo(0, 0);
          if (this.iBuyerQuotesListColl.length !== 0) {
            this.totalRfq = this.iBuyerQuotesListColl.length;
            this.isRfqAvailable = false;
            this.isLoader2 = false;
            this.isLoader = false;
            this.checkedAll=false;
            for (let i = 0; i < this.iBuyerQuotesListColl.length; i++) {
              let iRFQPartQuantityQuoteContainer: IRFQPartQuantityQuoteContainer;
              iRFQPartQuantityQuoteContainer = {
                iRFQPartQuantityQuoteColl: [],
                index: 0
              };
              this.iRFQPartQuantityQuoteContainerColl.push(iRFQPartQuantityQuoteContainer);
              if (!!this.iBuyerQuotesListColl[i].qty2 && this.highestQtyPresent < 2) {
                  this.highestQtyPresent = 2;            
              }
              if (!!this.iBuyerQuotesListColl[i].qty3 && this.highestQtyPresent < 3) {
                  this.highestQtyPresent = 3;
              }
            }
          } else {
            this.checkedAll=false;
            window.scrollTo(0, 0);
            this.totalRfq = this.iBuyerQuotesListColl.length;
            this.isLoader = false;
            this.isLoader2 = false;
            this.isRfqAvailable = true;
          }
          this.init();
        } else {
          this.checkedAll=false;
          window.scrollTo(0, 0);
          this.totalRfq = 0;
          this.isLoader = false;
          this.isRfqAvailable = true;
          this.isLoader2 = false;
          this.totalRow = 0;
        }

      },
      error => {
        window.scrollTo(0, 0);
        this.isLoader = false;
        this.isLoader2 = false;
        this.isRfqAvailable = true;
        this.iBuyerQuotesListColl = [];
        this.totalRow = 0;
        this.checkedAll=false;
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  detailRfq(id) {
    this.redirectRfqDetail(id);
  }
  detailRfqquote(id) {
    localStorage.setItem('quotesTab', 'true');
    this.redirectRfqDetail(id);
  }
  redirectRfqDetail(id){
    const encryptedRfqID = this._ProfileService.encrypt(id);
    this.router.navigate(['/rfq/rfqdetail'], {
      queryParams: {
        rfqId: encryptedRfqID,
        quotes:"Quotes"
      }
    });
  }
  openSidePanel(contactId, contactName, companyName, rfqId, index) {
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(rfqId + '_' + index, 'rfqId');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(contactName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 500);
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName, index) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
    } else {
      event.stopPropagation();
      this._rfqService.set(messageRFQId + '_' + index, 'rfqId');
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'messageRfq');
      this._rfqService.set(false, 'supplierProfileDrawer');
      this._rfqService.set(false, 'rfqDetailDrawer');
      this._rfqService.set(contactId, 'selectContactIdsForMEessage');
      this._rfqService.set(messageRFQId, 'selectContactRFQId');
      this._rfqService.set(fromContName, 'nameOfBuyer');
    }

  }
  openPartDetails(id) {
    localStorage.setItem('isDraftPage', 'false');
    this._rfqService.set(id, 'rfqId');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'rfqDetailDrawer');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageRfq');
    setTimeout(() => {
      const elmnt = document.getElementById(id);
      elmnt.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      });
    }, 1000);
  }
  sortMessage(tab) {
    this.isLoader2 = true;
    switch (tab) {
      case 'Qty1': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle2 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'Qty1';
        this.toggle2 = !this.toggle2;
        break;
      }

      case 'Qty2': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle3 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'Qty2';
        this.toggle3 = !this.toggle3;
        break;
      }

      case 'Qty3': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle4 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'Qty3';
        this.toggle4 = !this.toggle4;
        break;
      }

      case 'Date': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle1 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'QuoteDate';
        this.toggle1 = !this.toggle1;
        break;
      }

      case 'Status': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle5 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'Status';
        this.toggle5 = !this.toggle5;
        break;
      }

      case 'Location': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle6 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'Location';
        this.toggle6 = !this.toggle6;
        break;
      }


      case 'Manufacturer': {
        this.iBuyerQuotesViewModel.isOrderByDesc=this.toggle7 ? false : true;
        this.iBuyerQuotesViewModel.orderBy = 'Manufacturer';
        this.toggle7 = !this.toggle7;
        break;
      }

    }
    this.currentIndex = 1;
    this.pages = 4;
    this.iBuyerQuotesViewModel.rfqId = 0;
    this.iBuyerQuotesViewModel.buyerContactId = this.LoggedId;
    this.iBuyerQuotesViewModel.pageSize = this.pageSize;
    this.iBuyerQuotesViewModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.getBuyerQuotingList();
  }
  // Pagination starts
  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.iBuyerQuotesViewModel.pageNumber = this.currentIndex;
    this.getBuyerQuotingList();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.iBuyerQuotesViewModel.pageNumber = this.currentIndex;
    this.getBuyerQuotingList();
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
    this.iBuyerQuotesViewModel.pageNumber = this.currentIndex;
    this.getBuyerQuotingList();
  }

  refreshItems() {
    this.items = this.iBuyerQuotesListColl.slice((this.currentIndex - 1) * this.pageSize, (this.currentIndex) * this.pageSize);
    this.pagesIndex = this.fillArray();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }
  // Pagination ends
  isSidePanel() {
    return this._rfqService.get('showSidePanel');
  }
  ngOnDestroy() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'rfqDetailDrawer');
  }
  setStatusFilter(status) {
    this.activeStatusFilterBtn = status;
    this.allStatusFilterValue = '0';
    this.sortFilterValue = 'Recent';
    this.allLocationFilterValue = '0';
    switch (status) {
      case 'All': {
        this.iBuyerQuotesViewModel.tabId = 1;
        break;
      }
      case 'NotReviewed': {
        this.iBuyerQuotesViewModel.tabId = 2;
        break;
      }
      case 'Reviewed': {
        this.iBuyerQuotesViewModel.tabId = 3;
        break;
      }
      case 'Declined': {
        this.iBuyerQuotesViewModel.tabId = 4;
        break;
      }
      case 'Archive': {
        this.iBuyerQuotesViewModel.tabId = 5;
        break;
      }
    }
    this.filterAll();
  }


  filterAll() {
    this.iBuyerQuotesViewModel.territoryId = Number(this.allLocationFilterValue);
    this.iBuyerQuotesViewModel.statusId = Number(this.allStatusFilterValue);
    this.iBuyerQuotesViewModel.isOrderByDesc=this.sortFilterValue === 'Recent' ? true : false;
    this.iBuyerQuotesViewModel.orderBy = 'QuoteDate';
    this.iBuyerQuotesViewModel.searchText = this.searchFilterValue;
    this.currentIndex = 1;
    this.pages = 4;
    this.iBuyerQuotesViewModel.rfqId = 0;
    this.iBuyerQuotesViewModel.buyerContactId = this.LoggedId;
    this.iBuyerQuotesViewModel.pageSize = this.pageSize;
    this.iBuyerQuotesViewModel.pageNumber = 1;
    this.currentIndex = 1;
    this.pageStart = 1;
    this.isLoader = true;
    this.getBuyerQuotingList();
  }

  expandQuotes(rfqId, contactId, indexNo, isRfqResubmitted, companyId, leadType, isOpen) {
    this.rfqId = rfqId;
    this.currentOpenQuoteisRfqResubmitted = isRfqResubmitted;
    let iRFQPartQuantityQuote1: IRFQPartQuantityQuote;
    iRFQPartQuantityQuote1 = {
      'rfqQuoteItemsId': 0,
      'rfqQuoteSupplierQuoteId': 0,
      'rfqPartId': 0,
      'perUnitPrice': 0,
      'rfqPartIdString': '',
      'toolingAmount': 0,
      'miscellaneousAmount': 0,
      'isRfqResubmitted': isRfqResubmitted,
      'shippingAmount': 0,
      'rfqQuoteItemList': [],
      'rfqPartQuantityId': 0,
      'isAlreadyAwrded': false,
      'isAwrded': false,
      'awardedQty': 0,
      'awardedDate': '2018-11-29T06:09:50.622Z',
      'isAwardAccepted': true,
      'awardAcceptedOrDeclineDate': '2018-11-29T06:09:50.622Z',
      'partId': 0,
      'partName': '',
      'partNumber': '',
      'rfqId': rfqId,
      'quantityLevel': 0,
      'contactId': 0,
      'contactIdList': [contactId],
      'errorMessage': '',
      'result': false,
      'awardedQtyUnit': '',
      'isDeclineAll': false,
      'buyerFeedbackId': '',
      estLeadTimeValueRange: null,
      estLeadTimeRange: null,
      estLeadTimeValue: null
    };
    this.iBuyerQuotesListColl[indexNo].isShow = !this.iBuyerQuotesListColl[indexNo].isShow;
    this.iBuyerQuotesListColl.forEach((element, index) => {
      if (indexNo != index) {
        this.iBuyerQuotesListColl[index].isShow = false;
      }
    })
    this.currentOpenQuoteId = rfqId;
    this.currentOpenContactId = contactId;
    this.isLoader1 = true;
    this._rfqService.GetRFQPartQuantityQuoteBYRfqId(iRFQPartQuantityQuote1).subscribe(
      result => {
        this.isLoader1 = false;
        this.quoteReferenceNumber = 0;
        if (result.result === true) {
          this.isRecAvailable = false;
          this.message = result.messageDesc;
          this.quoteReferenceNumber = result.quoteReferenceNumber;
          this.supplierPaymentTerm = result.supplierPaymentTerms;
          this.messageAttachment = result.attachmentFileName;
          this.iRFQPartQuantityQuoteColl = [];
          this.iRFQPartQuantityQuoteColl = result['data'];
          this.iRFQPartQuantityQuoteColl[0].result = true;
          const Data = this.iRFQPartQuantityQuoteColl;
          this.iRFQPartQuantityQuoteColl = [];
          this.iRFQPartQuantityQuoteColl = Data.filter(m => m.rfqQuoteItemsId !== 0);
          this.isLoader1 = false;
          let miscellaneousAmount = 0;
          let toolingAmount = 0;
          let shippingAmount = 0;
          let perUnitPrice = 0;
          this.iRFQPartQuantityQuoteColl.forEach(x => miscellaneousAmount += x.miscellaneousAmount);
          this.iRFQPartQuantityQuoteColl.forEach(x => toolingAmount += x.toolingAmount);
          this.iRFQPartQuantityQuoteColl.forEach(x => shippingAmount += x.shippingAmount);
          this.iRFQPartQuantityQuoteColl.forEach(x => perUnitPrice += x.perUnitPrice * x.awardedQty);

          if (!this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId) {
            this.iRFQPartQuantityQuoteColl[0].buyerFeedbackId = '';
          }
        } else {
          this.isRecAvailable = true;
          this.iRFQPartQuantityQuoteColl = [];
        }
      },
      error => {
        this.isLoader1 = false;
        this._rfqService.handleError(error);
      },
      () => {
        if (this.iBuyerQuotesListColl[indexNo].isReviewedByBuyer !== true) {
          this.isLoader1 = true;
          this._rfqService.SetRFQQuoteReviewedStatus(rfqId, contactId, isRfqResubmitted).subscribe(
            result => {
              this.isLoader1 = false;
              if (result.result === true) {
                this.isLoader1 = false;
                this.iBuyerQuotesListColl[indexNo].isReviewedByBuyer = true;
              } else {
                this._toastr.error(result.errorMessage, '');
              }
            },
            error => {
              this.isLoader1 = false;
              this._rfqService.handleError(error);
            },
            () => {}
          );
        }
      }
    );
    ;
  }
  getpartName(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partName;
  }
  getpartNumber(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partNumber;
  }
  getpartId(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.partId;
  }
  getQuantityUnit(key, quantity) {
    if (this.activeStatusFilterBtn === 'Awarded') {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
      if (data !== undefined) {
        if (data.isAwrded) {
          return data.awardedQty + ' ' + data.awardedQtyUnit;
        } else {
          return '';
        }
      } else {
        return '';
      }

    } else {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
      if (data !== undefined) {
        return data.awardedQty + ' ' + data.awardedQtyUnit;
      } else {
        return 'N/A';
      }
    }
  }
  setPartCollapseStatus(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    data.result = !data.result;
  }
  getPartCollapseStatus(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    return data.result;
  }
  getShippingAmount(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.shippingAmount;
    } else {
      return 0;
    }

  }
  getShippingAmountTotal(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }

  }
  getToolingAmount(key, quantity) {

    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.toolingAmount;
    } else {
      return 0;
    }

  }
  getMisleniousAmount(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.miscellaneousAmount;
    } else {
      return 0;
    }

  }
  getQuantityPerPrice(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice;
    } else {
      return 0;
    }

  }
  getLeadTime(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.estLeadTimeValueRange;
    } else {
      return '';
    }
  }
  getQuantity1Total(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice * data.awardedQty + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }
  }
  getQuantity2Total(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice * data.awardedQty + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }
  }
  getQuantity3Total(key, quantity) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key && m.quantityLevel === quantity);
    if (data !== undefined) {
      return data.perUnitPrice * data.awardedQty + data.shippingAmount + data.toolingAmount + data.miscellaneousAmount;
    } else {
      return 0;
    }
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
    if (event.keyCode === 13) {
      this.filterAll();
    }
  }
  checkSearch(val) {
    if (!val) {
      this.filterAll();
    }
  }
  downloadAllFiles(fileCompArray: string[], rfqId) {
    this.Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0

    };
    this.temp = [];
    let data = JSON.stringify(fileCompArray);
    this.temp = JSON.parse(data);
    this.Downloadallfiles.filename = this.temp;
    this.Downloadallfiles.rfQ_Id = rfqId;

    this._rfqService.getDownloadAllFileURL(this.Downloadallfiles).subscribe(response => {
      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;

          link.setAttribute('target', '_blank');
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }

      }
    }, error => {

    })
  }
  downloadS3File(fileName: string, isDownload: boolean) {
    this._rfqService.getS3FileDownload(fileName).subscribe(response => {
      if (response.result && response.result.result && response.result.result === true) {
        const resData = response.result;
        const filelink = resData.fileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
           window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;
          link.setAttribute('target', '_blank');

          if (link.download !== undefined && isDownload) {
            // Set HTML5 download attribute. This will prevent file from opening if supported.
            fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
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
  isModelShow() {
    return this._rfqService.get('isModelShow');
  }

  //feedback
  selectedFeedback() {
    this._rfqService.getQuoteFeedbackBuyer().subscribe((result: any) => {
      this.feedbackQuantity = result.data;
    });
  }

  OnsaveFeedback(id, contactId, supplierQuoteId, rfqId) {
    let iFeedbackSaveViewModel: IFeedbackSaveViewModel;
    iFeedbackSaveViewModel = {
      rfqQuoteSupplierquoteId: 0,
      buyerFeedbackId: 0,
      rfqId: rfqId,
      fromCont: this.LoggedId,
      toCont: contactId
    };
    iFeedbackSaveViewModel.rfqQuoteSupplierquoteId = supplierQuoteId;
    iFeedbackSaveViewModel.buyerFeedbackId = id;
    this._rfqService.SaveFeedbackBuyer(iFeedbackSaveViewModel).subscribe((result: any) => {
      if (!result.isError) {
        this._toastr.success('Feedback Submitted Successfully', 'Success!');
      }

    });
  }
  isAwardAllStatus(manId,rfqId) {
  const filterBuyer = this.iBuyerQuotesListColl.filter(m=>m.rfqStatusId === 6 && m.withOrderManagement === true && m.rfqId === rfqId && m.supplierId === manId) 
if(filterBuyer.length >0){
  return true;
}else{
  const currentPart = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.isAlreadyAwrded !== true);
  if (currentPart.length === 0) {
    return true;
  } else {
    return false;
  }
} 
  }
  getRfqPartAwardedStatus(key, statusId ? ) {
    let data;
    if (statusId == 6) {
      data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === true && m.rfqPartStatusId == statusId).length;
    } else {
      data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === true).length;
    }
    if (data === 0) {
      return false;
    } else {
      return true;
    }
  }

  getRfqPartNotAwardedStatus(key, statusId ? ) {
    let data;
    data = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartIdString === key && m.isAwrded === false && m.rfqPartStatusId == statusId && m.isContinueAwarding != true && m.isContinueAwarding != null).length;

    if (data === 0) {
      return false;
    } else {
      return true;
    }
  }

  getRfqPartAwardedStatusByOther(key,rfqId,manId) {
    const filterBuyer = this.iBuyerQuotesListColl.filter(m=>m.rfqStatusId === 6 && m.withOrderManagement === true && m.rfqId === rfqId && m.supplierId === manId) 
    if(filterBuyer.length >0){
      return true;
    } else{

      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
      if (data.isAlreadyAwrded) {
        return data.isAlreadyAwrded;
      } else {
        return false;
      }
    }
  }
  openAwardModel(isAll, supplierId, rfqId, key, supplierName) {

    const filterBuyer = this.iBuyerQuotesListColl.filter(m=> m.withOrderManagement === true && m.rfqId === rfqId && m.supplierId === supplierId) 
    if(filterBuyer.length >0){
      this.singleAwardModal = true;
      this.isAward = false;
    }
    else{
      this.singleAwardModal = false;
      this.isAward = true;
    }
    this.manId = supplierId;
    this.partId = key;   
    this.makeManufactureSelection(0, supplierId, rfqId, key, supplierName, 1);
  }
  get loggedId() {
    return parseInt(localStorage.getItem('LoggedId'));
  }
  removeSelectedAward(index) {
    if (index != null) {
      if (this.NPartArrayColl[index].rfqQuoteItemsId != null && this.NPartArrayColl[index].rfqQuoteItemsId != undefined) {
        this._rfqService.removeSelectedAward(this.NPartArrayColl[index].rfqQuoteItemsId).subscribe(response => {
          console.log(response);
        });
      }

      this.NPartArrayColl.splice(index, 1);
    }
  }
  supplierList: any = [];
  isCsvLoader = false;
  NPartQuantity: LocalAwardedPartsQuantityList;
  NPartQuantityColl: LocalAwardedPartsQuantityList[];
  partsRequestViewModel: AwardingModelQuoteDetailsRequestViewModel;
  LocalAwardedManufractureListColl: LocalAwardedManufractureList[];
  awardRFQPartQuantityQuote: IRFQPartQuantityQuote;
  NPartArray: NPartArray;
  initPartsModel() {
    this.partsRequestViewModel = {
      rfqId: 0,
      rfqPartId: 0,
      contactIds: [],
      quantityLevel: 0,
      isRfqResubmitted: false
    }
  }
  initNPartQuantity() {
    this.NPartQuantity = {
      quantityDetails: '',
      rfqQuoteItemsId: 0
    };
  }
  initNPartArray() {
    this.NPartArray = {
      isAward: false,
      manId: 0,
      manName: '',
      npsScore: 0,
      partName: '',
      partNumber: '',
      quantityList: [],
      rfqPartId: 0,
      rfqQuoteItemsId: 0,
      noOfStars: 0,
      price: null,
      unit: null,
      isRfqStatus: null,
      supplierList: [],
      rfqId: 0
    };
  }
  initAwardModel() {
    this.awardRFQPartQuantityQuote = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      awardedQty: 0,
      rfqPartIdString: '',
      isAlreadyAwrded: false,
      contactId: 0,
      isRfqResubmitted: false,
      contactIdList: [],
      rfqQuoteItemList: [],
      errorMessage: '',
      isAwardAccepted: false,
      isAwrded: false,
      miscellaneousAmount: 0,
      partId: 0,
      partName: '',
      partNumber: '',
      perUnitPrice: 0,
      quantityLevel: 0,
      result: false,
      rfqId: 0,
      rfqPartId: 0,
      rfqPartQuantityId: 0,
      rfqQuoteItemsId: 0,
      rfqQuoteSupplierQuoteId: 0,
      shippingAmount: 0,
      toolingAmount: 0,
      awardedQtyUnit: '',
      isDeclineAll: false,
      buyerFeedbackId: '',
      estLeadTimeValueRange: null,
      estLeadTimeRange: null,
      estLeadTimeValue: null

    };
  }
  getSupplierList(rfqId, rfqPartId) {
    return new Promise((resolve, reject) => {
      this._rfqService.getSupplierList(rfqId, rfqPartId).subscribe(
        response => {
          if (!response.isError) {
            resolve(response.data);
          } else {
            reject([]);
          }
        }
      ), error => {
        reject([]);
      };
    })
  }
  makeManufactureSelection(index, selectedId, rfqId, rfqPartId, supplierName, reset) {
    this.rfqId = rfqId;
    this.isCsvLoader = true;
    if (selectedId != null && selectedId != 'null') {
      this.initPartsModel();
      this.initNPartArray();
      this.initNPartQuantity();
      this.getSupplierList(this.rfqId, rfqPartId).then(res => {

        this.NPartArray.supplierList = res;
        this.NPartArray.manId = parseInt(selectedId);
        this.NPartArray.manName = supplierName;
        this.NPartArray.rfqPartId = rfqPartId;
        this.NPartArray.rfqId = rfqId;
        this.partsRequestViewModel.rfqId = this.currentOpenQuoteId;
        this.partsRequestViewModel.contactIds[0] = selectedId;
        this.partsRequestViewModel.rfqPartId = rfqPartId;
        if (selectedId != 16 && selectedId != 17 && selectedId != 18 && selectedId != 20) {
          this._rfqService.getAwardingModelQuoteQuantityData(this.partsRequestViewModel).subscribe(
            response => {
              if (response.data !== null && response.data !== undefined && response.data.rfqQuoteItemList !== null && response.data.rfqQuoteItemList !== undefined) {
                if (reset === 1) {
                  this.NPartArrayColl = [];
                  this.NPartQuantityColl = [];
                  this.NPartArray.manId = parseInt(selectedId);
                  this.NPartArray.noOfStars = response.data.noOfStars;
                  this.NPartArray.partName = response.data.rfqQuoteItemList[0].partName;
                  this.NPartArray.partNumber = response.data.rfqQuoteItemList[0].partNumber;
                  response.data.rfqQuoteItemList.forEach(
                    x => {
                      this.NPartQuantity.quantityDetails = x.awardedQty + ' parts @ $' + (x.totalPrice).toFixed(4);
                      this.NPartQuantity.rfqQuoteItemsId = x.rfqQuoteItemsId;
                      this.NPartQuantityColl.push(this.NPartQuantity);
                      this.initNPartQuantity();
                    });
                  if (response.data.rfqQuoteItemList.length === 1) {
                    this.NPartArray.rfqQuoteItemsId = response.data.rfqQuoteItemList[0].rfqQuoteItemsId;
                  }
                  this.NPartArray.quantityList = this.NPartQuantityColl;
                  let checkDuplicate = this.NPartArrayColl.findIndex(x => x.rfqPartId == this.NPartArray.rfqPartId);
                  if (checkDuplicate == -1) {
                    this.NPartArrayColl.push(this.NPartArray);
                  }
                  this.initNPartArray();
                } else {
                  this.NPartQuantityColl = [];
                  if (response.data.rfqQuoteItemList.length > 0) {
                    this.NPartArrayColl[index].manId = parseInt(selectedId);
                    this.NPartArrayColl[index].manName = supplierName;
                    this.NPartArrayColl[index].noOfStars = response.data.noOfStars;
                    this.NPartArrayColl[index].partName = response.data.rfqQuoteItemList[0].partName;
                    this.NPartArrayColl[index].partNumber = response.data.rfqQuoteItemList[0].partNumber;
                    this.NPartArrayColl[index].unit = null;
                    this.NPartArrayColl[index].price = null;
                    this.NPartArrayColl[index].isRfqStatus = false;
                    response.data.rfqQuoteItemList.forEach(
                      x => {
                        this.NPartQuantity.quantityDetails = x.awardedQty + ' parts @ $' + (x.totalPrice).toFixed(4);
                        this.NPartQuantity.rfqQuoteItemsId = x.rfqQuoteItemsId;
                        this.NPartQuantityColl.push(this.NPartQuantity);
                        this.initNPartQuantity();
                      });
                    if (response.data.rfqQuoteItemList.length === 1) {
                      this.NPartArrayColl[index].rfqQuoteItemsId = response.data.rfqQuoteItemList[0].rfqQuoteItemsId;
                    }
                    this.NPartArrayColl[index].quantityList = null;
                    this.NPartArrayColl[index].quantityList = this.NPartQuantityColl;
                    this.initNPartArray();
                  } else {
                    this.NPartArrayColl[index].manId = parseInt(selectedId);
                    this.NPartArrayColl[index].manName = supplierName;
                    this.NPartArrayColl[index].quantityList = [];
                  }
                }
              }
              this.isCsvLoader = false;
            },
            error => {
              this.isCsvLoader = true;

            }
          );
        } else {
          this.NPartArrayColl[index].manId = parseInt(selectedId);
          this.NPartArrayColl[index].rfqQuoteItemsId = -99;
          this.NPartArrayColl[index].manName = supplierName;
          this.NPartArrayColl[index].quantityList = [];
          this.NPartArrayColl[index].noOfStars = 0;
          this.NPartArrayColl[index].unit = null;
          this.NPartArrayColl[index].price = null;
          if (selectedId == 18) {
            this.NPartArrayColl[index].unit = '0';
            this.NPartArrayColl[index].price = 0;
          }
          this.NPartArrayColl[index].isRfqStatus = true;
          this.NPartArrayColl[index].awardedUnitTypeId = 14;
          this.isCsvLoader = false;
        }
      });
    } else {
      this.isCsvLoader = false;
      this.NPartArrayColl[index].quantityList = [];
      this.NPartArrayColl[index].rfqQuoteItemsId = 0;
      this.NPartArrayColl[index].manId = null;
      this.NPartArrayColl[index].unit = null;
      this.NPartArrayColl[index].price = null;
      this.NPartArrayColl[index].isRfqStatus = true;
      this.NPartArrayColl[index].awardedUnitTypeId = 14;
    }
  }
  makeQuantitySelection(manId, selectRfqQuoteItemsId, rfqpartid) {
    const localData = this.NPartArrayColl.find(m => m.manId === manId && m.rfqPartId === rfqpartid);
    if (localData != undefined && selectRfqQuoteItemsId !== '0') {
      localData.rfqQuoteItemsId = selectRfqQuoteItemsId;
    } else {
      localData.rfqQuoteItemsId = 0;
    }

  }
  hidePopup() {
    this.isAward = false;
  }
  awardAll(manId, manName, rfqId, noOfStars) {
    this.rfqId = rfqId;
    this.manId = manId
    const filterBuyer = this.iBuyerQuotesListColl.filter(m=> m.withOrderManagement === true && m.rfqId === rfqId && m.supplierId === manId) 
    if(filterBuyer.length >0){
      this.showAwardAllPopup = true;
    }

    else{
      this.showAwardAllPopup = false;
      this.NPartArrayColl = [];
      this.initPartsModel();
      this.initNPartArray();
      this.initNPartQuantity();
      const currentPart = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.isAlreadyAwrded !== true);
      currentPart.forEach(element => {
        const isManPartCount = this.NPartArrayColl.filter(m => m.rfqPartId === element.rfqPartId);
        if (isManPartCount.length != 0) {
          const isManPartIndex = this.NPartArrayColl.findIndex(m => m.rfqPartId === element.rfqPartId);
          if (isManPartIndex !== -1) {
            this.NPartArrayColl.splice(isManPartIndex, 1);
          }
        }
  
        this.getSupplierList(this.rfqId, element.rfqPartId).then(res => {
          this.NPartArray.supplierList = res;
          this.NPartArray.manId = manId;
          this.NPartArray.manName = manName;
          this.NPartArray.noOfStars = noOfStars;
          this.NPartArray.partName = element.partName;
          this.NPartArray.partNumber = element.partNumber;
          this.NPartArray.rfqPartId = element.rfqPartId;
          this.NPartArray.rfqId = this.rfqId;
          const partDetails = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manId && m.rfqPartId === element.rfqPartId);
          this.NPartQuantityColl = [];
          partDetails.forEach(element => {
            const priceSum = ((element.awardedQty * element.perUnitPrice) + element.toolingAmount +
              element.shippingAmount + element.miscellaneousAmount).toFixed(4);
            this.NPartQuantity.quantityDetails = element.awardedQty.toString() + ' parts @ $' + priceSum;
            this.NPartQuantity.rfqQuoteItemsId = element.rfqQuoteItemsId;
            this.NPartQuantityColl.push(this.NPartQuantity);
            this.initNPartQuantity();
          });
          if (partDetails.length === 1) {
            this.NPartArray.rfqQuoteItemsId = partDetails[0].rfqQuoteItemsId;
          }
          this.NPartArray.quantityList = this.NPartQuantityColl;
          let checkDuplicate = this.NPartArrayColl.findIndex(x => x.rfqPartId == this.NPartArray.rfqPartId);
          if (checkDuplicate == -1) {
            this.NPartArrayColl.push(this.NPartArray);
          }
          this.initNPartArray();
          this.isAward = true;
        });
      });
    }




  }
  checkToDisableAwardButton() {
    let awardQuoteIds = [];
    let supplierIds = [];
    let units = [];
    let prices = [];
    let checkZeroQty = false;
    this.NPartArrayColl.forEach(element => {
      supplierIds.push(element.manId);
      if (element.manId == 16 || element.manId == 17 || element.manId == 20) {
        units.push(element.unit);
        prices.push(element.price);
        if (element.unit !== null && element.unit !== '' && Number.isNaN(Number(element.unit))) {
          checkZeroQty = true;
        } else {
          awardQuoteIds.push(1);
        }
      } else if (element.manId == 18) {
        awardQuoteIds.push(1);
      } else {
        awardQuoteIds.push(element.rfqQuoteItemsId);
      }
    });
    if (awardQuoteIds.length !== 0 || units.length !== 0) {
      const isZeroExist = awardQuoteIds.filter(x => x !== 0);
      let isSupplierNotExist = supplierIds.includes('null');
      if (isSupplierNotExist) {
        return true;
      } else if (!isZeroExist.length) {
        return true;
      } else if (checkZeroQty) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }

  }
  setPriceUnit(e, index, isPriceUnit) {
    if (isPriceUnit === 1) {
      this.NPartArrayColl[index].unit = e.target.value;
    } else {
      this.NPartArrayColl[index].price = e.target.value;
    }
  }
  awardActual() {
    this.initAwardModel();
    let awardQuoteIds = [];
    let awardQuoteObj = [];
    let supplierIds = [];
    this.NPartArrayColl.forEach(element => {
      if (element.rfqQuoteItemsId != null && element.rfqQuoteItemsId != 0) {
        awardQuoteIds.push(element.rfqQuoteItemsId);
        supplierIds.push(element.manId);
        let tempObj = {
          rfqQuoteItemsId: element.rfqQuoteItemsId,
          rfqPartId: element.rfqPartId,
          isRfqStatus: false,
          rfqPartStatusId: 0,
          unit: null,
          price: null,
          awardedUnitTypeId: null,
        };
        if (element.manId == 16 || element.manId == 17 || element.manId == 20) {
          tempObj.unit = element.unit;
          tempObj.price = element.price;
          tempObj.isRfqStatus = true;
          tempObj.rfqPartStatusId = element.manId;
          tempObj.rfqQuoteItemsId = null;
          tempObj.awardedUnitTypeId = element.awardedUnitTypeId;
        }
        if (element.manId == 18) {
          tempObj.unit = null;
          tempObj.price = null;
          tempObj.isRfqStatus = true;
          tempObj.rfqPartStatusId = 18;
          tempObj.rfqQuoteItemsId = null;
        }
        awardQuoteObj.push(tempObj);
      }

    });

    if (awardQuoteIds.length !== 0) {
      const isZeroExist = awardQuoteIds.includes(0);
      let isSupplierNotExist = supplierIds.includes('null');
      if (isSupplierNotExist) {
        this._toastr.warning('Please select manufacturer to award', 'Warning!');
      } else {
        if (!this.isAwardDone) {
          this.isAwardDone = true;
          this.awardRFQPartQuantityQuote.rfqQuoteItemList = awardQuoteObj;
          this.awardRFQPartQuantityQuote.isAwrded = true;
          this.awardRFQPartQuantityQuote.rfqId = this.currentOpenQuoteId;
          this.awardRFQPartQuantityQuote.contactId = this.loggedId;
          this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
            result => {
              if (result['result'] === true) {
                this._toastr.success('RFQ has been awarded', 'Success!');
                this._rfqService.setRfqAwardEvent(true);
                this.isAward = false;
                this.isAwardDone = false;
                this.getBuyerQuotingList();
                this.captureAwardRFQ();
              } 
            },
            error => {
              this._rfqService.handleError(error);
              this.isAwardDone = false;
            },
            () => {
              this.isAwardDone = false;
            }
          );
        }
      }
    } else {}
  }
  captureAwardRFQ(){
    this._rfqService.captureAwardRfqEvent(this.awardRFQPartQuantityQuote).subscribe(
      result => {
        if (result['result'] === true) {
        }
      })
    }
  getQuantity() {
    if (this.iQuantityUnitColl.length === 0) {
      this._masterService.getQuantityUnit().subscribe(
        (data: IQuantityUnit[]) => {
          this.iQuantityUnitColl = data;
          this.iQuantityUnitColl.sort((a, b) => {
            const textA = a.value.toUpperCase();
            const textB = b.value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.iQuantityUnitColl.unshift(
            (this.iQuantityUnitColl).splice(
              (this.iQuantityUnitColl).findIndex(
                elt => elt.id === 92),
              1)[0]);
        },
        error => () => {
          this._toastr.error(error, 'Error!');
        }
      );
    }

  }
  checkZero(val) {
    if (val !== null && val !== '' && Number.isNaN(Number(val))) {
      return true;
    } 
    return false;
  }
  currentRfq() {
    return this._rfqService.get('rfqId');
  }
  isChecked() {
    let ischeck = this.iBuyerQuotesListColl.filter(x => x.isSelected == true);
    if (ischeck.length > 1) {
      return false;
    } 
    return true;
  }
  checkUncheckAll() {
   this.iBuyerQuotesListColl=this.iBuyerQuotesListColl.map(e => ({...e, isSelected: this.checkedAll}));
  }
  setRfqDetail(id) {
    this.id = id;
  }
  setArchive() {
    let rfqIdList = [];
    if(this.id != undefined && this.id !== null && this.id !== 0){
      rfqIdList.push(this.id);
    }
    else{
      let filterData = this.iBuyerQuotesListColl.filter(x => x.isSelected === true);
      if (filterData.length) {
        rfqIdList = filterData.map(x => x.rfqId);
      }
    }
    if (rfqIdList.length) {
      this._rfqService.setArchiveStatus( rfqIdList, this.loggedId).subscribe(
        response => {
          if (response.result) {
            this._toastr.success(response.errorMessage, 'Success!');
            this.getBuyerQuotingList();
          } else {
            this._toastr.warning(response.errorMessage, 'Warning!');
          }
          this.id = 0;
        }, error => {
          this.id = 0;
          this._toastr.error('Something went wrong please try later', 'Error!');
        }
      );
    }
  }
  
  closeAwardAllModelAward(isOpened){
    if(isOpened === true) {
      this.showAwardAllPopup = false;
    } else {
      this.showAwardAllPopup = true
    }
  }

 // ******* Triger Pendo******
 triggerPendo() {
   this.productAnalyticService.initializPendo(this.productAnalyticService.QUOTES_RFQ_LIST, {noOfRFQquotes:this.totalRow});
 
}


  closeAwardSingleModelAward(isOpened) {
      if(isOpened === true) {
        this.singleAwardModal = false;
      } else {
        this.singleAwardModal = true;
      }
       
      }
      moveToCreatRfq(){  
        this._ProfileService.getConfigCatData().subscribe(rfqForm2Enabled => {
          if(rfqForm2Enabled){
            this.router.navigateByUrl('/rfq/buyer');      
          }else{
          this.router.navigateByUrl('/rfq/editrfq');
        }
        });
      }  
     
}
