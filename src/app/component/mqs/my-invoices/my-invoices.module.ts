import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyInvoicesRoutingModule } from './my-invoices-routing.module';
import { MyInvoicesComponent } from './my-invoices.component';
import { MqsModule } from '../mqs.module';
@NgModule({
  imports: [
    CommonModule,
    MyInvoicesRoutingModule,
    MqsModule
  ],
  declarations: [MyInvoicesComponent]
})
export class MyInvoicesModule { }
