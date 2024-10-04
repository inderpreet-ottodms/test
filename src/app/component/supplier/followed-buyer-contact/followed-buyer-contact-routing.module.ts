import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FollowedBuyerContactComponent} from './followed-buyer-contact.component';

const routes: Routes = [
  {
    path: '',
    component: FollowedBuyerContactComponent,
    data: {
      title: 'Followed Buyer Contact'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowedBuyerContactRoutingModule { }
