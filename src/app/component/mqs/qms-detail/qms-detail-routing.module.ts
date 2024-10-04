import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QmsDetailComponent } from './qms-detail.component';

const routes: Routes = [
  {
    path: '',
    component: QmsDetailComponent,
    data: {
      title: 'QMS Detail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QmsDetailRoutingModule { }
