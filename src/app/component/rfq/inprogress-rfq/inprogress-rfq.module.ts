import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { InprogressRfqRoutingModule } from './inprogress-rfq-routing.module';
import { InprogressRfqComponent } from './inprogress-rfq.component';
import { RfqsListComponent } from './components/rfqs-list/rfqs-list.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { RfqDetailSidepanelModule } from '../rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InprogressRfqRoutingModule,
    ConfirmDialogModule,
    DialogModule,
    RfqDetailSidepanelModule,
    RfqWarningBannerModule
  ],
  declarations: [InprogressRfqComponent, RfqsListComponent],
  // exports: [  ]
})
export class InprogressRfqModule { }
