import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyRfqComponent } from './my-rfq.component';

const routes: Routes = [
  {
    path: '',
    component: MyRfqComponent,
    data: {
      title: 'My RFQs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyRfqRoutingModule { }
