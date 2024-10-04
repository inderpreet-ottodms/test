import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfqDetailSidepanelComponent } from './rfq-detail-sidepanel.component';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    SharedModule
  ],
  declarations: [
    RfqDetailSidepanelComponent
  ],
  exports: 
  [
    RfqDetailSidepanelComponent
  ]
})
export class RfqDetailSidepanelModule { }
