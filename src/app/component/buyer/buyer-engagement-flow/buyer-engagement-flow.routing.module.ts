import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerEngagementFlowComponent } from './buyer-engagement-flow.component';

const routes: Routes = [
  {
    path: '',
    component: BuyerEngagementFlowComponent,
    data: {
      title: 'My Notification'
    }
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerEngagementFlowRoutingModule {}
