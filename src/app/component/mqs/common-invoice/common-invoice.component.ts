import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  IQMSQuoteListFilterViewModel,
  IQMSQuoteListViewModel,
  IQMSStatus,
  InvoiceViewModel,
  QmsQuotePartInvoice,
  QMSMailModel,
  QMSInvoicePDFViewModel,
  QMSInvoiceTrackActivityViewModel,
  Quoter
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
import {
  InvoicePreviewViewModel
} from '../invoice-pdf/InvoicePreviewViewModel';
import {
  ApiService
} from '../../../__Services/api-service/api.service';
import {
  appConstants
} from '../../../core/config/constant';
@Component({
  selector: 'app-common-invoice',
  templateUrl: './common-invoice.component.html',
  styleUrls: ['./common-invoice.component.scss'],
  providers: [ApiService, ConfirmationService, InvoicePreviewViewModel]
})
export class CommonInvoiceComponent implements OnInit {
  /*
  invoiceType:
    1: My company invoice.
    2: My invoice
  */
  @Input() invoiceType: any;
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
  invoiceStatusFilterValue: any;
  searchFilterValue: string;
  toggleInvoice: boolean;
  toggleCustomerName: boolean;
  toggleQuoteId: boolean;
  toggleStatus: boolean;
  toggleTotal: boolean;
  toggleSupplier: boolean;
  isMyQoutsAvailable: boolean;
  isLoader: boolean;
  activeStatusFilterBtn: string;
  iQMSQuoteListFilterViewModel: IQMSQuoteListFilterViewModel;
  iQMSQuoteListViewModel: IQMSQuoteListViewModel[];
  filteredItems: IQMSQuoteListViewModel[];
  reverse: boolean;
  qmsAllStatus: IQMSStatus[];
  emailAllStatus: IQMSStatus[];
  probabilityAll: IQMSStatus[];
  contactCompanyList: any[];
  quoterList: Quoter[];
  invoiceViewModel: InvoiceViewModel;
  items: InvoiceViewModel[];
  isEmilPdfPreview: boolean;
  quoteId: number;
  mqsContactIdEncrypt: string;
  mqsQuoteId: number;
  countrySettings = {};
  invoiceStatusList: IQMSStatus[];
  qmsInvoiceTrackActivityViewModel: QMSInvoiceTrackActivityViewModel;
  qmsMailModel: QMSMailModel;
  isMailed: boolean;
  decimalValueDefault: number;

  constructor(private _qmsService: QmsService, private _masterService: MasterService,
    private confirmationService: ConfirmationService, private _rfqService: RfqService, private _ProfileService: ProfileService,
    private _toastr: ToastrService, private router: Router, public invoicePreviewData: InvoicePreviewViewModel,
    private rest: ApiService, ) {
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
    this.invoiceStatusFilterValue = '';
    this.activeStatusFilterBtn = 'all';
    this.decimalValueDefault = null;
  }

  ngOnInit() {
    this.sortQuoterFilterValue = 0;
    // Get decimal value and set in env variable.
    if (appConstants.settingDefault.decimalValueDefault == null || appConstants.settingDefault.decimalValueDefault == undefined) {
      this._masterService.getDefaultQmsDecimalPlaces(this.loggedId).subscribe(res => {
        if (!res.isError) {
          appConstants.settingDefault.decimalValueDefault = res.data;
          this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
        }
      })
    } else {
      this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
    }
    this.pageSize = 24;
    this.currentIndex = 1;
    this.pageNumber = 1;
    this.pageStart = 1;
    this.pages = 3;
    this.totalRow = 0;
    this.sortCompanyFilterValue = null;
    this.sortProFilterValue = 0;
    this.sortsAllStatusFilterValue = '';
    this.sortsStatusFilterValue = 1;
    this.searchFilterValue = '';

    this.toggleInvoice = false;
    this.toggleCustomerName = false;
    this.toggleQuoteId = false;
    this.toggleStatus = false;
    this.toggleTotal = false;
    this.toggleSupplier = false;

    this.isLoader = true;
    this.isMyQoutsAvailable = true;
    this.reverse = true;
    this.invoiceStatusList = [];
    this.isMailed = false;
    this.qmsInvoiceTrackActivityViewModel = {
      qmsQuoteId: 0,
      qmsQuoteInvoiceId: 0,
      qmsQuoteActivityId: 0,
      // activityDate : '',
      createdBy: 0
    }
    this.qmsMailModel = {
      qmsQuoteInvoicePDFHtml: '',
      qmsQuoteContactId: 0,
      qmsQuoteInvoiceId: 0,
      qmsQuoteInvoiceSubject: '',
      qmsQuoteInvoiceMessageBody: '',
      qmsQuoteSupplierEmailId: '',
      receiverName: '',
      supplierId: this.loggedId,
      qmsQuoteId: 0
    }
    this.getInvoiceStatus();
    this.initModel();
    if (this.invoiceType == 2) {
      this.getQMSInvoiceList();
    } else {
      this.getQMSInvoiceCompanyList();
    }

    this.getQuoterList();
    this.getMQSContactsList();
  }

