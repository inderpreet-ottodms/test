import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  SupplierRfqDetailRoutingModule
} from './supplier-rfq-detail-routing.module';
import {
  SharedModule
} from '../../../shared/shared.module';
import {
  FileUploadModule
} from 'ng2-file-upload';
import {
  MessageBuyerComponent
} from '../../../component/buyer/component/message-buyer/message-buyer.component';
import {
  SupplierRfqDetailComponent
} from './supplier-rfq-detail.component';
import {
  PartialQuotingComponent
} from './component/partial-quoting/partial-quoting.component';
import {
  SupRfqDetailComponent
} from './component/sup-rfq-detail/sup-rfq-detail.component';
import {
  SupRfqQuotesComponent
} from './component/sup-rfq-quotes/sup-rfq-quotes.component';
import {
  SupRfqMessagesComponent
} from './component/sup-rfq-messages/sup-rfq-messages.component';
import {
  SupRfqRevisionComponent
} from './component/sup-rfq-revision/sup-rfq-revision.component';
import {
  CalendarModule
} from 'primeng/calendar';
import {
  SupRfqTransferComponent
} from './component/sup-rfq-transfer/sup-rfq-transfer.component';
import {
  MessageThreadComponent
} from './component/message-thread/message-thread.component';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import {
  DialogModule
} from 'primeng/dialog';
import {
  BuyerViewProfileModule
} from '../../buyer/component/buyer-view-profile/buyer-view-profile.module';
import {
  SupAwardedComponent
} from './component/sup-awarded/sup-awarded.component';
import {
  SupRfqShopiqComponent
} from './component/sup-rfq-shopiq/sup-rfq-shopiq.component';
import {
  AssociateMessageDrawerModule
} from '../../associate-message-drawer/associate-message-drawer.module';
import { EditorModule } from 'primeng/editor';
import { MessageThreadsModule } from '../../message-threads/message-threads.module';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { SupFilesComponent } from './component/sup-files/sup-files.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRfqDetailRoutingModule,
    EditorModule,
    SharedModule,
    FileUploadModule,
    ConfirmDialogModule,
    CalendarModule,
    BuyerViewProfileModule,
    DialogModule,
    AssociateMessageDrawerModule,
    MessageThreadsModule,
    MessageSendDrawerModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    SupplierRfqDetailComponent, 
    PartialQuotingComponent, 
    SupRfqDetailComponent, 
    SupRfqQuotesComponent, 
    SupRfqMessagesComponent, 
    SupRfqRevisionComponent, 
    MessageThreadComponent,
    SupRfqTransferComponent, 
    MessageBuyerComponent, 
    SupAwardedComponent, 
    SupRfqShopiqComponent,
    SupFilesComponent,
  ]

})
export class SupplierRfqDetailModule {}
