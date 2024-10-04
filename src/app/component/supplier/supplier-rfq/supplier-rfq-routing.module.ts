import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierRfqComponent } from './supplier-rfq.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierRfqComponent,
    data: {
      title: 'Supplier Rfq'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRfqRoutingModule { }
