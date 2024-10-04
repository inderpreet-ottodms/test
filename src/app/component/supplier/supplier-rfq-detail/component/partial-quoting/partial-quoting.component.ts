import { Component, OnInit, Input } from '@angular/core';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { IRfqQuoteItemsViewModel, IRfqQuoteSupplierQuoteViewModel, IRFQPartQuantityQuote } from '../../../../../core/models/rfqModel';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { IPartLibraryModel } from '../../../../../core/models/partModel';

@Component({
  selector: 'app-partial-quoting',
  templateUrl: './partial-quoting.component.html',
  styleUrls: ['./partial-quoting.component.scss']
})
export class PartialQuotingComponent implements OnInit {
  @Input('rfqId') rfqId: number;
  @Input('quotesNeededBy') quotesNeededBy:any;
  iRfqQuoteItemsViewModel1: IRfqQuoteItemsViewModel;
  iRfqQuoteItemsViewModel2: IRfqQuoteItemsViewModel;
  iRfqQuoteItemsViewModel3: IRfqQuoteItemsViewModel;
  iRfqQuoteItemsViewModelColl: IRfqQuoteItemsViewModel [];
  iReviewPartsViewModelColl: IPartLibraryModel[];
  iReviewPartsViewModel: IPartLibraryModel;
  part1Div: boolean;
  part2Div: boolean;
  part3Div: boolean;
  partName: string;
  partNumber: string;
  isPart1Present: boolean;
  isPart2Present: boolean;
  isPart3Present: boolean;
  isPart1Error: boolean;
  isPart2Error: boolean;
  isPart3Error: boolean;
  part1Total: number;
  part2Total: number;
  part3Total: number;
  part1Quantity: number;
  part2Quantity: number;
  part3Quantity: number;
  currentPartId: number;
  iRfqQuoteSupplierQuoteViewModel: IRfqQuoteSupplierQuoteViewModel;
  totalPart: number;
  iRFQPartQuantityQuoteColl: IRFQPartQuantityQuote[];
  isLoader: boolean;
  iRFQPartQuantityQuote: IRFQPartQuantityQuote;
  supplierQuoteId: number;
  priceLable: string;
  isApiResponse: boolean;
  isQuoteSubmitted: boolean;
  disableSave: boolean;
  currentIndex:number;
  isQuoteSubmit: boolean;
  constructor(private _rfqService: RfqService, private _supplierService: SupplierService,
    private _toastr: ToastrService, private _SupplierService: SupplierService) {
    this.isLoader = true;
    this.part1Div = true;
    this.supplierQuoteId = this._SupplierService.get('currentrfqQuoteSupplierQuoteId');
    this.part2Div = true;
    this.isApiResponse = false;
    this.part3Div = true;
    this.isPart1Error = false;
    this.isPart2Error = false;
    this.isPart3Error = false;
    this.part1Total = 0;
    this.part3Total = 0;
    this.part2Total = 0;
    this.part1Quantity = 0;
    this.part2Quantity = 0;
    this.part3Quantity = 0;
    this.totalPart = 0;
    this.isPart1Present = true;
    this.isPart2Present = false;
    this.isPart3Present = false;
    const partCount = this._rfqService.get('partCount');
    const quantityData = this._rfqService.get('quantityData');
    this.isQuoteSubmitted =  this._rfqService.get('isRfqAwarded');
    this.iReviewPartsViewModelColl = this._rfqService.get('partList');
    this.currentPartId = this._rfqService.get('currentQuotePartId');
    this.currentIndex=this._rfqService.get('partIndex');
    // this.iReviewPartsViewModel = this.iReviewPartsViewModelColl.find(m => m.partId === this.currentPartId);
    this.iReviewPartsViewModel = this.iReviewPartsViewModelColl[this.currentIndex];
    
    // partQty
    let qty1 = quantityData.find(x=>x.quantityLevel == 0);
    let qty2 = quantityData.find(x=>x.quantityLevel == 1);
    let qty3 = quantityData.find(x=>x.quantityLevel == 2);

    if (qty1 != undefined && qty1 != null) {
      this.isPart1Present = true;
      this.part1Quantity = qty1.partQty;
    }
    if (qty2 != undefined && qty2 != null) {

      this.isPart2Present = true;
      this.part2Quantity = qty2.partQty;
    }
    if (qty3 != undefined && qty3 != null) {

      this.isPart3Present = true;
      this.part3Quantity = qty3.partQty;
    }

    this.iRFQPartQuantityQuoteColl = [];

    this.priceLable = 'Please Enter Price';
  }


  // get currentRfqId() {
  //   // tslint:disable-next-line:radix
  //   return parseInt(localStorage.getItem('supplierRfqDetailId'));
  // }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  showWarning () {
    this._toastr.warning('RFQ Has been awarded by Buyer.', 'Warning!');
  }
  updateAvailableQuantity() {
    const quantity1data = this.iRFQPartQuantityQuoteColl.find(m => m.quantityLevel === 0);
    if (quantity1data !== undefined && quantity1data !== null) {
      this.iRfqQuoteItemsViewModel1.perUnitPrice = (quantity1data.perUnitPrice === 0) ? null : quantity1data.perUnitPrice;
      this.iRfqQuoteItemsViewModel1.rfqPartQuantityId = quantity1data.rfqPartQuantityId;
      this.iRfqQuoteItemsViewModel1.rfqQuoteItemsId = quantity1data.rfqQuoteItemsId;
      this.iRfqQuoteItemsViewModel1.rfqQuoteSupplierQuoteId = quantity1data.rfqQuoteSupplierQuoteId;
      this.iRfqQuoteItemsViewModel1.shippingAmount = quantity1data.shippingAmount;
      this.iRfqQuoteItemsViewModel1.toolingAmount = quantity1data.toolingAmount;
      this.iRfqQuoteItemsViewModel1.miscellaneousAmount = quantity1data.miscellaneousAmount;
      this.iRfqQuoteItemsViewModel1.estLeadTimeRange=(quantity1data.estLeadTimeRange)?quantity1data.estLeadTimeRange:'Days';
      this.iRfqQuoteItemsViewModel1.estLeadTimeValue=(quantity1data.estLeadTimeValue != 0)?quantity1data.estLeadTimeValue:null;


      this.blur1();
    }
    const quantity2data = this.iRFQPartQuantityQuoteColl.find(m => m.quantityLevel === 1);
    if (quantity2data !== undefined && quantity2data !== null) {
      this.iRfqQuoteItemsViewModel2.perUnitPrice = (quantity2data.perUnitPrice === 0) ? null : quantity2data.perUnitPrice;
      this.iRfqQuoteItemsViewModel2.rfqPartQuantityId = quantity2data.rfqPartQuantityId;
      this.iRfqQuoteItemsViewModel2.rfqQuoteItemsId = quantity2data.rfqQuoteItemsId;
      this.iRfqQuoteItemsViewModel2.rfqQuoteSupplierQuoteId = quantity2data.rfqQuoteSupplierQuoteId;
      this.iRfqQuoteItemsViewModel2.shippingAmount = quantity2data.shippingAmount;
      this.iRfqQuoteItemsViewModel2.toolingAmount = quantity2data.toolingAmount;
      this.iRfqQuoteItemsViewModel2.miscellaneousAmount = quantity2data.miscellaneousAmount;
      this.iRfqQuoteItemsViewModel2.estLeadTimeRange=(quantity2data.estLeadTimeRange)?quantity2data.estLeadTimeRange:'Days';
      this.iRfqQuoteItemsViewModel2.estLeadTimeValue=(quantity2data.estLeadTimeValue != 0)?quantity2data.estLeadTimeValue:null;
      this.blur2();
    }
    const quantity3data = this.iRFQPartQuantityQuoteColl.find(m => m.quantityLevel === 2);
    if (quantity3data !== undefined && quantity3data !== null) {
      this.iRfqQuoteItemsViewModel3.perUnitPrice =  (quantity3data.perUnitPrice === 0) ? null : quantity3data.perUnitPrice;
      this.iRfqQuoteItemsViewModel3.rfqPartQuantityId = quantity3data.rfqPartQuantityId;
      this.iRfqQuoteItemsViewModel3.rfqQuoteItemsId = quantity3data.rfqQuoteItemsId;
      this.iRfqQuoteItemsViewModel3.rfqQuoteSupplierQuoteId = quantity3data.rfqQuoteSupplierQuoteId;
      this.iRfqQuoteItemsViewModel3.shippingAmount = quantity3data.shippingAmount;
      this.iRfqQuoteItemsViewModel3.toolingAmount = quantity3data.toolingAmount;
      this.iRfqQuoteItemsViewModel3.miscellaneousAmount = quantity3data.miscellaneousAmount;
      this.iRfqQuoteItemsViewModel3.estLeadTimeRange=(quantity3data.estLeadTimeRange)?quantity3data.estLeadTimeRange:'Days';
      this.iRfqQuoteItemsViewModel3.estLeadTimeValue=(quantity3data.estLeadTimeValue != 0)?quantity3data.estLeadTimeValue:null;
      this.blur3();
    }
  }
  GetRFQPartQuantity() {
    this.isLoader = true;

    if (this.supplierQuoteId !== 0) {
      this._supplierService.GetRFQPartQuantity(this.supplierQuoteId, this._rfqService.get('quotePartId')).subscribe(
        result => {

          if (result['result'] === true) {
            this.iRFQPartQuantityQuoteColl = result['data'];
            this.isLoader = false;
            this.updateAvailableQuantity();
          } else {
            this.iRFQPartQuantityQuoteColl = [];
            this.isLoader = false;
           // this.updateAvailableQuantity();
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    } else {
     // this.updateAvailableQuantity();
     this.isLoader = false;
    }

  }
  GetRFQPartQuantityQuoteBYRfqId() {
    this.isLoader = true;

    this._rfqService.GetRFQPartQuantityQuoteBYRfqId(this.iRFQPartQuantityQuote).subscribe(
      result => {
       // this.iRFQPartQuantityQuoteColl = result['data'];
       // this.isLoader = false;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  Focus1 () {
    const perUnitPrice = Number(this.iRfqQuoteItemsViewModel1.perUnitPrice);
    if (perUnitPrice === 0 && this.iRfqQuoteItemsViewModel1.perUnitPrice !== '') {
      this.iRfqQuoteItemsViewModel1.perUnitPrice = null;
      this.priceLable = 'Price Can Not Be Zero';
    } else {
      this.priceLable = 'Please Enter Price';
    }
    if (this.iRfqQuoteItemsViewModel1.perUnitPrice === 0 || this.iRfqQuoteItemsViewModel1.perUnitPrice * 1 === 0
      || this.iRfqQuoteItemsViewModel1.perUnitPrice === null) {
      this.iRfqQuoteItemsViewModel1.perUnitPrice = null;
    } else {
    }
  }
  Focus2 () {
    const perUnitPrice = Number(this.iRfqQuoteItemsViewModel2.perUnitPrice);
    if (perUnitPrice === 0 && this.iRfqQuoteItemsViewModel2.perUnitPrice !== '') {
      this.iRfqQuoteItemsViewModel2.perUnitPrice = null;
      this.priceLable = 'Price Can Not Be Zero';
    } else {
      this.priceLable = 'Please Enter Price';
    }
    if (this.iRfqQuoteItemsViewModel2.perUnitPrice === 0 || this.iRfqQuoteItemsViewModel2.perUnitPrice * 1 === 0
      || this.iRfqQuoteItemsViewModel2.perUnitPrice === null) {
      this.iRfqQuoteItemsViewModel2.perUnitPrice = null;
    } else {
    }
  }
  Focus3 () {
    const perUnitPrice = Number(this.iRfqQuoteItemsViewModel3.perUnitPrice);
    if (perUnitPrice === 0 && this.iRfqQuoteItemsViewModel3.perUnitPrice !== '') {
      this.iRfqQuoteItemsViewModel3.perUnitPrice = null;
      this.priceLable = 'Price Can Not Be Zero';
    } else {
      this.priceLable = 'Please Enter Price';
    }
    if (this.iRfqQuoteItemsViewModel3.perUnitPrice === 0 || this.iRfqQuoteItemsViewModel3.perUnitPrice * 1 === 0
      || this.iRfqQuoteItemsViewModel3.perUnitPrice === null) {
      this.iRfqQuoteItemsViewModel3.perUnitPrice = null;
    } else {
    }
  }
  blur1 () {
    // tslint:disable-next-line:radix
    this.part1Total = 0;
    const sum = this.iRfqQuoteItemsViewModel1.perUnitPrice as number * this.part1Quantity;
    const perUnitPrice = Number(this.iRfqQuoteItemsViewModel1.perUnitPrice);
    if (perUnitPrice === 0  && this.iRfqQuoteItemsViewModel1.perUnitPrice !== '') {
      this.iRfqQuoteItemsViewModel1.perUnitPrice = null;
      this.priceLable = 'Price Can Not Be Zero';
    } else {
      this.priceLable = 'Please Enter Price';
    }
    // tslint:disable-next-line:max-line-length
    const no1 = this.iRfqQuoteItemsViewModel1.miscellaneousAmount === null ||
    this.iRfqQuoteItemsViewModel1.miscellaneousAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel1.miscellaneousAmount * 1 ;
    const no2 = this.iRfqQuoteItemsViewModel1.toolingAmount === null
     || this.iRfqQuoteItemsViewModel1.toolingAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel1.toolingAmount * 1;
    const no3 = this.iRfqQuoteItemsViewModel1.shippingAmount === null
    || this.iRfqQuoteItemsViewModel1.shippingAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel1.shippingAmount * 1;
    const sum2 =  no1 + no2 + no3;
    this.part1Total = sum + sum2 ;
    this.totalPart = this.part1Total + this.part2Total + this.part3Total;
  }
  blur2 () {
    this.part2Total = 0;
    const sum = this.iRfqQuoteItemsViewModel2.perUnitPrice as number * this.part2Quantity;
    // tslint:disable-next-line:max-line-length
    const perUnitPrice = Number(this.iRfqQuoteItemsViewModel2.perUnitPrice);
    if (perUnitPrice === 0  && this.iRfqQuoteItemsViewModel2.perUnitPrice !== '') {
      this.iRfqQuoteItemsViewModel2.perUnitPrice = null;
      this.priceLable = 'Price Can Not Be Zero';
    } else {
      this.priceLable = 'Please Enter Price';
    }
    const no1 = this.iRfqQuoteItemsViewModel2.miscellaneousAmount === null ||
    this.iRfqQuoteItemsViewModel2.miscellaneousAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel2.miscellaneousAmount * 1 ;
    const no2 = this.iRfqQuoteItemsViewModel2.toolingAmount === null ||
    this.iRfqQuoteItemsViewModel2.toolingAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel2.toolingAmount * 1;
    const no3 = this.iRfqQuoteItemsViewModel2.shippingAmount === null ||
    this.iRfqQuoteItemsViewModel2.shippingAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel2.shippingAmount * 1;
    const sum2 =  no1 + no2 + no3;
    this.part2Total = sum + sum2 ;
    this.totalPart = this.part1Total + this.part2Total + this.part3Total;
  }
  blur3 () {
    this.part3Total = 0;
    const sum = this.iRfqQuoteItemsViewModel3.perUnitPrice as number * this.part3Quantity;
    // tslint:disable-next-line:max-line-length
    const perUnitPrice = Number(this.iRfqQuoteItemsViewModel3.perUnitPrice);
    if (perUnitPrice === 0  && this.iRfqQuoteItemsViewModel3.perUnitPrice !== '') {
      this.iRfqQuoteItemsViewModel3.perUnitPrice = null;
      this.priceLable = 'Price Can Not Be Zero';
    } else {
      this.priceLable = 'Please Enter Price';
    }
    const no1 = this.iRfqQuoteItemsViewModel3.miscellaneousAmount === null ||
    this.iRfqQuoteItemsViewModel3.miscellaneousAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel3.miscellaneousAmount * 1 ;
    const no2 = this.iRfqQuoteItemsViewModel3.toolingAmount === null ||
    this.iRfqQuoteItemsViewModel3.toolingAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel3.toolingAmount * 1;
    const no3 = this.iRfqQuoteItemsViewModel3.shippingAmount === null  ||
    this.iRfqQuoteItemsViewModel3.shippingAmount === undefined ? 0 : this.iRfqQuoteItemsViewModel3.shippingAmount * 1;
    const sum2 =  no1 + no2 + no3;
    this.part3Total = sum + sum2 ;
    this.totalPart = this.part1Total + this.part2Total + this.part3Total;
  }
  initModels() {
    const partCount = this._rfqService.get('partCount');
    if (this.isPart1Present) {
     this.iRfqQuoteItemsViewModel1 = {
        awardAcceptedDate: new Date(),
        awardedDate: new Date(),
        awardedQty: this.iReviewPartsViewModel.rfqPartQuantityList[0].partQty,
        isAwardAccepted: false,
        rfqPartQuantityId: this.iReviewPartsViewModel.rfqPartQuantityList[0].rfqPartQuantityId,
        isAwrded: null,
        miscellaneousAmount: null,
        perUnitPrice: null,
        rfqPartId:  this._rfqService.get('quotePartId'),
        rfqQuoteItemsId: 0,
        rfqQuoteSupplierQuoteId: 0,
        shippingAmount: null,
        toolingAmount: null,
        estLeadTimeRange:'Days',
        estLeadTimeValue:null
      };
    } else {
      this.iRfqQuoteItemsViewModel1 = {
        awardAcceptedDate: new Date(),
        awardedDate: new Date(),
        awardedQty: 0,
        rfqPartQuantityId: 0,
        isAwardAccepted: false,
        isAwrded: null,
        miscellaneousAmount: null,
        perUnitPrice: null,
        rfqPartId:  this._rfqService.get('quotePartId'),
        rfqQuoteItemsId: 0,
        rfqQuoteSupplierQuoteId: 0,
        shippingAmount: null,
        toolingAmount: null,
        estLeadTimeRange:'Days',
        estLeadTimeValue:null

      };
    }
    if (this.isPart2Present) {
      this.iRfqQuoteItemsViewModel2 = {
        awardAcceptedDate: new Date(),
        awardedDate: new Date(),
        awardedQty: this.iReviewPartsViewModel.rfqPartQuantityList[1].partQty,
        isAwardAccepted: false,
        rfqPartQuantityId: this.iReviewPartsViewModel.rfqPartQuantityList[1].rfqPartQuantityId,
        isAwrded: null,
        miscellaneousAmount: null,
        perUnitPrice: null,
        rfqPartId: this._rfqService.get('quotePartId'),
        rfqQuoteItemsId: 0,
        rfqQuoteSupplierQuoteId: 0,
        shippingAmount: null,
        toolingAmount: null,
        estLeadTimeRange:'Days',
        estLeadTimeValue:null
      };
    } else {
      this.iRfqQuoteItemsViewModel2 = {
        awardAcceptedDate: new Date(),
        awardedDate: new Date(),
        awardedQty: 0,
        isAwardAccepted: false,
        rfqPartQuantityId: 0,
        isAwrded: null,
        miscellaneousAmount: null,
        perUnitPrice: 0,
        rfqPartId: this._rfqService.get('quotePartId'),
        rfqQuoteItemsId: 0,
        rfqQuoteSupplierQuoteId: 0,
        shippingAmount: null,
        toolingAmount: null,
        estLeadTimeRange:'Days',
        estLeadTimeValue:null
      };
    }
    if (this.isPart3Present) {
      this.iRfqQuoteItemsViewModel3 = {
        awardAcceptedDate: new Date(),
        awardedDate: new Date(),
        awardedQty: this.iReviewPartsViewModel.rfqPartQuantityList[2].partQty,
        rfqPartQuantityId:  this.iReviewPartsViewModel.rfqPartQuantityList[2].rfqPartQuantityId,
        isAwardAccepted: false,
        isAwrded: null,
        miscellaneousAmount: null,
        perUnitPrice: null,
        rfqPartId: this._rfqService.get('quotePartId'),
        rfqQuoteItemsId: 0,
        rfqQuoteSupplierQuoteId: 0,
        shippingAmount: null,
        toolingAmount: null,
        estLeadTimeRange:'Days',
        estLeadTimeValue:null
      };
    } else {
      this.iRfqQuoteItemsViewModel3 = {
        awardAcceptedDate: new Date(),
        awardedDate: new Date(),
        awardedQty: 0,
        rfqPartQuantityId:  0,
        isAwardAccepted: false,
        isAwrded: null,
        miscellaneousAmount: null,
        perUnitPrice: 0,
        rfqPartId: this._rfqService.get('quotePartId'),
        rfqQuoteItemsId: 0,
        rfqQuoteSupplierQuoteId: 0,
        shippingAmount: null,
        toolingAmount: null,
        estLeadTimeRange:'Days',
        estLeadTimeValue:null
      };
    }


  }

  ngOnInit() {
    this.initModels();
    this.iRfqQuoteItemsViewModelColl = [];
    this.iRfqQuoteSupplierQuoteViewModel = {
      rfqQuoteSupplierQuoteId: 0,
      rfqId: this.rfqId,
      contactId: this.loggedId,
      disableSubmitQuote: false,
      isQuoteSubmitted: false,
      paymentTerms: '',
      isPaytermAccepted: false,
      supplierPayForShipping: false,
      isPartsMadeInUs: false,
      quoteReferenceNumber: '',
      quoteDate: new Date,
      quoteExpiryDate: new Date(localStorage.getItem('expiryDate')) ,
      rfqDetails: null,
      rfqQuoteFileList: null,
      mpRfqQuoteItemList: null,
      errorMessage: '',
      result: true,
      ndaStatus: '',
      attachmentFileName: [],
      messageDesc: ''
    };
    this.iRFQPartQuantityQuote = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      rfqPartIdString: '',
      awardedQty: 0,
      isRfqResubmitted: false,
      isAlreadyAwrded: false,
      contactId: 0,
      contactIdList: [],
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
      rfqId: this.rfqId,
      rfqPartId: 0,
      rfqPartQuantityId: 0,
      rfqQuoteItemsId: 0,
      rfqQuoteSupplierQuoteId: 0,
      shippingAmount: 0,
      toolingAmount: 0,
      rfqQuoteItemList: [],
      awardedQtyUnit: '',
      isDeclineAll :false,
      buyerFeedbackId : '',
      estLeadTimeValueRange:null,
      estLeadTimeValue: null,
      estLeadTimeRange:null,
    };
    this.disableSave = false;
    this.partName = this._rfqService.get('quotePartName');
    this.partNumber = this._rfqService.get('quotePartNumber');
    this.GetSupplierRFQQuoteDetails();

    this._rfqService.getisBuyerNameClicked().subscribe( message => {
      if (message.text === 'true') {
        this.isPart1Present = true;
        this.isPart2Present = false;
        this.isPart3Present = false;
        this.partName = this._rfqService.get('quotePartName');
        this.partNumber = this._rfqService.get('quotePartNumber');
        const partCount = this._rfqService.get('partCount');
        const quantityData = this._rfqService.get('quantityData');
        this.isQuoteSubmitted =  this._rfqService.get('isRfqAwarded');
        this.iReviewPartsViewModelColl = this._rfqService.get('partList');
        this.currentPartId = this._rfqService.get('currentQuotePartId');
        this.iReviewPartsViewModel = this.iReviewPartsViewModelColl.find(m => m.partId === this.currentPartId);
        let qty1 = quantityData.find(x=>x.quantityLevel == 0);
        let qty2 = quantityData.find(x=>x.quantityLevel == 1);
        let qty3 = quantityData.find(x=>x.quantityLevel == 2);

        if (qty1 != undefined && qty1 != null) {
          this.isPart1Present = true;
          this.part1Quantity = qty1.partQty;
        }
        if (qty2 != undefined && qty2 != null) {

          this.isPart2Present = true;
          this.part2Quantity = qty2.partQty;
        }
        if (qty3 != undefined && qty3 != null) {

          this.isPart3Present = true;
          this.part3Quantity = qty3.partQty;
        }



        // if (partCount === 1) {
        //   this.isPart1Present = true;
        //   this.part1Quantity = quantityData[0].partQty;
        // }
        // if (partCount === 2) {
        //   this.isPart1Present = true;
        //   this.part1Quantity = quantityData[0].partQty;
        //   this.isPart2Present = true;
        //   this.part2Quantity = quantityData[1].partQty;
        // }
        // if (partCount === 3) {
        //   this.isPart1Present = true;
        //   this.part1Quantity = quantityData[0].partQty;
        //   this.isPart2Present = true;
        //   this.part2Quantity = quantityData[1].partQty;
        //   this.isPart3Present = true;
        //   this.part3Quantity = quantityData[2].partQty;
        // }
        this.initModels();
        this.iRfqQuoteItemsViewModelColl = [];
        this.iRfqQuoteSupplierQuoteViewModel = {
          rfqQuoteSupplierQuoteId: 0,
          rfqId: this.rfqId,
          contactId: this.loggedId,
          disableSubmitQuote: false,
          isQuoteSubmitted: false,
          paymentTerms: '',
          isPaytermAccepted: false,
          supplierPayForShipping: false,
          isPartsMadeInUs: false,
          quoteReferenceNumber: '',
          quoteDate: new Date,
          quoteExpiryDate: localStorage.getItem('expiryDate'),
          rfqDetails: null,
          rfqQuoteFileList: null,
          mpRfqQuoteItemList: null,
          errorMessage: '',
          result: true,
          ndaStatus: '',
          attachmentFileName: [],
          messageDesc: ''
        };
        this.iRFQPartQuantityQuote = {
          awardAcceptedOrDeclineDate: null,
          awardedDate: null,
          rfqPartIdString: '',
          awardedQty: 0,
          isRfqResubmitted: false,
          isAlreadyAwrded: false,
          contactId: 0,
          contactIdList: [],
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
          rfqId: this.rfqId,
          rfqPartId: 0,
          rfqPartQuantityId: 0,
          rfqQuoteItemsId: 0,
          rfqQuoteSupplierQuoteId: 0,
          shippingAmount: 0,
          toolingAmount: 0,
          rfqQuoteItemList: [],
          awardedQtyUnit: '',
          isDeclineAll :false,
          buyerFeedbackId : '',
          estLeadTimeValueRange:null,
          estLeadTimeRange:null,
          estLeadTimeValue:null
        };
        this.iRFQPartQuantityQuoteColl = [];
        this.GetRFQPartQuantity();
      }
    });
  }

  showPart1Div() {
    this.part1Div = !this.part1Div;
  }
  showPart2Div() {
    this.part2Div = !this.part2Div;
  }
  showPart3Div() {
    this.part3Div = !this.part3Div;
  }

  closePartDrawer () {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(0, 'currentQuotePartId');
  }
  checkValidation () {
    if (this.isPart1Present && this.isPart2Present && this.isPart3Present) {
      if (this.iRfqQuoteItemsViewModel1.perUnitPrice === 0) {
        this.isPart1Error = true;
        this.part1Div = true;
      } else {
        this.isPart1Error = false;
      }
      if (this.iRfqQuoteItemsViewModel3.perUnitPrice === 0) {
        this.isPart3Error = true;
        this.part3Div = true;
      } else {
        this.isPart3Error = false;
      }
      if (this.iRfqQuoteItemsViewModel2.perUnitPrice === 0) {
        this.isPart2Error = true;
        this.part2Div = true;
      } else {
        this.isPart2Error = false;
      }
      if (this.iRfqQuoteItemsViewModel1.perUnitPrice === 0 ||
         this.iRfqQuoteItemsViewModel2.perUnitPrice === 0 ||
         this.iRfqQuoteItemsViewModel3.perUnitPrice === 0) {

      }
    }
    if (this.isPart1Present && this.isPart2Present && !this.isPart3Present) {
      if (this.iRfqQuoteItemsViewModel1.perUnitPrice === 0) {
        this.isPart1Error = true;
        this.part1Div = true;

      } else {
        this.isPart1Error = false;
      }
      if (this.iRfqQuoteItemsViewModel2.perUnitPrice === 0) {
        this.isPart2Error = true;
        this.part2Div = true;
      } else {
        this.isPart2Error = false;
      }
      if (this.iRfqQuoteItemsViewModel1.perUnitPrice === 0 ||
        this.iRfqQuoteItemsViewModel2.perUnitPrice === 0) {

      }
    }
    if (this.isPart1Present && !this.isPart2Present && !this.isPart3Present) {
      if (this.iRfqQuoteItemsViewModel1.perUnitPrice === 0) {
        this.isPart1Error = true;
        this.part1Div = true;

      } else {
        this.isPart1Error = false;
      }
    }

  }
  GetSupplierRFQQuoteDetails () {
    const isFromProgress =  localStorage.getItem('CurrentRfqType');
    let IsRfqResubmitted = false;
    if (isFromProgress === '13') {
      IsRfqResubmitted = true;
    } else {
      IsRfqResubmitted = false;
    }
    this._SupplierService.GetSupplierRFQQuoteDetails(this.rfqId, this.loggedId, IsRfqResubmitted,this.iReviewPartsViewModel.rfqPartId).subscribe(
      result => {
        if (result['result'] === true) {
          this.isQuoteSubmit= result.isQuoteSubmitted;
          this._rfqService.set(this.isQuoteSubmit, 'isQuoteSubmitted');
          this.iRfqQuoteSupplierQuoteViewModel = result;
          this.supplierQuoteId =this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
          this.iRfqQuoteItemsViewModel1.rfqQuoteSupplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
         if (this.isPart2Present) {
          this.iRfqQuoteItemsViewModel2.rfqQuoteSupplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
         }
         if (this.isPart3Present) {
          this.iRfqQuoteItemsViewModel3.rfqQuoteSupplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
         }
         this.GetRFQPartQuantity();
        } else {
          this.GetRFQPartQuantity();
         // this._toastr.error(result['errorMessage'], 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
       },
      () => { }
    );
  }
  SetSupplierRFQQuoteDetails () {
    if (!this.isApiResponse) {
      this.isApiResponse = true;
      this.checkValidation();
      this.disableSave = true;
     this.iRfqQuoteSupplierQuoteViewModel.isQuoteSubmitted = false;
console.log(this.iRfqQuoteSupplierQuoteViewModel,"this.iRfqQuoteSupplierQuoteViewModel");

     this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate= this._rfqService.get('quoteValidUntilDate'); 
   console.log(this.iRfqQuoteSupplierQuoteViewModel.quoteExpiryDate,"this.iRfqQuoteSupplierQuoteViewModel2");
   
     //  this.iRfqQuoteSupplierQuoteViewModel.paymentTerms =  (this._rfqService.get( 'paymentTerms') != '')?this._rfqService.get( 'paymentTerms'):'';
    //  this.iRfqQuoteSupplierQuoteViewModel.quoteReferenceNumber =  (this._rfqService.get( 'quoteReferenceNumber') != '')? this._rfqService.get( 'quoteReferenceNumber'):'' ;
    this._SupplierService.SetSupplierRFQQuoteDetails(this.iRfqQuoteSupplierQuoteViewModel).subscribe(
      result => {
        let isAllowRequoting= localStorage.getItem('isAllowRequoting');

if(isAllowRequoting){
  this.saveQuoting();
}
else{
  if (result['result'] === true) {
    this.isApiResponse = false;
    this.iRfqQuoteSupplierQuoteViewModel = result;
    this._rfqService.set(this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId, 'isMarkForQuoting');
    this._SupplierService.set(this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId, 'currentrfqQuoteSupplierQuoteId');
    this.supplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
    this.iRfqQuoteItemsViewModel1.rfqQuoteSupplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
   if (this.isPart2Present) {
    this.iRfqQuoteItemsViewModel2.rfqQuoteSupplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
   }
   if (this.isPart3Present) {
    this.iRfqQuoteItemsViewModel3.rfqQuoteSupplierQuoteId = this.iRfqQuoteSupplierQuoteViewModel.rfqQuoteSupplierQuoteId;
   }
   this.saveQuoting();
   // this._toastr.success(result['errorMessage'], 'Success!');
  } else {
    
    this._toastr.error(result['errorMessage'], 'Error!');
  }
}        
      },
      error => {
        this._rfqService.handleError(error);
       },
      () => { }
    );
    }

  }
  saveQuoting () {
    
    this.iRfqQuoteItemsViewModelColl = [];
    if (this.isPart1Present) {
      this.iRfqQuoteItemsViewModelColl.push(this.iRfqQuoteItemsViewModel1);
    }
    if (this.isPart2Present) {
      this.iRfqQuoteItemsViewModelColl.push(this.iRfqQuoteItemsViewModel2);
    }
    if (this.isPart3Present) {
      this.iRfqQuoteItemsViewModelColl.push(this.iRfqQuoteItemsViewModel3);
    }

      this._supplierService.addQuoting(this.iRfqQuoteItemsViewModelColl).subscribe(
        result2 => {
          if (result2['result'] === true) {
            this._rfqService.set(true, 'isMarkForQuoting');
            localStorage.setItem('rateFilled', 'true');
            this._rfqService.set(0, 'currentQuotePartId');
            this._rfqService.set(true, 'quoteAmountFilled');
            this._toastr.success(result2['errorMessage'], 'Success!');
            this._rfqService.set(false, 'showSidePanel');
            this._rfqService.set(false, 'transferRfq');
            this._SupplierService.set(true, 'editpartialquotingDataSaved');
            this._SupplierService.set(true, 'editpartialquotingDataSavedforDetail');
          } else {
            this._toastr.error(result2['errorMessage'], 'Error!');
          }
        },
        error => {

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
