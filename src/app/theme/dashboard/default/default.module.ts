import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import {DefaultRoutingModule} from './default-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { DashActiveRfqComponent } from '../../../component/buyer/component/dash-active-rfq/dash-active-rfq.component';
import { DashNewQuotesComponent } from '../../../component/buyer/component/dash-new-quotes/dash-new-quotes.component';
import { DashTodosComponent } from '../../../component/buyer/component/dash-todos/dash-todos.component';
import { RfqDetailModule } from '../../../component/rfq/rfq-detail/rfq-detail.module';
import { DashMessageComponent } from '../../../component/buyer/component/dash-message/dash-message.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { RfqDetailSidepanelModule } from '../../../component/rfq/rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import { CalendarModule } from 'primeng/calendar';
import { AwardRfqComponent } from './award-rfq/award-rfq.component';
import { RateManufacturesComponent } from './rate-manufactures/rate-manufactures.component';
import { NewManufacturesComponent } from './new-manufactures/new-manufactures.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PartLibraryModule } from '../../../component/part-library/part-library.module';
import { MessageThreadsModule } from '../../../component/message-threads/message-threads.module';
import { MessageThreadDrawerModule } from '../../../component/message-thread-drawer/message-thread-drawer.module';
import { MessageSendDrawerModule } from '../../../component/message-send-drawer/message-send-drawer.module';
import { RegionalAwardingModelModule } from '../../../component/regional-awarding-model/regional-awarding-model.module';
import { RfqWarningBannerModule } from '../../../component/rfq-warning-banner/rfq-warning-banner.module';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SharedModule,
    RfqDetailModule,
    ConfirmDialogModule,
    DialogModule,
    ChartModule,
    RfqDetailSidepanelModule,
    CalendarModule,
    FileUploadModule,
    PartLibraryModule,
    MessageThreadsModule,
    MessageSendDrawerModule,
    MessageThreadDrawerModule,
    RegionalAwardingModelModule,
    RfqWarningBannerModule,
    UcWidgetModule
  ],
  declarations: [DefaultComponent, DashActiveRfqComponent,
     DashNewQuotesComponent, DashTodosComponent,
     DashMessageComponent,
     AwardRfqComponent,
     RateManufacturesComponent,
     NewManufacturesComponent],
  bootstrap: [DefaultComponent]
})
export class DefaultModule { }
