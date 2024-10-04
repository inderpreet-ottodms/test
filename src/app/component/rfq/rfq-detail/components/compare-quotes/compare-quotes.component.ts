import { Component, OnInit } from '@angular/core';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { IPartsViewModel, IRFQPartQuantityQuote,
   IBuyerQuotesList, LocalAwardedManufractureList, LocalAwardedParts } from '../../../../../core/models/rfqModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compare-quotes',
  templateUrl: './compare-quotes.component.html',
  styleUrls: ['./compare-quotes.component.scss']
})
export class CompareQuotesComponent implements OnInit {

  isLoader: boolean;
  currentRfqId: number;
  isAward: boolean;
  iPartsViewModelColl: IPartsViewModel[];
  iRFQPartQuantityQuoteColl: IRFQPartQuantityQuote[];
  iRFQPartQuantityQuoteColl1: IRFQPartQuantityQuote[];
  iRFQPartQuantityQuoteColl2: IRFQPartQuantityQuote[];
  iRFQPartQuantityQuoteColl3: IRFQPartQuantityQuote[];
  iRFQPartQuantityQuote: IRFQPartQuantityQuote;
  awardRFQPartQuantityQuote: IRFQPartQuantityQuote;
  manufractureCount: number;
  selectedQuantity: number;
  totalPart1Quote: number;
  totalPart2Quote: number;
  totalPart3Quote: number;
  totalPart: number;
  contactIds: number[];
  awardQuoteIds: number[];
  contactNames: any [];
  contactNPSScore: number[];
  part1Name: string;
  part2Name: string;
  part3Name: string;
  chkBoxCountArr: IBuyerQuotesList[];
  newAwardQuoteIds: number[];
  LocalAwardedManufractureList: LocalAwardedManufractureList;
  LocalAwardedManufractureListColl: LocalAwardedManufractureList[];
  OriginalLocalAwardedManufractureListColl: LocalAwardedManufractureList[];
  LocalAwardedParts: LocalAwardedParts;
  LocalAwardedPartsColl: LocalAwardedParts[];

  constructor(private _rfqService: RfqService, private _toastr: ToastrService) {
    this.isLoader = true;
    this.currentRfqId = this._rfqService.get('currentRfqIdForCompare');
    this.manufractureCount = 2;
    this.isAward = false;
    this.selectedQuantity = 1;
    this.totalPart1Quote = 0;
    this.totalPart2Quote = 0;
    this.totalPart3Quote = 0;
    this.contactNames = [];
    this.contactNPSScore = [];
    this.awardQuoteIds = [];
    this.part1Name = '';
    this.part2Name = '';
    this.part3Name = '';
    this.totalPart = 0;
    this.contactIds = [];
    this.iRFQPartQuantityQuoteColl1 = [];
    this.iRFQPartQuantityQuoteColl2 = [];
    this.iRFQPartQuantityQuoteColl3 = [];
    // debugger;
    this.chkBoxCountArr = this._rfqService.get('contactListForCompare');
    for (let i = 0; i < this.chkBoxCountArr.length; i++) {
     let data = {
        'contactName' : '',
        'CompanyName' : ''

      };
      if (i === 0) {
        this.contactIds.push(this.chkBoxCountArr[i].contactId);
           data.CompanyName=this.chkBoxCountArr[i].companyName;
           data.contactName=this.chkBoxCountArr[i].contactName;

        this.contactNames.push(data);
        this.contactNPSScore.push(this.chkBoxCountArr[i].noOfStars);
      }
      if (i === 1) {
        this.contactIds.push(this.chkBoxCountArr[i].contactId);
        data.CompanyName=this.chkBoxCountArr[i].companyName;
        data.contactName=this.chkBoxCountArr[i].contactName;

     this.contactNames.push(data);
        this.contactNPSScore.push(this.chkBoxCountArr[i].noOfStars);
      }
      if (i === 2) {
        this.contactIds.push(this.chkBoxCountArr[i].contactId);
        data.CompanyName=this.chkBoxCountArr[i].companyName;
           data.contactName=this.chkBoxCountArr[i].contactName;

        this.contactNames.push(data);
        this.contactNPSScore.push(this.chkBoxCountArr[i].noOfStars);
      }
    }
    this.iRFQPartQuantityQuote = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      awardedQty: 0,
      isAlreadyAwrded: false,
      rfqPartIdString: '',
      isRfqResubmitted: false,
      contactId: 0,
      contactIdList: this.contactIds,
      errorMessage: '',
      isAwardAccepted: false,
      isAwrded: false,
      miscellaneousAmount: 0,
      partId: 0,
      partName: '',
      partNumber: '',
      perUnitPrice: 0,
      quantityLevel: this.selectedQuantity,
      result: false,
      rfqId: this.currentRfqId,
      rfqPartId: 0,
      rfqPartQuantityId: 0,
      rfqQuoteItemsId: 0,
      rfqQuoteSupplierQuoteId: 0,
      shippingAmount: 0,
      toolingAmount: 0,
      rfqQuoteItemList: [],
      awardedQtyUnit: '',
      isDeclineAll :false,
      buyerFeedbackId: '',
      estLeadTimeValueRange:null,
      estLeadTimeRange:null,
      estLeadTimeValue:null
    };
    this.initAwardModel();
    this.initLocalAwardedParts();
    this.initLocalAwardedManufractureList();
    this.initLocalAwardedParts();
    this.LocalAwardedPartsColl = [];
    this.LocalAwardedManufractureListColl = [];
  }
  initLocalAwardedParts() {
    this.LocalAwardedParts = {
      rfqPartName: '',
      rfqPartNumber: '',
      rfqQuoteItemsId: 0,
      rfqPartId: 0,
      isAward: true,
      quantityList: []
    };
  }
  initLocalAwardedManufractureList() {
    this.LocalAwardedManufractureList = {
      awardedPart: [],
      manName: '',
      manId: 0,
      isPartPresent: true,
      npsScore: null
    };
  }
  initAwardModel () {
    this.awardRFQPartQuantityQuote = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      isAlreadyAwrded: false,
      awardedQty: 0,
      contactId: 0,
      contactIdList: [],
      isRfqResubmitted: false,
      rfqPartIdString: '',
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
      isDeclineAll :false,
      buyerFeedbackId: '',
      estLeadTimeValueRange:null,
      estLeadTimeRange:null,
      estLeadTimeValue:null
    };
  }

  ngOnInit() {
    this.getRfqParts();
    this.GetRFQPartQuantityQuoteBYRfqId();
  }
  goBack () {
    this._rfqService.set(0, 'currentRfqIdForCompare');
    this._rfqService.set(false, 'isCompare');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(true, 'isCompareClosed');
    window.scrollTo(0, 0);
  }
  changeQuantity() {
    this.iRFQPartQuantityQuote = {
      awardAcceptedOrDeclineDate: null,
      awardedDate: null,
      awardedQty: 0,
      isAlreadyAwrded: false,
      contactId: 0,
      rfqPartIdString: '',
      isRfqResubmitted: false,
      contactIdList: this.contactIds,
      rfqQuoteItemList: [],
      errorMessage: '',
      isAwardAccepted: false,
      isAwrded: false,
      miscellaneousAmount: 0,
      partId: 0,
      partName: '',
      partNumber: '',
      perUnitPrice: 0,
      quantityLevel: this.selectedQuantity,
      result: false,
      rfqId: this.currentRfqId,
      rfqPartId: 0,
      rfqPartQuantityId: 0,
      rfqQuoteItemsId: 0,
      rfqQuoteSupplierQuoteId: 0,
      shippingAmount: 0,
      toolingAmount: 0,
      awardedQtyUnit: '',
      isDeclineAll :false,
      buyerFeedbackId : '',
      estLeadTimeValueRange:null,
      estLeadTimeRange:null,
      estLeadTimeValue:null
    };
    this.GetRFQPartQuantityQuoteBYRfqId();
  }
  showHideRFQPartDetails(id) {
    const data = this.iPartsViewModelColl.find(m => m.partId === id);
    data.result = !data.result;
  }

  isAwardedByOtherManu (rfqPartId) {
    const isAwarded = this.iRFQPartQuantityQuoteColl.filter(m => m.rfqPartId === rfqPartId && m.isAwrded).length;
    if (isAwarded === 0) {
      return false;
    } else {
      return true;
    }
  }
  isLocallyAwarded(rfqPartId) {
    let isexist = false;
    const mandata = this.LocalAwardedManufractureListColl;
    mandata.forEach(element => {
      const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartId === rfqPartId);
      const isExist = element.awardedPart.filter(m => m.rfqQuoteItemsId === data.rfqQuoteItemsId && m.isAward === true).length;
      if (isExist !== 0) {
        isexist = true;
      } else {
        isexist = false;
      }
    });
    return isexist;
  }
  getRfqParts() {
    this.isLoader = true;
    this._rfqService.getRfqParts(this.currentRfqId).subscribe(
      result => {
        this.iPartsViewModelColl = result;
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  isAwartdBtnStatus() {
    if (this.LocalAwardedManufractureListColl.filter(m => m.isPartPresent === true).length === 0) {
      return true;
    } else {
      return false;
    }

  }
  // awardActual() {
  //   this.awardQuoteIds = [];
  //   this.LocalAwardedManufractureListColl.forEach(element => {
  //     const data = element.awardedPart.filter(m => m.isAward === true);
  //     data.forEach(part => {
  //       this.awardQuoteIds.push(part.rfqQuoteItemsId);
  //     });
  //   });
  //   this.awardRFQPartQuantityQuote.rfqQuoteItemsIdList = this.awardQuoteIds;
  //   this.awardRFQPartQuantityQuote.isAwrded = true;
  //   this.awardRFQPartQuantityQuote.rfqId = this.currentRfqId;
  //   this.awardRFQPartQuantityQuote.contactId = this.loggedId;
  //   this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this._toastr.success('RFQ Has Been Awarded', 'Success!');
  //         this.isAward = false;
  //         this.changeQuantity();
  //       //  this.expandQuotesAfterAward();
  //       //  this.LocalAwardedManufractureListColl = [];
  //       } else {
  //         this._toastr.error(result['errorMessage'], 'Error!');
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     },
  //     () => { }
  //   );
  // }

  getRfqPartAwardedStatusByOther(key) {
    const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === key);
    if (data.isAlreadyAwrded) {
      return data.isAlreadyAwrded;
    } else {
      return false;
    }
  }
  isPartExistinAwardedLis (part) {
    let isPartAqardedByOtherM = 0;
    this.LocalAwardedManufractureListColl.forEach(oldAwardData => {
      const data = oldAwardData.awardedPart.filter(m => m.rfqQuoteItemsId === part.rfqQuoteItemsId).length;
      if (data !== 0) {
        isPartAqardedByOtherM ++;
      }
    });
    return isPartAqardedByOtherM;
  }
  // awardAllByManufracture(manuId, manName, npsScore) {
  //   this.LocalAwardedPartsColl = [];
  //   const IsManExist = this.LocalAwardedManufractureListColl.filter(m => m.manId === manuId).length;
  //   if (IsManExist > 0) {
  //     const mandata = this.LocalAwardedManufractureListColl.find(m => m.manId === manuId);
  //     const partDetails = this.transform(this.iRFQPartQuantityQuoteColl, 'rfqPartIdString');
  //     partDetails.forEach(element => {
  //       const part = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === element.key);
  //       if (part.isAwrded !== true && part.isAwrded === null && part.partName !== '') {
  //         const isPartExist = mandata.awardedPart.filter(m => m.rfqQuoteItemsId === part.rfqQuoteItemsId).length;
  //         if (isPartExist === 0) {
  //           this.LocalAwardedParts.rfqPartName = part.partName;
  //           this.LocalAwardedParts.rfqPartNumber = part.partNumber;
  //           this.LocalAwardedParts.rfqQuoteItemsId = part.rfqQuoteItemsId;
  //           this.LocalAwardedParts.quantityList = [];

  //           this.LocalAwardedPartsColl.push(this.LocalAwardedParts);
  //           mandata.awardedPart.push(this.LocalAwardedParts);
  //           this.initLocalAwardedParts();
  //         }
  //       }
  //     });
  //   } else {
  //     const partDetails = this.transform(this.iRFQPartQuantityQuoteColl, 'rfqPartIdString');
  //     partDetails.forEach(element => {
  //       const part = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartIdString === element.key);
  //       const isPartAqardedByOtherM = this.isPartExistinAwardedLis(part);
  //       if (isPartAqardedByOtherM === 0 ) {
  //         if (part.isAwrded !== true && part.isAwrded === null && part.partName !== '') {
  //           this.LocalAwardedParts.rfqPartName = part.partName;
  //           this.LocalAwardedParts.rfqPartNumber = part.partNumber;
  //           this.LocalAwardedParts.rfqQuoteItemsId = part.rfqQuoteItemsId;
  //           this.LocalAwardedParts.quantityList = [];
  //           this.LocalAwardedPartsColl.push(this.LocalAwardedParts);
  //           this.initLocalAwardedParts();
  //         }
  //       }
  //     });
  //     if (this.LocalAwardedPartsColl.length > 0) {
  //       this.LocalAwardedManufractureList.manId = manuId;
  //       this.LocalAwardedManufractureList.manName = manName;
  //       this.LocalAwardedManufractureList.npsScore = npsScore;
  //       this.LocalAwardedManufractureList.awardedPart = this.LocalAwardedPartsColl;
  //       this.LocalAwardedManufractureListColl.push(this.LocalAwardedManufractureList);
  //     }
  //   }
  //   this.initLocalAwardedManufractureList();
  //   this.initLocalAwardedParts();
  // }
  transform(collection: Array<any>, property: string): Array<any> {
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return null;
    }

    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      } else {
        previous[current[property]].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
  // awardAllByManufracsture(manufracturerName) {
  //   this.awardQuoteIds = [] ;
  //   const manuId =  this.chkBoxCountArr.find(m => m.contactName === manufracturerName).contactId;
  //   const data = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manuId);
  //   data.forEach(element => {
  //     this.awardQuoteIds.push(element.rfqQuoteItemsId);
  //   });
  //   this.awardRFQPartQuantityQuote.rfqQuoteItemsIdList = this.awardQuoteIds;
  //   this.awardRFQPartQuantityQuote.isAwrded = true;
  //   this.awardRFQPartQuantityQuote.rfqId = this.currentRfqId;
  //   this.awardRFQPartQuantityQuote.contactId = this.loggedId;
  //   this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this._toastr.success('RFQ Has Been Awarded', 'Success!');
  //         this.GetRFQPartQuantityQuoteBYRfqId();
  //       } else {
  //         this._toastr.error(result['errorMessage'], 'Success!');
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     },
  //     () => { }
  //   );
  // }

  // awardSingle(key, manId, manName, rfqQuoteItemsId) {
  //   this.newAwardQuoteIds = [];
  //   this.initLocalAwardedManufractureList();
  //   this.initLocalAwardedParts();
  //   let isPartExistInLocal = false;
  //   const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartId === key);
  //   this.LocalAwardedManufractureListColl.forEach(element => {
  //     const isExist = element.awardedPart.filter(m => m.rfqQuoteItemsId === data.rfqQuoteItemsId).length;
  //     if (isExist !== 0) {
  //       isPartExistInLocal = true;
  //     }
  //   });
  //   if (!isPartExistInLocal) {
  //     const IsManExist = this.LocalAwardedManufractureListColl.filter(m => m.manId === manId).length;
  //     if (IsManExist > 0) {
  //       const manData = this.LocalAwardedManufractureListColl.find(m => m.manId === manId);
  //       const isPartExist = manData.awardedPart.filter(m => m.rfqQuoteItemsId === data.rfqQuoteItemsId).length;
  //       if (isPartExist === 0) {
  //         this.LocalAwardedParts.rfqPartName = data.partName;
  //         this.LocalAwardedParts.rfqPartNumber = data.partNumber;
  //         this.LocalAwardedParts.rfqPartId = data.rfqPartId;
  //         this.LocalAwardedParts.rfqQuoteItemsId = data.rfqQuoteItemsId;
  //         manData.awardedPart.push(this.LocalAwardedParts);
  //         const originalData = this.iRFQPartQuantityQuoteColl.find(x => x.rfqQuoteItemsId === rfqQuoteItemsId );
  //         originalData.isAwrded = true;

  //       }
  //     } else {
  //       this.LocalAwardedParts.rfqPartName = data.partName;
  //       this.LocalAwardedParts.rfqPartNumber = data.partNumber;
  //       this.LocalAwardedParts.rfqPartId = data.rfqPartId;
  //       this.LocalAwardedParts.rfqQuoteItemsId = data.rfqQuoteItemsId;
  //       this.LocalAwardedManufractureList.manId = manId;
  //       this.LocalAwardedManufractureList.manName = manName;
  //       this.LocalAwardedManufractureList.npsScore = 0;
  //       this.LocalAwardedManufractureList.awardedPart.push(this.LocalAwardedParts);
  //       const originalData = this.iRFQPartQuantityQuoteColl.find(x => x.rfqQuoteItemsId === rfqQuoteItemsId);
  //       originalData.isAwrded = true;
  //       this.LocalAwardedManufractureListColl.push(this.LocalAwardedManufractureList);
  //     }
  //     this.initLocalAwardedParts();
  //     this.initLocalAwardedManufractureList();
  //   } else {
  //     this._toastr.error('You have already quoted for this part with other manufacturer', 'Error!');
  //   }
  // }
  // awardSinglse (partId, contactId) {
  //   this.awardQuoteIds = [];
  //   const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartId === partId && m.contactId === contactId);
  //   this.awardQuoteIds.push(data.rfqQuoteItemsId);
  //   this.awardRFQPartQuantityQuote.rfqQuoteItemsIdList = this.awardQuoteIds;
  //   this.awardRFQPartQuantityQuote.isAwrded = true;
  //   this.awardRFQPartQuantityQuote.rfqId = this.currentRfqId;
  //   this.awardRFQPartQuantityQuote.contactId = this.loggedId;
  //   this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this._toastr.success('Rfq Has Been Awarded', 'Success!');
  //         this.GetRFQPartQuantityQuoteBYRfqId();
  //       } else {
  //         this._toastr.error(result['errorMessage'], 'Success!');
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     },
  //     () => { }
  //   );
  // }

  filterQuotes1(rfqPartId, contactid) {
    if (contactid !== 0 && contactid !== null && contactid !== undefined) {
      const data = this.iRFQPartQuantityQuoteColl1.filter(x => x.rfqPartId === rfqPartId && x.contactId === contactid);
      return this.iRFQPartQuantityQuoteColl1.filter(x => x.rfqPartId === rfqPartId && x.contactId === contactid);
    } else {
      return this.iRFQPartQuantityQuoteColl1;
    }
  }
  filterQuotes2(rfqPartId, contactid) {
    if (contactid !== 0 && contactid !== null && contactid !== undefined) {
      const data = this.iRFQPartQuantityQuoteColl2.filter(x => x.rfqPartId === rfqPartId && x.contactId === contactid);
      return this.iRFQPartQuantityQuoteColl2.filter(x => x.rfqPartId === rfqPartId && x.contactId === contactid);
    } else {
      return this.iRFQPartQuantityQuoteColl2;
    }
  }
  filterQuotes3(rfqPartId, contactid) {
    if (contactid !== 0 && contactid !== null && contactid !== undefined) {
      const data = this.iRFQPartQuantityQuoteColl3.filter(x => x.rfqPartId === rfqPartId && x.contactId === contactid);
      return this.iRFQPartQuantityQuoteColl3.filter(x => x.rfqPartId === rfqPartId && x.contactId === contactid);
    } else {
      return this.iRFQPartQuantityQuoteColl3;
    }
  }
  assignAwardFromLocal() {
    const mandata = this.LocalAwardedManufractureListColl;
    this.iRFQPartQuantityQuoteColl.forEach(part => {
      mandata.forEach(element => {
        const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartId === part.rfqPartId);
       // let isExist = element.awardedPart.filter(m => m.rfqQuoteItemsId === data.rfqQuoteItemsId && m.isAward === true).length;
        // if (isExist !== 0) {
        //   isExist = true;
        // } else {
        //   isExist = false;
        // }
      });
    });

  }
  GetRFQPartQuantityQuoteBYRfqId() {
    this.isLoader = true;
    this._rfqService.GetRFQPartQuantityQuoteBYRfqId(this.iRFQPartQuantityQuote).subscribe(
      result => {
        this.totalPart1Quote = 0;
        this.totalPart2Quote = 0;
        this.totalPart3Quote = 0;
        this.iRFQPartQuantityQuoteColl1 = [];
        this.iRFQPartQuantityQuoteColl2 = [];
        this.iRFQPartQuantityQuoteColl3 = [];

         if(result['result'] === true) {

          this.iRFQPartQuantityQuoteColl = result['data'];
        this.iRFQPartQuantityQuoteColl.forEach(quote => {
          if (this.contactIds[0] === quote.contactId) {
            this.iRFQPartQuantityQuoteColl1.push(quote);
            this.totalPart1Quote = this.totalPart1Quote + quote.miscellaneousAmount +
            (quote.perUnitPrice * quote.awardedQty)  + quote.shippingAmount + quote.toolingAmount;
          }
          if (this.contactIds[1] === quote.contactId) {
            this.iRFQPartQuantityQuoteColl2.push(quote);
            this.totalPart2Quote = this.totalPart2Quote + quote.miscellaneousAmount +
            (quote.perUnitPrice * quote.awardedQty) + quote.shippingAmount + quote.toolingAmount;
          }
          if (this.contactIds[2] === quote.contactId) {
            this.iRFQPartQuantityQuoteColl3.push(quote);
            this.totalPart3Quote = this.totalPart3Quote + quote.miscellaneousAmount +
            (quote.perUnitPrice * quote.awardedQty) + quote.shippingAmount + quote.toolingAmount;
          }
        });
      }
        this.isLoader = false;
      },
      error => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  // declineSingle (partId, contactId) {
  //   this.awardQuoteIds = [];
  //   const data = this.iRFQPartQuantityQuoteColl.find(m => m.rfqPartId === partId && m.contactId === contactId);
  //   this.awardQuoteIds.push(data.rfqQuoteItemsId);
  //   this.awardRFQPartQuantityQuote.rfqQuoteItemsIdList = this.awardQuoteIds;
  //   this.awardRFQPartQuantityQuote.isAwrded = false;
  //   this.awardRFQPartQuantityQuote.rfqId = this.currentRfqId;
  //   this.awardRFQPartQuantityQuote.contactId = this.loggedId;
  //   this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this._toastr.success('Rfq Has Been Declined', 'Success!');
  //         this.GetRFQPartQuantityQuoteBYRfqId();
  //       } else {
  //         this._toastr.error(result['errorMessage'], 'Success!');
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     },
  //     () => { }
  //   );
  // }
  // declineAllByManufracture(manufracturerName) {
  //   this.awardQuoteIds = [] ;
  //   const manuId =  this.chkBoxCountArr.find(m => m.contactName === manufracturerName).contactId;
  //   const data = this.iRFQPartQuantityQuoteColl.filter(m => m.contactId === manuId);
  //   data.forEach(element => {
  //     this.awardQuoteIds.push(element.rfqQuoteItemsId);
  //   });
  //   this.awardRFQPartQuantityQuote.rfqQuoteItemsIdList = this.awardQuoteIds;
  //   this.awardRFQPartQuantityQuote.isAwrded = false;
  //   this.awardRFQPartQuantityQuote.rfqId = this.currentRfqId;
  //   this.awardRFQPartQuantityQuote.contactId = this.loggedId;
  //   this._rfqService.SetRFQQuoteStatus(this.awardRFQPartQuantityQuote).subscribe(
  //     result => {
  //       if (result['result'] === true) {
  //         this._toastr.success('RFQ Has Been Declined', 'Success!');
  //         this.GetRFQPartQuantityQuoteBYRfqId();
  //       } else {
  //         this._toastr.error(result['errorMessage'], 'Success!');
  //       }
  //     },
  //     error => {
  //       this._rfqService.handleError(error);
  //     },
  //     () => { }
  //   );
  // }
}
