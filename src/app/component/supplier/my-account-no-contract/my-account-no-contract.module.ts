import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountNoContractRoutingModule } from './my-account-no-contract-routing.module';
import { MyAccountNoContractComponent } from './my-account-no-contract.component';
import { SharedModule } from '../../../shared/shared.module';
import { AccountPlanDetailComponent } from './account-plan-detail/account-plan-detail.component';
import { AccountInvoiceHistoryComponent } from './account-invoice-history/account-invoice-history.component';
import { AccountPaymentDetailsComponent } from './account-payment-details/account-payment-details.component';

@NgModule({
  imports: [
    CommonModule,
    MyAccountNoContractRoutingModule,
    SharedModule
  ],
  declarations: [MyAccountNoContractComponent, AccountPlanDetailComponent, AccountInvoiceHistoryComponent, AccountPaymentDetailsComponent]
})
export class MyAccountNoContractModule { }
