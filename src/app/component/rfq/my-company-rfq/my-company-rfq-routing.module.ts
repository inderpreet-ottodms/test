import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyCompanyRfqComponent } from './my-company-rfq.component';

const routes: Routes = [
  {
    path: '',
    component: MyCompanyRfqComponent,
    data: {
      title: 'My Company RFQs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyCompanyRfqRoutingModule { }
