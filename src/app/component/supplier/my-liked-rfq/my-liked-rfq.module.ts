import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { MyLikedRfqRoutingModule } from './my-liked-rfq-routing.module';
import { MyLikedRfqComponent } from './my-liked-rfq.component';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';

@NgModule({
  imports: [
    CommonModule,
    MyLikedRfqRoutingModule,
    SharedModule,
    CommonRfqlistModule
  ],
  declarations: [MyLikedRfqComponent]
})
export class MyLikedRfqModule { }
