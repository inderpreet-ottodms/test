import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  IContactViewModel
} from '../../../core/models/accountModel';
import {
  RfqService
} from '../../../core/services/rfq/rfq.service';
import {
  IRFQViewModel,
  PdfModel
} from '../../../core/models/rfqModel';
import {
  ToastrService
} from 'ngx-toastr';
import {
  ProfileService
} from '../../../core/services/profile/profile.service';
import {
  IPartLibraryModel
} from '../../../core/models/partModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rfq-quote-pdf',
  templateUrl: './rfq-quote-pdf.component.html',
  styleUrls: ['./rfq-quote-pdf.component.scss']
})
export class RfqQuotePdfComponent implements OnInit {

  @Input() rfqId: number;
  isPdfModel: boolean;
  iContactViewModel: IContactViewModel;
  iBuyerContactViewModel: IContactViewModel;
  irfqViewModel: IRFQViewModel;
  iReviewPartsViewModelColl: IPartLibraryModel[];
  PdfModel: PdfModel;
  quoteMessage: string;
  supplierPaymentTerms: string;
  defaultUrl = 'https://s3.us-east-2.amazonaws.com/mfg.mp2020/logos/636936145894211896_S3_avatarmanubasic.svg'
  @Output() isPdfDownload = new EventEmitter();

  constructor(private _rfqService: RfqService, private _toastr: ToastrService, private _profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.isPdfModel = false;
    this.irfqViewModel = {
      rfqId: 0,
      isAllPartDetailsFilled: null,
      rfqName: '',
      certificateList: [],
      payment_term_id: null,
      contactIdEncrypt: '',
      is_Default_payment_term_id: false,
      certificateIdList: [],
      rfqDescription: '',
      contactId: 0,
      rfqStatus: '',
      rfqCreatedOn: '',
      rfqStatusId: 0,
      isSpecialCertificationsByManufacturer: false,
      isSpecialInstructionToManufacturer: false,
      specialInstructionToManufacturer: '',
      importancePrice: 1,
      importanceSpeed: 2,
      importanceQuality: 3,
      quotesNeededBy: null,
      awardDate: null,
      preferredManufacturingLocation: 0,
      isPartialQuotingAllowed: false,
      whoPaysForShipping: 1,
      shipTo: 0,
      isRegisterSupplierQuoteTheRfq: true,
      prefNdaType: 0,
      postProductionProcessId: 0,
      errorMessage: '',
      result: false,
      rfqBuyerStatus: null,
      userType: 0,
      isDefaultPrefferedManufacturingLocation: false,
      rfqGeneralAttachmentsList: [],
      certificationsByManufacturer: '',
      isDefaultNDAdetails: false,
      ndaContent: '',
      ndaTypekey: '',
      preferredMfgLocationIds: [],
      partCount: 0,
      isProfileNDA: false,
      isDefaultWhoPaysForShipping: false,
      rfqThumbnail: '',
      isActive: false,
      isUpdatedFromVision: false,
      modifiedBy: 0,
      SpecialinviteList: [],
      companyId: 0,
      ndaFile: '',
      ndaFileId: 0,
      isRfqLike: false,
      isRfqDisLike: false,
      isOnlyDateChanged: false,
      isAwarded: false,
      isShopIQAvailable: false,
      maxDeliveryDate: null,
      deliveryDate: null,
      isDefaultPrefRfqCommunicationMethod: false,
      prefRfqCommunicationMethod: 117,
      isStripeSupplier:false,
      isAllowQuoting :false,
      isAwardingEnabled:false
    };
    this.PdfModel = {
      htmlRFQdetails: '',
      pageURL: '',
      rfqId: ''
    };
    this.iContactViewModel = JSON.parse(localStorage.getItem('iContactViewModel'));
    this.quoteMessage = '';
    this.supplierPaymentTerms = '';
    this.getRFQDetails();
  }
  /* This function is used to format the address */
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
  /* This function is uded to value is empty or not */
  checkEmpty(val) {
    if (val !== null && val !== undefined && val !== '') {
      return true;
    } else {
      return false;
    }
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  /* This function is used to get the RFQ details */
  getRFQDetails() {
    this._rfqService.getRFQExtraDetails(this.rfqId, this.loggedId, '').subscribe(
      result => {
        if (result.result === true) {
          this.irfqViewModel = result;
          this._rfqService.set(this.irfqViewModel.contactIdEncrypt, 'currentRfqConatctId');
          this.getProfileDetails();
          this.getPartsByRFQId();
        } else if(result.errorMessage === 'InValidBuyer.') {
          // if(this._rfqService.isInValidBuyerWarningShown === false) {
            this._toastr.warning('Please login with valid buyer', 'Warning!');
            this.router.navigate(['dashboard/buyer/default']);
          // } 
        }
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
  }
  /* This function is used to get the buyer contact details */
  getProfileDetails() {
    if (this.irfqViewModel.contactIdEncrypt !== null && this.irfqViewModel.contactIdEncrypt !== undefined && this.irfqViewModel.contactIdEncrypt !== '') {
      this._profileService.getProfileDetails(this.irfqViewModel.contactIdEncrypt, this.loggedId).subscribe(
        result => {
          this.iBuyerContactViewModel = result;
          this.isPdfModel = true;
        },
        error => {
          this.handleError(error);
        },
        () => {}
      );
    }
  }
  /* This function is used to get the RFq Part details */
  getPartsByRFQId() {
    const isFromProgress = this._rfqService.get('rfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === 13) {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._rfqService.getReviewRfqParts(this.rfqId, this.loggedId, IsRfqResubmitted).subscribe(
      result => {
        this.iReviewPartsViewModelColl = result;
        this.quoteMessage = this.iReviewPartsViewModelColl[0].messageDesc;
        this.supplierPaymentTerms = this.iReviewPartsViewModelColl[0].supplierPaymentTerms;
        setTimeout(() => {
          this.GenerateRFQdetailsPDF();
        }, 1000);
      },
      error => {
        this.handleError(error);
      },
      () => {}
    );
  }
  /* This function is used to get the part quantity by level */
  getpartqty(leval, rfqPartId, index) {
    const partData = this.iReviewPartsViewModelColl[index];
    const unit = partData.partQtyUnitName;
    return partData.rfqPartQuantityList.find(m => m.quantityLevel === leval) ?
      partData.rfqPartQuantityList.find(m => m.quantityLevel === leval).partQty + ' ' + unit : '';
  }
  /* This function is used to get the per unit price by level */
  getperunitprice(leval, rfqPartId, index) {
    const partData = this.iReviewPartsViewModelColl[index];
    return partData.rfqPartQuantityList.find(m => m.quantityLevel === leval) ?
      partData.rfqPartQuantityList.find(m => m.quantityLevel === leval).perUnitPrice.toFixed(4) : '';
  }
  /* This function is used to get the tooling amount by level */
  gettoolingamount(leval, rfqPartId, index) {
    const partData = this.iReviewPartsViewModelColl[index];
    return partData.rfqPartQuantityList.find(m => m.quantityLevel === leval) ?
      partData.rfqPartQuantityList.find(m => m.quantityLevel === leval).toolingAmount.toFixed(4) : '';
  }
  /* This function is used to get the miscellaneous amount by level */
  getmiscellaneousamount(leval, rfqPartId, index) {
    const partData = this.iReviewPartsViewModelColl[index];
    return partData.rfqPartQuantityList.find(m => m.quantityLevel === leval) ?
      partData.rfqPartQuantityList.find(m => m.quantityLevel === leval).miscellaneousAmount.toFixed(4) : '';
  }
  /* This function is used to get the shipping amount by level */
  getshippingamount(leval, rfqPartId, index) {
    const partData = this.iReviewPartsViewModelColl[index];
    return partData.rfqPartQuantityList.find(m => m.quantityLevel === leval) ?
      partData.rfqPartQuantityList.find(m => m.quantityLevel === leval).shippingAmount.toFixed(4) : '';
  }
  /* This function is used to get the total amount by level */
  getTotalQuantity(leval, rfqPartId, index) {
    const partData = this.iReviewPartsViewModelColl[index];
    return partData.rfqPartQuantityList.find(m => m.quantityLevel === leval) ?
      partData.rfqPartQuantityList.find(m => m.quantityLevel === leval).qtyPrice.toFixed(4) : '';
  }
  /* This function is used to generate the pdf */
  GenerateRFQdetailsPDF() {
    const data = document.getElementById('contentToConvert').innerHTML;
    const newdata = data.substring(1, data.length - 1);
    this.PdfModel.htmlRFQdetails = newdata;
    this.PdfModel.rfqId = this.rfqId.toString();
    this._rfqService.GenerateRFQdetailsPDF(this.PdfModel).subscribe(
      result => {
        this.isPdfModel = false;
        if (result['result'] === true) {
          window.open(result['privateFileFileName'], '_blank');
          this.isPdfDownload.emit(true);
        }
      },
      error => {
        this.isPdfModel = false;
        this._rfqService.handleError(error);
      },
      () => {}
    );
  }
  handleError(error) {
    if (error.status === 0) {
      this._toastr.error('Please check internet connection', 'Error!');
    } else if (error.status === 400) {
      this._toastr.error(JSON.stringify(error.error), 'Error!');
    }
  }
}
