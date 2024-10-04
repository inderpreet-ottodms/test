import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { MyQuotesRoutingModule } from '../my-quotes/my-quote-routing.module';
import { RfqDetailSidepanelModule } from '../rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import { RfqDetailModule } from '../rfq-detail/rfq-detail.module';
import { RouterModule } from '@angular/router';
import { BuyerViewProfileModule } from '../../buyer/component/buyer-view-profile/buyer-view-profile.module';
import { RfqRoutingModule } from '../rfq-routing.module';
import { SupplierViewProfileModule } from '../../buyer/component/supplier-view-profile/supplier-view-profile.module';
import { MessageThreadsModule } from '../../message-threads/message-threads.module';
import { MessageThreadDrawerModule } from '../../message-thread-drawer/message-thread-drawer.module';
import { SharedModule } from 'primeng/api/shared';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MyQuotesRoutingModule,
    SharedModule,
    RfqDetailModule,
    RfqDetailSidepanelModule,
    MessageSendDrawerModule,
    RfqWarningBannerModule,
    FormsModule,
    FileUploadModule,
    SupplierViewProfileModule,
    MessageThreadsModule,
    MessageThreadDrawerModule,
    RfqRoutingModule,
    RouterModule,
    BuyerViewProfileModule,
    RfqWarningBannerModule
  ]

})
export class MyOrdesrModule { }
