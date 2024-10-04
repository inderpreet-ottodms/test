import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MagicLeadComponent } from './magic-lead.component';

const routes: Routes = [
  {
    path: '',
    component: MagicLeadComponent,
    data: {
      title: 'MagicLead'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MagicLeadRoutingModule { }
