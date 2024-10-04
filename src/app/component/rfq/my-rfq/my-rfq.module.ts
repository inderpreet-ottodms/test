import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  CalendarModule
} from 'primeng/calendar';
import {
  SharedModule
} from '../../../shared/shared.module';
import {
  MyRfqRoutingModule
} from './my-rfq-routing.module';
import {
  MyRfqComponent
} from './my-rfq.component';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import {
  RfqListComponent
} from './components/rfq-list/rfq-list.component';
import {
  DialogModule
} from 'primeng/dialog';
import {
  RfqDetailSidepanelModule
} from '../rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';

@NgModule({
  imports: [
    CommonModule,
    MyRfqRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    DialogModule,
    RfqDetailSidepanelModule,
    CalendarModule,
    RfqWarningBannerModule
  ],
  declarations: [MyRfqComponent, RfqListComponent]
})
export class MyRfqModule {}
