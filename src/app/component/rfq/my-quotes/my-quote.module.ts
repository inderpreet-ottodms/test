import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { MyQuotesRoutingModule } from './my-quote-routing.module';
import { MyQuoteComponent } from './my-quote.component';
import { QoutesRfqListComponent } from './component/qoutes-rfq-list/qoutes-rfq-list.component';
import { RfqDetailModule } from '../../../component/rfq/rfq-detail/rfq-detail.module';
import { RfqDetailSidepanelModule } from '../rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { FormsModule } from '@angular/forms';
import { AwardOrderManagmentComponentQuoteRfqList } from './component/qoutes-rfq-list/award-order-mangment/award-order-mangment.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
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
    AutoCompleteModule
  ],
  declarations: [MyQuoteComponent, QoutesRfqListComponent,AwardOrderManagmentComponentQuoteRfqList],
  exports:[AwardOrderManagmentComponentQuoteRfqList]
})
export class MyQuoteModule { }
