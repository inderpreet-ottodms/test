import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';

import { FollwedBuyerRfqRoutingModule } from './follwed-buyer-rfq-routing.module';
import {  FollwedBuyerRfqComponent} from './follwed-buyer-rfq.component';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';
@NgModule({
  imports: [
    CommonModule,
    FollwedBuyerRfqRoutingModule,
    SharedModule,
    CommonRfqlistModule
  ],
  declarations: [FollwedBuyerRfqComponent]
})
export class FollwedBuyerRfqModule { }
