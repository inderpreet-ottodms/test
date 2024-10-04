import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupplierProfileComponent } from './supplier-profile.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierProfileComponent,
    data: {
      title: 'Supplier Profile'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierProfileRoutingModule { }
