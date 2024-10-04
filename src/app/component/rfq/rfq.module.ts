import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import { RfqRoutingModule } from './rfq-routing.module';
import { RfqsComponent } from './open-rfq/rfqs/rfqs.component';
import { RfqCardComponent } from './rfq-card/rfq-card.component';
//import { RfqDetailCardComponent } from './rfq-detail-card/rfq-detail-card.component';

import { BuyerSummaryComponent } from '../buyer-summary/buyer-summary.component';
import { BuyerViewProfileModule } from '../buyer/component/buyer-view-profile/buyer-view-profile.module';
import { MessageSendDrawerModule } from '../message-send-drawer/message-send-drawer.module';
import { RfqWarningBannerModule } from '../rfq-warning-banner/rfq-warning-banner.module';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { myOrderViewAllComponent } from './my-orders/my-order-viewall/my-order-viewall.component';
import { myOrderSupplierProfileComponent } from './my-orders/my-order-supplier-profile/my-order-supplier-profile.component';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    RfqRoutingModule,
    SharedModule,
    RouterModule,
    BuyerViewProfileModule,
    MessageSendDrawerModule,
    RfqWarningBannerModule,
    DragulaModule    
  ],
  declarations: [ 
    MyOrdersComponent, RfqsComponent, RfqCardComponent, myOrderViewAllComponent,BuyerSummaryComponent,myOrderSupplierProfileComponent,
  ]
})

export class RfqModule { }
