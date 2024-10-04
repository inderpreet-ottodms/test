import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialInviteRfqComponent } from './special-invite-rfq.component';
const routes: Routes = [
  {
    path: '',
    component: SpecialInviteRfqComponent,
    data: {
      title: 'Special Invite RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialInviteRfqRoutingModule { }
