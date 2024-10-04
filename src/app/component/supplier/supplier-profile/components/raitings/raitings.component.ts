import { Component, OnInit, Input, SimpleChanges,SimpleChange } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { MasterService } from '../../../../../core/services/master/master.service';
import { ITempNPSDataModel, IRatingResponseViewModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-raitings',
  templateUrl: './raitings.component.html',
  styleUrls: ['./raitings.component.scss']
})
export class RaitingsComponent implements OnInit {
  @Input() isRatingActive:boolean;
  pages = 3;
  pageSize = 10;
  pageNumber = 0;
  currentIndex = 1;
  items: IRatingResponseViewModel[];
  activeItems: boolean[];
  activeItemIndex: boolean;
  defaultAwsPath = '';
  tempResponse: IRatingResponseViewModel;
  responseArray: IRatingResponseViewModel[];
  pagesIndex: Array<number>;
  pageStart = 1;
  iTempNPSDataModel: ITempNPSDataModel;
  enableMeterFields = [ false, false, false, false, false, false, false ];
  isLoader: boolean;

  responseStartNumber = 1;
  responseEndNumber = 10;
  avgNoOfStars: number;
  total1StarRatingPer: number;
  total2StarRatingPer: number;
  total3StarRatingPer: number;
  total4StarRatingPer: number;
  total5StarRatingPer: number;
  totalReviews: number;
  constructor(private _SupplierService: SupplierService, private _masterService: MasterService,
    private _toastr: ToastrService, private _rfqService: RfqService) {
    this.items = [];
    this.activeItems = [];
    this.responseArray = [];
    this.initModels();
  }

