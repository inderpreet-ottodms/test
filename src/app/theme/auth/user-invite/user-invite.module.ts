import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import { UserInviteRoutingModule } from './user-invite-routing.module';
import { UserInviteComponent } from './user-invite.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
  imports: [
    CommonModule,
    UserInviteRoutingModule,
    SharedModule ,
    ConfirmDialogModule
  ],
  declarations: [UserInviteComponent]
})
export class UserInviteModule { }