  initModel() {
    this.invoiceViewModel = {
      supplierId: this.loggedId,
      supplierCompanyId: 0,
      invoiceId: 0,
      customerId: 0,
      invoiceNo: '',
      customer: '',
      quoteReferenceNo: '',
      status: '',
      amountDue: 0,
      qmsQuoteInvoiceId: 0,
      qmsQuoteId: 0,
      maxPageSize: 24,
      pageSize: 24,
      pageNumber: 1,
      searchText: '',
      totalRecords: 0,
      isOrderByDesc: true,
      orderBy: '',
      more_records: true,
      quoteId: 0,
      customerIdEncrypted: '',
      qmsQuoteEncryptId: '',
      filterBy: 0
    }

  }
  /**
   * Get customer list from api
   */
  getMQSContactsList() {
    this._qmsService.GetQMSCustomer(this.loggedId).subscribe(result => {
      this.contactCompanyList = result['data'];
      result['data'].forEach((element, index) => {
        this.contactCompanyList[index].name = element.firstname + ' ' + element.lastname;
      });
      this.countrySettings = {
        singleSelection: true,
        fixedTitle: true,
        text: 'Sort by Customer',
        selectAllText: 'Sort by Customer',
        unSelectAllText: 'UnSelect All',
        searchPlaceholderText: 'Search Customer',
        enableSearchFilter: true,
        labelKey: 'name',
        primaryKey: 'contactID',
        noDataLabel: 'No Data Available',
        selectGroup: false,
        badgeShowLimit: 1,
        maxHeight: 200,
        showCheckbox: true,
        classes: 'myBoldClass',
        enableCheckAll: false
      };
    })
  }

  /**
   * Get invoice list by invoice type like my invoice.
   */
  getQMSInvoiceList() {
    this.items = [];
    this.isLoader = true;
    this.invoiceViewModel.supplierCompanyId = 0;
    this._qmsService.getInvoiceList(this.invoiceViewModel).subscribe(response => {
      if (!response['isError']) {
        if (response.data.length) {
          this.items = response.data;
          this.totalRow = response['totalRecords'];
          this.isMyQoutsAvailable = true;
          this.isLoader = false;
        } else {
          this.items = [];
          this.isMyQoutsAvailable = false;
          this.isLoader = false;
        }
        window.scrollTo(0, 0);
        this.init();
      }
    }, error => {
      window.scrollTo(0, 0);
      this.isLoader = false;
      this.isMyQoutsAvailable = false;
      this.items = [];
    });

  }
  /**
   * Get invoice list by invoice type like my company invoice.
   */
  getQMSInvoiceCompanyList() {
    this.items = [];
    this.isLoader = true;
    this.invoiceViewModel.supplierCompanyId = this.loggedCompanyId;
    this._qmsService.getInvoiceCompanyList(this.invoiceViewModel).subscribe(response => {
      if (!response['isError']) {
        if (response.data.length) {
          this.items = response.data;
          this.totalRow = response['totalRecords'];
          this.isMyQoutsAvailable = true;
          this.isLoader = false;
        } else {
          this.items = [];
          this.isMyQoutsAvailable = false;
          this.isLoader = false;
        }
        this.init();
        window.scrollTo(0, 0);
      }
    }, error => {
      window.scrollTo(0, 0);
      this.isLoader = false;
      this.isMyQoutsAvailable = false;
      this.items = [];
    });

  }

