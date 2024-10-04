import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SupplierViewsComponent} from '../supplier-views/supplier-views.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierViewsComponent,
    data: {
      title: 'Manufacturer Views'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierViewsRoutingModule { }
