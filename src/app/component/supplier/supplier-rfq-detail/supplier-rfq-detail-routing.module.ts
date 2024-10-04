import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierRfqDetailComponent } from './supplier-rfq-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierRfqDetailComponent,
    data: {
      // title: 'Supplier Rfq Detail'
      title: 'RFQ Detail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRfqDetailRoutingModule { }
