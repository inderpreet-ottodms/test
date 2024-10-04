import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../../../core/services/supplier/supplier.service';
import { MasterService } from '../../../../../core/services/master/master.service';
import { IRatingResponseViewModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-buyer-raiting-reply',
  templateUrl: './buyer-raiting-reply.component.html',
  styleUrls: ['./buyer-raiting-reply.component.scss']
})
export class BuyerRaitingReplyComponent implements OnInit {

  iRatingResponseViewModel: IRatingResponseViewModel;
  iRatingParent: IRatingResponseViewModel;
  labelFocus = '';
  constructor(private _SupplierService: SupplierService, private _masterService: MasterService,
    private _toastr: ToastrService, private _rfqService: RfqService) { }

  ngOnInit() {
    this.initModel();
    this.getParentResponseAndSetValues();
  }

  initModel() {
    this.iRatingResponseViewModel = {
      responseId: 0,
      fromId: 0,
      toId: 0,
      parentId: 0,
      contactName: '',
      imageURL: '',
      createdDate: '2018-11-15T12:42:20.060Z',
      score: '',
      comment: '',
      isLegacyRating: false,
      errorMessage: '',
      messageId: 0,
      isNotNowClicked: false,
      result: false,
      rfqId: 0
    };
  }

  getParentResponseAndSetValues() {
    this.iRatingParent = this._SupplierService.get('tempParentResponse');
    this.iRatingResponseViewModel.fromId = this.iRatingParent.toId;
    this.iRatingResponseViewModel.toId = this.iRatingParent.fromId;
    this.iRatingResponseViewModel.parentId = this.iRatingParent.responseId;
    // this.iRatingResponseViewModel.createdDate = new Date();
  }

  setFocus(flag: string) {
    this.labelFocus = flag;
  }

  responseTyped() {
    return !!this.iRatingResponseViewModel.comment && this.iRatingResponseViewModel.comment !== '';
  }

  closeRatingReply() {
    this._SupplierService.set(true, 'closedRatingReply');
    this.exitFunction();
  }

  exitFunction() {
    this._SupplierService.set(false, 'buyerProfileSidePanel');
  this._SupplierService.set(false, 'isEditBuyerContactUs');
  this._SupplierService.set(false, 'isEditMailing');
  this._SupplierService.set(false, 'isEditShipping');
  this._SupplierService.set(false, 'isMailingEditActive');
  this._SupplierService.set(false, 'isShippingEditActive');
  this._SupplierService.set(false, 'isEditBuyerAboutUs');
  this._SupplierService.set(false, 'isProfileEditActive');
  this._SupplierService.set(false, 'isRatingReply');
  this._SupplierService.set(false, 'headerEdit');
  this._SupplierService.set(false, 'companyEquipment');
  this._SupplierService.set(false, 'companyDescription');
  this._SupplierService.set(false, 'companyPhotos');
  this._SupplierService.set(false, 'companyDemographics');
  this._SupplierService.set(false, 'companyCertifications');
  this._SupplierService.set(false, 'companyFocus');
  this._SupplierService.set(false, 'companyGetInTouch');
  this._SupplierService.set(false, 'companyGetInTouch');
  }

  isNotAllowsSendResponse() {
    return this.iRatingResponseViewModel.comment === '';
  }

  sendResponse() {
    this._SupplierService.SetNPSReply(this.iRatingResponseViewModel).subscribe(
      result => {
        if (result.result === true) {
          this._toastr.success('Reply is sent', 'Success!');
          this._SupplierService.set(true, 'responseReplyIsSent');
          this.exitFunction();
        } else {
          this._toastr.error('Failed to send reply', 'Error!');
        }
      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }

}
