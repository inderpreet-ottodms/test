import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierMyRfqComponent } from './supplier-my-rfq.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierMyRfqComponent,
    data: {
      title: 'My RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierMyRfqRoutingModule { }
