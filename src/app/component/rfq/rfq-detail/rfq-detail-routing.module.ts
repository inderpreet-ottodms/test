import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RfqDetailComponent } from './rfq-detail.component';
const routes: Routes = [
  {
    path: '',
    component: RfqDetailComponent,
    data: {
      title: 'Rfq Detail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RfqDetailRoutingModule { }
