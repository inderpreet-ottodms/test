import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyQuoteComponent } from './my-quote.component';
const routes: Routes = [
  {
    path: '',
    component: MyQuoteComponent,
    data: {
      title: 'My Quotes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyQuotesRoutingModule { }
