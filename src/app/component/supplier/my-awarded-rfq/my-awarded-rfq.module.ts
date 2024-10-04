import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAwardedRfqRoutingModule } from './my-awarded-rfq-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { MyAwardedRfqComponent } from './my-awarded-rfq.component';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';
@NgModule({
  imports: [
    CommonModule,
    MyAwardedRfqRoutingModule,
    SharedModule,
    CommonRfqlistModule
  ],
  declarations: [MyAwardedRfqComponent]
})
export class MyAwardedRfqModule { }
