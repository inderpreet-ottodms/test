import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { FollowedBuyerContactRoutingModule } from './followed-buyer-contact-routing.module';
import { FollowedBuyerContactComponent } from './followed-buyer-contact.component';
import { FollwedBuyerContactListComponent } from './component/follwed-buyer-contact-list/follwed-buyer-contact-list.component';
import { RfqDetailModule } from '../../rfq/rfq-detail/rfq-detail.module';
import { BuyerViewProfileModule } from '../../buyer/component/buyer-view-profile/buyer-view-profile.module';
import { MessageSendDrawerModule } from '../../message-send-drawer/message-send-drawer.module';

@NgModule({
  imports: [
    CommonModule,
    FollowedBuyerContactRoutingModule, SharedModule,
    ConfirmDialogModule,
    BuyerViewProfileModule,
    MessageSendDrawerModule
  ],
  declarations: [FollowedBuyerContactComponent, FollwedBuyerContactListComponent]
})
export class FollowedBuyerContactModule { }
