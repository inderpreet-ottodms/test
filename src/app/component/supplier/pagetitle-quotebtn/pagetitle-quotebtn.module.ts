import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { PagetitleQuotebtnRoutingModule } from './pagetitle-quotebtn-routing.module';
// import { PagetitleQuotebtnComponent } from './pagetitle-quotebtn.component';

@NgModule({
  imports: [
    CommonModule,
    PagetitleQuotebtnRoutingModule,
    SharedModule
  ],
  declarations: []
})
export class PagetitleQuotebtnModule { }
