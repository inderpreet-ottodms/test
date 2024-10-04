import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyQuotesRoutingModule } from './my-quotes-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { MyQuotesComponent } from './my-quotes.component';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';
@NgModule({
  imports: [
    CommonModule,
    MyQuotesRoutingModule,
    SharedModule ,
    CommonRfqlistModule
  ],
  declarations: [MyQuotesComponent]
})
export class MyQuotesModule { }
