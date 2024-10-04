import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MagicLeadRoutingModule } from './magic-lead-routing.module';
import { MagicLeadComponent } from './magic-lead.component';
import { BuyerViewProfileModule } from '../buyer/component/buyer-view-profile/buyer-view-profile.module';
import { MessageSendDrawerModule } from '../message-send-drawer/message-send-drawer.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ConfirmDialogModule,
    MagicLeadRoutingModule,
    BuyerViewProfileModule,
    MessageSendDrawerModule
  ],
  declarations: [MagicLeadComponent]
})
export class MagicLeadModule { }
