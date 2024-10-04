import { Component, OnInit, OnDestroy } from '@angular/core';
import { RfqService } from '../../../../core/services/rfq/rfq.service';
import { BuyerService } from '../../../../core/services/buyer/buyer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-manufactures',
  templateUrl: './new-manufactures.component.html',
  styleUrls: ['./new-manufactures.component.scss']
})
export class NewManufacturesComponent implements OnInit, OnDestroy {

  manufactureList: any = [];
  profileSubscribe: any;
  messageSubscribe: any;
  manufactureDetails: any = {
      buyerId: 0,
      buyerCompanyId: 0,
      supplierId: 0,
      isMessageSent: false,
      isProfileViewed: false
  };
  loader: boolean = false;

  constructor(private _rfqService: RfqService, private _buyerService: BuyerService, private _toastr: ToastrService) { }

  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  ngOnInit() {
    this.manufactureDetails.buyerId = this.loggedId;
    this.manufactureDetails.buyerCompanyId = this.loggedCompanyId;
    this.getNewManufactureList();
    this.profileSubscribe = this._buyerService.getProfileEvent().subscribe(
      response => {
        if(response === true){
          // debugger;
          this.getNewManufactureList();
          this.setViewStatus();
          this._buyerService.setProfileEvent(false);
        }
      }
    );
    this.messageSubscribe = this._buyerService.getMessageEvent().subscribe(
      response => {
        if(response === true){
          // debugger;
          this.getNewManufactureList();
          this.setViewStatus();
          this._buyerService.setMessageEvent(false);
        }
      }
    );
  }
  setViewStatus(){
    console.log('model', this.manufactureDetails);
    if( this.manufactureDetails !== 0 ){
      this._buyerService.setViewStatus(this.manufactureDetails).subscribe(
        response => {
          console.log('response', response);
          if(!response.isError){
              this.getNewManufactureList();
          }
        }
      );
    }
    this.manufactureDetails = {
      buyerId: this.loggedId,
      buyerCompanyId:this.loggedCompanyId,
      supplierId: 0,
      isMessageSent: false,
      isProfileViewed: false
  };
  }
  getNewManufactureList(){
    this.loader = true;
    this.manufactureList=[];
    this._buyerService.getManufactureList(this.loggedId).subscribe(
      response => {
        if(!response.isError && response.data !== null && response.data !== undefined && response.data.length){
          this.manufactureList = response.data;
        }
        this.loader = false;
      },
      error => {
        this.loader = false;
        this.manufactureList = [];
      }
    );
  }
  openMessageDrawer(event, contactId, messageRFQId, fromContName) {
    if (localStorage.getItem('isEmailVerify') == 'false') {
      this._toastr.warning("Please verify your email.", 'Warning');
      return;
    }
    event.stopPropagation();
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'partLibraryDrawer');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'messageRfq');
    this._rfqService.set(fromContName, 'nameOfBuyer');
    this._rfqService.set(contactId, 'selectContactIdsForMEessage');
    this._rfqService.set(messageRFQId, 'selectContactRFQId');
    this.manufactureDetails.supplierId = contactId;
    this.manufactureDetails.isMessageSent = true;
  }
  openProfileDrawer(contactId, contactName, companyName, supplierId) {
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'messageRfq');
    this._rfqService.set(false, 'partLibraryDrawer');
    setTimeout(() => {
      this._rfqService.set(true, 'showSidePanel');
      this._rfqService.set(true, 'supplierProfileDrawer');
      this._rfqService.set(contactId, 'quoteContactId');
      this._rfqService.set(contactName, 'quoteContactName');
      this._rfqService.set(companyName, 'quoteCompanyName');
    }, 500);
    this.manufactureDetails.supplierId = supplierId;
    this.manufactureDetails.isProfileViewed = true;
  }
  ngOnDestroy(){
    this.profileSubscribe.unsubscribe();
    this.messageSubscribe.unsubscribe();
  }
}
