import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerContactComponent } from './buyer-contact.component';

const routes: Routes = [
  {
    path: '',
    component: BuyerContactComponent,
    data: {
      title: 'My Contacts'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerContactRoutingModule { }
