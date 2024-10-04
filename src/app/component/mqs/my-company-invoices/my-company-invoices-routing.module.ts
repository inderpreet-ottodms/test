import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCompanyInvoicesComponent } from './my-company-invoices.component';

const routes: Routes = [
  {
    path: '',
    component: MyCompanyInvoicesComponent,
    data: {
      title: 'MY Company Invoices'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCompanyInvoicesRoutingModule { }
