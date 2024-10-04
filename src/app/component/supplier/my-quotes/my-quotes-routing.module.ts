import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyQuotesComponent } from './my-quotes.component';
const routes: Routes = [
  {
    path: '',
    component: MyQuotesComponent,
    data: {
      title: 'My Quotes RFQ'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyQuotesRoutingModule { }
