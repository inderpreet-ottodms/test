import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IRatingResponseViewModel } from '../../core/models/rfqModel';
import { SupplierService } from '../../core/services/supplier/supplier.service';
import { RfqService } from '../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { BuyerService } from '../../core/services/buyer/buyer.service';

@Component({
  selector: 'app-rating-model',
  templateUrl: './rating-model.component.html',
  styleUrls: ['./rating-model.component.scss']
})
export class RatingModelComponent implements OnInit, OnDestroy {

  iRatingResponseViewModel: IRatingResponseViewModel;
  radio1: number;
  isNPSPupupShow: boolean;
  fromContactOfMessage: number;
  toContactOfMessage: number;
  isBuyer: boolean;
  npsRatingPopupTitle: string;
  companyName: string;
  ratingsPopupLogoPath: any;
  manufactureName: string;
  disableBtn: boolean = false;
  constructor(private supplierService: SupplierService, private _rfqService: RfqService, private _toastr: ToastrService, private buyerService: BuyerService) {
    this.companyName = this._rfqService.get('ComapnyName');
    this.ratingsPopupLogoPath  = this._rfqService.get('contactPictureFile');
    this.manufactureName  = this._rfqService.get('manufacturerName');
  }

  ngOnDestroy() {
    this._rfqService.set(false, 'isModelShow');
  }
  ngOnInit() {
    this.isNPSPupupShow = true;
    this.iRatingResponseViewModel = {
      responseId: 0,
      fromId: 0,
      toId: 0,
      parentId: 0,
      contactName: '',
      imageURL: '',
      createdDate: '2018-12-13T07:52:13.433Z',
      score: '',
      comment: '',
      isLegacyRating: false,
      messageId: 0,
      isNotNowClicked: false,
      errorMessage: '',
      result: false,
      rfqId: 0
    };
    this.radio1 = 0;
    ;
    if (localStorage.getItem('Usertype') === 'Supplier') {
      this.isBuyer = true;
      this.npsRatingPopupTitle = 'Rate this Buyer';
    } else {
      this.isBuyer = false;
      this.npsRatingPopupTitle = 'Rate this Manufacturer';
    }
  }
  isAllowd() {
    return this.radio1 === 0;
  }
  loggedId() {
    // tslint:disable-next-line:radix
    ;
    const Id = localStorage.getItem('LoggedId');
    if (Id) {
      // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('LoggedId'));
    } else {
      return 0;
    }
  }

  getFormContactId() {
    const Id = this._rfqService.get('isFormcotactId');
    if (Id) {
      // tslint:disable-next-line:radix
      return this._rfqService.get('isFormcotactId');
    } else {
      return 0;
    }
  }

  closeNPSPopup() {
    this._rfqService.set(false, 'isModelShow');
    this.iRatingResponseViewModel.isNotNowClicked = true;
    this.iRatingResponseViewModel.score = '';
    this.iRatingResponseViewModel.fromId = Number(this.loggedId());
    this.iRatingResponseViewModel.toId = Number(this.getFormContactId());
    this.isNPSPupupShow = false;
  }
  submitRating(val) {
    this.iRatingResponseViewModel.score = '' + val.radio;
    this.iRatingResponseViewModel.isNotNowClicked = false;
    this.iRatingResponseViewModel.fromId = Number(this.loggedId());
    this.iRatingResponseViewModel.toId = Number(this.getFormContactId());
    let ratingRfqId = this._rfqService.get('ratingRfq');
    if(ratingRfqId !== null && ratingRfqId !== undefined && ratingRfqId !== 0 && ratingRfqId !== ''){
      this.iRatingResponseViewModel.rfqId = ratingRfqId;
    }
    this.submitResponse();
  }
  resetNPSModuleModel() {
    this.iRatingResponseViewModel = {
      responseId: 0,
      fromId: 0,
      toId: 0,
      parentId: 0,
      contactName: '',
      imageURL: '',
      createdDate: '2018-12-13T07:52:13.433Z',
      score: '',
      comment: '',
      isLegacyRating: false,
      messageId: 0,
      isNotNowClicked: false,
      errorMessage: '',
      result: false,
      rfqId: 0
    };
  }
  submitResponse() {
    this.disableBtn = true;
    this.supplierService.AddAnyTimeNPSResponse(this.iRatingResponseViewModel).subscribe(
      result => {
        // debugger;
        if (result.result === true) {
          this._rfqService.set(false, 'isModelShow');
          this._rfqService.set(0, 'isFormcotactId');
          this._rfqService.set(true, 'isminiDrawerData');
          // debugger;
          sessionStorage.setItem('isGlobalMsgRaiting','true');
          this._rfqService.set(true, 'isSupplierPublicProfile');
          this._rfqService.set(0, 'ratingRfq');
          if (this.iRatingResponseViewModel.score === '') {
            this.isNPSPupupShow = false;
            this.radio1 = 0;
            this.resetNPSModuleModel();
          } else {
            this._toastr.success(result.errorMessage, 'Success!');
            this.isNPSPupupShow = false;
            this.radio1 = 0;
            this.resetNPSModuleModel();
            this.buyerService.setRatingEvent(true);
          }
        } else {
          this._toastr.error(result.errorMessage, 'Error!');
        }
        this.disableBtn = false;
      },
      error => {
        this.disableBtn = false;
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  cancel() {
    this._rfqService.set(false, 'isModelShow');
    this._rfqService.set(0, 'isFormcotactId');
    this._rfqService.set(0, 'ratingRfq');
  }
}
