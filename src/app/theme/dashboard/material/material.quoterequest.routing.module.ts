import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MaterialQuoteRequestComponent} from './material.quoterequest.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialQuoteRequestComponent,
    data: {
      title: 'Supplier',
      icon: 'ti-home',
      status: false
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialQuoteRequestRoutingModule { }
