import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerContactRoutingModule } from './buyer-contact-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { BuyerContactComponent } from './buyer-contact.component';
import { BuyerContactListComponent } from './components/buyer-contact-list/buyer-contact-list.component';
import { RfqDetailModule } from '../../rfq/rfq-detail/rfq-detail.module';

import { SupplierViewProfileModule } from '../component/supplier-view-profile/supplier-view-profile.module';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
@NgModule({
  imports: [
    CommonModule,
    BuyerContactRoutingModule,
    SharedModule,
    ConfirmDialogModule,
    RfqDetailModule,
    SupplierViewProfileModule,
    MessageSendDrawerModule,
    RfqWarningBannerModule
  ],
  declarations: [BuyerContactComponent, BuyerContactListComponent]
})
export class BuyerContactModule { }
