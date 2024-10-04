import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActiveQuotesComponent } from './active-quotes.component';
const routes: Routes = [
  {
    path: '',
    component: ActiveQuotesComponent,
    data: {
      title: 'Active Quotes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveQuotesRoutingModule { }
