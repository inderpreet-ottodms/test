import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateInvoiceComponent } from './create-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: CreateInvoiceComponent,
    data: {
      title: 'Create Invoice'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateInvoiceRoutingModule { }
