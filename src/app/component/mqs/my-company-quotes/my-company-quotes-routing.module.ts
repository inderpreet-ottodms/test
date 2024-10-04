import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCompanyQuotesComponent } from './my-company-quotes.component';

const routes: Routes = [
  {
    path: '',
    component: MyCompanyQuotesComponent,
    data: {
      title: 'MY Company Quotes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCompanyQuotesRoutingModule { }
