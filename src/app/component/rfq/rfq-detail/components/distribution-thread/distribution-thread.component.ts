import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DistributionChildAccountsViewModel, DistributionPostModel } from '../../../../../core/models/rfqModel';
import { RfqService } from '../../../../../core/services/rfq/rfq.service';

@Component({
  selector: 'app-distribution-thread',
  templateUrl: './distribution-thread.component.html',
  styleUrls: ['./distribution-thread.component.scss']
})
export class DistributionThreadComponent implements OnInit {

  @Input('rfqId') rfqId;
  @Input('contactId') contactId;
  @Input('companyId') companyId;
  @Output() messageEvent = new EventEmitter();
  @Output() profileEvent = new EventEmitter();
  distributionChildAccountsViewModel: DistributionChildAccountsViewModel;
  isLoader: boolean = true;
  supplierDetails: any = [];
  constructor(private _rfqService: RfqService) { }

  ngOnInit() {
    this.distributionChildAccountsViewModel= {
      rfqId: 0,
      contactId: 0,
      companyId: 0
    };
    this.getManufactureList();
  }

  getManufactureList() {
    this.distributionChildAccountsViewModel.rfqId = this.rfqId;
    this.distributionChildAccountsViewModel.contactId = this.contactId;
    this.distributionChildAccountsViewModel.companyId = this.companyId;
    this.isLoader = true;
    this._rfqService.GetDistributionThreadList(this.distributionChildAccountsViewModel).subscribe(
      result => {
        if (result['result']) {
          this.supplierDetails = result['data'];
          this.isLoader = false;
        } else {
          this.isLoader = false;
          this.supplierDetails = [];
        }

      },
      error => {
        this.isLoader = false;
        this.supplierDetails = [];
       
        
      },
      () => {
        this.isLoader = false;
      }
    );
  }
  openProfilePanel(contactIdEncrypt, companyName){
    let tempObj = {
      contactIdEncrypt:contactIdEncrypt,
      contactName: companyName,
      companyName: companyName
    }
    this.profileEvent.emit(tempObj);
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName, companyId) {
    let tempObj = {
      event:event,
      contactId:contactId,
      rfqId: messageRFQId,
      fromContName: fromContName,
      companyId:companyId
    }
    this.messageEvent.emit(tempObj);
  }
  readMore(e, companyUrl, contactId) {
    e.stopPropagation();
    localStorage.setItem('ViewSupplierProfileId', contactId.toString());
    window.open('#/Public/profile/' + companyUrl, '_blank');
  }
}
