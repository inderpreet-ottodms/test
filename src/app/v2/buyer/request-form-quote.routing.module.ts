import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestFormQuoteComponent } from './request-form-quote.component';
import { RequestFormQuoteCanDeactivateGuard } from './request-form-quote.candeactivateguard';

const routes: Routes = [
  {
    path: '',
    component: RequestFormQuoteComponent,
    data: {
      title: 'Buyer RFQ',
      status: false
    }, 
    canDeactivate: [RequestFormQuoteCanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestFormQuoteRoutingModule { }
