import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import {
  DialogModule
} from 'primeng/dialog';
import {
  EditorModule
} from 'primeng/editor';
import {
  FileUploadModule
} from 'ng2-file-upload';
import {
  SharedModule
} from '../../../shared/shared.module';
import {
  SupRfqMessagesComponent
} from './component/sup-rfq-messages/sup-rfq-messages.component';
import {
  GlobalMessageTabComponent
} from './global-message-tab.component';
import {
  GlobalMessageTabRoutingModule
} from './global-message-tab-routing.module';
import {
  BuyerViewProfileModule
} from '../../buyer/component/buyer-view-profile/buyer-view-profile.module';
import {
  AssociateMessageDrawerModule
} from '../../associate-message-drawer/associate-message-drawer.module';
import { MessageThreadsModule } from '../../message-threads/message-threads.module';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { MessageThreadDrawerModule } from '../../message-thread-drawer/message-thread-drawer.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { ConfirmationService } from 'primeng/api';
import { SendMessageEditorComponent } from './component/send-message-editor/send-message-editor.component';
import { CommonMessageComponent } from './component/common-message/common-message.component';
import { RfqDetailModule } from '../../rfq/rfq-detail/rfq-detail.module';
import { LeadStreamModule } from '../../supplier/lead-stream/lead-stream.module';

@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    ConfirmDialogModule,
    DialogModule,
    SharedModule,
    GlobalMessageTabRoutingModule,
    BuyerViewProfileModule,
    FileUploadModule,
    AssociateMessageDrawerModule,
    MessageThreadsModule,
    MessageSendDrawerModule,
    MessageThreadDrawerModule,
    RfqWarningBannerModule,
    AssociateMessageDrawerModule,
    RfqDetailModule,
    LeadStreamModule
  ],
  declarations: [GlobalMessageTabComponent, SupRfqMessagesComponent, CommonMessageComponent, SendMessageEditorComponent, ],
  providers: [ConfirmationService]
})
export class GlobalMessageTabModule {}
