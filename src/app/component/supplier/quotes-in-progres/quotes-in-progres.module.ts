import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotesInProgresRoutingModule } from './quotes-in-progres-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuotesInProgresComponent } from './quotes-in-progres.component';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';

@NgModule({
  imports: [
    CommonModule,
    QuotesInProgresRoutingModule,
    SharedModule,
    CommonRfqlistModule
  ],
  declarations: [QuotesInProgresComponent]
})
export class QuotesInProgresModule { }
