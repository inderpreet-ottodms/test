import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCompanyInvoicesRoutingModule } from './my-company-invoices-routing.module';
import { MyCompanyInvoicesComponent } from './my-company-invoices.component';
import { MqsModule } from '../mqs.module';

@NgModule({
  imports: [
    CommonModule,
    MyCompanyInvoicesRoutingModule,
    MqsModule
  ],
  declarations: [MyCompanyInvoicesComponent]
})
export class MyCompanyInvoicesModule { }
