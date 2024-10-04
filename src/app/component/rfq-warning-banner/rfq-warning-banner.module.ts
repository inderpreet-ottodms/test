import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RfqWarningBannerComponent } from './rfq-warning-banner.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [RfqWarningBannerComponent],
  exports: [RfqWarningBannerComponent]
})
export class RfqWarningBannerModule { }