  ngOnInit() {
    this.avgNoOfStars = 0;
    this.total1StarRatingPer = 0;
    this.total2StarRatingPer = 0;
    this.total3StarRatingPer = 0;
    this.total4StarRatingPer = 0;
    this.total5StarRatingPer = 0;
    this.totalReviews = 0;
    this.getResponseList();
    this.getNPSRatings();
  }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }

  initModels() {
    this.iTempNPSDataModel = {
      nps: 0,
      promoter: 0,
      passives: 0,
      detractors: 0,
      promotersCount: 0,
      passivesCount: 0,
      petractorsCount: 0,
      totalResponses: 0,
      result: false
    };
  }

  getPercentageClass(percentCount: number) {
    const myStyles = {
      'width': '' + percentCount + '%'
    };
    return myStyles;
  }

  getNPSRatings() {
    this.isLoader = true;
    const contactID = this.loggedId;
    this._SupplierService.getNPSRatings(contactID).subscribe(
      result => {
        this.isLoader = false;
        this.iTempNPSDataModel = result;
        if (this.iTempNPSDataModel.nps === null) {
          this.enableMeterFields = [ false, false, false, false, false, false, false ];
        } else {
          this.enableMeterFields[0] = !(this.iTempNPSDataModel.nps < (-99));
          this.enableMeterFields[1] = !(this.iTempNPSDataModel.nps < (-56));
          this.enableMeterFields[2] = !(this.iTempNPSDataModel.nps < (-28));
          this.enableMeterFields[3] = !(this.iTempNPSDataModel.nps < (0));
          this.enableMeterFields[4] = !(this.iTempNPSDataModel.nps < (28));
          this.enableMeterFields[5] = !(this.iTempNPSDataModel.nps < (56));
          this.enableMeterFields[6] = !(this.iTempNPSDataModel.nps < (99));
        }
      },
      error => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  initPagination() {
    // this.currentIndex = 1;
    // this.pageStart = 1;
    // this.pages = 3;
    // tslint:disable-next-line:radix
    this.pageNumber = parseInt('' + (this.responseArray.length / this.pageSize));
    if (this.responseArray.length % this.pageSize !== 0) {
      this.pageNumber++;
    }
    if (this.pageNumber < this.pages) {
      this.pages = this.pageNumber;
    }
    this.refreshItems();
  }

  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  getResponseList() {
    this.isLoader = true;
    const contactID = this.loggedCompanyId;
    this._SupplierService.GetNPSResponses(contactID).subscribe(
      result => {
        this.isLoader = false;
        if (result.result) {
          this.responseArray = result.data.ratingResponseList;
          this.avgNoOfStars = result.data.avgNoOfStars;
          this.total1StarRatingPer = result.data.total1StarRatingPer;
          this.total2StarRatingPer = result.data.total2StarRatingPer;
          this.total3StarRatingPer = result.data.total3StarRatingPer;
          this.total4StarRatingPer = result.data.total4StarRatingPer;
          this.total5StarRatingPer = result.data.total5StarRatingPer;
          this.totalReviews = result.data.totalReviews;
          if (this.responseArray !== null && this.responseArray.length !== 0) {
            this.isLoader = false;
            this.initPagination();
          } else {
            this.isLoader = false;
            this.items = [];
            this.activeItems = [];
          }
        }
      },
      error => {
        this.isLoader = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

  refreshItems() {
    this.responseStartNumber = (this.currentIndex - 1) * this.pageSize;
    this.responseEndNumber = (this.currentIndex) * this.pageSize;
    if (this.responseArray[this.responseStartNumber].parentId) {
      ++this.responseStartNumber;
    }
    if (!!this.responseArray[this.responseEndNumber]) {
      if (this.responseArray[this.responseEndNumber].parentId) {
        ++this.responseEndNumber;
      }
    }
    this.items = this.responseArray.slice(this.responseStartNumber, this.responseEndNumber);
    this.activeItems = [];
    for (let iTest = 0; iTest < this.items.length; iTest++) {
      this.activeItems.push(false);
    }
    this.pagesIndex = this.fillArray();
  }

  // Previous button code
  prevPage() {
    if (this.currentIndex > 1) {
      this.currentIndex--;
    }
    if (this.currentIndex < this.pageStart) {
      this.pageStart = this.currentIndex;
    }
    this.refreshItems();
  }

  // Next Button Code
  nextPage() {
    if (this.currentIndex < this.pageNumber) {
      this.currentIndex++;
    }
    if (this.currentIndex >= (this.pageStart + this.pages)) {
      this.pageStart = this.currentIndex - this.pages + 1;
    }

    this.refreshItems();
  }
   // periticluar page no selection function
   setPage(index: number) {
    this.currentIndex = index;
    this.refreshItems();
  }

  fillArray(): any {
    const obj = new Array();
    for (let index = this.pageStart; index < this.pageStart + this.pages; index++) {
      obj.push(index);
    }
    return obj;
  }

  isSidePanelOpen() {
    return true;
  }

  openSidePanel(itemIndex) {
    this.activeItemIndex = itemIndex;
    this.resetActiveItems();
    this.tempResponse = {
      responseId: this.items[itemIndex].responseId,
      fromId: this.items[itemIndex].fromId,
      toId: this.items[itemIndex].toId,
      parentId: this.items[itemIndex].responseId,
      contactName: this.items[itemIndex].contactName,
      imageURL: this.items[itemIndex].imageURL,
      createdDate: this.items[itemIndex].createdDate,
      score: this.items[itemIndex].score,
      comment: this.items[itemIndex].comment,
      isLegacyRating: this.items[itemIndex].isLegacyRating,
      errorMessage: this.items[itemIndex].errorMessage,
      messageId: 0,
      isNotNowClicked: false,
      result: this.items[itemIndex].result,
      rfqId:0
    };
    this._SupplierService.set(this.tempResponse, 'tempParentResponse');
    this.activeItems[itemIndex] = true;
    this._SupplierService.set(false, 'headerEdit');
    this._SupplierService.set(true, 'supplierSidePanel');
    this._SupplierService.set(false, 'aboutUsEdit');
    this._SupplierService.set(false, 'contactUsEdit');
    this._SupplierService.set(false, 'capabilitiesEdit');
    this._SupplierService.set(true, 'ratingReply');

    this._SupplierService.set(false, 'companyEquipment');
    this._SupplierService.set(false, 'companyDescription');
    this._SupplierService.set(false, 'companyPhotos');
    this._SupplierService.set(false, 'companyDemographics');
    this._SupplierService.set(false, 'companyCertifications');
    this._SupplierService.set(false, 'companyCatagories');
    this._SupplierService.set(false, 'companyFocus');
    this._SupplierService.set(false, 'companyGetInTouch');
  }

  formatDate(stringDate: string) {
    const itemDate = new Date(stringDate);
    return '' + (itemDate.getMonth()+1) + '/' + itemDate.getDate() + '/' + itemDate.getFullYear();
  }

  formatScore(stringScore: string) {
    // tslint:disable-next-line:radix
    return parseInt(stringScore);
  }

  responseLogo(fileUrl: string) {
    if (!!fileUrl && (fileUrl.length > 0)) {
      return this.defaultAwsPath + fileUrl;
    } else {
      return 'assets/company/avatar-manu-basic-circle.svg';
    }
  }

  reloadResponses() {
    if (this._SupplierService.get('closedRatingReply')) {
      this._SupplierService.set(false, 'closedRatingReply');
      this.resetActiveItems();
    }
    if (this._SupplierService.get('responseReplyIsSent')) {
      this._SupplierService.set(false, 'responseReplyIsSent');
      this.resetActiveItems();
      this.getResponseList();
    }
  }

  replyLogo(fileUrl: string) {
    if (!!fileUrl && (fileUrl.length > 0)) {
      return this.defaultAwsPath + fileUrl;
    } else {
      return 'assets/company/avatar-manu-basic-circle.svg';
    }
  }

  isReplyAllow(parentId, nextItemIndex) {
    if (!parentId) {
      if (!this.items[nextItemIndex] || !this.items[nextItemIndex].parentId) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  resetActiveItems() {
    for (let iTest = 0; iTest < this.activeItems.length; iTest++) {
      this.activeItems[iTest] = false;
    }
  }

  getBarClass( rate ) {
    if ( rate ) {
      return 'percentage percentage-' + Math.round(rate);
    } else {
      return 'bar';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const isRatingActive:SimpleChange=changes.isRatingActive;
  if (isRatingActive != undefined && (
    isRatingActive.currentValue != undefined &&
    isRatingActive.currentValue != null &&
    isRatingActive.currentValue == true)) {
       this.currentIndex = 1;
    this.pageStart = 1;
    this.pages = 3;
     this.getResponseList();
    }
  }

}
