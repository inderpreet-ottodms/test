import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserInviteComponent} from '../user-invite/user-invite.component';
const routes: Routes = [
  {
    path: '',
    component: UserInviteComponent,
    data: {
      title: 'UserInvite'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserInviteRoutingModule { }
