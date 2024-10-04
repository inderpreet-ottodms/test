import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  IQmsPartQuantityList,
  IQMSQuoteReceiptPDFViewModel,
  IQmsQuotesViewModel,
  IReviewQuoteBasicInfoViewModel,
  QmsSpecialFeesList,
  QMSActivityStatusModel
} from '../../../core/models/qmsModel';
import {
  QmsService
} from '../../../core/services/qms/qms.service';
import {
  IContactViewModel
} from '../../../core/models/accountModel';
import {
  ToastrService
} from 'ngx-toastr';
import * as moment from 'moment';
import { MasterService } from '../../../core/services/master/master.service';
import {
  appConstants
} from '../../../core/config/constant';
@Component({
  selector: 'app-qms-pdf',
  templateUrl: './qms-pdf.component.html',
  styleUrls: ['./qms-pdf.component.scss']
})
export class QmsPdfComponent implements OnInit {
  @Input() qmsId: number;
  @Input() isDownload: number;
  @Output() isPdfDownload = new EventEmitter < boolean > ();
  IQmsPartQuantityListColl: IQmsPartQuantityList[];
  iContactViewModel: IContactViewModel;
  PdfModel: IQMSQuoteReceiptPDFViewModel;
  isPdfModel: boolean;
  iQuotesViewModel: IQmsQuotesViewModel;
  iReviewQuoteBasicInfoViewModel: IReviewQuoteBasicInfoViewModel;
  whoPaysForShippingText: string;
  QmsSpecialFeesListViewModel: QmsSpecialFeesList[];
  feeTotal: number;
  qmsActivityStatusModel: QMSActivityStatusModel;
  decimalValueDefault: number;
  showZero:any;
  /* pdf required external image link  */
  defaultUrl = 'https://s3.us-east-2.amazonaws.com/mfg.mp2020/logos/636936145894211896_S3_avatarmanubasic.svg';
  constructor(private _qmsService: QmsService, private _toastr: ToastrService,private _masterService:MasterService) {
    this.isPdfModel = false;

  }

  ngOnInit() {
     this.showZero=0.0000;
    this.decimalValueDefault = null;
    if (appConstants.settingDefault.decimalValueDefault == null || appConstants.settingDefault.decimalValueDefault == undefined) {
      this._masterService.getDefaultQmsDecimalPlaces(this.loggedId).subscribe(res => {
        if (!res.isError) {
          appConstants.settingDefault.decimalValueDefault = res.data;
          this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
          this.showZero= this.showZero.toFixed(this.decimalValueDefault);
        }
      })
    } else {
      this.decimalValueDefault = appConstants.settingDefault.decimalValueDefault;
      this.showZero= this.showZero.toFixed(this.decimalValueDefault);

    }
    this.feeTotal = 0;
    this.PdfModel = {
      QuoteId: '',
      toEmailId: '',
      htmlQuoteReport: '',
      errorMessage: '',
      result: false
    };
    this.qmsActivityStatusModel = {
      "qmsQuoteId": 0,
      "qmsQuoteActivityid": 101,
      "supplierId": this.loggedId
    }
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
      quoteId: 0,
      emailStatusId: 0,
      qmsQuoteIdEncrypt: '',
      whoPaysForShipping: 0,
      qmsQuoteLeadTimeAddList: [],
      qmsCustomerContactId:0
    };

