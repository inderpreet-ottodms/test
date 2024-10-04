import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLikedRfqComponent } from './my-liked-rfq.component';
const routes: Routes = [
  {
    path: '',
    component: MyLikedRfqComponent,
    data: {
      title: 'Liked RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyLikedRfqRoutingModule { }
