import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAccountNoContractComponent } from './my-account-no-contract.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountNoContractComponent,
    data: {
      title: 'My Account'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountNoContractRoutingModule { }
