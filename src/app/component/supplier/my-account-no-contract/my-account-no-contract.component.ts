import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { SupplierService } from '../../../core/services/supplier/supplier.service';
import { RfqService } from "../../../core/services/rfq/rfq.service";

@Component({
  selector: 'app-my-account-no-contract',
  templateUrl: './my-account-no-contract.component.html',
  styleUrls: ['./my-account-no-contract.component.scss']
})
export class MyAccountNoContractComponent implements OnInit {

  isLoader:boolean=false;
  StripeCustomerId: string;
  accountType: string;
  isSubscription:boolean;
  isTransaction:boolean;
  isIntegration:boolean;
  userDetailsLocation: string;

  constructor(private router: Router,private _SupplierService: SupplierService,private _rfqService: RfqService,) {
    this.isSubscription = true;
    this.isTransaction = false;
    this.isIntegration = false;
    this.userDetailsLocation = localStorage.getItem('manufacturingLocation');
   }
  
  ngOnInit() {
    this.accountType = localStorage.getItem('AccountType');
    console.log("this.userDetailsLocation--------->",this.userDetailsLocation)

   
  }
  getCustomerPortalLogIn() {
    this.StripeCustomerId = localStorage.getItem('StripeCustomerId');
    const invoiceURL = environment.AppUrl +'#/supplier/myAccount';
    if(this.accountType === 'Growth Package' || (this.StripeCustomerId !==null && this.StripeCustomerId !=='')) {
      const dataCustomer = {
        "stripeCustomerId": this.StripeCustomerId,
        "stripeCustomerPortalReturnUrl": invoiceURL
      }
      this._SupplierService.StripeCustomerInfo(dataCustomer).subscribe(
        result1 => {
        console.log('result--->', result1);
         this.router.navigate([]).then(result => {  window.open(result1.data.stripeCustomerPortalRedirectUrl, '_blank'); });
        })}
  }
  onsubscription(){
    this.isSubscription = true;
    this.isTransaction =false;
    this.isIntegration =false;
  }
  ontransaction(){
    this.isTransaction =true;
    this.isSubscription = false;
    this.isIntegration =false;
  }
  onintegration() {
    this.isIntegration =true; 
    this.isTransaction =false;
    this.isSubscription = false;
    this._rfqService.RedirectToReshapeIntegrations(parseInt(localStorage.getItem('LoggedId'))).subscribe((result: any) => {
      let verifyIntegrationURL = "https://" + result;
      window.open(verifyIntegrationURL, "_self");
    });
  }
  verifyStripe() {
    this._rfqService.RedirectToReshapeBilling(parseInt(localStorage.getItem('LoggedId'))).subscribe((result: any) => {
      let verifyStripeURL = "https://" + result;
      window.open(verifyStripeURL, "_self");
    });
  }
}
