import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';

import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
@NgModule({
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    SharedModule
  ],
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
