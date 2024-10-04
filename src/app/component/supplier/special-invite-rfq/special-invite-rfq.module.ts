import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialInviteRfqRoutingModule } from './special-invite-rfq-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SpecialInviteRfqComponent } from './special-invite-rfq.component';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';
@NgModule({
  imports: [
    CommonModule,
    SpecialInviteRfqRoutingModule,
    SharedModule,
    CommonRfqlistModule
  ],
  declarations: [SpecialInviteRfqComponent]
})
export class SpecialInviteRfqModule { }
