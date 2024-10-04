import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import {SharedModule} from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RfqWarningBannerModule } from '../../rfq-warning-banner/rfq-warning-banner.module';
import { UserManagementDrawerComponent } from './user-management-drawer/user-management-drawer.component';

@NgModule({
  imports: [
    CommonModule,
    UserManagementRoutingModule,
     DialogModule,
     ConfirmDialogModule,
     FormsModule ,
     ReactiveFormsModule ,
     ConfirmDialogModule,
     SharedModule,
     RfqWarningBannerModule
  ],
  declarations: [UserManagementComponent, UserManagementDrawerComponent]
})
export class UserManagementModule { }
