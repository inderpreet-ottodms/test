import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifyRoutingModule } from './verify-routing.module';
import { VerifyComponent } from './verify.component';

@NgModule({
  imports: [
    CommonModule,
    VerifyRoutingModule
  ],
  declarations: [VerifyComponent]
})
export class VerifyModule { }
