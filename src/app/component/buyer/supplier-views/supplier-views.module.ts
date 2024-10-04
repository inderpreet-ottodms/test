import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierViewsRoutingModule } from './supplier-views-routing.module';
import { RfqDetailModule } from '../../rfq/rfq-detail/rfq-detail.module';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {CalendarModule} from 'primeng/calendar';
import { SupplierViewProfileModule } from '../component/supplier-view-profile/supplier-view-profile.module';
import { SupplierViewsComponent } from './supplier-views.component';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';

@NgModule({
  imports: [
    CommonModule,
    SupplierViewsRoutingModule,
    DialogModule,
    RfqDetailModule,
    SharedModule,
    ConfirmDialogModule,
    CalendarModule,
    SupplierViewProfileModule,
    MessageSendDrawerModule,
    RfqWarningBannerModule
  ],
  declarations: [SupplierViewsComponent]
})
export class SupplierViewsModule { }
