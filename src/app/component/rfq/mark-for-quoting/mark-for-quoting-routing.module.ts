import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkForQuotingComponent } from './mark-for-quoting.component';

const routes: Routes = [
  {
    path: '',
    component: MarkForQuotingComponent,
    data: {
      title: 'Marked For Quoting RFQs'
      // title: 'My Quoted RFQs'
    }
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkForQuotingRoutingModule { }
