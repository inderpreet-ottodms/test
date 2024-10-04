import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { MqsRoutingModule } from './mqs-routing.module';
import { MyCustomerDrawerComponent } from './my-customer-drawer/my-customer-drawer.component';
import { QuoteReviewDrawerComponent } from './quote-review-drawer/quote-review-drawer.component';
import { QmsPdfComponent } from './qms-pdf/qms-pdf.component';
import { CommonQmsComponent } from './common-qms/common-qms.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageTabDrawerComponent } from './message-tab-drawer/message-tab-drawer.component';
import { CommonInvoiceComponent } from './common-invoice/common-invoice.component';
import { InvoicePdfComponent } from './invoice-pdf/invoice-pdf.component';
import { InvoicePreviewDrawerComponent } from './invoice-preview-drawer/invoice-preview-drawer.component';
import { QmscontactInfoViewerComponent } from './invoice-pdf/qmscontact-info-viewer/qmscontact-info-viewer.component';
import { MessageSendNewDrawerComponent } from './message-send-new-drawer/message-send-new-drawer.component';
import { FileUploadModule } from 'ng2-file-upload';
import { QmsInvoiceSpecialFeeComponent } from './qms-invoice/qms-invoice-special-fee/qms-invoice-special-fee.component';


@NgModule({
  imports: [
    CommonModule,
    MqsRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    FileUploadModule
  ],
  declarations: [MyCustomerDrawerComponent, QuoteReviewDrawerComponent, QmsPdfComponent, CommonQmsComponent, MessageTabDrawerComponent, CommonInvoiceComponent, InvoicePdfComponent, InvoicePreviewDrawerComponent, QmscontactInfoViewerComponent, MessageSendNewDrawerComponent, QmsInvoiceSpecialFeeComponent],
  exports: [MyCustomerDrawerComponent, QuoteReviewDrawerComponent, CommonInvoiceComponent,InvoicePdfComponent,
    QmsPdfComponent, CommonQmsComponent, MessageTabDrawerComponent, MessageSendNewDrawerComponent, QmsInvoiceSpecialFeeComponent]
})
export class MqsModule { }

