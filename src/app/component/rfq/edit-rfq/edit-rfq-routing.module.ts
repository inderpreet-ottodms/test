import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditRfqComponent } from './edit-rfq.component';
import { DeactivateGuardGuard } from '../../../shared/decativeguard/deactivate-guard.guard';
const routes: Routes = [
  {
    path: '',
    component: EditRfqComponent,
    // canDeactivate:[DeactivateGuardGuard],
    data: {
      title: 'Create an RFQ page'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRfqRoutingModule { }
