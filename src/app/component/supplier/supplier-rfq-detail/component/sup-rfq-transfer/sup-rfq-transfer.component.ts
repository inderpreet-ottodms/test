import { Component, OnInit } from '@angular/core';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';
import { ToastrService } from 'ngx-toastr';
import { IBuyerListByCompanyIdModel } from '../../../../../core/models/globalMaster';

@Component({
  selector: 'app-sup-rfq-transfer',
  templateUrl: './sup-rfq-transfer.component.html',
  styleUrls: ['./sup-rfq-transfer.component.scss']
})
export class SupRfqTransferComponent implements OnInit {
  iBuyerListByCompanyIdModelColl: IBuyerListByCompanyIdModel[];
  iBuyerListByCompanyIdModelcoll2: IBuyerListByCompanyIdModel[];
  selectedContact: string;
  settings = {};
  selectedItems = [];
  conatctId: number;
  isContactSelected: boolean;
  isRecAvailable: boolean;

  constructor(private _rfqService: RfqService, private _toastr: ToastrService) {
    this.selectedContact = '';
    this.isContactSelected = false;
    this.conatctId = 0;
    this.selectedItems = [];
    this.isRecAvailable = false;
    this.iBuyerListByCompanyIdModelColl = [];
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
      return parseInt(localStorage.getItem('loggedCompanyId'));
   }
  ngOnInit() {
    this.selectedItems = [];
    this._rfqService.getBuyerListByCmpnyId(this.loggedId).subscribe(
      result => {
        this.iBuyerListByCompanyIdModelColl = result['data'];
        if (this.iBuyerListByCompanyIdModelColl.length !== 0) {
          this.settings = {
            singleSelection: true,
            text: 'Select manufacturer',
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
          this.isRecAvailable = true;
        }

      },
      error => {
        this._rfqService.handleError(error);
      },
      () => { }
    );
  }
  closePartDrawer() {
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'transferRfq');
  }
  onSelect(item: any) {
    this.conatctId = item.contactId;
    this.isContactSelected = false;
  }
  isPartSaveSubmit() {
    return this.isContactSelected;
  }

  transferRfq() {
    if (this.conatctId === 0) {
      this.isContactSelected = true;
    } else {
      this.isContactSelected = false;
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
