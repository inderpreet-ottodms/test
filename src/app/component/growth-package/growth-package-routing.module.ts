import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrowthPackageComponent } from './growth-package.component';

const routes: Routes = [
  {
    path: '',
    component: GrowthPackageComponent,
    data: {
      title: 'packages',
      status: true
    },
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrowthPackageRoutingModule { }
