import { Component, OnInit } from '@angular/core';
import { RfqService} from './../../../core/services/rfq/rfq.service';
import {  IRFQViewModel } from '../../../core/models/rfqModel';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { IManufacturerContactsViewModel,IManufacturerContactListViewModel } from '../../../core/models/supplierModel';

@Component({
  selector: 'app-followed-buyer-contact',
  templateUrl: './followed-buyer-contact.component.html',
  styleUrls: ['./followed-buyer-contact.component.scss']
})
export class FollowedBuyerContactComponent implements OnInit {

 // Variable Declaration
 isRfqAvailable: boolean;
 isInProgRfqAvailable: boolean;
 public rfqId: any;
 iRFQViewModelColl: IRFQViewModel[];
 iSupplierDetails: IManufacturerContactsViewModel[];
 isCreateRFQBodyBtnDisabled = false;
 isRFQInProgBodyBtnDisabled = false;
 toggleNoRFQBodyBtn = true;
 iManufacturerContactListViewModel: IManufacturerContactListViewModel;
 // Variable Declaration End

 constructor(private _rfqService: RfqService, private _toastr: ToastrService, private sService: SupplierService) { 
  this.iManufacturerContactListViewModel = {
    contactId: 0,
    isbuyer: false,
    isBlacklisted: false,
    isLikedManufacturers: false,
    maxPageSize: 0,
    pageSize: 24,
    pageNumber: 1,
    searchText: '',
    totalRecords: 0,
    isOrderByDesc: true,
    orderBy: '',
    more_records: true,
    filterBy:''
  };

 }

 ngOnInit() {
  // this.getManufacturerContactsList();
   // this.getRfqInProgCount();
   this._rfqService.set(0, 'editRfqId');
   this._rfqService.set('', 'editRfqName');
   localStorage.setItem('EditRfqId', '0');
   localStorage.setItem('EditRfqName', '');
   this._rfqService.set(false, 'showSidePanel');
   this._rfqService.set(0, 'rfqId');
   localStorage.setItem('detailRfqId',  '0');
    
 }
 
  


 getManufacturerContactsList() { // this.loggedId
  this.iManufacturerContactListViewModel.contactId = this.loggedId;
  this.iManufacturerContactListViewModel.isbuyer = false;
  this.iManufacturerContactListViewModel.isBlacklisted = false;
  this.iManufacturerContactListViewModel.isLikedManufacturers = false;

  this.sService.getManufacturerContactsList(this.iManufacturerContactListViewModel).subscribe(
    result => {
      if (result['result'] === true ) {
        this.iSupplierDetails = result['data'];
        if (this.iSupplierDetails.length !== 0) {
          this.isRfqAvailable = false;
        } else {
          this.isRfqAvailable = false;
        }
      } else {
        this.isRfqAvailable = false;
        // this.items = [];
      }
    },
    error => {
      this._rfqService.handleError(error);
    },
    () => { }
  );
}
 changeInProg(flag) {
   if (flag === true) {
     this.toggleNoRFQBodyBtn = false;
   } else {
     this.toggleNoRFQBodyBtn = true;
   }
 }
 changeCrRFQ(flag) {
   if (flag === true) {
     this.toggleNoRFQBodyBtn = true;
   } else {
     this.toggleNoRFQBodyBtn = true;
   }
 }
//  getRfqInProgCount () {z
//    this._rfqService.getRfq(this.loggedId).subscribe(
//      result => {
//        if (result.length !== 0) {
//          this.isInProgRfqAvailable = true;
//        } else {
//          this.isInProgRfqAvailable = false;
//        }
//      },
//      error => {
//       this._rfqService.handleError(error);
//      },
//      () => {}
//    );
//  }

 // utility functions

 isSidePanel () {
   return this._rfqService.get('showSidePanel');
 }
 isBuyerprofileDrawer () {
  return this._rfqService.get('isBuyerMiniProfile');
}
isMessageDrawer () {
  return this._rfqService.get('isBuyerMessage');
}
 getCurrentRfqId () {
   return this._rfqService.get('rfqId');
 }
 get loggedId() {
   // tslint:disable-next-line:radix
   return parseInt(localStorage.getItem('LoggedId'));
 }
 onCreateRFQBodyClick() {
   this.isCreateRFQBodyBtnDisabled = true;
 }
 onRFQInProgBodyClick() {
   this.isRFQInProgBodyBtnDisabled = true;
 }
 isBuyerCommpleteProfile() {
  return this._rfqService.get('isBuyerCommpleteProfile');
}

goBack() {
  this._rfqService.set(false, 'isBuyerCommpleteProfile');
  this._rfqService.set(0, 'buyerCurrentProfileCompanyId');
  this._rfqService.set(0, 'buyerCurrentProfileContactId');
}

isModelShow() {
  return this._rfqService.get('isModelShow');
  }

}
