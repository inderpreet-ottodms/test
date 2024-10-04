import { Component, OnInit } from '@angular/core';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { IMyAccountViewModel } from '../../../core/models/supplierProfileModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-global-message-tab',
  templateUrl: './global-message-tab.component.html',
  styleUrls: ['./global-message-tab.component.scss']
})
export class GlobalMessageTabComponent implements OnInit {
  iMyAccountViewModel: IMyAccountViewModel;
  isLoader: boolean;
  isUpgradeModelVisible: boolean;
  isPaidContract: string;
  accountUpgradeMessage: string;
  isupgradeloader: boolean;
  showUpgradeAccountModal: boolean;
  toCont: number = null;
  fromCont: number = null;
  userType: string = '';
  accountType:string = '';
  message: any;
  constructor( private _rfqService: RfqService,  private _supplierService: SupplierService,private _toastr: ToastrService) {
    this.isLoader =  true;
    this.userType = localStorage.getItem('Usertype');
    this.accountType = localStorage.getItem('AccountType')
  }

  ngOnInit() {
    this.iMyAccountViewModel = {
      companyId: 0,
      contactId: 0,
      istrail: true,
      accountType: '',
      membership: '',
      price: 0,
      paymentMethod: '',
      paymentFrequency: '',
      paymentAmount: 0,
      startDate: '0001-01-01T00:00:00',
      endDate: '0001-01-01T00:00:00',
      autoRenewal: false,
      errorMessage: '',
      result: false,
      pageName: 'Global message tab',
      rfqId: 0,
      toAlternateEmailId:''
    };
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'isBuyerMessage');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'messageThreadId');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'supplierProfileDrawer');
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'isBuyerMessageView');
    this.showUpgradeAccountModal = false;
  }

  isSidePanel () {
    return this._rfqService.get('showSidePanel');
  }
  isBuyerMessage () {
    return this._rfqService.get('isBuyerMessage');
  }
  isMessageThreadPanel () {
    return this._rfqService.get('messageThreadDrawer');
  }
  getMessageIdForThread() {
    return this._rfqService.get('messageThreadId');
  }
  isBuyerMiniProfile () {
    return this._rfqService.get('isBuyerMiniProfile');
  }
  isSupplierProfileDrawer() {
    return this._rfqService.get('supplierProfileDrawer');
  }
  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
  }
  isMessageView() {
    return this._rfqService.get('isBuyerMessageView');
  }
  isDirectoryMsgDetails() {
   this.toCont =  this._rfqService.get('toCont');
   this.fromCont = this._rfqService.get('fromCont');
   this.message = this._rfqService.get('message');
    return this._rfqService.get('isDirectoryMsgDetails');
  }
  goBack() {
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(0, 'buyerCurrentProfileCompanyId');
    this._rfqService.set(0, 'buyerCurrentProfileContactId');
  }

  checkAccountUpgradeReqSent() {
    const tempFlag = this._rfqService.get('UpgradeReqFlag');
    if ( tempFlag === true) {
      this.showUpgradeAccountModal = true;
    }
  }
  /* This funtion is used to close the Upgrade account modal */
  closeModal(e) {
    this.showUpgradeAccountModal = false;
    this._rfqService.set(false, 'UpgradeReqFlag');
  }
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  isModelShow() {
    return this._rfqService.get('isModelShow');
  }
  isAssociateMessageDrawer() {
    // this.associateRfqId = parseInt(localStorage.getItem('supplierRfqDetailId'));
    return this._rfqService.get('associateMessageDrawer');
  }
  
  messageSearchText: string = '';
  removeTextValue(inputSearchText) {
    console.log(inputSearchText, 'inputSearchText');
    this.messageSearchText = '';
    // inputSearchText.value = '';
  }
 
   /* This function is used to open the drawer on click */
   openAssociateMessageDrawer() {
    this._rfqService.set(true, 'showSidePanel');
    this._rfqService.set(true, 'associateMessageDrawer');
    this._rfqService.set(false, 'messageDrawer');
    this._rfqService.set(false, 'isPartialQuote');
    this._rfqService.set(false, 'messageThreadDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
    this._rfqService.set(false, 'transferRfq');
    this._rfqService.set(false, 'quoteRfq');
  }
}
