import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialQuoteRequestComponent } from './material.quoterequest.component';
import {MaterialQuoteRequestRoutingModule } from './material.quoterequest.routing.module';
import {SharedModule} from '../../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    MaterialQuoteRequestRoutingModule,
    SharedModule
  ],
  declarations: [MaterialQuoteRequestComponent],
  bootstrap: [MaterialQuoteRequestComponent]
})
export class MaterialQuoteRequestModule { }
