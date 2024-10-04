import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateComponent } from './validate.component';

const routes: Routes = [
  {
    path: '',
    component: ValidateComponent,
    data: {
      title: 'Create RFQ page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidateRoutingModule { }
