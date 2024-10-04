import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InprogressRfqComponent } from './inprogress-rfq.component';

const routes: Routes = [
  {
    path: '',
    component: InprogressRfqComponent,
    data: {
      title: 'Draft RFQs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InprogressRfqRoutingModule { }