    this.iReviewQuoteBasicInfoViewModel = {
      customer: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
    }
    this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    if (this.isDownload === null || this.isDownload === undefined || this.isDownload === 0) {
      this.isDownload === 1;
    }
    this.getQmsQuantityParts();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
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
      tempAdd += mailingAddressData.state + ' ';
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
  getQmsQuantityParts() {
    // const pdfModelFromLocal = JSON.parse(localStorage.getItem('pdfModel'));
    // if (pdfModelFromLocal !== null) {
    //   this.iQuotesViewModel = pdfModelFromLocal['reviewQuoteDetailsViewModel'];
    //   this.IQmsPartQuantityListColl = pdfModelFromLocal['reviewQuotePartQuantitiesListViewModel'];
    //   this.iReviewQuoteBasicInfoViewModel = pdfModelFromLocal['reviewQuoteBasicInfoViewModel'];
    //   this.isPdfModel = true;
    //   setTimeout(() => {
    //     this.GenerateRFQdetailsPDF();
    //   }, 1000);
    //   localStorage.setItem('pdfModel', null);
    // } else {
    // debugger;
    this.IQmsPartQuantityListColl = [];
    this._qmsService.getQmsQuantityParts(this.qmsId).subscribe(
      result => {
        if (result['result'] === true) {
          this.isPdfModel = true;
          this.iQuotesViewModel = result['data']['reviewQuoteDetailsViewModel'];
          this.IQmsPartQuantityListColl = result['data']['reviewQuotePartQuantitiesListViewModel'];
          this.iReviewQuoteBasicInfoViewModel = result['data']['reviewQuoteBasicInfoViewModel'];
          if (this.IQmsPartQuantityListColl != undefined && this.IQmsPartQuantityListColl.length != 0) {
            this.IQmsPartQuantityListColl.forEach(element => {
              element.subSpecialTotal = 0;
              if (element.qmsSpecialFeesListViewModel != undefined && element.qmsSpecialFeesListViewModel.length != 0) {
                element.qmsSpecialFeesListViewModel.forEach(item => {
                  element.subSpecialTotal += item.value;
                })
              }

            })
          }
          if (this.iQuotesViewModel.whoPaysForShipping !== null &&
            this.iQuotesViewModel.whoPaysForShipping !== 0 &&
            this.iQuotesViewModel.whoPaysForShipping !== undefined) {
            this.whoPaysForShippingText = (this.iQuotesViewModel.whoPaysForShipping == 1) ? 'Buyer' : 'Manufacturer';
          }
          this.qmsActivityStatusModel.qmsQuoteId = this.qmsId;
          if (this.isDownload === 1 || this.isDownload === undefined) {
            setTimeout(() => {
              this.GenerateRFQdetailsPDF();
            }, 1000);
          }


        }
      },
      error => {
        // this.handleError(error);
      },
      () => {}
    );
    // }
  }
  getFeeTypeCost(level, feedata) {
    let data = feedata.find(x => x.quantityLevel === level);
    if (data) {
      return feedata.find(x => x.quantityLevel === level).value.toFixed(this.decimalValueDefault);

    } else {
      return '';
    }


  }
  getspecailValue(value) {
    return value.toFixed(this.decimalValueDefault);
  }
  getShowZero() {
    return '$' + this.showZero;
  }
  getFeetypeTotal(level, qmsQuotePartId) {
    // return this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId)?
    // this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId).qtylevelSum.toFixed(4):''
    let data = this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId);
    if (data && data.qtylevelSum !=null &&  data.qtylevelSum != undefined) {
      return this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId) ?
        this.IQmsPartQuantityListColl.find(m => m.qtylevel === level && m.qmsQuotePartId == qmsQuotePartId).qtylevelSum.toFixed(this.decimalValueDefault) : '';
    } else {
      return '';
    }

  }
  getPartInfo(qmsQuotePartId) {
    return this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId) ?
      this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId).partName : '';
  }
  getPartProcess(qmsQuotePartId) {
    return this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId) ?
      this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId).process : '';
  }
  getPartMaterial(qmsQuotePartId) {
    return this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId) ?
      this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId).material : '';
  }
  getPartPostProcess(qmsQuotePartId) {
    return this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId) ?
      this.IQmsPartQuantityListColl.find(m => m.qmsQuotePartId == qmsQuotePartId).postProduction : '';
  }
  getpartqty(leval, qmsQuotePartId) {
    return this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.qmsQuotePartId == qmsQuotePartId) ?
      this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.qmsQuotePartId == qmsQuotePartId).partqty + ' ' + this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.qmsQuotePartId == qmsQuotePartId).partQtyUnit : '';
  }
  getperunitprice(leval, partNo) {
    return this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo) ?
      this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo).perunitprice : '';
  }
  gettoolingamount(leval, partNo) {
    return this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo) ?
      this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo).toolingamount : '';
  }
  getshippingamount(leval, partNo) {
    return this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo) ?
      this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo).shippingamount : '';
  }
  getmiscellaneousamount(leval, partNo) {
    return this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo) ?
      this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo).miscellaneousamount : '';
  }
  getTotalQuantity(leval, partNo) {
    const mis = this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const tol = this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const ship = this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const priceData = this.IQmsPartQuantityListColl.find(m => m.qtylevel === leval && m.partNo === partNo);
    const price = (priceData ? priceData.perunitprice : 0) * (priceData ? priceData.partqty : 0);
    const total = (mis ? mis.miscellaneousamount : 0) + (tol ? tol.toolingamount : 0) + (ship ? ship.shippingamount : 0) + price;
    if (total === 0) {
      return '';
    } else {
      return total;
    }
  }

  GenerateRFQdetailsPDF() {
    const data = document.getElementById('contentToConvert').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlQuoteReport = newdata;
    this.PdfModel.QuoteId = this.qmsId.toString();
    this._qmsService.GenerateQuotedetailsPDF(this.PdfModel).subscribe(
      result => {
        if (result.result === true) {
          if (result['result'] === true) {
            window.open(result['privateFileFileName'], '_blank');
          }
          this.isPdfModel = false;
          // localStorage.setItem('isPdfDownload', 'false');
          this._toastr.success(result['errorMessage'], 'Success!');
          this.setQMSActivity();
        } else {
          this.isPdfModel = false;
          this._toastr.error(result['errorMessage'], 'Error!');
          localStorage.setItem('isPdfDownload', 'false');

        }

      },
      error => {
        this.isPdfModel = false;
        localStorage.setItem('isPdfDownload', 'false');


      },
      () => {}
    );
  }
  setQMSActivity(){
    this._qmsService.setQMSActivityStatus(this.qmsActivityStatusModel).subscribe(
      response=> {
        // // debugger;
        // console.log(response);
        this.isPdfDownload.emit(true);
        localStorage.setItem('isPdfDownload', 'false');
      },
      error=>{
        this.isPdfDownload.emit(true);
        localStorage.setItem('isPdfDownload', 'false');
      }
    );
  }
}
