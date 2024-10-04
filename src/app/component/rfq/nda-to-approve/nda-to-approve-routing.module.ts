import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NdaToApproveComponent } from './nda-to-approve.component';

const routes: Routes = [
  {
    path: '',
    component: NdaToApproveComponent,
    data: {
      // tslint:disable-next-line:quotemark
      title: "NDAs To Approve"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NdaToApproveRoutingModule { }
