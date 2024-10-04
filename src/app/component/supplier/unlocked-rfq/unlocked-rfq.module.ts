import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonRfqlistModule } from '../../buyer/component/common-rfqlist/common-rfqlist.module';
import { UnlockedRfqComponent } from './unlocked-rfq.component';



@NgModule({
  declarations: [UnlockedRfqComponent],
  imports: [
    CommonModule,
    CommonRfqlistModule
  ]
})
export class UnlockedRfqModule { }
