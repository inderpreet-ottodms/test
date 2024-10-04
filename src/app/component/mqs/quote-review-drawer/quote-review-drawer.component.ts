import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { IQmsPartQuantityList, IQmsQuotesViewModel,
   IReviewQuoteBasicInfoViewModel,
   IQMSStatus,
   QMSEmailStatus,
   QMSProbabilityStatus} from '../../../core/models/qmsModel';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { QmsService } from '../../../core/services/qms/qms.service';
import { Router } from '@angular/router';
import { MasterService } from '../../../core/services/master/master.service';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import {
  appConstants
} from '../../../core/config/constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-quote-review-drawer',
  templateUrl: './quote-review-drawer.component.html',
  styleUrls: ['./quote-review-drawer.component.scss']
})
export class QuoteReviewDrawerComponent implements OnInit {
  qmsQuoteIdEncrypt: any;
  @Input() mqsQuoteId: number;
  @Input() isDraft: boolean;
  IQmsPartQuantityListColl: IQmsPartQuantityList[];
  iQuotesViewModel: IQmsQuotesViewModel;
  iQuotesViewModel1: IQmsQuotesViewModel;
  iReviewQuoteBasicInfoViewModel:IReviewQuoteBasicInfoViewModel;
  qmsAllStatus: QMSEmailStatus[];
  temp: string[];
  probabilityAll: QMSProbabilityStatus [];
  sortProFilterValue: any;
  isEmilPdfPreview:boolean;
  isLoader: boolean;
  isLoaderPDF: boolean;
  isFileDownloaded: number;
  isProbabilityChanged: boolean;
  isStatusChanged: boolean;
  whoPaysForShippingText:string;
  isPdfDowloaded: boolean;
  decimalValueDefault: number;
  invoiceId: number;
  @ViewChild('qmsBeta',{static:false}) qmsBeta: TemplateRef < any > ;
  isInvoiceCreateFlag: boolean;
  constructor(private _qmsService: QmsService,  private _toastr: ToastrService,
    private router: Router, private _masterService: MasterService,
    private _rfqService: RfqService, private modalService: NgbModal) {
      this.probabilityAll = [];
      this.sortProFilterValue = 10;
      this.isEmilPdfPreview= false;
      this.isLoader= true;
      this.isLoaderPDF = false;
      this.isFileDownloaded = 0;
      this.isProbabilityChanged = false;
      this.isStatusChanged = false;
      this.qmsAllStatus = [];
      this.decimalValueDefault = null;
    }
    get loggedId() {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('LoggedId'));
    }
    getspecailValue(value) {
      return value.toFixed(this.decimalValueDefault);
    }
  ngOnInit() {
    this.invoiceId = 1001;
    this.isInvoiceCreateFlag = false;
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
    this.isPdfDowloaded = false;
    this.iQuotesViewModel = {
      createdBy: 0,
      createdDate: moment().format(),
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
      quoteId:0,
      emailStatusId:0,
      qmsQuoteIdEncrypt:'',
      whoPaysForShipping:0,
      qmsQuoteLeadTimeAddList:[],
      qmsCustomerContactId:0
    };
    this.iQuotesViewModel1 = {
      createdBy: 0,
      createdDate: moment().format(),
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
      quoteId:0,
      emailStatusId:0,
      qmsQuoteIdEncrypt:'',
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
    this.probabilityStatus();
    this.getQmsQuantityParts();
    this.qmsStatus();
    this.getInvoiceNumber();
    this.checkIsInvoiceExist();
  }

  ngOnChanges(changes) {
    this.getQmsQuantityParts();
  }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  getQmsQuantityParts() {
    this.IQmsPartQuantityListColl = [];
    this._qmsService.getQmsQuantityParts(this.mqsQuoteId).subscribe(
      result => {
        if (result['result'] === true) {
          localStorage.setItem('pdfModel', JSON.stringify(result['data']));
          this.iQuotesViewModel = result['data']['reviewQuoteDetailsViewModel'];
          this.sortProFilterValue =  this.iQuotesViewModel.probability;
          this.IQmsPartQuantityListColl = result['data']['reviewQuotePartQuantitiesListViewModel'];
          this.iReviewQuoteBasicInfoViewModel = result['data']['reviewQuoteBasicInfoViewModel'];
          if( this.iQuotesViewModel.whoPaysForShipping !== null && this.iQuotesViewModel.whoPaysForShipping !== 0 && this.iQuotesViewModel.whoPaysForShipping !== undefined) {
            this.whoPaysForShippingText = (this.iQuotesViewModel.whoPaysForShipping  == 1)?'Buyer':'Manufacturer';
          }
          this.isLoader = false;
        }
      },
      error => {
        // this.handleError(error);
      },
      () => { }
    );
  }
  closeQuoteReviewDrawer() {
    this._qmsService.set(false, 'showSidePanel');
    this._qmsService.set(false, 'isQuoteReviewDrawer');
    if (this.isProbabilityChanged || this.isStatusChanged || this.isPdfDowloaded) {
      this._qmsService.set(true, 'quoteReviewDrawerClosed');
    }
  }
  getPartInfo(partNo) {
    return this.IQmsPartQuantityListColl.find(m => m.partNo === partNo).partName;
  }

  getTotalQuantity(leval, partNo) {
    const mis =  this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const tol =  this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const ship =  this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const priceData = this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const price = (priceData ?   priceData.perunitprice : 0) * (priceData ?  priceData.partqty : 0);
    const total =  (mis ? mis.miscellaneousamount : 0) + ( tol ? tol.toolingamount : 0) + ( ship ? ship.shippingamount : 0 ) + price;
    if (total === 0) {
      return '';
    } else {
      return  total;
    }
  }
  openEditQms() {
    localStorage.setItem('qmsQuoteId' , this.mqsQuoteId.toString());
    if(this.isDraft == true) {
      localStorage.setItem('qmspage' ,'draftQms');
    } else {
      localStorage.setItem('qmspage' ,'myQms');
    }

    this.router.navigate(['/qms/createquotes']);
  }

  openQMSDetailsPage( qmsQuoteId, qmsId ) {
    event.stopPropagation();
    localStorage.setItem( 'qmsId' , qmsId);
    this._qmsService.set(qmsId, 'qmsId');
    this.router.navigate(['/qms/qmsdetail' ,qmsQuoteId]);
  }
  openCreateInvoicePage() {
    if(this.isInvoiceCreateFlag){
      this.router.navigate(['/qms/createinvoice'], {
        queryParams: {
          qmsQuoteId: this.iQuotesViewModel.qmsQuoteIdEncrypt,
        }
      });
    } else{
      this.modalService.open( this.qmsBeta, {backdrop:'static'} );
    }
    // this.router.navigate(['/qms/createinvoice'], {
    //   queryParams: {
    //     qmsQuoteId: this.iQuotesViewModel.qmsQuoteIdEncrypt,
    //   }
    // })
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
  addProbabilitytoQMS() {
    this.iQuotesViewModel1.qmsQuoteId = this.mqsQuoteId;
    this.iQuotesViewModel1.probability = this.sortProFilterValue;
    this._qmsService.addQmsQuoteDetails(this.iQuotesViewModel1).subscribe(res => {
      if (res['result'] === true) {
        this.isProbabilityChanged = true;
        this._toastr.success('Probability is updated successfully.', 'Success!');
      }
    }, error => {
      this._rfqService.handleError(error);
    });
  }

  callPdf() {
    this.isLoaderPDF = true;
    this.isEmilPdfPreview = true;
  }
  isPdfDownload() {
    if(localStorage.getItem('isPdfDownload') === 'false') {
      localStorage.removeItem('isPdfDownload');
      this.isEmilPdfPreview = false;
      this.isLoaderPDF = false;
    }
  }

  downloadAllFiles(fileCompArray: string[], partfile, partId, quoteName) {

    ++this.isFileDownloaded;

    let Downloadallfiles = {
      filename: [],
      rfQ_Id: 0,
      part_id: 0,
      // quote_Id: 0
      quote_Name: ''
    }
    this.temp = [];
    let data = JSON.stringify(fileCompArray);
    this.temp = JSON.parse(data);
    if (partfile !== '') {
      this.temp.push(partfile);
    }
     Downloadallfiles.filename = this.temp;
     Downloadallfiles.part_id = partId;
    //  Downloadallfiles.quote_Id = this.mqsQuoteId;
     Downloadallfiles.quote_Name = quoteName;

    this._rfqService.getDownloadAllFileURL(Downloadallfiles).subscribe(response => {

      if (response.result === true) {
        const resData = response.data;
        const filelink = resData.privateFileFileName;
        if (filelink) {
          if (/(iP)/g.test(navigator.userAgent)) {
            // alert('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(filelink, '_blank');
          }
          // If in Chrome or Safari - download via virtual link click
          const link = document.createElement('a');
          link.href = filelink;

          link.setAttribute('target', '_blank');

          // Dispatching click event.
          if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
          }
        }
        --this.isFileDownloaded;

      } else {
          --this.isFileDownloaded;
      }
    } , error => {
        --this.isFileDownloaded;
    })
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

          if (link.download !== undefined && isDownload ) {
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
  isDraftPage() {
    return this._qmsService.get('isDraftPage');
  }
  getProbVisibility() {
    return this._qmsService.get('disableProbability');
  }
  /* This function is used to get qms status list. */
  qmsStatus() {
    this._qmsService.GetQMSQuoteStatus(this.loggedCompanyId,this.loggedId).subscribe(res => {
      if (res['isError'] === false) {
        this.qmsAllStatus = res['data'].data;
      } else {
        this.qmsAllStatus = [];
      }
    })
  }
  /* This function is used to change qms status. */
  changeQmsStatus($event) {
    this._qmsService.QMSQuoteStatus(this.mqsQuoteId, $event.target.value).subscribe(res => {
      if (res['isError'] === false) {
        this.isStatusChanged = true;
        this._toastr.success('QMS Status Update Successfully.', 'Success!');
      }
    })
  }
  pdfDownload(event){
    this.isPdfDowloaded = event;
  }
  getInvoiceNumber(){
    this._qmsService.GetInvoiceStartingSeqNo(this.loggedCompanyId,false).subscribe(
      res=>{
        if(!res.error){
          if(res.data != null && res.data != undefined && res.data != ''){
            this.invoiceId = res.data;
          }else{
            this.invoiceId = 1001;
          }
         
        }
        else{
          this.invoiceId= 1001;
        }
      }
    );
  }
  saveInvoiceNumber(){
    this._qmsService.setInvoiceStartingSeqNo(this.loggedCompanyId, this.invoiceId).subscribe(
      res=>{
        if(!res.error){
          this.router.navigate(['/qms/createinvoice'], {
            queryParams: {
              qmsQuoteId:this.iQuotesViewModel.qmsQuoteIdEncrypt,
            }
          });
        }
      }
    );
  }
  checkIsInvoiceExist(){
    this._qmsService.getCheckIsInvoiceExist(this.loggedCompanyId).subscribe(
      res=>{
        if(!res.error){
          this.isInvoiceCreateFlag = res.data;
        }
      }
    );
  }
}
