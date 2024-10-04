import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FollwedBuyerRfqComponent } from './follwed-buyer-rfq.component';
const routes: Routes = [
  {
    path: '',
    component: FollwedBuyerRfqComponent,
    data: {
      title: 'Followed Buyer RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollwedBuyerRfqRoutingModule { }
