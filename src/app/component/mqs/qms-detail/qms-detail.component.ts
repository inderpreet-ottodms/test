import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  IQmsPartQuantityList,
  IQmsQuotesViewModel,
  IReviewQuoteBasicInfoViewModel,
  IQMSStatus,
  QMSEmailStatus
} from '../../../core/models/qmsModel';
import {
  QmsService
} from '../../../core/services/qms/qms.service';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RoutesRecognized,
  NavigationStart,
  RouterEvent
} from '@angular/router';
import {
  ConfirmationService
} from 'primeng/api';
import {
  ToastrService
} from 'ngx-toastr';
import {
  MasterService
} from '../../../core/services/master/master.service';
import {
  pairwise,
  filter,
  first
} from 'rxjs/operators';
import {
  timeout
} from 'q';
import { RfqService } from '../../../core/services/rfq/rfq.service';
@Component({
  selector: 'app-qms-detail',
  templateUrl: './qms-detail.component.html',
  styleUrls: ['./qms-detail.component.scss'],
  providers: [ConfirmationService],

})
export class QmsDetailComponent implements OnInit, OnDestroy {
  partDetailDiv1 = false;
  IQmsPartQuantityListColl: IQmsPartQuantityList[] = [];
  iQuotesViewModel: IQmsQuotesViewModel;
  iReviewQuoteBasicInfoViewModel: IReviewQuoteBasicInfoViewModel;
  totalQtyArray: number[];
  tempQMSQuoteId: number;
  isEmilPdfPreview: boolean;
  isLoader: boolean;
  tempQMSId: any;
  messageData: any;
  noteId: any;
  qmsAllStatus: QMSEmailStatus[];
  qouteid: any;
  customerId: any;
  isInvoiceTab: any;
  isQMSMessageTabOpen:boolean;
  constructor(private _qmsService: QmsService, private _rfqService: RfqService, private router: Router,
    private _toastr: ToastrService, private _masterService: MasterService, private ref: ChangeDetectorRef,
    private route: ActivatedRoute, private confirmationService: ConfirmationService, private _ngZone: NgZone) {
    this.qmsAllStatus = [];
    this.isInvoiceTab = false;
    this.isQMSMessageTabOpen= false;
    let url = this._qmsService.getPreviousUrl();
    if (url && (url.includes('/qms/createinvoice?qmsQuoteId=') || url.includes('qms/invoicePdf'))) {
      this.isInvoiceTab = true;
    } else {
      this.isInvoiceTab = false;
    }
    // this.router.events
    // .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise(),first())
    // .subscribe((events: RoutesRecognized[]) => {
    //   console.log('previous url', events[0].urlAfterRedirects,events[0].urlAfterRedirects.includes('/qms/createinvoice?qmsQuoteId='));

    //   if(events[0].urlAfterRedirects.includes('/qms/createinvoice?qmsQuoteId=')){
    //     this._ngZone.run(() => {

    //       this.isInvoiceTab =true;
    //       console.log('current url',  this.isInvoiceTab );
    //     })

    //   } else {
    //     this.isInvoiceTab=false;
    //   }

    //   // console.log('current url', events[1].urlAfterRedirects);
    // });

  }

  ngOnInit() {


    this.isLoader = false;
    // tslint:disable-next-line:radix
    this.tempQMSQuoteId = this.route.snapshot.params['id'];
    // this.tempQMSId = localStorage.getItem('qmsId');
    this._qmsService.set(false, 'isMessageQmsDrawer');
    if (this.tempQMSQuoteId === null || this.tempQMSQuoteId === undefined || this.tempQMSQuoteId === NaN) {
      this.router.navigate(['/qms/myquotes']);
    } else {
      // localStorage.removeItem( 'qmsQuoteId');
    }
    this.iQuotesViewModel = {
      createdBy: 0,
      createdDate: '',
      isActive: true,
      qmsQuoteId: 0,
      qmsQuoteName: '',
      statusId: 0,
      qmsContactId: '',
      estimatedDeliveryDate: null,
      isNotified: true,
      paymentTermId: 0,
      quoteRefNo: '',
      paymentTerms: '',
      quoteValidUntil: '',
      shippingMethodId: 0,
      shippingMethod: '',
      notes: '',
      result: true,
      errorMessage: '',
      email: '',
      contactName: '',
      customer: '',
      phone: '',
      qMSContactIdEncrypt: '',
      isAllPartDetailsFilled: false,
      probability: 0,
      quoteId: 0,
      emailStatusId: 0,
      qmsQuoteIdEncrypt: '',
      whoPaysForShipping:0,
      qmsQuoteLeadTimeAddList:[],
      qmsCustomerContactId:0
    };
    this.iReviewQuoteBasicInfoViewModel = {
      customer: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
    };
    this.IQmsPartQuantityListColl = [];
    this.totalQtyArray = [];
    this.getQmsDetails();
    this.qmsStatus();
    this.customerId = '';
  }

  getQmsDetails() {
    this.IQmsPartQuantityListColl = [];
    this._qmsService.getQmsQuantityParts(this.tempQMSQuoteId).subscribe(
      result => {
        if (result['result'] === true) {
          this.iQuotesViewModel = result['data']['reviewQuoteDetailsViewModel'];
          this.tempQMSId= this.iQuotesViewModel.quoteId;
          this.IQmsPartQuantityListColl = result['data']['reviewQuotePartQuantitiesListViewModel'];
          this.iReviewQuoteBasicInfoViewModel = result['data']['reviewQuoteBasicInfoViewModel'];
          // console.log( this.iQuotesViewModel, ' q ', this.IQmsPartQuantityListColl, ' r ' , this.iReviewQuoteBasicInfoViewModel );
        }
      },
      error => {
        // this.handleError(error);
      },
      () => {}
    );
  }
  callPdf() {
    this.isLoader = true;
    this.isEmilPdfPreview = true;
  }
  isPdfDownload() {
    if (localStorage.getItem('isPdfDownload') === 'false') {
      localStorage.removeItem('isPdfDownload');
      this.isEmilPdfPreview = false;
      this.isLoader = false;
    }
  }
  openEditQms(qmsQuoteId) {
    localStorage.setItem('qmsQuoteId', qmsQuoteId);
    localStorage.setItem('qmspage', 'myQms');
    this.router.navigate(['/qms/createquotes']);
  }


  cancelQMS() {
    this.confirmationService.confirm({
      // tslint:disable-next-line:max-line-length
      message: "Are you sure you want to cancel this QMS? <br>This Quote will be moved to Draft Quotes, you will have to edit and re-submit in the future to continue. Would you like to cancel this QMS",
      header: 'Cancel QMS',
      icon: null,
      accept: () => {

        this._qmsService.setQMSQuoteStatus(this.iQuotesViewModel.qmsQuoteId, 1).subscribe(
          result => {
            if (result['result'] === true) {

              this._toastr.success(result['errorMessage'], '');
              this.router.navigate(['/qms/draftquotes']);
            }
          },
          error => {
            // this._rfqService.handleError(error);
          }
        );
      },
      reject: () => {
        // this.msgs = 'false';
      }
    });
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
              this.router.navigate(['/qms/myquotes']);
              // this.filterAll();
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
  isSidePanel() {
    return this._qmsService.get('showSidePanel');
  }
  isNoteDrawer() {
    return this._qmsService.get('isNoteDrawer');
  }
  isMessageDrawer() {
    return this._qmsService.get('isMessageDrawer');
  }
  getMessageData($event: number) {
    this.messageData = $event;
  }
  getNoteId($event: number) {
    this.noteId = $event;
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  qmsStatus() {
    this._qmsService.GetQMSQuoteStatus(this.loggedCompanyId,this.loggedId).subscribe(res => {
      if (res['isError'] === false) {
        this.qmsAllStatus = res['data'].data;
      } else {
        this.qmsAllStatus = [];
      }
    })

  }
  changeQmsStatus($event) {
    this._qmsService.QMSQuoteStatus(this.tempQMSQuoteId, $event.target.value).subscribe(res => {
      if (res['isError'] === false) {
        this._toastr.success('QMS Status Update Successfully.', 'Success!');
      }
    })
  }
  ngOnDestroy() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
    this._qmsService.set(false, 'isNoteDrawer');
  }
  closeSideDrawer() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isMessageDrawer');
    this._qmsService.set(false, 'isNoteDrawer');
    this._qmsService.set(false, 'isCompanyDrawer');
  }
  isCompanyDrawer() {
    return this._qmsService.get('isCompanyDrawer');
  }
  getCustomerId($event: number) {
    this.customerId = $event;
  }
  isMessageSendDrawer() {
    return this._qmsService.get('isMessageSendDrawer');
  }
  isMessageQmsDrawer(){
    return this._qmsService.get('isMessageQmsDrawer');
  }
    onMessages() {
    this.isQMSMessageTabOpen = true;
  }
  onNote() {
    this.isQMSMessageTabOpen = false;
  }
  onQuote() {
    this.isQMSMessageTabOpen = false;
  }
  onInvoice() {
    this.isQMSMessageTabOpen = false;
  }
}
