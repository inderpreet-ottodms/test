import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOrdersComponent } from './my-orders.component';

const routes: Routes = [
  {
    path: '',
    component: MyOrdersComponent,
    data: {
      title: 'my orders'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCompanyRfqRoutingModule { }
