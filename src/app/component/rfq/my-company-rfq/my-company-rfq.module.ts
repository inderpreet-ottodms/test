import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  MyCompanyRfqComponent
} from './my-company-rfq.component';
import {
  MyCompanyRfqRoutingModule
} from './my-company-rfq-routing.module';
import {
  RfqDetailSidepanelModule
} from '../rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import {
  SharedModule
} from '../../../shared/shared.module';
import {
  ConfirmDialogModule
} from 'primeng/confirmdialog';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';

@NgModule({
  imports: [
    CommonModule,
    MyCompanyRfqRoutingModule,
    RfqDetailSidepanelModule,
    SharedModule,
    ConfirmDialogModule,
    RfqWarningBannerModule
  ],
  declarations: [MyCompanyRfqComponent]
})
export class MyCompanyRfqModule {}
