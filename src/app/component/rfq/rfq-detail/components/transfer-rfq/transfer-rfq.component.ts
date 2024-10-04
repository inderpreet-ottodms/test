import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import { RfqService} from './../../../../../core/services/rfq/rfq.service';
import { IBuyerListByCompanyIdModel, ICustomBuyerListByCompanyIdModel} from './../../../../../core/models/globalMaster';

import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transfer-rfq',
  templateUrl: './transfer-rfq.component.html',
  styleUrls: ['./transfer-rfq.component.scss']
})
export class TransferRfqComponent implements OnInit, OnDestroy {

  iBuyerListByCompanyIdModelColl: IBuyerListByCompanyIdModel[];
  iBuyerListByCompanyIdModelcoll2: IBuyerListByCompanyIdModel[];
  selectedContact: string;
  settings = {};
  selectedItems = [];
  conatctId: number;
  isContactSelected: boolean;
  isContactValid: boolean;

  constructor(private _rfqService: RfqService,   private _toastr: ToastrService) {
    this.selectedContact = '';
    this.isContactSelected = false;
    this.isContactValid = false;
    this.conatctId = 0;
   }

   get loggedCompanyId() {
    // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('loggedCompanyId'));
   }
   ngOnDestroy() {
    this.closePartDrawer();
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  ngOnInit() {
    this.selectedItems = [];
        this._rfqService.getBuyerListByCmpnyId(this.loggedId).subscribe( // 1274109
          result => {
          this.iBuyerListByCompanyIdModelColl = result['data'];

           this.settings = {
            singleSelection: true,
            text: 'Select Buyer',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            searchPlaceholderText: 'Search Fields',
            enableSearchFilter: true,
            labelKey: 'fullName',
            primaryKey: 'contactId',
            noDataLabel: 'No Data Available',
            selectGroup: true,
            badgeShowLimit: 5,
            maxHeight: 200,
            showCheckbox: false
          };
          },
          error => {
            this._rfqService.handleError(error);
          },
          () => { }
        );
    }

  closePartDrawer () {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'transferRfq');
  }
  onSelect(item: any) {
    this.conatctId = item.contactId;
    this.isContactSelected = true;
    if (this.conatctId === 0 ) {
      this.isContactValid = true;
    } else {
      this.isContactValid = false;
    }
  }
  isPartSaveSubmit () {
   return this.isContactSelected;
  }

  transferRfq () {
    if (this.conatctId === 0 ) {
      this.isContactSelected = false;
    } else {
      this.isContactSelected = true;
      this._rfqService.transferRFQ(this._rfqService.get('rfqId'), this.conatctId, this.loggedId).subscribe(
        result => {
          if (result['result'] === true) {
            this._toastr.success('RFQ has been succesfully transfered', 'Success!');
            this.closePartDrawer();
          } else {
            this._toastr.error(result['errorMessage'], 'Error!');
          }
        },
        error => {
          this._rfqService.handleError(error);
        },
        () => { }
      );
    }


  }

}
