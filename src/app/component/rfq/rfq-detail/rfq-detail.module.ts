import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  RfqDetailComponent
} from './rfq-detail.component';
import {
  SharedModule
} from '../../../shared/shared.module';
import {
  FileUploadModule
} from 'ng2-file-upload';
import {
  CalendarModule
} from 'primeng/calendar';
import {
  SelectModule
} from 'ng-select';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import {
  DialogModule
} from 'primeng/dialog';
import {
  RfqDetailRoutingModule
} from './rfq-detail-routing.module';
import {
  RfqTabComponent
} from './components/rfq-tab/rfq-tab.component';
import {
  RfqNdaComponent
} from './components/rfq-nda/rfq-nda.component';
import {
  RfqQuotesComponent
} from './components/rfq-quotes/rfq-quotes.component';
import {
  RfqMessagesComponent
} from './components/rfq-messages/rfq-messages.component';
import {
  RfqRevisionsComponent
} from './components/rfq-revisions/rfq-revisions.component';
import {
  RfqInvoicesComponent
} from './components/rfq-invoices/rfq-invoices.component';
import {
  TransferRfqComponent
} from './components/transfer-rfq/transfer-rfq.component';
import {
  MessageRfqComponent
} from './components/message-rfq/message-rfq.component';
import {
  PhonePipe
} from '../../../shared/customPipe/PhonePipe';

import {
  MessageThreadComponent
} from './components/message-thread/message-thread.component';
import {
  CompareQuotesComponent
} from './components/compare-quotes/compare-quotes.component';
import {
  QuoteSupplierProfileComponent
} from './components/quote-supplier-profile/quote-supplier-profile.component';

import {
  SupplierViewProfileModule
} from '../../buyer/component/supplier-view-profile/supplier-view-profile.module';
import {
  DistributionComponent
} from './components/distribution/distribution.component';
import {
  RfgInsightFilterComponent
} from './components/rfg-insight-filter/rfg-insight-filter.component';
import { RfqAwardModelComponent } from './components/rfq-award-model/rfq-award-model.component';
import { EditorModule } from 'primeng/editor';
import { MessageThreadsModule } from '../../message-threads/message-threads.module';
import { MessageThreadDrawerModule } from '../../message-thread-drawer/message-thread-drawer.module';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { NonMfgQuoteModule } from '../../non-mfg-quote/non-mfg-quote.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { DistributionThreadComponent } from './components/distribution-thread/distribution-thread.component';
import { RfqOrderManagmentComponent } from './components/rfq-order-managment/rfq-order-managment.component';
import { AwardOrderManagmentComponent } from './components/award-order-mangment/award-order-mangment.component';
import { ContactSidePanelComponent } from './components/contact-side-panel/contact-side-panel.component';
import { RfqOrderViewAllComponent } from './components/rfq-order-viewall/rfq-order-viewall.component';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    RfqDetailRoutingModule,
    EditorModule,
    SharedModule,
    FileUploadModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    SelectModule,
    SupplierViewProfileModule,
    MessageThreadsModule,
    MessageSendDrawerModule,
    MessageThreadDrawerModule,
    NonMfgQuoteModule,
    AutoCompleteModule,
    RfqWarningBannerModule
    
  ],
  declarations: [
    RfqDetailComponent,
    RfqTabComponent,
    RfqNdaComponent,
    RfqQuotesComponent,
    RfqMessagesComponent,
    RfqRevisionsComponent,
    RfqInvoicesComponent,
    TransferRfqComponent,
    MessageRfqComponent,
    PhonePipe,
    MessageThreadComponent,
    CompareQuotesComponent,
    QuoteSupplierProfileComponent,
    DistributionComponent,
    RfgInsightFilterComponent,
    RfqAwardModelComponent,
    DistributionThreadComponent,
    RfqOrderManagmentComponent,
    AwardOrderManagmentComponent,
    ContactSidePanelComponent,
    RfqOrderViewAllComponent
    
  ],
  exports: [ QuoteSupplierProfileComponent, TransferRfqComponent,AwardOrderManagmentComponent]
})
export class RfqDetailModule {}
