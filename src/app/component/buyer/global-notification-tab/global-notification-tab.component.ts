import { Component, OnInit } from '@angular/core';
import { RfqService } from '../../../core/services/rfq/rfq.service';
import { IMyAccountViewModel } from '../../../core/models/supplierProfileModel';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global-notification-tab',
  templateUrl: './global-notification-tab.component.html',
  styleUrls: ['./global-notification-tab.component.scss']
})
export class GlobalNotificationTabComponent implements OnInit {
  iMyAccountViewModel: IMyAccountViewModel;
  isLoader: boolean;
  isUpgradeModelVisible: boolean;
  isPaidContract: string;
  accountUpgradeMessage: string;
  isupgradeloader: boolean;
  showUpgradeAccountModal: boolean;
  

  constructor(private router: Router,private _rfqService: RfqService,  private _supplierService: SupplierService,private _toastr: ToastrService) {
    this.isLoader =  true;
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
    this.showUpgradeAccountModal = false;
  }

  isSidePanel () {
    return this._rfqService.get('showSidePanel');
  }
   
  isBuyerMiniProfile () {
    return this._rfqService.get('isBuyerMiniProfile');
  }

  isBuyerCommpleteProfile() {
    return this._rfqService.get('isBuyerCommpleteProfile');
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
 
  isSupplierProfileDrawer() {
    return this._rfqService.get('supplierProfileDrawer');
  }
 

    
  get loggedId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('LoggedId'));
  }
  get loggedCompanyId() {
    // tslint:disable-next-line:radix
    return parseInt(localStorage.getItem('loggedCompanyId'));
  }
  notificationSearchText: string = '';
  removeTextValue(inputSearchText) {
    console.log(inputSearchText, 'inputSearchText');
    this.notificationSearchText = '';
    // inputSearchText.value = '';
  }

  goBack() {
    let isManufSelectType = localStorage.getItem('isManufSelectType');
    let backToPreviousPage = localStorage.getItem('urlToRedirect');
    localStorage.removeItem('pageName1');
    this.router.navigate(['/globalNotification']);
    this._rfqService.set(false, 'isBuyerCommpleteProfile');
    this._rfqService.set(false, 'showSidePanel');
    this._rfqService.set(false, 'rfqDetailDrawer');
    this._rfqService.set(false, 'isBuyerMiniProfile');
  }
}
