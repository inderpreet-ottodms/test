import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { CreateInvoiceRoutingModule } from './create-invoice-routing.module';
import { CreateInvoiceComponent } from './create-invoice.component';
import { CalendarModule } from 'primeng/calendar';
import { InvoicePartComponent } from './invoice-part/invoice-part.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { MqsModule } from '../mqs.module';
import { QmsInvoicePartUpdateComponent } from "../qms-invoice/qms-invoice-part-update/qms-invoice-part-update.component";
@NgModule({
  imports: [
    CommonModule,
    CreateInvoiceRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    CalendarModule,
    MqsModule
  ],
  declarations: [CreateInvoiceComponent, InvoicePartComponent, QmsInvoicePartUpdateComponent]
})
export class CreateInvoiceModule { }
