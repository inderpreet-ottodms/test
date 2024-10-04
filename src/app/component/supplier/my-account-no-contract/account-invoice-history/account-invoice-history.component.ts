import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../../core/services/supplier/supplier.service';

@Component({
  selector: 'app-account-invoice-history',
  templateUrl: './account-invoice-history.component.html',
  styleUrls: ['./account-invoice-history.component.scss']
})
export class AccountInvoiceHistoryComponent implements OnInit {
  billingInfoViewModel:any = []; 
  nextBillingDate: any = "";
  toShowExtraInfo: boolean = false;
  isLoader: boolean = false;
  constructor(private _SupplierService: SupplierService, private _toastr: ToastrService) { }

  ngOnInit() {
    this.getBillingInfoSubscriptionInvoices();
    // this.getNextBillingDate();
  }
  getMoreBillingList(){
    this.toShowExtraInfo = ! this.toShowExtraInfo;
  }
  get loggedEncryptId() {
    return localStorage.getItem('LoggedIdEncript');
  }
  getBillingInfoSubscriptionInvoices(){
    let obj = {
        "id": this.loggedEncryptId,
        "loggedInId": 0
    }
    
    this._SupplierService.getBillingInfoSubscriptionInvoices(obj).subscribe(
      response=>{
        if(!response.isError){
           this.nextBillingDate = response.data.nextBillingDate;
          this.billingInfoViewModel = response.data.subscriptionInvoicesList;
          //this.nextBillingDate = response.data.nextBillingDate;
        } else {
          this._toastr.error(response.message, 'Error!');
        }
      }
    );
  }

  getNextBillingDate()
  {
    let _supplierId =localStorage.getItem('LoggedIdEncript');
    this._SupplierService.getNextInvoicePaymentDate(_supplierId).subscribe(
        response=>{
          if(!response.isError){
            //this.billingInfoViewModel = response.data.subscriptionInvoicesList;
            this.nextBillingDate = response.data.nextInvoiceDate;
          } else {
            this._toastr.error(response.message, 'Error!');
          }
        }
      );
  }
  

  downloadInvoicePdf(filelink){
    this.isLoader = true;
    let fileName = null;
    if (filelink) {
      if (/(iP)/g.test(navigator.userAgent)) {
        // alert('Your device does not support files downloading. Please try again in desktop browser.');
        window.open(filelink, '_blank');
      }
      // If in Chrome or Safari - download via virtual link click
      const link = document.createElement('a');
      link.href = filelink;
      link.setAttribute('target', '_blank');

      if (link.download !== undefined) {
        // Set HTML5 download attribute. This will prevent file from opening if supported.
        fileName = filelink.substring(filelink.lastIndexOf('/') + 1, filelink.length);
        link.download = fileName;
      }
      // Dispatching click event.
      if (document.createEvent) {
        const e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
      }
      this.isLoader = false;
    }
  }
}
