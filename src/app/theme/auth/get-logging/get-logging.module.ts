import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetLoggingRoutingModule } from './get-logging-routing.module';
import { GetLoggingComponent } from './get-logging.component';

@NgModule({
  imports: [
    CommonModule,
    GetLoggingRoutingModule
  ],
  declarations: [GetLoggingComponent]
})
export class GetLoggingModule { }
