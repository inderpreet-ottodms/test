import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { MarkForQuotingRoutingModule } from './mark-for-quoting-routing.module';
import { MarkForQuotingComponent } from './mark-for-quoting.component';
import { RfqQuotingListComponent } from './components/rfq-quoting-list/rfq-quoting-list.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { RfqDetailSidepanelModule } from '../rfq-detail-sidepanel/rfq-detail-sidepanel.module';
import { CalendarModule } from 'primeng/calendar';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';

@NgModule({
  imports: [
    CommonModule,
    MarkForQuotingRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    DialogModule,
    RfqDetailSidepanelModule,
    CalendarModule,
    RfqWarningBannerModule
  ],
  declarations: [MarkForQuotingComponent, RfqQuotingListComponent]
})
export class MarkForQuotingModule { }
