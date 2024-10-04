


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

import { GlobalNotificationTabComponent } from './global-notification-tab.component';
import { GlobalNotificationTabRoutingModule } from './global-notification-tab-routing.module';
import { CommonNotificationComponent } from './component/common-notification/common-notification.component';
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
import { RfqDetailModule } from '../../rfq/rfq-detail/rfq-detail.module';




@NgModule({
  imports: [
    CommonModule,
    EditorModule,
    ConfirmDialogModule,
    DialogModule,
    SharedModule,
    BuyerViewProfileModule,
    FileUploadModule,
    AssociateMessageDrawerModule,
    MessageThreadsModule,
    MessageSendDrawerModule,
    MessageThreadDrawerModule,
    RfqWarningBannerModule,
    AssociateMessageDrawerModule,
    GlobalNotificationTabRoutingModule,
    RfqDetailModule
  ],
  declarations: [GlobalNotificationTabComponent, CommonNotificationComponent],
  providers: [ConfirmationService]
})
export class GlobalNotificationTabModule { }