  /**
   * Get quoter list by logged in company id
   */
  getQuoterList() {
    this._qmsService.getQuoterList(this.loggedCompanyId).subscribe(result => {
      this.quoterList = result['data'];
    })
  }


  /**
   * This function is used to get invoice list according to filters like search, status.
   */
  filterAll() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isCompanyDrawer');
    this._qmsService.set(false, 'isQuoteReviewDrawer');
    if (this.searchFilterValue) {
      this.invoiceViewModel.searchText = this.searchFilterValue;
    } else {
      this.invoiceViewModel.searchText = '';
    }
    if (this.invoiceStatusFilterValue !== '') {
      this.invoiceViewModel.status = this.invoiceStatusFilterValue;
    } else {
      this.invoiceViewModel.status = '';
    }
    if (this.sortsAllStatusFilterValue !== '') {
      this.invoiceViewModel.orderBy = this.sortsAllStatusFilterValue;
    } else {
      this.invoiceViewModel.orderBy = '';
    }
    if ((this.sortCompanyFilterValue !== null) && (this.sortCompanyFilterValue.length !== 0)) {
      this.invoiceViewModel.customerId = this.sortCompanyFilterValue[0].contactID;
    } else {
      this.invoiceViewModel.customerId = 0;
    }
    if (this.sortsStatusFilterValue == 2 || this.sortsStatusFilterValue == 3) {
      this.invoiceViewModel.isOrderByDesc = false;
    } else {
      this.invoiceViewModel.isOrderByDesc = true;
    }
    if (this.sortQuoterFilterValue != 0) {
      this.invoiceViewModel.filterBy = this.sortQuoterFilterValue;
    } else {
      this.invoiceViewModel.filterBy = 0;
    }
    this.currentIndex = 1;
    this.pages = 3;
    this.invoiceViewModel.pageNumber = 1;
    this.invoiceViewModel.pageSize = this.pageSize;
    if (this.invoiceType == 2) {
      this.getQMSInvoiceList();
    } else {
      this.getQMSInvoiceCompanyList();
    }
  }
  /**
   * return sorting data based on column name.
   * @param  {} tab
   */
  toggleColumn(tab) {
    switch (tab) {
      case 'invoice_id': {
        if (this.toggleInvoice) {
          this.invoiceViewModel.isOrderByDesc = false;
          this.invoiceViewModel.orderBy = 'invoice_id';
        } else {
          this.invoiceViewModel.isOrderByDesc = true;
          this.invoiceViewModel.orderBy = 'invoice_id';
        }
        this.toggleInvoice = !this.toggleInvoice;
        break;
      }
      case 'customerName': {
        if (this.toggleCustomerName) {
          this.invoiceViewModel.isOrderByDesc = false;
          this.invoiceViewModel.orderBy = 'customer';
        } else {
          this.invoiceViewModel.isOrderByDesc = true;
          this.invoiceViewModel.orderBy = 'customer';
        }
        this.toggleCustomerName = !this.toggleCustomerName;
        break;
      }
      case 'quoteId': {
        if (this.toggleQuoteId) {
          this.invoiceViewModel.isOrderByDesc = false;
          this.invoiceViewModel.orderBy = 'quote_id';
        } else {
          this.invoiceViewModel.isOrderByDesc = true;
          this.invoiceViewModel.orderBy = 'quote_id';
        }
        this.toggleQuoteId = !this.toggleQuoteId;
        break;
      }
      case 'status': {
        if (this.toggleStatus) {
          this.invoiceViewModel.isOrderByDesc = false;
          this.invoiceViewModel.orderBy = 'status';
        } else {
          this.invoiceViewModel.isOrderByDesc = true;
          this.invoiceViewModel.orderBy = 'status';
        }
        this.toggleStatus = !this.toggleStatus;
        break;
      }
      case 'total': {
        if (this.toggleTotal) {
          this.invoiceViewModel.isOrderByDesc = false;
          this.invoiceViewModel.orderBy = 'total';
        } else {
          this.invoiceViewModel.isOrderByDesc = true;
          this.invoiceViewModel.orderBy = 'total';
        }
        this.toggleTotal = !this.toggleTotal;
        break;
      }
      case 'supplier': {
        if (this.toggleSupplier) {
          this.invoiceViewModel.isOrderByDesc = false;
          this.invoiceViewModel.orderBy = 'supplier';
        } else {
          this.invoiceViewModel.isOrderByDesc = true;
          this.invoiceViewModel.orderBy = 'supplier';
        }
        this.toggleSupplier = !this.toggleSupplier;
        break;
      }

    }
    this.currentIndex = 1;
    this.pages = 3;
    this.invoiceViewModel.pageNumber = 1;
    if (this.invoiceType == 2) {
      this.getQMSInvoiceList();
    } else {
      this.getQMSInvoiceCompanyList();
    }
  }

  //  search function start
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
  //  search function end

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
    this.invoiceViewModel.pageNumber = this.currentIndex;
    if (this.invoiceType == 2) {
      this.getQMSInvoiceList();
    } else {
      this.getQMSInvoiceCompanyList();
    }
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }
    this.invoiceViewModel.pageNumber = this.currentIndex;
    if (this.invoiceType == 2) {
      this.getQMSInvoiceList();
    } else {
      this.getQMSInvoiceCompanyList();
    }
  }
  // periticluar page no selection function
  setPage(index: number) {
    this.currentIndex = index;
    this.invoiceViewModel.pageNumber = this.currentIndex;
    if (this.invoiceType == 2) {
      this.getQMSInvoiceList();
    } else {
      this.getQMSInvoiceCompanyList();
    }
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

  /**
   * this function is used to open quote review drawer.
   * @param  {} event
   * @param  {} quoteId
   */
  openQuoteReviewDrawer(event, quoteId) {
    event.stopPropagation();
    this.mqsQuoteId = quoteId;
    this._qmsService.set(false, 'isCompanyDrawer');
    this._qmsService.set(true, 'showSidePanel');
    this._qmsService.set(false, 'isDraftPage');
    if (this.invoiceType == 4 || this.activeStatusFilterBtn === 'archived') {
      this._qmsService.set(true, 'disableProbability');
    } else {
      this._qmsService.set(false, 'disableProbability');
    }
    setTimeout(() => {
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
    ;
    this.quoteId = quoteId;
    this.isLoader = true;
    this.isEmilPdfPreview = true;
  }
  isPdfDownload() {
    if (localStorage.getItem('isPdfDownload') === 'false') {
      localStorage.removeItem('isPdfDownload');
      this.isEmilPdfPreview = false;
      this.isLoader = false;
      if (this.invoiceType == 2) {
        this.getQMSInvoiceList();
      } else {
        this.getQMSInvoiceCompanyList();
      }
    }
  }

  /**
   *  redirect to create qms page for edit the particular qms
   * @param  {} qmsQuoteId
   */
  openEditQms(qmsQuoteId) {
    localStorage.setItem('qmsQuoteId', qmsQuoteId);
    localStorage.setItem('qmspage', 'myQms');
    this.router.navigate(['/qms/createquotes']);
  }

  reloadPageOnQuotedrawerClose() {
    if (this._qmsService.get('quoteReviewDrawerClosed')) {
      this._qmsService.set(false, 'quoteReviewDrawerClosed');
      if (this.invoiceType == 2) {
        this.getQMSInvoiceList();
      } else {
        this.getQMSInvoiceCompanyList();
      }
    }
  }

  /**
   *  redirect to qms detail page  for particular qms.
   * @param  {} qmsQuoteId
   * @param  {} qmsId
   * @param  {} event
   */
  openQMSDetailsPage(qmsQuoteId, qmsId, event) {
    event.stopPropagation();
    // localStorage.setItem( 'qmsQuote' , qmsQuoteId);
    localStorage.setItem('qmsId', qmsId);
    let qmsQuoteEncypt = this._ProfileService.encrypt(qmsQuoteId);
    console.log('encypt', qmsQuoteEncypt);
    this.router.navigate(['/qms/qmsdetail', qmsQuoteId]);
  }

  /**
   * return invoice status for filer the invoice data
   */
  getInvoiceStatus() {
    this._masterService.getQmsQuoteInvoiceStatus().subscribe(res => {
      if (res['isError'] === false) {
        this.invoiceStatusList = res['data'];
      } else {
        this.invoiceStatusList = [];
      }
    });
  }


  /* This function is used to delete invoice. */
  deleteInvoice(qmsQuoteInvoiceId) {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: 'Are you sure you want to delete this Invoice?.',
      header: 'Delete Invoice',
      icon: null,
      accept: () => {
        this._qmsService.deleteQmsQuoteInvoice(qmsQuoteInvoiceId).subscribe(
          result => {
            if (!result['isError']) {
              this._toastr.success('Invoice is deleted successfully.', 'Success!');
              this.filterAll();
            } else {
              // this._toastr.error(result.errorMessage, 'Error!');
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

  quoteParts: QmsQuotePartInvoice[] = [];
  qtysCollection: any[];
  qtyUnitCollction: any[];
  /**
   * @param  {} quoteId
   * @param  {} invoiceId
   * @param  {} isMail
   * @param  {} qmsContactId
   * @param  {} customerName
   * @param  {} qmsQuoteId
   * return data for show invoice preview
   */
  showInvoicePreview(quoteId, invoiceId, isMail, qmsContactId, customerName, qmsQuoteId) {
    this.quoteParts = [];
    this.isLoader = true;
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteId = qmsQuoteId;
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteInvoiceId = invoiceId;
    this.rest.get('QMSQuoteInvoice?qmsQuoteInvoiceId=' + invoiceId)
      .subscribe(
        (response: {
          data: any,
          isError: boolean,
          message: any,
          totalRecords ? : number
        }) => {
          if (!response.isError) {
            this.invoicePreviewData.customerId = response.data.qmsCustomerId;
            this.invoicePreviewData.quoteReferenceNo = response.data.referenceNo;
            this.invoicePreviewData.invoiceName = response.data.invoiceName;
            this.invoicePreviewData.invoiceNumber = response.data.invoiceNo;
            this.invoicePreviewData.issueDate = response.data.invoiceDate;
            this.invoicePreviewData.ordernumber = response.data.purchaseOrderNumber;
            this.invoicePreviewData.notes = response.data.notes;
            this.invoicePreviewData.invoiceItems = [];

            this.rest.get('QMSQuoteParts?qmsQuoteIdEncrypt=' + quoteId +
                '&qmsQuoteInvoiceId=' + invoiceId)
              .subscribe(
                (quoteResponse: {
                  data: any,
                  isError: boolean,
                  message: any,
                  totalRecords ? : number
                }) => {
                  if (!quoteResponse.isError) {
                    quoteResponse.data.forEach(qData => {
                      let invoiceItem = {
                        "qmsQuoteInvoicePartId": qData.qmsQuoteInvoicePartId,
                        "qmsQuotePartId": qData.qmsQuotePartId,
                        "partName": qData.partName,
                        "partNumber": qData.partNumber,
                        "partDetails": {
                          "partQuantities": [],
                          "specialFee": {}
                        }
                      }

                      this.rest.get('InvoicePartSpecialFeesInfo?invoiceId=' + invoiceId + '&qmsPartId=' + qData.qmsQuotePartId + '&qmsQuoteInvoicePartId=' + qData.qmsQuoteInvoicePartId)
                        .subscribe(
                          (response) => {
                            // // debugger;
                            if (!response.isError) {
                              if (response.data.specialFeesList != null && response.data.specialFeesList != undefined && response.data.specialFeesList.length) {
                                let tempObj = {
                                  partID: qData.qmsQuotePartId,
                                  feeTypeArray: [],
                                  sum: 0,
                                }
                                response.data.specialFeesList.forEach(element => {
                                  let feeObject = {
                                    feeId: element.feeTypeId,
                                    cost: element.value,
                                    feeName: element.feeType,
                                  }
                                  tempObj.sum += element.value;
                                  tempObj.feeTypeArray.push(feeObject);
                                });
                                invoiceItem.partDetails.specialFee = tempObj;
                              }
                            }
                          });

                      this.rest.get('InvoicePartQuantityInfo/GetInvoicePartQtyInfo?invoiceId=' + invoiceId +
                          '&qmsPartId=' + qData.qmsQuotePartId)
                        .subscribe(
                          (qtyResponse: {
                            data: any,
                            isError: boolean,
                            message: any,
                            totalRecords ? : number
                          }) => {
                            if (!qtyResponse.isError) {
                              this.isLoader = false;
                              if (isMail) {
                                this.isMailed = true;
                                setTimeout(() => {
                                  this.openMailDrawer(invoiceId, qmsContactId, customerName, qmsQuoteId);
                                }, 1000);

                              }
                              invoiceItem.partDetails.partQuantities = qtyResponse.data.partQuantities;
                              this.invoicePreviewData.invoiceItems.push(invoiceItem);
                            }
                          });



                    });
                  }
                });
          }
        })
  }

  /**
   * @param  {} invoiceId
   * @param  {} qmsContactId
   * @param  {} customerName
   * @param  {} qmsQuoteId
   * this function is used to open mail drawer with the help of angular services
   */
  openMailDrawer(invoiceId, qmsContactId, customerName, qmsQuoteId) {
    const data = document.getElementById('contentToConvertPDF').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.isMailed = false;
    this.isLoader = false;
    this.qmsMailModel.qmsQuoteInvoicePDFHtml = newdata;
    this.qmsMailModel.qmsQuoteInvoiceId = invoiceId;
    this.qmsMailModel.qmsQuoteContactId = qmsContactId;
    this.qmsMailModel.qmsQuoteInvoiceSubject = "";
    this.qmsMailModel.qmsQuoteInvoiceMessageBody = "";
    this.qmsMailModel.receiverName = customerName;
    this.qmsMailModel.qmsQuoteSupplierEmailId = localStorage.getItem('User2');
    this.qmsMailModel.qmsQuoteId = qmsQuoteId;
    this._qmsService.set(true, 'showSidePanel');
    this._qmsService.set(true, 'isMessageDrawer');
  }

  isMessageDrawer() {
    return this._qmsService.get('isMessageDrawer');
  }

  pdfButtonTitle: string = "Generate PDF";
  PdfModel: QMSInvoicePDFViewModel;
  /**
   * generate invoice pdf with help of api
   */
  generateInvoicePDF() {
    this.pdfButtonTitle = "Please wait!!!";
    this.PdfModel = new QMSInvoicePDFViewModel();
    const data = document.getElementById('contentToConvertPDF').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlInvoicePDF = newdata;
    this.PdfModel.invoiceId = this.invoicePreviewData.invoiceNumber;
    this._qmsService.generateInvoicePDF(this.PdfModel).subscribe(
      result => {
        if (!result['isError']) {
          this.setQMSInvoiceActivity();
          window.open(result['data']['privateFileFileName'], '_blank');
          this._toastr.success(result['data']['errorMessage'], 'Success!');
        } else {
          this._toastr.error(result['data']['errorMessage'], 'Error!');
        }
        this.pdfButtonTitle = "Generate PDF";
      },
      error => {
        this.pdfButtonTitle = "Generate PDF";
      },
      () => {}
    );
  }
  /* This function is used to navigate to create invoice list */
  onNavigate(qmsQuoteIdEncrypt, invId) {
    this.router.navigate(['/qms/createinvoice'], {
      queryParams: {
        qmsQuoteId: qmsQuoteIdEncrypt,
        invoiceId: invId
      }
    })
  }

  /**
   * set qms invoice activity like user send email to customer, download pdf
   */
  setQMSInvoiceActivity() {
    this.qmsInvoiceTrackActivityViewModel.qmsQuoteActivityId = 104;
    this.qmsInvoiceTrackActivityViewModel.createdBy = this.loggedId;
    this._qmsService.setQMSInvoiceActivity(this.qmsInvoiceTrackActivityViewModel).subscribe(
      response => {},
      error => {}
    );
  }

  /**
   * return price with how many decimal required. this is decided by variable decimalValueDefault which set in setting page
   * @param  {number} price
   */
  getInvoiceAmtByDecimal(price: number) {
    return price.toFixed(this.decimalValueDefault);
  }

  /**
   * set qms invoice status.
   * @param  {} statusId
   * @param  {} $event
   */
  changeQmsInvoiceStatus(statusId, $event) {
    this._qmsService.setQmsQuoteInvoiceStatus(statusId, $event.target.value).subscribe(res => {
      if (res['isError'] === false) {
        this._toastr.success('QMS Invoice Status Updated Successfully.', 'Success!');
      }
    })
  }
}
