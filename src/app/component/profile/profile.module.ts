import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ConfirmDialogModule
  ],
  declarations: []
})
export class ProfileModule { }
