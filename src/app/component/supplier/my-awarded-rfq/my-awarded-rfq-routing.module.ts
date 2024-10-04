import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAwardedRfqComponent } from './my-awarded-rfq.component';
const routes: Routes = [
  {
    path: '',
    component: MyAwardedRfqComponent,
    data: {
      // title: 'Follwed Buyer RFQ'
      title: 'Awarded RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAwardedRfqRoutingModule { }
