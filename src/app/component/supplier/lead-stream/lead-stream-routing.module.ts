import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadStreamComponent } from './lead-stream.component';

const routes: Routes = [
  {
    path: '',
    component: LeadStreamComponent,
    data: {
      title: 'LeadStream'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadStreamRoutingModule { }
